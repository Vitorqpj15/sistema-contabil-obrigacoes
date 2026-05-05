const express = require('express');
const router = express.Router();
const pool = require('../db'); 


router.get('/', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM alimentos ORDER BY nome');
    res.json(resultado.rows);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});


router.post('/', async (req, res) => {

console.log("📥 Recebi uma tentativa de POST!"); // Adicione isso aqui
  console.log("Corpo da requisição:", req.body);  // E isso aqui
  const { nome, calorias_por_100g } = req.body;

  try {
    const resultado = await pool.query(
      'INSERT INTO alimentos (nome, calorias_por_100g) VALUES ($1, $2) RETURNING *',
      [nome, calorias_por_100g]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (erro) {
    console.log('ERRO COMPLETO:', erro); 
    res.status(500).json({ erro: erro.message, detalhe: erro });
  }
});


router.post('/registros', async (req, res) => {
  const { alimento_id, quantidade_g } = req.body;

  try {
    const resultado = await pool.query(
      'INSERT INTO registros (alimento_id, quantidade_g) VALUES ($1, $2) RETURNING *',
      [alimento_id, quantidade_g]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});


router.get('/registros', async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT 
        r.id,
        a.nome,
        r.quantidade_g,
        r.data,
        -- Calcula as calorias com base na quantidade consumida
        ROUND((a.calorias_por_100g / 100) * r.quantidade_g, 2) AS calorias
      FROM registros r
      -- JOIN = junta as duas tabelas pelo alimento_id
      JOIN alimentos a ON r.alimento_id = a.id
      WHERE r.data = CURRENT_DATE
      ORDER BY r.id DESC
    `);
    res.json(resultado.rows);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

module.exports = router;