const jwt = require('jsonwebtoken');
const db = require('../config/db');

const SECRET_KEY = 'clave_secreta'; // Usa una mejor en producción

// 🔐 LOGIN
exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM usuarios WHERE email = ? AND password = ?', [email, password])
    .then(([rows]) => {
      if (rows.length > 0) {
        const user = rows[0];

        const token = jwt.sign(
          {
            id: user.id,
            nombre: user.nombre,
            rol: user.rol,
          },
          SECRET_KEY,
          { expiresIn: '1h' }
        );

        res.json({
          token,
          rol: user.rol
        });
      } else {
        res.status(401).json({ message: 'Credenciales incorrectas' });
      }
    })
    .catch(err => res.status(500).json({ error: err.message }));
};

// ✅ REGISTRO
exports.registrar = (req, res) => {
  const { nombre, email, password } = req.body;

  const rol = 'cliente';

  db.query('INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
    [nombre, email, password, rol])
    .then(() => {
      res.status(201).json({ message: 'Usuario registrado correctamente' });
    })
    .catch(err => {
      console.error('Error al registrar usuario:', err);
      res.status(500).json({ error: 'Error al registrar usuario' });
    });
};
