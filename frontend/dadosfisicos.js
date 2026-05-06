const API_URL = 'http://localhost:3000';

// Verifica se veio da etapa 1
// Se não tiver dados temporários, volta para o início
const dadosTemp = sessionStorage.getItem('registro_temp');
if (!dadosTemp) {
  window.location.href = 'login.html';
}

async function finalizarCadastro() {
  const msg = document.getElementById('msgFisicos');
  const { nome, email, senha } = JSON.parse(dadosTemp);

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
        nome, email, senha,
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
      // Limpa os dados temporários
      sessionStorage.removeItem('registro_temp');

      localStorage.setItem('token', dados.token);
      localStorage.setItem('usuario', JSON.stringify(dados.usuario));

      mostrarMensagem(msg, '✅ Cadastro realizado! Redirecionando...', 'sucesso');
      setTimeout(() => { window.location.href = 'index.html'; }, 1500);
    } else {
      mostrarMensagem(msg, dados.erro, 'erro');
    }

  } catch (erro) {
    mostrarMensagem(msg, 'Erro de conexão com o servidor.', 'erro');
  }
}

function mostrarMensagem(elemento, texto, tipo) {
  elemento.textContent = texto;
  elemento.className = `mensagem ${tipo}`;
  setTimeout(() => {
    elemento.textContent = '';
    elemento.className = 'mensagem';
  }, 3000);
}