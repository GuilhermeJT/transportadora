document.addEventListener('DOMContentLoaded', () => {
  carregarEstilosDoMenu();
  carregarMenu();
});

function carregarEstilosDoMenu() {
  adicionarCss('/css/menu.css', 'menu-css');
  adicionarCss('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css', 'bootstrap-icons-css');
}

function adicionarCss(href, id) {
  if (document.getElementById(id)) return;

  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

function carregarMenu() {
  const container = document.getElementById('menu-container');
  if (!container) return;

  fetch('/pages/menu.html')
    .then(response => response.text())
    .then(html => {
      container.innerHTML = html;
      configurarAberturaDosGrupos();
      marcarItemAtivo();
    })
    .catch(error => console.error('Erro ao carregar o menu:', error));
}

function configurarAberturaDosGrupos() {
  document.querySelectorAll('[data-sidebar-toggle]').forEach(botao => {
    botao.addEventListener('click', () => {
      const grupo = botao.closest('[data-sidebar-group]');
      if (grupo) grupo.classList.toggle('is-open');
    });
  });
}

function marcarItemAtivo() {
  const caminhoAtual = normalizarCaminho(window.location.pathname);
  const parametros = new URLSearchParams(window.location.search);
  const menuAtual = parametros.get('menu');

  document.querySelectorAll('[data-menu-match]').forEach(item => {
    item.classList.remove('active');
  });

  if (menuAtual) {
    document.querySelectorAll('[data-menu-match]').forEach(item => {
      const regra = item.getAttribute('data-menu-match');

      if (regra === menuAtual) {
        item.classList.add('active');

        const grupo = item.closest('[data-sidebar-group]');
        if (grupo) grupo.classList.add('is-open');
      }
    });

    return;
  }

  document.querySelectorAll('[data-menu-match]').forEach(item => {
    const regra = item.getAttribute('data-menu-match');

    const ehDashboard = caminhoAtual === '/' || caminhoAtual.endsWith('/index.html');
    const matchDashboard = regra === '/index.html' && ehDashboard;
    const matchModulo = regra !== '/index.html' && caminhoAtual.includes(regra);

    if (matchDashboard || matchModulo) {
      item.classList.add('active');

      const grupo = item.closest('[data-sidebar-group]');
      if (grupo) grupo.classList.add('is-open');
    }
  });
}

function normalizarCaminho(caminho) {
  return caminho.replace(/\\/g, '/');
}
