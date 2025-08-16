const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');
const { crearPedido, obtenerPedidos } = require('../controllers/pedido.controller');

// Registrar pedido
router.post('/', auth, crearPedido);

// Obtener todos los pedidos
router.get('/', auth, obtenerPedidos);

// Actualizar estado
router.put('/:id/estado', auth, async (req, res) => {
  const pedidoId = req.params.id;
  const { estado } = req.body;

  const estadosPermitidos = ['pendiente', 'entregado', 'cancelado'];

  if (!estadosPermitidos.includes(estado)) {
    return res.status(400).json({ mensaje: 'Estado no válido' });
  }

  try {
    const [result] = await db.query('UPDATE pedidos SET estado = ? WHERE id = ?', [estado, pedidoId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }

    res.json({ mensaje: `Estado del pedido actualizado a '${estado}'` });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar estado del pedido', detalle: err });
  }
});

module.exports = router;
