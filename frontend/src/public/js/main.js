/* Interacciones globales de EstadiaPro */
(function () {
  const icons = () => window.lucide && window.lucide.createIcons();
  icons();

  // ---- Toast ----
  function toast(mensaje, tipo = 'info') {
    let cont = document.getElementById('toast-cont');
    if (!cont) {
      cont = document.createElement('div');
      cont.id = 'toast-cont';
      cont.className = 'fixed bottom-6 right-6 z-[100] flex flex-col gap-2';
      document.body.appendChild(cont);
    }
    const colores = {
      success: 'bg-emerald-600', error: 'bg-rose-600', info: 'bg-brand-800', warning: 'bg-amber-600',
    };
    const el = document.createElement('div');
    el.className = `${colores[tipo] || colores.info} text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-float animate-fade-up`;
    el.textContent = mensaje;
    cont.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .3s'; }, 3200);
    setTimeout(() => el.remove(), 3600);
  }
  window.toast = toast;

  async function api(path, { method = 'GET', body } = {}) {
    const res = await fetch(`/api${path}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    let data = {};
    try { data = await res.json(); } catch (e) { data = {}; }
    return { ok: res.ok, status: res.status, data };
  }
  window.apiCliente = api;

  // ---- Menú de usuario ----
  document.querySelectorAll('[data-menu]').forEach((menu) => {
    const trigger = menu.querySelector('[data-menu-trigger]');
    const panel = menu.querySelector('[data-menu-panel]');
    if (!trigger || !panel) return;
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      panel.classList.toggle('hidden');
    });
    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target)) panel.classList.add('hidden');
    });
  });

  // ---- Mostrar/ocultar contraseña ----
  document.querySelectorAll('[data-toggle-password]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const input = document.querySelector(btn.getAttribute('data-toggle-password'));
      if (!input) return;
      input.type = input.type === 'password' ? 'text' : 'password';
    });
  });

  // ---- Favoritos ----
  document.querySelectorAll('.js-fav').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      const { ok, status, data } = await api(`/favoritos/${id}`, { method: 'POST' });
      if (status === 401) { toast('Inicia sesión para guardar favoritos.', 'warning'); return; }
      if (!ok) { toast(data.message || 'No se pudo guardar.', 'error'); return; }
      const icon = btn.querySelector('i');
      if (data.favorito) {
        icon.classList.add('fill-coral-500', 'text-coral-500');
        toast('Guardado en favoritos.', 'success');
      } else {
        icon.classList.remove('fill-coral-500', 'text-coral-500');
        toast('Eliminado de favoritos.', 'info');
      }
    });
  });

  // ---- Cancelar reserva ----
  document.querySelectorAll('.js-cancelar').forEach((btn) => {
    btn.addEventListener('click', async () => {
      if (!confirm('¿Seguro que deseas cancelar esta reserva?')) return;
      const id = btn.getAttribute('data-id');
      const { ok, data } = await api(`/reservas/${id}/cancelar`, { method: 'PATCH' });
      if (ok) { toast('Reserva cancelada.', 'success'); setTimeout(() => location.reload(), 800); }
      else toast(data.message || 'No se pudo cancelar.', 'error');
    });
  });

  // ---- Eliminar propiedad ----
  document.querySelectorAll('.js-eliminar-prop').forEach((btn) => {
    btn.addEventListener('click', async () => {
      if (!confirm('¿Eliminar esta propiedad de forma permanente?')) return;
      const id = btn.getAttribute('data-id');
      const { ok, data } = await api(`/propiedades/${id}`, { method: 'DELETE' });
      if (ok) { toast('Propiedad eliminada.', 'success'); setTimeout(() => location.reload(), 800); }
      else toast(data.message || 'No se pudo eliminar.', 'error');
    });
  });

  // ---- Publicar reseña ----
  document.querySelectorAll('.js-resena').forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = Number(form.getAttribute('data-id'));
      const fd = new FormData(form);
      const { ok, data } = await api('/resenas', {
        method: 'POST',
        body: { propiedadId: id, calificacion: Number(fd.get('calificacion')), comentario: fd.get('comentario') },
      });
      const msg = form.querySelector('[data-resena-msg]');
      if (ok) { toast('Reseña publicada.', 'success'); setTimeout(() => location.reload(), 900); }
      else if (msg) { msg.textContent = data.message || 'No se pudo publicar.'; msg.classList.add('text-rose-600'); }
    });
  });
}());
