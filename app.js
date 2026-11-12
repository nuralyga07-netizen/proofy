'use strict';

/* =====================================================================
   Proofy — прототип. Данные тестовые и хранятся в localStorage.
   Слой API ниже имитирует сервер: задержка, коды ответа, журнал запросов.
   ===================================================================== */

const STORE = 'proofy-v1';

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
function save() { try { localStorage.setItem(STORE, JSON.stringify(db)); } catch (e) { /* ignore */ } }

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
    <div class="hero-visual reveal">
      <div class="orbit o1"><i></i></div><div class="orbit o2"><i></i></div>
      <div class="float-tag t1"><span class="badge ok">${I.check}</span><span>Проверено за <b>0,2 с</b></span></div>
      <div class="float-tag t2"><span class="badge gold">вес</span><b>77</b><span>/ 100</span></div>
      <div class="float-tag t3"><span class="badge sky">${I.map}</span><span>Хромтау → вуз</span></div>
      ${certVisual(db.certs[0], { scan: true })}
    </div>
  </section>

  <div class="ticker"><div class="wrap ticker-in">
    <div class="ticker-label"><i></i>Реестр · демо</div>
    <div class="ticker-feed" id="ticker"></div>
  </div></div>

  <section class="wrap section">
    <div class="grid g4">
      <div class="stat-card reveal"><div class="stat-num sky" data-count="${db.certs.length}">0</div><div class="muted small">${plural(db.certs.length, 'сертификат', 'сертификата', 'сертификатов')} в реестре</div></div>
      <div class="stat-card reveal"><div class="stat-num gold" data-count="${db.orgs.filter((o) => o.verified).length}">0</div><div class="muted small">подтверждённых организатора</div></div>
      <div class="stat-card reveal"><div class="stat-num ok" data-count="${cities}">0</div><div class="muted small">городов, включая малые</div></div>
      <div class="stat-card reveal"><div class="stat-num" data-count="5">0</div><div class="muted small">секунд на одну проверку</div></div>
    </div>
  </section>

  <section class="wrap section">
    <div class="section-head reveal"><div class="eyebrow">Как это работает</div><h2>Три шага, никаких «загрузите грамоту»</h2></div>
    <div class="flow">
      <div class="flow-step reveal"><div class="flow-num">01</div><div class="flow-ico">${I.upload}</div><h3>Организатор выдаёт</h3><p>Загружает список призёров. Каждый получает сертификат с ID и QR.</p></div>
      <div class="flow-step reveal"><div class="flow-num">02</div><div class="flow-ico">${I.lock}</div><h3>Школьник решает</h3><p>Профиль скрыт. В поиск — только с согласия родителя.</p></div>
      <div class="flow-step reveal"><div class="flow-num">03</div><div class="flow-ico">${I.shield}</div><h3>Вуз проверяет</h3><p>Видит «подлинный или нет» и вес конкурса.</p></div>
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
    <div class="section-head reveal"><div class="eyebrow">Данные несовершеннолетних</div><h2>Приватность по умолчанию</h2></div>
    <div class="privacy">
      <div class="reveal">${I.eye}<b>Скрыт с первого дня</b><span>Профиль не виден никому</span></div>
      <div class="reveal">${I.user}<b>Согласие родителя</b><span>Без него в поиск не попасть</span></div>
      <div class="reveal">${I.lock}<b>Без имени</b><span>Покупатель видит класс и город</span></div>
      <div class="reveal">${I.key}<b>Контакт по запросу</b><span>Открывает только сам школьник</span></div>
    </div>
  </section>

  <section class="wrap section">
    <div class="section-head reveal"><div class="eyebrow">Выберите роль</div><h2>Попробуйте каждую сторону</h2></div>
    <div class="grid g3">
      <a class="role-card reveal" href="#/org"><div class="flow-ico">${I.building}</div><h3>Организатор</h3><p>Выдать сертификаты призёрам за минуту</p><span class="go">Открыть кабинет →</span></a>
      <a class="role-card reveal" href="#/student"><div class="flow-ico">${I.user}</div><h3>Школьник</h3><p>Портфолио одной ссылкой и согласие</p><span class="go">Открыть кабинет →</span></a>
      <a class="role-card reveal" href="#/buyer"><div class="flow-ico">${I.search}</div><h3>Вуз или агентство</h3><p>Проверенные таланты из регионов</p><span class="go">Открыть кабинет →</span></a>
    </div>
    <div class="cta-band reveal"><h2>Проверьте настоящий и поддельный сертификат прямо сейчас</h2><a class="btn gold lg" href="#/verify">${I.qr}К проверке</a></div>
  </section></div>`;
}
const labIs = (p) => Object.entries(LAB_PRESETS[p]).every(([k, v]) => lab[k] === v);
function labResult() {
  const w = contestWeight(lab);
  const verdict = w.total >= 70 ? '<span class="badge ok">Сильный конкурс</span>' : w.total >= 40 ? '<span class="badge warn">Средний вес</span>' : '<span class="badge bad">Почти ничего не значит</span>';
  return `${ring(w.total, 180, 'из 100', 14)}<div class="verdict-line">${verdict}</div>${breakdown(w)}`;
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
          <label class="field"><span>Направление</span><select name="direction">${DIRECTIONS.map((d) => `<option>${d}</option>`).join('')}</select></label>
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
function viewPortfolio(id) {
  const s = student(id);
  if (!s || !s.portfolio) return `<div class="page wrap"><div class="card empty">${I.lock}<h2>Портфолио скрыто</h2><p>Владелец не открыл публичную ссылку.</p></div></div>`;
  const certs = certsOf(s.id).slice().sort((a, b) => certPoints(b) - certPoints(a));
  return `<div class="page wrap">
  <div class="page-head"><div class="row">${avatar(s, 'lg')}<div><div class="eyebrow">Проверенное портфолио</div><h1 style="margin:0">${esc(shownName(s))}</h1>
    <p class="muted">${s.grade} класс · ${esc(s.city)} · ${esc(s.direction)}</p></div></div>${ring(Math.min(100, rating(s.id)), 110, 'баллов', 10).replace(`data-count="${Math.min(100, rating(s.id))}"`, `data-count="${rating(s.id)}"`)}</div>
  <div class="grid g3">${certs.map((c) => `<a href="#/c/${c.id}">${certVisual(c)}</a>`).join('')}</div>
  <p class="muted small" style="margin-top:16px">Каждый сертификат выдан организатором и проверяется по QR.</p></div>`;
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
    if (!req) action = `<div class="row" style="margin-top:14px"><select id="purpose-${s.id}" style="flex:1;min-width:150px">${PURPOSES.map((p) => `<option>${p}</option>`).join('')}</select><button class="btn sm" data-act="request" data-sid="${s.id}">Запросить контакт</button></div>`;
    else if (req.status === 'pending') action = `<div class="lock">${I.spark}Запрос отправлен. Ждём ответа школьника.</div>`;
    else if (req.status === 'declined') action = `<div class="lock">${I.x}Школьник отклонил запрос.</div>`;
    else action = `<div class="notice" style="margin-top:14px">${I.check.replace('<svg', '<svg style="width:16px;height:16px;vertical-align:-3px"')} Контакт: <b>${esc(s.contact)}</b><br><span class="small">${esc(s.school)}</span></div>`;
  }
  return `<div class="talent">
    <div class="talent-head">${avatar(s)}<div style="flex:1;min-width:0"><div class="talent-name">${esc(title)}</div>
      <div class="muted small">${I.map.replace('<svg', '<svg style="width:13px;height:13px;vertical-align:-2px"')} ${esc(s.city)} · ${esc(s.direction)}</div></div>
      <div class="pts">${rating(s.id)}<small>баллов</small></div></div>
    ${certs.map((c) => { const k = contest(c.contestId); return `<div class="talent-ach"><span><a href="#/c/${c.id}">${esc(k.name)}</a> · ${RESULTS[c.result].label}</span>${wbar(contestWeight(k).total)}</div>`; }).join('')}
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
    { sel: '#nav', t: 'Пять разделов', d: 'Проверка, три роли и API. Начните с проверки.', m: '#mnav' },
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
    case 'p': return viewPortfolio(parts[1]);
    case 'buyer': return viewBuyer(params);
    case 'api': return viewApi();
    case 'ranking': return viewRanking();
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
function afterRender() { drawQRs(); animateWidgets(); }

function render() {
  const nav = currentNav();
  $('#app').innerHTML = route();
  $$('[data-nav]').forEach((a) => a.classList.toggle('active', a.dataset.nav === (nav === 'contest' ? 'org' : nav)));
  afterRender(); observeReveal(); updateWeightPreview();
  if (nav === 'home') startTicker(); else clearInterval(tickTimer);
  if (nav === 'api') renderApiLog();
  const { parts, params } = parseRoute();
  if (parts[0] === 'verify' || parts[0] === 'c') {
    const id = (parts[0] === 'c' ? parts[1] : params.get('id')) || '';
    if (id) runVerify(id.toUpperCase(), params.get('claim') || '');
  }
  if (!document.body.classList.contains('intro-on')) maybeAutoTour();
}
function maybeAutoTour() {
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
  const c = e.target.closest('[data-tilt]');
  $$('[data-tilt]').forEach((x) => { if (x !== c) x.style.transform = ''; });
  if (!c) return;
  const r = c.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
  c.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 14}deg)`;
});
window.addEventListener('resize', () => { if (!$('#tour').hidden) showTourStep(); });
window.addEventListener('hashchange', () => { endTour(); closeModal(); render(); window.scrollTo(0, 0); });

/* ===================== Интро ===================== */
let introTimer;
function endIntro(fast) {
  const el = $('#intro'); if (!el || el.hidden) return;
  clearTimeout(introTimer);
  if (fast) el.classList.add('skip');
  setTimeout(() => { el.hidden = true; document.body.classList.remove('intro-on'); maybeAutoTour(); }, fast ? 450 : 0);
}
function playIntro() {
  const el = $('#intro');
  const clone = el.cloneNode(true); clone.hidden = false; clone.classList.remove('skip');
  el.replaceWith(clone);
  document.body.classList.add('intro-on'); window.scrollTo(0, 0);
  introTimer = setTimeout(() => endIntro(false), 5000);
}

/* ===================== Старт ===================== */
(async function init() {
  const nav = document.querySelector('.topbar');
  const mnav = document.createElement('nav'); mnav.className = 'mobile-nav'; mnav.id = 'mnav';
  mnav.innerHTML = $('#nav').innerHTML; nav.after(mnav);
  const sync = () => $$('#mnav a').forEach((a) => a.classList.toggle('active', a.dataset.nav === (currentNav() === 'contest' ? 'org' : currentNav())));
  window.addEventListener('hashchange', sync);
  await ensureCrypto();
  render(); sync();
  if (new URLSearchParams(location.search).has('nointro') || matchMedia('(prefers-reduced-motion: reduce)').matches) endIntro(true);
  else introTimer = setTimeout(() => endIntro(false), 5000);
})();
