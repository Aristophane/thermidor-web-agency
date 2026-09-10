const toggle = document.querySelector('.menu-toggle');
const mobile = document.getElementById('mobile-nav');
const lang = document.documentElement.lang;
function closeMenu() { if (!toggle) return; toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', lang === 'fr' ? 'Ouvrir le menu' : 'Open menu'); mobile.hidden = true; }
toggle?.addEventListener('click', () => { const opened = toggle.getAttribute('aria-expanded') === 'true'; toggle.setAttribute('aria-expanded', String(!opened)); toggle.setAttribute('aria-label', opened ? (lang === 'fr' ? 'Ouvrir le menu' : 'Open menu') : (lang === 'fr' ? 'Fermer le menu' : 'Close menu')); mobile.hidden = opened; });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') { closeMenu(); toggle.focus(); } });
window.matchMedia('(min-width: 761px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
document.querySelector('[data-back-top]')?.addEventListener('click', event => { event.preventDefault(); window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); });
document.querySelector('.contact-form')?.addEventListener('submit', async event => {
  event.preventDefault();
  const form = event.currentTarget, button = form.querySelector('button[type="submit"]'), status = form.querySelector('.form-status');
  const original = button.innerHTML;
  button.disabled = true; button.textContent = lang === 'fr' ? 'Envoi en cours…' : 'Sending…'; status.textContent = ''; status.classList.remove('error');
  try {
    const response = await fetch(form.action, { method: 'POST', body: new URLSearchParams(new FormData(form)), headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(30000) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message);
    status.textContent = result.message; form.reset();
  } catch (error) { status.classList.add('error'); status.textContent = error.name === 'TimeoutError' ? (lang === 'fr' ? 'La confirmation tarde à arriver. Contactez-nous par email si nécessaire.' : 'Confirmation is taking longer than expected. Please email us if needed.') : error.message || (lang === 'fr' ? 'Envoi impossible. Écrivez-nous directement par email.' : 'Unable to send. Please email us directly.'); }
  finally { button.disabled = false; button.innerHTML = original; }
});
