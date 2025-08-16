const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user.routes');
const productsRoutes = require('./routes/product.routes');
const pedidoRoutes = require('./routes/pedido.routes');
const db = require('./config/db');

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use('/api/auth', userRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/pedidos', pedidoRoutes);

// Probar conexión a la base de datos
db.query('SELECT 1')
  .then(() => console.log('✅ Conectado a MySQL'))
  .catch(err => {
    console.error('❌ Error de conexión a MySQL:', err.message || err);
    process.exit(1); // Detiene el servidor si no hay conexión
  });

// Puerto dinámico para Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});