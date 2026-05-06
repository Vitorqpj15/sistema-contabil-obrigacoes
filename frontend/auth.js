const API_URL = 'http://localhost:3000';

// ================================
// FUNÇÃO — Ir para etapa 2 do cadastro
// Valida os campos antes de avançar
// ================================
const API_URL = 'http://localhost:3000';

// ================================
// Salva dados temporários da etapa 1
// para usar na página de dados físicos
// ================================
function irParaDadosFisicos() {
  const nome = document.getElementById('nomeRegistro').value.trim();
  const email = document.getElementById('emailRegistro').value.trim();
  const senha = document.getElementById('senhaRegistro').value;
  const confirmarSenha = document.getElementById('confirmarSenha').value;
  const msg = document.getElementById('msgRegistro');

  if (!nome || !email || !senha || !confirmarSenha) {
    mostrarMensagem(msg, 'Preencha todos os campos!', 'erro');
    return;
  }

  if (senha !== confirmarSenha) {
    mostrarMensagem(msg, 'As senhas não coincidem!', 'erro');
    return;
  }

  if (senha.length < 6) {
    mostrarMensagem(msg, 'A senha deve ter no mínimo 6 caracteres!', 'erro');
    return;
  }

  // Salva temporariamente no sessionStorage
  // sessionStorage = igual localStorage mas apaga ao fechar o navegador
  sessionStorage.setItem('registro_temp', JSON.stringify({ nome, email, senha }));

  // Redireciona para a página de dados físicos
  window.location.href = 'dados-fisicos.html';
}

// ================================
// FUNÇÃO — Fazer login
// ================================
async function fazerLogin() {
  const email = document.getElementById('emailLogin').value.trim();
  const senha = document.getElementById('senhaLogin').value;
  const msg = document.getElementById('msgLogin');

  if (!email || !senha) {
    mostrarMensagem(msg, 'Preencha todos os campos!', 'erro');
    return;
  }

  try {
    const resposta = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });

    const dados = await resposta.json();

    if (resposta.ok) {
      localStorage.setItem('token', dados.token);
      localStorage.setItem('usuario', JSON.stringify(dados.usuario));
      mostrarMensagem(msg, '✅ Login realizado! Redirecionando...', 'sucesso');
      setTimeout(() => { window.location.href = 'index.html'; }, 1500);
    } else {
      mostrarMensagem(msg, dados.erro, 'erro');
    }

  } catch (erro) {
    mostrarMensagem(msg, 'Erro de conexão com o servidor.', 'erro');
  }
}

// ================================
// FUNÇÃO AUXILIAR — Mostrar mensagens
// ================================
function mostrarMensagem(elemento, texto, tipo) {
  elemento.textContent = texto;
  elemento.className = `mensagem ${tipo}`;
  setTimeout(() => {
    elemento.textContent = '';
    elemento.className = 'mensagem';
  }, 3000);
}

// ================================
// FUNÇÃO — Voltar para etapa 1
// ================================
function voltarParaEtapa1() {
  document.getElementById('etapa1').style.display = 'block';
  document.getElementById('etapa2').style.display = 'none';
}

// ================================
// FUNÇÃO — Finalizar cadastro
// Envia todos os dados para a API
// ================================
async function finalizarCadastro() {
  const msg = document.getElementById('msgEtapa2');

  // Pega os dados da etapa 1
  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value;

  // Pega os dados da etapa 2
  const peso_kg = document.getElementById('peso').value;
  const altura_cm = document.getElementById('altura').value;
  const objetivo_peso_kg = document.getElementById('objetivoPeso').value;
  const meta_calorias = document.getElementById('metaCalorias').value;
  const percentual_gordura = document.getElementById('percentualGordura').value;
  const nivel_atividade = document.getElementById('nivelAtividade').value;

  try {
    const resposta = await fetch(`${API_URL}/auth/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome,
        email,
        senha,
        peso_kg: peso_kg ? parseFloat(peso_kg) : null,
        altura_cm: altura_cm ? parseInt(altura_cm) : null,
        objetivo_peso_kg: objetivo_peso_kg ? parseFloat(objetivo_peso_kg) : null,
        meta_calorias: meta_calorias ? parseInt(meta_calorias) : null,
        percentual_gordura: percentual_gordura ? parseFloat(percentual_gordura) : null,
        nivel_atividade: nivel_atividade || null
      })
    });

    const dados = await resposta.json();

    if (resposta.ok) {
      // Salva o token no localStorage
      // localStorage = armazenamento do navegador que persiste entre páginas
      localStorage.setItem('token', dados.token);
      localStorage.setItem('usuario', JSON.stringify(dados.usuario));

      mostrarMensagem(msg, '✅ Cadastro realizado! Redirecionando...', 'sucesso');

      // Redireciona para a página principal após 1.5 segundos
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);

    } else {
      mostrarMensagem(msg, dados.erro, 'erro');
    }

  } catch (erro) {
    mostrarMensagem(msg, 'Erro de conexão com o servidor.', 'erro');
  }
}

// ================================
// FUNÇÃO — Fazer login
// ================================
async function fazerLogin() {
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value;
  const msg = document.getElementById('msgLogin');

  if (!email || !senha) {
    mostrarMensagem(msg, 'Preencha todos os campos!', 'erro');
    return;
  }

  try {
    const resposta = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });

    const dados = await resposta.json();

    if (resposta.ok) {
      // Salva o token e redireciona
      localStorage.setItem('token', dados.token);
      localStorage.setItem('usuario', JSON.stringify(dados.usuario));

      mostrarMensagem(msg, '✅ Login realizado! Redirecionando...', 'sucesso');

      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);

    } else {
      mostrarMensagem(msg, dados.erro, 'erro');
    }

  } catch (erro) {
    mostrarMensagem(msg, 'Erro de conexão com o servidor.', 'erro');
  }
}

// ================================
// FUNÇÃO AUXILIAR — Mostrar mensagens
// ================================
function mostrarMensagem(elemento, texto, tipo) {
  elemento.textContent = texto;
  elemento.className = `mensagem ${tipo}`;

  setTimeout(() => {
    elemento.textContent = '';
    elemento.className = 'mensagem';
  }, 3000);
}