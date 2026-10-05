/* ==========================================================
   pages.js  -  what each page does with the saved data
   Every page has:  init()   runs once  (attach forms / buttons)
                    render() runs on load, on language change, after data changes
   The page layout itself is plain HTML in each .html file.
   ========================================================== */

/* ---------- Pieces shared by several pages ---------- */

// One blog card (used on Home and Blog)
const postCard = p => `
  <article class="card">
    ${picture(p.c)}
    <span class="tag">${t(p.c)}</span>
    <h3>${esc(p.t)}</h3>
    <p class="mut">${esc(p.ex)}</p>
    <div class="row">
      <a class="btn" href="post.html?id=${p.id}">${t('Read more')}</a>
      <span class="mut">♥ ${p.l} · ${p.d}</span>
    </div>
  </article>`;

// Fundraising bar + text (Home and Donate)
function renderFund() {
  const pct = Math.min(100, raised() / GOAL * 100);
  $$('.prog').forEach(bar => {
    bar.setAttribute('role', 'progressbar');                // lets screen readers announce the %
    bar.setAttribute('aria-valuemin', 0);
    bar.setAttribute('aria-valuemax', 100);
    bar.setAttribute('aria-valuenow', Math.round(pct));
    $('i', bar).style.width = pct + '%';
  });
  const title = $('#fund-title'), text = $('#fund-text');
  if (title) title.textContent = `${t('Fund goal')}: ${kes(raised())} / ${kes(GOAL)}`;
  if (text)  text.innerHTML = `<b>${kes(raised())}</b> / ${kes(GOAL)}`;
}

const chosen = name => $$(`input[name=${name}]:checked`).map(i => i.value);   // ticked checkboxes

const PAGES = {

  /* ---------- HOME ---------- */
  index: {
    render() {
      $('#latest-posts').innerHTML = S.posts.slice(0, 3).map(postCard).join('');   // 3 newest posts
      renderFund();
    }
  },

  /* ---------- ABOUT / PROGRAMS / IMPACT: fully static HTML, nothing to do ---------- */
  about:    {},
  programs: {},
  impact:   {},

  /* ---------- BLOG: search box + category buttons ---------- */
  blog: {
    query: '', cat: 'All',
    init() {
      $('#blog-search').addEventListener('input', e => { this.query = e.target.value; this.render(); });
      ACTIONS.cat = btn => { this.cat = btn.dataset.cat; this.render(); };
    },
    render() {
      $$('[data-action="cat"]').forEach(b => {              // highlight the chosen category
        b.classList.toggle('on', b.dataset.cat === this.cat);
        b.setAttribute('aria-pressed', b.dataset.cat === this.cat);
      });
      const q = this.query.toLowerCase();
      const list = S.posts.filter(p =>
        (this.cat === 'All' || p.c === this.cat) && (p.t + p.ex).toLowerCase().includes(q));
      $('#blog-list').innerHTML = list.map(postCard).join('') || `<p>${t('No posts found.')}</p>`;
    }
  },

  /* ---------- POST: one article, chosen by post.html?id=3 ---------- */
  post: {
    init() {
      ACTIONS.like = () => {
        const id = this.current().id;
        if (pref('l' + id)) return toast('Already liked');   // one like per browser
        this.current().l++;
        setPref('l' + id, 1);
        save(); this.render();
      };
      ACTIONS.share = () => {
        const done = () => toast('Link copied');
        if (navigator.clipboard) navigator.clipboard.writeText(location.href).then(done, () => prompt('Copy this link:', location.href));
        else prompt('Copy this link:', location.href);
      };
    },
    current() { return S.posts.find(p => p.id == new URLSearchParams(location.search).get('id')); },
    render() {
      const p = this.current();
      $('#post-view').hidden = !p;
      $('#post-missing').hidden = !!p;
      if (!p) return;
      document.title = p.t;
      $('#post-cat').textContent   = t(p.c);
      $('#post-title').textContent = p.t;
      $('#post-date').textContent  = p.d;
      $('#post-img').innerHTML     = picture(p.c);
      $('#post-ex').textContent    = p.ex;
      $('#post-body').textContent  = p.b;
      $('#post-likes').textContent = p.l;
    }
  },

  /* ---------- VOLUNTEER ---------- */
  volunteer: {
    init() {
      ACTIONS['pick-role'] = btn => { $('#vr').value = btn.dataset.role; $('#vn').focus(); };   // role button fills the form
      $('#vol-form').addEventListener('submit', e => {
        e.preventDefault();                                  // stay on the page
        S.vol.push({
          id: Date.now(), n: $('#vn').value, e: $('#ve').value, p: $('#vp').value,
          r: $('#vr').value, s: $('#vs').value, k: chosen('k'), a: chosen('a'),
          w: $('#vw').value, st: 'Pending', d: today()       // new applications wait for admin approval
        });
        save(); toast('Application received – thank you!'); e.target.reset();
      });
    }
  },

  /* ---------- DONATE ---------- */
  donate: {
    init() {
      ACTIONS.amount = btn => this.setAmount(+btn.dataset.amount);
      $('#don-form').addEventListener('submit', e => {
        e.preventDefault();
        S.don.push({ n: $('#dn').value, a: +$('#da').value, m: $('#dm').value, d: today() });
        save(); toast('Donation recorded – asante sana!');
        e.target.reset(); this.setAmount(1000);
        this.render();                                       // bar + supporters list update at once
      });
      $('#da').addEventListener('input', e => this.markAmount(+e.target.value));
    },
    setAmount(n) { $('#da').value = n; this.markAmount(n); },
    markAmount(n) { $$('[data-action="amount"]').forEach(b => b.classList.toggle('on', +b.dataset.amount === n)); },
    render() {
      renderFund();
      $('#supporters').innerHTML = S.don.slice().reverse().slice(0, 6)      // newest 6 first
        .map(d => `<tr><td>${esc(d.n)}</td><td>${kes(d.a)}</td><td class="mut">${d.d}</td></tr>`).join('');
      this.markAmount(+$('#da').value);
    }
  },

  /* ---------- CONTACT ---------- */
  contact: {
    init() {
      const about = new URLSearchParams(location.search).get('about');     // from Programs / Impact buttons
      if (about) $('#cm').value = 'I am interested in: ' + about;
      $('#msg-form').addEventListener('submit', e => {
        e.preventDefault();
        S.msg.push({ id: Date.now(), ty: 'General', n: $('#cn').value, e: $('#ce').value, t: $('#cm').value, d: today() });
        save(); toast('Message sent – thank you!'); e.target.reset();
      });
    }
  },

  /* ---------- ADMIN ---------- */
  admin: {
    tab: 'overview',
    init() {
      $('#login-form').addEventListener('submit', e => {
        e.preventDefault();
        if ($('#pw').value === ADMIN_PASS) { S.adm = 1; save(); this.render(); }
        else toast('Wrong password');
      });
      $('#post-form').addEventListener('submit', e => {
        e.preventDefault();
        S.posts.unshift({ id: Date.now(), t: $('#pt').value, c: $('#pc').value, ex: $('#px').value, b: $('#pb').value, d: today(), l: 0 });
        save(); e.target.reset(); this.render(); toast('Published');
      });
      // buttons inside the admin tables carry data-id; we remove or approve that record
      const ask = () => confirm(t('Delete this item?'));
      ACTIONS.tab       = btn => { this.tab = btn.dataset.tab; this.render(); };
      ACTIONS['del-post'] = btn => { if (ask()) { S.posts = S.posts.filter(p => p.id != btn.dataset.id); save(); this.render(); } };
      ACTIONS['del-vol']  = btn => { if (ask()) { S.vol   = S.vol.filter(v => v.id != btn.dataset.id);   save(); this.render(); } };
      ACTIONS['del-msg']  = btn => { if (ask()) { S.msg   = S.msg.filter(m => m.id != btn.dataset.id);   save(); this.render(); } };
      ACTIONS.approve   = btn => { S.vol.find(v => v.id == btn.dataset.id).st = 'Approved'; save(); this.render(); };
      ACTIONS.reset     = () => { if (confirm(t('Reset all demo data?'))) { S = seed(); S.adm = 1; save(); this.render(); } };   // stay signed in after a reset
      ACTIONS.logout    = () => { S.adm = 0; save(); this.render(); };
    },
    render() {
      $('#admin-login').hidden = !!S.adm;                    // logged out: show only the sign-in form
      $('#admin-panel').hidden = !S.adm;
      if (!S.adm) return;

      // tabs: show the chosen panel, hide the rest
      $$('.tabpanel').forEach(p => p.hidden = p.id !== 'tab-' + this.tab);
      $$('[data-action="tab"]').forEach(b => {
        b.classList.toggle('on', b.dataset.tab === this.tab);
        b.setAttribute('aria-pressed', b.dataset.tab === this.tab);
      });

      // overview numbers
      $('#st-raised').textContent = kes(raised());
      $('#st-don').textContent    = S.don.length;
      $('#st-vol').textContent    = S.vol.length;
      $('#st-posts').textContent  = S.posts.length;
      $('#st-msg').textContent    = S.msg.length;
      $('#st-sub').textContent    = S.sub.length;

      const del = (action, id) => `<button class="d" data-action="${action}" data-id="${id}">${t('Delete')}</button>`;
      const none = `<tr><td>${t('None')}</td></tr>`;

      $('#admin-posts').innerHTML = S.posts.map(p =>
        `<tr><td>${esc(p.t)}</td><td>${del('del-post', p.id)}</td></tr>`).join('') || none;

      $('#admin-vols').innerHTML = S.vol.map(v =>
        `<tr>
           <td>${esc(v.n)}<br><span class="mut">${esc(v.e)} · ${esc(v.p)}</span></td>
           <td>${t(esc(v.r))}</td><td>${esc(v.s)}</td><td>${t(v.st)}</td>
           <td>${v.st !== 'Approved' ? `<button data-action="approve" data-id="${v.id}">${t('Approve')}</button> ` : ''}${del('del-vol', v.id)}</td>
         </tr>`).join('') || none;

      $('#admin-dons').innerHTML = S.don.slice().reverse().map(d =>
        `<tr><td>${esc(d.n)}</td><td>${kes(d.a)}</td><td>${esc(t(d.m))}</td><td>${d.d}</td></tr>`).join('') || none;

      $('#admin-msgs').innerHTML = S.msg.slice().reverse().map(m =>
        `<div class="card">
           <p><b>${esc(m.n)}</b> · ${esc(m.e)} · <span class="mut">${m.d}</span></p>
           <p>${esc(m.t)}</p>
           <div>${del('del-msg', m.id)}</div>
         </div>`).join('') || `<p>${t('None')}</p>`;

      $('#admin-subs').textContent = S.sub.join(', ') || t('None');
    }
  }
};
