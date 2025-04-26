const clientes = [
    {
      id: 'angel',
      nombre: 'Ángel García',
      telefono: '+52 8121746955',
      correo: 'angel12345@gmail.com',
      ultimaConsulta: '2023-01-21',
      historial: [
        { fecha: '2022-12-15', detalle: 'Diagnóstico: Miopía - Lentes recetados' },
        { fecha: '2023-01-21', detalle: 'Control de visión - sin cambios' }
      ]
    },
    {
      id: 'guillermo',
      nombre: 'Guillermo Flores',
      telefono: '+52 8121746955',
      correo: 'guillermo@gmail.com',
      ultimaConsulta: '2023-02-15',
      historial: []
    },
    {
      id: 'lois',
      nombre: 'Lois Smith',
      telefono: '+52 8121746955',
      correo: 'lois@gmail.com',
      ultimaConsulta: '2023-03-05',
      historial: []
    },
    {
      id: 'rosa',
      nombre: 'Rosa De La Garza',
      telefono: '+52 8121746955',
      correo: 'rosa@gmail.com',
      ultimaConsulta: '2023-04-11',
      historial: []
    },
    {
      id: 'david',
      nombre: 'David Hernandez',
      telefono: '+52 8121746955',
      correo: 'david@gmail.com',
      ultimaConsulta: '2023-05-21',
      historial: []
    }
  ];
  
  let clienteActual = null;
  
  // Función para cargar los clientes en la tabla
  function cargarTablaClientes() {
    const tablaBody = document.querySelector('.tabla-clientes tbody');
    tablaBody.innerHTML = '';
  
    clientes.forEach(cliente => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${cliente.nombre}</td>
        <td>${cliente.telefono}</td>
        <td>${cliente.correo}</td>
        <td>${cliente.ultimaConsulta}</td>
        <td>
          <button class="btn-detalles" onclick="verDetalles('${cliente.id}')">Detalles</button>
          <button class="btn-eliminar" onclick="eliminarCliente('${cliente.id}')">Eliminar</button>
        </td>
      `;
      tablaBody.appendChild(fila);
    });
  }
  
  // Función para abrir modal y mostrar detalles del cliente
  function verDetalles(id) {
    clienteActual = clientes.find(c => c.id === id);
  
    document.getElementById('inputNombre').value = clienteActual.nombre;
    document.getElementById('inputTelefono').value = clienteActual.telefono;
    document.getElementById('inputCorreo').value = clienteActual.correo;
    document.getElementById('inputUltimaConsulta').value = clienteActual.ultimaConsulta;
  
    document.querySelector('#modalDetalles h3').textContent = 'Editar Cliente';
  
    cargarHistorial(clienteActual.historial || []);
  
    // Limpiar campos de historial
    document.getElementById('nuevaFecha').value = '';
    document.getElementById('nuevoDetalle').value = '';
  
    document.getElementById('modalDetalles').style.display = 'flex';
  }
  
  // Cargar historial clínico en la lista
  function cargarHistorial(historial) {
    const listaHistorial = document.getElementById('listaHistorial');
    listaHistorial.innerHTML = '';
  
    if (!historial || historial.length === 0) {
      listaHistorial.innerHTML = '<li>Sin historial registrado.</li>';
      return;
    }
  
    historial.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.fecha} – ${item.detalle}`;
      listaHistorial.appendChild(li);
    });
  }
  
  // Acción del botón "Agregar Cliente"
  document.getElementById('btnAgregarCliente').addEventListener('click', function () {
    clienteActual = null;
  
    document.getElementById('inputNombre').value = '';
    document.getElementById('inputTelefono').value = '';
    document.getElementById('inputCorreo').value = '';
    document.getElementById('inputUltimaConsulta').value = '';
  
    document.querySelector('#modalDetalles h3').textContent = 'Agregar Cliente';
  
    cargarHistorial([]);
  
    document.getElementById('modalDetalles').style.display = 'flex';
  });
  
  // Función para guardar cambios o agregar nuevo cliente
  function guardarCambios() {
    const nombre = document.getElementById('inputNombre').value.trim();
    const telefono = document.getElementById('inputTelefono').value.trim();
    const correo = document.getElementById('inputCorreo').value.trim();
    const ultimaConsulta = document.getElementById('inputUltimaConsulta').value;
  
    const nuevaFecha = document.getElementById('nuevaFecha').value;
    const nuevoDetalle = document.getElementById('nuevoDetalle').value.trim();
  
    if (!nombre || !telefono || !correo || !ultimaConsulta) {
      alert('Por favor completa todos los campos.');
      return;
    }
  
    // Creamos una nueva entrada de historial si se proporcionaron datos
    let nuevaEntradaHistorial = null;
    if (nuevaFecha && nuevoDetalle) {
      nuevaEntradaHistorial = {
        fecha: nuevaFecha,
        detalle: nuevoDetalle
      };
    }
  
    if (clienteActual) {
      // Editar cliente existente
      clienteActual.nombre = nombre;
      clienteActual.telefono = telefono;
      clienteActual.correo = correo;
      clienteActual.ultimaConsulta = ultimaConsulta;
  
      if (nuevaEntradaHistorial) {
        clienteActual.historial.push(nuevaEntradaHistorial);
      }
    } else {
      // Agregar nuevo cliente
      const nuevoCliente = {
        id: `cliente_${Date.now()}`,
        nombre,
        telefono,
        correo,
        ultimaConsulta,
        historial: nuevaEntradaHistorial ? [nuevaEntradaHistorial] : []
      };
      clientes.push(nuevoCliente);
    }
  
    cargarTablaClientes();
    cerrarModal();
  }
  
  
  // Función para cerrar modal
  function cerrarModal() {
    document.getElementById('modalDetalles').style.display = 'none';
  }
  
  // Función para eliminar cliente
  function eliminarCliente(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      const indice = clientes.findIndex(c => c.id === id);
      if (indice !== -1) {
        clientes.splice(indice, 1);
        cargarTablaClientes();
      }
    }
  }
  
  // Inicializar la tabla al cargar
  document.addEventListener('DOMContentLoaded', cargarTablaClientes);
  

/*--------------sql---------------------
id INT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(100),
telefono VARCHAR(20),
correo VARCHAR(100),
ultimaConsulta DATE

otra tabla para historial:
id INT AUTO_INCREMENT PRIMARY KEY,
cliente_id INT,
fecha DATE,
detalle TEXT,
FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE



-------------y en const clientes que es el principio cambiarlo por fetch()------------
let clientes = [];

function cargarClientesDesdeBD() {
  fetch('http://localhost/optica/clientes.php') // Ruta a archivo PHP
    .then(res => res.json())
    .then(data => {
      clientes = data;
      cargarTablaClientes();
    });
}
*/