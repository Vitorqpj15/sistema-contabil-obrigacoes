const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Teste de conexão — vamos ver se consegue falar com o banco
pool.connect((err, client, release) => {
  if (err) {
    console.log('ERRO NA CONEXÃO:', err.message);
  } else {
    console.log('✅ Conectado ao PostgreSQL com sucesso!');
    release();
  }
});

module.exports = pool;