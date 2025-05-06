let proveedores = [];  // Variable para almacenar la lista de Proveedeores
let ProveedorActual = null;  // Variable para almacenar el Proveedeores que se está editando

// Función para hacer fetch a la API y actualizar la lista de Proveedores
function fetchProveedores(url, method = 'GET', data = null) {
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

// Cargar todos los proveedores desde el servidor
function cargarProveedoresDesdeBD() {
  fetchProveedores('http://localhost:3000/api/proveedores')
    .then(data => {
      proveedores = data;
      cargarTablaProveedores();
    });
}

// Mostrar los proveedores en la tabla
function cargarTablaProveedores() {
  const tablaBody = document.querySelector('.tablaProveedores tbody');
  tablaBody.innerHTML = '';  // Limpiamos la tabla antes de agregar los nuevos datos

  proveedores.forEach(proveedor => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
        <td>${proveedor.Nombre}</td>
        <td>${proveedor.Telefono}</td>
        <td>${proveedor.Correo}</td>
        <td>
          <button class="btn-detalles" onclick="verDetalles(${proveedor.Id_proveedor})">Detalles</button>
          <button class="btn-eliminar" onclick="eliminarProveedor(${proveedor.Id_proveedor})">Eliminar</button>
        </td>
      `;
    tablaBody.appendChild(fila);
  });
}

function verDetalles(idProveedor) {
  const modal = document.getElementById('modalProductos');
  const tablaBody = document.querySelector('#tablaProductos tbody');
  tablaBody.innerHTML = ''; // Limpia el contenido anterior

  fetch(`http://localhost:3000/api/proveedores/${idProveedor}/productos`)
    .then(res => res.json())
    .then(productos => {
      if (productos.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="2">No hay productos registrados para este proveedor.</td>`;
        tablaBody.appendChild(row);
      } else {
        productos.forEach(producto => {
          const row = document.createElement('tr');
          row.innerHTML = `
              <td>${producto.Nombre}</td>
              <td>${producto.Cantidad}</td>
            `;
          tablaBody.appendChild(row);
        });
      }

      modal.style.display = 'block';
    })
    .catch(err => {
      console.error('Error al cargar productos:', err);
    });
}

// Cerrar modal cuando se hace clic en la "X"
document.querySelector('#modalProductos .close').addEventListener('click', () => {
  document.getElementById('modalProductos').style.display = 'none';
});

// Cerrar modal al hacer clic fuera del contenido
window.addEventListener('click', (event) => {
  const modal = document.getElementById('modalProductos');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});

document.getElementById('btnAgregarProveedor').addEventListener('click', () => {
  document.getElementById('modalAgregarProveedor').style.display = 'flex';
});

function cerrarModalAgregarProveedor() {
  document.getElementById('modalAgregarProveedor').style.display = 'none';
}

// Cierra modal si clic fuera de contenido
window.addEventListener('click', function (e) {
  const modal = document.getElementById('modalAgregarProveedor');
  if (e.target === modal) modal.style.display = 'none';
});

function guardarProveedor() {
  const nombre = document.getElementById('nombre').value;
  const telefono = document.getElementById('telefono').value;
  const correo = document.getElementById('correo').value;

  if (!nombre || !telefono || !correo) {
    alert('Por favor complete todos los campos');
    return;
  }

  fetch('http://localhost:3000/api/proveedores', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, telefono, correo }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        alert(data.error);
      } else {
        alert('Proveedor agregado correctamente');
        cerrarModalAgregarProveedor();
        cargarProveedoresDesdeBD(); // Si tienes una función para recargar tabla
      }
    })
    .catch(err => {
      console.error('Error:', err);
      alert('No se pudo agregar el proveedor');
    });
}

// Eliminar un proveedor
function eliminarProveedor(id) {
  if (confirm('¿Estás seguro de que deseas eliminar este proveedor?')) {
    fetchProveedores(`http://localhost:3000/api/proveedores/${id}`, 'DELETE')
      .then(() => cargarProveedoresDesdeBD());
  }
}

// Cargar los proveedores cuando la página se cargue
window.onload = cargarProveedoresDesdeBD;