const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
const overlay = $('#overlay');
const drawer = $('#bagDrawer');
const search = $('#searchPanel');
const toast = $('#toast');
let bag = [];
let toastTimer;

function setLayer(target, open) {
  [drawer, search].forEach((el) => {
    if (el !== target) {
      el.classList.remove('show');
      el.setAttribute('aria-hidden', 'true');
    }
  });
  target.classList.toggle('show', open);
  target.setAttribute('aria-hidden', String(!open));
  overlay.classList.toggle('show', open);
  document.body.classList.toggle('lock', open);
  if (open) setTimeout(() => target.querySelector('button,input,a')?.focus(), 80);
}

function closeLayers() {
  setLayer(drawer, false);
  setLayer(search, false);
}

$('#bagButton').addEventListener('click', () => setLayer(drawer, true));
$('#searchButton').addEventListener('click', () => setLayer(search, true));
overlay.addEventListener('click', closeLayers);
$$('[data-close]').forEach((el) => el.addEventListener('click', closeLayers));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeLayers();
});

const menuButton = $('#menuButton');
menuButton.addEventListener('click', () => {
  const header = $('.header');
  const open = header.classList.toggle('menu-open');
  menuButton.setAttribute('aria-expanded', String(open));
});
$$('.nav a').forEach((anchor) => anchor.addEventListener('click', () => {
  $('.header').classList.remove('menu-open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

const priceMap = {
  'Blazer Estrutura': 699,
  'Overshirt Traço': 489,
  'Calça Fluxo': 429,
  'Calça Ampla Eixo': 399
};

$$('.add').forEach((button) => button.addEventListener('click', () => {
  bag.push({ name: button.dataset.product, price: priceMap[button.dataset.product] });
  renderBag();
  showToast(button.dataset.product + ' foi para a sacola');
}));

function renderBag() {
  const count = bag.length;
  $('#bagCount').textContent = count;
  $('#drawerCount').textContent = '(' + count + ')';
  $('#bagButton').setAttribute('aria-label', 'Abrir sacola, ' + count + (count === 1 ? ' item' : ' itens'));
  const container = $('#bagItems');
  const foot = $('#bagFoot');
  if (!count) {
    container.innerHTML = '<p class="empty">Sua sacola está vazia.<br><a href="#novidades" data-close>Descobrir novidades</a></p>';
    container.querySelector('a').addEventListener('click', closeLayers);
    foot.hidden = true;
    return;
  }
  container.innerHTML = bag.map((item, index) =>
    '<div class="bag-item"><div><h3>' + item.name + '</h3><p>Tamanho a escolher</p><strong>R$ ' + item.price + '</strong></div><button class="remove" data-index="' + index + '">Remover</button></div>'
  ).join('');
  foot.hidden = false;
  $('#subtotal').textContent = 'R$ ' + bag.reduce((sum, item) => sum + item.price, 0).toLocaleString('pt-BR');
  $$('.remove', container).forEach((button) => button.addEventListener('click', () => {
    bag.splice(Number(button.dataset.index), 1);
    renderBag();
  }));
}

$$('.filter').forEach((button) => button.addEventListener('click', () => {
  $$('.filter').forEach((item) => item.classList.toggle('active', item === button));
  $$('.product').forEach((card) => {
    card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
  });
}));

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

$('#newsletterForm').addEventListener('submit', (event) => {
  event.preventDefault();
  showToast('Pronto — você agora faz parte do NEXO.');
  event.currentTarget.reset();
});

$('#searchInput').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    closeLayers();
    document.querySelector('#novidades').scrollIntoView();
    showToast('Resultados para “' + (event.currentTarget.value || 'novidades') + '”');
  }
});
