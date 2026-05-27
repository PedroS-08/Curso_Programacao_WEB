const topics = [
  {
    id: "api",
    label: "REST API",
    icon: "ti-api",
    desc: "Criar endpoints de uma API RESTful com autenticação e validação",
    bad: {
      prompt: `Crie uma API para o meu sistema.`,
      reasons: [
        "Não especifica a linguagem ou framework",
        "Não define o domínio",
        "Sem mencionar autenticação",
        "IA vai inventar algo genérico"
      ]
    },
    good: {
      prompt: `Crie uma API REST em Node.js com Express para gerenciar produtos de um ecommerce.\nRequisitos:\n- Endpoints: GET /products, POST /products\n- Validação com Zod e Prisma ORM`,
      reasons: [
        "Define linguagem e banco",
        "Verbos HTTP corretos",
        "Bibliotecas concretas",
        "Formato esperado"
      ]
    },
    missing: ["Linguagem", "Domínio", "Autenticação", "Banco"],
    highlights: ["Node.js + Express", "JWT + Zod", "Endpoints", "Formato de erro"]
  },
  {
    id: "refactor",
    label: "Refatoração",
    icon: "ti-tools",
    desc: "Melhorar a qualidade e legibilidade do código",
    bad: {
      prompt: `Melhore esse código.`,
      reasons: [
        "Não mostra o código",
        "Subjetivo",
        "Sem critérios",
        "Pode quebrar comportamento"
      ]
    },
    good: {
      prompt: `Refatore o seguinte código focando em: 1. DRY, 2. Legibilidade. Não altere o comportamento externo.`,
      reasons: [
        "Objetivos claros",
        "Pede explicação",
        "Garante comportamento",
        "Type hints"
      ]
    },
    missing: ["Código original", "Objetivo", "Restrições", "Linguagem"],
    highlights: ["Objetivos", "Sem alterar comportamento", "Explicação", "Type hints"]
  },
  {
    id: "auth",
    label: "Autenticação",
    icon: "ti-lock",
    desc: "Implementar login, controle de sessão e proteção de rotas",
    bad: {
      prompt: `Crie um sistema de login.`,
      reasons: [
        "Sem tecnologia",
        "Não especifica método",
        "Não menciona sessão",
        "Implementação insegura"
      ]
    },
    good: {
      prompt: `Implemente autenticação API Next.js 14, login e-mail/senha bcrypt, JWT httpOnly.`,
      reasons: [
        "Stack exata",
        "Hash bcrypt",
        "Estratégia JWT",
        "Status HTTP esperados"
      ]
    },
    missing: ["Stack", "Método", "Sessão", "Regras"],
    highlights: ["Next.js 14", "bcrypt + JWT", "Middleware", "Regras de segurança"]
  }
];

let current = 0;

function escHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function render() {
  const t = topics[current];
  document.getElementById('counter').textContent = `${current + 1} de ${topics.length}`;
  document.getElementById('topic-title').textContent = t.desc;

  const tabs = document.getElementById('tabs');
  tabs.innerHTML = '';
  topics.forEach((tp, i) => {
    const btn = document.createElement('button');
    btn.className = 'pe-tab' + (i === current ? ' active' : '');
    btn.innerHTML = `<i class="ti ${tp.icon}" style="font-size:14px;margin-right:4px;"></i>${tp.label}`;
    btn.onclick = () => { current = i; render(); };
    tabs.appendChild(btn);
  });

  document.getElementById('compare').innerHTML = `
    <div class="pe-side">
      <div class="pe-side-header bad">Prompt ruim</div>
      <div class="pe-prompt">${escHtml(t.bad.prompt)}</div>
      <div class="pe-why">${t.bad.reasons.map(r => `• ${r}`).join('<br>')}</div>
    </div>
    <div class="pe-side">
      <div class="pe-side-header good">Prompt eficaz</div>
      <div class="pe-prompt">${escHtml(t.good.prompt)}</div>
      <div class="pe-why">${t.good.reasons.map(r => `• ${r}`).join('<br>')}</div>
    </div>
  `;
}

function nav(dir) {
  current = Math.max(0, Math.min(topics.length - 1, current + dir));
  render();
}

function checkQuiz() {
  const q1 = document.querySelector('input[name="q1"]:checked');
  const q2 = document.querySelector('input[name="q2"]:checked');
  const resultDiv = document.getElementById('quiz-result');
  resultDiv.classList.remove('hidden', 'success', 'error');

  if (!q1 || !q2) {
    resultDiv.textContent = "Por favor, responda todas as questões antes de enviar.";
    resultDiv.classList.add('error');
    return;
  }

  if (q1.value === 'B' && q2.value === 'A') {
    resultDiv.innerHTML = "🎉 Parabéns! Você compreendeu os conceitos.";
    resultDiv.classList.add('success');
    document.querySelector('.btn-submit').style.display = 'none';
  } else {
    resultDiv.textContent = "❌ Respostas incorretas. Tente novamente.";
    resultDiv.classList.add('error');
  }
}

render();
