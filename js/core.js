/* ==========================================================
   core.js  -  shared tools used by every page
   1. small helpers      2. saved data (localStorage)
   3. language (EN / SW) 4. display settings (text size, contrast, dark)
   5. speech + toast     6. image fallback
   ========================================================== */

/* ---------- 1. Small helpers ---------- */
const $  = (sel, root = document) => root.querySelector(sel);          // first match
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];  // all matches
const kes   = n => 'KES ' + Number(n).toLocaleString();                // 2500 -> "KES 2,500"
const today = () => new Date().toISOString().slice(0, 10);             // "2026-09-30"
const PAGE  = document.body.dataset.page;                              // which page am I on? (set in <body data-page>)

// Make user text safe before putting it inside HTML (stops script injection)
const esc = s => String(s).replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Every button in the HTML says what it does with data-action="name".
// Other files add their functions here, and app.js runs the matching one on click.
const ACTIONS = {};

/* ---------- 2. Saved data ----------
   All site data lives in one object S, saved as JSON in the browser. */
const pref    = (k, d) => { try { return localStorage.getItem(STORE_KEY + k) || d; } catch (e) { return d; } };
const setPref = (k, v) => { try { localStorage.setItem(STORE_KEY + k, v); } catch (e) {} };

let S;
try { S = JSON.parse(localStorage.getItem(STORE_KEY)); } catch (e) {}
if (!S) S = seed();                                          // first visit: use starter data
const save   = () => { try { localStorage.setItem(STORE_KEY, JSON.stringify(S)); } catch (e) {} };
const raised = () => BASE_RAISED + S.don.reduce((sum, d) => sum + d.a, 0);

/* ---------- 3. Language ----------
   HTML text carries data-i18n. We remember the English original in data-en
   and swap in the Swahili from SW (data.js) when the language is "sw". */
let lang = pref('lang', 'en');
const t = s => (lang === 'sw' && SW[s]) || s;               // translate one phrase

function applyLang() {
  document.documentElement.lang = lang;
  $$('[data-i18n]').forEach(el => {                         // normal text
    if (!el.dataset.en) el.dataset.en = el.textContent.trim();
    el.textContent = t(el.dataset.en);
  });
  $$('[data-i18n-ph]').forEach(el => el.placeholder = t(el.dataset.i18nPh));        // placeholders
  $$('[data-i18n-aria]').forEach(el => el.setAttribute('aria-label', t(el.dataset.i18nAria))); // screen-reader labels
  $('[data-action="lang"]').textContent = lang === 'en' ? 'SW' : 'EN';              // button shows the OTHER language
  if (PAGE !== 'post') {                                    // the post page sets its own title
    const me = PAGE_ORDER.find(p => p[0] === PAGE);
    document.title = (me ? t(me[1]) + ' · ' : '') + 'Pwani Inclusive';
  }
}

ACTIONS.lang = () => { lang = lang === 'en' ? 'sw' : 'en'; setPref('lang', lang); refresh(); };

/* ---------- 4. Display settings (remembered between visits) ---------- */
const root = document.documentElement;
let fontPct = +pref('fs', 100);                              // text size in %
root.style.setProperty('--fs', fontPct + '%');
if (pref('hc') === '1') root.dataset.hc = 1;                 // high contrast
if (pref('th'))         root.dataset.theme = pref('th');     // light / dark

const changeFont = d => {
  fontPct = Math.min(150, Math.max(85, fontPct + d * 10));   // keep between 85% and 150%
  root.style.setProperty('--fs', fontPct + '%');
  setPref('fs', fontPct);
};
ACTIONS.bigger  = () => changeFont(1);
ACTIONS.smaller = () => changeFont(-1);
ACTIONS.contrast = () => {
  if (root.dataset.hc) { delete root.dataset.hc; setPref('hc', 0); }
  else                 { root.dataset.hc = 1;     setPref('hc', 1); }
};
ACTIONS.theme = () => {
  const isDark = root.dataset.theme
    ? root.dataset.theme === 'dark'
    : matchMedia('(prefers-color-scheme:dark)').matches;    // no choice yet: follow the device
  root.dataset.theme = isDark ? 'light' : 'dark';
  setPref('th', root.dataset.theme);
};
ACTIONS.menu = btn => {                                      // phone menu open / close
  const open = $('#nav').classList.toggle('open');
  btn.setAttribute('aria-expanded', open);
};

/* ---------- 5. Speech + toast ---------- */
let voiceOn = pref('voice', '0') === '1';
const speak = text => {
  try {
    speechSynthesis.cancel();                                // stop anything already speaking
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === 'sw' ? 'sw-KE' : 'en-GB';
    speechSynthesis.speak(u);
  } catch (e) {}
};
const stopSpeaking = () => { try { speechSynthesis.cancel(); } catch (e) {} };

let toastTimer;
function toast(msg) {                                        // small pop-up message
  const el = $('#toast');
  el.textContent = t(msg);
  el.classList.add('show');
  if (voiceOn) speak(t(msg));                                // read it out when Voice is on
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2800);
}

/* ---------- 6. Image fallback ----------
   If a photo is missing from /images, draw a built-in illustration instead. */
const ART = {   // tiny SVG shapes: [shape, sky colour, ground colour]
  Health: ['chair', '#9fe3dc', '#e9fbf7'], Skills: ['book', '#ffd9a0', '#fff3de'], Stories: ['hands', '#b9d8ff', '#eef5ff'],
  Business: ['shop', '#ffc9b8', '#fff0ea'], Community: ['heart', '#d9c7ff', '#f5efff'], Culture: ['boat', '#ffe2a8', '#fff8e6'],
  Hero: ['boat', '#ffd9a0', '#e9fbf7'], Volunteer: ['hands', '#b9d8ff', '#eef5ff']
};
const SHAPE = {
  boat:  "<path d='M150 290h180l-30 30H180z' fill='#3b2a1a'/><path d='M240 290V160l90 130z' fill='#fff'/>",
  chair: "<circle cx='250' cy='215' r='18' fill='#222'/><rect x='236' y='233' width='28' height='45' rx='9' fill='#222'/><circle cx='252' cy='300' r='34' fill='none' stroke='#222' stroke-width='7'/>",
  book:  "<rect x='220' y='210' width='160' height='95' rx='8' fill='#fff'/><path d='M300 210v95' stroke='#0b7a75' stroke-width='5'/>",
  hands: "<circle cx='230' cy='230' r='20' fill='#222'/><circle cx='300' cy='215' r='20' fill='#5a3a22'/><circle cx='370' cy='230' r='20' fill='#222'/><path d='M205 255h50v50h-50zM275 240h50v65h-50zM345 255h50v50h-50z' fill='#f2a33a'/>",
  heart: "<path d='M300 300C220 240 230 180 275 190c15 3 25 12 25 20 0-8 10-17 25-20 45-10 55 50-25 110z' fill='#e0526b'/>",
  shop:  "<path d='M200 300V210h200v90z' fill='#fff'/><path d='M190 210l20-40h180l20 40z' fill='#f2a33a'/><rect x='285' y='245' width='30' height='55' fill='#0b7a75'/>"
};
const placeholder = cat => {
  const [shape, sky, ground] = ART[cat] || ART.Community;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='${sky}'/><stop offset='1' stop-color='${ground}'/></linearGradient></defs><rect width='600' height='400' fill='url(#g)'/><circle cx='470' cy='100' r='46' fill='#ffd36b'/><path d='M0 290Q150 250 300 290T600 290V400H0Z' fill='#0b7a75' opacity='.6'/><path d='M0 335Q150 305 300 335T600 335V400H0Z' fill='#064e4b'/>${SHAPE[shape]}</svg>`);
};
const useFallback = img => { const c = img.dataset.fallback; img.removeAttribute('data-fallback'); img.src = placeholder(c); };

// Image tag for cards made by JavaScript (blog list, post page)
const picture = (cat, alt = '') =>
  `<img class="img" loading="lazy" alt="${esc(alt)}" src="images/${cat.toLowerCase()}.jpeg" data-fallback="${cat}">`;

// "error" events do not bubble, so listen in the capture phase for every <img>
addEventListener('error', e => { if (e.target.matches && e.target.matches('img[data-fallback]')) useFallback(e.target); }, true);
// Catch images that already failed before this script started
const fixBrokenImages = () => $$('img[data-fallback]').forEach(i => { if (i.complete && !i.naturalWidth) useFallback(i); });

/* ---------- Refresh: redraw everything that depends on language or data ---------- */
function refresh() {
  applyLang();
  if (PAGES[PAGE] && PAGES[PAGE].render) PAGES[PAGE].render();   // PAGES is defined in pages.js
  $('[data-action="voice"]').classList.toggle('on', voiceOn);
  $('[data-action="voice"]').setAttribute('aria-pressed', voiceOn);
  fixBrokenImages();
}
