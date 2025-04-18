// server.js
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const db      = require('./backend/db');

const app = express();
app.use(cors());
app.use(express.json());

// Servir archivos estáticos desde /public
app.use(express.static(path.join(__dirname, 'public')));

// Leer todos los clientes
app.get('/api/clientes', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM Clientes ORDER BY Fecha_registro DESC'
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al leer clientes' });
  }
});

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

// Login de usuario (devuelve userId y firstName)
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
      message:   'OK',
      userId:    user.Id_empleado,
      firstName: user.Nombres
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al autenticar' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

