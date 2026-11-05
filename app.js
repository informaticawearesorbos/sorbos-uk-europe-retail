const allowedLanguages = ['en', 'es'];
const flavours = ['strawberry', 'lime', 'chocolate'];
let selectedFlavour = 'strawberry';
let lastZoom = null;
const dialog = document.getElementById('zoom');
const zoomImage = document.getElementById('zoom-image');
const zoomCaption = document.getElementById('zoom-caption');

function language() { return document.documentElement.dataset.lang; }
function updateZoomCaption() {
  if (!lastZoom) return;
  const label = lastZoom.dataset[language()];
  zoomImage.alt = label;
  zoomCaption.textContent = label;
}
function setLanguage(lang) {
  lang = allowedLanguages.includes(lang) ? lang : 'en';
  document.documentElement.dataset.lang = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-lang-btn]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.langBtn === lang)));
  document.querySelectorAll('.visual').forEach(button => {
    const label = button.dataset[lang];
    button.setAttribute('aria-label', label);
    button.querySelector('img').alt = label;
  });
  document.querySelector('nav').setAttribute('aria-label', lang === 'es' ? 'Navegación principal' : 'Main navigation');
  const url = new URL(location.href);
  url.searchParams.set('lang', lang);
  history.replaceState(null, '', url);
  updateZoomCaption();
}
function selectFlavour(value) {
  if (!flavours.includes(value)) return;
  selectedFlavour = value;
  document.querySelectorAll('[data-flavour]').forEach(button => {
    const active = button.dataset.flavour === value;
    button.setAttribute('aria-selected', String(active));
    button.tabIndex = active ? 0 : -1;
  });
  document.querySelectorAll('.spec-panel').forEach(panel => { panel.hidden = panel.id !== 'spec-' + value; });
}
document.querySelectorAll('[data-lang-btn]').forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.langBtn)));
document.querySelectorAll('[data-flavour]').forEach(button => {
  button.addEventListener('click', () => selectFlavour(button.dataset.flavour));
  button.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let index = flavours.indexOf(selectedFlavour);
    if (event.key === 'ArrowRight') index = (index + 1) % flavours.length;
    if (event.key === 'ArrowLeft') index = (index + flavours.length - 1) % flavours.length;
    if (event.key === 'Home') index = 0;
    if (event.key === 'End') index = flavours.length - 1;
    selectFlavour(flavours[index]);
    document.getElementById('tab-' + selectedFlavour).focus();
  });
});
document.querySelectorAll('[data-select]').forEach(link => link.addEventListener('click', () => selectFlavour(link.dataset.select)));
const customOptions = ['private', 'pack', 'print'];
let selectedCustom = 'private';
function selectCustom(value) {
  if (!customOptions.includes(value)) return;
  selectedCustom = value;
  document.querySelectorAll('[data-custom]').forEach(button => {
    const active = button.dataset.custom === value;
    button.setAttribute('aria-selected', String(active));
    button.tabIndex = active ? 0 : -1;
  });
  document.querySelectorAll('.custom-panel').forEach(panel => { panel.hidden = panel.id !== 'custom-' + value; });
}
document.querySelectorAll('[data-custom]').forEach(button => {
  button.addEventListener('click', () => selectCustom(button.dataset.custom));
  button.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let index = customOptions.indexOf(selectedCustom);
    if (event.key === 'ArrowRight') index = (index + 1) % customOptions.length;
    if (event.key === 'ArrowLeft') index = (index + customOptions.length - 1) % customOptions.length;
    if (event.key === 'Home') index = 0;
    if (event.key === 'End') index = customOptions.length - 1;
    selectCustom(customOptions[index]);
    document.getElementById('custom-tab-' + selectedCustom).focus();
  });
});
document.querySelectorAll('[data-zoom]').forEach(button => button.addEventListener('click', () => {
  lastZoom = button;
  zoomImage.src = button.dataset.zoom;
  updateZoomCaption();
  dialog.showModal();
}));
document.getElementById('close-zoom').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
setLanguage(new URLSearchParams(location.search).get('lang') || 'en');

const markets = ['uk', 'es'];
function selectMarket(value) {
  if (!markets.includes(value)) return;
  document.querySelectorAll('[data-market]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.market === value)));
  document.querySelectorAll('[data-market-art]').forEach(p => { p.hidden = p.dataset.marketArt !== value; });
  const url = new URL(location.href); url.searchParams.set('market', value); history.replaceState(null, '', url);
}
document.querySelectorAll('[data-market]').forEach(b => b.addEventListener('click', () => selectMarket(b.dataset.market)));
selectMarket(new URLSearchParams(location.search).get('market') || 'uk');
