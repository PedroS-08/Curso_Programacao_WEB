document.addEventListener('DOMContentLoaded', () => {
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
      img.src = e.target.result;
      img.style.display = 'block';
      document.querySelector('.perfil-avatar-icone').style.display = 'none';
    };
    reader.readAsDataURL(this.files[0]);
  });
});

// Preview de foto
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
    area.style.borderStyle = 'dashed';
    area.style.borderColor = 'rgba(201,168,76,.15)';
  }
  const btnRemover = document.getElementById('rel-btn-remove-foto');
  if (btnRemover) btnRemover.style.display = 'none';
  const input = document.getElementById('r-foto-input');
  if (input) input.value = '';
}

function limparRelato() {
  ['r-nome-problema', 'r-descricao', 'r-usuario', 'r-local-texto'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const campoData = document.getElementById('r-data');
  if (campoData) campoData.value = new Date().toISOString().split('T')[0];
  removerFoto();
}

async function enviarRelato() {
  // Pega os valores dos campos
  const nome      = document.getElementById('r-nome-problema').value.trim();
  const descricao = document.getElementById('r-descricao').value.trim();
  const local     = document.getElementById('r-local-texto').value.trim();
  const usuario   = document.getElementById('r-usuario').value.trim();
  const data      = document.getElementById('r-data').value;
  const categoria = document.getElementById('ouv-categoria')?.value || '';

  if (!nome) return destacarCampo('r-nome-problema');
  if (!descricao) return destacarCampo('r-descricao');

  // Pegar img do preview
  const previewImg = document.querySelector('#rel-preview-area img');
  const foto = previewImg ? previewImg.src : null;

  // Monta o objeto com dados q irão para o json
  const payload = {
    nome,
    descricao,
    local: local || 'Local não informado',
    usuario: usuario || 'Anônimo',
    data,
    categoria,
    foto, 
  };

  // Bloquear cliques duplos
  const btnEnviar = document.querySelector('.rel-btn-enviar');
  if (btnEnviar) {
    btnEnviar.disabled = true;
    btnEnviar.style.opacity = '0.6';
  }

  try {
    // Envia os dados para o servidor com fetch
    const resposta = await fetch('api.php', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });

    // Lê a resposta do json
    const json = await resposta.json();

    if (resposta.ok && json.status === 'sucesso') {
      // Mensagem com textContentt
      mostrarMensagemRelato('sucesso', `✓ ${json.mensagem}`);

      // Adiciona ao array (p/ Visualizar e Ouvidoria )
      VDS_RELATOS.push({
        id:       json.id,
        nome,
        descricao,
        local: local || 'Local não informado',
        usuario: usuario || 'Anônimo',
        data,
        foto,
        categoria,
        joias: 0,
        joiados: false,
      });

      ouvidoriaAdicionarRelato(nome, categoria);
      limparRelato();

    } else {
      // ── Erro de validação
      mostrarMensagemRelato('erro', `✕ ${json.mensagem || 'Ocorreu um erro ao enviar.'}`);
    }

  } catch (erro) {
    // ── Erro de rede
    console.error('Erro de rede ao enviar relato:', erro);
    mostrarMensagemRelato('erro', '✕ Não foi possível conectar ao servidor. Tente novamente.');
  } finally {

    if (btnEnviar) {
      btnEnviar.disabled = false;
      btnEnviar.style.opacity = '';
    }
  }
}

// Mensagem
function mostrarMensagemRelato(tipo, texto) {
  let el = document.getElementById('rel-msg-feedback');

  // Cria o elemento na primeira vez
  if (!el) {
    el = document.createElement('p');
    el.id = 'rel-msg-feedback';
    el.style.cssText = `
      text-align: center;
      font-family: var(--fonte-ui);
      font-size: 13px;
      letter-spacing: 0.06em;
      padding: 10px 20px;
      border-radius: 100px;
      border: 1px solid transparent;
      transition: opacity 0.35s ease;
      margin-top: 4px;
    `;
    // Insere dps de relatar
    const acoes = document.querySelector('.relatar-acoes');
    if (acoes) acoes.insertAdjacentElement('afterend', el);
  }

  // Define a aparência
  if (tipo === 'sucesso') {
    el.style.color = 'rgba(120,220,140,0.90)';
    el.style.borderColor = 'rgba(120,220,140,0.22)';
    el.style.background  = 'rgba(120,220,140,0.06)';
  } else {
    el.style.color = 'rgba(245,120,120,0.90)';
    el.style.borderColor = 'rgba(245,120,120,0.22)';
    el.style.background  = 'rgba(245,120,120,0.06)';
  }

  // Atualiza o texto - textContent
  el.textContent = texto;
  el.style.opacity = '1';

  // Some dps de 4 seg
  clearTimeout(el._timer);
  el._timer = setTimeout(() => { el.style.opacity = '0'; }, 4000);
}

// Toast padrão para varios usos
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
  el.style.boxShadow = '0 0 0 3px rgba(220,80,80,.1)';
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
  const input  = document.getElementById(inputId);
  const visivel = input.type === 'text';
  input.type   = visivel ? 'password' : 'text';
  btn.querySelector('.material-symbols-outlined').textContent = visivel ? 'visibility' : 'visibility_off';
}

function criarConta() {
  const nome    = document.getElementById('auth-nome').value.trim();
  const contato = document.getElementById('auth-contato-criar').value.trim();
  const senha   = document.getElementById('auth-senha-criar').value;
  if (!nome)    return destacarCampo('auth-nome');
  if (!contato) return destacarCampo('auth-contato-criar');
  if (!senha)   return destacarCampo('auth-senha-criar');
  entrarComNome(nome);
  mostrarToast('Conta criada com sucesso!');
}

function fazerLogin() {
  const contato = document.getElementById('auth-contato-login').value.trim();
  const senha   = document.getElementById('auth-senha-login').value;
  if (!contato) return destacarCampo('auth-contato-login');
  if (!senha)   return destacarCampo('auth-senha-login');
  entrarComNome(contato);
  mostrarToast('Login realizado com sucesso!');
}

function entrarComNome(nome) {
  document.getElementById('perfil-nome').textContent = nome;
  document.getElementById('perfil-deslogado').style.display = 'none';
  document.getElementById('perfil-logado').style.display    = 'flex';
}

function sair() {
  ['auth-nome','auth-contato-criar','auth-senha-criar',
   'auth-contato-login','auth-senha-login'].forEach(id => {
    document.getElementById(id).value = '';
  });
  const img = document.getElementById('perfil-avatar-img');
  img.src = '';
  img.style.display = 'none';
  document.querySelector('.perfil-avatar-icone').style.display = '';
  document.getElementById('perfil-foto-input').value = '';
  document.getElementById('perfil-logado').style.display    = 'none';
  document.getElementById('perfil-deslogado').style.display = 'flex';
  alternarAuthAba('criar');
}

// Ouvidoria
const OUV_CONTATOS = {
  'Buracos': [
    { orgao: 'Secretaria de Obras', desc: 'Manutenção de vias e pavimentação', numero: '(32) 3379-7200', icone: 'construction'},
    { orgao: 'SAAE — Fiscalização',  desc: 'Problemas em calçadas e bueiros', numero: '(32) 3379-7300', icone: 'engineering'}
  ],
  'Energia': [
    { orgao: 'CEMIG Atendimento', desc: 'Falta de luz, poste danificado', numero: '0800 721 0196',  icone: 'bolt'},
    { orgao: 'Prefeitura — Iluminação', desc: 'Iluminação pública municipal', numero: '(32) 3379-7150', icone: 'light_mode' }
  ],
  'Transportes públicos': [
    { orgao: 'Sec. de Transportes', desc: 'Ônibus, horários e linhas urbanas', numero: '(32) 3379-7400', icone: 'directions_bus'},
    { orgao: 'DFTRANS — Fiscalização', desc: 'Denúncias sobre transporte público', numero: '(32) 3379-7410', icone: 'report'}
  ],
  'Água': [
    { orgao: 'COPASA', desc: 'Abastecimento e esgoto', numero: '0800 031 0056', icone: 'water_drop' },
    { orgao: 'DAMAE', desc: 'Serviço Autônomo de Água e Esgoto', numero: '(32) 3379-7500', icone: 'plumbing'}
  ],
  'Serviços Públicos': [
    { orgao: 'Prefeitura Municipal', desc: 'Central de atendimento ao cidadão', numero: '(32) 3379-7000', icone: 'apartment'},
    { orgao: 'Ouvidoria Geral', desc: 'Reclamações e sugestões gerais', numero: '(32) 3379-7010', icone: 'headset_mic' }
  ]
};

const VDS_RELATOS = [];
const OUV_RELATOS = VDS_RELATOS;

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
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = r.nome;
    sel.appendChild(opt);
  });
}

function ouvidoriaAtualizar() {
  const selRelato = document.getElementById('ouv-relato');
  const selCat = document.getElementById('ouv-categoria');
  if (!selRelato || !selCat) return;

  const idx = selRelato.value;
  let categoria = selCat.value;

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
    lista.innerHTML = '';
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

// Visualizar
function visualizarInit() {
  const grid  = document.getElementById('vis-grid');
  const vazio = document.getElementById('vis-vazio');
  if (!grid || !vazio) return;

  grid.innerHTML = '';

  if (VDS_RELATOS.length === 0) {
    vazio.style.display = 'flex';
    grid.style.display  = 'none';
    return;
  }

  vazio.style.display = 'none';
  grid.style.display  = 'grid';

  VDS_RELATOS.forEach((r, i) => {
    const card = document.createElement('div');
    card.className = 'vis-card';
    card.style.animationDelay = `${i * 0.07}s`;

    const fotoHTML = r.foto
      ? `<div class="vis-card-img-wrap">
           <img src="${r.foto}" alt="${r.nome}" class="vis-card-img" />
           <div class="vis-card-img-overlay"></div>
         </div>`
      : `<div class="vis-card-sem-foto">
           <span class="material-symbols-outlined vis-card-sem-foto-icone">image_not_supported</span>
         </div>`;

    const catHTML = r.categoria
      ? `<span class="vis-card-cat">${r.categoria}</span>` : '';

    card.innerHTML = `
      ${fotoHTML}
      <div class="vis-card-corpo">
        <div class="vis-card-meta">
          ${catHTML}
          <span class="vis-card-data">${formatarData(r.data)}</span>
        </div>
        <h3 class="vis-card-nome">${r.nome}</h3>
        <div class="vis-card-local">
          <span class="material-symbols-outlined vis-card-local-icone">location_on</span>
          <span class="vis-card-local-txt">${r.local}</span>
        </div>
        <div class="vis-card-rodape">
          <span class="vis-card-autor">
            <span class="material-symbols-outlined" style="font-size:13px;opacity:.5">person</span>
            ${r.usuario}
          </span>
          <button class="vis-btn-joia ${r.joiados ? 'vis-btn-joia--ativa' : ''}"
                  onclick="togglePositivo(${i}, this)"
                  title="${r.joiados ? 'Remover apoio' : 'Apoiar este relato'}">
            <span class="material-symbols-outlined vis-joia-icone">thumb_up</span>
            <span class="vis-joia-count">${r.joias}</span>
          </button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function togglePositivo(index, btn) {
  const relato = VDS_RELATOS[index];
  if (!relato) return;
  relato.joiados = !relato.joiados;
  relato.joias  += relato.joiados ? 1 : -1;
  if (relato.joias < 0) relato.joias = 0;
  btn.classList.toggle('vis-btn-joia--ativa', relato.joiados);
  btn.querySelector('.vis-joia-count').textContent = relato.joias;
  btn.classList.add('vis-btn-joia--pulso');
  setTimeout(() => btn.classList.remove('vis-btn-joia--pulso'), 400);
}

function formatarData(dataStr) {
  if (!dataStr) return '';
  const [ano, mes, dia] = dataStr.split('-');
  return `${dia}/${mes}/${ano}`;
}

// trocsr Abas
function aba(secao) {
  document.querySelectorAll('main > section').forEach(s => s.style.display = 'none');
  document.getElementById(secao).style.display = 'block';
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  event.currentTarget.classList.add('active');

  if (secao === 'ouvidoria')  ouvidoriaInit();
  if (secao === 'visualizar') visualizarInit();
}