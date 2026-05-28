document.addEventListener('DOMContentLoaded', () => {
  const campoData = document.getElementById('r-data');
  if (campoData) campoData.value = new Date().toISOString().split('T')[0];

  document.getElementById('r-foto-input')?.addEventListener('change', function () {
    if (!this.files[0]) return;
    const reader = new FileReader();
    reader.onload = e => mostrarPreviewFoto(e.target.result);
    reader.readAsDataURL(this.files[0]);
  });

});

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
    document.getElementById(id).value = '';
  });
  document.getElementById('r-data').value = new Date().toISOString().split('T')[0];

  document.getElementById('rel-mapa-overlay').style.display = 'none';

  const btnPin = document.getElementById('rel-btn-pin');
  if (btnPin) {
    btnPin.innerHTML = '<span class="material-symbols-outlined" style="font-size:16px">push_pin</span> Salvar posição';
    btnPin.style.borderColor = btnPin.style.color = '';
  }

  removerFoto();
}

function enviarRelato() {
  const nome = document.getElementById('r-nome-problema').value.trim();
  const descricao = document.getElementById('r-descricao').value.trim();
  if (!nome)     return destacarCampo('r-nome-problema');
  if (!descricao) return destacarCampo('r-descricao');
  mostrarToast('Relato enviado com sucesso!');
  const cat = document.getElementById('ouv-categoria')?.value || '';
  ouvidoriaAdicionarRelato(nome, cat);
  limparRelato();
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
  el.style.boxShadow = '0 0 0 3px rgba(220,80,80,.1)';
  el.focus();
  setTimeout(() => { el.style.borderColor = el.style.boxShadow = ''; }, 2200);
}

// Prfil

function alternarAuthAba(qual) {
  const eCriar = qual === 'criar';
  document.getElementById('auth-form-criar').style.display = eCriar ? 'flex' : 'none';
  document.getElementById('auth-form-login').style.display = eCriar ? 'none' : 'flex';
  document.getElementById('btn-aba-criar').classList.toggle('auth-aba--ativa',  eCriar);
  document.getElementById('btn-aba-login').classList.toggle('auth-aba--ativa', !eCriar);
}
 
 
function alternarSenha(inputId, btn) {
  const input = document.getElementById(inputId);
  const visivel = input.type === 'text';
  input.type = visivel ? 'password' : 'text';
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
  /* Limpa campos */
  ['auth-nome', 'auth-contato-criar', 'auth-senha-criar',
   'auth-contato-login', 'auth-senha-login'].forEach(id => {
    document.getElementById(id).value = '';
  });
 
  /* Reseta avatar */
  const img = document.getElementById('perfil-avatar-img');
  img.src = '';
  img.style.display = 'none';
  document.querySelector('.perfil-avatar-icone').style.display = '';
  document.getElementById('perfil-foto-input').value = '';
 
  document.getElementById('perfil-logado').style.display    = 'none';
  document.getElementById('perfil-deslogado').style.display = 'flex';
  alternarAuthAba('criar');
}
 
const OUV_CONTATOS = {
  'Buracos': [
    {
      orgao:  'Secretaria de Obras',
      desc:   'Manutenção de vias e pavimentação',
      numero: '(32) 3379-7200',
      icone:  'construction'
    },
    {
      orgao:  'SAAE — Fiscalização',
      desc:   'Problemas em calçadas e bueiros',
      numero: '(32) 3379-7300',
      icone:  'engineering'
    }
  ],
  'Energia': [
    {
      orgao:  'CEMIG Atendimento',
      desc:   'Falta de luz, poste danificado',
      numero: '0800 721 0196',
      icone:  'bolt'
    },
    {
      orgao:  'Prefeitura — Iluminação',
      desc:   'Iluminação pública municipal',
      numero: '(32) 3379-7150',
      icone:  'light_mode'
    }
  ],
  'Transportes públicos': [
    {
      orgao:  'Sec. de Transportes',
      desc:   'Ônibus, horários e linhas urbanas',
      numero: '(32) 3379-7400',
      icone:  'directions_bus'
    },
    {
      orgao:  'DFTRANS — Fiscalização',
      desc:   'Denúncias sobre transporte público',
      numero: '(32) 3379-7410',
      icone:  'report'
    }
  ],
  'Água': [
    {
      orgao:  'COPASA',
      desc:   'Abastecimento e esgoto',
      numero: '0800 031 0056',
      icone:  'water_drop'
    },
    {
      orgao:  'SAAE São João del-Rei',
      desc:   'Serviço Autônomo de Água e Esgoto',
      numero: '(32) 3379-7500',
      icone:  'plumbing'
    }
  ],
  'Serviços Públicos': [
    {
      orgao:  'Prefeitura Municipal',
      desc:   'Central de atendimento ao cidadão',
      numero: '(32) 3379-7000',
      icone:  'apartment'
    },
    {
      orgao:  'Ouvidoria Geral',
      desc:   'Reclamações e sugestões gerais',
      numero: '(32) 3379-7010',
      icone:  'headset_mic'
    }
  ]
};

const OUV_RELATOS = [];  

/* ── Inicialização da aba Ouvidoria ── */
function ouvidoriaInit() {
  _ouvidoriaPopularSelectRelatos();
}

/* Popula o select de relatos com os registros existentes */
function _ouvidoriaPopularSelectRelatos() {
  const sel  = document.getElementById('ouv-relato');
  const hint = document.getElementById('ouv-hint-relato');
  if (!sel) return;

  /* Mantém apenas o placeholder */
  while (sel.options.length > 1) sel.remove(1);

  if (OUV_RELATOS.length === 0) {
    if (hint) hint.style.display = 'flex';
    return;
  }

  if (hint) hint.style.display = 'none';
  OUV_RELATOS.forEach((r, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = r.nome;
    sel.appendChild(opt);
  });
}

/* Reage a mudança de qualquer select */
function ouvidoriaAtualizar() {
  const selRelato = document.getElementById('ouv-relato');
  const selCat    = document.getElementById('ouv-categoria');
  if (!selRelato || !selCat) return;

  const idx      = selRelato.value;
  const catSelect = selCat.value;

  /* Se um relato foi escolhido, preeenche a categoria dele */
  let categoria = catSelect;
  if (idx !== '' && OUV_RELATOS[idx]) {
    const relato = OUV_RELATOS[idx];
    if (relato.categoria) {
      selCat.value = relato.categoria;
      categoria = relato.categoria;
    }

    const resumo = document.getElementById('ouv-relato-resumo');
    document.getElementById('ouv-resumo-nome').textContent = relato.nome;
    document.getElementById('ouv-resumo-cat').textContent  = relato.categoria || '—';
    if (resumo) resumo.style.display = 'flex';
  }

  document.querySelectorAll('.ouv-chip').forEach(c => {
    c.classList.toggle('ouv-chip--ativo', c.textContent.trim().includes(categoria));
  });

  /* Renderiza contatos */
  _ouvidoriaRenderContatos(categoria);
}

function ouvidoriaSetCategoria(cat) {
  const sel = document.getElementById('ouv-categoria');
  if (sel) sel.value = cat;
  ouvidoriaAtualizar();
}

function _ouvidoriaRenderContatos(categoria) {
  const vazio = document.getElementById('ouv-estado-vazio');
  const lista = document.getElementById('ouv-lista-contatos');
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
  OUV_RELATOS.push({ nome, categoria });
  _ouvidoriaPopularSelectRelatos();
}
/* ── Atualiza o select de relatos quando a aba Ouvidoria é aberta ── */
const _abaOriginal = typeof aba === 'function' ? aba : null;

function aba(secao) {
  document.querySelectorAll('main > section').forEach(s => s.style.display = 'none');
  document.getElementById(secao).style.display = 'block';
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  event.currentTarget.classList.add('active');

  if (secao === 'ouvidoria') ouvidoriaInit();
}