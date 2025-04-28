let clientes = [];  // Variable para almacenar la lista de clientes
let clienteActual = null;  // Variable para almacenar el cliente que se está editando

// Función para hacer fetch a la API y actualizar la lista de clientes
function fetchClientes(url, method = 'GET', data = null) {
  const options = {
    method: method,
    headers: { 'Content-Type': 'application/json' },
    body: data ? JSON.stringify(data) : null,
  };

  return fetch(url, options)
    .then(response => response.json())
    .catch(error => {
      console.error(`Error en la petición ${method}:`, error);
      throw error;
    });
}

// Cargar todos los clientes desde el servidor
function cargarClientesDesdeBD() {
  fetchClientes('http://localhost:3000/api/clientes')
    .then(data => {
      clientes = data;
      cargarTablaClientes();
    });
}

// Mostrar los clientes en la tabla
function cargarTablaClientes() {
  const tablaBody = document.querySelector('.tabla-clientes tbody');
  tablaBody.innerHTML = '';  // Limpiamos la tabla antes de agregar los nuevos datos

  clientes.forEach(cliente => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${cliente.Nombres} ${cliente.Apellidos}</td>
      <td>${cliente.Telefono}</td>
      <td>${cliente.Correo}</td>
      <td>${formatDate(cliente.Fecha_registro)}</td>
      <td>
        <button class="btn-detalles" onclick="verDetalles(${cliente.Id_cliente})">Detalles</button>
        <button class="btn-eliminar" onclick="eliminarCliente(${cliente.Id_cliente})">Eliminar</button>
      </td>
    `;
    tablaBody.appendChild(fila);
  });
}

// Ver detalles y permitir edición de un cliente
function verDetalles(id) {
  clienteActual = clientes.find(c => c.Id_cliente === id);
  
  const { Nombres, Apellidos, Telefono, Correo, Fecha_registro } = clienteActual || {};
  document.getElementById('detalleNombreCliente').value = Nombres || '';
  document.getElementById('detalleApellidoCliente').value = Apellidos || '';
  document.getElementById('detalleTelefonoCliente').value = Telefono || '';
  document.getElementById('detalleCorreoCliente').value = Correo || '';
  document.getElementById('detalleUltimaConsultaCliente').value = Fecha_registro ? Fecha_registro.substring(0, 10) : '';

  document.getElementById('modalDetallesCliente').style.display = 'flex';
}

// Función para guardar los cambios
function guardarCambiosDetallesCliente() {
  const nombres = document.getElementById('detalleNombreCliente').value;
  const apellidos = document.getElementById('detalleApellidoCliente').value;
  const telefono = document.getElementById('detalleTelefonoCliente').value;
  const correo = document.getElementById('detalleCorreoCliente').value;
  let fechaRegistro = document.getElementById('detalleUltimaConsultaCliente').value;

  if (!nombres || !apellidos) {
    alert('El nombre y el apellido son obligatorios.');
    return;
  }

  if (!fechaRegistro) {
    fechaRegistro = new Date().toISOString().split('T')[0];
  }

  const clienteData = { nombres, apellidos, telefono, correo, fecha_registro: fechaRegistro };

  if (clienteActual) {
    // Actualizar cliente existente
    fetchClientes(`http://localhost:3000/api/clientes/${clienteActual.Id_cliente}`, 'PUT', clienteData)
      .then(() => {
        cargarClientesDesdeBD();
        cerrarModalDetallesCliente();
      });
  } else {
    // Agregar un nuevo cliente
    fetchClientes('http://localhost:3000/api/clientes', 'POST', clienteData)
      .then(() => {
        cargarClientesDesdeBD();
        cerrarModalDetallesCliente();
      });
  }
}

// Función para cerrar el modal de detalles del cliente
function cerrarModalDetallesCliente() {
  document.getElementById('modalDetallesCliente').style.display = 'none';
}

// Eliminar un cliente
function eliminarCliente(id) {
  if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
    fetchClientes(`http://localhost:3000/api/clientes/${id}`, 'DELETE')
      .then(() => cargarClientesDesdeBD());
  }
}

// Cerrar el modal de agregar cliente
function cerrarModalAgregarCliente() {
  document.getElementById('modalAgregarCliente').style.display = 'none';
}

// Mostrar el modal de Agregar Cliente
document.getElementById('btnAgregarCliente').addEventListener('click', function() {
  document.getElementById('modalAgregarCliente').style.display = 'flex';
});

// Función para guardar un nuevo cliente desde el modal de agregar cliente
function guardarNuevoCliente() {
  const nombres = document.getElementById('agregarNombreCliente').value;
  const apellidos = document.getElementById('agregarApellidoCliente').value;
  const telefono = document.getElementById('agregarTelefonoCliente').value;
  const correo = document.getElementById('agregarCorreoCliente').value;
  let fechaRegistro = document.getElementById('agregarUltimaConsultaCliente').value;

  if (!nombres || !apellidos) {
    alert('El nombre y el apellido son obligatorios.');
    return;
  }

  if (!fechaRegistro) {
    fechaRegistro = new Date().toISOString().split('T')[0];
  }

  const clienteData = { nombres, apellidos, telefono, correo, fecha_registro: fechaRegistro };

  fetchClientes('http://localhost:3000/api/clientes', 'POST', clienteData)
    .then(() => {
      cargarClientesDesdeBD();
      cerrarModalAgregarCliente();
      limpiarFormularioAgregarCliente();
    });
}

// (Opcional) Función para limpiar el formulario de agregar cliente
function limpiarFormularioAgregarCliente() {
  document.getElementById('formAgregarCliente').reset();
}

// Formato de fecha para mostrar
function formatDate(date) {
  const d = new Date(date);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

// Cargar los clientes cuando la página se cargue
window.onload = cargarClientesDesdeBD;
