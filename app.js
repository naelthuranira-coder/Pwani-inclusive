/* ==========================================================
   app.js  -  start-up file (loaded last on every page)
   Order of script tags in each HTML page:
     js/data.js    fixed content + Swahili words
     js/core.js    helpers, saved data, language, display settings
     js/access.js  read aloud, voice, guide, keys, swipe
     js/pages.js   what each page does
     app.js        this file: connects everything and starts
   ========================================================== */

// 1. One click listener for the whole site.
//    Any element with data-action="name" runs ACTIONS["name"] (see core.js, access.js, pages.js).
document.addEventListener('click', e => {
  const el = e.target.closest('[data-action]');
  if (el && ACTIONS[el.dataset.action]) ACTIONS[el.dataset.action](el);
});

// 2. Newsletter form in the footer (present on every page)
$('#sub-form').addEventListener('submit', e => {
  e.preventDefault();
  const email = $('#nl').value;
  if (!S.sub.includes(email)) S.sub.push(email);            // no duplicates
  save(); e.target.reset(); toast('Subscribed!');
  if (PAGE === 'admin') PAGES.admin.render();               // keep admin counts correct
});

// 3. Start the current page: attach its forms once, then draw it
if (PAGES[PAGE].init) PAGES[PAGE].init();
refresh();

// 4. If Voice was left on last visit, say so
if (voiceOn) setTimeout(() => speak(t('Voice') + ' ' + t('on')), 400);
