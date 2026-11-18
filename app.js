// Ballerina SPA — front-end logic
'use strict';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ---------------- i18n ---------------- */
function applyLang() {
  document.documentElement.lang = LANG;
  document.title = t('meta.title');
  $$('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });

  $('#hdrPhone').textContent = CONTACTS.phone;
  $('#hdrPhone').href = CONTACTS.phoneHref;
  $('#cardPhone').textContent = CONTACTS.phone;
  $('#cardPhone').href = CONTACTS.phoneHref;
  $('#cardAddr').textContent = CONTACTS.address[LANG] || CONTACTS.address.sl;
  $('#cardMail').href = 'mailto:' + CONTACTS.mail;
  ['heroTg', 'pickBtn', 'tgCta', 'cardTg', 'ftrTg', 'drawerTg', 'socTg', 'mmBook', 'pmBook',
   'promoBtn', 'fanTg', 'outcallBtn', 'bachelorBtn']
    .forEach(id => { const el = document.getElementById(id); if (el) el.href = CONTACTS.tg; });
  const wa = 'https://wa.me/' + CONTACTS.phone.replace(/[^0-9]/g, '');
  $('#socWa').href = wa;
  $('#fanWa').href = wa;
  $('#fanTel').href = CONTACTS.phoneHref;
  $('#fanTel').dataset.tip = CONTACTS.phone;

  buildToday();
  buildMasters();
  buildExtras();
  renderLangList();
  $('#langCur').textContent = LANG.toUpperCase();
  rotRestart();
  pxRender(true);
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
const drawer = $('#drawer');
function closeDrawer() { drawer.classList.remove('open'); document.body.classList.remove('lock'); }
$('#burger').addEventListener('click', () => {
  drawer.classList.add('open'); document.body.classList.add('lock');
});
$('#drawerX').addEventListener('click', closeDrawer);
$$('.drawer nav a').forEach(a => a.addEventListener('click', closeDrawer));

addEventListener('scroll', () => {
  $('#hdr').classList.toggle('solid', scrollY > 30);
}, { passive: true });

/* ---------------- lead rotator ---------------- */
let rotTimer = null, rotIdx = 0;
function rotRestart() {
  clearInterval(rotTimer);
  rotIdx = 0;
  const el = $('#leadRot');
  const set = () => {
    el.style.animation = 'none';
    void el.offsetWidth;               // restart @keyframes leadRot
    el.style.animation = '';
    el.textContent = t('rot.' + (rotIdx % 4));
    rotIdx++;
  };
  set();
  rotTimer = setInterval(set, 2800);
}

/* ---------------- features panels ---------------- */
(function fxInit() {
  const panels = $('#fxPanels');
  const bgs = $$('.fx-bg', panels);
  const sets = { 1: [1, 2, 3, 4, 5, 6, 7, 8, 9], 2: [6, 3, 9, 1, 5, 8, 2, 7, 4], 3: [5, 3, 8, 1, 9, 6, 2, 7, 4], 4: [2, 6, 4, 8, 1, 7, 3, 9, 5] };
  $$('.fx-grid', panels).forEach(g => {
    sets[g.dataset.grid].forEach(n => {
      const a = document.createElement('a');
      a.className = 'fx-sq';
      a.style.backgroundImage = `url('assets/img/a${n}.jpg')`;
      g.appendChild(a);
    });
  });
  $$('.fx-col', panels).forEach(col => {
    const i = +col.dataset.fx;
    col.addEventListener('mouseenter', () => {
      panels.classList.add('is-hovered');
      bgs[i].classList.add('on');
    });
    col.addEventListener('mouseleave', () => bgs[i].classList.remove('on'));
  });
  panels.addEventListener('mouseleave', () => panels.classList.remove('is-hovered'));
})();

/* ---------------- today strip ---------------- */
function buildToday() {
  const track = $('#stripTrack');
  track.innerHTML = '';
  $('#todayCount').textContent = MASTERS.length;
  MASTERS.forEach(m => {
    const el = document.createElement('a');
    el.className = 'tcard';
    el.href = '#masters';
    el.innerHTML = `
      <img src="${m.img.replace('/m', '/t')}" alt="${m.name}" loading="lazy">
      <span class="tname">${m.name}</span>
      <span class="tstatus"><i></i>${t('strip.today')}</span>`;
    el.addEventListener('click', e => { e.preventDefault(); openMaster(m.id); });
    track.appendChild(el);
  });
}
$('#stripL').addEventListener('click', () => $('#stripTrack').scrollBy({ left: -560, behavior: 'smooth' }));
$('#stripR').addEventListener('click', () => $('#stripTrack').scrollBy({ left: 560, behavior: 'smooth' }));

/* ---------------- masters ---------------- */
function buildMasters() {
  const grid = $('#mastersGrid');
  grid.innerHTML = '';
  MASTERS.forEach(m => {
    const slides = MASTER_SLIDES[m.id] || [m.img];
    const card = document.createElement('article');
    card.className = 'm-card';
    card.innerHTML = `
      <div class="m-media">
        <span class="wm">BALLERINA</span>
        ${slides.map((s, i) => `<img class="slide${i === 0 ? ' active' : ''}" src="${s}" alt="${m.name}" loading="lazy">`).join('')}
        ${m.vip ? '<span class="m-vip">VIP</span>' : ''}
        ${m.sil ? '<span class="m-sil-pill">silicone</span>' : ''}
        <div class="m-dots">${slides.map((_, i) => `<i class="${i === 0 ? 'on' : ''}" data-i="${i}"></i>`).join('')}</div>
      </div>
      <div class="m-name">${m.name}, ${m.age}</div>
      <div class="m-params">
        <span>${t('masters.height')} <b>${m.h}</b></span>
        <span>${t('masters.weight')} <b>${m.w}</b></span>
        <span>${t('masters.bust')} <b>${m.bust}</b></span>
      </div>
      <span class="m-cta">${t('masters.open')}</span>`;
    const imgs = $$('.slide', card), dots = $$('.m-dots i', card);
    dots.forEach(d => d.addEventListener('click', e => {
      e.stopPropagation();
      imgs.forEach(im => im.classList.remove('active'));
      dots.forEach(x => x.classList.remove('on'));
      imgs[+d.dataset.i].classList.add('active');
      d.classList.add('on');
    }));
    card.addEventListener('click', () => openMaster(m.id));
    grid.appendChild(card);
  });
}

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

/* ---------------- programs (prog-x rotating picker) ---------------- */
const PX = { idx: 8, timer: null };
const PXN = PROGRAMS.length;

function pxInit() {
  const bg = $('#pxBg'), list = $('#pxList');
  bg.innerHTML = PROGRAMS.map(p => `<img src="${p.img}" alt="">`).join('');
  list.innerHTML = Array.from({ length: 3 }, () =>
    PROGRAMS.map(p => `<li>${p.name}</li>`).join('')
  ).join('');
  $$('#pxList li').forEach((li, i) => li.addEventListener('click', () => {
    PX.idx = i < PXN ? i + PXN : i;       // prefer middle copy
    pxRender();
    pxAuto(true);
  }));
  $('#pxUp').addEventListener('click', () => { PX.idx--; pxRender(); pxAuto(true); });
  $('#pxDown').addEventListener('click', () => { PX.idx++; pxRender(); pxAuto(true); });
  pxAuto();
}

function pxRender(skipMetaAnim) {
  const list = $('#pxList');
  // seamless wrap inside the middle copy
  if (PX.idx >= 2 * PXN) pxJump(PX.idx - PXN);
  if (PX.idx < PXN) pxJump(PX.idx + PXN);
  list.style.setProperty('--px-idx', PX.idx);
  $$('#pxList li').forEach((li, i) => li.classList.toggle('on', i === PX.idx));
  const p = PROGRAMS[PX.idx % PXN];
  $$('#pxBg img').forEach((im, i) => im.classList.toggle('on', i === PX.idx % PXN));
  const meta = $('#pxMeta');
  if (!skipMetaAnim) { meta.style.animation = 'none'; void meta.offsetWidth; meta.style.animation = ''; }
  $('#pxPrice').textContent = '€ ' + p.price;
  $('#pxDur').textContent = p.dur + ' ' + t('programs.min');
  $('#pxTag').textContent = p.vip ? 'VIP' : 'HIT';
  $('#pxTag').className = 'px-tag' + (p.vip ? '' : ' gold');
}
function pxJump(idx) {
  const list = $('#pxList');
  list.style.transition = 'none';
  PX.idx = idx;
  list.style.setProperty('--px-idx', PX.idx);
  void list.offsetWidth;
  list.style.transition = '';
}
function pxAuto(reset) {
  clearInterval(PX.timer);
  PX.timer = setInterval(() => { PX.idx++; pxRender(); }, 4000);
}

/* ---------------- program modal ---------------- */
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

/* ---------------- interior thumbs ---------------- */
$$('#intThumbs img').forEach(im => im.addEventListener('click', () => {
  $('#intMain').src = im.src;
}));

/* ---------------- seo toggle ---------------- */
$('#seoToggle').addEventListener('click', () => {
  const open = $('#seoBody').classList.toggle('open');
  $('#seoToggle').textContent = open ? t('seo.less') : t('seo.more');
  $('#seoFade').style.display = open ? 'none' : '';
});

/* ---------------- modals ---------------- */
function openModal(sel) {
  $(sel).hidden = false;
  document.body.classList.add('lock');
}
function closeModal(el) {
  el.closest('.bs-promo').hidden = true;
  document.body.classList.remove('lock');
}
$$('[data-close]').forEach(el => el.addEventListener('click', () => closeModal(el)));
$$('.bs-promo').forEach(m => m.addEventListener('click', e => { if (e.target === m) closeModal(m); }));
addEventListener('keydown', e => { if (e.key === 'Escape') $$('.bs-promo:not([hidden])').forEach(closeModal); });

/* ---------------- promo popup ---------------- */
function maybePromo() {
  if (sessionStorage.getItem('ballerina.promo')) return;
  setTimeout(() => {
    sessionStorage.setItem('ballerina.promo', '1');
    openModal('#promoPopup');
  }, 900);
}

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
function openJobs(e) {
  if (e) e.preventDefault();
  closeDrawer();
  $('#tmTitle').textContent = t('job.title');
  $('#tmText').textContent = t('job.t');
  openModal('#textModal');
}
$('#navJobs').addEventListener('click', openJobs);
$('#jobsLink').addEventListener('click', openJobs);

/* ---------------- contact fan ---------------- */
$('#fanMain').addEventListener('click', () => $('#fan').classList.toggle('is-open'));
document.addEventListener('click', e => {
  if (!$('#fan').contains(e.target)) $('#fan').classList.remove('is-open');
});

/* ---------------- boot ---------------- */
pxInit();
applyLang();
