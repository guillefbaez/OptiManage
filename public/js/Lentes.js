let productos = []; 

// Función para hacer peticiones al backend
function fetchProductos(url, method = 'GET', data = null) {
  const options = {
    method: method,
    headers: { 'Content-Type': 'application/json' },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  return fetch(url, options)
    .then(res => res.json())
    .catch(err => {
      console.error(`Error en la petición ${method}:`, err);
      throw err;
    });
}

// Cargar datos al iniciar la página
window.onload = function () {
  cargarLentesDesdeBD();
};

// Obtener los datos desde el servidor y cargarlos en la tabla
function cargarLentesDesdeBD() {
  fetchProductos('http://localhost:3000/api/productos')
    .then(data => {
      console.log("Datos recibidos del backend:", data);
      productos = data;
      renderizarTabla();
    });
}

// Pintar los productos en la tabla
function renderizarTabla() {
  const tbody = document.querySelector('.tabla-Lentes tbody');
  tbody.innerHTML = ''; // Limpiar tabla antes de renderizar

  productos.forEach(lente => {
    const fila = document.createElement('tr');

    fila.innerHTML = `
      <td>${lente.Nombre}</td>
      <td>${lente.Color}</td>
      <td>${lente.Tipo_lente}</td>
      <td>${lente.Precio}</td>
      <td>${lente.Cantidad}</td>
      <td>${lente.Descripcion}</td>
      <td>
        <button class="btn-eliminar" onclick="eliminarLente(${lente.Id_producto})">Eliminar</button>
      </td>
    `;
    tbody.appendChild(fila);
  });
}

function eliminarLente(id) {
  if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
    fetchProductos(`http://localhost:3000/api/productos/${id}`, 'DELETE')
      .then(() => cargarLentesDesdeBD());
  }
}

document.getElementById('btnAgregarLente').addEventListener('click', function() {
  document.getElementById('modalAgregarLente').style.display = 'flex';
});

function cerrarModalAgregarLente() {
  document.getElementById('modalAgregarLente').style.display = 'none';
}

function limpiarFormularioAgregarLente() {
  document.getElementById('formAgregarLente').reset();
}

function guardarNuevoLente() {
  const Nombre = document.getElementById('agregarNombreLente').value;
  const Color = document.getElementById('agregarColorLente').value;
  const Cantidad = document.getElementById('agregarCantidadLente').value;
  const Precio = document.getElementById('agregarPrecioLente').value;
  const Tipo_lente = document.getElementById('agregarTipoLente').value;
  const Graduacion_OI = document.getElementById('agregarOILente').value;
  const Graduacion_OD = document.getElementById('agregarODLente').value;
  const Descripcion = document.getElementById('agregarDescripcionLente').value;

  const lenteData = { Nombre, Color, Cantidad, Precio, Tipo_lente, Graduacion_OI, Graduacion_OD, Descripcion };

  fetchProductos('http://localhost:3000/api/productos', 'POST', lenteData)
    .then(() => {
      cargarLentesDesdeBD();
      cerrarModalAgregarLente();
      limpiarFormularioAgregarLente();
    });
}