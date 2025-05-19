function mostrarClientesFrecuentes() {
    const modal = document.getElementById('modalClientes');
    const tablaBody = document.querySelector('#tablaClientes tbody');
    tablaBody.innerHTML = ''; // Limpia el contenido anterior
  
    fetch('http://localhost:3000/api/historial_clinico')
      .then(res => res.json())
      .then(clientes => {
        if (clientes.length === 0) {
          const row = document.createElement('tr');
          row.innerHTML = `<td colspan="2">No hay clientes frecuentes.</td>`;
          tablaBody.appendChild(row);
        } else {
          clientes.forEach(cliente => {
            const row = document.createElement('tr');
            row.innerHTML = `
              <td>${cliente.Id_cliente}</td>
              <td>${cliente.Nombres}</td>
              <td>${cliente.Apellidos}</td>
              <td>${cliente.veces}</td>
            `;
            tablaBody.appendChild(row);
          });
        }
        modal.style.display = 'block';
      })
      .catch(err => {
        console.error('Error al cargar clientes frecuentes:', err);
      });
  }
  
  // Cerrar modal
  document.querySelector('#modalClientes .close').addEventListener('click', () => {
    document.getElementById('modalClientes').style.display = 'none';
  });
  
  window.addEventListener('click', (event) => {
    const modal = document.getElementById('modalClientes');
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  function mostrarInventario() {
    const modal = document.getElementById('modalInventario');
    const tablaBody = document.querySelector('#tablaInventario tbody');
    tablaBody.innerHTML = '';
  
    fetch('http://localhost:3000/api/reportes/inventario')
      .then(res => res.json())
      .then(productos => {
        if (productos.length === 0) {
          const row = document.createElement('tr');
          row.innerHTML = `<td colspan="4">No hay productos en inventario.</td>`;
          tablaBody.appendChild(row);
        } else {
          productos.forEach(p => {
            const row = document.createElement('tr');
            row.innerHTML = `
              <td>${p.Producto}</td>
              <td>${p.Cantidad}</td>
              <td>${p.NombreProveedor}</td>
            `;
            tablaBody.appendChild(row);
          });
        }
        modal.style.display = 'block';
      })
      .catch(err => {
        console.error('Error al cargar inventario:', err);
      });
  }
  
  // Cerrar modal de inventario
  document.querySelector('.close-inventario').addEventListener('click', () => {
    document.getElementById('modalInventario').style.display = 'none';
  });
  
  window.addEventListener('click', (event) => {
    const modal = document.getElementById('modalInventario');
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });