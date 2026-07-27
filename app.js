const state = {
  entries: [],
  filtered: [],
  topic: 'Todas',
  query: '',
  visible: 18,
  featured: null,
};

const DECK_STORAGE_KEY = 'teletipo-jzg-featured-deck-v1';
const $ = (selector) => document.querySelector(selector);
const grid = $('#grid-columnas');
const filters = $('#filtros');
const reader = $('#lector');

function normalize(value = '') {
  return value.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function escapeHTML(value = '') {
  return String(value).replace(/[&<>'"]/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;'
  }[char]));
}

function getTopics(entries) {
  return [...new Set(entries.map(entry => entry.tema_principal))].sort((a, b) => a.localeCompare(b, 'es'));
}

function shuffle(values) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }
  return result;
}

function readDeck() {
  try {
    return JSON.parse(localStorage.getItem(DECK_STORAGE_KEY) || 'null');
  } catch {
    return null;
  }
}

function createDeck(lastShownId = null) {
  const ids = shuffle(state.entries.map(entry => entry.id));
  if (ids.length > 1 && ids[0] === lastShownId) {
    [ids[0], ids[1]] = [ids[1], ids[0]];
  }
  return {
    signature: state.entries.map(entry => entry.id).join('|'),
    remaining: ids,
    lastShownId,
  };
}

function nextDeckEntry() {
  const signature = state.entries.map(entry => entry.id).join('|');
  let deck = readDeck();

  if (!deck || deck.signature !== signature || !Array.isArray(deck.remaining)) {
    deck = createDeck(deck?.lastShownId || null);
  }

  if (deck.remaining.length === 0) {
    deck = createDeck(deck.lastShownId || null);
  }

  const nextId = deck.remaining.shift();
  deck.lastShownId = nextId;
  localStorage.setItem(DECK_STORAGE_KEY, JSON.stringify(deck));
  return state.entries.find(entry => entry.id === nextId) || state.entries[0];
}

function renderFilters() {
  const topics = ['Todas', ...getTopics(state.entries)];
  filters.innerHTML = topics.map(topic => `
    <button class="filter ${topic === state.topic ? 'is-active' : ''}" type="button" data-topic="${escapeHTML(topic)}">
      ${escapeHTML(topic)}
    </button>
  `).join('');
}

function applyFilters() {
  const needle = normalize(state.query.trim());
  state.filtered = state.entries.filter(entry => {
    const topicMatch = state.topic === 'Todas' || entry.tema_principal === state.topic;
    const haystack = normalize([
      entry.titulo,
      entry.tema_principal,
      ...(entry.temas_secundarios || []),
      entry.fragmento,
      entry.pensamiento_de_joaquin,
      ...(entry.etiquetas || [])
    ].join(' '));
    return topicMatch && (!needle || haystack.includes(needle));
  });
  state.visible = 18;
  renderCards();
}

function cardTemplate(entry) {
  return `
    <article class="column-card" tabindex="0" role="button" data-id="${escapeHTML(entry.id)}" aria-label="Abrir ${escapeHTML(entry.titulo)}">
      <div class="column-card__number">N.º ${String(entry.orden_original).padStart(3, '0')}</div>
      <h3>${escapeHTML(entry.titulo)}</h3>
      <p>${escapeHTML(entry.mini_titular || entry.fragmento)}</p>
      <div class="column-card__topic">${escapeHTML(entry.tema_principal)} · ${escapeHTML(entry.tono || 'columna')}</div>
    </article>
  `;
}

function renderCards() {
  const shown = state.filtered.slice(0, state.visible);
  grid.innerHTML = shown.length
    ? shown.map(cardTemplate).join('')
    : '<p>No hay piezas con esa combinación. El archivo, por una vez, guarda silencio.</p>';

  $('#contador-resultados').textContent = `${state.filtered.length} ${state.filtered.length === 1 ? 'pieza' : 'piezas'}`;
  $('#cargar-mas').hidden = state.visible >= state.filtered.length;
}

function openReader(entry) {
  if (!entry) return;
  $('#lector-meta').textContent = `COLUMNA ${String(entry.orden_original).padStart(3, '0')} · ${entry.tema_principal.toUpperCase()} · ${String(entry.tono || '').toUpperCase()}`;
  $('#lector-titulo').textContent = entry.titulo;
  $('#lector-fragmento').textContent = entry.fragmento;
  $('#lector-pensamiento').textContent = entry.pensamiento_de_joaquin;
  $('#lector-importancia').textContent = entry.por_que_importa;
  $('#lector-etiquetas').innerHTML = (entry.etiquetas || []).map(tag => `<span>${escapeHTML(tag)}</span>`).join('');
  reader.showModal();
}

function setFeatured(entry) {
  state.featured = entry || nextDeckEntry();
  const panel = $('#pieza-destacada');
  panel.dataset.id = state.featured.id;
  panel.innerHTML = `
    <div class="feature-card__meta">COLUMNA ${String(state.featured.orden_original).padStart(3, '0')} · ${escapeHTML(state.featured.tema_principal.toUpperCase())}</div>
    <h3>${escapeHTML(state.featured.titulo)}</h3>
    <blockquote>“${escapeHTML(state.featured.fragmento)}”</blockquote>
    <div class="feature-card__hint">PULSA PARA ABRIR LA FICHA COMPLETA ↗</div>
  `;
}

function renderTicker() {
  const line = state.entries
    .map(item => `${item.tema_principal.toUpperCase()} · ${item.titulo.toUpperCase()}`)
    .join('  ◆  ');
  $('#ticker-track').textContent = `${line}  ◆  ${line}  ◆  `;
}

function bindEvents() {
  $('#buscador').addEventListener('input', event => {
    state.query = event.target.value;
    applyFilters();
  });

  filters.addEventListener('click', event => {
    const button = event.target.closest('[data-topic]');
    if (!button) return;
    state.topic = button.dataset.topic;
    renderFilters();
    applyFilters();
  });

  grid.addEventListener('click', event => {
    const card = event.target.closest('[data-id]');
    if (card) openReader(state.entries.find(entry => entry.id === card.dataset.id));
  });

  grid.addEventListener('keydown', event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const card = event.target.closest('[data-id]');
    if (card) {
      event.preventDefault();
      openReader(state.entries.find(entry => entry.id === card.dataset.id));
    }
  });

  $('#cargar-mas').addEventListener('click', () => {
    state.visible += 18;
    renderCards();
  });

  $('#otra-pieza').addEventListener('click', () => setFeatured(nextDeckEntry()));
  $('#pieza-destacada').addEventListener('click', () => openReader(state.featured));
  $('#pieza-destacada').addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openReader(state.featured);
    }
  });
  $('#azar-hero').addEventListener('click', () => openReader(nextDeckEntry()));
  $('#cerrar-lector').addEventListener('click', () => reader.close());
  reader.addEventListener('click', event => {
    const bounds = reader.getBoundingClientRect();
    const outside = event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
    if (outside) reader.close();
  });

  $('#menu-toggle').addEventListener('click', event => {
    const open = event.currentTarget.getAttribute('aria-expanded') === 'true';
    event.currentTarget.setAttribute('aria-expanded', String(!open));
    $('#nav-principal').classList.toggle('is-open', !open);
  });
}

async function init() {
  try {
    const response = await fetch('./columnas-jzg.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    state.entries = data.entradas || [];
    state.filtered = [...state.entries];

    $('#stat-columnas').textContent = data.total_columnas || state.entries.length;
    $('#stat-temas').textContent = getTopics(state.entries).length;
    $('#footer-year').textContent = new Date().getFullYear();
    $('#fecha-hoy').textContent = new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date()).toUpperCase();

    renderTicker();
    renderFilters();
    renderCards();
    setFeatured(nextDeckEntry());
    bindEvents();
  } catch (error) {
    console.error(error);
    grid.innerHTML = '<p>No se ha podido abrir el archivo. Comprueba que columnas-jzg.json esté disponible.</p>';
    $('#contador-resultados').textContent = 'Archivo no disponible';
  }
}

init();