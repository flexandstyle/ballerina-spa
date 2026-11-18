// Ballerina SPA — front-end logic
'use strict';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ---------------- i18n ---------------- */
function applyLang() {
  document.documentElement.lang = LANG;
  document.title = t('meta.title');
  $$('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });

  // contacts / links
  $('#hdrPhone').textContent = CONTACTS.phone;
  $('#hdrPhone').href = CONTACTS.phoneHref;
  $('#cardPhone').textContent = CONTACTS.phone;
  $('#cardPhone').href = CONTACTS.phoneHref;
  $('#cardAddr').textContent = CONTACTS.address[LANG] || CONTACTS.address.sl;
  $('#drawerAddr').textContent = CONTACTS.address[LANG] || CONTACTS.address.sl;
  ['heroTg', 'pickBtn', 'tgCta', 'cardTg', 'ftrTg', 'drawerTg', 'socTg', 'mmBook', 'pmBook']
    .forEach(id => { const el = document.getElementById(id); if (el) el.href = CONTACTS.tg; });
  $('#socWa').href = 'https://wa.me/' + CONTACTS.phone.replace(/[^0-9]/g, '');
  $('#socCar').href = '#contacts';
  $('#fab').href = CONTACTS.tg;

  // dynamic bits rebuilt in the new language
  buildPrograms();
  buildMasters();
  buildExtras();
  renderLangList();
  $('#langCur').innerHTML = LANG.toUpperCase() + ' <i>▾</i>';
  localStorage.setItem('ballerina.lang', LANG);
}

function renderLangList() {
  const list = $('#langList');
  list.innerHTML = '';
  LANGS.forEach(l => {
    const b = document.createElement('button');
    b.textContent = l.label;
    b.className = l.code === LANG ? 'on' : '';
    b.onclick = () => { LANG = l.code; applyLang(); list.classList.remove('open'); };
    list.appendChild(b);
  });
}

$('#langCur').addEventListener('click', e => {
  e.stopPropagation();
  $('#langList').classList.toggle('open');
});
document.addEventListener('click', () => $('#langList').classList.remove('open'));

/* ---------------- age gate ---------------- */
const gate = $('#agegate');
if (localStorage.getItem('ballerina.adult') === '1') {
  gate.classList.add('off');
} else {
  document.body.classList.add('lock');
}
$('#ageYes').addEventListener('click', () => {
  localStorage.setItem('ballerina.adult', '1');
  gate.classList.add('off');
  document.body.classList.remove('lock');
  maybePromo();
});
$('#ageNo').addEventListener('click', () => {
  $('#ageBye').hidden = false;
  setTimeout(() => (location.href = 'about:blank'), 1200);
});

/* ---------------- drawer / header ---------------- */
const drawer = $('#drawer'), overlay = $('#overlay');
function closeDrawer() { drawer.classList.remove('open'); overlay.classList.remove('open'); document.body.classList.remove('lock'); }
$('#burger').addEventListener('click', () => {
  drawer.classList.add('open'); overlay.classList.add('open'); document.body.classList.add('lock');
});
$('#drawerX').addEventListener('click', closeDrawer);
overlay.addEventListener('click', closeDrawer);
$$('.drawer__nav a').forEach(a => a.addEventListener('click', closeDrawer));

addEventListener('scroll', () => {
  $('#hdr').classList.toggle('scrolled', scrollY > 30);
}, { passive: true });

/* ---------------- masters ---------------- */
function buildMasters() {
  // top strip
  const track = $('#stripTrack');
  track.innerHTML = '';
  MASTERS.forEach(m => {
    const el = document.createElement('a');
    el.className = 'strip__card';
    el.href = '#masters';
    el.innerHTML = `
      <div class="strip__ph" style="background-image:url('${m.img.replace('/m', '/t')}')"></div>
      <div class="strip__name">${m.name}</div>
      <div class="strip__today">${t('strip.today')}</div>`;
    el.addEventListener('click', e => { e.preventDefault(); openMaster(m.id); });
    track.appendChild(el);
  });

  // cards grid
  const grid = $('#mastersGrid');
  grid.innerHTML = '';
  MASTERS.forEach(m => {
    const card = document.createElement('article');
    card.className = 'mcard';
    card.innerHTML = `
      <div class="mcard__ph" style="background-image:url('${m.img}')">
        ${m.vip ? '<span class="mcard__vip">VIP</span>' : ''}
        <div class="mcard__dots"><i></i><i></i><i></i><i></i></div>
      </div>
      <div class="mcard__name">${m.name}, ${m.age}</div>
      <p class="mcard__stats">
        ${t('masters.height')} <b>${m.h}</b>&nbsp;&nbsp;
        ${t('masters.weight')} <b>${m.w}</b>&nbsp;&nbsp;
        ${t('masters.bust')} <b>${m.bust}</b>
      </p>
      <button class="btn btn--fill">${t('masters.open')}</button>`;
    card.querySelector('button').addEventListener('click', () => openMaster(m.id));
    grid.appendChild(card);
  });
}

$('#stripL').addEventListener('click', () => $('#stripTrack').scrollBy({ left: -560, behavior: 'smooth' }));
$('#stripR').addEventListener('click', () => $('#stripTrack').scrollBy({ left: 560, behavior: 'smooth' }));

function openMaster(id) {
  const m = MASTERS.find(x => x.id === id);
  if (!m) return;
  $('#mmImg').style.backgroundImage = `url('${m.img}')`;
  $('#mmName').textContent = `${m.name}, ${m.age}`;
  $('#mmStats').innerHTML =
    `${t('masters.height')} <b>${m.h}</b> · ${t('masters.weight')} <b>${m.w}</b> · ${t('masters.bust')} <b>${m.bust}</b>`;
  $('#mmAbout').textContent = t('masters.about') + ' ' + m.name + ' — Ballerina SPA.';
  openModal('#masterModal');
}

/* ---------------- programs ---------------- */
function buildPrograms() {
  const names = $('#programsNames');
  names.innerHTML = '';
  PROGRAMS.forEach(p => {
    const li = document.createElement('li');
    li.textContent = p.name;
    li.addEventListener('click', () => openProgram(p.id));
    names.appendChild(li);
  });

  const grid = $('#programsList');
  grid.innerHTML = '';
  PROGRAMS.forEach(p => {
    const el = document.createElement('article');
    el.className = 'pcard';
    el.style.backgroundImage = `url('${p.img}')`;
    el.innerHTML = `
      ${p.vip ? '<span class="tag pcard__vip">VIP</span>' : ''}
      <div class="pcard__body">
        <div class="pcard__name">${p.name}</div>
        <div class="pcard__meta">€${p.price} · ${p.dur} ${t('programs.min')}</div>
        <p class="pcard__desc">${t('prog.' + p.id)}</p>
      </div>`;
    el.addEventListener('click', () => openProgram(p.id));
    grid.appendChild(el);
  });
}

function openProgram(id) {
  const p = PROGRAMS.find(x => x.id === id);
  if (!p) return;
  $('#pmImg').style.backgroundImage = `url('${p.img}')`;
  $('#pmName').textContent = p.name;
  $('#pmMeta').innerHTML = `€${p.price} · ${p.dur} ${t('programs.min')}${p.vip ? ' · <b>VIP</b>' : ''}`;
  $('#pmDesc').textContent = t('prog.' + p.id);
  openModal('#progModal');
}

/* ---------------- extras ---------------- */
function buildExtras() {
  const box = $('#extrasList');
  box.innerHTML = '';
  for (let i = 1; i <= 8; i++) {
    const el = document.createElement('div');
    el.className = 'extra';
    el.textContent = t('extra.e' + i);
    box.appendChild(el);
  }
}

/* ---------------- advantage mini grids ---------------- */
(function fillAdvGrids() {
  const sets = { 1: [1, 2, 3, 4, 5, 6, 7, 8, 9], 2: [9, 8, 7, 6, 5, 4, 3, 2, 1], 3: [5, 3, 8, 1, 9, 6, 2, 7, 4], 4: [2, 6, 4, 8, 1, 7, 3, 9, 5] };
  $$('.adv__grid').forEach(g => {
    sets[g.dataset.grid].forEach(n => {
      const d = document.createElement('div');
      d.style.backgroundImage = `url('assets/img/a${n}.jpg')`;
      g.appendChild(d);
    });
  });
})();

/* ---------------- modals ---------------- */
function openModal(sel) {
  $(sel).hidden = false;
  document.body.classList.add('lock');
}
function closeModal(el) {
  el.closest('.mpopup').hidden = true;
  document.body.classList.remove('lock');
}
$$('[data-close]').forEach(el => el.addEventListener('click', () => closeModal(el)));
$$('.mpopup__x').forEach(el => el.addEventListener('click', () => closeModal(el)));
$$('.mpopup').forEach(m => m.addEventListener('click', e => { if (e.target === m) closeModal(m); }));
addEventListener('keydown', e => { if (e.key === 'Escape') $$('.mpopup:not([hidden])').forEach(closeModal); });

/* ---------------- promo popup ---------------- */
function maybePromo() {
  if (sessionStorage.getItem('ballerina.promo')) return;
  setTimeout(() => {
    sessionStorage.setItem('ballerina.promo', '1');
    openModal('#promoPopup');
  }, 900);
}
$('#chipPromo').addEventListener('click', () => openModal('#promoPopup'));

/* ---------------- cookie ---------------- */
const cookie = $('#cookie');
if (!localStorage.getItem('ballerina.cookie')) cookie.hidden = false;
$('#cookieOk').addEventListener('click', () => {
  localStorage.setItem('ballerina.cookie', '1');
  cookie.hidden = true;
});
$('#cookieMore').addEventListener('click', e => {
  e.preventDefault();
  $('#tmTitle').textContent = t('privacy.title');
  $('#tmText').textContent = t('privacy.t');
  openModal('#textModal');
});

/* ---------------- privacy / jobs ---------------- */
$('#privacyLink').addEventListener('click', e => {
  e.preventDefault();
  $('#tmTitle').textContent = t('privacy.title');
  $('#tmText').textContent = t('privacy.t');
  openModal('#textModal');
});
$('#navJobs').addEventListener('click', e => {
  e.preventDefault();
  closeDrawer();
  $('#tmTitle').textContent = t('job.title');
  $('#tmText').textContent = t('job.t');
  openModal('#textModal');
});
$$('.ftr__bar a[href="#jobs"]').forEach(a => a.addEventListener('click', e => {
  e.preventDefault();
  $('#tmTitle').textContent = t('job.title');
  $('#tmText').textContent = t('job.t');
  openModal('#textModal');
}));

/* ---------------- boot ---------------- */
applyLang();
