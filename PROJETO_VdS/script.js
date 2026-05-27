function aba(secao) {
  document.querySelectorAll('main > section').forEach(s => s.style.display = 'none');
  document.getElementById(secao).style.display = 'block';
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  event.currentTarget.classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
  const campoData = document.getElementById('r-data');
  if (campoData) campoData.value = new Date().toISOString().split('T')[0];

  document.getElementById('r-foto-input')?.addEventListener('change', function () {
    if (!this.files[0]) return;
    const reader = new FileReader();
    reader.onload = e => mostrarPreviewFoto(e.target.result);
    reader.readAsDataURL(this.files[0]);
  });

  document.getElementById('rel-btn-pin')?.addEventListener('click', function () {
    const overlay = document.getElementById('rel-mapa-overlay');
    if (overlay) Object.assign(overlay.style, { display: 'flex', alignItems: 'flex-end', justifyContent: 'center' });

    this.innerHTML = '<span class="material-symbols-outlined" style="font-size:16px">check</span> Posição salva';
    this.style.cssText += 'border-color:rgba(100,200,130,.5);color:rgba(160,230,180,.95)';

    setTimeout(() => {
      this.innerHTML = '<span class="material-symbols-outlined" style="font-size:16px">push_pin</span> Salvar posição';
      this.style.borderColor = this.style.color = '';
    }, 2500);
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
 