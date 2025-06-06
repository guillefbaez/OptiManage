const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./backend/db');

const app = express();
app.use(cors());
app.use(express.json());

// Servir archivos estáticos desde /public
app.use(express.static(path.join(__dirname, 'public')));

// ==================== ENDPOINTS DE AUTENTICACIÓN ==================
// Registrar un usuario (Crear Cuenta)
app.post('/api/register', async (req, res) => {
  const { nombres, apellidos, correo, contrasena } = req.body;
  if (!nombres || !apellidos || !correo || !contrasena) {
    return res.status(400).json({ error: 'Faltan datos' });
  }
  try {
    const [result] = await db.query(
      'INSERT INTO Usuarios (Nombres, Apellidos, Correo, Contrasena, Fecha_registro) VALUES (?, ?, ?, ?, CURDATE())',
      [nombres, apellidos, correo, contrasena]
    );
    res.status(201).json({ id: result.insertId });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al registrar' });
  }
});

// Login de usuario
app.post('/api/login', async (req, res) => {
  const { correo, contrasena } = req.body;
  if (!correo || !contrasena) {
    return res.status(400).json({ error: 'Faltan datos' });
  }
  try {
    const [rows] = await db.query(
      'SELECT Id_empleado, Nombres FROM Usuarios WHERE Correo = ? AND Contrasena = ?',
      [correo, contrasena]
    );
    if (!rows.length) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    const user = rows[0];
    res.json({
      message: 'OK',
      userId: user.Id_empleado,
      firstName: user.Nombres
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al autenticar' });
  }
});

// ==================== ENDPOINTS DE CLIENTES ====================
// Leer todos los clientes
app.get('/api/clientes', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Clientes ORDER BY Fecha_registro DESC');
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al leer clientes' });
  }
});

// Crear un nuevo cliente
app.post('/api/clientes', async (req, res) => {
  const { nombres, apellidos, telefono, correo, fecha_registro } = req.body;

  // Verificar que los campos obligatorios estén completos
  if (!nombres || !apellidos) {
    return res.status(400).json({ error: 'El nombre y el apellido son obligatorios' });
  }

  // Si la fecha está vacía, asignar la fecha actual
  const fecha = fecha_registro || new Date().toISOString().split('T')[0];

  try {
    // Insertar el nuevo cliente en la base de datos
    const [result] = await db.query(
      'INSERT INTO Clientes (Nombres, Apellidos, Telefono, Correo, Fecha_registro) VALUES (?, ?, ?, ?, ?)',
      [nombres, apellidos, telefono, correo, fecha]
    );

    res.status(201).json({ message: 'Cliente agregado correctamente', id: result.insertId });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al agregar cliente' });
  }
});

// Actualizar cliente existente
app.put('/api/clientes/:id', async (req, res) => {
  const { id } = req.params;
  const { nombres, apellidos, telefono, correo, fecha_registro } = req.body;

  if (!nombres || !apellidos) {
    return res.status(400).json({ error: 'El nombre y el apellido son obligatorios' });
  }

  const fecha = fecha_registro || new Date().toISOString().split('T')[0];

  try {
    const [result] = await db.query(
      'UPDATE Clientes SET Nombres = ?, Apellidos = ?, Telefono = ?, Correo = ?, Fecha_registro = ? WHERE Id_cliente = ?',
      [nombres, apellidos, telefono, correo, fecha, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json({ message: 'Cliente actualizado correctamente' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al actualizar cliente' });
  }
});

// Eliminar un cliente por ID
app.delete('/api/clientes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query(
      'DELETE FROM Clientes WHERE Id_cliente = ?',
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json({ message: 'Cliente eliminado correctamente' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al eliminar cliente' });
  }
});


// ==================== ENDPOINTS DE PROVEEDORES ====================
// Leer todos los proveedores
app.get('/api/proveedores', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Proveedores ORDER BY Nombre ASC');
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al leer proveedores' });
  }
});

// Leer productos de un proveedor específico
app.get('/api/proveedores/:id/productos', async (req, res) => {
  const proveedorId = req.params.id;
  try {
    const [rows] = await db.query(
      'SELECT Nombre, Cantidad FROM Productos WHERE Id_proveedor = ?',
      [proveedorId]
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al leer productos del proveedor' });
  }
});

// Agregar un nuevo proveedor
app.post('/api/proveedores', async (req, res) => {
  const { nombre, telefono, correo } = req.body;

  if (!nombre || !telefono || !correo) {
    return res.status(400).json({ error: 'Por favor complete todos los campos' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO Proveedores (Nombre, Telefono, Correo) VALUES (?, ?, ?)',
      [nombre, telefono, correo]
    );
    res.status(201).json({ message: 'Proveedor agregado correctamente', id: result.insertId });
  } catch (e) {
    console.error('Error al insertar proveedor:', e);
    res.status(500).json({ error: 'Error al agregar proveedor' });
  }
});

// Eliminar un proveedor por ID
app.delete('/api/proveedores/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query(
      'DELETE FROM Proveedores WHERE Id_proveedor = ?',
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }
    res.json({ message: 'Proveedor eliminado correctamente' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al eliminar Proveedor' });
  }
});

// ==================== ENDPOINTS DE REPORTES ====================

app.get('/api/historial_clinico', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT c.Id_cliente, c.Nombres, c.Apellidos, COUNT(h.Id_cliente) AS veces
      FROM historial_clinico h
      JOIN clientes c ON h.Id_cliente = c.Id_cliente
      GROUP BY c.Id_cliente, c.Nombres, c.Apellidos
      HAVING veces >= 3
    `);
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al obtener clientes frecuentes' });
  }
});

app.get('/api/reportes/inventario', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.Nombre AS Producto, p.Cantidad, p.Id_proveedor, pr.Nombre AS NombreProveedor
      FROM Productos p
      JOIN Proveedores pr ON p.Id_proveedor = pr.Id_proveedor
    `);
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al obtener el inventario' });
  }
});


app.get('/api/productos', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Productos');
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al leer proveedores' });
  }
});

app.post('/api/productos', async (req, res) => {
  const {Nombre, Color, Cantidad, Precio, Tipo_lente, Graduacion_OI, Graduacion_OD, Descripcion } = req.body;

  try {
    const [result] = await db.query(
      'INSERT INTO Productos (Nombre, Color, Cantidad, Precio, Tipo_lente, Graduacion_OD, Graduacion_OI, Descripcion) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [Nombre, Color, Cantidad, Precio, Tipo_lente, Graduacion_OI, Graduacion_OD, Descripcion]
    );
    res.status(201).json({ message: 'Producto agregado correctamente', id: result.insertId });
  } catch (e) {
    console.error('Error al insertar producto:', e);
    res.status(500).json({ error: 'Error al agregar producto' });
  }
});

app.delete('/api/productos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query(
      'DELETE FROM Productos WHERE Id_producto = ?',
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al eliminar prodcuto' });
  }
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});