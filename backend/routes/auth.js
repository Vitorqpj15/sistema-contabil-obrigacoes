const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ================================
// ROTA 1 — Registrar novo usuário
// POST /auth/registro
// ================================
router.post('/registro', async (req, res) => {
  const {
    nome,
    email,
    senha,
    peso_kg,
    altura_cm,
    objetivo_peso_kg,
    meta_calorias,
    percentual_gordura,
    nivel_atividade
  } = req.body;

  // Validação básica
  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios!' });
  }

  try {
    // Verifica se o email já existe no banco
    const emailExiste = await pool.query(
      'SELECT id FROM usuarios WHERE email = $1',
      [email]
    );

    if (emailExiste.rows.length > 0) {
      return res.status(400).json({ erro: 'Este email já está cadastrado!' });
    }

    // Criptografa a senha — o número 10 é o "custo" da criptografia
    // Quanto maior, mais seguro e mais lento. 10 é o padrão recomendado
    const senhaHash = await bcrypt.hash(senha, 10);

    // Insere o usuário no banco
    const novoUsuario = await pool.query(
      'INSERT INTO usuarios (nome, email, senha_hash) VALUES ($1, $2, $3) RETURNING id, nome, email',
      [nome, email, senhaHash]
    );

    const usuario = novoUsuario.rows[0];

    // Insere o perfil físico do usuário
    await pool.query(
      `INSERT INTO perfis 
        (usuario_id, peso_kg, altura_cm, objetivo_peso_kg, meta_calorias, percentual_gordura, nivel_atividade) 
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        usuario.id,
        peso_kg || null,
        altura_cm || null,
        objetivo_peso_kg || null,
        meta_calorias || null,
        percentual_gordura || null,
        nivel_atividade || null
      ]
    );

    // Gera o token JWT
    // O token carrega o id e email do usuário
    // process.env.JWT_SECRET é a "chave secreta" usada para assinar o token
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // token válido por 7 dias
    );

    res.status(201).json({
      mensagem: 'Usuário cadastrado com sucesso!',
      token,
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email }
    });

  } catch (erro) {
    console.log('Erro no registro:', erro);
    res.status(500).json({ erro: erro.message });
  }
});

// ================================
// ROTA 2 — Login
// POST /auth/login
// ================================
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Email e senha são obrigatórios!' });
  }

  try {
    // Busca o usuário pelo email
    const resultado = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    );

    if (resultado.rows.length === 0) {
      return res.status(401).json({ erro: 'Email ou senha incorretos!' });
    }

    const usuario = resultado.rows[0];

    // Compara a senha digitada com o hash salvo no banco
    // bcrypt.compare faz isso de forma segura
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);

    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Email ou senha incorretos!' });
    }

    // Gera o token JWT
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      mensagem: 'Login realizado com sucesso!',
      token,
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email }
    });

  } catch (erro) {
    console.log('Erro no login:', erro);
    res.status(500).json({ erro: erro.message });
  }
});

module.exports = router;