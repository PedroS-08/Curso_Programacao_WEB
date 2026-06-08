// Estado global salvo
let VDS_USUARIO_ATUAL = null;   // {login atual} ou null
let VDS_RELATOS = [];     // relatos do usuário logado (sessão)

// Inicialização
document.addEventListener('DOMContentLoaded', () => {

  // Restaura sessão salva
  _sessaoRestaurar();

  // Preenche a data de hoje no campo de data
  const campoData = document.getElementById('r-data');
  if (campoData) campoData.value = new Date().toISOString().split('T')[0];

  // Preview de foto do relato
  document.getElementById('r-foto-input')?.addEventListener('change', function () {
    if (!this.files[0]) return;
    const reader = new FileReader();
    reader.onload = e => mostrarPreviewFoto(e.target.result);
    reader.readAsDataURL(this.files[0]);
  });

  // Foto de perfil
  document.getElementById('perfil-foto-input')?.addEventListener('change', function () {
    if (!this.files[0]) return;
    const reader = new FileReader();
    reader.onload = e => {
      const img = document.getElementById('perfil-avatar-img');
      img.src   = e.target.result;
      img.style.display = 'block';
      document.querySelector('.perfil-avatar-icone').style.display = 'none';
      // mantem foto na sessão
      _sessaoSalvar({ foto: e.target.result });
    };
    reader.readAsDataURL(this.files[0]);
  });
});


// LocalStorage salvar sessão

function _sessaoSalvar(extras = {}) {
  if (!VDS_USUARIO_ATUAL) return;
  const dados = { ...VDS_USUARIO_ATUAL, ...extras };
  localStorage.setItem('vds_sessao', JSON.stringify(dados));
}

function _sessaoRestaurar() {
  const raw = localStorage.getItem('vds_sessao');
  if (!raw) return;
  try {
    const dados = JSON.parse(raw);
    if (dados?.contato) {
      VDS_USUARIO_ATUAL = { nome: dados.nome, contato: dados.contato };
      _uiEntrarComUsuario(dados.nome, dados.foto || null);
    }
  } catch { localStorage.removeItem('vds_sessao'); }
}

function _sessaoLimpar() {
  localStorage.removeItem('vds_sessao');
  VDS_USUARIO_ATUAL = null;
  VDS_RELATOS = [];
}


// Foto preview

function mostrarPreviewFoto(src) {
  const area = document.getElementById('rel-preview-area');
  if (!area) return;
  area.innerHTML = `<img src="${src}" alt="Foto do problema" />`;
  area.style.borderStyle = 'solid';
  area.style.borderColor = 'rgba(201,168,76,.28)';
  document.getElementById('rel-btn-remove-foto').style.display = 'flex';
}

function removerFoto() {
  const area = document.getElementById('rel-preview-area');
  if (area) {
    area.innerHTML = `
      <span class="material-symbols-outlined rel-preview-placeholder-icone">hide_image</span>
      <p class="rel-preview-placeholder-txt">Nenhuma imagem selecionada</p>`;
    area.style.borderStyle  = 'dashed';
    area.style.borderColor  = 'rgba(201,168,76,.15)';
  }
  const btnRemover = document.getElementById('rel-btn-remove-foto');
  if (btnRemover) btnRemover.style.display = 'none';
  const input = document.getElementById('r-foto-input');
  if (input) input.value = '';
}

function limparRelato() {
  ['r-nome-problema','r-descricao','r-usuario','r-local-texto'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const campoData = document.getElementById('r-data');
  if (campoData) campoData.value = new Date().toISOString().split('T')[0];

  // Reseta categoria
  const sel = document.getElementById('r-categoria');
  if (sel) sel.value = '';

  removerFoto();
}


// Enviar relato

async function enviarRelato() {
  // Precisa estar logado
  if (!VDS_USUARIO_ATUAL) {
    mostrarMensagemRelato('erro', '✕ Faça login antes de enviar um relato.');
    // Redireciona para a aba perfil apos 1.5s
    setTimeout(() => aba('perfil', document.querySelector('.nav-link[title="Perfil"]')), 1500);
    return;
  }

  const nome = document.getElementById('r-nome-problema').value.trim();
  const descricao = document.getElementById('r-descricao').value.trim();
  const local = document.getElementById('r-local-texto').value.trim();
  const data = document.getElementById('r-data').value;
  const categoria = document.getElementById('r-categoria')?.value || '';

  if (!nome) return destacarCampo('r-nome-problema');
  if (!descricao) return destacarCampo('r-descricao');

  const previewImg = document.querySelector('#rel-preview-area img');
  const foto = previewImg ? previewImg.src : null;

  const payload = {
    action: 'relato',
    nome,
    descricao,
    local: local || 'Local não informado',
    usuario: VDS_USUARIO_ATUAL.nome,
    contato: VDS_USUARIO_ATUAL.contato,
    data,
    categoria,
    foto,
  };

  const btnEnviar = document.querySelector('.rel-btn-enviar');
  if (btnEnviar) { btnEnviar.disabled = true; btnEnviar.style.opacity = '0.6'; }

  try {
    const resposta = await fetch('api.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await resposta.json();

    if (resposta.ok && json.status === 'sucesso') {
      mostrarMensagemRelato('sucesso', `✓ ${json.mensagem}`);

      const novoRelato = {
        id: json.id,
        nome,
        descricao,
        local: local || 'Local não informado',
        usuario: VDS_USUARIO_ATUAL.nome,
        contato: VDS_USUARIO_ATUAL.contato,
        data,
        foto,
        categoria,
        joias: 0,
        joiados: false,
      };

      VDS_RELATOS.push(novoRelato);
      ouvidoriaAdicionarRelato(nome, categoria);
      limparRelato();

    } else {
      mostrarMensagemRelato('erro', `✕ ${json.mensagem || 'Ocorreu um erro ao enviar.'}`);
    }

  } catch (erro) {
    console.error('Erro de rede ao enviar relato:', erro);
    mostrarMensagemRelato('erro', '✕ Não foi possível conectar ao servidor. Tente novamente.');
  } finally {
    if (btnEnviar) { btnEnviar.disabled = false; btnEnviar.style.opacity = ''; }
  }
}


// Msg e toasts

function mostrarMensagemRelato(tipo, texto) {
  let el = document.getElementById('rel-msg-feedback');
  if (!el) {
    el = document.createElement('p');
    el.id = 'rel-msg-feedback';
    el.style.cssText = `
      text-align:center;font-family:var(--fonte-ui);font-size:13px;
      letter-spacing:0.06em;padding:10px 20px;border-radius:100px;
      border:1px solid transparent;transition:opacity 0.35s ease;margin-top:4px;`;
    const acoes = document.querySelector('.relatar-acoes');
    if (acoes) acoes.insertAdjacentElement('afterend', el);
  }
  if (tipo === 'sucesso') {
    el.style.color = 'rgba(120,220,140,0.90)';
    el.style.borderColor = 'rgba(120,220,140,0.22)';
    el.style.background  = 'rgba(120,220,140,0.06)';
  } else {
    el.style.color = 'rgba(245,120,120,0.90)';
    el.style.borderColor = 'rgba(245,120,120,0.22)';
    el.style.background  = 'rgba(245,120,120,0.06)';
  }
  el.textContent  = texto;
  el.style.opacity = '1';
  clearTimeout(el._timer);
  el._timer = setTimeout(() => { el.style.opacity = '0'; }, 4000);
}

// Mensagem nos formularios de autenticação
function _authMensagem(formId, tipo, texto) {
  const form = document.getElementById(formId);
  if (!form) return;
  let el = form.querySelector('.auth-msg');
  if (!el) {
    el = document.createElement('p');
    el.className = 'auth-msg';
    el.style.cssText = `
      text-align:center;font-family:var(--fonte-ui);font-size:12.5px;
      letter-spacing:0.05em;padding:9px 18px;border-radius:100px;
      border:1px solid transparent;transition:opacity 0.3s ease;margin-top:-4px;`;
    form.appendChild(el);
  }
  if (tipo === 'sucesso') {
    el.style.color = 'rgba(120,220,140,0.90)';
    el.style.borderColor = 'rgba(120,220,140,0.20)';
    el.style.background = 'rgba(120,220,140,0.06)';
  } else {
    el.style.color = 'rgba(245,120,120,0.90)';
    el.style.borderColor = 'rgba(245,120,120,0.20)';
    el.style.background = 'rgba(245,120,120,0.06)';
  }
  el.textContent = texto;
  el.style.opacity = '1';
  clearTimeout(el._timer);
  el._timer = setTimeout(() => { el.style.opacity = '0'; }, 4500);
}

function mostrarToast(mensagem) {
  let toast = document.getElementById('rel-toast-global');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'rel-toast-global';
    toast.className = 'rel-toast';
    toast.innerHTML = '<span class="material-symbols-outlined rel-toast-icone">check_circle</span><span id="rel-toast-txt"></span>';
    document.body.appendChild(toast);
  }
  document.getElementById('rel-toast-txt').textContent = mensagem;
  toast.classList.add('rel-toast--visivel');
  setTimeout(() => toast.classList.remove('rel-toast--visivel'), 3200);
}

function destacarCampo(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.borderColor = 'rgba(220,80,80,.6)';
  el.style.boxShadow   = '0 0 0 3px rgba(220,80,80,.1)';
  el.focus();
  setTimeout(() => { el.style.borderColor = el.style.boxShadow = ''; }, 2200);
}


// Perfil

function alternarAuthAba(qual) {
  const eCriar = qual === 'criar';
  document.getElementById('auth-form-criar').style.display = eCriar ? 'flex' : 'none';
  document.getElementById('auth-form-login').style.display = eCriar ? 'none' : 'flex';
  document.getElementById('btn-aba-criar').classList.toggle('auth-aba--ativa',  eCriar);
  document.getElementById('btn-aba-login').classList.toggle('auth-aba--ativa', !eCriar);
}

function alternarSenha(inputId, btn) {
  const input   = document.getElementById(inputId);
  const visivel = input.type === 'text';
  input.type    = visivel ? 'password' : 'text';
  btn.querySelector('.material-symbols-outlined').textContent = visivel ? 'visibility' : 'visibility_off';
}

// Criar conta
async function criarConta() {
  const nome    = document.getElementById('auth-nome').value.trim();
  const contato = document.getElementById('auth-contato-criar').value.trim();
  const senha   = document.getElementById('auth-senha-criar').value;

  if (!nome)    return destacarCampo('auth-nome');
  if (!contato) return destacarCampo('auth-contato-criar');
  if (!senha)   return destacarCampo('auth-senha-criar');

  const btn = document.querySelector('#auth-form-criar .auth-btn-principal');
  if (btn) { btn.disabled = true; btn.style.opacity = '0.6'; }

  try {
    const resposta = await fetch('api.php', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ action: 'cadastro', nome, contato, senha }),
    });
    const json = await resposta.json();

    if (resposta.ok && json.status === 'sucesso') {
      VDS_USUARIO_ATUAL = { nome, contato };
      _sessaoSalvar();
      _uiEntrarComUsuario(nome);
      mostrarToast('Conta criada com sucesso!');
    } else {
      _authMensagem('auth-form-criar', 'erro', `✕ ${json.mensagem}`);
    }
  } catch {
    _authMensagem('auth-form-criar', 'erro', '✕ Erro de conexão. Tente novamente.');
  } finally {
    if (btn) { btn.disabled = false; btn.style.opacity = ''; }
  }
}

// Fazer login
async function fazerLogin() {
  const contato = document.getElementById('auth-contato-login').value.trim();
  const senha   = document.getElementById('auth-senha-login').value;

  if (!contato) return destacarCampo('auth-contato-login');
  if (!senha)   return destacarCampo('auth-senha-login');

  const btn = document.querySelector('#auth-form-login .auth-btn-principal');
  if (btn) { btn.disabled = true; btn.style.opacity = '0.6'; }

  try {
    const resposta = await fetch('api.php', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ action: 'login', contato, senha }),
    });
    const json = await resposta.json();

    if (resposta.ok && json.status === 'sucesso') {
      VDS_USUARIO_ATUAL = { nome: json.nome, contato };
      _sessaoSalvar();
      _uiEntrarComUsuario(json.nome);
      mostrarToast('Login realizado com sucesso!');
    } else {
      _authMensagem('auth-form-login', 'erro', `✕ ${json.mensagem}`);
    }
  } catch {
    _authMensagem('auth-form-login', 'erro', '✕ Erro de conexão. Tente novamente.');
  } finally {
    if (btn) { btn.disabled = false; btn.style.opacity = ''; }
  }
}

// Aplica a UI "logado"
function _uiEntrarComUsuario(nome, foto = null) {
  document.getElementById('perfil-nome').textContent = nome;
  document.getElementById('perfil-deslogado').style.display  = 'none';
  document.getElementById('perfil-logado').style.display = 'flex';

  // Preenche o campo "Seu Nome" no formulário de relato
  const campoUsuario = document.getElementById('r-usuario');
  if (campoUsuario) campoUsuario.value = nome;

  // Restaura foto de perfil
  if (foto) {
    const img = document.getElementById('perfil-avatar-img');
    if (img) {
      img.src   = foto;
      img.style.display = 'block';
      const icone = document.querySelector('.perfil-avatar-icone');
      if (icone) icone.style.display = 'none';
    }
  }
}

// Logout
function sair() {
  ['auth-nome','auth-contato-criar','auth-senha-criar',
   'auth-contato-login','auth-senha-login'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const img = document.getElementById('perfil-avatar-img');
  if (img) { img.src = ''; img.style.display = 'none'; }
  const icone = document.querySelector('.perfil-avatar-icone');
  if (icone) icone.style.display = '';
  const fotoInput = document.getElementById('perfil-foto-input');
  if (fotoInput) fotoInput.value = '';

  document.getElementById('perfil-logado').style.display    = 'none';
  document.getElementById('perfil-deslogado').style.display = 'flex';
  alternarAuthAba('criar');

  _sessaoLimpar();
  mostrarToast('Sessão encerrada.');
}


// Aba Ouvidoria

const OUV_CONTATOS = {
  'Buracos': [
    { orgao: 'Secretaria de Obras', desc: 'Manutenção de vias e pavimentação', numero: '(32) 3379-7200', icone: 'construction'},
    { orgao: 'SAAE — Fiscalização', desc: 'Problemas em calçadas e bueiros', numero: '(32) 3379-7300', icone: 'engineering'},
  ],
  'Energia': [
    { orgao: 'CEMIG Atendimento', desc: 'Falta de luz, poste danificado', numero: '0800 721 0196', icone: 'bolt'},
    { orgao: 'Prefeitura — Iluminação', desc: 'Iluminação pública municipal', numero: '(32) 3379-7150', icone: 'light_mode'},
  ],
  'Transportes públicos': [
    { orgao: 'Sec. de Transportes', desc: 'Ônibus, horários e linhas urbanas', numero: '(32) 3379-7400', icone: 'directions_bus'},
    { orgao: 'DFTRANS — Fiscalização', desc: 'Denúncias sobre transporte público',numero: '(32) 3379-7410', icone: 'report'},
  ],
  'Água': [
    { orgao: 'COPASA', desc: 'Abastecimento e esgoto', numero: '0800 031 0056',  icone: 'water_drop'},
    { orgao: 'DAMAE', desc: 'Serviço Autônomo de Água e Esgoto', numero: '(32) 3379-7500', icone: 'plumbing'},
  ],
  'Serviços Públicos': [
    { orgao: 'Prefeitura Municipal', desc: 'Central de atendimento ao cidadão', numero: '(32) 3379-7000', icone: 'apartment'},
    { orgao: 'Ouvidoria Geral', desc: 'Reclamações e sugestões gerais', numero: '(32) 3379-7010', icone: 'headset_mic'},
  ],
};

function ouvidoriaInit() {
  _ouvidoriaPopularSelectRelatos();
}

function _ouvidoriaPopularSelectRelatos() {
  const sel  = document.getElementById('ouv-relato');
  const hint = document.getElementById('ouv-hint-relato');
  if (!sel) return;
  while (sel.options.length > 1) sel.remove(1);
  if (VDS_RELATOS.length === 0) {
    if (hint) hint.style.display = 'flex';
    return;
  }
  if (hint) hint.style.display = 'none';
  VDS_RELATOS.forEach((r, i) => {
    const opt      = document.createElement('option');
    opt.value      = i;
    opt.textContent = r.nome;
    sel.appendChild(opt);
  });
}

function ouvidoriaAtualizar() {
  const selRelato = document.getElementById('ouv-relato');
  const selCat    = document.getElementById('ouv-categoria');
  if (!selRelato || !selCat) return;

  const idx      = selRelato.value;
  let   categoria = selCat.value;

  if (idx !== '' && VDS_RELATOS[idx]) {
    const relato = VDS_RELATOS[idx];
    if (relato.categoria) { selCat.value = categoria = relato.categoria; }
    document.getElementById('ouv-resumo-nome').textContent = relato.nome;
    document.getElementById('ouv-resumo-cat').textContent  = relato.categoria || '—';
    const resumo = document.getElementById('ouv-relato-resumo');
    if (resumo) resumo.style.display = 'flex';
  }

  document.querySelectorAll('.ouv-chip').forEach(c => {
    c.classList.toggle('ouv-chip--ativo', c.textContent.trim().includes(categoria));
  });

  _ouvidoriaRenderContatos(categoria);
}

function ouvidoriaSetCategoria(cat) {
  const sel = document.getElementById('ouv-categoria');
  if (sel) sel.value = cat;
  ouvidoriaAtualizar();
}

function _ouvidoriaRenderContatos(categoria) {
  const vazio  = document.getElementById('ouv-estado-vazio');
  const lista  = document.getElementById('ouv-lista-contatos');
  if (!lista) return;
  const contatos = OUV_CONTATOS[categoria] || [];
  if (!categoria || contatos.length === 0) {
    vazio.style.display = 'flex';
    lista.style.display = 'none';
    lista.innerHTML     = '';
    return;
  }
  vazio.style.display = 'none';
  lista.style.display = 'flex';
  lista.innerHTML = `
    <div class="ouv-divisor">
      <div class="ouv-divisor-linha"></div>
      <span class="ouv-divisor-txt">${categoria}</span>
      <div class="ouv-divisor-linha"></div>
    </div>
    ${contatos.map(c => `
      <div class="ouv-contato-item">
        <div class="ouv-contato-circulo">
          <span class="material-symbols-outlined">${c.icone}</span>
        </div>
        <div class="ouv-contato-info">
          <span class="ouv-contato-orgao">${c.orgao}</span>
          <span class="ouv-contato-desc">${c.desc}</span>
        </div>
        <a href="tel:${c.numero.replace(/\D/g,'')}" class="ouv-contato-numero">
          <span class="material-symbols-outlined" style="font-size:14px">call</span>
          ${c.numero}
        </a>
      </div>
    `).join('')}
  `;
}

function ouvidoriaAdicionarRelato(nome, categoria) {
  _ouvidoriaPopularSelectRelatos();
}


// Visualizar mostrrando relato de todos usuários

async function visualizarInit() {
  const grid  = document.getElementById('vis-grid');
  const vazio = document.getElementById('vis-vazio');
  if (!grid || !vazio) return;

  grid.innerHTML = '<p style="color:rgba(245,230,200,.3);font-family:var(--fonte-serif);font-style:italic;text-align:center;padding:40px">Carregando relatos…</p>';
  vazio.style.display = 'none';
  grid.style.display  = 'block';

  let todos = [];

  try {
    const resposta = await fetch('api.php?action=listar');
    if (resposta.ok) {
      const json = await resposta.json();
      if (json.status === 'sucesso') todos = json.relatos || [];
    }
  } catch {

    todos = VDS_RELATOS;
  }

  // Marca quais o usuário atual já deu like
  const joiados = JSON.parse(localStorage.getItem('vds_joiados') || '{}');

  grid.innerHTML = '';

  if (todos.length === 0) {
    vazio.style.display = 'flex';
    grid.style.display  = 'none';
    return;
  }

  vazio.style.display = 'none';
  grid.style.display  = 'grid';

  todos.forEach((r, i) => {
    const card = document.createElement('div');
    card.className = 'vis-card';
    card.style.animationDelay = `${i * 0.07}s`;

    const joiado = !!joiados[r.id];

    const fotoHTML = r.foto
      ? `<div class="vis-card-img-wrap">
           <img src="${r.foto}" alt="${_esc(r.nome)}" class="vis-card-img" loading="lazy"/>
           <div class="vis-card-img-overlay"></div>
         </div>`
      : `<div class="vis-card-sem-foto">
           <span class="material-symbols-outlined vis-card-sem-foto-icone">image_not_supported</span>
         </div>`;

    const catHTML = r.categoria
      ? `<span class="vis-card-cat">${_esc(r.categoria)}</span>` : '';

    card.innerHTML = `
      ${fotoHTML}
      <div class="vis-card-corpo">
        <div class="vis-card-meta">
          ${catHTML}
          <span class="vis-card-data">${formatarData(r.data)}</span>
        </div>
        <h3 class="vis-card-nome">${_esc(r.nome)}</h3>
        <div class="vis-card-local">
          <span class="material-symbols-outlined vis-card-local-icone">location_on</span>
          <span class="vis-card-local-txt">${_esc(r.local)}</span>
        </div>
        <div class="vis-card-rodape">
          <span class="vis-card-autor">
            <span class="material-symbols-outlined" style="font-size:13px;opacity:.5">person</span>
            ${_esc(r.usuario)}
          </span>
          <button class="vis-btn-joia ${joiado ? 'vis-btn-joia--ativa' : ''}"
                  data-id="${r.id}"
                  onclick="togglePositivo('${r.id}', this)"
                  title="${joiado ? 'Remover apoio' : 'Apoiar este relato'}">
            <span class="material-symbols-outlined vis-joia-icone">thumb_up</span>
            <span class="vis-joia-count">${r.joias || 0}</span>
          </button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

async function togglePositivo(id, btn) {
  // Verifica se está logado
  if (!VDS_USUARIO_ATUAL) {
    mostrarToast('Faça login para apoiar um relato.');
    return;
  }

  const joiados = JSON.parse(localStorage.getItem('vds_joiados') || '{}');
  const jaJoiou = !!joiados[id];

  // Atualiza UI
  const countEl = btn.querySelector('.vis-joia-count');
  const atual   = parseInt(countEl.textContent, 10) || 0;
  const novo    = jaJoiou ? Math.max(0, atual - 1) : atual + 1;

  btn.classList.toggle('vis-btn-joia--ativa', !jaJoiou);
  countEl.textContent = novo;
  btn.classList.add('vis-btn-joia--pulso');
  setTimeout(() => btn.classList.remove('vis-btn-joia--pulso'), 400);

  // Salva pelo local
  if (jaJoiou) { delete joiados[id]; } else { joiados[id] = true; }
  localStorage.setItem('vds_joiados', JSON.stringify(joiados));

  // Sincroniza com servidor
  try {
    await fetch('api.php', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        action:  'joia',
        id,
        contato: VDS_USUARIO_ATUAL.contato,
        tipo:    jaJoiou ? 'remover' : 'adicionar',
      }),
    });
  } catch { /* Falha silenciosa*/ }
}

// Eviatr erro ao montar html
function _esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatarData(dataStr) {
  if (!dataStr) return '';
  const [ano, mes, dia] = dataStr.split('-');
  return `${dia}/${mes}/${ano}`;
}


// Trocar abas

function aba(secao, link) {
  document.querySelectorAll('main > section').forEach(s => s.style.display = 'none');
  document.getElementById(secao).style.display = 'block';

  // Atualiza link ativo — aceita o elemento passado ou pega do event
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const alvo = link || (typeof event !== 'undefined' && event?.currentTarget);
  if (alvo) alvo.classList.add('active');

  if (secao === 'ouvidoria')  ouvidoriaInit();
  if (secao === 'visualizar') visualizarInit();
}