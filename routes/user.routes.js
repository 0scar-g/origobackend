const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const userController = require('../controllers/user.controller');

// Registro de usuario
router.post('/registro', async (req, res) => {
  const { nombre, email, password } = req.body;
  try {
    const [existing] = await db.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(400).json({ mensaje: 'Correo ya registrado' });

    const hashedPass = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)', [nombre, email, hashedPass]);

    res.json({ mensaje: 'Usuario registrado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor', detalle: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  console.log('BODY del login:', req.body); 
  const { email, password } = req.body;
  try {
    const [usuarios] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (usuarios.length === 0) return res.status(400).json({ mensaje: 'Usuario no encontrado' });

    const usuario = usuarios[0];
    const match = await bcrypt.compare(password, usuario.password);
    if (!match) return res.status(400).json({ mensaje: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: usuario.id, nombre: usuario.nombre, rol: usuario.rol }, 'secreto123', { expiresIn: '1h' });
    res.json({ mensaje: 'Login exitoso', token });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor', detalle: error.message });
  }
});

module.exports = router;
