$(document).ready(function() {
    var url = 'http://localhost:3000/api/Proveedores';

    var table = $('#tablaProveedores').DataTable({
        "ajax": {
            "url": url,
            "dataSrc": ""
        },
        "columns": [
            { "data": "Id_proveedor" , "visible": false},
            { "data": "Nombre" },
            { "data": "Telefono" },
            { "data": "Correo" },
            {
                "data": null,
                "defaultContent": "<button class='btn-detalles'>Detalles</button>"
            }
        ],
        "language": {
            "url": "//cdn.datatables.net/plug-ins/1.11.3/i18n/es_es.json"
        }
    });

    // Lógica para el botón Detalles
    $('#tablaProveedores tbody').on('click', '.btn-detalles', function () {
        var data = table.row($(this).parents('tr')).data();
        var proveedorId = data.Id_proveedor; // Usa el Id_proveedor de ese proveedor

        $.ajax({
            url: `http://localhost:3000/api/proveedores/${proveedorId}/productos`,
            method: 'GET',
            success: function(productos) {
                var tbody = $('#tablaProductos tbody');
                tbody.empty(); // Limpiar tabla anterior

                productos.forEach(function(producto) {
                    tbody.append(`
                        <tr>
                            <td class="modal-nombre">${producto.Nombre}</td>
                            <td class="modal-nombre">${producto.Cantidad}</td>
                        </tr>
                    `);
                });

                // Mostrar el modal
                $('#modalProductos').fadeIn();
            },
            error: function() {
                alert('Error al cargar los productos.');
            }
        });
    });

    // Cerrar el modal
    $('.close').on('click', function() {
        $('#modalProductos').fadeOut();
    });

    // Cerrar modal al hacer click fuera del contenido
    $(window).on('click', function(event) {
        if (event.target.id === 'modalProductos') {
            $('#modalProductos').fadeOut();
        }
    });
});