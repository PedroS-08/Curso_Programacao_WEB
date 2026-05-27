function aba(secao) {
  // "main > section" pega só os filhos diretos, ignorando sections internas
  document.querySelectorAll('main > section').forEach(s => s.style.display = 'none');
  document.getElementById(secao).style.display = 'block';

  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  event.currentTarget.classList.add('active');
}

/* ── Inicialização quando a aba carrega ── */
document.addEventListener('DOMContentLoaded', function () {

  /* Data padrão = hoje */
  const campoData = document.getElementById('r-data');
  if (campoData) {
    campoData.value = new Date().toISOString().split('T')[0];
  }

  /* Preview da foto ao selecionar arquivo */
  const inputFoto = document.getElementById('r-foto-input');
  if (inputFoto) {
    inputFoto.addEventListener('change', function () {
      const arquivo = this.files[0];
      if (!arquivo) return;

      const reader = new FileReader();
      reader.onload = function (e) {
        mostrarPreviewFoto(e.target.result);
      };
      reader.readAsDataURL(arquivo);
    });
  }

  /* Botão salvar posição do mapa */
  const btnPin = document.getElementById('rel-btn-pin');
  if (btnPin) {
    btnPin.addEventListener('click', function () {
      const overlay = document.getElementById('rel-mapa-overlay');
      if (overlay) {
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'flex-end';
        overlay.style.justifyContent = 'center';
      }
      btnPin.innerHTML = `
        <span class="material-symbols-outlined" style="font-size:16px">check</span>
        Posição salva
      `;
      btnPin.style.borderColor = 'rgba(100,200,130,0.50)';
      btnPin.style.color = 'rgba(160,230,180,0.95)';
      setTimeout(() => {
        btnPin.innerHTML = `
          <span class="material-symbols-outlined" style="font-size:16px">push_pin</span>
          Salvar posição
        `;
        btnPin.style.borderColor = '';
        btnPin.style.color = '';
      }, 2500);
    });
  }

});

/* ── Preview de foto ── */
function mostrarPreviewFoto(src) {
  const area = document.getElementById('rel-preview-area');
  const btnRemover = document.getElementById('rel-btn-remove-foto');
  if (!area) return;

  area.innerHTML = `<img src="${src}" alt="Foto do problema" />`;
  area.style.borderStyle = 'solid';
  area.style.borderColor = 'rgba(201,168,76,0.28)';
  if (btnRemover) btnRemover.style.display = 'flex';
}

/* ── Remover foto ── */
function removerFoto() {
  const area = document.getElementById('rel-preview-area');
  const btnRemover = document.getElementById('rel-btn-remove-foto');
  const inputFoto = document.getElementById('r-foto-input');

  if (area) {
    area.innerHTML = `
      <span class="material-symbols-outlined rel-preview-placeholder-icone">hide_image</span>
      <p class="rel-preview-placeholder-txt">Nenhuma imagem selecionada</p>
    `;
    area.style.borderStyle = 'dashed';
    area.style.borderColor = 'rgba(201,168,76,0.15)';
  }
  if (btnRemover) btnRemover.style.display = 'none';
  if (inputFoto)  inputFoto.value = '';
}

/* ── Limpar formulário completo ── */
function limparRelato() {
  document.getElementById('r-nome-problema').value = '';
  document.getElementById('r-descricao').value     = '';
  document.getElementById('r-usuario').value       = '';
  document.getElementById('r-local-texto').value   = '';
  document.getElementById('r-data').value          = new Date().toISOString().split('T')[0];

  /* Reset do pino do mapa */
  const overlay = document.getElementById('rel-mapa-overlay');
  if (overlay) overlay.style.display = 'none';
  const btnPin = document.getElementById('rel-btn-pin');
  if (btnPin) {
    btnPin.innerHTML = `
      <span class="material-symbols-outlined" style="font-size:16px">push_pin</span>
      Salvar posição
    `;
    btnPin.style.borderColor = '';
    btnPin.style.color = '';
  }

  removerFoto();
}

/* ── Enviar relato ── */
function enviarRelato() {
  const nome     = document.getElementById('r-nome-problema').value.trim();
  const descricao = document.getElementById('r-descricao').value.trim();

  if (!nome) {
    destacarCampo('r-nome-problema');
    return;
  }
  if (!descricao) {
    destacarCampo('r-descricao');
    return;
  }

  /* ── Aqui você futuramente enviará para seu backend MySQL ──
     const payload = {
       nome_problema : nome,
       descricao     : descricao,
       usuario       : document.getElementById('r-usuario').value.trim(),
       local         : document.getElementById('r-local-texto').value.trim(),
       data          : document.getElementById('r-data').value,
       foto          : document.getElementById('r-foto-input').files[0] ?? null,
     };
     fetch('/api/relatos', { method: 'POST', body: JSON.stringify(payload), ... })
  ───────────────────────────────────────────────────────────── */

  /* Feedback visual */
  mostrarToast('Relato enviado com sucesso!');

  /* Limpa o formulário após envio */
  limparRelato();
}

/* ── Toast de confirmação ── */
function mostrarToast(mensagem) {
  let toast = document.getElementById('rel-toast-global');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'rel-toast-global';
    toast.className = 'rel-toast';
    toast.innerHTML = `
      <span class="material-symbols-outlined rel-toast-icone">check_circle</span>
      <span id="rel-toast-txt"></span>
    `;
    document.body.appendChild(toast);
  }
  document.getElementById('rel-toast-txt').textContent = mensagem;
  toast.classList.add('rel-toast--visivel');
  setTimeout(() => toast.classList.remove('rel-toast--visivel'), 3200);
}

/* ── Destacar campo obrigatório vazio ── */
function destacarCampo(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.borderColor = 'rgba(220,80,80,0.60)';
  el.style.boxShadow   = '0 0 0 3px rgba(220,80,80,0.10)';
  el.focus();
  setTimeout(() => {
    el.style.borderColor = '';
    el.style.boxShadow   = '';
  }, 2200);
}
