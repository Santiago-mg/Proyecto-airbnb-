/* Widget de reserva en el detalle de propiedad */
(function () {
  const form = document.querySelector('.js-reserva');
  if (!form) return;

  const precio = Number(form.getAttribute('data-precio'));
  const propiedadId = Number(form.getAttribute('data-id'));
  const inicio = form.querySelector('[name=fechaInicio]');
  const fin = form.querySelector('[name=fechaFin]');
  const huespedes = form.querySelector('[name=huespedes]');
  const resumen = form.querySelector('[data-resumen]');
  const msg = form.querySelector('[data-reserva-msg]');

  const hoy = new Date().toISOString().split('T')[0];
  inicio.min = hoy;
  fin.min = hoy;

  const fmt = (n) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);
  const noches = () => {
    if (!inicio.value || !fin.value) return 0;
    return Math.ceil((new Date(fin.value) - new Date(inicio.value)) / 86400000);
  };

  function actualizar() {
    const n = noches();
    if (n > 0) {
      resumen.classList.remove('hidden');
      form.querySelector('[data-detalle-noches]').textContent = `${fmt(precio)} × ${n} noches`;
      form.querySelector('[data-detalle-subtotal]').textContent = fmt(precio * n);
      form.querySelector('[data-detalle-total]').textContent = fmt(precio * n);
    } else {
      resumen.classList.add('hidden');
    }
    if (inicio.value) fin.min = inicio.value;
  }

  [inicio, fin, huespedes].forEach((el) => el.addEventListener('change', actualizar));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (noches() <= 0) { window.toast('Selecciona fechas válidas.', 'warning'); return; }
    const btn = form.querySelector('button[type=submit]');
    btn.disabled = true;
    const { ok, status, data } = await window.apiCliente('/reservas', {
      method: 'POST',
      body: {
        propiedadId,
        fechaInicio: inicio.value,
        fechaFin: fin.value,
        huespedes: Number(huespedes.value),
      },
    });
    btn.disabled = false;
    if (status === 401) { window.location.href = '/login?mensaje=Inicia sesión para reservar.&tipo=info'; return; }
    if (ok) {
      window.toast('¡Reserva confirmada!', 'success');
      setTimeout(() => { window.location.href = '/panel/reservas?mensaje=Tu reserva fue confirmada.&tipo=success'; }, 900);
    } else if (msg) {
      msg.textContent = data.message || 'No se pudo completar la reserva.';
      msg.classList.add('text-rose-600');
    }
  });
}());
