const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user.routes');
const db = require('./config/db');
const productsRoutes = require('./routes/product.routes');
const pedidoRoutes = require('./routes/pedido.routes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', userRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/pedidos', pedidoRoutes);


// Probar conexión a la base de datos
db.query('SELECT 1')
  .then(() => console.log('Conectado a MySQL'))
  .catch(err => console.error('Error de conexión:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});
