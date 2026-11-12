'use strict';

/* =====================================================================
   Proofy — прототип. Данные тестовые и хранятся в localStorage.
   Слой API ниже имитирует сервер: задержка, коды ответа, журнал запросов.
   ===================================================================== */

const STORE = 'proofy-v1';
/* embed=1 — сайт показан внутри макета ноутбука/телефона на главной: без шапки, интро и записи данных */
const EMBED = new URLSearchParams(location.search).has('embed');

const LEVELS = {
  school:   { label: 'Школьный',        base: 20 },
  city:     { label: 'Городской',       base: 35 },
  region:   { label: 'Областной',       base: 55 },
  national: { label: 'Республиканский', base: 75 },
  intl:     { label: 'Международный',   base: 85 },
};
const RESULTS = {
  winner:      { label: 'Победитель', k: 1 },
  prize:       { label: 'Призёр',     k: 0.7 },
  finalist:    { label: 'Финалист',   k: 0.4 },
  participant: { label: 'Участник',   k: 0.15 },
};
const DIRECTIONS = ['IT', 'Математика', 'Робототехника', 'Физика'];
const CITIES = ['Актобе', 'Хромтау', 'Кандыагаш', 'Шалкар', 'Эмба', 'Алматы', 'Астана'];
const PURPOSES = ['Грант на обучение', 'Стажировка', 'Консультация по поступлению', 'Летняя школа'];

/* Резюме тестовых школьников: кто он, что делает, чем известен */
const PROFILES = {
  s1: { headline: 'Пишет на Python и делает Telegram-ботов', fame: 'Победила на Gambit Hackathon 2026', about: 'Сделала бота школьного расписания, им пользуются 600 учеников. Хочет учиться на программиста.', skills: ['Python', 'Telegram-боты', 'Figma'], projects: [['Бот расписания', 'Telegram-бот для 600 учеников школы']] },
  s2: { headline: 'Капитан команды по робототехнике', fame: 'Привёл команду к победе на областном турнире FTC', about: 'Собирает роботов с 8 класса и учит младших программировать на C++.', skills: ['C++', 'Arduino', 'CAD'], projects: [['Робот-сортировщик', 'Робот для турнира FTC, собран за 6 недель']] },
  s3: { headline: 'Олимпиадная математика', fame: 'Победительница областной олимпиады по математике', about: 'Решает задачи по комбинаторике и бесплатно ведёт кружок для младших.', skills: ['Комбинаторика', 'Геометрия', 'Теория чисел'], projects: [['Кружок для младших', 'Занятия для учеников 5–7 классов']] },
  s4: { headline: 'Спортивное программирование', fame: 'Победитель республиканской олимпиады по информатике', about: 'Готовится к международной олимпиаде.', skills: ['C++', 'Алгоритмы'], projects: [] },
  s5: { headline: 'Инженер-конструктор', fame: 'Призёр областного турнира FTC', about: 'Проектирует детали в CAD и печатает их на 3D-принтере.', skills: ['3D-печать', 'CAD', 'Электроника'], projects: [['Протез-манипулятор', 'Прототип кисти руки из 3D-печати']] },
  s6: { headline: 'Любит алгебру', fame: 'Участник областной олимпиады по математике', about: 'Готовится к областной олимпиаде следующего года.', skills: ['Алгебра'], projects: [] },
};
/* Фото: Unsplash (бесплатная лицензия), авторы указаны в README */
const PHOTO = (id, w = 1200) => `https://images.unsplash.com/photo-${id}?w=${w}&q=72&auto=format&fit=crop`;
const emptyProfile = () =>({ headline: '', fame: '', about: '', skills: [], projects: [] });

/* ---------------- Иконки ---------------- */
const svg = (d, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${extra}>${d}</svg>`;
const I = {
  check: svg('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
  x: svg('<path d="M6 6l12 12M18 6L6 18"/>'),
  alert: svg('<path d="M12 8v5M12 16.5v.5"/><path d="M10.3 3.9L2.4 18a2 2 0 001.7 3h15.8a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z"/>'),
  shield: svg('<path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>'),
  qr: svg('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3M21 14v.01M17 21h4v-4M14 18v3"/>'),
  upload: svg('<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3a2 2 0 002 2h12a2 2 0 002-2v-3"/>'),
  user: svg('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>'),
  search: svg('<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>'),
  lock: svg('<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/>'),
  eye: svg('<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
  key: svg('<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3"/>'),
  doc: svg('<path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>'),
  building: svg('<path d="M3 21h18M5 21V7l7-4 7 4v14"/><path d="M9 21v-6h6v6M9 10h.01M15 10h.01"/>'),
  spark: svg('<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/>'),
  camera: svg('<path d="M4 7h3l2-3h6l2 3h3a1 1 0 011 1v11a1 1 0 01-1 1H4a1 1 0 01-1-1V8a1 1 0 011-1z"/><circle cx="12" cy="13" r="4"/>'),
  link: svg('<path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1"/>'),
  print: svg('<path d="M6 9V3h12v6M6 18H4a1 1 0 01-1-1v-6a2 2 0 012-2h14a2 2 0 012 2v6a1 1 0 01-1 1h-2"/><rect x="6" y="14" width="12" height="7"/>'),
  download: svg('<path d="M12 4v12M7 11l5 5 5-5M4 20h16"/>'),
  arrow: svg('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  server: svg('<rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 7.5h.01M7 16.5h.01"/>'),
  map: svg('<path d="M12 21s-7-6.2-7-11.5A7 7 0 0119 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'),
};

/* ---------------- Тестовые данные ---------------- */
function seed() {
  return {
    orgs: [
      { id: 'o1', name: 'Gambit Hackathon (HackHub)', city: 'Актобе', verified: true },
      { id: 'o2', name: 'Управление образования области (тест)', city: 'Актобе', verified: true },
      { id: 'o3', name: 'Республиканский центр олимпиад (тест)', city: 'Астана', verified: true },
      { id: 'o4', name: 'Star Olympiad International (онлайн)', city: '—', verified: false },
    ],
    contests: [
      { id: 'k1', code: 'GH26', orgId: 'o1', name: 'Gambit Hackathon 2026', direction: 'IT', level: 'region', participants: 300, selection: true, paid: false, awarded: 10, date: '2026-11-14', next: 4 },
      { id: 'k2', code: 'OM26', orgId: 'o2', name: 'Областная олимпиада по математике', direction: 'Математика', level: 'region', participants: 1200, selection: true, paid: false, awarded: 8, date: '2026-02-20', next: 4 },
      { id: 'k3', code: 'RI26', orgId: 'o3', name: 'Республиканская олимпиада по информатике', direction: 'IT', level: 'national', participants: 2500, selection: true, paid: false, awarded: 5, date: '2026-04-10', next: 3 },
      { id: 'k4', code: 'SO26', orgId: 'o4', name: 'Star Olympiad — математика', direction: 'Математика', level: 'intl', participants: 5000, selection: false, paid: true, awarded: 85, date: '2026-03-01', next: 3 },
      { id: 'k5', code: 'FT26', orgId: 'o2', name: 'Областной турнир по робототехнике FTC', direction: 'Робототехника', level: 'region', participants: 160, selection: true, paid: false, awarded: 15, date: '2026-03-15', next: 3 },
    ],
    students: [
      { id: 's1', name: 'Айгерим Нурланова', grade: 10, city: 'Хромтау', school: 'Школа-гимназия №1', direction: 'IT', parent: true, search: true, showName: false, portfolio: true, contact: 'aigerim.test@example.com' },
      { id: 's2', name: 'Данияр Сапаров', grade: 11, city: 'Актобе', school: 'НИШ (тест)', direction: 'Робототехника', parent: true, search: true, showName: true, portfolio: true, contact: 'daniyar.test@example.com' },
      { id: 's3', name: 'Мадина Ержанова', grade: 9, city: 'Шалкар', school: 'СОШ №2', direction: 'Математика', parent: true, search: true, showName: false, portfolio: false, contact: 'madina.test@example.com' },
      { id: 's4', name: 'Тимур Ахметов', grade: 11, city: 'Алматы', school: 'Лицей №165 (тест)', direction: 'IT', parent: false, search: false, showName: false, portfolio: false, contact: 'timur.test@example.com' },
      { id: 's5', name: 'Аружан Кайратова', grade: 10, city: 'Кандыагаш', school: 'СОШ №5', direction: 'Робототехника', parent: true, search: true, showName: true, portfolio: true, contact: 'aruzhan.test@example.com' },
      { id: 's6', name: 'Ерлан Беков', grade: 10, city: 'Эмба', school: 'СОШ №1', direction: 'Математика', parent: true, search: true, showName: false, portfolio: false, contact: 'erlan.test@example.com' },
    ],
    certs: [
      { id: 'PRF-GH26-0001', contestId: 'k1', studentId: 's1', result: 'winner' },
      { id: 'PRF-RI26-0001', contestId: 'k3', studentId: 's1', result: 'prize' },
      { id: 'PRF-GH26-0002', contestId: 'k1', studentId: 's2', result: 'prize' },
      { id: 'PRF-FT26-0001', contestId: 'k5', studentId: 's2', result: 'winner' },
      { id: 'PRF-OM26-0001', contestId: 'k2', studentId: 's3', result: 'winner' },
      { id: 'PRF-SO26-0001', contestId: 'k4', studentId: 's3', result: 'winner' },
      { id: 'PRF-OM26-0002', contestId: 'k2', studentId: 's4', result: 'prize' },
      { id: 'PRF-RI26-0002', contestId: 'k3', studentId: 's4', result: 'winner' },
      { id: 'PRF-FT26-0002', contestId: 'k5', studentId: 's5', result: 'prize' },
      { id: 'PRF-GH26-0003', contestId: 'k1', studentId: 's5', result: 'participant' },
      { id: 'PRF-SO26-0002', contestId: 'k4', studentId: 's6', result: 'winner' },
      { id: 'PRF-OM26-0003', contestId: 'k2', studentId: 's6', result: 'participant' },
    ],
    buyers: [
      { id: 'b1', name: 'Агентство «Bilim Path» (тест)', type: 'Образовательное агентство' },
      { id: 'b2', name: 'Приёмная комиссия, региональный вуз (тест)', type: 'Вуз' },
    ],
    requests: [
      { id: 'r1', buyerId: 'b1', studentId: 's1', purpose: 'Консультация по поступлению', status: 'pending', date: '2026-11-11' },
      { id: 'r2', buyerId: 'b2', studentId: 's2', purpose: 'Грант на обучение', status: 'approved', date: '2026-11-10' },
    ],
    session: { orgId: 'o1', studentId: 's1', buyerId: 'b1' },
    checks: 0,
    seq: 100,
  };
}

let db = load();
function load() {
  try { const raw = localStorage.getItem(STORE); if (raw) return JSON.parse(raw); } catch (e) { /* приватный режим */ }
  return seed();
}
function save() { if (EMBED) return; try { localStorage.setItem(STORE, JSON.stringify(db)); } catch (e) { /* ignore */ } }

/* ---------------- Хелперы ---------------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const rand = (a, b) => Math.round(a + Math.random() * (b - a));
const find = (list, id) => db[list].find((x) => x.id === id);
const org = (id) => find('orgs', id);
const contest = (id) => find('contests', id);
const student = (id) => find('students', id);
const buyer = (id) => find('buyers', id);
const certsOf = (sid) => db.certs.filter((c) => c.studentId === sid);
const fmtDate = (d) => { if (!d) return '—'; const [y, m, dd] = d.split('-'); return `${dd}.${m}.${y}`; };
const initials = (name) => name.split(/\s+/).filter(Boolean).map((p) => p[0] + '.').join(' ');
const shownName = (s) => (s.showName ? s.name : initials(s.name));
const plural = (n, a, b, c) => { const m10 = n % 10, m100 = n % 100; return m10 === 1 && m100 !== 11 ? a : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? b : c; };
const certUrl = (id) => `${location.origin}${location.pathname}#/c/${id}`;

function contestWeight(c) {
  const verified = c.orgVerified !== undefined ? c.orgVerified : (org(c.orgId) || {}).verified;
  const parts = [];
  const lvl = LEVELS[c.level];
  parts.push([`Уровень: ${lvl.label.toLowerCase()}`, lvl.base]);
  const size = Math.round(Math.min(15, Math.log10(Math.max(+c.participants || 1, 1)) * 5));
  parts.push([`${(+c.participants).toLocaleString('ru-RU')} участников`, size]);
  if (c.selection) parts.push(['Есть отборочный этап', 10]);
  if (!verified) parts.push(['Организатор не подтверждён', -30]);
  if (c.paid && !c.selection) parts.push(['Платное участие без отбора', -25]);
  if (+c.awarded > 50) parts.push([`Наградили ${c.awarded}% участников`, -20]);
  const total = Math.max(0, Math.min(100, parts.reduce((a, p) => a + p[1], 0)));
  return { total, parts };
}
const certPoints = (cert) => Math.round(contestWeight(contest(cert.contestId)).total * RESULTS[cert.result].k);
const rating = (sid) => certsOf(sid).reduce((a, c) => a + certPoints(c), 0);
const bestWeight = (sid) => Math.max(0, ...certsOf(sid).map((c) => contestWeight(contest(c.contestId)).total));
const wClass = (w) => (w >= 70 ? 'w-hi' : w >= 40 ? 'w-mid' : 'w-lo');
const wColor = (w) => (w >= 70 ? 'var(--ok)' : w >= 40 ? 'var(--warn)' : 'var(--bad)');
const wbar = (w) => `<span class="wbar ${wClass(w)}" title="Вес конкурса"><span class="bar"><i style="width:${w}%"></i></span>${w}</span>`;

function ring(val, size = 150, label = 'вес', stroke = 12) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  return `<div class="ring" style="--rs:${Math.round(size / 4.6)}px">
    <svg width="${size}" height="${size}"><circle class="track" cx="${size / 2}" cy="${size / 2}" r="${r}" stroke-width="${stroke}" fill="none"/>
    <circle class="val" cx="${size / 2}" cy="${size / 2}" r="${r}" stroke-width="${stroke}" fill="none" stroke-linecap="round"
      stroke="${wColor(val)}" stroke-dasharray="${c}" stroke-dashoffset="${c}" data-ring="${val}" data-c="${c}"/></svg>
    <div class="ring-label"><b data-count="${val}">0</b><span>${label}</span></div></div>`;
}
function breakdown(w) {
  return `<ul class="breakdown">${w.parts.map(([t, v], i) => `<li style="animation-delay:${i * 60}ms"><span>${esc(t)}</span><span class="${v >= 0 ? 'plus' : 'minus'}">${v >= 0 ? '+' : '−'}${Math.abs(v)}</span></li>`).join('')}
    <li class="total"><span>Итого</span><span>${w.total} / 100</span></li></ul>`;
}
function avatar(s, cls = '') {
  const palette = ['linear-gradient(135deg,#2EC5F0,#7EDCF7)', 'linear-gradient(135deg,#F6C343,#FFE08A)', 'linear-gradient(135deg,#33D69F,#9CF0CF)', 'linear-gradient(135deg,#A9B8FF,#D9E0FF)'];
  const h = [...s.id].reduce((a, ch) => a + ch.charCodeAt(0), 0);
  const txt = s.showName || cls.includes('own') ? initials(s.name).replace(/[.\s]/g, '') : s.grade;
  return `<div class="avatar ${cls}" style="background:${palette[h % palette.length]}">${esc(txt)}</div>`;
}

/* SHA-256 отпечаток записи */
const payload = (c) => `${c.id}|${c.contestId}|${c.studentId}|${c.result}`;
async function sha(text) {
  if (window.crypto && crypto.subtle) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0).toString(16).padStart(8, '0').repeat(8);
}
/* ---------------- Криптография: ECDSA P-256 ----------------
   У каждого организатора своя пара ключей. Каждый сертификат подписан
   закрытым ключом организатора; проверить подпись может кто угодно по открытому ключу. */
const HAS_CRYPTO = !!(window.crypto && crypto.subtle);
const ALG = { name: 'ECDSA', namedCurve: 'P-256' };
const SIGN = { name: 'ECDSA', hash: 'SHA-256' };
const enc = (t) => new TextEncoder().encode(t);
const b64u = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64u = (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));
const signPayload = (c) => {
  const k = contest(c.contestId);
  return `PROOFY/1|${c.id}|${k.orgId}|${k.name}|${k.date}|${c.studentId}|${c.result}`;
};
async function genKeys() {
  const kp = await crypto.subtle.generateKey(ALG, true, ['sign', 'verify']);
  const pub = await crypto.subtle.exportKey('jwk', kp.publicKey);
  return { pub, priv: await crypto.subtle.exportKey('jwk', kp.privateKey), kid: (await sha(pub.x + pub.y)).slice(0, 16) };
}
const importKey = (jwk, use) => crypto.subtle.importKey('jwk', { ...jwk, key_ops: [use] }, ALG, false, [use]);
async function signCert(c) {
  const keys = db.keys[contest(c.contestId).orgId];
  const key = await importKey(keys.priv, 'sign');
  c.sig = b64u(await crypto.subtle.sign(SIGN, key, enc(signPayload(c))));
  c.kid = keys.kid;
}
async function verifySig(c, result) {
  if (!HAS_CRYPTO || !c.sig) return false;
  const keys = db.keys[contest(c.contestId).orgId];
  const key = await importKey(keys.pub, 'verify');
  return crypto.subtle.verify(SIGN, key, unb64u(c.sig), enc(signPayload({ ...c, result: result || c.result })));
}
const kidFmt = (kid) => (kid || '').toUpperCase().match(/.{1,4}/g)?.join(':') || '—';

async function ensureCrypto() {
  let changed = false;
  for (const s of db.students) if (!s.profile) { s.profile = JSON.parse(JSON.stringify(PROFILES[s.id] || emptyProfile())); changed = true; }
  db.keys = db.keys || {};
  if (HAS_CRYPTO) {
    for (const o of db.orgs) if (!db.keys[o.id]) { db.keys[o.id] = await genKeys(); changed = true; }
    for (const c of db.certs) if (!c.sig) { await signCert(c); changed = true; }
  }
  for (const c of db.certs) if (!c.fp) { c.fp = await sha(payload(c)); changed = true; }
  if (changed) save();
}

/* ---------------- Слой API (имитация сервера) ---------------- */
const apiLog = [];
async function api(method, path, handler) {
  const pill = $('#apiPill');
  pill && pill.classList.add('busy');
  const t0 = performance.now();
  await sleep(rand(90, 320));
  let status = 200, data;
  try { data = await handler(); if (data && data.__status) { status = data.__status; delete data.__status; } }
  catch (e) { status = 500; data = { error: e.message }; }
  const ms = Math.round(performance.now() - t0);
  apiLog.unshift({ method, path, status, ms, t: new Date() });
  if (apiLog.length > 60) apiLog.pop();
  if (pill) { pill.classList.remove('busy'); $('#apiMs').textContent = `API · ${ms} мс`; }
  if (location.hash.startsWith('#/api')) renderApiLog();
  return { status, data, ms };
}
const API = {
  verify: (id, claim) => api('GET', `/v1/certificates/${id}/verify${claim ? '?claimed_result=' + claim : ''}`, async () => {
    db.checks++; save();
    const cert = db.certs.find((c) => c.id === id);
    if (!cert) return { __status: 404, found: false };
    const fpNow = await sha(payload(cert));
    const sigOk = await verifySig(cert);
    const claimSigOk = claim && claim !== cert.result ? await verifySig(cert, claim) : null;
    return { found: true, cert, intact: fpNow === cert.fp, fp: fpNow, sigOk, claimSigOk };
  }),
  publicKey: (orgId) => api('GET', `/v1/orgs/${orgId}/public-key`, async () => ({ kid: db.keys[orgId]?.kid, jwk: db.keys[orgId]?.pub })),
  issue: (contestId, rows) => api('POST', `/v1/contests/${contestId}/certificates`, async () => {
    const k = contest(contestId);
    const ids = [];
    for (const r of rows) {
      let s = db.students.find((x) => x.name.toLowerCase() === r.name.toLowerCase() && x.school.toLowerCase() === (r.school || '').toLowerCase());
      if (!s) {
        s = { id: 's' + (++db.seq), name: r.name, grade: r.grade, city: r.city, school: r.school, direction: k.direction, parent: false, search: false, showName: false, portfolio: false, contact: `student${db.seq}.test@example.com` };
        db.students.push(s);
      }
      const cert = { id: `PRF-${k.code}-${String(k.next++).padStart(4, '0')}`, contestId: k.id, studentId: s.id, result: r.result };
      cert.fp = await sha(payload(cert));
      if (HAS_CRYPTO) await signCert(cert);
      db.certs.push(cert); ids.push(cert.id);
    }
    save();
    return { __status: 201, issued: ids };
  }),
  createContest: (data) => api('POST', '/v1/contests', async () => {
    const k = { id: 'k' + (++db.seq), code: 'NK' + String(db.seq).slice(-2), next: 1, ...data };
    db.contests.push(k); save();
    return { __status: 201, contest: k };
  }),
  consent: (sid, field, value) => api('PATCH', `/v1/students/${sid}/consent`, async () => {
    const s = student(sid); s[field] = value; if (!s.parent) s.search = false; save();
    return { ok: true };
  }),
  search: (q) => api('GET', `/v1/talents?city=${encodeURIComponent(q.city || '')}&direction=${encodeURIComponent(q.direction || '')}&min_weight=${q.minW || 0}`, async () => ({ ok: true })),
  request: (sid, purpose) => api('POST', '/v1/contact-requests', async () => {
    const r = { id: 'r' + (++db.seq), buyerId: db.session.buyerId, studentId: sid, purpose, status: 'pending', date: new Date().toISOString().slice(0, 10) };
    db.requests.push(r); save();
    return { __status: 201, request: r };
  }),
  answer: (rid, status) => api('PATCH', `/v1/contact-requests/${rid}`, async () => {
    const r = db.requests.find((x) => x.id === rid); r.status = status; save();
    return { ok: true };
  }),
};

/* ---------------- Тост ---------------- */
function toast(msg, icon = I.check) {
  const t = $('#toast');
  t.innerHTML = `${icon}<span>${esc(msg)}</span>`; t.hidden = false;
  t.style.animation = 'none'; void t.offsetWidth; t.style.animation = '';
  clearTimeout(toast._t); toast._t = setTimeout(() => { t.hidden = true; }, 2800);
}

/* ---------------- Визуал сертификата ---------------- */
function certVisual(cert, opts = {}) {
  if (!cert) {
    return `<div class="cert fake" data-tilt>
      <div class="cert-head"><div class="cert-brand"><span class="logo-mark">P</span>PROOFY</div><span class="badge bad">${I.x}нет в реестре</span></div>
      <div class="cert-title">СЕРТИФИКАТ</div>
      <div class="cert-name">${esc(opts.id || '—')}</div>
      <div class="cert-contest">Такой ID не выдавал ни один организатор</div>
      <div class="cert-seal">НЕ<b>✕</b>НАЙДЕН</div>
      <div class="cert-foot"><span class="cert-id">${esc(opts.id || '')}</span></div></div>`;
  }
  const k = contest(cert.contestId), s = student(cert.studentId), o = org(k.orgId);
  const name = opts.full ? s.name : shownName(s);
  return `<div class="cert ${opts.cls || ''}" data-tilt>
    <div class="shine"></div>${opts.scan ? '<div class="scanline"></div>' : ''}
    <div class="cert-head"><div class="cert-brand"><span class="logo-mark">P</span>PROOFY</div>${o.verified ? `<span class="badge ok">${I.check}реестр</span>` : '<span class="badge bad">не подтверждён</span>'}</div>
    <div class="cert-title">СЕРТИФИКАТ</div>
    <div class="cert-name">${esc(name)}</div>
    <div class="cert-result">${RESULTS[cert.result].label}</div>
    <div class="cert-contest">${esc(k.name)} · ${fmtDate(k.date)}</div>
    <div class="cert-seal">PROOFY<b>✓</b>ПРОВЕРЕНО</div>
    <div class="cert-foot"><span class="cert-id">${esc(cert.id)}</span><div class="qr" data-qr="${esc(certUrl(cert.id))}" data-size="64"></div></div>
  </div>`;
}

/* ===================== ГЛАВНАЯ ===================== */
const lab = { level: 'region', participants: 1200, selection: true, paid: false, awarded: 8, orgVerified: true };
const LAB_PRESETS = {
  olymp: { level: 'region', participants: 1200, selection: true, paid: false, awarded: 8, orgVerified: true },
  paid: { level: 'intl', participants: 5000, selection: false, paid: true, awarded: 85, orgVerified: false },
};

function viewHome() {
  const cities = new Set(db.students.map((s) => s.city)).size;
  return `<div class="page">
  <section class="wrap hero">
    <div class="reveal">
      <div class="eyebrow">Реестр достижений школьников</div>
      <h1>Талант виден.<br><em>Подделка — нет.</em></h1>
      <p class="lead">Организатор выдаёт сертификат с QR. Вуз или агентство проверяет его за 5 секунд и видит, чего стоит конкурс.</p>
      <div class="row" id="heroCta">
        <a class="btn lg" href="#/verify">${I.qr}Проверить сертификат</a>
        <a class="btn ghost lg" href="#/buyer">Найти таланты ${I.arrow}</a>
      </div>
    </div>
    <div class="hero-visual devices reveal">
      <div class="orbit o1"><i></i></div>
      ${EMBED ? certVisual(db.certs[0], { scan: true }) : `
      <div class="laptop"><div class="lt-screen"><div class="live" data-live="#/verify?id=PRF-GH26-0001" data-w="1280"></div></div><div class="lt-base"></div></div>
      <div class="phone mini"><div class="notch"></div><div class="screen"><div class="live" data-live="#/t/s1" data-w="390"></div></div></div>`}
      <div class="float-tag t1"><span class="badge ok">${I.check}</span><span>Проверено за <b>0,2 с</b></span></div>
      <div class="float-tag t2"><span class="badge gold">вес</span><b>77</b><span>/ 100</span></div>
    </div>
  </section>

  ${EMBED ? '' : `<section class="wrap section" id="inside">
    <div class="section-head reveal"><div class="eyebrow">Загляни внутрь</div><h2>Это настоящий продукт — нажимайте</h2></div>
    <div class="inside reveal">
      <div class="inside-menu">
        ${[['#/verify?id=PRF-OM26-0003&claim=winner', 'Проверка', I.shield], ['#/org/k/k1', 'Организатор', I.building], ['#/student', 'Школьник', I.user], ['#/buyer', 'Вузы', I.search], ['#/ranking', 'Рейтинг', I.spark]]
          .map(([h, t, ic], i) => `<button class="${i === 0 ? 'on' : ''}" data-act="inside" data-v="${h}">${ic}<span>${t}</span></button>`).join('')}
      </div>
      <div class="laptop big"><div class="lt-screen"><div class="live interactive" id="insideLive" data-live="#/verify?id=PRF-OM26-0003&claim=winner" data-w="1280"></div></div><div class="lt-base"></div></div>
    </div>
  </section>`}

  <button class="scroll-cue" data-act="scrollCue"><span class="mouse"></span>Листайте вниз</button>

  <section class="wrap section">
    <div class="grid g4">
      <div class="stat-card reveal"><div class="stat-num sky" data-count="${db.certs.length}">0</div><div class="muted small">${plural(db.certs.length, 'сертификат', 'сертификата', 'сертификатов')} в реестре</div></div>
      <div class="stat-card reveal"><div class="stat-num gold"><span data-count="100">0</span>%</div><div class="muted small">изменённых сертификатов ловит подпись</div></div>
      <div class="stat-card reveal"><div class="stat-num ok" data-count="${cities}">0</div><div class="muted small">городов, включая малые</div></div>
      <div class="stat-card reveal"><div class="stat-num">≤<span data-count="5">0</span> с</div><div class="muted small">результат проверки</div></div>
    </div>
  </section>

  <section class="wrap section" id="who">
    <div class="section-head reveal"><div class="eyebrow">Для кого</div><h2>Одна платформа — три стороны</h2></div>
    <div class="who">
      ${[
        ['1571260899304-425eee4c7efc', 'Школьникам', 'Твои победы видны вузам', 'Бесплатно навсегда', '#/register', 'Создать профиль'],
        ['1563461660947-507ef49e9c47', 'Организаторам', 'Сертификаты, которым верят', 'Бесплатно', '#/org', 'Выдать сертификаты'],
        ['1627556704290-2b1f5853ff78', 'Вузам и агентствам', 'Таланты из регионов без подделок', 'Пилот 30 дней бесплатно', '#/buyer', 'Найти таланты'],
      ].map(([img, tag, title, note, href, btn]) => `<a class="who-card reveal" href="${href}">
        <div class="who-img" style="background-image:url('${PHOTO(img, 900)}')"></div>
        <div class="who-body"><span class="badge sky">${tag}</span><h3>${title}</h3><span class="muted small">${note}</span><span class="who-go">${btn} ${I.arrow}</span></div></a>`).join('')}
    </div>
  </section>

  <div class="marquee reveal"><div class="marquee-track">${[0, 1].map(() => `<div class="marquee-set">${[...db.orgs.map((o) => [o.name, o.verified]), ['Школьные олимпиады', true], ['Городские конкурсы', true], ['Турниры FTC', true]].map(([n, v]) => `<span class="mq-item">${v ? `<i class="ok-dot"></i>` : '<i class="bad-dot"></i>'}${esc(n)}</span>`).join('')}</div>`).join('')}</div></div>

  <section class="wrap section">
    <div class="section-head reveal"><div class="eyebrow">Как это работает</div><h2>Три шага, никаких «загрузите грамоту»</h2></div>
    <div class="flow">
      <div class="flow-step reveal"><div class="flow-num">01</div><div class="flow-ico">${I.upload}</div><h3>Организатор выдаёт</h3><p>Загружает список призёров. Каждый получает сертификат с ID и QR.</p></div>
      <div class="flow-step reveal"><div class="flow-num">02</div><div class="flow-ico">${I.lock}</div><h3>Школьник решает</h3><p>Профиль скрыт. В поиск — только с согласия родителя.</p></div>
      <div class="flow-step reveal"><div class="flow-num">03</div><div class="flow-ico">${I.shield}</div><h3>Вуз проверяет</h3><p>Видит «подлинный или нет» и вес конкурса.</p></div>
    </div>
  </section>

  <section class="wrap section">
    <div class="section-head reveal"><div class="eyebrow">Было и стало</div><h2>Грамоту можно нарисовать. Подпись — нет.</h2></div>
    <div class="ba">
      <div class="ba-side reveal">
        <div class="ba-tag bad">Сейчас</div>
        <div class="paper"><div class="paper-in">
          <div class="paper-title">ГРАМОТА</div><div class="paper-sub">награждается</div>
          <div class="paper-name">Иванов Иван</div><div class="paper-sub">за I место в международной олимпиаде</div>
          <div class="paper-stamp">ПЕЧАТЬ</div><div class="paper-sign">подпись ____</div></div></div>
        <ul class="ba-list"><li>${I.x}Нарисовать — 2 минуты в редакторе</li><li>${I.x}Проверить — звонить организатору</li><li>${I.x}Неясно, чего стоит конкурс</li></ul>
      </div>
      <div class="ba-arrow reveal">${I.arrow}</div>
      <div class="ba-side reveal">
        <div class="ba-tag ok">С Proofy</div>
        <div style="display:grid;place-items:center">${certVisual(db.certs[0])}</div>
        <ul class="ba-list ok"><li>${I.check}Подпись организатора ECDSA</li><li>${I.check}Проверка по QR за 5 секунд</li><li>${I.check}Вес конкурса из 100</li></ul>
      </div>
    </div>
  </section>

  <section class="wrap section">
    <div class="phone-sec">
      <div class="reveal">
        <div class="eyebrow">Для приёмной комиссии</div>
        <h2>Навёл камеру — получил ответ</h2>
        <p class="muted" style="font-size:17px;max-width:440px">Без приложений и регистрации. Обычная камера телефона, одна секунда.</p>
        <div class="phone-steps">
          <div><b>1</b><span>Камера видит QR на сертификате</span></div>
          <div><b>2</b><span>Proofy сверяет подпись организатора</span></div>
          <div><b>3</b><span>Зелёный — подлинный. Красный — подделка</span></div>
        </div>
        <a class="btn lg" href="#/verify" style="margin-top:22px">${I.camera}Попробовать сканер</a>
      </div>
      <div class="phone-wrap reveal">
        <div class="phone"><div class="notch"></div><div class="screen">
          <div class="scr scr-cam"><div class="cam-cert"><div class="cc-l w70"></div><div class="cc-l w50"></div><div class="cc-qr"></div></div><div class="cam-frame"></div><div class="cam-line"></div><div class="cam-hint">Наведите на QR</div></div>
          <div class="scr scr-ok"><div class="res-ico">${I.check}</div><div class="res-t">Подлинный</div><div class="res-s">Gambit Hackathon 2026<br>Победитель · вес 77</div><div class="res-pill">подпись верна</div></div>
          <div class="scr scr-cam2"><div class="cam-cert fake"><div class="cc-l w60"></div><div class="cc-l w40"></div><div class="cc-qr"></div></div><div class="cam-frame"></div><div class="cam-line"></div><div class="cam-hint">Наведите на QR</div></div>
          <div class="scr scr-bad"><div class="res-ico">${I.x}</div><div class="res-t">Подделка</div><div class="res-s">Такого сертификата<br>нет в реестре</div><div class="res-pill">PRF-GH26-0999</div></div>
        </div></div>
        <div class="phone-glow"></div>
      </div>
    </div>
  </section>


  <section class="wrap section" id="weightLab">
    <div class="section-head reveal"><div class="eyebrow">Попробуйте сами</div><h2>Сколько весит грамота?</h2>
      <p class="muted">«Международная» не значит сильная. Двигайте ползунки — вес пересчитается.</p></div>
    <div class="card glow lab reveal">
      <div class="lab-ctrl">
        <div class="chips"><button class="chip gold-on ${labIs('olymp') ? 'on' : ''}" data-act="labPreset" data-p="olymp">Областная олимпиада</button>
          <button class="chip gold-on ${labIs('paid') ? 'on' : ''}" data-act="labPreset" data-p="paid">Платная «международная»</button></div>
        <div><div class="field"><span>Уровень</span></div><div class="chips">${Object.entries(LEVELS).map(([k, l]) => `<button class="chip ${lab.level === k ? 'on' : ''}" data-act="labLevel" data-v="${k}">${l.label}</button>`).join('')}</div></div>
        <div class="grid g2">
          <label class="field"><span>Участников: <b class="sky" id="labPartV">${lab.participants.toLocaleString('ru-RU')}</b></span><input type="range" min="10" max="10000" step="10" value="${lab.participants}" data-lab="participants"></label>
          <label class="field"><span>Наградили: <b class="sky" id="labAwV">${lab.awarded}%</b></span><input type="range" min="1" max="100" value="${lab.awarded}" data-lab="awarded"></label>
        </div>
        <div class="chips">
          <button class="chip ${lab.selection ? 'on' : ''}" data-act="labToggle" data-k="selection">Есть отбор</button>
          <button class="chip ${lab.paid ? 'on' : ''}" data-act="labToggle" data-k="paid">Платное участие</button>
          <button class="chip ${lab.orgVerified ? 'on' : ''}" data-act="labToggle" data-k="orgVerified">Организатор подтверждён</button>
        </div>
      </div>
      <div class="lab-result" id="labResult">${labResult()}</div>
    </div>
  </section>

  <section class="wrap section">
    <div class="section-head reveal"><div class="eyebrow">Разрыв видимости</div><h2>Вузы смотрят в две точки. Таланты — по всей стране.</h2>
      <p class="muted">Золотые точки — где ищут сейчас. Голубые — школьники, которых Proofy делает видимыми.</p></div>
    <div class="card glow map-card reveal">${talentMap()}</div>
  </section>

  <section class="wrap section">
    <div class="section-head reveal"><div class="eyebrow">Данные несовершеннолетних</div><h2>Приватность по умолчанию</h2></div>
    <div class="privacy">
      <div class="reveal">${I.eye}<b>Скрыт с первого дня</b><span>Профиль не виден никому</span></div>
      <div class="reveal">${I.user}<b>Согласие родителя</b><span>Без него в поиск не попасть</span></div>
      <div class="reveal">${I.lock}<b>Без имени</b><span>Покупатель видит класс и город</span></div>
      <div class="reveal">${I.key}<b>Контакт по запросу</b><span>Открывает только сам школьник</span></div>
    </div>
  </section>

  <section class="photo-banner reveal" style="--img:url('${PHOTO('1522202176988-66273c2fd55f', 1800)}')">
    <div class="wrap pb-in">
      <div class="eyebrow">Наша миссия</div>
      <h2>Школьник из Хромтау заслуживает того же шанса, что и школьник из Алматы.</h2>
      <a class="btn gold lg" href="#/register">${I.user}Присоединиться</a>
    </div>
  </section>

  <section class="wrap section" id="pricing">
    <div class="section-head reveal"><div class="eyebrow">Тарифы</div><h2>Школьникам и организаторам — бесплатно</h2></div>
    <div class="plans">
      ${[
        ['Школьник', '0 ₸', 'навсегда', ['Подтверждённое портфолио', 'Резюме одной ссылкой', 'Контроль согласия'], '#/register', 'Создать профиль', ''],
        ['Вуз или агентство', '0 ₸', 'пилот 30 дней', ['Поиск по регионам и весу', 'Проверка без ограничений', 'Запросы контактов', 'API для CRM'], '#/buyer', 'Начать пилот', 'hot'],
        ['Организатор', '0 ₸', 'навсегда', ['Выдача сертификатов с подписью', 'Вес конкурса в рейтинге', 'QR на каждом дипломе'], '#/org', 'Выдать сертификаты', ''],
      ].map(([t, p, per, feats, href, btn, hot]) => `<div class="plan ${hot} reveal">${hot ? '<span class="plan-tag">Платит после пилота</span>' : ''}
        <h3>${t}</h3><div class="plan-price">${p.replace(' ₸', '')}<i class="cur">₸</i><span>${per}</span></div>
        <ul>${feats.map((f) => `<li>${I.check}<span>${f}</span></li>`).join('')}</ul>
        <a class="btn ${hot ? 'gold' : 'ghost'} lg" href="${href}">${btn}</a></div>`).join('')}
    </div>
    <p class="muted small reveal" style="text-align:center;margin-top:14px">Цену подписки для вузов и агентств назовём по итогам пилота.</p>
  </section>

  <section class="wrap section" id="faq">
    <div class="section-head reveal"><div class="eyebrow">Вопросы</div><h2>Коротко о главном</h2></div>
    <div class="faq reveal">
      ${[
        ['Почему сертификат нельзя подделать?', 'Каждый сертификат подписан закрытым ключом организатора. Если изменить хоть одно слово, подпись перестанет сходиться.'],
        ['Кто видит данные школьника?', 'Никто, пока школьник и родитель не дадут согласие. Даже тогда вуз видит класс и город, а имя и контакт — только после одобрения запроса.'],
        ['Сколько стоит?', 'Школьникам и организаторам бесплатно. Вузы и агентства начинают с бесплатного пилота на 30 дней.'],
        ['Как попасть в реестр?', 'Достижение добавляет только организатор конкурса. Первые сертификаты выдаём по итогам Gambit Hackathon 2026.'],
        ['Что такое вес конкурса?', 'Оценка от 0 до 100: уровень, число участников, отбор, проверенность организатора. Платный конкурс без отбора получает низкий вес.'],
      ].map(([q, a], i) => `<details ${i === 0 ? 'open' : ''}><summary>${q}<i></i></summary><p>${a}</p></details>`).join('')}
    </div>
  </section>

  <section class="final-cta reveal" style="--img:url('${PHOTO('1639765766830-d829d2fe4219', 1800)}')">
    <div class="wrap fc-in">
      <h2>Проверьте настоящий и поддельный сертификат прямо сейчас</h2>
      <div class="row" style="justify-content:center"><a class="btn gold lg" href="#/verify">${I.qr}К проверке</a><a class="btn ghost lg" href="#/register">Регистрация</a></div>
    </div>
  </section></div>`;
}
const labIs = (p) => Object.entries(LAB_PRESETS[p]).every(([k, v]) => lab[k] === v);
function labResult() {
  const w = contestWeight(lab);
  const verdict = w.total >= 70 ? '<span class="badge ok">Сильный конкурс</span>' : w.total >= 40 ? '<span class="badge warn">Средний вес</span>' : '<span class="badge bad">Почти ничего не значит</span>';
  return `${ring(w.total, 180, 'из 100', 14)}<div class="verdict-line">${verdict}</div>${breakdown(w)}`;
}
/* Схематичная карта: координаты примерно по долготе и широте */
const MAP_PTS = {
  'Уральск': [120, 128], 'Атырау': [129, 228], 'Костанай': [346, 83], 'Караганда': [522, 165], 'Павлодар': [593, 103],
  'Усть-Каменогорск': [698, 160], 'Шымкент': [457, 330], 'Кызылорда': [372, 272], 'Тараз': [512, 318],
  'Актобе': [222, 146], 'Хромтау': [262, 136], 'Кандыагаш': [214, 176], 'Эмба': [252, 192], 'Шалкар': [284, 222],
  'Астана': [491, 128], 'Алматы': [593, 307],
};
const HUBS = ['Астана', 'Алматы'];
function talentMap() {
  const counts = {};
  db.students.forEach((s) => { counts[s.city] = (counts[s.city] || 0) + 1; });
  const regional = Object.keys(counts).filter((c) => !HUBS.includes(c) && MAP_PTS[c]);
  const lines = regional.flatMap((c, i) => HUBS.map((h, j) => {
    const [x1, y1] = MAP_PTS[c], [x2, y2] = MAP_PTS[h];
    const mx = (x1 + x2) / 2, my = Math.min(y1, y2) - 60;
    return `<path d="M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}" class="map-line" style="animation-delay:${(i * 2 + j) * .35}s"/>`;
  })).join('');
  const dots = Object.entries(MAP_PTS).map(([c, [x, y]]) => {
    const hub = HUBS.includes(c), n = counts[c] || 0;
    if (hub) return `<g class="map-hub"><circle cx="${x}" cy="${y}" r="16" class="hub-halo"/><circle cx="${x}" cy="${y}" r="7"/><text x="${x}" y="${y - 24}" text-anchor="middle">${c}</text></g>`;
    if (n) {
      const right = ['Хромтау', 'Эмба', 'Шалкар'].includes(c);
      return `<g class="map-talent"><circle cx="${x}" cy="${y}" r="${6 + n * 3}" class="pulse-ring"/><circle cx="${x}" cy="${y}" r="5"/>
        <text x="${right ? x + 14 : x - 14}" y="${y + 4}" text-anchor="${right ? 'start' : 'end'}">${c} · ${n}</text></g>`;
    }
    return `<g class="map-city"><circle cx="${x}" cy="${y}" r="3"/><text x="${x}" y="${y + 18}" text-anchor="middle">${c}</text></g>`;
  }).join('');
  return `<svg viewBox="40 40 720 330" class="kz-map" role="img" aria-label="Схема: школьники из малых городов Актюбинской области становятся видимыми для вузов Астаны и Алматы">
    <defs><pattern id="dotgrid" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="rgba(255,255,255,.07)"/></pattern></defs>
    <rect x="40" y="40" width="720" height="330" fill="url(#dotgrid)"/>${lines}${dots}</svg>
    <div class="map-legend"><span><i class="lg-hub"></i>Где ищут сейчас</span><span><i class="lg-tal"></i>Проверенные школьники · число</span><span class="muted small">Схема, не в масштабе</span></div>`;
}

function updateLab() {
  const box = $('#labResult'); if (!box) return;
  box.innerHTML = labResult();
  $$('[data-act="labPreset"]').forEach((b) => b.classList.toggle('on', labIs(b.dataset.p)));
  $$('[data-act="labLevel"]').forEach((b) => b.classList.toggle('on', b.dataset.v === lab.level));
  $$('[data-act="labToggle"]').forEach((b) => b.classList.toggle('on', !!lab[b.dataset.k]));
  const pv = $('#labPartV'); if (pv) pv.textContent = lab.participants.toLocaleString('ru-RU');
  const av = $('#labAwV'); if (av) av.textContent = lab.awarded + '%';
  const pr = $('[data-lab="participants"]'); if (pr) pr.value = lab.participants;
  const ar = $('[data-lab="awarded"]'); if (ar) ar.value = lab.awarded;
  animateWidgets(box, true);
}

/* Лента реестра (демо-активность) */
const TICKS = [
  () => `<b>Агентство, Алматы</b> проверило сертификат <span class="mono sky">${pick(db.certs).id}</span>`,
  () => `<b>${pick(db.orgs.filter((o) => o.verified)).name}</b> выдал(а) новые сертификаты`,
  () => `<b>Школьник из ${pick(['Хромтау', 'Шалкара', 'Эмбы', 'Кандыагаша'])}</b> открыл профиль для поиска`,
  () => `<b>Вуз, Астана</b> отправил запрос на контакт`,
  () => `Поддельный ID <span class="mono" style="color:var(--bad)">PRF-XX26-${rand(1000, 9999)}</span> отклонён`,
];
const pick = (a) => a[Math.floor(Math.random() * a.length)];
let tickTimer;
function startTicker() {
  clearInterval(tickTimer);
  const push = () => { const el = $('#ticker'); if (!el) return clearInterval(tickTimer); el.innerHTML = `<div class="tick">${pick(TICKS)()} <span class="muted small">· только что</span></div>`; };
  push(); tickTimer = setInterval(push, 3200);
}

/* ===================== ПРОВЕРКА ===================== */
const DEMOS = [
  { label: 'Настоящий', id: 'PRF-GH26-0001', claim: 'winner', cls: 'ok' },
  { label: 'Подделка', id: 'PRF-GH26-0999', claim: 'winner', cls: 'bad' },
  { label: 'Изменён результат', id: 'PRF-OM26-0003', claim: 'winner', cls: 'warn' },
  { label: 'Платный конкурс', id: 'PRF-SO26-0002', claim: 'winner', cls: 'warn' },
];

function viewVerify(params) {
  const id = (params.get('id') || '').trim().toUpperCase();
  const claim = params.get('claim') || '';
  return `<div class="page wrap">
  <div class="page-head"><div><div class="eyebrow">Для вузов, агентств и фондов</div><h1>Проверка сертификата</h1>
    <p class="muted">Введите ID или наведите камеру на QR. Без регистрации.</p></div></div>
  <form class="card glow verify-box" data-form="verify" id="verifyBox">
    <div class="verify-input">
      <input type="text" name="id" placeholder="PRF-GH26-0001" value="${esc(id)}" autocomplete="off" spellcheck="false" required>
      <button class="btn ghost lg" type="button" data-act="scan" id="scanBtn">${I.camera}Сканировать QR</button>
      <button class="btn lg" type="submit">${I.shield}Проверить</button>
    </div>
    <div class="row between" style="margin-top:16px">
      <div class="chips" id="demoChips"><span class="muted small" style="align-self:center">Демо:</span>${DEMOS.map((d) => `<a class="chip" href="#/verify?id=${d.id}&claim=${d.claim}">${d.label}</a>`).join('')}</div>
      <label class="row small muted">В документе указано:
        <select name="claim" style="width:auto">${['', ...Object.keys(RESULTS)].map((k) => `<option value="${k}" ${k === claim ? 'selected' : ''}>${k ? RESULTS[k].label : 'не сверять'}</option>`).join('')}</select></label>
    </div>
  </form>
  <div id="verifyOut" style="margin-top:22px">${id ? '' : emptyVerify()}</div>
  </div>`;
}
function emptyVerify() {
  return `<div class="grid g3">${DEMOS.slice(0, 3).map((d) => {
    const cert = db.certs.find((c) => c.id === d.id);
    return `<a class="role-card" href="#/verify?id=${d.id}&claim=${d.claim}"><span class="badge ${d.cls}">${d.label}</span>
      <h3 style="margin-top:12px" class="mono">${d.id}</h3><p>${cert ? esc(contest(cert.contestId).name) : 'ID, которого нет в реестре'}</p><span class="go">Проверить →</span></a>`;
  }).join('')}</div>`;
}

let verifyToken = 0;
async function runVerify(id, claim) {
  const out = $('#verifyOut'); if (!out || !id) return;
  const token = ++verifyToken;
  const steps = ['Поиск в реестре', 'Подпись организатора · ECDSA P-256', 'Сверка результата с подписью', 'Организатор и вес конкурса'];
  out.innerHTML = `<div class="grid side"><div class="card"><h3>Проверяем <span class="mono sky">${esc(id)}</span></h3>
    <ul class="checks" id="checks">${steps.map((s) => `<li><span class="st"></span>${s}<span class="ms"></span></li>`).join('')}</ul></div>
    <div class="card"><div class="skeleton" style="width:60%;margin-bottom:12px"></div><div class="skeleton" style="width:80%;margin-bottom:12px"></div><div class="skeleton" style="width:40%"></div></div></div>`;
  const lis = $$('#checks li');
  const mark = async (i, state, ms) => { if (token !== verifyToken) throw 0; lis[i].className = state; lis[i].querySelector('.st').innerHTML = state === 'ok' ? I.check : state === 'bad' ? I.x : state === 'warn' ? '!' : ''; lis[i].querySelector('.ms').textContent = ms ? ms + ' мс' : ''; };
  try {
    lis[0].className = 'run';
    const res = await API.verify(id, claim);
    if (token !== verifyToken) return;
    if (!res.data.found) {
      await mark(0, 'bad', res.ms);
      for (let i = 1; i < 4; i++) lis[i].style.opacity = .35;
      await sleep(300);
      return showVerdict(null, id, claim, res);
    }
    await mark(0, 'ok', res.ms);
    const cert = res.data.cert;
    const k = contest(cert.contestId), w = contestWeight(k);
    lis[1].className = 'run'; await sleep(rand(220, 380));
    await mark(1, res.data.sigOk ? 'ok' : 'bad', rand(2, 6));
    lis[2].className = 'run'; await sleep(rand(220, 380));
    await mark(2, claim && claim !== cert.result ? 'bad' : 'ok', rand(1, 4));
    lis[3].className = 'run'; await sleep(rand(220, 380));
    await mark(3, w.total < 40 || !org(k.orgId).verified ? 'warn' : 'ok', rand(4, 12));
    await sleep(350);
    showVerdict(cert, id, claim, res);
  } catch (e) { /* устаревшая проверка */ }
}

function showVerdict(cert, id, claim, res) {
  const out = $('#verifyOut'); if (!out) return;
  if (!cert) {
    out.innerHTML = `<div class="verdict bad"><div class="v-ico">${I.x}</div><div><h2>Сертификат не найден</h2>
      <p>Ни один организатор не выдавал <b class="mono">${esc(id)}</b>. Скорее всего, это подделка.</p></div></div>
      <div class="grid g2"><div style="display:grid;place-items:center">${certVisual(null, { id })}</div>
      <div class="card"><h3>Что делать</h3><ul class="breakdown"><li><span>Запросить оригинал у организатора</span><span></span></li><li><span>Попросить школьника ссылку на портфолио Proofy</span><span></span></li><li><span>Код ответа API</span><span class="mono minus">404</span></li></ul></div></div>`;
    afterRender(); return;
  }
  const k = contest(cert.contestId), o = org(k.orgId), s = student(cert.studentId), w = contestWeight(k);
  const mismatch = claim && claim !== cert.result;
  const low = w.total < 40;
  let v;
  if (mismatch) v = `<div class="verdict bad"><div class="v-ico">${I.x}</div><div><h2>Результат подделан</h2><p>В документе «${RESULTS[claim].label}», но подпись организатора сходится только с «${RESULTS[cert.result].label}».</p></div></div>`;
  else if (low) v = `<div class="verdict warn"><div class="v-ico">${I.alert}</div><div><h2>Настоящий, но почти ничего не значит</h2><p>Вес конкурса ${w.total} из 100: ${w.parts.filter((p) => p[1] < 0).map((p) => p[0].toLowerCase()).join(', ')}.</p></div></div>`;
  else v = `<div class="verdict ok"><div class="v-ico">${I.check}</div><div><h2>Подлинный сертификат</h2><p>Выдан организатором «${esc(o.name)}». Проверка заняла ${res.ms} мс.</p></div></div>`;
  out.innerHTML = `${v}
  <div class="grid vres">
    <div style="display:grid;place-items:center" id="certPrint">${certVisual(cert)}</div>
    <div class="card">
      <h3>Детали</h3>
      <dl class="kv">
        <dt>Владелец</dt><dd>${esc(shownName(s))}${s.showName ? '' : ' <span class="badge">имя скрыто</span>'}</dd>
        <dt>Класс, город</dt><dd>${s.grade} класс · ${esc(s.city)}</dd>
        <dt>Конкурс</dt><dd>${esc(k.name)}</dd>
        <dt>Организатор</dt><dd>${esc(o.name)}<br>${o.verified ? `<span class="badge ok">${I.check}подтверждён</span>` : '<span class="badge bad">не подтверждён</span>'}</dd>
        <dt>Баллы</dt><dd><b>${certPoints(cert)}</b> <span class="muted small">= ${w.total} × ${RESULTS[cert.result].k}</span></dd>
        <dt>Подпись</dt><dd class="mono small" style="word-break:break-all">ECDSA P-256 · ${esc((cert.sig || '').slice(0, 22))}…<br>
          <span class="badge ${res.data.sigOk ? 'ok' : 'bad'}">${res.data.sigOk ? 'подпись верна' : 'подпись не сходится'}</span>
          ${mismatch ? `<span class="badge bad">с «${RESULTS[claim].label}» не сходится</span>` : ''}</dd>
        <dt>Ключ</dt><dd class="mono small">${kidFmt(cert.kid)}<br>${o.verified ? '<span class="badge ok">в доверенном списке</span>' : '<span class="badge warn">ключ не в доверенном списке</span>'}</dd>
      </dl>
      <div class="row" style="margin-top:16px">
        <button class="btn ghost sm" data-act="copy" data-text="${esc(certUrl(cert.id))}">${I.link}Ссылка</button>
        <button class="btn ghost sm" data-act="print">${I.print}Печать</button>
      </div>
    </div>
    <div class="card" style="text-align:center"><h3>Вес конкурса</h3>${ring(w.total, 160, 'из 100')}<div style="text-align:left;margin-top:12px">${breakdown(w)}</div></div>
  </div>`;
  afterRender();
}

/* --- Сканер QR камерой --- */
let scanStream = null, scanRaf = 0;
function openScanner() {
  const m = $('#modal');
  m.innerHTML = `<div class="modal-card"><div class="row between"><h3 style="margin:0;font-family:var(--display)">Сканер QR</h3><button class="icon-btn" data-act="closeModal">✕</button></div>
    <div class="viewfinder"><video id="scanVideo" playsinline muted></video><div class="vf-frame"></div><div class="vf-line"></div><div class="vf-msg" id="scanMsg">Запрашиваем доступ к камере…</div></div>
    <p class="muted small">Наведите камеру на QR с сертификата Proofy, например на экран телефона. Нет камеры — включите демо-скан.</p>
    <div class="row"><button class="btn gold" data-act="demoScan">${I.spark}Демо-скан</button><button class="btn ghost" data-act="closeModal">Отмена</button></div></div>`;
  m.hidden = false;
  const video = $('#scanVideo'), msg = $('#scanMsg');
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { msg.textContent = 'Камера недоступна в этом браузере'; return; }
  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then((stream) => {
    scanStream = stream; video.srcObject = stream; video.play(); msg.textContent = 'Ищем QR…';
    const canvas = document.createElement('canvas'), ctx = canvas.getContext('2d', { willReadFrequently: true });
    const loop = () => {
      if (!scanStream) return;
      if (video.readyState === video.HAVE_ENOUGH_DATA && window.jsQR) {
        canvas.width = video.videoWidth; canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(img.data, img.width, img.height);
        if (code && code.data) {
          const mm = code.data.toUpperCase().match(/PRF-[A-Z0-9]{4}-\d{4}/);
          if (mm) { closeModal(); toast('QR распознан'); location.hash = `#/verify?id=${mm[0]}`; return; }
          msg.textContent = 'Это не QR Proofy';
        }
      }
      scanRaf = requestAnimationFrame(loop);
    };
    loop();
  }).catch(() => { msg.textContent = 'Нет доступа к камере. Используйте демо-скан.'; });
}
function closeModal() {
  if (scanStream) { scanStream.getTracks().forEach((t) => t.stop()); scanStream = null; }
  cancelAnimationFrame(scanRaf);
  const m = $('#modal'); m.hidden = true; m.innerHTML = '';
}

/* ===================== ОРГАНИЗАТОР ===================== */
function viewOrg() {
  const o = org(db.session.orgId);
  const list = db.contests.filter((k) => k.orgId === o.id);
  const total = db.certs.filter((c) => list.some((k) => k.id === c.contestId)).length;
  return `<div class="page wrap">
  <div class="page-head">
    <div><div class="eyebrow">Источник доверия</div><h1>Кабинет организатора</h1><p class="muted">Выдавайте сертификаты, которые нельзя подделать. Бесплатно.</p></div>
    <label class="switcher"><span>Организатор</span><select data-change="setOrg">${db.orgs.map((x) => `<option value="${x.id}" ${x.id === o.id ? 'selected' : ''}>${esc(x.name)}</option>`).join('')}</select></label>
  </div>
  ${o.verified ? '' : `<div class="notice bad" style="margin-bottom:18px">${'Организатор не подтверждён: вес каждого конкурса −30. Для проверки нужны официальный сайт и письмо с домена организации.'}</div>`}
  <div class="grid g3" style="margin-bottom:18px">
    <div class="stat-card"><div class="stat-num sky" data-count="${list.length}">0</div><div class="muted small">конкурсов</div></div>
    <div class="stat-card"><div class="stat-num gold" data-count="${total}">0</div><div class="muted small">сертификатов выдано</div></div>
    <div class="stat-card"><div class="stat-num ok">${o.verified ? '✓' : '—'}</div><div class="muted small">${o.verified ? 'организатор подтверждён' : 'ожидает проверки'}</div></div>
  </div>
  <div class="grid side">
    <div class="stack" id="contestList">
      ${list.length ? list.map((k) => {
        const w = contestWeight(k).total, n = db.certs.filter((c) => c.contestId === k.id).length;
        return `<a class="card role-card" href="#/org/k/${k.id}" style="display:flex;gap:18px;align-items:center">
          ${ring(w, 74, 'вес', 7)}
          <div style="flex:1;min-width:0"><h3 style="margin:0 0 4px">${esc(k.name)}</h3>
            <div class="muted small">${LEVELS[k.level].label} · ${esc(k.direction)} · ${fmtDate(k.date)}</div>
            <div class="row" style="margin-top:8px"><span class="badge sky">${n} ${plural(n, 'сертификат', 'сертификата', 'сертификатов')}</span>${k.paid ? '<span class="badge warn">платный</span>' : ''}</div></div>
          <span class="go">Выдать →</span></a>`;
      }).join('') : `<div class="card empty">${I.doc}<div>Конкурсов пока нет. Создайте первый.</div></div>`}
    </div>
    <form class="card glow" data-form="contest" id="newContest">
      <h3>Новый конкурс</h3>
      <div class="stack">
        <label class="field"><span>Название</span><input type="text" name="name" required placeholder="Городская олимпиада по физике"></label>
        <div class="grid g2">
          <label class="field"><span>Уровень</span><select name="level">${Object.entries(LEVELS).map(([k, l]) => `<option value="${k}" ${k === 'city' ? 'selected' : ''}>${l.label}</option>`).join('')}</select></label>
          <label class="field"><span>Направление</span><select name="direction">${DIRECTIONS.map((d) => `<option value="${d}">${d}</option>`).join('')}</select></label>
          <label class="field"><span>Участников</span><input type="number" name="participants" value="200" min="1"></label>
          <label class="field"><span>Наградили, %</span><input type="number" name="awarded" value="15" min="0" max="100"></label>
        </div>
        <label class="field"><span>Дата</span><input type="date" name="date" value="2026-11-14"></label>
        <label class="switch"><input type="checkbox" name="selection" checked><span class="knob"></span><span><b>Есть отбор</b><span class="muted small">Не все проходят в финал</span></span></label>
        <label class="switch"><input type="checkbox" name="paid"><span class="knob"></span><span><b>Платное участие</b><span class="muted small">Взнос за участие или диплом</span></span></label>
        <div class="row between" id="weightPreview"></div>
        <button class="btn" type="submit" style="width:100%">Создать конкурс</button>
      </div>
    </form>
  </div></div>`;
}
function readContestForm(form) {
  const f = new FormData(form);
  return {
    name: String(f.get('name') || '').trim(), level: f.get('level'), direction: f.get('direction'),
    participants: Math.max(1, +f.get('participants') || 1), awarded: Math.min(100, Math.max(0, +f.get('awarded') || 0)),
    date: f.get('date'), selection: f.get('selection') === 'on', paid: f.get('paid') === 'on', orgId: db.session.orgId,
  };
}
function updateWeightPreview() {
  const form = $('[data-form="contest"]'), box = $('#weightPreview');
  if (!form || !box) return;
  const w = contestWeight(readContestForm(form)).total;
  box.innerHTML = `<span class="muted small">Вес конкурса считается сразу</span>${wbar(w)}`;
}

const SAMPLE_CSV = `Алия Серикова; 10; Актобе; СОШ №12; победитель
Нурсултан Ермеков; 11; Хромтау; Школа-гимназия №1; призёр
Камила Жумабаева; 9; Кандыагаш; СОШ №5; финалист
Арман Талгатов; 10; Шалкар; СОШ №2; участник`;

let lastIssued = [];
function viewContest(id) {
  const k = contest(id);
  if (!k) return `<div class="page wrap"><div class="card empty">Конкурс не найден. <a href="#/org">Назад</a></div></div>`;
  const o = org(k.orgId), w = contestWeight(k);
  const issued = db.certs.filter((c) => c.contestId === k.id).slice().reverse();
  return `<div class="page wrap">
  <p><a href="#/org">← Все конкурсы</a></p>
  <div class="page-head"><div><div class="eyebrow">${esc(o.name)}</div><h1>${esc(k.name)}</h1>
    <p class="muted">${LEVELS[k.level].label} · ${esc(k.direction)} · ${fmtDate(k.date)} · ${(+k.participants).toLocaleString('ru-RU')} участников</p></div>${ring(w.total, 96, 'вес', 9)}</div>
  <div class="grid side" style="margin-bottom:18px">
    <form class="card glow" data-form="issue" data-contest="${k.id}" id="issueForm">
      <h3>Выдать сертификаты</h3>
      <p class="muted small">Одна строка — один школьник: <span class="mono sky">ФИО; класс; город; школа; результат</span></p>
      <textarea name="csv" placeholder="Алия Серикова; 10; Актобе; СОШ №12; победитель"></textarea>
      <div id="issueErrors"></div>
      <div class="row between" style="margin-top:14px">
        <div class="row"><button class="btn ghost sm" type="button" data-act="sample">${I.doc}Вставить пример</button>
          <button class="btn ghost sm" type="button" data-act="template">${I.download}Шаблон CSV</button></div>
        <button class="btn gold" type="submit" id="issueBtn">${I.upload}Выдать сертификаты</button>
      </div>
    </form>
    <div class="card"><h3>Почему такой вес</h3>${breakdown(w)}
      <p class="muted small" style="margin-top:12px">Новые профили создаются скрытыми: школьник сам решает, кто их увидит.</p></div>
  </div>
  <div class="card">
    <div class="row between"><h3 style="margin:0">Выдано: ${issued.length}</h3><span class="muted small">QR ведёт на страницу проверки</span></div>
    ${issued.length ? `<div class="table-scroll" style="margin-top:10px"><table class="t"><thead><tr><th>QR</th><th>ID</th><th>Школьник</th><th>Результат</th><th>Баллы</th><th></th></tr></thead><tbody>
      ${issued.map((c) => { const s = student(c.studentId); return `<tr class="${lastIssued.includes(c.id) ? 'new' : ''}"><td><div class="qr" data-qr="${esc(certUrl(c.id))}" data-size="52"></div></td>
        <td class="mono small">${esc(c.id)}</td><td><b>${esc(s.name)}</b><div class="muted small">${s.grade} кл · ${esc(s.city)}</div></td>
        <td>${RESULTS[c.result].label}</td><td><b>${certPoints(c)}</b></td><td><a class="btn ghost sm" href="#/c/${c.id}">Проверить</a></td></tr>`; }).join('')}
      </tbody></table></div>` : `<div class="empty">${I.doc}<div>Пока ничего не выдано. Нажмите «Вставить пример».</div></div>`}
  </div></div>`;
}
function parseResult(word) {
  const w = (word || '').toLowerCase().trim();
  if (w.startsWith('побед')) return 'winner';
  if (w.startsWith('приз')) return 'prize';
  if (w.startsWith('фин')) return 'finalist';
  if (w.startsWith('участ')) return 'participant';
  return null;
}
async function issueCerts(form) {
  const lines = form.csv.value.split('\n').map((l) => l.trim()).filter(Boolean);
  const errors = [], rows = [];
  lines.forEach((line, i) => {
    const p = line.split(/[;\t]/).map((x) => x.trim());
    const [name, grade, city, school, res] = p;
    const result = parseResult(res);
    if (p.length < 5 || !name || !result || !(+grade >= 1 && +grade <= 11)) errors.push(`Строка ${i + 1}: нужно 5 полей, класс 1–11 и результат`);
    else rows.push({ name, grade: +grade, city, school, result });
  });
  const box = $('#issueErrors');
  if (!lines.length) { box.innerHTML = '<div class="notice warn" style="margin-top:10px">Вставьте хотя бы одну строку или нажмите «Вставить пример».</div>'; return; }
  if (errors.length) { box.innerHTML = `<div class="notice bad" style="margin-top:10px">${errors.map(esc).join('<br>')}</div>`; return; }
  const btn = $('#issueBtn'); btn.disabled = true; btn.innerHTML = 'Подписываем…';
  const res = await API.issue(form.dataset.contest, rows);
  lastIssued = res.data.issued;
  render();
  toast(`Выдано ${rows.length} ${plural(rows.length, 'сертификат', 'сертификата', 'сертификатов')} · ${res.ms} мс`);
}

/* ===================== ШКОЛЬНИК ===================== */
function viewStudent() {
  const s = student(db.session.studentId);
  const certs = certsOf(s.id).slice().sort((a, b) => certPoints(b) - certPoints(a));
  const reqs = db.requests.filter((r) => r.studentId === s.id).slice().reverse();
  const pending = reqs.filter((r) => r.status === 'pending').length;
  const rec = db.contests.filter((k) => k.direction === s.direction && contestWeight(k).total >= 60 && !certs.some((c) => c.contestId === k.id)).slice(0, 3);
  return `<div class="page wrap">
  <div class="page-head"><div><div class="eyebrow">Тестовый аккаунт</div><h1>Кабинет школьника</h1><p class="muted">Достижения добавляет только организатор. Вы решаете, кто их видит.</p></div>
    <label class="switcher"><span>Школьник</span><select data-change="setStudent">${db.students.map((x) => `<option value="${x.id}" ${x.id === s.id ? 'selected' : ''}>${esc(x.name)}</option>`).join('')}</select></label></div>
  <div class="grid side">
    <div class="stack">
      <div class="card glow"><div class="row between">
        <div class="row">${avatar(s, 'lg own')}<div><h2 style="margin:0 0 4px;font-size:24px">${esc(s.name)}</h2>
          <div class="muted small">${s.grade} класс · ${esc(s.city)} · ${esc(s.school)}</div>
          <div class="row" style="margin-top:8px"><span class="badge sky">${esc(s.direction)}</span><span class="badge ok">${I.check}${certs.length} подтверждено</span>${s.search && s.parent ? '<span class="badge gold">в поиске</span>' : '<span class="badge">скрыт</span>'}</div></div></div>
        ${ring(Math.min(100, rating(s.id)), 110, 'баллов', 10).replace(`data-count="${Math.min(100, rating(s.id))}"`, `data-count="${rating(s.id)}"`)}
      </div></div>

      <div class="card"><h3>Мои сертификаты</h3>
        ${certs.length ? `<div class="grid g2">${certs.map((c) => `<div><a href="#/c/${c.id}" style="display:block">${certVisual(c, { full: true })}</a>
          <div class="row between small" style="margin-top:8px"><span class="muted">Вес конкурса</span>${wbar(contestWeight(contest(c.contestId)).total)}</div></div>`).join('')}</div>`
          : `<div class="empty">${I.doc}<div>Пока пусто. Сертификат появится, когда его выдаст организатор.</div></div>`}
      </div>

      <div class="card" id="studentReqs"><h3>Запросы ${pending ? `<span class="badge warn">${pending} ${plural(pending, 'новый', 'новых', 'новых')}</span>` : ''}</h3>
        ${reqs.length ? reqs.map((r) => {
          const b = buyer(r.buyerId);
          const st = r.status === 'pending'
            ? `<div class="row"><button class="btn ok sm" data-act="answer" data-id="${r.id}" data-v="approved">${I.check}Открыть контакт</button><button class="btn bad sm" data-act="answer" data-id="${r.id}" data-v="declined">Отклонить</button></div>`
            : r.status === 'approved' ? `<span class="badge ok">${I.check}контакт открыт</span>` : '<span class="badge">отклонён</span>';
          return `<div class="item"><div class="flow-ico" style="width:44px;height:44px;margin:0">${I.building}</div><div class="item-main"><div class="item-title">${esc(b.name)}</div><div class="item-meta">${esc(r.purpose)} · ${fmtDate(r.date)}</div></div>${st}</div>`;
        }).join('') : `<div class="empty">Запросов пока нет.${s.search ? '' : ' Включите показ в поиске.'}</div>`}
      </div>
    </div>

    <div class="stack">
      <div class="card" id="consentBox"><h3>Согласие</h3>
        ${sw(s, 'parent', 'Согласие родителя', 'В рабочей версии — SMS-код родителю')}
        ${sw(s, 'search', 'Показывать в поиске', 'Без имени: класс, город, достижения', !s.parent)}
        ${sw(s, 'showName', 'Показывать имя', 'Иначе видны только инициалы')}
        ${sw(s, 'portfolio', 'Публичное портфолио', 'Ссылка для заявок на гранты')}
      </div>
      <div class="card" id="previewBox"><h3>${I.eye.replace('<svg', '<svg style="width:18px;height:18px;vertical-align:-3px;margin-right:6px"')}Так вас видит вуз</h3>
        ${s.parent && s.search ? talentCard(s, { preview: true }) : `<div class="lock">${I.lock}Вас нет в поиске. Вуз может только проверить сертификат по ID.</div>`}</div>
      <form class="card" data-form="profile" id="profileBox"><h3>Моё резюме</h3>
        <div class="stack">
          <label class="field"><span>Кто я в одной фразе</span><input type="text" name="headline" value="${esc(s.profile?.headline)}" placeholder="Пишу на Python и делаю ботов"></label>
          <label class="field"><span>Чем я известен</span><input type="text" name="fame" value="${esc(s.profile?.fame)}" placeholder="Победил на хакатоне"></label>
          <label class="field"><span>О себе</span><textarea name="about" style="min-height:90px;font-family:Inter">${esc(s.profile?.about)}</textarea></label>
          <label class="field"><span>Навыки через запятую</span><input type="text" name="skills" value="${esc((s.profile?.skills || []).join(', '))}" placeholder="Python, Figma"></label>
          <div class="row"><button class="btn sm" type="submit">${I.check}Сохранить</button><a class="btn ghost sm" href="#/p/${s.id}">${I.eye}Посмотреть резюме</a></div>
        </div>
      </form>
      <div class="card"><h3>Полезно уже сейчас</h3>
        ${s.portfolio ? `<div class="row"><a class="btn sm" href="#/p/${s.id}">${I.eye}Моё портфолио</a><button class="btn ghost sm" data-act="copy" data-text="${esc(location.origin + location.pathname + '#/p/' + s.id)}">${I.link}Копировать ссылку</button></div>` : '<p class="muted small">Включите публичное портфолио, чтобы прикладывать его к заявкам.</p>'}
        ${rec.length ? `<p class="small" style="margin:16px 0 6px"><b>Сильные конкурсы по направлению «${esc(s.direction)}»</b></p>${rec.map((k) => `<div class="talent-ach"><span>${esc(k.name)}</span>${wbar(contestWeight(k).total)}</div>`).join('')}` : ''}
      </div>
    </div>
  </div></div>`;
}
function sw(s, field, title, hint, disabled) {
  return `<label class="switch ${disabled ? 'disabled' : ''}"><input type="checkbox" data-change="toggle" data-field="${field}" ${s[field] ? 'checked' : ''} ${disabled ? 'disabled' : ''}><span class="knob"></span>
    <span><b>${title}</b><span class="muted small">${hint}</span></span></label>`;
}
/* Резюме таланта: #/p/:id — публичная ссылка школьника, #/t/:id — просмотр из кабинета вуза */
function viewResume(id, mode) {
  const s = student(id);
  const allowed = s && (mode === 'public' ? s.portfolio : (s.parent && s.search));
  if (!allowed) {
    return `<div class="page wrap"><div class="card empty">${I.lock}<h2>Резюме скрыто</h2><p>${mode === 'public' ? 'Владелец не открыл публичную ссылку.' : 'Школьник не дал согласия на показ в поиске.'}</p>
      <a class="btn ghost" href="#/buyer">← К талантам</a></div></div>`;
  }
  const p = s.profile || emptyProfile();
  const b = buyer(db.session.buyerId);
  const req = mode === 'buyer' ? db.requests.find((r) => r.studentId === s.id && r.buyerId === b.id) : null;
  const open = req && req.status === 'approved';
  const title = open || s.showName ? s.name : `Школьник, ${s.grade} класс`;
  const certs = certsOf(s.id).slice().sort((a, c) => certPoints(c) - certPoints(a));
  let action = '';
  if (mode === 'buyer') {
    if (!req) action = `<select id="purpose-${s.id}" style="margin-bottom:10px">${PURPOSES.map((x) => `<option value="${x}">${x}</option>`).join('')}</select><button class="btn" style="width:100%" data-act="request" data-sid="${s.id}">Запросить контакт</button>`;
    else if (req.status === 'pending') action = `<div class="lock">${I.spark}Запрос отправлен. Ждём ответа школьника.</div>`;
    else if (req.status === 'declined') action = `<div class="lock">${I.x}Школьник отклонил запрос.</div>`;
    else action = `<div class="notice">Контакт: <b>${esc(s.contact)}</b><br><span class="small">${esc(s.school)}</span></div>`;
  }
  return `<div class="page wrap">
  <p><a href="${mode === 'buyer' ? '#/buyer' : '#/'}">← ${mode === 'buyer' ? 'К талантам' : 'На главную'}</a></p>
  <div class="card glow resume-hero">
    ${avatar(s, 'xl')}
    <div><div class="eyebrow">Резюме таланта</div><h1>${esc(title)}</h1>
      <div class="muted">${s.grade} класс · ${esc(s.city)} · ${esc(s.direction)}</div>
      ${p.headline ? `<p style="font-size:18px;margin:10px 0 0">${esc(p.headline)}</p>` : ''}
      ${p.fame ? `<div class="fame">${I.spark}<span>${esc(p.fame)}</span></div>` : ''}
    </div>
    ${ring(Math.min(100, rating(s.id)), 120, 'баллов', 10).replace(`data-count="${Math.min(100, rating(s.id))}"`, `data-count="${rating(s.id)}"`)}
  </div>
  <div class="grid side" style="margin-top:18px">
    <div class="stack">
      ${p.about ? `<div class="card"><h3>О себе</h3><p style="margin:0">${esc(p.about)}</p></div>` : ''}
      ${p.skills?.length ? `<div class="card"><h3>Навыки</h3><div class="skills">${p.skills.map((k) => `<span class="skill">${esc(k)}</span>`).join('')}</div></div>` : ''}
      ${p.projects?.length ? `<div class="card"><h3>Проекты</h3><div class="grid g2">${p.projects.map(([t, d]) => `<div class="project"><b>${esc(t)}</b><span class="muted small">${esc(d)}</span></div>`).join('')}</div></div>` : ''}
      <div class="card"><h3>Подтверждённые достижения</h3>
        ${certs.length ? `<div class="timeline">${certs.map((c) => { const k = contest(c.contestId); return `<div class="tl-item"><div class="row between"><b>${esc(k.name)}</b>${wbar(contestWeight(k).total)}</div>
          <div class="muted small">${RESULTS[c.result].label} · ${fmtDate(k.date)} · ${esc(org(k.orgId).name)}</div>
          <a class="small" href="#/c/${c.id}">${I.shield.replace('<svg', '<svg style="width:13px;height:13px;vertical-align:-2px"')} Проверить ${esc(c.id)}</a></div>`; }).join('')}</div>`
          : `<div class="empty">Пока нет подтверждённых достижений.</div>`}
      </div>
    </div>
    <div class="stack">
      ${mode === 'buyer' ? `<div class="card glow"><h3>Связаться</h3>${action}${!open ? `<div class="lock">${I.lock}Имя и контакт откроются после согласия школьника</div>` : ''}</div>` : ''}
      <div class="card"><h3>Коротко</h3>
        <dl class="kv"><dt>Класс</dt><dd>${s.grade}</dd><dt>Город</dt><dd>${esc(s.city)}</dd><dt>Направление</dt><dd>${esc(s.direction)}</dd><dt>Баллы</dt><dd>${rating(s.id)}</dd></dl></div>
      <div class="card"><p class="muted small" style="margin:0">Каждое достижение выдано организатором конкурса и подписано его ключом. Школьник сам не может их добавить.</p></div>
    </div>
  </div></div>`;
}

/* ===================== ПОКУПАТЕЛЬ ===================== */
const ui = { city: '', direction: '', minW: 0 };
function talentCard(s, opts = {}) {
  const b = buyer(db.session.buyerId);
  const req = opts.preview ? null : db.requests.find((r) => r.studentId === s.id && r.buyerId === b.id);
  const open = req && req.status === 'approved';
  const certs = certsOf(s.id).slice().sort((a, c) => certPoints(c) - certPoints(a));
  const title = open || s.showName ? s.name : `Школьник, ${s.grade} класс`;
  let action = '';
  if (!opts.preview) {
    if (!req) action = `<div class="row" style="margin-top:14px"><select id="purpose-${s.id}" style="flex:1;min-width:150px">${PURPOSES.map((p) => `<option value="${p}">${p}</option>`).join('')}</select><button class="btn sm" data-act="request" data-sid="${s.id}">Запросить контакт</button></div>`;
    else if (req.status === 'pending') action = `<div class="lock">${I.spark}Запрос отправлен. Ждём ответа школьника.</div>`;
    else if (req.status === 'declined') action = `<div class="lock">${I.x}Школьник отклонил запрос.</div>`;
    else action = `<div class="notice" style="margin-top:14px">${I.check.replace('<svg', '<svg style="width:16px;height:16px;vertical-align:-3px"')} Контакт: <b>${esc(s.contact)}</b><br><span class="small">${esc(s.school)}</span></div>`;
  }
  return `<div class="talent">
    <div class="talent-head">${avatar(s)}<div style="flex:1;min-width:0"><div class="talent-name">${esc(title)}</div>
      <div class="muted small">${I.map.replace('<svg', '<svg style="width:13px;height:13px;vertical-align:-2px"')} ${esc(s.city)} · ${esc(s.direction)}</div></div>
      <div class="pts">${rating(s.id)}<small>баллов</small></div></div>
    ${s.profile?.headline ? `<div class="headline">${esc(s.profile.headline)}</div>` : ''}
    ${s.profile?.fame ? `<div class="fame-line">${I.spark}<span>${esc(s.profile.fame)}</span></div>` : ''}
    ${certs.map((c) => { const k = contest(c.contestId); return `<div class="talent-ach"><span><a href="#/c/${c.id}">${esc(k.name)}</a> · ${RESULTS[c.result].label}</span>${wbar(contestWeight(k).total)}</div>`; }).join('')}
    ${!opts.preview ? `<div class="talent-actions"><a class="btn ghost sm" href="#/t/${s.id}">${I.doc}Открыть резюме</a></div>` : ''}
    ${!opts.preview && !open ? `<div class="lock">${I.lock}Имя и контакт откроются после согласия школьника</div>` : ''}
    ${action}</div>`;
}
function viewBuyer(params) {
  const b = buyer(db.session.buyerId);
  const tab = params.get('tab') || 'search';
  const visible = db.students.filter((s) => s.parent && s.search);
  const hidden = db.students.length - visible.length;
  const found = visible.filter((s) => (!ui.city || s.city === ui.city)
    && (!ui.direction || s.direction === ui.direction || certsOf(s.id).some((c) => contest(c.contestId).direction === ui.direction))
    && bestWeight(s.id) >= ui.minW).sort((a, c) => rating(c.id) - rating(a.id));
  const myReqs = db.requests.filter((r) => r.buyerId === b.id).slice().reverse();
  const regional = visible.filter((s) => !['Алматы', 'Астана'].includes(s.city)).length;
  return `<div class="page wrap">
  <div class="page-head"><div><div class="eyebrow">${esc(b.type)}</div><h1>Таланты из регионов</h1><p class="muted">Только проверенные достижения и только с согласия школьника.</p></div>
    <label class="switcher"><span>Покупатель</span><select data-change="setBuyer">${db.buyers.map((x) => `<option value="${x.id}" ${x.id === b.id ? 'selected' : ''}>${esc(x.name)}</option>`).join('')}</select></label></div>
  <div class="grid g4" style="margin-bottom:20px">
    <div class="stat-card"><div class="stat-num sky" data-count="${visible.length}">0</div><div class="muted small">открыты для поиска</div></div>
    <div class="stat-card"><div class="stat-num gold" data-count="${regional}">0</div><div class="muted small">из малых городов</div></div>
    <div class="stat-card"><div class="stat-num ok" data-count="${myReqs.filter((r) => r.status === 'approved').length}">0</div><div class="muted small">контактов открыто</div></div>
    <div class="stat-card"><div class="stat-num" data-count="${hidden}">0</div><div class="muted small">скрыты без согласия</div></div>
  </div>
  <div class="tabs"><a href="#/buyer?tab=search" class="${tab === 'search' ? 'active' : ''}">Поиск</a><a href="#/buyer?tab=requests" class="${tab === 'requests' ? 'active' : ''}">Мои запросы · ${myReqs.length}</a><a href="#/verify">Проверить сертификат</a></div>
  ${tab === 'requests' ? `<div class="card">${myReqs.length ? `<div class="table-scroll"><table class="t"><thead><tr><th>Школьник</th><th>Цель</th><th>Дата</th><th>Статус</th></tr></thead><tbody>
    ${myReqs.map((r) => { const s = student(r.studentId); const st = r.status === 'approved' ? `<span class="badge ok">${esc(s.contact)}</span>` : r.status === 'pending' ? '<span class="badge warn">ждёт ответа</span>' : '<span class="badge">отклонён</span>';
      return `<tr><td>${esc(r.status === 'approved' ? s.name : `${s.grade} кл · ${s.city}`)}</td><td>${esc(r.purpose)}</td><td>${fmtDate(r.date)}</td><td>${st}</td></tr>`; }).join('')}
    </tbody></table></div>` : `<div class="empty">${I.search}<div>Запросов пока нет. Найдите таланты во вкладке «Поиск».</div></div>`}</div>` : `
  <div class="card" style="margin-bottom:18px" id="filters">
    <div class="field"><span>Город</span></div><div class="chips" style="margin-bottom:14px"><button class="chip ${!ui.city ? 'on' : ''}" data-act="filter" data-k="city" data-v="">Все</button>${CITIES.map((c) => `<button class="chip ${ui.city === c ? 'on' : ''}" data-act="filter" data-k="city" data-v="${c}">${c}</button>`).join('')}</div>
    <div class="grid g2">
      <div><div class="field"><span>Направление</span></div><div class="chips"><button class="chip ${!ui.direction ? 'on' : ''}" data-act="filter" data-k="direction" data-v="">Все</button>${DIRECTIONS.map((d) => `<button class="chip ${ui.direction === d ? 'on' : ''}" data-act="filter" data-k="direction" data-v="${d}">${d}</button>`).join('')}</div></div>
      <div><div class="field"><span>Вес лучшего конкурса</span></div><div class="chips">${[[0, 'Любой'], [40, '40+'], [70, '70+']].map(([v, l]) => `<button class="chip gold-on ${+ui.minW === v ? 'on' : ''}" data-act="filter" data-k="minW" data-v="${v}">${l}</button>`).join('')}</div></div>
    </div>
  </div>
  <div class="row between" style="margin-bottom:14px"><b style="font-family:var(--display)">Найдено: ${found.length}</b><span class="muted small">Сортировка по баллам</span></div>
  ${found.length ? `<div class="grid g2" id="talents">${found.map((s, i) => talentCard(s).replace('class="talent"', `class="talent" style="animation-delay:${i * 70}ms"`)).join('')}</div>` : `<div class="card empty">${I.search}<div>Никого не нашли. Ослабьте фильтры.</div></div>`}`}
  </div>`;
}

/* ===================== РЕГИСТРАЦИЯ ===================== */
const reg = { step: 1, role: null, method: null, age: null, err: '' };
const ROLE_INFO = {
  student: ['Школьник', 'Портфолио и резюме, которым верят вузы', I.user],
  org: ['Организатор конкурса', 'Выдавать сертификаты с подписью', I.building],
  buyer: ['Вуз или агентство', 'Искать и проверять таланты', I.search],
};
const GOOGLE_SVG = '<svg viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>';

function iinInfo(iin) {
  if (!/^\d{12}$/.test(iin)) return { ok: false, err: 'ИИН должен состоять из 12 цифр' };
  const d = iin.split('').map(Number);
  let sum = d.slice(0, 11).reduce((a, v, i) => a + v * (i + 1), 0) % 11;
  if (sum === 10) { const w = [3, 4, 5, 6, 7, 8, 9, 10, 11, 1, 2]; sum = d.slice(0, 11).reduce((a, v, i) => a + v * w[i], 0) % 11; }
  if (sum === 10 || sum !== d[11]) return { ok: false, err: 'Контрольная цифра ИИН не сходится' };
  const century = { 1: 1800, 2: 1800, 3: 1900, 4: 1900, 5: 2000, 6: 2000 }[d[6]];
  if (!century) return { ok: false, err: 'Неверная цифра века в ИИН' };
  const born = new Date(century + +iin.slice(0, 2), +iin.slice(2, 4) - 1, +iin.slice(4, 6));
  const age = Math.floor((Date.now() - born) / (365.25 * 864e5));
  return { ok: true, age };
}
function demoIin() {
  // Тестовый ИИН 15-летнего школьника с правильной контрольной цифрой
  for (let n = 1; n < 1000; n++) {
    const base = `100315500${String(n).padStart(3, '0')}`.slice(0, 11);
    const r = iinInfo(base + '0'); if (r.ok) return base + '0';
    for (let c = 1; c < 10; c++) if (iinInfo(base + c).ok) return base + c;
  }
  return '';
}

function viewRegister() {
  const bar = `<div class="steps-bar">${[1, 2, 3, 4].map((i) => `<i class="${i <= reg.step ? 'on' : ''}"></i>`).join('')}</div>`;
  let body = '';
  if (reg.step === 1) {
    body = `<h2>Кто вы?</h2><p class="muted">Выберите роль. Её можно поменять позже.</p>
      <div class="choice-grid">${Object.entries(ROLE_INFO).map(([k, [t, d, ic]]) => `<button class="choice ${reg.role === k ? 'on' : ''}" data-act="regRole" data-v="${k}"><div class="flow-ico">${ic}</div><b>${t}</b><span>${d}</span></button>`).join('')}</div>`;
  } else if (reg.step === 2) {
    body = `<h2>Как войти?</h2><p class="muted">${ROLE_INFO[reg.role][0]} · выберите удобный способ</p>
      <div class="stack" style="max-width:520px">
        <button class="auth-btn" data-act="regGoogle" id="googleBtn"><span class="ab-ico">${GOOGLE_SVG}</span><span>Продолжить с Google<small>Быстрее всего, без пароля</small></span></button>
        <div class="or">или</div>
        <form data-form="regIin" class="stack">
          <div class="auth-btn egov" style="cursor:default"><span class="ab-ico">eGov</span><span>Через ИИН<small>Проверяем через eGov и не храним</small></span></div>
          <input type="text" name="iin" class="iin-input" inputmode="numeric" maxlength="12" placeholder="000000000000" autocomplete="off">
          <div class="row between"><button class="link-btn small" type="button" data-act="regDemoIin">Подставить тестовый ИИН</button><button class="btn" type="submit">Продолжить</button></div>
        </form>
        <div class="or">или</div>
        <form data-form="regMail" class="row">
          <input type="text" name="email" placeholder="name@example.com" style="flex:1;min-width:200px" autocomplete="off">
          <button class="btn ghost" type="submit">По email</button>
        </form>
        ${reg.err ? `<div class="notice bad">${esc(reg.err)}</div>` : ''}
        <button class="link-btn small" data-act="regBack">← Назад</button>
      </div>`;
  } else if (reg.step === 3) {
    const minor = reg.age !== null && reg.age < 18;
    const via = { google: 'Google', iin: 'eGov', email: 'email' }[reg.method];
    let fields = '';
    if (reg.role === 'student') {
      fields = `<div class="grid g2">
          <label class="field"><span>Имя и фамилия</span><input type="text" name="name" required placeholder="Алия Серикова"></label>
          <label class="field"><span>Класс</span><select name="grade">${[8, 9, 10, 11].map((g) => `<option value="${g}">${g}</option>`).join('')}</select></label>
          <label class="field"><span>Город</span><select name="city">${CITIES.map((c) => `<option value="${c}">${c}</option>`).join('')}</select></label>
          <label class="field"><span>Направление</span><select name="direction">${DIRECTIONS.map((d) => `<option value="${d}">${d}</option>`).join('')}</select></label>
        </div>
        <label class="field"><span>Школа</span><input type="text" name="school" required placeholder="СОШ №12"></label>
        <label class="field"><span>Кто я в одной фразе</span><input type="text" name="headline" placeholder="Пишу на Python и делаю ботов"></label>
        <label class="switch"><input type="checkbox" name="parent" ${minor ? '' : 'checked'}><span class="knob"></span><span><b>Родитель согласен</b><span class="muted small">${minor ? 'Вам меньше 18 лет: нужно согласие родителя. В рабочей версии — SMS-код родителю.' : 'В рабочей версии — SMS-код родителю'}</span></span></label>`;
    } else {
      fields = `<label class="field"><span>Название организации</span><input type="text" name="name" required placeholder="${reg.role === 'org' ? 'Городская олимпиада по физике' : 'Агентство «Bilim Path»'}"></label>
        <label class="field"><span>Город</span><select name="city">${CITIES.map((c) => `<option value="${c}">${c}</option>`).join('')}</select></label>
        ${reg.role === 'org' ? '<p class="muted small">Новый организатор сначала «не подтверждён». Мы проверим сайт и письмо с домена организации.</p>' : ''}`;
    }
    body = `<h2>Расскажите о себе</h2><p class="muted"><span class="badge sky">Вход через ${via}</span>${reg.age !== null ? ` <span class="badge ok">ИИН проверен</span>` : ''}</p>
      <form data-form="regDetails" class="stack" style="max-width:620px">${fields}
        ${reg.err ? `<div class="notice bad">${esc(reg.err)}</div>` : ''}
        <div class="row between"><button class="link-btn small" type="button" data-act="regBack">← Назад</button><button class="btn gold lg" type="submit">${I.check}Создать аккаунт</button></div>
      </form>`;
  } else {
    const target = { student: '#/student', org: '#/org', buyer: '#/buyer' }[reg.role];
    body = `<div class="success-burst"><div class="res-ico">${I.check}</div><h2>Аккаунт создан</h2>
      <p class="muted">Добро пожаловать в Proofy. Ваш кабинет уже готов.</p>
      <div class="row" style="justify-content:center;margin-top:18px"><a class="btn lg" href="${target}" data-act="regDone">Открыть кабинет ${I.arrow}</a></div></div>`;
  }
  return `<div class="page wrap reg-wrap">
    <div class="page-head"><div><div class="eyebrow">Регистрация</div><h1>Создайте аккаунт</h1><p class="muted">Меньше минуты. Данные школьников скрыты по умолчанию.</p></div></div>
    <div class="card glow">${bar}${body}</div>
    <p class="muted small" style="margin-top:14px">Прототип: вход через Google и eGov имитируется, пароли и ИИН никуда не отправляются.</p>
  </div>`;
}
function regGo(step) { reg.step = step; reg.err = ''; render(); window.scrollTo(0, 0); }

/* ===================== НАБОР ДЛЯ ПИТЧА ===================== */
const PUBLIC_URL = 'https://nuralyga07-netizen.github.io/proofy/';
function kitCard(title, sub, name, result, contestName, id, tag, tagCls) {
  return `<div class="kit-item"><div class="kit-label"><span class="badge ${tagCls}">${tag}</span><span class="muted small">${sub}</span></div>
    <div class="cert" style="max-width:none;aspect-ratio:auto;min-height:280px">
      <div class="cert-head"><div class="cert-brand"><span class="logo-mark">P</span>PROOFY</div></div>
      <div class="cert-title">СЕРТИФИКАТ</div>
      <div class="cert-name">${esc(name)}</div>
      <div class="cert-result">${esc(result)}</div>
      <div class="cert-contest">${esc(contestName)}</div>
      <div class="cert-foot"><span class="cert-id">${esc(id)}</span><div class="qr" data-qr="${esc(PUBLIC_URL + '#/c/' + id)}" data-size="110"></div></div>
    </div><div class="small muted" style="margin-top:8px">${title}</div></div>`;
}
function viewKit() {
  return `<div class="page wrap">
  <div class="page-head"><div><div class="eyebrow">Для питча</div><h1>Набор для живого демо</h1>
    <p class="muted">Распечатайте три карточки. Жюри сканирует QR своим телефоном и видит три разных исхода.</p></div>
    <button class="btn gold" data-act="printKit">${I.print}Распечатать набор</button></div>
  <div class="grid g3" id="kit">
    ${kitCard('Сканирование покажет: «Подлинный сертификат».', 'настоящий', 'А. Н.', 'Победитель', 'Gambit Hackathon 2026 · 14.11.2026', 'PRF-GH26-0001', 'Настоящий', 'ok')}
    ${kitCard('На бумаге «Победитель», а реестр скажет «Участник».', 'результат подправлен', 'Е. Б.', 'Победитель', 'Областная олимпиада по математике · 20.02.2026', 'PRF-OM26-0003', 'Подправлен', 'warn')}
    ${kitCard('Такого ID нет в реестре: «Сертификат не найден».', 'ID выдуман', 'Иван Иванов', 'Победитель', 'Международная олимпиада · 01.03.2026', 'PRF-GH26-0999', 'Подделка', 'bad')}
  </div>
  <div class="notice warn" style="margin-top:20px">Сертификаты, выданные во время питча с ноутбука, хранятся только в его браузере. На телефоне жюри их не будет, поэтому для сканирования используйте эти три карточки.</div>
  </div>`;
}

/* ===================== РЕЙТИНГ КОНКУРСОВ ===================== */
const rk = { dir: '' };
function viewRanking() {
  const all = db.contests.map((k) => ({ k, w: contestWeight(k), o: org(k.orgId), n: db.certs.filter((c) => c.contestId === k.id).length }))
    .filter((x) => !rk.dir || x.k.direction === rk.dir)
    .sort((a, b) => b.w.total - a.w.total);
  const risky = db.contests.filter((k) => contestWeight(k).total < 40).length;
  return `<div class="page wrap">
  <div class="page-head"><div><div class="eyebrow">Открыто для всех</div><h1>Рейтинг конкурсов</h1>
    <p class="muted">Сколько на самом деле весит грамота. Без регистрации.</p></div>
    <div class="row"><span class="badge ok" style="padding:8px 12px">${I.check}${db.contests.length - risky} надёжных</span><span class="badge bad" style="padding:8px 12px">${I.alert}${risky} под вопросом</span></div></div>
  <div class="chips" style="margin-bottom:20px" id="rankFilters"><button class="chip ${!rk.dir ? 'on' : ''}" data-act="rankDir" data-v="">Все направления</button>${DIRECTIONS.map((d) => `<button class="chip ${rk.dir === d ? 'on' : ''}" data-act="rankDir" data-v="${d}">${d}</button>`).join('')}</div>
  <div class="stack" id="rankList">${all.length ? all.map(({ k, w, o, n }, i) => `
    <details class="card rank-row" style="animation-delay:${i * 60}ms">
      <summary>
        <span class="rank-num ${i < 3 ? 'gold' : ''}">${String(i + 1).padStart(2, '0')}</span>
        ${ring(w.total, 70, 'вес', 7)}
        <span class="rank-main"><b>${esc(k.name)}</b>
          <span class="muted small">${esc(o.name)} · ${LEVELS[k.level].label} · ${esc(k.direction)} · ${(+k.participants).toLocaleString('ru-RU')} участников</span>
          <span class="row" style="margin-top:6px">${o.verified ? `<span class="badge ok">${I.check}организатор подтверждён</span>` : '<span class="badge bad">организатор не подтверждён</span>'}
            ${k.paid && !k.selection ? '<span class="badge bad">платно без отбора</span>' : ''}${+k.awarded > 50 ? `<span class="badge warn">наградили ${k.awarded}%</span>` : ''}
            <span class="badge sky">${n} ${plural(n, 'сертификат', 'сертификата', 'сертификатов')}</span></span></span>
        <span class="go small">Почему так ▾</span>
      </summary>
      <div style="margin-top:16px;max-width:520px">${breakdown(w)}</div>
    </details>`).join('') : `<div class="card empty">${I.search}<div>В этом направлении конкурсов пока нет.</div></div>`}</div>
  <p class="muted small" style="margin-top:16px">Формула открыта: уровень + размер + отбор − неподтверждённый организатор − платно без отбора − массовое награждение. Подробнее — на главной в блоке «Сколько весит грамота?».</p>
  </div>`;
}

/* ===================== API ===================== */
function viewApi() {
  return `<div class="page wrap">
  <div class="page-head"><div><div class="eyebrow">Для партнёров</div><h1>API Proofy</h1><p class="muted">Проверка встраивается в CRM агентства или приёмной комиссии. Ниже живой журнал запросов этой сессии.</p></div>
    <span class="badge ok" style="padding:8px 14px">${I.server}работает</span></div>
  <div class="grid g4" style="margin-bottom:20px">
    <div class="stat-card"><div class="stat-num ok" id="apiCount">${apiLog.length}</div><div class="muted small">запросов за сессию</div></div>
    <div class="stat-card"><div class="stat-num sky" id="apiAvg">${apiAvg()}</div><div class="muted small">средняя задержка, мс</div></div>
    <div class="stat-card"><div class="stat-num gold">ECDSA</div><div class="muted small">подпись P-256 на каждом сертификате</div></div>
    <div class="stat-card"><div class="stat-num">REST</div><div class="muted small">JSON, ключ партнёра</div></div>
  </div>
  <div class="grid g2" style="margin-bottom:20px">
    <div class="card"><h3>Эндпоинты</h3>
      <table class="t"><tbody>
        <tr><td><span class="method GET">GET</span></td><td class="mono small">/v1/certificates/{id}/verify</td><td class="muted small">проверка</td></tr>
        <tr><td><span class="method POST">POST</span></td><td class="mono small">/v1/contests/{id}/certificates</td><td class="muted small">выдача</td></tr>
        <tr><td><span class="method POST">POST</span></td><td class="mono small">/v1/contests</td><td class="muted small">новый конкурс</td></tr>
        <tr><td><span class="method GET">GET</span></td><td class="mono small">/v1/talents</td><td class="muted small">поиск</td></tr>
        <tr><td><span class="method POST">POST</span></td><td class="mono small">/v1/contact-requests</td><td class="muted small">запрос контакта</td></tr>
        <tr><td><span class="method PATCH">PATCH</span></td><td class="mono small">/v1/students/{id}/consent</td><td class="muted small">согласие</td></tr>
        <tr><td><span class="method GET">GET</span></td><td class="mono small">/v1/orgs/{id}/public-key</td><td class="muted small">открытый ключ</td></tr>
      </tbody></table>
      <h3 style="margin-top:20px">Открытые ключи организаторов</h3>
      <p class="muted small">Любой может проверить подпись сертификата этим ключом, даже без нашего сервера.</p>
      ${db.orgs.map((o) => `<div class="talent-ach"><span>${esc(o.name)}</span><span class="row"><span class="mono small">${kidFmt(db.keys?.[o.id]?.kid)}</span>${o.verified ? '<span class="badge ok">доверенный</span>' : '<span class="badge warn">не доверенный</span>'}</span></div>`).join('')}
    </div>
    <div class="card"><h3>Пример: проверка сертификата</h3>
      <div class="code"><button class="btn ghost sm copy" data-act="copy" data-text="curl https://api.proofy.kz/v1/certificates/PRF-GH26-0001/verify -H 'Authorization: Bearer PARTNER_KEY'">${I.link}Копировать</button><span class="c"># запрос</span>
<span class="k">curl</span> https://api.proofy.kz/v1/certificates/PRF-GH26-0001/verify \\
  -H <span class="s">'Authorization: Bearer PARTNER_KEY'</span>

<span class="c"># ответ 200</span>
{ <span class="s">"valid"</span>: true, <span class="s">"result"</span>: <span class="s">"winner"</span>,
  <span class="s">"contest_weight"</span>: 77, <span class="s">"points"</span>: 77,
  <span class="s">"org_verified"</span>: true, <span class="s">"holder"</span>: <span class="s">"А. Н."</span> }</div>
      <p class="muted small" style="margin-top:10px">Адрес api.proofy.kz — пример для рабочей версии. В прототипе запросы обрабатываются в браузере.</p></div>
  </div>
  <div class="card"><div class="row between"><h3 style="margin:0">Журнал запросов</h3><a class="btn ghost sm" href="#/verify?id=PRF-GH26-0001">Сделать запрос</a></div>
    <div class="table-scroll" style="margin-top:10px"><table class="t"><thead><tr><th>Время</th><th>Метод</th><th>Путь</th><th>Код</th><th>Задержка</th></tr></thead><tbody id="apiLog"></tbody></table></div></div>
  </div>`;
}
const apiAvg = () => (apiLog.length ? Math.round(apiLog.reduce((a, l) => a + l.ms, 0) / apiLog.length) : '—');
function renderApiLog() {
  const tb = $('#apiLog'); if (!tb) return;
  tb.innerHTML = apiLog.length ? apiLog.map((l, i) => `<tr class="${i === 0 ? 'new' : ''}"><td class="mono small">${l.t.toLocaleTimeString('ru-RU')}</td><td><span class="method ${l.method}">${l.method}</span></td><td class="mono small">${esc(l.path)}</td>
    <td><span class="badge ${l.status < 300 ? 'ok' : l.status < 500 ? 'warn' : 'bad'}">${l.status}</span></td><td class="mono small">${l.ms} мс</td></tr>`).join('')
    : '<tr><td colspan="5" class="empty">Пока пусто. Проверьте сертификат или выдайте новый, и запрос появится здесь.</td></tr>';
  const c = $('#apiCount'); if (c) c.textContent = apiLog.length;
  const a = $('#apiAvg'); if (a) a.textContent = apiAvg();
}

/* ===================== Мини-инструкция (тур) ===================== */
const TOURS = {
  home: [
    { sel: '#nav', t: 'Разделы всегда под рукой', d: 'Меню остаётся наверху при прокрутке. На телефоне — панель внизу.', m: '#tabbar' },
    { sel: '#langBox', t: 'Язык и навигация', d: 'Пять языков. Справа — точки для быстрого перехода по разделам страницы.' },
    { sel: '#heroCta', t: 'Проверка за 5 секунд', d: 'Введите ID или отсканируйте QR. Есть демо: настоящий, подделка, изменённый результат.' },
    { sel: '#weightLab', t: 'Вес грамоты', d: 'Двигайте ползунки и сравните областную олимпиаду с платной «международной».' },
    { sel: '#apiPill', t: 'Живой API', d: 'Каждое действие — запрос к серверу. Задержка видна здесь, журнал — в разделе API.' },
  ],
  verify: [
    { sel: '#verifyBox input[name=id]', t: 'ID сертификата', d: 'Он напечатан под QR-кодом. Формат: PRF-GH26-0001.' },
    { sel: '#scanBtn', t: 'Сканер QR', d: 'Работает с камерой телефона или ноутбука. Нет камеры — включите демо-скан.' },
    { sel: '#demoChips', t: 'Четыре сценария', d: 'Покажите жюри все исходы: подлинный, подделка, изменён результат, платный конкурс.' },
  ],
  org: [
    { sel: '#contestList', t: 'Ваши конкурсы', d: 'Кольцо — вес конкурса. Нажмите на конкурс, чтобы выдать сертификаты.' },
    { sel: '#newContest', t: 'Новый конкурс', d: 'Вес пересчитывается сразу, пока вы заполняете форму.' },
  ],
  contest: [
    { sel: '#issueForm', t: 'Выдача за минуту', d: 'Нажмите «Вставить пример», затем «Выдать». Новые сертификаты подсветятся в таблице.' },
  ],
  student: [
    { sel: '#consentBox', t: 'Согласие', d: 'Без согласия родителя школьника нет в поиске. Попробуйте выключить.' },
    { sel: '#previewBox', t: 'Что видит вуз', d: 'Превью меняется сразу после переключателей.' },
    { sel: '#studentReqs', t: 'Запросы', d: 'Контакт открывается, только если вы нажали «Открыть контакт».' },
  ],
  buyer: [
    { sel: '#filters', t: 'Фильтры', d: 'Город, направление и вес. Например, «Хромтау» и «70+».' },
    { sel: '#talents', t: 'Карточки', d: 'Имени нет, пока школьник не согласится. Нажмите «Запросить контакт».' },
  ],
  api: [{ sel: '#apiLog', t: 'Журнал', d: 'Здесь видны все запросы, которые вы сделали в других разделах.' }],
  ranking: [{ sel: '#rankList', t: 'Рейтинг конкурсов', d: 'Нажмите на конкурс, чтобы увидеть, из чего сложился его вес.' }],
};
let tourSteps = [], tourI = 0;
function startTour(force) {
  const key = currentNav();
  const steps = (TOURS[key] || []).filter((s) => $(s.sel) || (s.m && $(s.m)));
  if (!steps.length) return;
  tourSteps = steps; tourI = 0;
  $('#tour').hidden = false;
  showTourStep();
  if (!force) try { localStorage.setItem('proofy-tour-' + key, '1'); } catch (e) { /* ignore */ }
}
function showTourStep() {
  const st = tourSteps[tourI];
  let el = $(st.sel);
  if ((!el || !el.offsetParent) && st.m) el = $(st.m);
  if (!el) return endTour();
  el.scrollIntoView({ block: 'center', behavior: 'smooth' });
  setTimeout(() => {
    const r = el.getBoundingClientRect(), pad = 8;
    const tipW = Math.min(340, innerWidth - 32);
    let top = r.bottom + 14, left = Math.min(Math.max(16, r.left), innerWidth - tipW - 16);
    if (top + 220 > innerHeight) top = Math.max(16, r.top - 230);
    $('#tour').innerHTML = `<div class="tour-hole" style="top:${r.top - pad}px;left:${r.left - pad}px;width:${r.width + pad * 2}px;height:${Math.min(r.height + pad * 2, innerHeight)}px"></div>
      <div class="tour-tip" style="top:${top}px;left:${left}px">
        <div class="tstep">ШАГ ${tourI + 1} ИЗ ${tourSteps.length}</div><h3>${st.t}</h3><p>${st.d}</p>
        <div class="row between"><div class="tour-dots">${tourSteps.map((_, i) => `<i class="${i === tourI ? 'on' : ''}"></i>`).join('')}</div>
        <div class="row"><button class="btn ghost sm" data-act="tourEnd">Пропустить</button><button class="btn gold sm" data-act="tourNext">${tourI === tourSteps.length - 1 ? 'Готово' : 'Далее'}</button></div></div></div>`;
  }, 380);
}
function endTour() { const t = $('#tour'); t.hidden = true; t.innerHTML = ''; }

/* ===================== Роутер и рендер ===================== */
function parseRoute() {
  const h = location.hash.slice(1) || '/';
  const [path, query] = h.split('?');
  return { parts: path.split('/').filter(Boolean), params: new URLSearchParams(query || '') };
}
function currentNav() {
  const { parts } = parseRoute();
  if (!parts.length) return 'home';
  if (parts[0] === 'c') return 'verify';
  if (parts[0] === 'org' && parts[1] === 'k') return 'contest';
  return parts[0];
}
function route() {
  const { parts, params } = parseRoute();
  switch (parts[0]) {
    case undefined: return viewHome();
    case 'verify': return viewVerify(params);
    case 'c': return viewVerify(new URLSearchParams({ id: parts[1] || '' }));
    case 'org': return parts[1] === 'k' ? viewContest(parts[2]) : viewOrg();
    case 'student': return viewStudent();
    case 'p': return viewResume(parts[1], 'public');
    case 't': return viewResume(parts[1], 'buyer');
    case 'register': return viewRegister();
    case 'buyer': return viewBuyer(params);
    case 'api': return viewApi();
    case 'ranking': return viewRanking();
    case 'kit': return viewKit();
    default: return viewHome();
  }
}

function drawQRs(root = document) {
  $$('[data-qr]', root).forEach((el) => {
    if (el.dataset.done) return; el.dataset.done = '1';
    const size = +el.dataset.size || 80;
    if (window.QRCode) new QRCode(el, { text: el.dataset.qr, width: size, height: size, colorDark: '#070A12', correctLevel: QRCode.CorrectLevel.M });
    else { el.style.width = el.style.height = size + 'px'; }
  });
}
function animateWidgets(root = document, instant) {
  $$('[data-ring]', root).forEach((c) => {
    const val = +c.dataset.ring, len = +c.dataset.c;
    requestAnimationFrame(() => requestAnimationFrame(() => { c.style.strokeDashoffset = len * (1 - Math.min(100, val) / 100); }));
  });
  $$('[data-count]', root).forEach((el) => {
    const to = +el.dataset.count; const dur = instant ? 500 : 1100; const t0 = performance.now();
    const step = (t) => { const p = Math.min(1, (t - t0) / dur); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))).toLocaleString('ru-RU'); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  });
}
let io;
function observeReveal() {
  if (io) io.disconnect();
  io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
  $$('.reveal').forEach((el) => io.observe(el));
}
function afterRender() { drawQRs(); animateWidgets(); mountLive(); }

/* Живые экраны: наш же сайт в режиме embed внутри макетов устройств */
const liveRO = new ResizeObserver((es) => es.forEach((e) => fitLive(e.target)));
function fitLive(box) {
  const f = box.querySelector('iframe'); if (!f) return;
  const w = +box.dataset.w, s = box.clientWidth / w;
  f.style.transform = `scale(${s})`;
  f.style.height = `${box.clientHeight / s}px`;
}
function mountLive() {
  if (EMBED || document.body.classList.contains('intro-on')) return;
  $$('.live').forEach((box) => {
    if (box.querySelector('iframe')) return;
    const f = document.createElement('iframe');
    f.src = `${location.pathname}?embed=1${box.dataset.live}`;
    f.title = 'Proofy';
    f.loading = 'lazy';
    f.style.width = `${box.dataset.w}px`;
    if (!box.classList.contains('interactive')) f.tabIndex = -1;
    box.appendChild(f);
    liveRO.observe(box); fitLive(box);
  });
}

function render() {
  const nav = currentNav();
  $('#app').innerHTML = route();
  $$('[data-nav]').forEach((a) => a.classList.toggle('active', a.dataset.nav === (nav === 'contest' ? 'org' : nav)));
  afterRender(); observeReveal(); updateWeightPreview();
  buildDots(nav === 'home');
  if (nav === 'api') renderApiLog();
  const { parts, params } = parseRoute();
  if (parts[0] === 'verify' || parts[0] === 'c') {
    const id = (parts[0] === 'c' ? parts[1] : params.get('id')) || '';
    if (id) runVerify(id.toUpperCase(), params.get('claim') || '');
  }
  if (!document.body.classList.contains('intro-on')) maybeAutoTour();
}
function maybeAutoTour() {
  if (EMBED) return;
  const key = currentNav();
  let seen = false; try { seen = localStorage.getItem('proofy-tour-' + key) === '1'; } catch (e) { /* ignore */ }
  if (!seen && TOURS[key]) setTimeout(() => startTour(false), 700);
}

/* ===================== События ===================== */
document.addEventListener('submit', async (e) => {
  const form = e.target.closest('[data-form]'); if (!form) return;
  e.preventDefault();
  const kind = form.dataset.form;
  if (kind === 'verify') {
    const f = new FormData(form);
    const id = String(f.get('id') || '').trim().toUpperCase();
    const claim = f.get('claim') || '';
    const target = `#/verify?id=${encodeURIComponent(id)}${claim ? '&claim=' + claim : ''}`;
    if (location.hash === target) runVerify(id, claim); else location.hash = target;
  } else if (kind === 'contest') {
    const data = readContestForm(form); if (!data.name) return;
    const res = await API.createContest(data);
    toast('Конкурс создан'); location.hash = `#/org/k/${res.data.contest.id}`;
  } else if (kind === 'issue') issueCerts(form);
  else if (kind === 'regIin') {
    const r = iinInfo(String(new FormData(form).get('iin') || '').trim());
    if (!r.ok) { reg.err = r.err; render(); return; }
    reg.method = 'iin'; reg.age = r.age; regGo(3);
  } else if (kind === 'regMail') {
    const email = String(new FormData(form).get('email') || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { reg.err = 'Проверьте email'; render(); return; }
    reg.method = 'email'; reg.age = null; regGo(3);
  } else if (kind === 'regDetails') {
    const f = new FormData(form);
    const name = String(f.get('name') || '').trim();
    if (!name) return;
    if (reg.role === 'student') {
      const minor = reg.age !== null && reg.age < 18;
      if (minor && f.get('parent') !== 'on') { reg.err = 'Без согласия родителя аккаунт школьника младше 18 лет создать нельзя'; render(); return; }
      const s = { id: 's' + (++db.seq), name, grade: +f.get('grade'), city: f.get('city'), school: String(f.get('school') || '').trim(), direction: f.get('direction'),
        parent: f.get('parent') === 'on', search: false, showName: false, portfolio: false, contact: `student${db.seq}.test@example.com`,
        profile: { ...emptyProfile(), headline: String(f.get('headline') || '').trim() } };
      db.students.push(s); db.session.studentId = s.id;
    } else if (reg.role === 'org') {
      const o = { id: 'o' + (++db.seq), name, city: f.get('city'), verified: false };
      db.orgs.push(o); db.session.orgId = o.id;
      if (HAS_CRYPTO) db.keys[o.id] = await genKeys();
    } else {
      const b = { id: 'b' + (++db.seq), name, type: 'Образовательное агентство' };
      db.buyers.push(b); db.session.buyerId = b.id;
    }
    save(); regGo(4); toast('Аккаунт создан');
  } else if (kind === 'profile') {
    const f = new FormData(form), s = student(db.session.studentId);
    s.profile = { ...(s.profile || emptyProfile()), headline: String(f.get('headline') || '').trim(), fame: String(f.get('fame') || '').trim(),
      about: String(f.get('about') || '').trim(), skills: String(f.get('skills') || '').split(',').map((x) => x.trim()).filter(Boolean) };
    save(); render(); toast('Резюме сохранено');
  }
});

document.addEventListener('input', (e) => {
  if (e.target.closest('[data-form="contest"]')) updateWeightPreview();
  const l = e.target.dataset.lab;
  if (l) { lab[l] = +e.target.value; updateLab(); }
});

document.addEventListener('change', async (e) => {
  const el = e.target.closest('[data-change]');
  if (!el) { if (e.target.closest('[data-form="contest"]')) updateWeightPreview(); return; }
  const act = el.dataset.change;
  if (act === 'setOrg') { db.session.orgId = el.value; save(); if (location.hash !== '#/org') location.hash = '#/org'; else render(); }
  if (act === 'setStudent') { db.session.studentId = el.value; save(); render(); }
  if (act === 'setBuyer') { db.session.buyerId = el.value; save(); render(); }
  if (act === 'toggle') {
    const sid = db.session.studentId;
    await API.consent(sid, el.dataset.field, el.checked);
    render();
    toast(el.checked ? 'Согласие сохранено' : 'Доступ закрыт', el.checked ? I.check : I.lock);
  }
});

document.addEventListener('click', async (e) => {
  const el = e.target.closest('[data-act]'); if (!el) return;
  const act = el.dataset.act;
  switch (act) {
    case 'skipIntro': endIntro(true); break;
    case 'regRole': reg.role = el.dataset.v; regGo(2); break;
    case 'regBack': regGo(Math.max(1, reg.step - 1)); break;
    case 'regDemoIin': { const inp = $('[data-form="regIin"] input'); inp.value = demoIin(); inp.focus(); break; }
    case 'regGoogle': {
      el.disabled = true; el.querySelector('small').textContent = 'Подключаемся к Google…';
      await sleep(900); reg.method = 'google'; reg.age = null; regGo(3); break;
    }
    case 'regDone': reg.step = 1; reg.role = null; reg.method = null; reg.age = null; break;
    case 'langToggle': { const m = $('#langMenu'); m.hidden = !m.hidden; break; }
    case 'setLang':
      setLang(el.dataset.lang); $('#langMenu').hidden = true;
      $$('.live iframe').forEach((f) => { try { f.contentWindow.setLang(el.dataset.lang); } catch (err) { /* ещё грузится */ } });
      break;
    case 'inside': {
      $$('.inside-menu button').forEach((b) => b.classList.toggle('on', b === el));
      const f = $('#insideLive iframe');
      if (f) { try { f.contentWindow.location.hash = el.dataset.v; } catch (err) { f.src = `${location.pathname}?embed=1${el.dataset.v}`; } }
      break;
    }
    case 'toTop': window.scrollTo({ top: 0, behavior: 'smooth' }); break;
    case 'scrollCue': { const s = $('.page .section'); if (s) window.scrollTo({ top: s.getBoundingClientRect().top + scrollY - 70, behavior: 'smooth' }); break; }
    case 'dot': { e.preventDefault(); const s = document.getElementById(el.dataset.target); if (s) window.scrollTo({ top: s.getBoundingClientRect().top + scrollY - 80, behavior: 'smooth' }); break; }
    case 'replayIntro': playIntro(); break;
    case 'tour': startTour(true); break;
    case 'tourNext': if (++tourI >= tourSteps.length) endTour(); else showTourStep(); break;
    case 'tourEnd': endTour(); break;
    case 'reset':
      if (!confirm('Сбросить все демо-данные к исходным?')) return;
      db = seed(); save(); await ensureCrypto(); lastIssued = [];
      try { Object.keys(localStorage).filter((k) => k.startsWith('proofy-tour-')).forEach((k) => localStorage.removeItem(k)); } catch (err) { /* ignore */ }
      if (location.hash === '#/' || !location.hash) render(); else location.hash = '#/';
      toast('Демо-данные сброшены'); break;
    case 'labPreset': Object.assign(lab, LAB_PRESETS[el.dataset.p]); updateLab(); break;
    case 'rankDir': rk.dir = el.dataset.v; render(); break;
    case 'printKit': { const k = $('#kit'); k.classList.add('print-target'); window.print(); k.classList.remove('print-target'); break; }
    case 'labLevel': lab.level = el.dataset.v; updateLab(); break;
    case 'labToggle': lab[el.dataset.k] = !lab[el.dataset.k]; updateLab(); break;
    case 'scan': openScanner(); break;
    case 'closeModal': closeModal(); break;
    case 'demoScan': {
      const msg = $('#scanMsg'); if (msg) msg.textContent = 'QR найден: PRF-GH26-0001';
      await sleep(700); closeModal(); toast('QR распознан');
      location.hash = '#/verify?id=PRF-GH26-0001'; break;
    }
    case 'sample': { const ta = $('[data-form="issue"] textarea'); ta.value = SAMPLE_CSV; ta.focus(); $('#issueErrors').innerHTML = ''; break; }
    case 'template': {
      const blob = new Blob(['﻿ФИО;класс;город;школа;результат\n' + SAMPLE_CSV.replace(/; /g, ';')], { type: 'text/csv;charset=utf-8' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'proofy-shablon.csv'; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000); toast('Шаблон скачан', I.download); break;
    }
    case 'request': {
      const sid = el.dataset.sid; const purpose = $('#purpose-' + sid).value;
      el.disabled = true; el.textContent = 'Отправляем…';
      await API.request(sid, purpose); render(); toast('Запрос отправлен школьнику'); break;
    }
    case 'answer': {
      el.disabled = true;
      await API.answer(el.dataset.id, el.dataset.v); render();
      toast(el.dataset.v === 'approved' ? 'Контакт открыт' : 'Запрос отклонён', el.dataset.v === 'approved' ? I.check : I.x); break;
    }
    case 'filter': {
      ui[el.dataset.k] = el.dataset.k === 'minW' ? +el.dataset.v : el.dataset.v;
      await API.search(ui); render(); break;
    }
    case 'copy': {
      const text = el.dataset.text;
      try { await navigator.clipboard.writeText(text); toast('Скопировано', I.link); } catch (err) { prompt('Скопируйте:', text); }
      break;
    }
    case 'print': {
      const t = $('#certPrint'); if (!t) break;
      t.classList.add('print-target'); window.print(); t.classList.remove('print-target'); break;
    }
  }
});
document.getElementById('modal').addEventListener('click', (e) => { if (e.target.id === 'modal') closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeModal(); endTour(); } });

/* 3D-наклон сертификата */
document.addEventListener('mousemove', (e) => {
  const sp = e.target.closest('.card, .stat-card, .flow-step, .role-card, .talent, .privacy > div');
  if (sp) { const r = sp.getBoundingClientRect(); sp.style.setProperty('--mx', `${e.clientX - r.left}px`); sp.style.setProperty('--my', `${e.clientY - r.top}px`); }
  const c = e.target.closest('[data-tilt]');
  $$('[data-tilt]').forEach((x) => { if (x !== c) x.style.transform = ''; });
  if (!c) return;
  const r = c.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
  c.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 14}deg)`;
});
window.addEventListener('resize', () => { if (!$('#tour').hidden) showTourStep(); });
window.addEventListener('hashchange', () => { endTour(); closeModal(); render(); window.scrollTo(0, 0); });

/* ===================== Точки разделов, прокрутка, отклик ===================== */
let dotIO;
function buildDots(on) {
  const box = $('#dots');
  if (dotIO) dotIO.disconnect();
  if (!on) { box.hidden = true; box.innerHTML = ''; return; }
  const secs = [['s-hero', 'Главная', $('.hero')]];
  $$('.page section.section').forEach((s, i) => {
    const eb = s.querySelector('.eyebrow');
    if (!eb) return;
    s.id = s.id || `s-${i}`;
    secs.push([s.id, eb.textContent.trim(), s]);
  });
  if (secs[0][2]) secs[0][2].id = 's-hero';
  box.innerHTML = secs.map(([id, label]) => `<a href="#" data-act="dot" data-target="${id}"><span>${esc(label)}</span></a>`).join('');
  box.hidden = false;
  dotIO = new IntersectionObserver((es) => es.forEach((en) => {
    if (en.isIntersecting) $$('#dots a').forEach((a) => a.classList.toggle('on', a.dataset.target === en.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  secs.forEach(([, , el]) => el && dotIO.observe(el));
}
function onScroll() {
  const y = window.scrollY, max = document.documentElement.scrollHeight - innerHeight;
  $('#topbar').classList.toggle('scrolled', y > 10);
  $('#scrollBar').style.width = `${max > 0 ? Math.min(100, (y / max) * 100) : 0}%`;
  $('#toTop').hidden = y < 600;
  const cta = $('#stickyCta'); if (cta) cta.classList.toggle('show', !EMBED && currentNav() === 'home' && y > 520);
}
window.addEventListener('scroll', onScroll, { passive: true });

/* Отклик на нажатие: волна от точки касания */
document.addEventListener('pointerdown', (e) => {
  const t = e.target.closest('.btn, .chip, .nav a, .tabbar a, .role-card, .icon-btn, .lang-btn, .to-top, .tabs a, .dots a, .lang-menu button, .switch');
  if (!t || t.disabled) return;
  const r = t.getBoundingClientRect(), d = Math.max(r.width, r.height);
  const s = document.createElement('span');
  s.className = 'rp';
  s.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
  t.appendChild(s);
  t.classList.remove('pressed'); void t.offsetWidth; t.classList.add('pressed');
  setTimeout(() => s.remove(), 650);
});
document.addEventListener('click', (e) => {
  if (!e.target.closest('#langBox')) { const m = $('#langMenu'); if (m) m.hidden = true; }
});

/* ===================== Интро ===================== */
let introTimer;
function endIntro(fast) {
  const el = $('#intro'); if (!el || el.hidden || el.classList.contains('leaving')) return;
  clearTimeout(introTimer);
  el.classList.add('leaving');
  document.body.classList.remove('entered');
  setTimeout(() => { document.body.classList.remove('intro-on'); document.body.classList.add('entered'); setTimeout(mountLive, 500); }, fast ? 150 : 300);
  setTimeout(() => { el.hidden = true; maybeAutoTour(); }, fast ? 800 : 1100);
}
function playIntro() {
  const el = $('#intro');
  const clone = el.cloneNode(true); clone.hidden = false; clone.classList.remove('leaving', 'skip');
  el.replaceWith(clone);
  if (typeof translateTree === 'function') translateTree(clone);
  document.body.classList.add('intro-on'); document.body.classList.remove('entered'); window.scrollTo(0, 0);
  introTimer = setTimeout(() => endIntro(false), 4300);
}

/* ===================== Старт ===================== */
(async function init() {
  $('#langMenu').innerHTML = LANGS.map((l) => `<button data-act="setLang" data-lang="${l.code}">${l.label}<small>${l.short}</small></button>`).join('');
  const syncTabs = () => $$('#tabbar a').forEach((a) => a.classList.toggle('active', a.dataset.nav === (currentNav() === 'contest' ? 'org' : currentNav())));
  window.addEventListener('hashchange', syncTabs);
  startI18n();
  await ensureCrypto();
  render(); syncTabs(); onScroll();
  if (EMBED) document.body.classList.add('embed');
  if (EMBED || new URLSearchParams(location.search).has('nointro') || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const el = $('#intro'); el.hidden = true; document.body.classList.remove('intro-on'); document.body.classList.add('entered'); maybeAutoTour(); mountLive();
  } else introTimer = setTimeout(() => endIntro(false), 4300);
})();
