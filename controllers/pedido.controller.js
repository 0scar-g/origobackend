const pool = require('../config/db');

exports.crearPedido = async (req, res) => {
  try {
    const usuario_id = req.user.id;
    const { productos } = req.body;
    
    const fechaActual = new Date();
    let total = 0;

    // Primero calculamos el total
    for (const item of productos) {
      const [productoRows] = await pool.query(
        'SELECT precio FROM productos WHERE id = ?',
        [item.producto_id]
      );

      if (productoRows.length === 0) {
        return res.status(404).json({ message: `Producto con ID ${item.producto_id} no encontrado` });
      }

      total += productoRows[0].precio * item.cantidad;
    }

    // Insertamos en la tabla pedidos con fecha, total y estado
    const [pedidoResult] = await pool.query(
      'INSERT INTO pedidos (usuario_id, fecha, total, estado) VALUES (?, ?, ?, ?)',
      [usuario_id, fechaActual, total, 'pendiente']
    );

    const pedido_id = pedidoResult.insertId;
    const productosDetalles = [];

    for (const item of productos) {
      // Obtener info del producto
      const [productoRows] = await pool.query(
        'SELECT nombre, stock, precio FROM productos WHERE id = ?',
        [item.producto_id]
      );

      if (productoRows.length === 0) {
        return res.status(404).json({ message: `Producto con ID ${item.producto_id} no encontrado` });
      }

      const producto = productoRows[0];

      // Validar stock
      if (producto.stock < item.cantidad) {
        return res.status(400).json({ message: `Stock insuficiente para ${producto.nombre}` });
      }

      const precio_unitario = producto.precio;
      const subtotal = item.cantidad * precio_unitario;

      // Insertar en detalle_pedidos
      await pool.query(
        'INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)',
        [pedido_id, item.producto_id, item.cantidad, precio_unitario, subtotal]
      );

      // Actualizar stock
      await pool.query(
        'UPDATE productos SET stock = stock - ? WHERE id = ?',
        [item.cantidad, item.producto_id]
      );

      productosDetalles.push({
        producto_id: item.producto_id,
        nombre: producto.nombre,
        cantidad: item.cantidad,
        precio_unitario,
        subtotal
      });
    }

    res.status(201).json({
      message: 'Pedido creado correctamente',
      pedido_id,
      productos: productosDetalles,
      total,
      estado: 'pendiente',
      fecha: fechaActual
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el pedido' });
  }

};

exports.obtenerPedidos = async (req, res) => {
  try {
    const [pedidos] = await pool.query(`
      SELECT 
        p.id, 
        p.fecha, 
        p.total, 
        p.estado, 
        u.email AS usuario 
      FROM pedidos p
      JOIN usuarios u ON p.usuario_id = u.id
      ORDER BY p.fecha DESC
    `);

    res.json(pedidos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener pedidos', detalle: err });
  }
};