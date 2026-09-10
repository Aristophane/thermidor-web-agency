import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { randomBytes } from 'node:crypto';
import { mkdir, writeFile, unlink } from 'node:fs/promises';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
import { hashPassword } from '../src/security.js';

const exec = promisify(execFile);
const id = randomBytes(6).toString('hex');
const image = 'thermidor:coolify-check';
const containers = [], volumes = [];
const dataVolume = `thermidor-check-${id}-data`, mediaVolume = `thermidor-check-${id}-media`;
const envPath = resolve(`artifacts/docker-check-${id}.env`);
const testEnv = {
  BASE_URL: 'https://thermidor.example',
  ADMIN_EMAIL: 'docker-check@example.com',
  ADMIN_PASSWORD_HASH: await hashPassword(randomBytes(24).toString('hex')),
  SESSION_SECRET: randomBytes(32).toString('hex'),
  NODE_ENV: 'production', HOST: '0.0.0.0', PORT: '3000', TRUST_PROXY: '1',
  DATABASE_PATH: '/app/data/thermidor.sqlite', UPLOAD_DIR: '/app/public/uploads'
};
const docker = async (...args) => {
  const { stdout } = await exec('docker', args, { windowsHide: true, maxBuffer: 8 * 1024 * 1024, timeout: 600000, env: { ...process.env, ...testEnv } });
  return stdout.trim();
};
const inside = (name, code) => docker('exec', name, 'node', '--input-type=module', '-e', code);
const waitForApp = async name => {
  for (let attempt = 0; attempt < 30; attempt++) {
    try { await inside(name, "const r=await fetch('http://127.0.0.1:3000/healthz',{signal:AbortSignal.timeout(1500)});if(!r.ok)process.exit(1)"); return; }
    catch { await new Promise(resolve => setTimeout(resolve, 1000)); }
  }
  throw new Error('The test container did not become ready.');
};

await mkdir('artifacts', { recursive: true });
await writeFile(envPath, Object.entries(testEnv).map(([key, value]) => `${key}=${value}`).join('\n') + '\n', { mode: 0o600 });
try {
  console.log('1/5 Validating the Coolify Compose configuration.');
  const config = JSON.parse(await docker('compose', '--env-file', envPath, '-f', 'compose.coolify.yaml', 'config', '--format', 'json'));
  assert.deepEqual(Object.keys(config.services), ['app']);
  assert.equal(config.services.app.environment.NODE_ENV, 'production');
  assert.equal(config.services.app.environment.HOST, '0.0.0.0');
  assert.equal(config.services.app.environment.BASE_URL, testEnv.BASE_URL);
  assert.equal(config.services.app.ports, undefined);
  assert.equal(config.services.app.volumes.length, 2);

  console.log('2/5 Building the Linux image (first build may take a few minutes).');
  await docker('build', '--tag', image, '.');
  const imageInfo = JSON.parse(await docker('image', 'inspect', image))[0];
  assert.equal(imageInfo.Config.User, 'node');
  assert.ok(imageInfo.Config.Healthcheck.Test.join(' ').includes('/healthz'));
  for (const volume of [dataVolume, mediaVolume]) {
    await docker('volume', 'create', '--label', `thermidor.check=${id}`, volume); volumes.push(volume);
  }
  const start = async suffix => {
    const name = `thermidor-check-${id}-${suffix}`;
    containers.push(name);
    await docker('run', '--detach', '--name', name, '--label', `thermidor.check=${id}`, '--network', 'none', '--init', '--read-only', '--env-file', envPath, '--mount', `type=volume,source=${dataVolume},target=/app/data`, '--mount', `type=volume,source=${mediaVolume},target=/app/public/uploads`, image);
    await waitForApp(name); return name;
  };
  console.log('3/5 Testing non-root HTTP, SQLite, WebP and private file exclusion.');
  const first = await start('first');
  await inside(first, `
    import assert from 'node:assert/strict';
    import { existsSync } from 'node:fs';
    import { DatabaseSync } from 'node:sqlite';
    import sharp from 'sharp';
    assert.equal(process.getuid(), 1000);
    for (const path of ['/', '/en', '/projets/snv', '/en/expertise/ai-integration', '/admin/login', '/sitemap.xml', '/fonts/manrope-latin.woff2', '/media/snv.webp']) {
      const response = await fetch('http://127.0.0.1:3000' + path);
      assert.equal(response.status, 200, path);
      if (path === '/admin/login') { assert.match(response.headers.get('set-cookie'), /Secure/); assert.equal(response.headers.get('cache-control'), 'no-store'); }
    }
    const health = await (await fetch('http://127.0.0.1:3000/healthz')).json(); assert.equal(health.status, 'ok');
    for (const path of ['/app/.env', '/app/.local', '/app/artifacts', '/app/node_modules/@playwright/test']) assert.equal(existsSync(path), false, path);
    const db = new DatabaseSync('/app/data/thermidor.sqlite');
    assert.equal(db.prepare('SELECT COUNT(*) AS count FROM projects').get().count, 3);
    db.exec("CREATE TABLE docker_smoke (value TEXT); INSERT INTO docker_smoke VALUES ('persisted');"); db.close();
    await sharp({create:{width:64,height:64,channels:3,background:'#64743e'}}).webp().toFile('/app/public/uploads/check.webp');
    assert.equal((await fetch('http://127.0.0.1:3000/uploads/check.webp')).status, 200);
  `);
  await docker('stop', '--time', '10', first);
  console.log('4/5 Recreating the container and checking both persistent volumes.');
  const second = await start('second');
  await inside(second, `
    import assert from 'node:assert/strict';
    import { DatabaseSync } from 'node:sqlite';
    import sharp from 'sharp';
    const db = new DatabaseSync('/app/data/thermidor.sqlite');
    assert.equal(db.prepare('SELECT value FROM docker_smoke').get().value, 'persisted');
    assert.equal(db.prepare('SELECT COUNT(*) AS count FROM projects').get().count, 3); db.close();
    assert.equal((await sharp('/app/public/uploads/check.webp').metadata()).format, 'webp');
    assert.equal((await fetch('http://127.0.0.1:3000/uploads/check.webp')).status, 200);
  `);
  console.log('5/5 Success: image builds, application runs, SQLite and images survive recreation.');
} finally {
  const cleanupErrors = [];
  for (const name of containers) try { await docker('rm', '--force', name); } catch { cleanupErrors.push(name); }
  for (const name of volumes) try { await docker('volume', 'rm', name); } catch { cleanupErrors.push(name); }
  await unlink(envPath);
  if (cleanupErrors.length) { console.error('Could not remove these temporary test resources:', cleanupErrors.join(', ')); process.exitCode = 1; }
}
