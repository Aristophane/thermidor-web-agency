import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
await mkdir('artifacts/references', { recursive: true });
await mkdir('public/media', { recursive: true });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
for (const [name, url, project] of [
  ['morez', 'https://morez.co/', false], ['daima', 'https://wearedaima.framer.website/', false],
  ['ignite', 'https://igniteagency.com/', false], ['oroya', 'https://www.oroya.fr/', false],
  ['snv', 'https://www.snv-vetements-pro.fr/', true], ['maison-charlet', 'https://maisoncharlet.fr/', true], ['junaki', 'https://junaki.fr/', true],
  ['thermidor-original', 'https://thermidor-agence-web.fr/', false]
]) {
  if (process.argv[2] && !process.argv.slice(2).includes(name)) continue;
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  try {
    const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
    await page.waitForTimeout(2500);
    const essential = page.getByRole('button', { name: 'Accepter seulement essentiels', exact: true });
    if (await essential.isVisible().catch(() => false)) await essential.click();
    if (name === 'daima') await page.waitForTimeout(6500);
    await page.screenshot({ path: `artifacts/references/${name}.png` });
    await writeFile(`artifacts/references/${name}.txt`, await page.locator('body').innerText());
    if (project && response?.ok()) await sharp(`artifacts/references/${name}.png`).resize(1280).webp({ quality: 82 }).toFile(`public/media/${name}.webp`);
    if (name === 'thermidor-original') {
      const service = page.locator('a[href="/service"]').first();
      if (await service.count()) { await service.click(); await page.waitForTimeout(1000); await writeFile('artifacts/references/thermidor-services.txt', await page.locator('body').innerText()); }
    }
    console.log(name, response?.status());
  } catch (error) { console.log(name, error.message.split('\n')[0]); }
  await page.close();
}
await browser.close();
