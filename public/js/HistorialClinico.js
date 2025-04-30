const listaClientes = [
    {
      Id_cliente: 1,
      Nombres: "Ángel",
      Apellidos: "García",
      Telefono: "123456789",
      Correo: "angel12345@gmail.com",
      Fecha_registro: "2023-01-21",
      Diagnostico: "Miopía Leve",
      Tratamiento: "Uso de lentes esféricos",
      Edad: 29,
      Observaciones: "Paciente con historial familiar de miopía."
    },
    {
      Id_cliente: 2,
      Nombres: "David",
      Apellidos: "Hernandez",
      Telefono: "987654321",
      Correo: "david_smith87@gmail.com",
      Fecha_registro: "2024-02-12",
      Diagnostico: "Astigmatismo",
      Tratamiento: "Lentes cilíndricos",
      Edad: 35,
      Observaciones: "Usa lentes desde hace 5 años. Control estable."
    },
    {
      Id_cliente: 3,
      Nombres: "Guillermo",
      Apellidos: "Flores",
      Telefono: "555123456",
      Correo: "guille.martinez01@gmail.com",
      Fecha_registro: "2024-03-31",
      Diagnostico: "Hipermetropía",
      Tratamiento: "Lentes convexos",
      Edad: 42,
      Observaciones: "Buena adaptación al tratamiento."
    }
  ];
  
  function cargarHistorialClinico() {
    const tbody = document.getElementById("tbodyHistorial");
    tbody.innerHTML = "";
  
    listaClientes.forEach(cliente => {
      const fila = document.createElement("tr");
  
      fila.innerHTML = `
        <td>${cliente.Nombres} ${cliente.Apellidos}</td>
        <td>${cliente.Diagnostico}</td>
        <td>${cliente.Tratamiento}</td>
        <td><button class="btn-ver-detalles">Ver Detalles</button></td>
      `;
  
      const boton = fila.querySelector(".btn-ver-detalles");
      boton.addEventListener("click", () => verDetallesHistorial(cliente.Id_cliente));
  
      tbody.appendChild(fila);
    });
  }
  
  function verDetallesHistorial(id) {
    const cliente = listaClientes.find(c => c.Id_cliente === id);
    if (!cliente) return;
  
    document.getElementById("detalleNombreCliente").value = `${cliente.Nombres} ${cliente.Apellidos}`;
    document.getElementById("detalleTelefonoCliente").value = cliente.Telefono;
    document.getElementById("detalleCorreoCliente").value = cliente.Correo;
    document.getElementById("detalleFechaConsulta").value = cliente.Fecha_registro;
    document.getElementById("detalleDiagnosticoCliente").value = cliente.Diagnostico;
    document.getElementById("detalleTratamientoCliente").value = cliente.Tratamiento;
    document.getElementById("detalleEdadCliente").value = cliente.Edad;
    document.getElementById("detalleObservacionesCliente").value = cliente.Observaciones;
  
    document.getElementById("modalDetallesHistorial").style.display = "flex";
  }
  
  function cerrarModalHistorial() {
    document.getElementById("modalDetallesHistorial").style.display = "none";
  }
  
  document.addEventListener("DOMContentLoaded", cargarHistorialClinico);
  