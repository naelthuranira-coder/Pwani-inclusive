/* ==========================================================
   access.js  -  accessibility features for blind, low-vision,
                 deaf-blind-friendly and motor-impaired visitors
   1. Read page aloud   2. Voice (speak focused items)
   3. Step-by-step Guide   4. Keyboard shortcuts   5. Touch gestures
   ========================================================== */

/* ---------- 1. Read the whole page aloud ---------- */
const readPage = () => speak($('#app').innerText);          // #app is the <main> area
ACTIONS.read = readPage;

/* ---------- 2. Voice: speak whatever gets keyboard focus ---------- */
ACTIONS.voice = () => {
  voiceOn = !voiceOn;
  setPref('voice', voiceOn ? 1 : 0);
  refresh();                                                // updates the button look
  speak(t('Voice') + ' ' + t(voiceOn ? 'on' : 'off'));
};

addEventListener('focusin', e => {
  if (!voiceOn) return;
  const el = e.target;
  // best name for the element: aria-label, then its <label>, then its text, then placeholder
  const name = el.getAttribute('aria-label') ||
               (el.labels && el.labels[0] && el.labels[0].innerText) ||
               el.innerText || el.placeholder;
  if (name) speak(name + (el.tagName === 'A' ? ', link' : el.tagName === 'BUTTON' ? ', button' : ''));
});

/* ---------- 3. Guide: a short walkthrough shown in a box at the bottom ---------- */
let step = -1;                                              // -1 = guide closed

function showGuide(change) {
  step = step < 0 ? 0 : step + change;                      // open at step 0, or move
  const box = $('#guide');
  const me  = PAGE_ORDER.find(p => p[0] === PAGE);
  const steps = [
    t('You are on the') + ' ' + t(me ? me[1] : PAGE) + '.',
    t('Use the top menu, or swipe left or right, to change page.'),
    t('Double-tap, or press R, to hear this page read aloud.'),
    t(GUIDE_HELP[PAGE] || 'Every button can be reached with the Tab key.')
  ];
  $$('.hl').forEach(el => el.classList.remove('hl'));       // remove old highlight

  if (step < 0 || step >= steps.length) {                   // past the end (or Close): hide
    step = -1; box.hidden = true; stopSpeaking(); return;
  }
  box.hidden = false;
  box.innerHTML =
    `<p><b>${step + 1}/${steps.length}</b> ${steps[step]}</p>
     <div class="row">
       <button data-action="guide-prev" ${step ? '' : 'disabled'}>${t('Back')}</button>
       <button class="p" data-action="guide-next">${t('Next')}</button>
       <button data-action="guide-read">${t('Read')}</button>
       <button data-action="guide-close">${t('Close')}</button>
     </div>`;
  box.dataset.text = steps[step];
  speak(steps[step]);

  // highlight the part of the page the step is talking about
  const target = [$('#nav'), $('#nav'), $('#btn-read'), $('main form, main .btn, main button')][step];
  if (target) { target.classList.add('hl'); target.scrollIntoView({ block: 'center' }); }
}
ACTIONS.guide       = () => showGuide(1);
ACTIONS['guide-next']  = () => showGuide(1);
ACTIONS['guide-prev']  = () => showGuide(-1);
ACTIONS['guide-read']  = () => speak($('#guide').dataset.text);
ACTIONS['guide-close'] = () => { step = -2; showGuide(1); }; // -2 + 1 = -1, so the box closes

/* ---------- 4. Keyboard shortcuts: R read, S stop, G guide, L language, V voice ---------- */
addEventListener('keydown', e => {
  if (e.target.closest('input,textarea,select') || e.ctrlKey || e.altKey) return;   // don't hijack typing
  const k = e.key.toLowerCase();
  if (k === 'r') readPage();
  if (k === 's') stopSpeaking();
  if (k === 'g') showGuide(1);
  if (k === 'l') ACTIONS.lang();
  if (k === 'v') ACTIONS.voice();
});

/* ---------- 5. Touch gestures ----------
   swipe left / right = next / previous page, double-tap = read page, long-press = stop */
let startX, startY, lastTap = 0, pressTimer;
const pageFiles = PAGE_ORDER.map(p => p[0]);

addEventListener('touchstart', e => {
  if (e.target.closest('input,textarea,select,.tw,#guide')) return;   // ignore forms, tables, guide box
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
  clearTimeout(pressTimer);
  pressTimer = setTimeout(() => { stopSpeaking(); toast('Stopped'); }, 800);   // long-press
}, { passive: true });

addEventListener('touchmove', () => clearTimeout(pressTimer), { passive: true });

addEventListener('touchend', e => {
  clearTimeout(pressTimer);
  if (startX == null) return;
  const dx = e.changedTouches[0].clientX - startX;
  const dy = e.changedTouches[0].clientY - startY;
  startX = null;

  if (Math.abs(dx) > 90 && Math.abs(dy) < 50) {                       // a clear sideways swipe
    const here = pageFiles.indexOf(PAGE === 'post' ? 'blog' : PAGE);  // a blog post counts as "blog"
    if (here < 0) return;                                             // admin is not part of the swipe order
    const next = here + (dx < 0 ? 1 : -1);
    if (next >= 0 && next < pageFiles.length) {
      speak(t(PAGE_ORDER[next][1]));                                  // say the page name, then go
      setTimeout(() => location.href = pageFiles[next] + '.html', 500);
    }
  } else if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {                // a tap, not a swipe
    const now = Date.now();
    if (now - lastTap < 350) readPage();                              // two taps close together
    lastTap = now;
  }
});
