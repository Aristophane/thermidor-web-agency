document.querySelectorAll('[data-delete-form]').forEach(form => form.addEventListener('submit', event => { if (!confirm(`Supprimer définitivement le projet « ${form.dataset.title} » ?`)) event.preventDefault(); }));
const editor = document.querySelector('[data-project-form]');
let dirty = false;
editor?.addEventListener('input', () => { dirty = true; });
editor?.addEventListener('submit', () => { dirty = false; });
window.addEventListener('beforeunload', event => { if (dirty) { event.preventDefault(); event.returnValue = ''; } });
document.querySelector('[data-image-upload]')?.addEventListener('change', async event => {
  const file = event.target.files[0]; if (!file) return;
  const status = document.querySelector('[data-upload-status]'), submit = editor.querySelector('button[type="submit"]');
  if (file.size > 8 * 1024 * 1024) { status.textContent = 'L’image dépasse la limite de 8 Mo.'; return; }
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { status.textContent = 'Choisissez une image JPG, PNG ou WebP.'; return; }
  submit.disabled = true; event.target.disabled = true; status.textContent = 'Optimisation de l’image…';
  try {
    const response = await fetch('/admin/upload', { method: 'POST', headers: { 'Content-Type': file.type, 'X-CSRF-Token': editor.elements.csrf.value }, body: file });
    const result = await response.json(); if (!response.ok) throw new Error(result.message);
    document.querySelector('[data-image-preview]').src = result.path; document.querySelector('[data-image-path]').value = result.path; dirty = true; status.textContent = 'Image prête. Enregistrez le projet pour la publier.';
  } catch (error) { status.textContent = error.message || 'L’import a échoué. Réessayez.'; }
  finally { submit.disabled = false; event.target.disabled = false; }
});
