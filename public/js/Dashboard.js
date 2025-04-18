// Animación de la barra y carga de datos de clientes

const BASE_URL = 'http://localhost:3000';

window.addEventListener('DOMContentLoaded', async () => {
  // Mostrar primer nombre en sidebar y header
  const firstName = sessionStorage.getItem('firstName');
  console.log('firstName from sessionStorage:', firstName);
  if (firstName) {
    document.getElementById('profileName').textContent =
      firstName;
  }

  // Animación de la barra de progreso
  const fill    = document.querySelector('.progress-fill');
  const tooltip = document.querySelector('.tooltip');
  if (fill && tooltip) {
    const perc = parseInt(fill.getAttribute('data-perc'), 10);
    setTimeout(() => {
      fill.style.width = perc + '%';
      const barW = fill.parentElement.offsetWidth;
      const tipW = tooltip.offsetWidth;
      tooltip.style.left    = `${(barW * perc/100) - (tipW/2)}px`;
      tooltip.textContent   = perc + '%';
      tooltip.style.opacity = 1;
    }, 200);
  }

  // Cargar lista de clientes desde la API
  try {
    const res = await fetch(`${BASE_URL}/api/clientes`);
    const clientes = await res.json();
    console.log('Clientes registrados:', clientes);
    // …renderizar tus clientes en la UI…
  } catch (err) {
    console.error('Error al cargar clientes:', err);
  }
});
