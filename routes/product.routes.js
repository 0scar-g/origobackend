const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, nombre, tipo AS categoria, precio, imagen_url FROM productos');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener productos', detalle: err });
  }
});

// Agregar nuevo producto
router.post('/', auth, async (req, res) => {
  const { nombre, descripcion, precio, stock, imagen_url, categoria } = req.body;
  try {
    await db.query(
      'INSERT INTO productos (nombre, descripcion, precio, stock, imagen_url, categoria) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, descripcion, precio, stock, imagen_url, categoria]
    );
    res.json({ mensaje: 'Producto agregado exitosamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al agregar producto', detalle: err });
  }
});

// Actualizar producto
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, stock, imagen_url, categoria } = req.body;
  try {
    await db.query(
      'UPDATE productos SET nombre=?, descripcion=?, precio=?, stock=?, imagen_url=?, categoria=? WHERE id=?',
      [nombre, descripcion, precio, stock, imagen_url, categoria, id]
    );
    res.json({ mensaje: 'Producto actualizado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar producto', detalle: err });
  }
});

// Eliminar producto
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM productos WHERE id = ?', [id]);
    res.json({ mensaje: 'Producto eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar producto', detalle: err });
  }
});

module.exports = router;
