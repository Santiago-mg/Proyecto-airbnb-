/* Panel de administración: gráficos y acciones */
(function () {
  if (window.lucide) window.lucide.createIcons();

  function toast(mensaje, tipo = 'info') {
    if (window.toast) return window.toast(mensaje, tipo);
    return alert(mensaje);
  }

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

  // ---- Acciones (botones) ----
  document.querySelectorAll('[data-admin-action]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const confirmar = btn.getAttribute('data-confirm');
      if (confirmar && !confirm(confirmar)) return;
      const path = btn.getAttribute('data-api');
      const method = btn.getAttribute('data-method') || 'POST';
      const payload = btn.getAttribute('data-payload');
      const { ok, data } = await api(path, { method, body: payload ? JSON.parse(payload) : undefined });
      if (ok) {
        toast(data.message || 'Hecho.', 'success');
        setTimeout(() => location.reload(), 700);
      } else {
        toast(data.message || 'No se pudo completar la acción.', 'error');
      }
    });
  });

  // ---- Formularios admin ----
  document.querySelectorAll('[data-admin-form]').forEach((form) => {
    const submit = async (e) => {
      if (e) e.preventDefault();
      const path = form.getAttribute('data-api');
      const method = form.getAttribute('data-method') || 'POST';
      const fd = new FormData(form);
      const body = Object.fromEntries(fd.entries());
      const { ok, data } = await api(path, { method, body });
      if (ok) {
        toast(data.message || 'Guardado.', 'success');
        if (form.hasAttribute('data-reload')) setTimeout(() => location.reload(), 700);
      } else {
        toast(data.message || 'Error al guardar.', 'error');
      }
    };
    form.addEventListener('submit', submit);
    form.querySelectorAll('[data-autosubmit]').forEach((el) => el.addEventListener('change', () => submit()));
  });

  // ---- Gráficos ----
  const m = window.__METRICAS__;
  if (!m || typeof Chart === 'undefined') return;

  Chart.defaults.font.family = "'Plus Jakarta Sans', sans-serif";
  Chart.defaults.color = '#64748B';

  const reservasCanvas = document.getElementById('chartReservas');
  if (reservasCanvas && m.reservasPorMes) {
    const labels = m.reservasPorMes.map((r) => r.mes);
    const reservas = m.reservasPorMes.map((r) => Number(r.reservas));
    const ingresos = m.reservasPorMes.map((r) => Number(r.ingresos));
    new Chart(reservasCanvas, {
      data: {
        labels,
        datasets: [
          {
            type: 'bar', label: 'Reservas', data: reservas, yAxisID: 'y',
            backgroundColor: 'rgba(15,118,110,0.85)', borderRadius: 8, maxBarThickness: 36,
          },
          {
            type: 'line', label: 'Ingresos', data: ingresos, yAxisID: 'y1',
            borderColor: '#FF5A5F', backgroundColor: 'rgba(255,90,95,0.12)',
            tension: 0.4, fill: true, pointRadius: 4, pointBackgroundColor: '#FF5A5F',
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 18 } } },
        scales: {
          y: { beginAtZero: true, position: 'left', grid: { color: '#E2E8F0' }, title: { display: true, text: 'Reservas' } },
          y1: { beginAtZero: true, position: 'right', grid: { drawOnChartArea: false }, title: { display: true, text: 'Ingresos' } },
        },
      },
    });
  }

  const catCanvas = document.getElementById('chartCategorias');
  if (catCanvas && m.porCategoria) {
    new Chart(catCanvas, {
      type: 'doughnut',
      data: {
        labels: m.porCategoria.map((c) => c.categoria || 'Sin categoría'),
        datasets: [{
          data: m.porCategoria.map((c) => Number(c.total)),
          backgroundColor: ['#0F766E', '#14B8A6', '#FF5A5F', '#0369A1', '#F59E0B', '#8B5CF6', '#5EEAD4'],
          borderWidth: 0,
        }],
      },
      options: {
        cutout: '62%',
        plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 14, font: { size: 11 } } } },
      },
    });
  }
}());
