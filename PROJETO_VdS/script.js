function aba(secao) {
  // "main > section" pega só os filhos diretos, ignorando sections internas
  document.querySelectorAll('main > section').forEach(s => s.style.display = 'none');
  document.getElementById(secao).style.display = 'block';

  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  event.currentTarget.classList.add('active');
}