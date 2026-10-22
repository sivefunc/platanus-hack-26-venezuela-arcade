// ¡MOJAO! Duelo de globos de agua en una platabanda de Caracas.
// Platanus Hack 26 Caracas, Arcade Challenge.
//
// Este archivo tiene dos partes:
//   - arriba, el codigo fuente completo y legible, dentro de un comentario;
//   - abajo, lo que se ejecuta: los datos de arte y musica (ART, SONGZ) y ese mismo codigo
//     ya minificado y comprimido con deflate (CODE). El arranque lo descomprime con
//     DecompressionStream y lo ejecuta. Es el fuente de arriba, empaquetado; la minificacion
//     ademas acorta algunas propiedades internas (sc.conf, p.dashT, T.chargeMax...).

/*
// ¡MOJAO! Duelo de globos de agua en una platabanda de Caracas.
// Platanus Hack 26 Caracas, Arcade Challenge.

(function () {
var mAbs = Math.abs, mMax = Math.max, mMin = Math.min, mRound = Math.round, mRand = Math.random, mSin = Math.sin, mCos = Math.cos, mCeil = Math.ceil;
var GW = 800;
var GH = 600;

// DO NOT replace existing keys — they match the physical arcade cabinet wiring.
// To add local testing shortcuts, append extra keys to any array.
const CABINET_KEYS = {
  P1_U: ['w'],
  P1_D: ['s'],
  P1_L: ['a'],
  P1_R: ['d'],
  P1_1: ['u'],
  P1_2: ['i'],
  P1_3: ['o'],
  P1_4: ['j'],
  P1_5: ['k'],
  P1_6: ['l'],
  P2_U: ['ArrowUp'],
  P2_D: ['ArrowDown'],
  P2_L: ['ArrowLeft'],
  P2_R: ['ArrowRight'],
  P2_1: ['r'],
  P2_2: ['t'],
  P2_3: ['y'],
  P2_4: ['f'],
  P2_5: ['g'],
  P2_6: ['h'],
  START1: ['Enter'],
  START2: ['2'],
};

const KEYBOARD_TO_ARCADE = {};
for (const [arcadeCode, keys] of Object.entries(CABINET_KEYS)) {
  for (const key of keys) {
    KEYBOARD_TO_ARCADE[normalizeIncomingKey(key)] = arcadeCode;
  }
}

function normalizeIncomingKey(key) {
  if (typeof key !== 'string' || key.length === 0) return '';
  if (key === ' ') return 'space';
  return key.toLowerCase();
}

// @@ASSETS
// (ART y SONGZ: datos, van fuera de este comentario)
// Mapa de sprites.png (ver tools/pixel-pack.sh): [x, y, w, h]
var PK = { ch: [0, 0, 48, 48], ref: [112, 508, 48, 48], tank: [0, 480, 22, 28], tobo1: [22, 480, 16, 16], tobo2: [38, 480, 16, 16], globo: [54, 480, 8, 10], burst: [62, 480, 24, 24], logo: [0, 508, 104, 53] };
// intro: 672 fusas, 2 voces; coro: 512 fusas, 3 voces; texto 958 B -> deflate 220 B
// (ART y SONGZ: datos, van fuera de este comentario)
var SONG_LEN = [672, 512]; // intro, coro
// @@END

// SIM
var T = {
  move: 130, chargeMove: 0.5, rachaSpeed: 1.3, ball: 180, chargeMul: 1.6,
  chargeScale: 1.4, chargeMax: 1, curve: 80, dashSpeed: 280, dashTime: 0.16,
  dashInv: 0.25, dashCd: 1, puddleDash: 1.3, puddleLife: 5, puddleR: 12, slide: 4,
  stun: 0.3, throwShow: 0.3, inv: 1, hitX: 15, hitY: 12, clash: 12, match: 60,
};
var COURT = { x: 11, y: 90, w: 378, h: 188 };
var MID = 200;
var SIDE_PAD = 22; // los cuerpos grandes (PSCALE) no se montan sobre el muro lateral
var CX = 400; // centro de la pantalla

// PROJ: esquinas del area jugable medidas sobre art/out/ambient.png (800x600, editado de la original; tools/edges.mjs): borde interior del amarillo; linea central x=400 arriba, 398.5 abajo.
// sTop/sBot: un jugador completo (cuerpo + cabeza, 149 px a escala 1) mide ~85 px atras y ~105 px adelante, como en la original.
const PROJ_LEFT_TOP = 103, PROJ_RIGHT_TOP = 697, PROJ_LEFT_BOTTOM = 47, PROJ_RIGHT_BOTTOM = 752, PROJ_TOP = 208, PROJ_BOTTOM = 496, PROJ_CENTER_TOP = 400, PROJ_CENTER_BOTTOM = 398.5, PROJ_SCALE_TOP = 0.57, PROJ_SCALE_BOTTOM = 0.7;

function lerp(a, b, t) { return a + (b - a) * t; }

function proj(x, y) {
  var u = (x - COURT.x) / COURT.w, v = (y - COURT.y) / COURT.h;
  var l = lerp(PROJ_LEFT_TOP, PROJ_LEFT_BOTTOM, v), r = lerp(PROJ_RIGHT_TOP, PROJ_RIGHT_BOTTOM, v), c = lerp(PROJ_CENTER_TOP, PROJ_CENTER_BOTTOM, v);
  return {
    x: u < 0.5 ? lerp(l, c, u * 2) : lerp(c, r, (u - 0.5) * 2),
    y: lerp(PROJ_TOP, PROJ_BOTTOM, v),
    s: lerp(PROJ_SCALE_TOP, PROJ_SCALE_BOTTOM, v),
  };
}

function newPlayer(side) {
  return {
    side: side, pace: 0, x: side ? COURT.x + COURT.w - 40 : COURT.x + 40, y: COURT.y + COURT.h / 2,
    vx: 0, vy: 0, throwT: 0, chg: false, charge: 0, dashT: 0, dashCd: 0, dashX: 0, dashY: 0, dashMul: 1,
    inv: 0, stun: 0, streak: 0, score: 0, pa: false, pb: false, lf: !!side,
  };
}

function newMatch() {
  return {
    time: T.match, sd: false, over: false, winner: -1,
    p: [newPlayer(0), newPlayer(1)], balls: [], puddles: [], ev: [],
  };
}

// Hacia donde mira el personaje: true = izquierda (el perfil base mira a la derecha). Manda la x del joystick; en vertical conserva la ultima orientacion.
// Cargando, lanzando (T.throwShow s) o en dash mira al rival: P1 a la derecha, P2 a la izquierda.
function headView(p, inp) {
  if (p.chg || p.dashT > 0 || p.throwT > 0) p.lf = !!p.side;
  else if (inp.x) p.lf = inp.x < 0;
  return p.lf;
}

// Sin cooldown: puedes lanzar de nuevo cuando tu globo anterior revienta (pared, rival o choque). Un solo globo propio en el aire.
function ready(s, p) {
  return !s.balls.some(function (b) { return b.o === p.side; });
}

function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

function stepMatch(s, inputs, dt) {
  s.ev.length = 0;
  var n = mMax(1, mCeil(dt * 60 - 1e-9));
  for (var i = 0; i < n; i++) stepOnce(s, inputs, dt / n);
}

function stepOnce(s, inputs, dt) {
  if (s.over) return;
  for (var i = 0; i < 2; i++) stepPlayer(s, s.p[i], inputs[i], dt);
  stepBalls(s, dt);
  if (!s.sd && !s.over) {
    s.time = mMax(0, s.time - dt);
    if (s.time === 0) {
      var d = s.p[0].score - s.p[1].score;
      if (d) endMatch(s, d > 0 ? 0 : 1);
      else { s.sd = true; s.ev.push({ k: 'sd' }); }
    }
  }
  for (var j = 0; j < s.puddles.length; j++) s.puddles[j].life -= dt;
  s.puddles = s.puddles.filter(function (q) { return q.life > 0; });
}

function endMatch(s, w) {
  s.over = true;
  s.winner = w;
  s.ev.push({ k: 'end', winner: w });
}

function onPuddle(s, p) {
  return s.puddles.some(function (q) { return Math.hypot(q.x - p.x, q.y - p.y) < q.r; });
}

function stepPlayer(s, p, inp, dt) {
  p.throwT = mMax(0, p.throwT - dt);
  p.dashCd = mMax(0, p.dashCd - dt);
  p.inv = mMax(0, p.inv - dt);
  p.stun = mMax(0, p.stun - dt);
  var aEdge = inp.a && !p.pa, bEdge = inp.b && !p.pb;
  p.pa = inp.a;
  p.pb = inp.b;
  var ix = inp.x, iy = inp.y;
  if (p.stun > 0) { ix = iy = 0; aEdge = bEdge = false; }
  var len = ix && iy ? Math.SQRT1_2 : 1;
  var wet = onPuddle(s, p);
  if (bEdge && p.dashCd <= 0 && p.dashT <= 0 && (ix || iy)) {
    p.dashT = T.dashTime;
    p.dashCd = T.dashCd;
    p.inv = mMax(p.inv, T.dashInv);
    p.dashX = ix * len;
    p.dashY = iy * len;
    p.dashMul = wet ? T.puddleDash : 1;
    p.chg = false;
    p.charge = 0;
    s.ev.push({ k: 'dash', p: p.side });
  }
  if (aEdge && ready(s, p) && p.dashT <= 0) { p.chg = true; p.charge = 0; }
  if (p.chg) {
    if (inp.a) p.charge = mMin(T.chargeMax, p.charge + dt);
    else if (ready(s, p)) throwBalloon(s, p, inp.y);
    else { p.chg = false; p.charge = 0; }
  }
  if (p.dashT > 0) {
    var st = mMin(dt, p.dashT), ds = T.dashSpeed * p.dashMul;
    p.vx = p.dashX * ds;
    p.vy = p.dashY * ds;
    p.dashT -= st;
    dt = st;
  } else {
    var sp = T.move * (1 + p.pace) * (p.chg ? T.chargeMove : 1) * len;
    var k = wet ? Math.exp(-T.slide * dt) : 0;
    p.vx = ix * sp + (p.vx - ix * sp) * k;
    p.vy = iy * sp + (p.vy - iy * sp) * k;
  }
  var lo = p.side ? MID + 12 : COURT.x + SIDE_PAD, hi = p.side ? COURT.x + COURT.w - SIDE_PAD : MID - 12;
  p.x = clamp(p.x + p.vx * dt, lo, hi);
  p.y = clamp(p.y + p.vy * dt, COURT.y + 10, COURT.y + COURT.h - 6);
}

function throwBalloon(s, p, iy) {
  var dir = p.side ? -1 : 1, c = p.charge / T.chargeMax, big = p.charge >= T.chargeMax;
  s.balls.push({
    o: p.side, x: p.x + dir * 12, y: p.y, vx: dir * T.ball * (1 - p.pace) * (1 + (T.chargeMul - 1) * c) * (p.streak >= 2 ? T.rachaSpeed : 1),
    vy: 0, ay: Math.sign(iy) * T.curve, big: big,
  });
  p.throwT = T.throwShow;
  p.chg = false;
  p.charge = 0;
  s.ev.push({ k: 'throw', p: p.side, charged: big });
}

function addPuddle(s, x, y) {
  s.puddles.push({ x: x, y: y, r: T.puddleR, life: T.puddleLife });
}

function stepBalls(s, dt) {
  var bs = s.balls, i, j;
  for (i = 0; i < bs.length; i++) {
    bs[i].x += bs[i].vx * dt;
    bs[i].vy += bs[i].ay * dt;
    bs[i].y += bs[i].vy * dt;
  }
  for (i = 0; i < bs.length; i++) {
    for (j = i + 1; j < bs.length; j++) {
      var a = bs[i], b = bs[j];
      if (a.dead || b.dead || a.o === b.o) continue;
      if (mAbs(a.x - b.x) < T.clash && mAbs(a.y - b.y) < T.clash) {
        a.dead = b.dead = true;
        var mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        addPuddle(s, mx, my);
        s.ev.push({ k: 'clash', x: mx, y: my });
      }
    }
  }
  var keep = [];
  for (i = 0; i < bs.length; i++) {
    var c = bs[i];
    if (c.dead) continue;
    var r = s.p[1 - c.o];
    if (r.inv <= 0 && mAbs(c.x - r.x) < T.hitX && mAbs(c.y - r.y) < T.hitY) {
      var o = s.p[c.o];
      o.score++;
      o.streak++;
      r.streak = 0;
      r.inv = T.inv;
      r.stun = T.stun;
      r.chg = false;
      r.charge = 0;
      addPuddle(s, c.x, c.y);
      s.ev.push({ k: 'hit', p: c.o, v: r.side });
      if (o.streak === 2) s.ev.push({ k: 'racha', p: c.o });
      if (s.sd && !s.over) endMatch(s, c.o);
      continue;
    }
    if (c.y < COURT.y || c.y > COURT.y + COURT.h || c.x < COURT.x || c.x > COURT.x + COURT.w) {
      addPuddle(s, clamp(c.x, COURT.x + 6, COURT.x + COURT.w - 6), clamp(c.y, COURT.y + 6, COURT.y + COURT.h - 6));
      s.ev.push({ k: 'burst', x: c.x, y: c.y });
      continue;
    }
    keep.push(c);
  }
  s.balls = keep;
}

// CPU
const CPU_react = 0.2, CPU_err = 16, CPU_curveP = 0.3, CPU_holdMax = 0.8, CPU_dodgeP = 0.4, CPU_dashP = 0.5, CPU_range = 90, CPU_waitMin = 0.5, CPU_waitMax = 1.4;

function rnd(a, b) { return a + mRand() * (b - a); }

function cpuThink(s, side, mem, dt) {
  var me = s.p[side], opp = s.p[1 - side], out = { x: 0, y: 0, a: false, b: false };
  if (mem.sample === undefined) {
    mem.sample = 0; mem.oy = opp.y; mem.phase = 'wait'; mem.wait = rnd(CPU_waitMin, CPU_waitMax);
    mem.threat = null; mem.plan = null; mem.held = 0;
  }
  mem.sample -= dt;
  if (mem.sample <= 0) { mem.sample = CPU_react; mem.oy = opp.y; }
  var ymin = COURT.y + 10, ymax = COURT.y + COURT.h - 6;

  // incoming balloon aimed at me
  var th = null, i;
  for (i = 0; i < s.balls.length; i++) {
    var b = s.balls[i], d = (me.x - b.x) * (b.vx > 0 ? 1 : -1);
    if (b.o !== side && d > 0 && d < CPU_range && (me.x - b.x) * b.vx > 0 && mAbs(b.y - me.y) < 12) { th = b; break; }
  }
  if (!th) mem.threat = null;
  else {
    if (!mem.threat || mem.threat.b !== th) {
      var dy = th.y >= me.y ? -1 : 1;
      if (me.y + dy * 30 < ymin || me.y + dy * 30 > ymax) dy = -dy;
      mem.threat = { b: th, t: 0, act: mRand() < CPU_dodgeP, dash: mRand() < CPU_dashP, dy: dy, dashed: false };
    }
    mem.threat.t += dt;
  }
  var tt = mem.threat;
  if (tt && tt.act && tt.t >= CPU_react) {
    out.y = tt.dy;
    if (tt.dash && !tt.dashed && me.dashCd <= 0) { out.b = true; tt.dashed = true; }
    return out;
  }

  // attack
  if (!ready(s, me) || me.stun > 0) { if (mem.phase !== 'wait') { mem.phase = 'wait'; mem.wait = rnd(CPU_waitMin, CPU_waitMax); } return out; }
  if (mem.phase === 'wait') {
    mem.wait -= dt;
    if (mem.wait > 0) return out;
    mem.plan = { err: rnd(-CPU_err, CPU_err), curve: mRand() < CPU_curveP ? (mRand() < 0.5 ? -1 : 1) : 0, hold: rnd(0, CPU_holdMax) };
    mem.phase = 'aim';
    mem.held = 0;
  }
  var pl = mem.plan, c = pl.hold / T.chargeMax;
  var tm = (mAbs(opp.x - me.x) - 24) / (T.ball * (1 - me.pace) * (1 + (T.chargeMul - 1) * c));
  var ty = mem.oy + pl.err - pl.curve * 0.5 * T.curve * tm * tm;
  if (ty < ymin || ty > ymax) { pl.curve = 0; ty = clamp(mem.oy + pl.err, ymin, ymax); }
  var off = ty - me.y, near = mAbs(off) < 4;
  if (mAbs(off) > 3) out.y = Math.sign(off);
  if (mem.phase === 'aim') {
    if (near) { mem.phase = 'hold'; mem.held = 0; out.a = true; }
    return out;
  }
  mem.held += dt;
  if (mem.held > dt * 2 && !me.chg) { mem.phase = 'wait'; mem.wait = rnd(CPU_waitMin, CPU_waitMax); return out; }
  if (mem.held >= pl.hold && (mAbs(off) < 6 || mem.held > pl.hold + 1)) {
    out.a = false;
    if (pl.curve) out.y = pl.curve;
    mem.phase = 'wait';
    mem.wait = rnd(CPU_waitMin, CPU_waitMax);
    return out;
  }
  out.a = true;
  return out;
}

// STORE
var WINS_KEY = 'mojao/v1/wins';
var winsReadOk = true;

function sanitizeWins(v) {
  var o = {};
  if (!v || typeof v !== 'object' || Array.isArray(v)) return o;
  Object.keys(v).forEach(function (k) {
    var n = v[k];
    if (typeof n === 'number' && Number.isInteger(n) && n > 0) o[k] = n;
  });
  return o;
}

function addWin(w, id) {
  var o = sanitizeWins(w);
  o[id] = (o[id] || 0) + 1;
  return o;
}

function topFaces(w, n) {
  return Object.keys(w).map(function (k) { return [k, w[k]]; })
    .sort(function (a, b) { return b[1] - a[1] || (a[0] < b[0] ? -1 : 1); }).slice(0, n);
}

// Personajes elegibles: los 10 del equipo de Platanus, una skin completa cada uno (hoja de 6 cuadros, ver skinFrame).
// sc.faces guarda indices en este arreglo; los records se guardan por id (ids viejos '0'..'7' se ignoran al mostrar).
var FACES = 'JOAQUÍN RAIMUNDO PAULA ALDO ANDRÉS JAIME AGUSTÍN RAFAEL IGNACIO FRANK'.split(' ').map(function (name, i) {
  var id = name.toLowerCase().replace('í', 'i').replace('é', 'e');
  return { id: id, name: name, key: id, pace: (i * 2 - 9) / 100 };
});

// Un intercambio suave: mas paso significa un tiro un poco mas lento. En la seleccion se ve como dos barras de hasta
// 48 px (paso y tiro); el cambio real es de +-9%, asi que se exagera: de 8 a 48 px.
function statBars(f) { return [28 + f.pace * 222, 28 - f.pace * 222]; }

function faceOk(id) { return !!faceById(id); }
function faceById(id) { return FACES.find(function (f) { return f.id === id; }); }

async function loadWins() {
  try {
    var st = window.platanusArcadeStorage;
    if (!st) return {};
    var r = await st.get(WINS_KEY);
    return r && r.found ? sanitizeWins(r.value) : {};
  } catch (e) { winsReadOk = false; return {}; }
}

async function saveWins(w) {
  try {
    var st = window.platanusArcadeStorage;
    if (st && winsReadOk) await st.set(WINS_KEY, w);
  } catch (e) { } // sin récords
}

// AUDIO
var AU = { m: null, mus: null, nb: null };

function actx(sc) {
  var c = sc.sound && sc.sound.context;
  if (!c) return null;
  if (!AU.m) {
    AU.m = c.createGain();
    AU.m.gain.value = 0.55;
    AU.m.connect(c.destination);
    AU.mus = c.createGain();
    AU.mus.connect(AU.m);
  }
  return c;
}

function tone(sc, f0, f1, dur, type, vol, delay, dest) {
  var c = actx(sc);
  if (!c) return;
  var t = c.currentTime + (delay || 0), o = c.createOscillator(), g = c.createGain();
  o.type = type || 'square';
  o.frequency.setValueAtTime(f0, t);
  if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g);
  g.connect(dest || AU.m);
  o.start(t);
  o.stop(t + dur + 0.02);
}

// f1: el filtro barre de freq a f1 (soplidos). El buffer de 1 s se repite, asi el ruido dura lo que pida dur.
function noise(sc, dur, vol, ftype, freq, delay, dest, f1) {
  var c = actx(sc);
  if (!c) return;
  if (!AU.nb) {
    AU.nb = c.createBuffer(1, c.sampleRate, c.sampleRate);
    var d = AU.nb.getChannelData(0);
    for (var i = 0; i < d.length; i++) d[i] = mRand() * 2 - 1;
  }
  var t = c.currentTime + (delay || 0), src = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
  src.buffer = AU.nb;
  src.loop = true;
  f.type = ftype;
  f.frequency.setValueAtTime(freq, t);
  if (f1) f.frequency.exponentialRampToValueAtTime(f1, t + dur);
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f);
  f.connect(g);
  g.connect(dest || AU.m);
  src.start(t, mRand() * 0.5);
  src.stop(t + dur + 0.02);
}

// x: en 'throw', globo cargado
function sfx(sc, name, x) {
  try {
    // lanzar: soplido que sube y estiron de goma; cargado, mas grave y largo, con un golpe seco
    if (name === 'throw') { var m = x ? 1.5 : 1; noise(sc, 0.2 * m, 0.25, 'bandpass', 500 / m, 0, 0, 3000 / m); tone(sc, 220 / m, 600 / m, 0.07 * m, 'triangle', 0.22); if (x) tone(sc, 120, 50, 0.16, 'sine', 0.4); }
    else if (name === 'pop') noise(sc, 0.12, 0.35, 'lowpass', 2200);
    else if (name === 'splash') { noise(sc, 0.3, 0.3, 'lowpass', 900); noise(sc, 0.2, 0.15, 'highpass', 3000, 0.04); }
    // golpe: el de siempre, burbujas de agua (senos que suben rapido) y el publico aplaudiendo: 40 palmadas
    // (rafagas cortas de ruido) que arrancan juntas y se van espaciando durante ~1.2 s
    else if (name === 'hit') {
      noise(sc, 0.15, 0.4, 'lowpass', 2500); tone(sc, 140, 50, 0.3, 'sine', 0.5); noise(sc, 0.4, 0.25, 'lowpass', 700, 0.05);
      for (var k = 0; k < 40; k++) { if (k < 4) tone(sc, rnd(300, 600), rnd(900, 1600), 0.05, 'sine', 0.15, 0.06 + k * 0.05); noise(sc, 0.05, rnd(0.03, 0.08), 'bandpass', rnd(800, 2500), 0.1 + rnd(0, 1.2) * mRand()); }
    }
    else if (name === 'dash') { noise(sc, 0.14, 0.2, 'highpass', 2500); tone(sc, 300, 900, 0.12, 'sawtooth', 0.05); }
    else if (name === 'whistle') {
      for (var i = 0; i < 2; i++) { tone(sc, 2500, 2600, 0.22, 'sine', 0.18, i * 0.26); tone(sc, 2450, 2550, 0.22, 'triangle', 0.08, i * 0.26); }
    }
    else if (name === 'pause' || name === 'resume') tone(sc, name === 'pause' ? 220 : 880, 0, 0.1, 0, 0.18);
    else if (name === 'blip') tone(sc, 660, 0, 0.05, 0, 0.16);
    else if (name === 'ok' || name === 'back') for (var k = 0; k < 2; k++) tone(sc, name === 'ok' ? 523 + 261 * k : 784 - 261 * k, 0, 0.08, 0, 0.18, k * 0.07);
    else if (name === 'tick') tone(sc, x ? 1320 : 880, 0, 0.09, 0, x ? 0.2 : 0.12); // x: ultimos 3 s, mas agudo y fuerte
    else if (name === 'racha') [523, 659, 784, 1047].forEach(function (f, k) { tone(sc, f, f, 0.1, 0, 0.12, k * 0.07); });
  } catch (e) { } // sin audio
}

function chargeSnd(sc, p, dt) {
  sc.chT = (sc.chT || 0) - dt;
  if (sc.chT > 0) return;
  sc.chT = 0.07;
  try { tone(sc, 180 + 520 * p.charge, 200 + 520 * p.charge, 0.08, 'triangle', 0.07); } catch (e) { } // sin audio
}

// MUSICA: chiptune de "La vida es un carnaval". SONG = [intro, coro], cada una [largo en fusas, voz, voz...]; una nota son 3 simbolos (tiempo, duracion, tono).
var MU = { sec: null, req: null, v: [], t0: 0, k: 0, rate: 1 };
var SONG = null;
var F32 = 60 / 208 / 8; // una fusa a 208 BPM
var INS = [[['sawtooth', 0.05, 2600], ['triangle', 0.3]], [['square', 0.055, 3200], ['sawtooth', 0.04, 2400], ['triangle', 0.3]]];
// patron de 2 compases en corcheas: clave 3-2, cencerro, conga, guiro
var DR = { c: 'x..x..x...x.x...', b: 'x.x.x.x.x.x.x.x.', t: '......xx......xx', s: '..x.......x.....', n: 'xxxxxxxxxxxxxxxx' };

function sym(s, i) { var c = s.charCodeAt(i); return c - 35 - (c > 47) - (c > 92); }

function parseVoice(s) {
  for (var o = [], t = 0, i = 0; i < s.length; i += 3) { t += sym(s, i); o.push([t, sym(s, i + 1), sym(s, i + 2)]); }
  return o;
}

// Descomprime SONGZ (deflate-raw) y arma SONG. Sin DecompressionStream el juego sigue sin musica.
function loadSong() {
  try {
    var b = Uint8Array.from(artDec(SONGZ[0], SONGZ[1]), function (c) { return c.charCodeAt(0); });
    new Response(new Blob([b]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).text().then(function (t) {
      SONG = t.split('!').map(function (s, i) { return [SONG_LEN[i]].concat(s.split(' ')); });
    }, function () { });
  } catch (e) { } // sin musica
}

// pide una seccion: arranca desde el principio en el primer tick con el contexto en marcha
function playSec(name, rate) { MU.req = [name, rate || 1]; }

function note(c, t, f, d, n) {
  var o = c.createOscillator(), g = c.createGain(), x = o;
  o.type = n[0];
  o.frequency.value = f;
  if (n[2]) { x = c.createBiquadFilter(); x.frequency.value = n[2]; o.connect(x); }
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(n[1], t + 0.01);
  g.gain.setTargetAtTime(n[1] * 0.6, t + 0.03, 0.08);
  g.gain.setTargetAtTime(0, t + d * 0.92, 0.015);
  x.connect(g);
  g.connect(AU.mus);
  o.start(t);
  o.stop(t + d + 0.1);
}

// percusion con tone/noise: c clave, b cencerro, t conga abierta, s conga slap, n guiro
function hit(sc, c, t, kind) {
  var d = t - c.currentTime, P = { c: [2500, 0, 0.03, 'sine', 0.12], b: [800, 0, 0.06, 0, 0.07], t: [190, 150, 0.18, 'sine', 0.35], s: [330, 0, 0.06, 'triangle', 0.25] }[kind];
  if (P) tone(sc, P[0], P[1], P[2], P[3], P[4], d, AU.mus);
  else noise(sc, 0.05, 0.05, 'highpass', 5000, d, AU.mus);
}

function startSec(c, name, rate, t0) {
  var s = SONG[name];
  MU.sec = s; MU.name = name; MU.rate = rate;
  MU.v = s.slice(1).map(function (x) { return { e: parseVoice(x), i: 0, base: 0 }; });
  MU.t0 = t0; MU.k = 0;
}

// programa las notas y la percusion hasta hz; la intro suena una vez y empalma con el coro en el tiempo exacto, el coro hace loop
function musicTick(sc, c, hz) {
  var f = F32 / MU.rate, L = MU.sec[0], end = MU.t0 + L * f, j, t;
  if (!MU.name && end < hz) { musicTick(sc, c, end); startSec(c, 1, MU.rate, end); return musicTick(sc, c, hz); }
  MU.v.forEach(function (v, j) {
    for (;;) {
      if (v.i >= v.e.length) { v.i = 0; v.base += L; }
      var e = v.e[v.i], t = MU.t0 + (v.base + e[0]) * f;
      if (t >= hz) break;
      if (e[2] && t > c.currentTime - 0.05) note(c, t, 440 * Math.pow(2, (e[2] + 27 - 69) / 12), e[1] * f, INS[MU.name][j]);
      v.i++;
    }
  });
  for (; (t = MU.t0 + MU.k * 4 * f) < hz; MU.k++) {
    for (j in DR) if (DR[j][MU.k % 16] === 'x' && t > c.currentTime - 0.05) hit(sc, c, t, j);
  }
}

function musicStep(sc) {
  var c = actx(sc);
  if (!c || c.state !== 'running' || !SONG) return;
  AU.mus.gain.setTargetAtTime(sc.phase === 'result' || sc.phase === 'pause' ? 0.3 : 1, c.currentTime, 0.3);
  if (MU.req) { startSec(c, MU.req[0], MU.req[1], c.currentTime + 0.1); MU.req = null; }
  if (MU.sec) musicTick(sc, c, c.currentTime + 0.25);
}


// DRAW
var FIRE = [0xffd23f, 0xff7a00, 0xff3000];
var FONT = '"Courier New", monospace';
var SKH = 144; // cuadro de una skin; el personaje mide ~136 px de alto con los pies abajo y centrados
var PSCALE = 1.42; // jugadores (skin, sombra, anillos) respecto de la escala de perspectiva de PROJ: ~135 px adelante, ~110 atras
var BSCALE = 1.6; // globos en vuelo (sprite, sombra, estela)
// pantalla de resultado: manda quien gano, no el lado. Los pies a y=462 dejan la placa (y+14 a y+40) por encima del muro del frente y del zinc
var RES_WIN = [270, 462, 1.05], RES_LOSE = [560, 462, 0.9];
function resLayout(w) { return w === 0 ? [RES_WIN, RES_LOSE] : [RES_LOSE, RES_WIN]; }

// Decodifica el texto de 92 simbolos (13 bits por par) a un string binario de n bytes.
function artDec(s, n) {
  var o = '', b = 0, k = 0, i, v;
  function c(j) { var x = s.charCodeAt(j) - 32; return x - (x > 2) - (x > 15) - (x > 60); }
  for (i = 0; i < s.length; i += 2) {
    b = b << 13 | c(i) * 92 + c(i + 1); k += 13;
    while (k >= 8 && o.length < n) { k -= 8; o += String.fromCharCode(b >> k & 255); }
    b &= (1 << k) - 1;
  }
  return o;
}

function artUri(a) { return 'data:image/png;base64,' + btoa(artDec(a[0], a[1])); }

// Corta n cuadros completos; conserva sombras y agrega brillos al globo y al borde del tobo.
function cutTex(sc, im, key, x, y, w, h, n, col) {
  var t = sc.textures.createCanvas(key, w * n, h), c = t.context, j, d, p, i;
  for (j = 0; j < n; j++) { c.drawImage(im, x + j * w, y, w, h, j * w, 0, w, h); t.add(j, 0, j * w, 0, w, h); }
  if (col || key === 'bucket2') {
    d = c.getImageData(0, 0, w * n, h);
    p = d.data;
    for (i = 0; i < p.length; i += 4) {
      if (!col) { if (i >= w * 32 && p[i] > p[i + 1] * 1.3) { p[i] = 220; p[i + 1] = 64; p[i + 2] = 55; } continue; }
      var v = key === 'tank' ? 0.4 + p[i] / 128 : p[i] > 200 ? 1 : 0.55; p[i] = v * (col >> 16); p[i + 1] = v * (col >> 8 & 255); p[i + 2] = v * (col & 255); }
    c.putImageData(d, 0, 0);
    if (col && key !== 'tank') { c.fillStyle = '#effcff'; c.fillRect(2, 2, 1, 2); }
  }
  if (key === 'tank') {
    c.fillStyle = '#42beff'; c.fillRect(3, 7, 16, 1);
    c.fillStyle = '#e0edee'; c.fillRect(11, 14, 3, 4);
  }
  if (key === 'bucket' || key === 'bucket2') {
    c.fillStyle = '#4d8dff'; c.fillRect(3, 3, 3, 3);
    c.fillStyle = '#d6f3ff'; c.fillRect(3, 3, 1, 1); c.fillRect(3, 8, 9, 1);
  }
  t.refresh();
}

// Recorta sprites.png (ver PK): una textura por personaje (7 cuadros completos de 48x48), el arbitro, la utileria, los globos y el logo.
function cutSprites(sc) {
  var im = sc.textures.get('sprites').getSourceImage(), r;
  for (r = 0; r < 10; r++) cutTex(sc, im, FACES[r].key, PK.ch[0], PK.ch[1] + r * PK.ch[3], PK.ch[2], PK.ch[3], 7);
  cutTex(sc, im, 'ref', PK.ref[0], PK.ref[1], 48, 48, 3);
  [['tank', 'tank', 1, 0x187fff], ['bucket', 'tobo1', 1], ['bucket2', 'tobo2', 1], ['balloon', 'globo', 1, 0x4d8dff], ['balloon2', 'globo', 1, 0xff4d4d], ['burst', 'burst', 4], ['logo', 'logo', 1]].forEach(function (k) {
    var q = PK[k[1]];
    cutTex(sc, im, k[0], q[0], q[1], q[2], q[3], k[2], k[3]);
  });
}

function F(g, c, a) { return g.fillStyle(c, a === undefined ? 1 : a); }

// Dibuja fn sobre un Graphics y lo guarda como textura; con n corta n cuadros iguales a lo ancho.
function mkTex(sc, key, w, h, fn, n) {
  var g = sc.make.graphics({ x: 0, y: 0, add: false }), t, i;
  fn(g);
  g.generateTexture(key, w, h);
  g.destroy();
  for (t = sc.textures.get(key), i = 0; i < n; i++) t.add(i, 0, i * w / n, 0, w / n, h);
}

// Charcos pequenos en grilla de 2 px, acordes al radio de deslizamiento.
function makeTextures(sc) {
  mkTex(sc, 'puddle', 24 * 3, 12, function (g) {
    for (var k = 0; k < 3; k++) {
      for (var row = 0; row < 6; row++) {
        var w = [8, 16, 20, 22, 18, 10][row], x = k * 24 + 12 - w / 2;
        F(g, 0x245477, 0.6).fillRect(x, row + 3, w, 2);
        F(g, 0x4aa3df, 0.75).fillRect(x, row + 2, w, 1);
      }
      F(g, 0xd6f3ff, 0.8).fillRect(k * 24 + 5 + k, 4, 5, 1).fillRect(k * 24 + 14, 7, 3, 1);
    }
  }, 3);
}

function flag(g, x, y, k) {
  F(g, 0xffcc00).fillRect(x, y, 24 * k, 6 * k);
  F(g, 0x0033a0).fillRect(x, y + 6 * k, 24 * k, 6 * k);
  F(g, 0xcf142b).fillRect(x, y + 12 * k, 24 * k, 6 * k);
  F(g, 0xffffff);
  for (var i = 0; i < 5; i++) g.fillRect(x + (3 + i * 4) * k, y + 8.5 * k, k, k);
  g.lineStyle(1, 0x000000, 0.8).strokeRect(x, y, 24 * k, 18 * k);
}

function txt(sc, x, y, s, size, color, depth) {
  return sc.add.text(x, y, s, {
    fontFamily: FONT, fontStyle: 'bold', fontSize: size + 'px', color: color || '#ffffff',
    stroke: '#000000', strokeThickness: mMax(2, size / 6 | 0),
  }).setOrigin(0.5).setDepth(depth || 2100);
}

function popText(sc, x, y, s, color, size) {
  var t = txt(sc, x, y, s, size || 28, color);
  sc.tweens.add({ targets: t, y: y - 44, alpha: 0, duration: 1100, ease: 'Cubic.easeOut', onComplete: function () { t.destroy(); } });
}

// x, y en pantalla (ya proyectados)
// gy: altura del piso bajo la salpicadura (por defecto y); cada gota guarda en g donde caeria: segun su direccion,
// mas adelante o mas al fondo, asi las manchas quedan en ovalo
function splash(sc, x, y, n, big, gy) {
  var i;
  for (i = 0; i < n; i++) {
    var a = mRand() * 6.283, v = rnd(60, big ? 240 : 160);
    sc.fx.push({ x: x, y: y - 12, vx: mCos(a) * v, vy: mSin(a) * v * 0.5 - rnd(80, 180), life: rnd(0.4, 0.8), c: mRand() < 0.7 ? 0x8fd3ff : 0xffffff, g: (gy || y) + mSin(a) * v * 0.15 });
  }
  sc.rings.push({ x: x, y: y, r: 4, max: big ? 46 : 26, life: 0.35, t: 0.35 });
}

// polvo gris claro en los pies: sube un poco y se desvanece
function dust(sc, x, y, n) {
  for (var i = 0; i < n; i++) sc.fx.push({ x: x + rnd(-8, 8), y: y - 2, vx: rnd(-20, 20), vy: rnd(-70, -30), life: rnd(0.2, 0.35), c: 0xf2f2f2 });
}

function burstAt(sc, x, y, k) {
  sc.bursts.push({ t: 0, spr: sc.add.sprite(x, y, 'burst', 0).setOrigin(0.5, 0.8).setScale(mMax(1, mRound(k * 4))).setDepth(fxDepth(sc)) });
}

// Patrocinadores pintados horizontales en las franjas amarillas, uno por linea, entre los tobos (y < 290) y las cabillas (y > 400).
// Bordes del amarillo medidos sobre el escenario pixel art: izquierda x 12..92 en y=300 (se angosta hacia adelante), derecha 708..792.
// Letras de 3x5 (M/N de 5x5) dibujadas a x2, sin antialias: letreros sobre la franja amarilla.
// Con sus marcas: la \ de ANTHROP\C, el aro de Cashea (@), el triangulo de Vercel (^) y la de Render (%).
// ElevenLabs no lleva sus II: es el nombre mas largo y ya llena la placa.
var SPONSORS = [['ANTHROP\\C', '@ CASHEA', 'YUMMY', 'PLATANUS\nHACK 26'], ['ELEVENLABS', 'KAPSO', '^ VERCEL', '% RENDER']];

// Letras de 3x5 o 5x5 bits, fila por fila desde arriba a la izquierda; las de 5 de ancho son las que pasan de 15 bits.
var INK = {'^': 4668415, '@': 13387630, '%': 3406616, '\\': 18569, 'D': 27502, 'A': 11245, 'B': 27566, 'C': 14627, 'E': 31143, 'H': 23533, 'I': 29847, 'K': 23469, 'L': 18727, 'M': 18732593, 'N': 18667121, 'O': 11114, 'P': 27556, 'R': 27565, 'S': 14478, 'T': 29842, 'U': 23407, 'V': 23402, 'Y': 23186, '2': 25255, '6': 14831};
function paintSponsors(sc) {
  var g = gfx(sc).setDepth(1.5);
  SPONSORS.forEach(function (list, side) {
    list.forEach(function (name, i) {
      var y = 302 + i * 26 + (i > 2 && !side ? 6 : 0), d = y - 300;
      var lo = side ? 708 + 0.2 * d : mMax(0, 12 - 0.4 * d), hi = side ? mMin(800, 792 + 0.27 * d) : 92 - 0.2 * d;
      var lines = name.split('\n'), x = mRound((lo + hi) / 4) * 2, w = mMin(84, mRound((hi - lo) / 2) * 2);
      F(g, 0x6b4a29).fillRect(x - w / 2, y - 8, w, lines.length * 12 + 6);
      F(g, 0xf3dfaa).fillRect(x - w / 2, y - 10, w, lines.length * 12 + 6);
      F(g, 0x352b24);
      lines.forEach(function (line, row) {
        var widths = line.split('').map(function (c) { return INK[c] >> 15 ? 5 : 3; });
        var left = x + 1 - widths.reduce(function (a, b) { return a + b + 1; }, 0);
        for (var j = 0; j < line.length; j++) {
          var cw = widths[j];
          for (var bit = 0; bit < cw * 5; bit++) if ((INK[line[j]] || 0) >> (cw * 5 - 1 - bit) & 1)
            g.fillRect(left + bit % cw * 2, y - 6 + row * 12 + (bit / cw | 0) * 2, 2, 2);
          left += (cw + 1) * 2;
        }
      });
    });
  });
}

// La ola: sale desde x (o desde un punto al azar) y cada vecino salta al pasarle; las palomas de los techos se espantan
function crowdJump(sc, x) {
  if (sc.t - sc.waveT < 0.6) return;
  sc.waveT = sc.t; sc.waveX = x || rnd(40, 760);
  birds(sc, 4, 130);
}

// palomas: con y salen de los techos hacia arriba (espantadas), sin y cruzan el cielo de un lado al otro
function birds(sc, n, y) {
  for (var i = 0; i < n; i++) {
    var r = mRand() < 0.5;
    sc.birds.push({ x: y ? rnd(60, 740) : r ? -10 : 810, y: y ? y + rnd(-20, 20) : rnd(30, 90), vx: (r ? 1 : -1) * rnd(50, 90) * (y ? 2 : 1), vy: y ? -rnd(60, 120) : 0, p: mRand() * 6 });
  }
}

// Vida del fondo, en todas las fases: vecinos (saltitos sueltos y la ola), bandera que ondea y palomas.
// Todo se mueve de a 4 px (un pixel del escenario) para no romper la grilla del pixel art.
function ambient(sc, dt) {
  var t = sc.t, g = sc.gA.clear(), i, b, f;
  sc.crowd.forEach(function (c, k) {
    var u = (t - sc.waveT - mAbs(44 + k * 32 - sc.waveX) / 900) / 0.35;
    c.y = -4 * (u > 0 && u < 1 ? mRound(3 * mSin(Math.PI * u)) : mSin(t * 2.3 + k * 1.7) * mSin(t * 0.7 + k * 0.4) > 0.7 ? 1 : 0);
  });
  sc.flag.forEach(function (c, k) { c.y = 4 * mRound(mSin(t * 6 - k * 0.7) * k / 12); });
  sc.birdT -= dt;
  if (sc.birdT <= 0) { sc.birdT = rnd(4, 8); birds(sc, 1); }
  for (i = sc.birds.length - 1; i >= 0; i--) {
    b = sc.birds[i];
    b.x += b.vx * dt; b.y += (b.vy + 12 * mSin(t * 3 + b.p)) * dt;
    if (b.x < -20 || b.x > 820 || b.y < -20) { sc.birds.splice(i, 1); continue; }
    f = (t * 8 + b.p | 0) % 2;
    var x = mRound(b.x / 4) * 4, y = mRound(b.y / 4) * 4;
    F(g, 0xe8e4dc).fillRect(x, y, 4, 4).fillRect(x - 4, y - 4 * f, 4, 4).fillRect(x + 4, y - 4 * f, 4, 4);
    if (!f) g.fillRect(x - 8, y + 4, 4, 4).fillRect(x + 8, y + 4, 4, 4);
  }
}

function buildStatic(sc) {
  sc.add.image(0, 0, 'scene').setOrigin(0).setScale(4).setDepth(0);
  // los vecinos son 23 franjas de 8 px recortadas del mismo escenario, y la bandera 15 columnas de 1 px (ver ambient)
  var x, y0, im = function (d) { return sc.add.image(0, 0, 'scene').setOrigin(0).setScale(4).setDepth(d); };
  sc.crowd = []; sc.flag = []; sc.birds = []; sc.birdT = 3; sc.waveT = -9;
  for (x = 10; x < 194; x += 8) sc.crowd.push(im(1).setCrop(x, 34, 8, 14));
  for (x = 19; x < 34; x++) { y0 = 22 + (x - 19) * 0.55 | 0; sc.flag.push(im(1.1).setCrop(x, y0, 1, (31 + (x - 19) * 0.38 | 0) - y0)); }
  sc.gA = gfx(sc).setDepth(0.5);
  paintSponsors(sc);
  [[84, 264], [768, 264], [455, 526]].forEach(function (q) { sc.add.image(q[0], q[1], 'puddle', 0).setScale(2, 1).setTint(0x0b1d2c).setAlpha(0.5).setDepth(1.8); });
  // un solo tanque, apoyado en la esquina de atras-izquierda sobre el muro del fondo y el lateral (fuera de la cancha), con el tobo de P1 bajo la llave; detras de los jugadores
  sc.add.image(6, 252, 'tank').setOrigin(0, 1).setScale(4, 3).setDepth(2);
  sc.add.image(84, 264, 'bucket').setOrigin(0.5, 1).setScale(3).setDepth(2);
  // tobo de P2 en la esquina de atras de la zona amarilla derecha
  sc.add.image(768, 264, 'bucket2').setOrigin(0.5, 1).setScale(3).setDepth(265);
  sc.refBucket = sc.add.image(455, 526, 'bucket').setOrigin(0.5, 1).setScale(3).setDepth(526);
}

function buildActors(sc) {
  sc.body = []; sc.tag = []; sc.hb = []; sc.bspr = []; sc.pspr = []; sc.bursts = []; sc.wet = [];
  // manchas de agua en el piso: se acumulan durante la partida, debajo de los charcos (ver render)
  sc.wetRT = sc.add.renderTexture(0, 0, GW, GH).setOrigin(0).setDepth(1.7);
  for (var i = 0; i < 2; i++) {
    sc.body.push(sc.add.sprite(0, 0, FACES[i].key, 0).setOrigin(0.5, 1).setFlipX(i === 1));
    sc.tag.push(txt(sc, 0, 0, 'P' + (i + 1), 16, i ? '#ff5d6d' : '#4d9dff', 0));
    sc.hb.push(sc.add.image(0, 0, i ? 'balloon2' : 'balloon').setVisible(false));
  }
  sc.ref = sc.add.sprite(CX, 528, 'ref', 0).setOrigin(0.5, 1).setScale(2.4).setDepth(528);
  sc.refT = 0;
  sc.gB = gfx(sc).setDepth(3);
  sc.gT = gfx(sc).setDepth(4);
  sc.gF = gfx(sc).setDepth(900);
}

function box(g, x, y, w, h) {
  F(g, 0x0d1030).fillRoundedRect(x, y, w, h, 6);
  g.lineStyle(3, 0x6c7bd9, 1).strokeRoundedRect(x, y, w, h, 6);
  g.lineStyle(1, 0x000000, 1).strokeRoundedRect(x - 2, y - 2, w + 4, h + 4, 7);
}

function buildHud(sc) {
  var g = gfx(sc).setDepth(2000);
  box(g, 152, 10, 194, 64);
  box(g, 346, 8, 108, 62);
  box(g, 454, 10, 194, 64);
  flag(g, 164, 24, 1.2);
  flag(g, 608, 24, 1.2);
  sc.hud = {
    p1: txt(sc, 236, 32, 'P1', 22, '#4d9dff'), p2: txt(sc, 564, 32, 'P2', 22, '#ff5d6d'),
    s1: txt(sc, 314, 34, '00', 32, '#ffc21f'), s2: txt(sc, 486, 34, '00', 32, '#ffc21f'),
    n1: txt(sc, 250, 60, '', 16, '#4d9dff'), n2: txt(sc, 550, 60, '', 16, '#ff5d6d'),
    tl: txt(sc, 400, 24, 'TIEMPO', 16, '#ffffff'),
    tm: txt(sc, 400, 50, '60', 30, '#ffc21f'), lb: txt(sc, 400, 92, '', 20, '#ffffff'),
  };
  sc.hudObjs = [g, sc.hud.p1, sc.hud.p2, sc.hud.s1, sc.hud.s2, sc.hud.tm, sc.hud.tl, sc.hud.n1, sc.hud.n2];
}

// Cuadro de la skin: 0 quieto, 1 y 2 correr, 3 lanzar (de lado, mirando a la derecha), 4 de frente (celebrar, ganar, pantallas, caminar hacia adelante), 5 de espaldas (caminar hacia el fondo), 6 mojado (recien golpeado y en el resultado si pierde). El cuadro 1 completo tambien sirve para anticipar el tiro con el brazo flexionado.
// Los cuadros de accion miran al rival: P1 sin flip, P2 con flip. El resto de la animacion sale de poseFx.
function skinFrame(sc, s, i, p, fl) {
  var rival = i === 1, mv = mAbs(p.vx) + mAbs(p.vy) > 8;
  if (sc.phase === 'result') return { f: s.winner === i ? 4 : 6, flip: s.winner !== i };
  if (p.stun > 0 || sc.wetT[i] > T.inv - 0.45) return { f: 6, flip: rival };
  if (p.chg) return { f: 1, flip: rival };
  if (p.dashT > 0) return { f: 1, flip: rival };
  if (sc.throwT[i] > 0) return { f: sc.throwT[i] > 0.1 ? 3 : 0, flip: rival };
  if (sc.celT[i] > 0) return { f: 4, flip: false };
  if (mv && mAbs(p.vy) > mAbs(p.vx)) return { f: p.vy < 0 ? 5 : 4, flip: false };
  return { f: mv ? 1 + (sc.t * 8 | 0) % 2 : 0, flip: fl };
}

// Poses sobre la cuadricula: anticipacion, extension y recuperacion sin girar ni deformar la skin.
function poseFx(sc, i, p, S) {
  var o = { dx: 0, dy: 0 }, t = sc.t, jump = -6 * S * mAbs(mSin(Math.PI * t * 5));
  if (sc.phase === 'result') { if (sc.s.winner === i) o.dy = jump; }
  else if (p.stun > 0) o.dx = (t * 40 | 0) % 2 ? 3 : -3;
  else if (p.dashT > 0) { o.dx = 6; o.dy = 3; }
  else if (p.chg) o.dx = p.charge >= T.chargeMax ? -6 : -3;
  else if (sc.throwT[i] > 0) o.dx = sc.throwT[i] > 0.2 ? 9 : sc.throwT[i] > 0.1 ? 6 : 3;
  else if (sc.celT[i] > 0) o.dy = jump;
  else if (mAbs(p.vx) + mAbs(p.vy) > 8) o.dy = -2 * S * mAbs(mSin(Math.PI * t * 8));
  else o.dy = -3 * ((t * 2.2 + i) % 2 | 0);
  return o;
}

// Arbitro: pitando alterna 0/1, en un punto alterna 1/2 y señala hacia quien anoto
function refPose(sc) {
  if (!(sc.refT > 0)) return { f: 0, flip: false };
  var k = sc.t * (sc.refMode === 'point' ? 5 : 6) | 0;
  return sc.refMode === 'point' ? { f: 1 + k % 2, flip: sc.refFlip } : { f: k % 2, flip: false };
}

// gotas y anillos: sobre el velo del resultado (2500), sobre el logo en el titulo y bajo los jugadores solo durante la partida
function fxDepth(sc) { return sc.phase === 'result' ? 2700 : sc.phase === 'title' || sc.phase === 'select' ? 3002 : 900; }

function render(sc, dt) {
  var s = sc.s, g = sc.gB, tg = sc.gT, f = sc.gF, i, k;
  g.clear(); tg.clear(); f.clear();
  f.setDepth(fxDepth(sc));
  if (!s) return;
  for (i = 0; i < s.puddles.length; i++) {
    var q = s.puddles[i], fade = mMin(1, q.life / 1.2), pq = proj(q.x, q.y);
    if (!q.spr) { q.f = mRand() * 3 | 0; q.spr = sc.add.image(0, 0, 'puddle', q.f).setDepth(2); sc.pspr.push(q); }
    q.spr.setPosition(mRound(pq.x / 2) * 2, mRound(pq.y / 2) * 2).setScale(2).setAlpha(0.9 * fade).setVisible(sc.phase !== 'result');
  }
  sc.pspr = sc.pspr.filter(function (q) {
    if (s.puddles.indexOf(q) < 0) { q.spr.destroy(); return false; }
    return true;
  });
  var res = sc.phase === 'result';
  for (i = 0; i < 2; i++) {
    var p = s.p[i], b = sc.body[i], pr = proj(p.x, p.y);
    var RL = res ? resLayout(s.winner)[i] : null;
    var X = res ? RL[0] : pr.x, Y = res ? RL[1] : pr.y, S = res ? RL[2] : pr.s * PSCALE, col = i ? 0xff4d4d : 0x4d8dff;
    if (sc.showAct) F(g, 0x000000, 0.4).fillEllipse(X, Y, 62 * S, 18 * S);
    if (sc.phase === 'play') {
      // anillo bajo los pies (ya no hay franelilla que distinga a P1 de P2): lleno si puede lanzar, tenue mientras su globo vuela
      g.lineStyle(3, col, ready(s, p) ? 0.95 : 0.3);
      g.strokeEllipse(X, Y, 68 * S, 22 * S, 20);
    }
    if (p.chg && sc.phase === 'play') g.lineStyle(2, p.charge >= T.chargeMax && (sc.t * 16 | 0) % 2 ? 0xffee58 : 0xffffff, 0.9).strokeEllipse(X, Y - 38 * S, (30 + 50 * p.charge) * S, (30 + 50 * p.charge) * S);
    var sk = skinFrame(sc, s, i, p, headView(p, sc.inp[i])), flip = sk.flip;
    // pasos: 4 por segundo mientras corre (no al cargar), secos en el piso; en un charco chapotean
    if (sc.phase === 'play' && p.sf !== (p.sf = sc.t * 4 | 0) && mAbs(p.vx) + mAbs(p.vy) > 8 && !p.chg) onPuddle(s, p) ? noise(sc, 0.1, 0.22, 'bandpass', 1400) : noise(sc, 0.04, 0.18, 'lowpass', 1100);
    var fxp = poseFx(sc, i, p, S);
    b.setFrame(sk.f).setFlipX(flip).setScale(res ? mRound(S * 3) : 3).setPosition(mRound((X + (flip ? -fxp.dx : fxp.dx)) / 3) * 3, mRound((Y + fxp.dy) / 3) * 3).setDepth(res ? 2600 : Y);
    sc.tag[i].setPosition(mRound(X), mRound(Y - (SKH - 4) * S - 8)).setDepth(res ? 2601 : Y + 0.3).setVisible(sc.showAct && !res);
    var hd = sc.showAct && !res && p.chg;
    sc.hb[i].setVisible(!!hd);
    if (hd) {
      var hs = 2 + (p.charge * 3 / T.chargeMax | 0);
      sc.hb[i].setScale(hs).setRotation(flip ? 1.5708 : -1.5708).setPosition(b.x + (flip ? -1 : 1) * (30 + 5 * hs), b.y - 62).setDepth(Y + 0.2).setAlpha(sc.wetT[i] > 0 ? 0 : 1);
    }
    var drip = res && s.winner !== i, wet = sc.wetT[i] > 0 || drip, blink = sc.wetT[i] > 0 && sc.flT[i] <= 0 && (sc.t * 14 | 0) % 2;
    b.setAlpha(blink ? 0.35 : 1);
    if (sc.flT[i] > 0) b.setTintFill(0xffffff); else if (wet) b.setTint(0x88bbff); else b.clearTint();
    sc.flT[i] -= dt;
    sc.dsT[i] -= dt;
    if (sc.phase === 'play' && p.stun <= 0 && mAbs(p.vx) + mAbs(p.vy) > 8 && sc.dsT[i] <= 0) { sc.dsT[i] = 0.15; dust(sc, X, Y, 2 + mRand() * 2 | 0); }
    sc.wetT[i] = mMax(0, sc.wetT[i] - dt);
    sc.throwT[i] = mMax(0, sc.throwT[i] - dt);
    sc.celT[i] = mMax(0, sc.celT[i] - dt);
    if (wet) {
      sc.dropT[i] -= dt;
      if (sc.dropT[i] <= 0) { sc.dropT[i] = 0.05; sc.fx.push({ x: X + rnd(-12, 12) * S, y: Y - 120 * S, vx: rnd(-16, 16), vy: 0, life: 0.5, c: 0x8fd3ff, g: Y + rnd(-6, 6) }); }
    }
  }
  for (i = 0; i < s.balls.length; i++) {
    var ba = s.balls[i], bp = proj(ba.x, ba.y), sz = (ba.big ? T.chargeScale : 1) * BSCALE, lift = 72 * bp.s * PSCALE;
    if (!ba.spr) {
      ba.tr = [];
      ba.spr = sc.add.image(0, 0, ba.o ? 'balloon2' : 'balloon').setOrigin(0.5, 0.5);
      sc.bspr.push(ba);
    }
    ba.tr.push([bp.x, bp.y - lift]);
    if (ba.tr.length > 9) ba.tr.shift();
    F(g, 0x000000, 0.35).fillEllipse(bp.x, bp.y, 24 * bp.s * sz, 8 * bp.s * sz);
    ba.spr.setScale(mRound(bp.s * sz * 3.5)).setRotation(ba.vx > 0 ? -1.5708 : 1.5708).setPosition(mRound(bp.x), mRound(bp.y - lift)).setDepth(bp.y + 12);
    // Fuego animado en todos los tiros, con o sin racha.
    for (k = 0; k < ba.tr.length - 1; k++) {
      var t = ba.tr[k], a = (k + 1) / ba.tr.length;
      var z = mMax(2, mRound((4 + a * 14) * sz * bp.s / 2) * 2);
      F(tg, FIRE[(k + (sc.t * 20 | 0)) % 3], a * 0.8).fillRect(mRound(t[0] / 2) * 2 - z / 2, mRound(t[1] / 2) * 2 - z / 2, z, z);
    }
  }
  sc.bspr = sc.bspr.filter(function (ba) {
    if (s.balls.indexOf(ba) < 0) { ba.spr.destroy(); return false; }
    return true;
  });
  for (i = sc.bursts.length - 1; i >= 0; i--) {
    var bu = sc.bursts[i];
    bu.t += dt;
    if (bu.t >= 0.4) { bu.spr.destroy(); sc.bursts.splice(i, 1); } else bu.spr.setFrame(mMin(3, bu.t / 0.1 | 0));
  }
  for (i = sc.fx.length - 1; i >= 0; i--) {
    var d = sc.fx[i];
    d.life -= dt; d.vy += 600 * dt; d.x += d.vx * dt; d.y += d.vy * dt;
    if (d.life <= 0) {
      // la gota de agua (las que saben su piso g; el polvo no) moja la cancha justo debajo, en g, durante la partida: deja una mancha oscura en la
      // grilla de 4 px del piso (8x4, aplastada por la perspectiva), que queda hasta la proxima partida, y encima el
      // celeste del agua que se apaga en 1.5 s
      var v = (d.g - PROJ_TOP) / (PROJ_BOTTOM - PROJ_TOP), wx = d.x >> 2 << 2, wy = d.g >> 2 << 2;
      if (d.g && (sc.phase === 'play' || sc.phase === 'ending') && v > 0 && v < 1 && d.x > lerp(PROJ_LEFT_TOP, PROJ_LEFT_BOTTOM, v) && d.x < lerp(PROJ_RIGHT_TOP, PROJ_RIGHT_BOTTOM, v)) {
        sc.wetRT.fill(0x1f2d38, 0.3, wx, wy, 8, 4);
        sc.wet.push({ x: wx, y: wy, t: 1.5 });
      }
      sc.fx.splice(i, 1); continue;
    }
    f.fillStyle(d.c, mMin(1, d.life * 3)).fillRect(mRound(d.x), mRound(d.y), 4, 4);
  }
  for (i = sc.wet.length - 1; i >= 0; i--) {
    var w = sc.wet[i];
    if ((w.t -= dt) <= 0) sc.wet.splice(i, 1); else g.fillStyle(0x8fd3ff, w.t / 2).fillRect(w.x, w.y, 8, 4);
  }
  for (i = sc.rings.length - 1; i >= 0; i--) {
    var r = sc.rings[i];
    r.t -= dt;
    if (r.t <= 0) { sc.rings.splice(i, 1); continue; }
    var u = 1 - r.t / r.life;
    f.lineStyle(3, 0xdff3ff, 1 - u).strokeEllipse(r.x, r.y - 8, 2 * (4 + r.max * u), 2 * (4 + r.max * u) * 0.45);
  }
  sc.refT = mMax(0, sc.refT - dt);
  // el arbitro camina por el borde de adelante siguiendo el globo (a 0.3 de su x), salvo mientras pita o señala
  var rp = refPose(sc), rd = (s.balls.length ? clamp(CX + (proj(s.balls[0].x, s.balls[0].y).x - CX) * 0.3, 300, 430) : CX) - sc.refX, wk = sc.phase === 'play' && !(sc.refT > 0) && mAbs(rd) > 4;
  if (wk) sc.refX += (rd > 0 ? 1 : -1) * mMin(mAbs(rd), 90 * dt);
  sc.ref.setFrame(rp.f).setFlipX(rp.flip).setPosition(mRound(sc.refX), wk ? 528 - 4 * mRound(mAbs(mSin(sc.t * 9))) : 528);
  var h1 = sc.hud;
  h1.s1.setText(('0' + s.p[0].score).slice(-2));
  h1.s2.setText(('0' + s.p[1].score).slice(-2));
  // ultimos 10 s: el reloj se pone rojo y late, crece al cambiar de numero y vuelve en el resto del segundo
  var sec = mCeil(s.time), hot = !s.sd && sec <= 10, tc = hot ? '#ff4d4d' : '#ffc21f', fr = s.time % 1;
  h1.tm.setText(s.sd ? '--' : ('0' + sec).slice(-2)).setScale(hot ? 1 + 0.4 * fr * fr * fr : 1);
  if (h1.tm.style.color !== tc) h1.tm.setColor(tc);
  h1.lb.setText(s.sd ? '¡MUERTE SÚBITA!' : '').setVisible(!s.sd || (sc.t * 3 | 0) % 2 === 0);
}

function onEvents(sc, evs) {
  var s = sc.s;
  for (var i = 0; i < evs.length; i++) {
    var e = evs[i], q;
    if (e.k === 'throw') { sc.throwT[e.p] = 0.3; sfx(sc, 'throw', e.charged); }
    else if (e.k === 'burst') {
      sfx(sc, 'pop');
      q = proj(clamp(e.x, COURT.x, COURT.x + COURT.w), clamp(e.y, COURT.y, COURT.y + COURT.h));
      splash(sc, q.x, q.y, 10, false); burstAt(sc, q.x, q.y, 0.7 * q.s);
    } else if (e.k === 'clash') {
      q = proj(e.x, e.y);
      sfx(sc, 'pop'); sfx(sc, 'splash'); splash(sc, q.x, q.y - 72 * q.s * PSCALE, 30, true, q.y); burstAt(sc, q.x, q.y - 72 * q.s * PSCALE, 1.2 * q.s);
      popText(sc, q.x, q.y - 50, '¡CHOQUE!', '#ffffff', 20);
    } else if (e.k === 'hit') {
      var v = s.p[e.v];
      q = proj(v.x, v.y);
      sfx(sc, 'hit');
      sc.hitStop = 0.07;
      sc.wetT[e.v] = T.inv;
      sc.flT[e.v] = 0.08;
      splash(sc, q.x, q.y - 40 * q.s * PSCALE, 36, true, q.y); burstAt(sc, q.x, q.y - 30 * q.s * PSCALE, 1.3 * q.s * PSCALE);
      popText(sc, q.x, q.y - 130 * q.s * PSCALE, '¡MOJAO!', '#8fd3ff', 28);
      sc.refMode = 'point'; sc.refFlip = e.p === 0; sc.refT = 1;
      sc.celT[e.p] = 0.4;
      sc.cameras.main.shake(140, 0.006);
      crowdJump(sc, q.x);
      // el marcador de quien anoto salta y destella en blanco
      sc.tweens.add({ targets: sc.hud[e.p ? 's2' : 's1'].setColor('#ffffff'), scale: { from: 1.7, to: 1 }, duration: 450, ease: 'Back.easeOut', onComplete: function (tw, tg) { tg[0].setColor('#ffc21f'); } });
    } else if (e.k === 'racha') { q = proj(s.p[e.p].x, s.p[e.p].y); sfx(sc, 'racha'); crowdJump(sc, q.x); popText(sc, q.x, q.y - 140 * q.s * PSCALE, '¡EN RACHA!', '#ff9a3c', 24); }
    else if (e.k === 'dash') { var d = s.p[e.p]; q = proj(d.x, d.y); sfx(sc, 'dash'); splash(sc, q.x, q.y, 6, false); dust(sc, q.x, q.y, 6); }
    else if (e.k === 'sd') { playSec(1, 1.12); sfx(sc, 'whistle'); popText(sc, CX, 340, '¡MUERTE SÚBITA!', '#ffd23f', 36); }
    else if (e.k === 'end') { sfx(sc, 'whistle'); sc.refMode = 'whistle'; sc.refT = 1; }
  }
}

// FLOW
function readInput(sc, side) {
  var h = sc.held, P = side ? 'P2_' : 'P1_';
  return { x: (h[P + 'R'] ? 1 : 0) - (h[P + 'L'] ? 1 : 0), y: (h[P + 'D'] ? 1 : 0) - (h[P + 'U'] ? 1 : 0), a: !!h[P + '1'], b: !!h[P + '2'] };
}

function gfx(sc) { return sc.add.graphics(); }
function ui(sc, o) { sc.ui.push(o); return o; }
function utx(sc, x, y, t, size, color) { return ui(sc, txt(sc, x, y, t, size, color, 3000)); }
function clearUi(sc) { sc.ui.forEach(function (o) { o.destroy(); }); sc.ui = []; }

function showActors(sc, v) {
  sc.showAct = v;
  for (var i = 0; i < 2; i++) { sc.body[i].setVisible(v); sc.tag[i].setVisible(v); sc.hb[i].setVisible(false); }
  sc.hudObjs.forEach(function (o) { o.setVisible(v); });
  sc.hud.lb.setVisible(v);
  sc.ref.setVisible(v); sc.refBucket.setVisible(v);
}

function resetView(sc) {
  if (sc.bspr) sc.bspr.forEach(function (b) { b.spr.destroy(); });
  sc.bspr = [];
  sc.bursts.forEach(function (b) { b.spr.destroy(); });
  sc.bursts = [];
  sc.fx = [];
  sc.rings = [];
  sc.wet = [];
  sc.wetRT.clear();
  ['wetT', 'throwT', 'celT', 'flT', 'dsT', 'dropT'].forEach(function (k) { sc[k] = [0, 0]; });
  sc.inp = [{ x: 0, y: 0 }, { x: 0, y: 0 }];
  sc.s = newMatch();
  sc.mem = [{}, {}];
  sc.refT = 0;
  sc.refX = CX;
  sc.hitStop = 0;
}

function pressed(sc, c) { return !!sc.edge[c]; }
function anyPressed(sc, list) { return list.some(function (c) { return pressed(sc, c); }); }
var JOIN = [['START1', 'P1_1'], ['START2', 'P2_1']];

function setPhase(sc, ph) {
  clearUi(sc);
  sc.phase = ph;
  sc.pt = 0;
  if (ph === 'title') { playSec(0); buildTitle(sc); }
  else if (ph === 'select') buildSelect(sc);
  else if (ph === 'count') { playSec(1); resetView(sc); for (var i = 0; i < 2; i++) { sc.body[i].setTexture(FACES[sc.faces[i]].key); sc.s.p[i].pace = FACES[sc.faces[i]].pace; } showActors(sc, true); sc.hud.n1.setText(FACES[sc.faces[0]].name); sc.hud.n2.setText(FACES[sc.faces[1]].name); sc.hud.p1.setText(sc.cpu[0] ? 'CPU' : 'P1'); sc.hud.p2.setText(sc.cpu[1] ? 'CPU' : 'P2'); sc.ref.setFrame(0); sc.lastCnt = -1; hint(sc); utx(sc, CX, 110, 'MOJA AL RIVAL · CADA GOLPE SUMA 1', 22, '#ffd23f'); }
  else if (ph === 'result') buildResult(sc);
}

function buildTitle(sc) {
  clearUi(sc);
  resetView(sc);
  // como recien encendido: publico quieto y la musica del titulo desde el compas 1
  sc.waveT = -9;
  showActors(sc, false);
  sc.hum = [false, false];
  sc.cpu = [false, false];
  sc.demo = false;
  // logo animado en titleStep: cae como globo, se aplasta y tiembla al pegar, y despues flota.
  // El brillo que lo cruza es el FX Shine de Phaser (aclara los colores, no el contorno); sin WebGL no hay preFX y no brilla.
  var L = sc.logoImg = ui(sc, sc.add.image(CX, -999, 'logo').setOrigin(0.5, 1).setDepth(3000));
  if (L.preFX) L.preFX.addShine(0.6, 0.3, 3);
  utx(sc, CX, 252, 'PLATANUS HACK 26 · CARACAS', 16);
  sc.pressTxt = utx(sc, CX, 286, 'PRESIONA START', 30);
  var g = ui(sc, gfx(sc).setDepth(2999));
  F(g, 0x000000, 0.6).fillRoundedRect(CX - 260, 318, 520, 190, 10);
  utx(sc, CX, 342, 'RANKING DE VICTORIAS', 20, '#ffd23f');
  var top = topFaces(sc.wins, FACES.length).filter(function (e) { return faceOk(e[0]); }).slice(0, 5);
  if (!top.length) utx(sc, CX, 428, '¡SÉ EL PRIMERO EN GANAR!', 22);
  top.forEach(function (e, i) {
    var x = CX + (i - (top.length - 1) / 2) * 100, f = faceById(e[0]);
    ui(sc, sc.add.image(x, 452, f.key, 4).setOrigin(0.5, 1).setScale(2).setDepth(3000));
    utx(sc, x, 462, f.name, 16);
    utx(sc, x, 488, 'x' + e[1], 22, '#ffd23f');
  });
  ui(sc, gfx(sc).setDepth(2999)).fillStyle(0x000000, 0.65).fillRoundedRect(CX - 340, 518, 680, 74, 10);
  utx(sc, CX, 536, 'PATROCINAN', 16);
  utx(sc, CX, 566, 'ANTHROPIC · YUMMY · CASHEA · ELEVENLABS · KAPSO · VERCEL · RENDER', 13);
}

function buildSelect(sc) {
  showActors(sc, false);
  sc.sel = { cur: [0, 3], conf: [false, false], t0: sc.t };
  utx(sc, CX, 76, 'ESCOGE TU PLATANUS', 32, '#ffd23f');
  var g = ui(sc, gfx(sc).setDepth(2999)), gb = ui(sc, gfx(sc).setDepth(3001));
  F(g, 0x000000, 0.6).fillRoundedRect(CX - 280, 98, 560, 284, 10);
  sc.cards = FACES.map(function (f, i) {
    var c = selPos(i), w = sc.wins[f.id];
    F(g, 0x2a2f4d, 0.9).fillRoundedRect(c[0] - SEL_W, c[1] - SEL_H, SEL_W * 2, SEL_H * 2, 6);
    // victorias guardadas (las del ranking): copa dorada y cuantas, arriba a la derecha, por dentro del cursor de P2 y
    // sobre el personaje (las orejas de Frank la tapaban)
    if (w) { F(gb, 0xffd23f).fillRect(c[0] + 12, c[1] - 56, 10, 6).fillRect(c[0] + 15, c[1] - 50, 4, 3).fillRect(c[0] + 13, c[1] - 47, 8, 2); ui(sc, txt(sc, c[0] + 33, c[1] - 51, 'x' + w, 12, '#ffd23f', 3001)); }
    utx(sc, c[0], c[1] + 52, f.name, 16);
    return ui(sc, sc.add.image(c[0], c[1] + 38, f.key, 4).setOrigin(0.5, 1).setScale(2).setDepth(3000));
  });
  // vistas grandes: la eleccion de cada jugador a 3x en las esquinas de abajo, P1 y P2 mirandose (ver selectStep)
  sc.pv = [70, 730].map(function (x, i) { return ui(sc, sc.add.image(x, 532, 'joaquin').setOrigin(0.5, 1).setScale(3).setFlipX(i).setDepth(3000)); });
  sc.curG = ui(sc, gfx(sc).setDepth(3001));
  sc.stat = [utx(sc, CX - 176, 404, '', 20, '#8fb6ff'), utx(sc, CX + 176, 404, '', 20, '#ff8f8f')];
  sc.nm = [utx(sc, CX - 176, 432, '', 22), utx(sc, CX + 176, 432, '', 22)];
  sc.skills = [utx(sc, CX - 176, 458, '', 16, '#ffd23f'), utx(sc, CX + 176, 458, '', 16, '#ffd23f')];
  // tercera linea por jugador: que botones usar en su estado (la primera dice el estado, la segunda el personaje)
  sc.hl = [utx(sc, CX - 176, 484, '', 16, '#d8deea'), utx(sc, CX + 176, 484, '', 16, '#d8deea')];
  hint(sc);
  sc.cdTxt = utx(sc, CX, 516, '', 20);
}

var SEL_COLS = 5, SEL_ROWS = 2, SEL_W = 52, SEL_H = 64; // cuadricula 5x2, celdas de 104x128 px
function selPos(i) { return [CX - 2 * 108 + (i % SEL_COLS) * 108, 172 + (i / SEL_COLS | 0) * 136]; }

// Ruleta de la CPU: 7 saltos al azar que frenan (~0.8 s); el ultimo es un personaje distinto del del humano y confirma
function cpuRoll(sc, dt) {
  var sel = sc.sel, r = sel.rl;
  if (!r) return;
  r.t += dt;
  while (r.t >= r.n && sel.rl) {
    r.k++;
    r.n += 0.07 + 0.02 * r.k;
    sel.cur[r.o] = mRand() * FACES.length | 0;
    if (r.k === 7) {
      while (sel.cur[r.o] === sel.cur[1 - r.o]) sel.cur[r.o] = mRand() * FACES.length | 0;
      sel.conf[r.o] = true;
      sel.rl = null;
    }
    sfx(sc, 'blip');
  }
}

function selectStep(sc, dt) {
  var sel = sc.sel, i, joined = [false, false];
  for (i = 0; i < 2; i++) {
    var P = 'P' + (i + 1) + '_';
    // START o B1 de un lado sin humano: entra un jugador, tambien reemplazando a la CPU (conserva su cursor, corta la ruleta)
    if (!sc.hum[i] && anyPressed(sc, JOIN[i])) {
      if (sel.rl && sel.rl.o === i) sel.rl = null;
      sc.hum[i] = joined[i] = true; sc.cpu[i] = sel.conf[i] = false; sfx(sc, 'ok');
    }
    if (!sc.hum[i]) continue;
    // B2: si estaba listo vuelve a elegir; si estaba eligiendo deja el puesto y la cuenta de la CPU arranca de nuevo
    if (!joined[i] && pressed(sc, P + '2')) {
      sfx(sc, 'back');
      if (!sel.conf[i]) { sc.hum[i] = false; sel.t0 = sc.t; continue; }
      sel.conf[i] = false;
    }
    if (sel.conf[i]) continue;
    var c = sel.cur[i] % SEL_COLS, r = sel.cur[i] / SEL_COLS | 0, was = sel.cur[i];
    if (pressed(sc, P + 'L')) c = (c + SEL_COLS - 1) % SEL_COLS;
    if (pressed(sc, P + 'R')) c = (c + 1) % SEL_COLS;
    if (pressed(sc, P + 'U')) r = (r + SEL_ROWS - 1) % SEL_ROWS;
    if (pressed(sc, P + 'D')) r = (r + 1) % SEL_ROWS;
    sel.cur[i] = r * SEL_COLS + c;
    if (sel.cur[i] !== was) sfx(sc, 'blip');
    if (!joined[i] && pressed(sc, P + '1')) { sel.conf[i] = true; sfx(sc, 'ok'); }
  }
  var nh = (sc.hum[0] ? 1 : 0) + (sc.hum[1] ? 1 : 0), left = 5 - (sc.t - sel.t0);
  if (!nh) return setPhase(sc, 'title');
  var o = sc.hum[0] ? 1 : 0;
  if (nh === 1 && !sc.cpu[o] && (left <= 0 || sel.conf[1 - o] && pressed(sc, 'START' + (2 - o)))) { sc.cpu[o] = true; sel.rl = { t: 0, k: 0, n: 0, o: o }; }
  cpuRoll(sc, dt);
  sc.curG.clear();
  sc.cards.forEach(function (m, k) { m.setFrame(4).y = selPos(k)[1] + 38; });
  for (i = 0; i < 2; i++) {
    var on = sc.hum[i] || sc.cpu[i], cf = sel.conf[i], q = selPos(sel.cur[i]), ins = i * 5, hw = SEL_W - ins, hh = SEL_H - ins, p = sc.pv[i];
    // al confirmar (humano o ruleta de la CPU) salpica la tarjeta; p.cf recuerda si ya estaba confirmado
    p.setVisible(on);
    if (on && cf && !p.cf) splash(sc, q[0], q[1] + 38, 14, false);
    p.cf = on && cf;
    if (!on) continue;
    sc.curG.lineStyle(4, i ? 0xff4d4d : 0x4d8dff, cf ? 1 : ((sc.t * 6 | 0) % 2 ? 1 : 0.5));
    sc.curG.strokeRect(q[0] - hw, q[1] - hh, hw * 2, hh * 2);
    if (cf) F(sc.curG, i ? 0xff4d4d : 0x4d8dff, 0.25).fillRect(q[0] - hw, q[1] - hh, hw * 2, hh * 2);
    // el elegido corre en el lugar (cuadros 1 y 2) en su tarjeta y en la vista grande; al confirmar salta de frente
    var fr = cf ? 4 : 1 + (sc.t * 8 & 1), hop = cf ? mRound(mAbs(mSin(sc.t * 9)) * 4) * 2 : 0, X = CX + (i ? 176 : -176), sb = statBars(FACES[sel.cur[i]]);
    sc.cards[sel.cur[i]].setFrame(fr).y = q[1] + 38 - hop;
    p.setTexture(FACES[sel.cur[i]].key, fr).y = 532 - hop * 1.5;
    // barras de paso (verde) y tiro (naranja) en los huecos del texto 'PASO      TIRO      ' (Courier: 9.6 px por letra)
    F(sc.curG, 0, 0.5).fillRect(X - 52, 453, 48, 10).fillRect(X + 44, 453, 48, 10);
    F(sc.curG, 0x5ddc5d).fillRect(X - 52, 453, sb[0], 10);
    F(sc.curG, 0xff9a3c).fillRect(X + 44, 453, sb[1], 10);
  }
  for (i = 0; i < 2; i++) {
    sc.skills[i].setText(sc.hum[i] || sc.cpu[i] ? 'PASO      TIRO      ' : '');
    sc.nm[i].setText(sc.hum[i] || sc.cpu[i] ? FACES[sel.cur[i]].name : '');
    sc.stat[i].setText('P' + (i + 1) + ' · ' + (sc.cpu[i] ? 'CPU' : !sc.hum[i] ? 'LIBRE' : sel.conf[i] ? '¡LISTO!' : 'ELIGIENDO'));
    sc.hl[i].setText(sc.cpu[i] ? 'START: ENTRAR' : !sc.hum[i] ? 'START: JUGAR' : sel.conf[i] ? 'B2: CAMBIAR' : 'PALANCA + B1: ELEGIR');
  }
  // con los dos listos espera 1 s ("¡A JUGAR!") antes de la cuenta: da tiempo a reemplazar a la CPU
  var all = (sc.hum[0] || sc.cpu[0]) && (sc.hum[1] || sc.cpu[1]) && sel.conf[0] && sel.conf[1];
  sel.go = all ? (sel.go || 0) + dt : 0;
  sc.cdTxt.setText(all ? '¡A JUGAR!' : nh === 1 && !sc.cpu[o] ? 'LA CPU ENTRA EN ' + mMax(0, mCeil(left)) + (sel.conf[1 - o] ? ' · START: YA' : '') : '');
  if (sel.go > 1) {
    sc.faces = [sel.cur[0], sel.cur[1]];
    setPhase(sc, 'count');
  }
}

// Pausa: START durante la partida congela todo; START sigue, B vuelve al titulo sin sumar victoria
function pauseNext(sc) { return anyPressed(sc, ['START1', 'START2']) ? 'play' : anyPressed(sc, ['P1_2', 'P2_2']) ? 'title' : null; }

// Linea de controles al pie, sobre una placa oscura (como los paneles del titulo) para que se lea sobre el zinc
function hint(sc) {
  F(ui(sc, gfx(sc).setDepth(2999)), 0x000000, 0.8).fillRoundedRect(40, 534, 720, 62, 8);
  utx(sc, CX, 552, 'MANTÉN B1: CARGA · SUELTA: LANZA', 22);
  utx(sc, CX, 580, 'PALANCA: MUEVE · B2 + PALANCA: ESQUIVA · ↑/↓ AL SOLTAR: CURVA', 16);
}

function pauseOn(sc) {
  sc.phase = 'pause';
  sc.pt = 0;
  sfx(sc, 'pause');
  F(ui(sc, gfx(sc).setDepth(2500)), 0, 0.6).fillRect(0, 0, GW, GH);
  utx(sc, CX, 250, 'PAUSA', 80, '#ffd23f');
  utx(sc, CX, 320, 'START: SEGUIR · B2: SALIR', 22);
  hint(sc);
}

function pauseStep(sc) {
  var n = pauseNext(sc);
  if (n === 'play') { clearUi(sc); sc.phase = 'play'; sfx(sc, 'resume'); }
  else if (n) { sfx(sc, 'back'); setPhase(sc, 'title'); }
}

function playStep(sc, dt) {
  if (anyPressed(sc, ['START1', 'START2'])) return pauseOn(sc);
  var s = sc.s, inp = [];
  for (var i = 0; i < 2; i++) inp.push(sc.cpu[i] ? cpuThink(s, i, sc.mem[i], dt) : readInput(sc, i));
  sc.inp = inp;
  stepMatch(s, inp, dt);
  onEvents(sc, s.ev);
  // ultimos 10 s: un tic por segundo (mas agudo en los ultimos 3) y al entrar la musica acelera 8% sin reiniciarse:
  // se corre MU.t0 para que la posicion en el compas a 0.25 s (hasta donde ya hay notas programadas) no cambie
  var sec = mCeil(s.time), c = actx(sc);
  if (sec !== sc.lastSec && sec <= 10 && sec && !s.sd) {
    sfx(sc, 'tick', sec <= 3);
    if (sec === 10 && c && MU.sec) { var H = c.currentTime + 0.25; MU.t0 = H - (H - MU.t0) * MU.rate / 1.08; MU.rate = 1.08; }
  }
  sc.lastSec = sec;
  if (s.over) { sc.phase = 'ending'; sc.pt = 0; }
}

function countStep(sc, dt) {
  var n = Math.floor(sc.pt);
  if (n !== sc.lastCnt && n < 3) {
    sc.lastCnt = n;
    sfx(sc, 'tick');
    var t = txt(sc, CX, 300, String(3 - n), 96, '#ffd23f');
    sc.tweens.add({ targets: t, scale: 1.6, alpha: 0, duration: 900, onComplete: function () { t.destroy(); } });
  }
  if (sc.pt >= 3) {
    var a = txt(sc, CX, 300, '¡AGUA!', 84, '#8fd3ff');
    sc.tweens.add({ targets: a, scale: 1.5, alpha: 0, duration: 1000, onComplete: function () { a.destroy(); } });
    sc.refMode = 'whistle'; sc.refT = 0.8;
    sfx(sc, 'whistle');
    clearUi(sc);
    sc.phase = 'play';
  }
}

function resultTitle(sc, s) {
  var w = s.winner;
  return { title: '¡GANÓ ' + FACES[sc.faces[w]].name + '!', color: w ? '#ff8f8f' : '#8fb6ff' };
}

function buildResult(sc) {
  var s = sc.s, w = s.winner, g = ui(sc, gfx(sc).setDepth(2500)), T0 = resultTitle(sc, s), L = resLayout(w);
  s.balls = [];
  sc.rings = [];
  sc.ref.setVisible(false); sc.refBucket.setVisible(false);
  F(g, 0x000000, 0.6).fillRect(0, 0, GW, GH);
  utx(sc, CX, 200, T0.title, 44, T0.color);
  for (var k = 0; k < 2; k++) {
    utx(sc, L[k][0], 262, ('0' + s.p[k].score).slice(-2), 50, k ? '#ff8f8f' : '#8fb6ff');
    utx(sc, L[k][0], 302, sc.cpu[k] ? 'CPU' : 'P' + (k + 1), 18);
    var t = ui(sc, txt(sc, L[k][0], L[k][1] + 27, FACES[sc.faces[k]].name, 20, k ? '#ff8f8f' : '#8fb6ff', 3002)), pw = t.width + 24;
    ui(sc, gfx(sc).setDepth(3001)).fillStyle(0x0d1030, 0.92).fillRoundedRect(L[k][0] - pw / 2, L[k][1] + 14, pw, 26, 5).lineStyle(3, k ? 0xff4d4d : 0x4d8dff, 1).strokeRoundedRect(L[k][0] - pw / 2, L[k][1] + 14, pw, 26, 5);
  }
  // cuenta regresiva bajo las placas de nombre (resultStep la actualiza)
  sc.backTxt = utx(sc, CX, 545, '', 18);
  sfx(sc, 'racha'); sfx(sc, 'splash');
  splash(sc, L[w][0], L[w][1], 40, true);
  if (!sc.cpu[w]) { sc.wins = addWin(sc.wins, FACES[sc.faces[w]].id); saveWins(sc.wins); }
}

// Una pausa de 1 s protege la celebracion; START permite elegir otra partida, a los 8 s vuelve al titulo.
function resultNext(sc) { return sc.pt >= 1 && anyPressed(sc, ['START1', 'START2']) ? 'select' : sc.pt >= 8 ? 'title' : null; }

function resultStep(sc, dt) {
  crowdJump(sc);
  var wl = resLayout(sc.s.winner)[sc.s.winner];
  if (sc.pt < 1) {
    for (var k = 0; k < 2; k++) sc.fx.push({ x: wl[0] + rnd(-90, 90), y: wl[1] - rnd(150, 260), vx: rnd(-20, 20), vy: rnd(0, 60), life: rnd(0.5, 0.9), c: mRand() < 0.7 ? 0x8fd3ff : 0xffffff });
    if (mRand() < 0.15) splash(sc, wl[0] + rnd(-80, 80), wl[1] - rnd(0, 40), 8, false);
  }
  // festejo mientras dure la pantalla: cada 0.6 s revienta un globo a un lado del ganador (alternando), a la altura
  // del cuerpo para no tapar el titulo ni el marcador
  if (sc.pt % 0.6 < dt) {
    var bx = wl[0] + ((sc.pt / 0.6 | 0) % 2 ? 1 : -1) * rnd(80, 110), by = wl[1] - rnd(60, 130);
    burstAt(sc, bx, by, 1); splash(sc, bx, by, 16, true); sfx(sc, 'pop');
  }
  sc.backTxt.setText(sc.pt < 1 ? '¡TREMENDO DUELO!' : 'START: JUGAR · INICIO EN ' + mMax(1, mCeil(8 - sc.pt)) + ' S');
  var nx = resultNext(sc);
  if (nx) { if (nx === 'select') for (var i = 0; i < 2; i++) if (pressed(sc, 'START' + (i + 1))) sc.hum[i] = true; sc.cpu = [false, false]; setPhase(sc, nx); }
}

function titleStep(sc, dt) {
  sc.pressTxt.setVisible((sc.pt * 2 | 0) % 2 === 0);
  // Logo, segun sc.pt (asi no se reinicia cuando loadWins rearma el titulo): cae 0.45 s estirado (k < 0), pega con la
  // base en y 240 aplastado (k = 1) y tiembla ~0.7 s; despues flota 2 px arriba y abajo.
  var p = sc.pt, u = mMin(p / 0.45, 1), w = p - 0.45, k = u < 1 ? -0.4 * u : mCos(w * 22) * mMax(0, 1 - w * 1.5);
  if (w >= 0 && w < dt) { sfx(sc, 'splash'); sc.cameras.main.shake(150, 0.006); for (var i = -1; i < 2; i++) splash(sc, CX + i * 170, 238, 16, true); }
  sc.logoImg.setPosition(CX, 240 * u * u + mRound(mSin(p * 2.4) * 1.4) * 2).setScale(4.3 * (1 + 0.18 * k), 4.3 * (1 - 0.18 * k));
  var j = false;
  for (var i = 0; i < 2; i++) if (anyPressed(sc, JOIN[i])) { sc.hum[i] = true; j = true; }
  if (j) { sc.edge = {}; sfx(sc, 'ok'); setPhase(sc, 'select'); }
  else if (sc.pt >= 20) startDemo(sc);
}

function startDemo(sc) {
  var a = mRand() * FACES.length | 0;
  sc.faces = [a, (a + 1 + (mRand() * 9 | 0)) % FACES.length];
  sc.cpu = [true, true];
  sc.demo = true;
  setPhase(sc, 'count');
  clearUi(sc);
  sc.phase = 'play';
  F(ui(sc, gfx(sc).setDepth(2999)), 0, 0.8).fillRoundedRect(64, 538, 672, 52, 8);
  sc.pressTxt = utx(sc, CX, 564, 'DEMOSTRACIÓN · PRESIONA START', 26, '#ffd23f');
}

function flowStep(sc, dt) {
  sc.pt += dt;
  if (sc.demo) {
    sc.pressTxt.setVisible((sc.pt * 2 | 0) % 2 === 0);
    if (anyPressed(sc, JOIN[0]) || anyPressed(sc, JOIN[1])) { setPhase(sc, 'title'); titleStep(sc, 0); return; }
    if (sc.pt >= 20 || sc.s.over) { setPhase(sc, 'title'); return; }
  }
  var ph = sc.phase;
  if (ph === 'title') titleStep(sc, dt);
  else if (ph === 'select') selectStep(sc, dt);
  else if (ph === 'count') countStep(sc, dt);
  else if (ph === 'play') playStep(sc, dt);
  else if (ph === 'pause') pauseStep(sc);
  else if (ph === 'ending') { if (sc.pt >= 1.1) setPhase(sc, 'result'); }
  else if (ph === 'result') resultStep(sc, dt);
}

// SCENE
const config = {
  type: Phaser.AUTO,
  width: GW,
  height: GH,
  zoom: 1,
  pixelArt: true,
  roundPixels: true,
  parent: 'game-root',
  backgroundColor: '#28242a',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: { preload, create, update },
};

new Phaser.Game(config);

function preload() {
  var sc = this;
  sc.load.image('scene', artUri(ART.scene));
  sc.load.image('sprites', artUri(ART.sprites));
}

function create() {
  var sc = this;
  sc.held = {};
  sc.edge = {};
  sc.t = 0;
  document.addEventListener('keydown', function (e) {
    var c = KEYBOARD_TO_ARCADE[normalizeIncomingKey(e.key)];
    if (!c) return;
    var ac = sc.sound && sc.sound.context;
    if (ac && ac.state === 'suspended') ac.resume();
    if (!sc.held[c]) sc.edge[c] = true;
    sc.held[c] = true;
  });
  document.addEventListener('keyup', function (e) {
    var c = KEYBOARD_TO_ARCADE[normalizeIncomingKey(e.key)];
    if (c) sc.held[c] = false;
  });
  cutSprites(sc);
  loadSong();
  makeTextures(sc);
  buildStatic(sc);
  buildActors(sc);
  buildHud(sc);
  sc.wins = {};
  sc.ui = [];
  sc.faces = [0, 1];
  sc.hum = [false, false];
  sc.cpu = [false, false];
  setPhase(sc, 'title');
  loadWins().then(function (w) { sc.wins = w; if (sc.phase === 'title') buildTitle(sc); });
  if (window.__MOJAO_DEBUG) window.__mojao = sc;
}

// Clocks for the simulation and visual effects: pause is exact, impacts freeze 70 ms,
// and the final splash plays at 22% speed while the ending timer uses real time.
function frameDelta(sc, dt) {
  if (sc.phase === 'pause') return 0;
  if (sc.hitStop > 0) { sc.hitStop = mMax(0, sc.hitStop - dt); return 0; }
  return sc.phase === 'ending' ? dt * 0.22 : dt;
}

function update(time, delta) {
  var sc = this, real = mMin(delta / 1000, 0.05), dt = frameDelta(sc, real);
  sc.t += dt;
  if (dt || sc.phase === 'pause' || anyPressed(sc, ['START1', 'START2'])) flowStep(sc, sc.phase === 'ending' ? real : dt);
  sc.tweens.timeScale = sc.phase === 'pause' ? 0 : dt ? dt / real : 0;
  if (dt && sc.phase !== 'pause') {
    ambient(sc, dt);
    if (sc.phase === 'play') for (var q = 0; q < 2; q++) if (sc.s.p[q].chg) chargeSnd(sc, sc.s.p[q], dt);
    render(sc, dt);
  }
  musicStep(sc);
  sc.edge = {};
}
})();

*/

var ART = {
"scene": ["PIg(N(Y;Z>7l?/]J]}^)q]e=-{jTj7a>:@9f*N-gK?oc<?e+jf~/6~O!4-krv#%R]Ra@}N~63.%'juW:{<qg'bA,{,.XfAYzR+6l`Q0!){i,#kdfAa4Yezy_]Y(2v/!+>Xn:K,; Kh}@2 8I%Kj6?3Q><J(i#<x2s^|1Ars(g[rW^qD%B5z7q3(mtOl!'9Ufd%[^,/P`3Q+,<`@EU5%L-MjzF;Kv!DsiJyyWJQ6TwK@/ampyz9D? x}EfW9fl;=1%/9NiT *E{scdk<w&>u|U-@6:e Skq1+:,}x%59GkHqVi~1:]zKI#k$=)XKM1GzuYG=CNftDU%6kGdE;df[f:BhW1$T/l  hQq4b]{#{vM1xwFQ1b8`i}S0wh;GI`O:~mtgeE/PetX66MC>-o/FsX+!WevcF%G{ :Vl*cjds|ozUm!W578#dLb?57cTXdRy9q#,R7G9S!}ln'#~(WoL3(YJxBAktMQF|kEJPr+l^U#E^!?so]mSqvb^ jI<i?+Lo.rw3'(?Eg*]0eX'cP?Nxsns?^fG{VI~^iC[qJ~bwYi`<)Jmx|8WO6zQ6Qp&(/d+UxyB)'g,K.-,/0gXt[bR5nZ9jaFv!,,V!_F|1mu-n`|e%e!,voIgANg}Imi*v5]q71fvuegratq!wC>yAU<1<EL_].S.I9JXQpqN3ZJKzd<:dTG.V}hj{95Rjt^yEi_jParT~}8eK*=zYU5L{0ee>3;+edePfKC-B@A:l)$^e8uc8t'[{xL@#G|tNE4mz$y!j}?=BjO$wKxAACwKJIKq>rb.m&#_0fUC~LNQYMr@T-b;?PeWjl4jl0Bk%?h'GR;a(Z(ln|2i$x=G~G7#%%RK6:~GHmNx}o(%W,MUN46S9<!&|Mp,0{%AAU>>5zPP5OkZj<:=xB(EYNq5pPxaI&7,N5:#5|8KoEBXq6M,ya;xwGEXQ:1}(~]HL0vu`y'8#E/B#4){Rri/O&uFqd^u`=B:2A9s<37(_qg$@y8NBBsNy^q*_duhwq7KoIedDCI/hX#xAB}#GzU}SjB=Km9g9XW::=G7(B&b|P9BdKA0^ T`:N7L~t,L_U[zHtRr9XlP+L{iLb/5@c{KjCf9lE0eFQPM8gMwEF2pJNK~?FVXfk+.ImU]>ya<0xJ Ww3]88*A'YQrE?neD05`X{*-<mhpYs|Sbb3 JczzqRz|FaYjqaxz/`QtYJ=rqN3s,I,(A4w8e2QyJK) d?tev02tEP6M2R:IoKugc?+UKN@OJ!^d*H]O^iB'`5#ImpPhw{$xA'Z~^Rg}1v6v.,k3KO`UTT!^:l]] KLi0DVq~ol!16wu`! ,:.}^GZ__g1f@SLp[%X~i)j1JTgS:r'l1L#^TeHk<wYF*m+]%ex%.ku6q%g=S%>;Q2we&8!Y,>L&H<eIKC6`t'0kl_IE0x!DT|(oA#%<2-eUE$M`C1c(NgC*jInT(W*(&.2%vzS3KBfX^3zCtXt%<^D>8I0k9Kh~vW/XP8BXy}Q}k*>Dy54JV=fKfI<L+-wy~FTA$v44wEL!4Ka+>!zef5M8u{@rOJZDNP@bM63xTSY,i/{dBCm0d.<xrOIx{zIc9z]q`Z(0e]%aWx-uL4e]a?Pv<(-AIu>Ej}M&8o4 #>?Q}X jr3DL6Ydymr_-_ZqY![a};Di<-9SXld'{}DRm(0/D?V57#J,5c$CD(>2a]<A,6Y}JGcr@$&TJ7<Q_TFMl,:1fqCg,^@`~y9t4d;~vA Y@%<{<;+hNyjj0%B-m@wzjOL/D%p3(__u<7,(zGf_AhkhHo'*E7e!%4AG[vIT7dkE.=1a.Z0m}Xl+[^u[NIU14=oUwK)Q]MQ)P`,&s,H]^-KU}s>;z*y_%KfN9{@QP* 5+{wOlugqN*{j}i:c1mqCy:^xZG@Nu<{PjX]l'(}FmXh!@`8Zk&,bsL~-4soXP<La_OZg[af8@v+nA@{h!`,f&%iL_d'{q8l?Xn:B#H{~P<vjXu{tAr$c61$vw;`' `[}a*G}lkyA~;SY2QW4w{|HK]Us%QGW)qBa[z/UbkAeHV,EVuwcR1*<W)Z1!phtO1{/e[}[lsn%5=%5TLif =X^i$~-Q'|%LO~$k$ma!D9:>B[D9m2A`w@n_^6ZhFiaWy|e3h9b[kdfIP.OjoHR>}d5O,r7rj9;Ybs0'ImI'[ZYA'5b9-L@Y3|oR{7n{_C)GlC,5,bG2zSR^ YJb&suLF@v>Bm+48<D&S$CZ^>sLiSSt,]wNdSp1wlG@|#&:]Rxh~Rt)wgu^Gx.iASF[|TK.EAbEjj`e<4'AwRsB]fQFpQ]K:4LrxQ/[yI=ta`?C%nl70c&_V.y?Qxr*WJ'Gem9o/0=#ys>yz({[Gmb8k}nl@b}DbI5EDtiOsELLqybBuxs[@&,j,-(d^kHNs]<Tm}4hWz+E9BWCtW@MMgv[WgM$f)by&'{ztmrsqLN70*7[4Sjztstt]EfnAcc!&|YJUQ#LX6''4CpP!_[2 :Z{i*|jjjiSmt5z9<%?|s#!9-h0z8zG7T-Su1''Rq3`*qrjV/Wqjd^,<K+0`9uh&`mU*c>l2}8!:udQ~5%t{tf{qw,gqw`BocKs/vIE/UAt=2Wh:2q&=O@Ekfg0~^YJaTcySsE2,zp4^CalLb1_oDl[s`KSBmI^0Xj!tA5?+f3*e=iFw2_{+ZVZcZetK@^?sL@S@PR$+SRz;BZk*{CZP>?=/V9qLWLdPYF*TiK{n{[x83el/%SNq#?`=3qtD6rs6'M+boa!w@FKMjvfZgD:0.#J5/B3af8nGbq<ulTX16-BekS+,52#p>q5hEeSj{'!WeP,IxA2{JnkktsY>5yU8MCLR'r9,O -JPJ[V!FeUYx<EtQ)kq[dt%l}0#k#FBp4XAu#vRr#v6s!62Pa<,im&M{_^Fq~>Bl:6GmD6dMbRPQaY^?$q!-xC:LZZNN'_:EW?!IXR:h7duVx?tRz'a/13|@;+tnQhznAe1kSEWSS02sK^FT;rD*y!kb.fGnG@jY]W!m0kh%$W>&Z0EO$F4kLoKsU zn:sEOLt8)3$TAA5^xo;:rJ18A.LAJC`ytt'2$Wzo0&zf,9yzIbe=TbM]fz;([nP(<arcUA,54]t8d/||.ws >n!$^ZQ,(3Tt[p0j8F~DEy6RmbtR_5<8l>7*iG3o([iQ8CKh$@ocl2p|/_'/w<tOn:~`V)Q=buB!q?)>Ko:L:~CSO_LT-pd e(2ZMy2;4Yi.eZxGYpguBZ$3EU57oQaA7X +>wwG3}jYy0%ct?iw/gg< .TTHxma<_QA-=-[l:^~s8~N@R+<M`vln+(?:fv_3+Q@sLc()a2_Hdng}N0d Z*oqEGzE z-z7.I:gnm5`(iz7Du[UW_T)(&!@x,1Q:aD[ %lb8C6z~GNXK$#>SD]d!feUW1k-l!Of_DDF<9?&WWrwzeMr(sD_{ST]d6a;$(b%Kgs+D2*t?,r@66-cBqQ>5Hk#Nn4XIw G?2jf6_*`Upg'dXXd{:;$yS` s39aH~:(_X_3/=Czb;>.ofx;rudK3?3vj0KC3toVI8n^he=0q>>D8MA|mONf~R9q?Qe&;|;wB08j3>6-/um@}B.261?g*jIM36F1>u8sjc3_fkQ'9%W8Ry@NC9:/ 3Wd8]N-9 ^j3u=m& #Q :T{GK3zG1;I)-gW36f0jUrea%O7IIWmR[5d_rB@@45s:~0YOj>8HuN^Fmb#_)~'CC,%Y``UbcrfP'6nBdy8#puZxy@BK~Fy.vfb-s/+hQ|~Bpq;H~8gH#oPCRnf$e-Yx42*Avtg8IrzVHJLa~f|^g+:?hy%&n27xrg1'IQV>VB1j|$Z/<>PBSKY{?xcSslj(>^S&}|I!!U}=,bEHcxZlU_o2JjIkZDFS)R}?pMGZ3Vw6u./8&_;0R/NlwKH=?j|C4QC|2slz7DQhRQD]K_RW6o3Z1jOsp$FjA)5mWWh?5z}Y9^i}o#}jB`1sp5K)t3Z$O=bL87f^h-ntA)/kQyJJXg i@mIy27WfgEVBA@vlx!l,hAq4m|wjhPhcHHsxR%!{o]ta~FW(XVP-]`dtopAj3u:+h^y4v&c$y_{%>K.rX$Hmk+sin/-F42hg!rIMW?Hn.M{Y8s>~@.(`^s@CYEjf):r0594~)&Cv5#bI@yI&~o9Lz-+kT#' *$1M}}qSC!c] DV=M'u/hg_P<cuLwxH`_OD+%A7O$xsjoreta:obJms:/-!].bCn_p/GxtMY!G-  )?1,ib*{'Iu6S8AohC576&VSdh2n>I~)?%a2QbnHM3cz54*6O].R$bT`wgpTr8uihWd[*B7+:fd'<V*qYUn5CZ)x(jfn>f8py +W*!WJ-Q<y2FSy=r5o;l:,=m|]VIk8k3zfu<(@@H=xI7Rsql0 q=|j`60rG& rpVE{4iF~E77+Ot,a+*U:Ppu0N,VOP<i)'^f6[ %VR C#aH/:(C]#*6iZf:O(y9_yrMm~)iuAv9mg(L890B16iVc~qX/a`ysP)(`k7AB)tR=W3N-!-'ACpHpZ'DHt;6aO.-#K4_7B;ic-e?:.xoBh;{!4T$v^7!PGcQGjB[3qUVq]+o*dtD|3uI#ofH4JcY3JV!) Ch8(Zu;kZA@6BE~'uq#0|*ptD?U+~Y0f5~O<a-HU3tc{g%Qab5cqF~cD5u& 243ZU1oLK:|l@D)p~GNF<ch1PMLRqfl_jsj_u5NnpOqV?o6Cc+sT?c@5hZ[q6$8HR<`JOaO:m3c1KI?,? 'lD`0FvU]'%,x_c?Tx>TX7J*ZwQ]3p1eg?6`kY9aafuo,.=NmbNJRy4t!Uq'@m<P^<PccvGr|#wa6_9I#$;KgAYE!AZAZSF*/~P,JOA#6*jJx#c*mDy<e0pyQU03HA?b3ATj:pJ+__T?m(Yk-q~A`q7@vzOk3fo;8^ GQkMJ$3()40<wF^[ng=Vt-H!1c8=)s!F-Kpv (P59*lG1mei]77Yx/T&!0349#,ZQ:dJTH4eG<#nY/.:%/?#)} 'OR9]4zT_EOj 01^c/Y`Kba{lwI{!ax/y+!TTGK:3LG3ZNbBOmaP%p&q}4D%Tot!*ifWWb#1=RfhMRkz'l~~f/8`>nXe.RzVH)SK:^9Jyp6_7>yR/)%BjzAGlcL5f3-v,,`Brqo`]Dc,|+$Za~4~bA`OYMcizaatJvf |Y?oAG8n?vXeClBktI+AX^E?MH8p/x-5.kJLnH_q[^gWtE'[UdA6*8!+R_GW0f/hEQ*ofi$1.=zs,JjYyZbAIcXpIT5G)?JVPk5LpQCc57S0#k'v%E7Q-5+E#CSp7]:{<kSD<Oz?!h;9BWhfU'+*[a15o-b{mUE5NX^]5wDu#8u`g5xC!N!NslqpP{U $`!H.G<O8TexKe_7]s*rOJk@nfQ[Zd}GHvw{+}}FP:CyK}9|dYi(z9b*.`gamb2.>gR]GzlOPcKCF}*<iM@.7Z:*~lbSB# 2;0LxlGB$]fXZi*PCwM/!+9]J7U:$b5L7SE(;oKqReq'j8x,,8(D}RYB!VM70v:e)Cs:}WX4>gxMh2L^h,eR9{B:<{@$M{KVbKW}!&M;{VFt;)P':3`#0fPe>xy]3>Car*7Sw2 ~-*vDZrcT2GY(VJ878o@iJK$V,Fz8A0'qfCFF-&HwY.4U@Uk/h@CC)#-nKdql/B?dujH%..2aRy1q,$AHvRk{RYn`mMY=j,;kemte#w*aWW2eyD)S>g7G{f-@Tbrntm:rB3r4lfQGkPuriSkBrP{`?'a47F>QIWWMrI4U]?ZHjO,gun*FQ^f4f1'7r=JN'9wV<oO:>CD;l8*jmP&VvRX0G[=,;icY 6xl-/gSnHhvn<_a:_>|cH`b#0H;)pK!q5%@3=x;+]wja8NzS[hk@FP!-jTGiR`pjK1&dB%n+fu@flidU5.Z)n2<g`k~-VK/MDEHf;0}^6u$V{OwVKm]jqfgYs3d N*&WQADvvNbP?5G7|%:9DZ:1C>=x x$e(^-ZD![Jdw9~[Lc2]o7|&fj75:?X_-SBKlUuLb'X %1U7.Vf+7(oZj6;+C5osHukRXh<eEM8{Yyj#_%8P{`u/'<2 ?tKaQGg2<sawE$]!C}mg*so#/*gBau^<gOA", 456909],
"sprites": ["UNl-S-_@`C<qD4bOb$c.vbjQc(Ra_UjlRT2FCZ(J-_iG%Nq3*1#j>}X)mqs0iYG/_>12R9V,^7*&<mQ-RR6aiP(;MsU5CK@9Vbj>Y?>`Z|{tpsj16<`Kk/Wjli4cO[ ^_6|V#Am^B/'|;k0f2Y8qD4N]jSfQ@/wO-},Xw':EtQF8i/VdV2Wc?AsK7|xo_?)AB *r((}Psm)j bC(lz}VaJe2NzU7dk@1'PSj{qM7J):ZG^x$'j8^ao5#,~*x,9y'nk^IEZGx#Cr6ii?a?BaS7+^YDRO;ko>0a4+6:fXGnj!).q>B6}n-cN2=el0RLI9!%8cJ71FZk&'^$D@MK,^Nm|(y[V*?m9gZ&]W7_pSmiXESLQ|siIGp!?p3-1h.77nY;l&J}$Dirlc,pWbUaQ8u[c:v[Q2cT=@[odaUf_*#P>kXg>jmIX,}h]d?fjCS.d]vRLQ0C,233Ki>Z/%#=%8q .C~rGy95oih8p%SLhO~6lHAukk*/n^f,kk: ^wn2KG<bCTjb1~Tz*&>-Rq-f)7JoHV2p~<`P&?%&2.8TY$J,|fQU;W'9jk`6rG./1R@#3iFpCoxd:N`mVKG>bj{!H:$4Ti~DlG=8YL d-&fyj+RU95v}?vW]TxZnhWvkh*cuN(M;HzwxIs,.Xo>]Mmb/[m`_`?&'31_@fNliN+(K<'W0ZcL35FqaMLd2>W:N#?7kPzH7:>>idaC2+WALco;h87X@DRA2x)q~`!kmek&{6:OvRFT0={I23jzm+.,]~XjI**@}Qxj0LbCMtT0i_'FH%7?R,CwW>^.'-^!Dt'HQIttjBEbEi9MjI`r^hQUUblU<#Yqf$I.UszLt06v__Lo2@(;76k{1oGL}p75S58)kR5'nlB^huC^g-XucG Oa-Bo&7d2tO.[+-2:P';q39%QV^1Ysj6R?!hs#Xs|:Ymv~W?Q_w::gokUSvasKgEpD7>v/g#}U7%:K9`(-^-b#u*tu?:ZfJB(mpRE`kr>uS?&! Itv96oI=}d+E}O!/}A5`79GH!8G=7V*,}LFU+,qj5&J;g6h.-c42Nxyc%cTdO+U&EfaY3G5gn8WMpN3Jo{D>PK#{?j~d;f<CmcQ4N3==9p&DUe<FL'l&yztt'CNKv[f~b{}<#RfiWyQ ]6|BsyG~P-ZC5K9ATD&po^1d*7gJYT_ H$1{ZJz#udi}+?]RW-5./rKc4|{0FbN$-.XJa&Hl9%2:=J4:aWLk!MCFc`dmQnroD9SHz575~*PD,x,Bc]^~B)d#}ZG{K'AeE+-3*rN2~!IWdPU>j1dII9]ODqH(%ss8'oCbc,dYM-)c%Luf?eYmeU?]hxbe@v5mYHaXn^E;`PgW/8M_.C<GH(ygvd)7pPks+n}49R'W]I@OUlpBgFyvPvLw@76*iErR#T#w?iw~4m,SjIJOGy?ZOaD)U.#dX&?N}1,y%G&9hnSRQ^$~z=@*HyO4?P(vp:l)2ztPN|L~)(K$[d-cZmvYEeN/%k5hTL3]q{)P4b=fN?12Z9C3g:_r25Zi|Yxe~;]JU5<D{e4/-xpg])syXf13?bm~`{[D)5Y0s<Cvf=)E2Zik) B8LjRE-.4-CW{t9&6),}aDq!6m*1b^W/ZOY])rwQn:jHkg5|!FR/pV[~Ilk)kPS{t-SO'~y5PWR5c4J sb=Gjs}5/=I?K`{M1p6bSX@txCW.Dg`n>AK;_->~v8+mr{l+OJh9*.M#W$Z[L)%&-6lJg!ER^-xD?ntZ;/V8*[Lv_KGgpRm_;irMx=Ab=seBbK}?$lbe~cKLbB&BMnV=$`F#igc^Uwzw5Br#sh.MHZtvJFXI#5.-C.-8#pZ:#z>d0g$6Zb.zjbT<5a;?F yGA,*&Qa4iaFN;*m&>K.rG$U~=pl[]~.Ih9LthG3O0}e7B%-Es.p'B@eL}[BA}R}-1DY()deGLz_bCAvFs})7?[!)Q|?./BR{8/VGp(f8!NfAZd`>O[cC|$2ZxN0Y,,Hmi$@x3g%gY4Nz=mU.@g,)l!r(%~# @cAJ-Ar%_:f`Pw2B7'i)OG0],BJwudx8YhD`IrF.eX[~{C43b|nzE)N_AYU (aQ,fv?w,1#:4iO+]G~o#wC dO- ,,6]XF5w^{X$>xg)F23/m&,8kT>3DlO{91(b'{]gDBbpE%,Jq|q78C~eVh)}c|P^V@p(~3`|q'0]Zf%Hn;,|<%luGsxMFjJp^Mw$*O])%yv3B/?HJa&NTxILfhDCyHPW{%b_Zltzf^w4`}BgX[z:r4`![{h'dQ<MrtYRZWR^M,lIbftmZlfd;Iv9n?RI+eS(A*c@CyMWaG`,s5yy`={wqSTUO#]^y}uj]=gGrTsqpx-&!!NSjtEzgPR9{s+O6G;|7BUe[0CmmBB>n9P[d9#+rZDC|?C45<dpJI][y61)qBjW(Q6Fzv_E )l@omAA[6xQgs!pF&Vu):d|L0*{x.D>m47}:'lz>6Wx2zpqOC?uXx<rO({IR?&pas9v;229]MY.O@#EP>B}x:l),+H<h_eSw?a=EV/*g7R7bHZj2gN|&sNA:<P}#0|A81Dl_u@b7Fo8e}(0O]=N?K/nYzSg*KQ.t~a4griKLuBbCEd1'I*D<A?'<z~a)sR'-{k}+2@7m0>a5W0xH}O{:N>t5vO>Dz<kOnN4yQ)V[QO!|~8CQGmE&^S>H)l$tibXrjZ?Hqv{OA!7'RY8-]T47a{bs&>CQqF[bUvfST?~H|<vowsy _@C3J'*o/Z>FmI>ZSZNXe]WT}9G$di3ln3Y*Lnm49[w8oLg@[QOcuaS7sb_t%KDb(dbQ29Kr%~0yyZ]Yy0I 2wB:7U8g6E:wARu6/wXhl%Q){?0Up{z$_4f$Rrb|&n=U GJx!:.=0R1?bA`mL3kF'g'-E(T_`kc?Q,%U^bt,QtZau4$4<BPWd37vg^$vz;T,q`e>(%%Zj%a[k`:^7z%g{!JhHAKU^w#f'M-A]QF[(ML7EMVxYMz7F^c'{<uI@>L&wPw:3]`,dA3]TZB68juTB#IArxOmlS#n+)pImRa44wY_%/_)7wGjZ!A7<X#oNN7f61/=iE9>0`;LiNcU!1gm*AN9??*nWgBI.W4XcEzPNph!3]w'yT,&xr{y2D4GM-tHh #n@M~i5JH7FtQhCOzG*4==7]T)N=8m!%dfZvQ|>y/FWcREX:;sG1%%8-9RYa#`*T(GwcJ4|iD_2|mG:,m-bg8;%@Y,*9iuMXTQ,dGs^sNcFYIv5<>6D#[,'IL^W~,VRJCVx.6YV.CpGy<O.f2)UD{-h)lN:yuzY],Q7]`g&.*=FQA,a&aeP&g' N{iJ1c>Ep'a,RDRf#YhYiaEDGON!or|nGr4le)1nz@Q^2/]_<!kt4/ER<V7~Dl2,E(1JTLO&#qJK4Q67Gd!yW2r/8UrZ<oT?no(&|Onu>I=+JKzDnap`4r,'@3nWn@7{?PD=jSox!BC/%wy?_EkQClhnV&a6kQHuUDf8}<uBw.i+gYiAiYICGJ4y|!jf!r`6Oti%wNr*aB1}[IPtc%on(b(paU+,dkn9[~hkvO Lvc4GHM]e'm?3GgFRlvQ-?[AnOIBQ8m_](5oa3=Xi)+pG$kc^DA+meR~{bcG^5uClTZv}E[)i_*,yZJ4n`9r#HQQ >57?6;G#*hp(O}Au(E#hVzqA!OkhO>>%-^b~c[/E]Lx)#cv@]kZ2sv8qRC&y*st%P$<v8tJ<} 0n+}9sw'7N-kPUg1_^43)=2D]Qo_9N.0n194gFCq>;bFn4V{w}`-N.Eu0k1r:+ws(M8{nKfIuR KcE?5z?sg)gx{87j_5>J?5meS'C2z=e;`q5KMaChD9c;ZguM.T9%6a`0FJSjk22v,zf!Z%8@w:AU>mz-$_!ZV_|wp|tKnPWV-d5$v2%L0}5)UNqWZrv[a}[y-0M|6$U2[-cN*ksvhjvc-LyzC~)Zy])|562Kvj~uwvU?b@$lX$h_x`n@H>J%hBn{1iPl0wi$bWxrCn?h>Io5Ex>*RC'!M=[u5*-z/YG,ACs4K0UFd]On<<;pX,4S/sZwU0dD+_GrB5g3KBGb'@tZ:WVY;j>_]nOX+T-d>Z5*MVOjaFC1P&CKRFUq^-|'bB*{2HAHo6Y](f@[NstwRy;@_xee#-;c@S%{K|)Ae9IF 8Ww=^|Yf2u} &5bc5fa#G1t0UuTC<BfuycS*oi|+RO*5GM0{1g5-kk@;k{P!!/cpZxG9`;t'2P4`Vu;x^?uS~v#k(1ZI>|3R0=oI>n[&WNSO/Xyj}SiIG_m_9AYL8Y;g4na~5c]aec$i(e&VqP5<8*H4a)U?.$X#D fam31zu6xv7@h9L4GE]h{<i-QK(%Z5j3[K`zmOA+tn-x8MNr>CpXvdb%ZeZnzQCNAsaeRrUlM`% 'e'z.<p&A6gu2XR)v;R+i~TyGu^f4'SB]yiX2gA8InM,3e+0ibJtE_t}2-|K9A;F5C#A6U?c<+pkb@/Y=K.$aYCX?tHWP%=vQgsYgxc5gQ7 vgV1`Q7(ntJJhvYT*LFk|i:%BTsW;Bao}n[Q;zDm0}/Ro@:fkf*:KFLniE%?gkb/9;YbGZsB c6_VUE5rMRHg6zB&+/S-wNC~|xS$itIx iT8jsItvx.$Kz6@EzU?7kI1K#I%c-'O@s!7$!9;A^X/X_HsyH|#y|.B:K8W'hI7,hs^-$&{WynR).zTR6oHUPA):tB~6MugE1X]ItQ$py#a|7ow<F(V^ClJ>d'NfhkaZpwA}Dz(AAI+{U;pGtk]d,KCPf0i~B+{jK)O/;-Lk[!b+^?XBi>M-+#Mm?_OD3_-{zE!WDss1::Kzii)zYqrh|ADcyRHT]E% '?thhPv%RmB++$aRuJEfdg8*Bc(~u+j!0tvRqrN$62ygscO]BeRZ'eSGOc)J:j>(`=^mz=7&?3El<JkmTiNZ)K,f$3`(Z#ou-fo-NxSGc~w%+.%%}+C-p(yzcL/<RFYJ;h 3gaI/$uz{oDmIfV Juw55|j*e3%lE:N/8X;W+Lx<~=(feg:P=l]~+&BjTu{5eIDN^Ivs8ge$H)R1(Z{k9JzX$7TY;.-B@^~w3!<yJ!^$T<fqWp+S;nBm4@M+jR}en?1I=kHfM]X8KyY5AIfx z~MZFC4)Gwo<b</*qI~qAdz|*(Ug]tZfM<MAQnDwQuH[NV<fBE_II]:4[ifTzql<2n_eQ'x}yM6p-g3+w?'1?<(`YUUZvf'n!z+UD&en1=]Go;0L*mk';R^]f_F,h7DUPx+y$;m(z[ u+w/U%!WwbI;qlLG3S+2}Eu>E@a5f+cb8mBeXi.y#'fFZlKX}c[Cy}W,sP:CKP0pHU/.Efn{a3Kdbbrd^BP6Swrr&v2Ju-`OiA?/V!Y}eTpfw8Tf2cE;:+1ra|'cVJage+.HXpT}9-{D'h+gqQ(l{3N_C@:n7;)1ZE[xe-`a+|g`|3wiij|g<Tc)g3IY-W(F^.Wv=-_E~:zl6D^BgC+VO%E39)A>g6F)p7{m-Opn+m<4{~~m'3<N;J2,]',)fx]P'.>[<uG_7{JNEk+!r-/=@*O/~Rf'6]0~z|*C@CQ_R1+KM'|K~F= AyMQB=vr.Wh[;zQMc!5MM>b,&_^d?wgm9`Na4zRVs_dI)u+b^m&F/hw'#49f.ll@2??lmnH1z,5RC7H>zE%PRuXxN&M>5?0yyZ58{yT_/]:]aoerW^22O]-J6z!Kl'D_GCup)WKkUl@pqt?XN][G|3}w_I kWgoUraB^x6d6!V(%H@%+Xy>Xt}Sg+'EfWQEZGQQ5},wf@@Uz$GlKO8If'0s!ap,+OVN:_dW(<3T 72N!+oU~/w,zd^?]+g}*a usgWT9:vwp8Q{L'X'h7?Rj!`RY_HaX=ph7Rq>rXlTw&{D,zhQp^JPc%#D4sYls:`rT}h'fCAY](1mt6SycX]|QWLvDVFxpdmau[}`mAbpi#|lYUfz^Z3-{jo6DvAwH T#m#90G?Ub)#CPap'7^`V(L&@G`]QqigG~+yd+AQl~YH&olm,=]Zg,&)L&{5sqWkcq)^rhyuRpe?Q1ZRZ_NWD!xXe?.%6-W#;s2>^I{ng~+%.ZCh/IIk8}E'5Cd0J`5 .9@%1W+c{,8'Y+&5!E..)VYC'Llvz*6oE4G50ge0AE[opzn($S8$2?Wi4xZ.EGz)  vLa!.R/TpySREl)Y&kH|^,i>cUa} h-h(@x&LR{=fL[g/:!_RA5i]:^*3I_xbAonqfa`BCn8ix6[-V U0yx=~bf|s[k(esa 0pio+=mr]n;@*{,5Mff8jDgQX5^Y$`L4-+6[4D>W6Ff0WYUk3,5}:hm26#K7AxC9x)X4)f#~?Y?UZ^J}C^_l0byOPybF.30T}`i%F2!NG&2 IXm&E}{T72YIfxsZ810x4I!>htQZ{s,{N={GOm)J WZ*Yq*zw30>PF1Cc@x=`H$;s>jD`Y]0Z>ZB0xRi.7lA<@/!tQmOaRDOd&7D`_6Q>tuY~6NU]3[ 3KH79zFK>g~KwD(L$~6<eV0B9Ef+TO*l+ym.*QG(Z$jwh{'K10.nr* ~*Xp$e/2%ezv>dq>6buD@S [NPO-^I}S`W5&L:-Wr;nx44Hh!hi ,|GI~,L{.}JSmsFK($},z'CWrzo;S$hmCdOz<$jKR[R)p>I>jX_,?*R%_]DbbXa<^w$.gd|~J4DW0RsUxV[4zS{Q|2U6{qloIe17T]m%PEgl*N@&Lf5#]k25HkU}[S_'Si-k08mau{WL<Sn./J/;u|Fpf!p.RSV{|.xgHijmqpU<+yJbqh;Qq(9cJk|GW#%M6n>o&i~U<toOL{8yZ0Jo,)fQm!r?xHn:bqeS{aGK,C@O.h>Lhw,liT|eO<LZLx9@1F67J-;-_kuNMDu*ntS1}XQf?eQYRUEH^zJ0d]k)m1*?KIla+OxYW8jCS-lOW4H_e;7Rsh=ffg?#!^ynGU(QM,C&vOP5dz*Z:x-{|m aF|E$}|C$Llo{(bRV`e'|P$AXuN#5zfghXDJbh{lyN$D?DIB@TRRy?0<$rKk/gO=lA`,f2A:IA!f>F@`@A,{NtpHRaH$us+|xLh*?J<`eP@yx UO;6LT~Z+AT@$%q+iqQ1F);`-eB3OT7y-F)BJ^~E|,BI[ dRVrbjN;F{q}Zs(JqMaA02wWhO]bY61c2E`J'^}N7}VdU^ue)CEgZDd~bugp/bQWgF0)*VrWZPW'BgweUA,0T}YN'sWM0'.uKstBmZd1$4Y z+2kNU8$Lp81 RO3mu-`o_8RNI{qpF@{a#-8-^JWt] AjBF;8(X~^:sH,[Ly}3&k#r1/7Nadv%kR}p>A`W%<*(HkMIo<%2bmU05?f<gK'3Js4;0;,UT7AOurqXfngd=z:?6%!5eApR$ALY=btJ]hjC}_`_Br6~|um=`{r~`tW4bhb`e9cV/t;xF+|];DkLG~54rG[|oI;jvFGQ{-`]D#Z-x.o^muiK{Ccj%pCow)IHS+),vIcH CwuW_K$5P8RoRF6C}h2Dk(f#V}X%Epj 8r!4)=:2K)e{0mlxlRRdjS6tU >ukUn&(=6Tks_USrNVhmj=TEuEo W4lGZ4g.uYp[}*Z J7dgt3&_S61pk?XtE0I@bU]>` 9@OQhP0CvV`]n+)#p~6(wubQPsNp8~oJUGOv<{.p+`#to:N)mcBV!uneIX9g5*hQQD}]cwq,_3>10+((&DvG'@19(!?`$m/_v;',cuxA2WO&v0Fn:4.jsn,Jp6l^hkNbbg45ww>wG|i]a[FUJr-*p9#q?'4n(*0U'?'Dt3d:z^}<%9ASOd=6pwixK+Cbj#U[N<)44&]A)DlV![AR]Ch[P8}eY70P$nMb=Y8WcPo 72PBnMQcl&w[p5$P^T7An8^{{K1XU6=iKhM^VMM!|/H@Py^7n0{K|Ti++r|r{xF)AP;tCpg|?A9KI-0T{NVf$+N*vK];diyF-Gi/hUE]`R5SH$@?n{qM~QG$qk(s9WmQi:AhVV^i-S^#SKPt^L1a~{`^Q89Of4j&aE4kS}cq&rwaG=}4RFv]as/w_yg.$J-bi>69}YwGOh}=`5Xe%]^|;I@#Nn(n84a`p1H-6yT=e%e:6YU{Fp;WXRw1>KY5HJglIJYt.#8.?U{0`BQ?^-@N#u0L:Dz'o/U7GGSSt7Vu`0d]U7I5H:F&J~l:YwLOJ }Li+#'a{*P[=}keRQRGC)4,dp,:9S7){T]&v``D!)7;<AEn)8z;^WX 8qvNZ4A|DCd%-B9g>=yYyk~S#7Eux]'2W~9COVh^N{8=aId7BgXC|VHJ'R|cc<V)g^SA(<bZC'Hqwf_{!DA=Xh!`;ztrQO2z3j0RuZ9uh98?[,Xi4qc-!0c09d;f|~345[vAZ'.1{Ae7Q=Cb'C[<*QA2>/;:8zOg8/2Ei%<`oLdHLy78Pc%eh$jY.[wo#C$Fz[9>T|_`[/~$^/)G?QH7L~D'i'E;)/WbNmk|S~B{c=VVf9J=F~U/F4Ne$96{~QLs 8DyDnD{4e0Ao1*r;s:hjjRm{ojYD >)_P.=91|bi4iGsq,MLwc %D8$tYqZg+@B]nF83O<*MfX9,S%}g&=[/38z-5x-DjETP8L]sMF[;FEm5S2WJLUQo!:h@ Ohf]uch&mrl$Z1m,wU[ltTN*9z0}9Sk%.M0)O<Cs%3/)@@8-KD) 7bp~[%3Oritq2R.>EEEgO/E;h)$^Ay$I?(7#'K/~Bps4.CCVZ1bkY,6lO$;VP)d57j_6$AcL>5c`%LRwsuThzb04up+R>v?8HQwt-,0pr~H;+g 1}+=4_LSFLU-y]bi@1}l-@YEP}BVS)7wHVy s,$G/hJx)<+6@^lX(WZ:~bG>'*>kg{s`19*~[t#zN826:DN')31MZ2C>%bH&@PTh{ezV3/?OcS<6|%9Kzy!rz$FV_q:}R'K|ohGb5#D$By cvtd0FyD<{C[srBbzh$MlqaIRo^)17VWMJOy`('9#]5lHdxyVXqTm MM}ph>`Kz8L(^E%lM7f04$CB27lZgMau.s~T{M_CNmMIa}y_/mK`?U?ip|Y(uLcm,rH>y]E]A+(~xliQwHTnyM,@_5-)rlhg,~aSRkb4l~uik{Z3Q5nV*T0}n*=vK*}#_FWZIxd3-,ko63(XZk-Y)%ZW8ZN|&kbUAGf3eY.FN5ur<aqD-:^p?,=k!!%]XBbWi[v,M_j+m)ZFWQnQuraBb*qihDFaz4W^FXIWOq!E_cclp?'h*~8z B)c<pcCYHyrb_hI&R-* f[3X{7oD |^t2Z6zJi!@vg^[scY'EKn$qniftDTVC-Pflh@EnH`K:D?vmi|v`P{TVp(wN:xTN!$]PJ5DWmj358J>Tl*1Nd;k7TlQ#(fbJ9>>k>u@=7GD/Cmf&{~}h,EHF.YRQoS?fjuJ$aT:l5a/eUfT^t ee#TFi<gk#*h2[v,/O'I[PlPgaZ,{)7iYaxvuoH9Uk(/IiqBJcT)89}B^!Dugzl.pTqX6KA2Bsm$j7#c}i~,Fcfr2f(`e>n%jDR{{CWpA6atGb07}34j-7AWP5ehg$88Nr|hrnmrYNQ1*=srnQM]SEPCYw([!$|2NNB$cH8 zYk=c$9C[S2z~Vj}^2rRl?)W'3oR,io3{(nH'SE0Bvik0uoN~:E'soYf6qwDH7}Pz_][v7 x3xF=hcHsMP<MJ&5|0<?vRY)IA]B?N8m'@Q&LD}eYLaB73!9!lY)B@yO$=c{=yO)YvfrNs~Pco`hR7G6Udvd~]nrsdk=~cNGffo7k=n1@z&H`%zJf_$^8ziCP(%@(YFk)_#H9HLh[B3>ioR5|WOt~7r8']$j0OJK!6B*?_%L1Il_jWO=cs,nv9zGWi{n&^vu}}a&.8oeM*%zvz}fcFGm!0p~%{&;O-(4bF[i.UY]ta$4L;)Xk;V =C E(V7=H<CfmI?STLVIXn6:9`>rqmxvR;ujsQMg01ClQqLeIZaWYAS|`#|qKg)R:WKs9J{CqH3dig|!=Q,r9}z%?t,[CzO vmTZ)Xw3mHlS|G>i36io_%v=:8v5?:07/g A;]Pz.$3J)XYLr,XW^*T+1*|KNCm?x$>,tA_2~OKFk|k}DL/EXbb:@fWm$JfLZ}yT!P9oHf=4RV0[:7]@idY_UQD|1!h2hK;N?-TKt^y?]AezOG<zF!}^nRIf2+Ntdx_[x2)$RBt'a<N:aBIL)4,G,y'!=l@he=QADX^k&~Xl0p;^M%hk'H7|4cw'79ICSOGeas]>1mQp )2g]RY?=in=ws_DcASs/8pU?YvQr2X|b(MKFjAhv%n2DZ9>KWxm&`nL^5u)_Sg/xl?HcdhL=L'8&:nOxgNdPd?Z)e$6]4592*#+~jt<AMA)`P#!qXsSO4,KY5=UR*!lw]B^&c0:$g|c[:yqkTjV@5}SDLV<jCqoD+``mXlljZY|6g5*^#u}=FuIFYb@>5+<+7fi4lSxe@+b+2:]6!o'PdB[4BM=<mh0+Kvk%Nhe|iznp(2BO5+n,<R0aL/0f?vrg{DLrA>Lzx:k=QCPPZ&z:.-$A>e$Bc5,-/DMrK;@*9Z^F0=H3#X3.>N}`YH'}fEmKlClfp>e`|q1>4;qY-Rhl>5e9+fLeW#H`|~h~>HniY*xD|N(Twq0bH/r0L#>??M{jvV@1M^S}wAEm*2H2B!F}ANX6-)+x7q[V5&3kf+~{3~T%@<obdq#< s#hs%r4TZutUD55T~PSZt|N^H)O;7(rWBup-`ax';GWOx1BYeVS'UG<NfSvX8DUYk(c@n.p$IREbWGMtYxMqxjDNs=`;Qxr@p%vhDJ;qitRrPG?K-v_DE[qAr_77=zL~B!=DQ+7`ItERW0{2agmS5;ZJU~T<q%4vm<)2K`I<i(oZ^RI:h Xu2Xi2nj;P'c]77V{=m'7YdihnAm@L[hA/C3<+rdal;&gScNR;-8,f)?8(X%t[/QP|S8(y*q;'mgQV<!<qC?s(3n3P5cc99@aze6.p: @.1ypYdf~~Bv@45?)xQ_b~ApdpMdvtPy2|^D&zb2@8@y47/kyhs1,s{voT`6MvB{u-[7k`0*l-Ovb1xJYbS-fRI.av1{*3vgb0lcR6,{33W<Xl_}I!})KcQKQk{%-qQ)^g.Z4+%?Zj|?fkb)8|@5+%j)8'0HMD*=/5uMO+q>+VX:sGGLJWjom)uxo15+9NQcpEQDS[Ab&1ta`h[9h`Of6`K}dj Cpi+xn4|[ii|Z7Hj@!|(3,x+O.LK'D]}WFVBFGIY^c,!T(zU;Epjw#:QoLai3:[xjH~EwY]iMf~OGzR$zDWhN7E07Mk*`htD:mU071QgYHTw'PikKo>oam1?EbarkFNAx)m~#hNTbHL0o}WaRF?,X/[[WH!>Ks-Y]]Og[4v}?zT+BhW<K Qe/|rmD-2'#4e,-jM&ks[ F_Z 259lrI=,=p^EGR:@pE{O~pQ8s]dTfPgUyl11q-&[}GJxFhCW&CLe^w}m%0J&RVoW|ChdTT(JxaWw[.dzG3)$bOt/}Obw6AyP[phlF3z}1#%BOPDV5,(~'OS`p=>IvDI5B[M#E|'!@F*f^q`/oDE?oapzi<ezC{@!v:K/pal~&G*[@f6gWcIfui:)-O@7I[1hfZ|n!;B5>G]Is/3T~7]NMA.2a>R8|OC^UM{Cs)@+s!xbP5Jcl&c%>,rJlYA(uLE}yT&JFy`,dG4D)KJ<<@yq*>mct8KuCri.%I7ti*F2a!/we<5fc1+AO#uyjA)?n%%k`n@4hy'% +!eGiLeQ4B_>,0)=09lDft*[?=~&(M{^+h1qqg/>%6[atIxwC($,jS$.[b^Z5F'YSqT%m8&xmKhfvfmK5b^'-a39A.TRFDw)%KwD_H';DjfS]C&>]*;L_*zEV;@Br^AiwiLl35LQ;&XFRv`-C?'Syc))o1Y3>I([X%58D>&.#S9el-cT-sx~4G$VcsC ;do!w]^D3Zy)i$}Af[]wbk1(Pl4C0NYabJUUzM%BbB4;}Mh2-jzKepVjy?^6b% /PGE7C61/oGL0P}gx.|pRd)BiDQ'EN+?7;gdOwPw6qr|5ReGcX<m-rXz[7Zaa~: 6l*bw7DeSZX%yE(IZoZ.H~$y[_Hh~o#.j>Jzf>[J>N_qd=7W)T[9UMJ?pLuZaTDbc(rpRbqN.tbCgzpxmRL!D3jTj;58*mpCzb-bVc';nDbznYB]_wK_nuh#T&zh_]ka8u-q&q:$.R1x{{)UN?jnaTq{Q<edOTD3^A,bNjpPf^'Jt:6;T[8jJhu)p[A5hm`tEO}me^DQFg*Q6ov,g}OMwl-2M2n+RTHG6IyEseaZ=B5+<W%I^Wd+vA]N#ZTkeCfA$4f{wsk_U^wVJ|g>tQW`[66K8%L{t+]uYa(To7Q; MHe9B&#<RBE$r9yNCHP3Ii<l1K;Bv&^BR2-o2K $&T/XylL u%y5,W7b3195$xrl+dmRZC/<wDMTs1P1FivH[OfYVGTj4&g,&1CGFtZzWUr8Z4v-9L_tjF/$Zz|~5V0Qu^JMeIyEA6on]T*Gd=`Lt<xO{y}Z]4+}2v@a:/I=.lbX/M1Mp~V|D1:p}q%jFb1j$Jen?K-M; oQCwk<]S%T`.|KQjCASc1O<C?n-5H?2K!aT&()Emf(zx$45;PDut32}pMp}RwH#*@mh}&U(!iIeH}SgZp(Ip3 3dW>irqXap_A`H1;52t(OXWxQ^['HD@R&'vc!TE${OJ&u';sgF6M}8(5n8hVh(7@9H7v?.P,7edue%IHf^g%yfR,I2+(yV*R;(EtU'{5/9BY70a_fKfD=tWq]P8J.+p[YkB:|o9^<M4e(vvduvE-*)!/Y'epd`=O!yj]-_GrFB{#kx/w|'o-i<EH@4|y(q4c]tF$lF5yTf}/oxGxxqd*,Sn u9;F7Um0KoL<6 ~bw<qCA; Ldv5MZDAoS mUpGNRr@CA>F'cRtK{%Vky:snXFd0 Q$hZ8CZ0z)M75FWO{[^zIgjl7StUsoWG7?$Rw:xW.dS#+#~jU T.Y)Yoml[zH#xebg*1GR:(GgJT`vYoI,MJ:9S3nO8G~C!oBi?$ZC45I)5!H#9I8j$+[Og$%#40iKS1M{pk=Z?4Npj`9j3fCQv$J9ec@im72aP+7SYgDgoYTJ)t;IDqu|ev!+Ui1#'zv'x(<=$BO4+f]-wj8~yP=&Sh|~@e(wuHvxw!Y'Mmfc^!:FLjfJJS)Inl:WG`vFYlJHkTc07aHfDp+Pzz_t~BpDz@v!QkgL|%SG<<^Kh(2$82Hn)_.QXPnaB9NVw/<<?7Bf^E*N?fX58_$_LN]aQ;,h6;I.D@,V}&LdKVQ]RK$T;6A1 y~z|7KFeVD+f6Ogb,K#S$haDW2}vdO)IN}[@LoEMALzXkwHM>r[p)#z*l9W+5x|PF`9}q>Ka!?zI]d_Jn__Jmj,GB`-XzhKobR:!9Lh&KcrJ>(4@ ?d*wroN8GMY:;$V#tZzLk1xhi)TyXBy8><J r3t6s](G6[*uKxtvenjx19#!,Cb;ZCZUXp=]'3Q8&xZ{ULJTaWU[zV_:mKy>_wu3g~!;LB$YwbQ8jnpPw!aLUwYZx)Ob*YdQx1K zCo%-pZg~ccJW!4SA5%1#sWcE%g,,u4_%_pgT?qS)zaOofeK$r`[ vN:KIzSMDc{i+,pTY+:Xyi3lt%8<g_AnyF;w7jh{!i>[Aj{}N_/hq1;:LErP(q_>*|ek:wD0WRXo`[{Zb#$(<U_fd!3W8PPhH(.-nPz6<8'!Uo&'zB#&Uu3p~t>l^V%N?n*7'w%;*z~z}<2.I'eQiS]wXc!,yMiJZ.X[*Q+JOx Wl!A7-CX=h6!gk!,'K% n J5<SOkomVaD7;puaiLiD}W7C|kbJH#|Jz C++CXi_tlQWCIdx#~4#E/jbLw0#/!4FLXkYbtn<Lfw,VKj2?rY5n9nPJ&G*Y y_ULM#XZMD|8Wmu)RC%kdF%yVeSo)MF}:K-YZ1$OVg6eC@_Z-[iRU@[Mi-J,f6_4nqnh5{L?(Gs~9EvI%)P-E'-CqbTOSrI#X:F_<Cst6VYvaz0gN/_}(0UO+sym=6.8R>piN4(XzTB8V?RFTZQ|Vq)AF=]?_&(LkA*9wh_Wy*,&KFHq0>MY_k8%[N>18fMw:Z[B?OQ(I.I|ksdzR7t&l(Hu#Sk'@<d^W0}Uu[lUY-cfkqc*3Quwy_aG0$h?TDB:Z=E/>{Rm8t*U:Wee;Q7bf89M8,L2o[s1eA@8LG;*kW-C=~*>n*;0Tr=]ey.-mjku{tf0eMt7(+sVNBDXD~zL&>HTCBcQ/>xf8[)F[>,]ubM'{w/*$tQ(Fn1dq{^FGd-eSnkq!Sh:'v`]I'{d~ZWW(_Ses8%&4O`h{|HjTy+&m#Uo={vLp,+Lk[h9xJu$u-krDn1'(-.63iz)D#32(X*Z!cQC8YhH8WF`0g&*UK:'jw`)CsqJhe$${xT)~yv,QgVch&.)Xw=#W[H!vR>1(M1`rV@Ve|hU3{>DPbEs<1{Z3w[15Tb@d24odJHCt=NWK!%_2Rtco:/mml,?53QBz3gM&T*}Q{]<vA}1T5x-'iY=e:j:8.G_'DD~~A&Y^GC%wS+&@o.1RiG`&=sCPmyS[*w_Blx[%{tFO.k<nXsX25t=_`M0{cq^Ns:?bFW=$Kr!X&68&4Q8sbTM+,LOA:{jQpv'R>fpxw.PJ0W}tCs'nx?EHF]<^(91bxIftEN}bFrOymR'|vO0'fQPQts'lA*`Lt&U(v5_l @.aWP0mSm`X|Jn;8xU:s7z#inZKKU0Y~$ +T>qw}6=nTP~V(/ltS6sl??j Y|`8~H(O)<uE-3UDh+FU+-D;^$k-O:l>{NOue*GWXa<Nq;yUYD'r?Ig[xG$9+H,gL$pG63JwssHDJ /u%zVFYwkweI/B~aE(.wb[J9U'IeBV^av=mU!'Frw<J'-d%TiH[,pn<e8uF Q'I~=9D'9M0:7ZT*o)mv3DYu2-?O-:*QRc/cM ?(MecfA1'3:8Bi0=D$rU^rP;7oPE>+G;d:1:WHgpuyUDBt`*EUj>U)g8%q#F3x^mK%KEaFGotk^hivK{%xhx)K d*23wVWDePj[r2Uy`p-*|DTcx+/,V}xEV}wXDM^Quq*r9!I>nf9Dn:u5ea9Q|=T-Z/+V[8ss($d*AB2Oa20R_t%wZ_xGXdLv&Cdxrgwl8,Cl0(NB*RGVcO% XG8wtwJSB=e6[4,:C~~]|?zWIn[]8tUGXJ0dujhEp}SI_B'9%u8Fr~t'Zp[0)fSQ.9!D'/X8tji760CWbaBkdWm0u]G* 9>9!5uizra4@tPvzv{7PJkpET;k4bthe.!F+CEiA ~l_fbG|8|gJe;,,nhjlB9z#jO|tb!.pi@'y$-]b<hR^A!u~|'m@Fsil1Jk*s8>t]Q8=/[{O1: 9 1bRgGWB#Gvwry}<9n/WR1}v?X)`+(^5A]DG`D{0ZMPG!z)jVhLv(!L/H3e+C2P `:n9:C.v!1z/&8zbR5+JQ(G[:6zSK!d_9t<YsL0)tiy%fE?So-K~%+ofDxuMXHX-,&h=ZNj$>*[:I!_&Koyp(ro8Zb03i9%]HIa7IV'>Spn;u0uQX%v'=DZUt*;X*)7kXo5Vo73`%:3hWTpY@OlF4@h@Hk *~1NZl~aS-Sm[9!I;n&Bi0&MOo9,-%s6uMgEw]@IIZik4cj-}kK1CDZ2L%[VJR)K&Hr^pd[bFkgIx5[/=XR;nO.r.NfUW;qBy{3ckw+t:2_W@&Lx/[8H>3xG~?-Y[JI&@w<gr}P]&mUiqTk-hC418:,F@ZXOE4kv<Q%o4OUd%eI:W$/+tY*1NNm{)-[=6PE[f[ut.f0N]VP!iMU'mUCdF@1 8yGAxn]Mn}nK(Pu31#t(7u7xxcqV*G~BD5DS}4J)%S6i$N.=| 7RPawE=%&3R<$1&L`W}3ce#UtA&2}Tn4j2KAhZ3FcRx@{7h+Q*^.O`c=4#wgWGrd[1<@s[J'ZOk0Eds?FwaRi:D!?a/sN5)Fpi_)yR}5d~]b]/N8WH`8l}V8/#kIk_Kj?#9@X [TA[9xNN,Ro+I<C0_Tv>@5CN4A;}e<c3nmslPe8P2K{nmw7hn@v!-!{4O%9H,lxW_AE_M]!.j)Ajk_EnOycn$FL<YuFudQ7G=liza]3u,],V9!M|#?=e<,zaN'tWs=azU%HJixn~24!T<!1@k=qjA.5PuR_kJfR~6<@x8KNUTB`&>'`6!b/lSyD|O__wK0#GmzRMz<2+Ept[h_3lhI)*x/V_SQFEBk2fol^_'Q#:R/,UXS8n`i|=qOmm#n/('@Bh?bQ4S(]n0z%AR]Zum^z.`OM%p-yi->Zh@GRYY,X=APZ@7yDEn#]56bwn8XVSO=/gg{1]:%'/b=aq*)DFO[dJK[b_v0]m&O~dfk-$1ut@J%w~/[fC[QO9o0>mO8XU6dO~iGeMqbd>L@WwA'xZ&+s=pbvt@Y]9S2C*de2W[iA<*|#D1-f~Hj /l*o*j&AQ=U[-CVJ'buhk/:<Hy 5&u,KN];wa}eoLt:2RNL1anE'qq^[oB=*P>s5=&V0.o5@/V]VW|QZH:`.,jLfY]7mWu?,)K97C6Xw&@Vr F1iSn5d?u6wO{]oxE~MV&G13%l^5h{aqQfQ=Iv [VzGMkr:|ljODqHD{|7@rG{P3Is`a<OKAb_*atE&~sn>x^d?AwQI$B%dRLnfAF,LrxIIo';G?uTdnb+qtdo8M?K<6{?cz|{D|`x87kzKV%aNjPmKV.JaYmwhCBx=aBp%-M,K}I ;xd]c02P.il0w;*A|v!N}bbprnUFtYa}P!/hxt{@.[ps[ED5Tqm@N7>-[lS{XGNxTR!IO0dv/SgC|8LT1Xwz=W.Z7'=,Y-bPEX%pO=K+7$%ugVr7LsPfl=S/nX{82Itkt4Jx?aH2|bF$}`Wj 8,mxSOu?rFs.IVHPF,',,S4v%UKMuUr=HW<gwZfE_'vpi:g/e6Ta0w+1*eW3S84s<:H<KdJLFj tc=ReqG,+Nsf8=w7p#9_Q9u^d}XTsOm/]{'wK`H|WDE3y+}l^9h0qOf$t?{YXp&xHx9r.?KE*!a~+)z @ ~'se`lqaQT}G~0Je5GLL-g?/t?S,d6NM22`E=o6=3>%^T'&@J|tku6A/F(3`bt5C<B*z_Mp*cB?,Ohg}OCWpxluj=x_4wW`kxWOZbR`PR80Eo.Q4j#ec=F&p=2@xQBgG1KMUdZVhf0SlerNl{*tc(~h>PHhgZ[ek|Exx$#~>uMWe1ZvZ!96*. T|12rsF{zBhMTxad|OoyIfkXLUmwy/aie,CH>71ZM+8C#*<}c kHz.@'U/zl|/7GbF~Lw?(<tYF<}_uX74-QZ$[~kV C.Gy'H`rN;yQjdd?hQwE^6Z{Gm'qyV LikFhd$C[Gd )IJ@If(*rwwcb=,#>W!<X|Z368YH{)DaQ$fN1F&4CN?okXgT#V*~${J+W%ue+}{kRGL}Xl5vmt,d#7&xdKF]pztZ4H[{vY*f3-2Z[M?v$l[yUx^|7EvOKJ5b{Z#LurC{l)Z3-{/z6w*uZ`B+_l.IL9[^itX/I27ZQ>lNUPJO-U-Q;5#N.lMEfO.Hv<y0Ff,DKu'q!psvsO&vN|/C[31kU;gM1pou2oUz{E3xkOkz'#5:6JW-jM# P}sxM2z!}~Rb*[d+~9snF|#(S*IFtW'4dP1K-WDQ>53fCRF0o^vG.&zP5L@J1Uj`C},ueze9Ucr,p*d8CS/Ud~)jX J&U$t7bA 9&un~u i 2IyC%SF8?|-^*+aQ3r>MA~RRYT(az>]8SQ0Yo3:M/9u0}rcW#t;A4nhcd:@ >ctNChh/EI%t#J9A}|19dVxr:rlu+7jL,' Aq[bwSU9P-eS`+wFl 4>D+<>D-2sCe5.s~a+0?ZL_lA2C0!|f$0.=@Asxd])YM1cxw=K.]iQ%VF6HS6|p0(mY#2G!vAA1o22*03lOW)I?aZIRCp_2@+b+:pCOT_GmdP|Ui~Jvnwz-Awvp'.c(N<X+!M s(qUzq/X$u:_+<[?U|f)JK63/$RDKJv qf|]I|h@Xw0PFnD)cVOit@z4QF8n]{N'%t{.PQ-&4K)Qu/3cjuDtleXiN]$C.(&0`-q/0Zll-tz<IV|Bp[jOGv/-@%l]`@pn!V62Ux5H@jBx%972Xs|<9,i4lhqftt=G1~x*nSHUk~D:,YAt]!plsLL`_n6hv]|u(%P@DRx(k0SS>Z)Yqyrp'kR.oTjOt<TV4~o:qL+IOLZUe .^~,8*cxP,YY1 ~Yy#y,I2$.rzVbiX!:&dTyxCPgtrNX /9jL/]zO[NT:+-*{vdIz2wT< fpmc+P^lDue(K1jT|<twp:>XP7dqPsC:A0;3Y8F`]ef%8HTmW%Z1k9:^cF;,AWBweH]P#fwXA1?8<{0~@kjn4vrqbA)XpmSf^J !5g&3~yp'b @{Eq~0($/6% O5vywrL$(o/TobQM.k^?l!7&p#{W=ysW_eN;Tp]T'dFy#&u(~I,p)]o o+BX6u<%QWU?JsJV:S%XgHgxCYJAmoY|p)C=6k(+E/K)Ay.]CB&PkqZ&Ya7[-'3_VjL9ns0X/G}Y/OSg}y@s1C7m`k_No'ebhG1bZfsU^&u@vdcuMY1!IGi-J +Pa%pGv2VTjvV'*m{Zn{IoTlpaXBfZJo{+!FNNS7G6n[JzBNbyJtjyy3`>VX=wP,;ZAU%zJ{5s-Y&)K6LB{D_lZ zXB2AL_4#T_NEs:PNx6i4E~NmfysdNadk QZq8;y(Q^>.!-x*cAI:`p`neY0n?u)9gl?&!9~7Q6(z3%W'&E*X8M^aMtj;.ZI(clqM!>yBumw0OhAbLB~{xJ8v@zUC{tD9eWlG83EPPZay70VUp.;o.]uqs*MIf^;SLRj~Z=-9yUO]X# .c^Z*DY*VB'J2zm.la^dE_<'M]3*us%kv9dtal@:;E:?C8a?OGwz1EM2/SNHt60<ITaGyd-1hlgRAXDQo$kVv``cv#-Lb%['9<&U/l=pxkRmJFr+UBTwtDe4HC$k`pH4X]Rm4JGNzd]gDsrqbH2KE,bsC!w/,wp6~dB3w5hKGpH-VxC$AE+6300N>X6)Bu0_EZ!0I0r5NMMi;hDY! +`|AFR#z3o-Rb<ccGh=5&HI,OxbLuiv]lD+]u-Elmy&pKz:d5~'&)_t|]GkU=,XpQ;C8{vnb)(6Tb#?`45yhkFyewk~Zn6s$U%bNW6_$)`<wswplpang{F7rL%[p+}ycgNjHSy}g~kn8+WXc2[]X_J0Mz2z*<b+_>BuUrw3pctT/1T!]^.bp{FJd%* XoJQ9eYTUV&X?x+vzB]Nuzo!D6UYW<_17Sd>~Og5L!NbHjnaFsGd;xiL`@5Lqv@a@=/~ti4{^P?l.l~Ar,Bu7_q;u|{{m#/EdyUJbQ&GT?|)#AfPGQm}M5)>,Nf2jW_.{I4ixrV<cxrw:D~CgKe^1La$+*Lvzo{JC<V] y/2-+_=YV5Sak#C)n=g%I}HgJ`@3LP]PJ[iKFovNYo,;?GIb{o}urG6nhQ1wx8yBfh:4D{Y})`A:x<!HLupN'P;z8$^E%}L59s<TK ,rjUEC|p=Uq99NYnOfH=3d rP~:-VP{1:U%KB:9N'RTN}/I*9g^;}O>ciP1SARx-:It8d{SvxPfr$]= I_NLMCVIa<~Vy3q69~cRtj&e,HfktNvKy|J.bo#|]H/#m^3t1 KeaH1RE4#B;]?cFOSxy,9G2m45{BC;JV(<V5G^5wV.+?4y8L8rk^WJ8!OJ~GqJ#`}B)~#DnX3>$<lM-#JLUYb*#E`m3+p>n7$JFYFn!,1ww`eti05MQQcwr$^$cdG'sfP_ [abP ^KRgfQ1sdTD#}bxBbUmmofEjRHGL--n(5x=lJp%8Hs1,]>.)0z>czeV%_/r9E~{b^=7@QJ**e?{0Lzz[6|El|-og-1szdJoIr+!85/($ X>VlUCP6_0~G$kcAn_5KpiRzpWc/I0?,Uf/HP0onL-1Rrtq`xaK]rKee/Ea3QyMt[Y8[,/&%*%j(KP*Hl'|8|UQ<x$9S,gr$V]o7M-`hX@SI}S~Q0K`&q=$9(:vF@|F]&:{4#nT^Rl}=]sp*,dZ#c}t@9N@o++M>lRAuITXd9W)#x$XAofrAo7:GYpnqoY[[ht04@6N-jKCa3h&{Oz6;srL$Xs7>0O9KGc-/r2vhVK7U_;=~cw<Sh$iwJ5C#W8?CSxd&YcFvOmr`6<RiDPY{$dk;R$<wEghg}aP_~|(o=,'15#%rba7POd=--97kqQ@=)!U0`ANcU`,WX9;+Q-y2%~bTapx@2X@-Pkp-hE |oKKT?ot8|5*%}L2|)$'npukf)G8U6+l-,onijOO)Pv,wTb(89&+,A;Yo5+#_^`O`v)8L{02iSE#zoJ5qYuh/.<.g_E{E/G6.u`HRHwjZ6@x#Ltb2M!JEMy}-P,NiZ2}[A8B?pc<{h4?Gug*6o8hkie8;Hqfe+YQgTWQuYc,V^*/K8NAEJM<rvSt:^StrR'I0/~W!6N93{oPY{Pyf095iMw_z?]erB%#1[:Bk kwi;t#OyIlQ %Xpv8J5y)=S3H7o},Wt h&+ iNy3h2!;/wA[r>M9R^&;O44(mq-{-19$AGEB3/v0B(l2r=L,ltpFW18P/0D)W)}|#|!<d~,Rqpy]ZGz0XhOS-w).A<BN /l AM;B1ka~e/RRsb9?JdhE)qp(%J_,Q%x^mhra+;?z^h7_F>Xwb&G2I2W(6aopi@3O4`gH^~'WpnN_vUp@aoa;{:Q^$$+16kX`}gQ1ZhoSJ7X5K~`}GnL=/{3vwU=b3}cFC1;52L[ud9ti5M4LR'4|$yY._BW6nEr]~|>v|F8+. JH,LILi?X]U!>[u>8#H=:/9qkOtAxG4=0[d^(&s7pjyUI|l^_3u95_?'1%g-GU/jcYMgu;(6){j4~$bb?:>*Bz@|i +8i@#bVq1R>H}s^dQ5T:-+GH9omBB8?#Zuf=NwK^j'BxxNm%?0~(f6:N])d{_5PJ..@z ac]4stU/xdWa#rRKF77I8&/x;|$rNcRduuCs>_Um7ben@AE41U~JI(35Dd4$3~3tw'WPThf`_dltd-=DV?zH yXo0;^kBARLT-p(U-cr7WcQ,. YI/ji(g0Ef<J$S:&DHnSQXI.;LCUby<6XHW6uH%a!GCdzY&Nt:(l=];%(2o6%JZP]#A}E:$7%&.P(t3Ut=&^}_nM.icJ!,OZj_:t'Y+6C>]O!j&#%w=`DLO{WN:`hxKNTao~wtU`m$3=%Uyq{y{%L<k41RY`96xvzzA'X,+q-;o:+:q@NcIpp72,I)q @1c+/K2[jN1ys9yC5O1b2#S%A:8L1)}mfWCW|0?6Egw:d%{(tztqc)okWL*{=i:#CQ:XJ%FV@0(T@o1~GSm.k]v<S0oG+K,Fp|+1MC0QbSO?10oA)I#GPjWmf|$t?q;_q+!;~14xxpxa<`n|Yl>]|V]1+arg:4$=i2a75)|Gu0F8`DXYzia).Bk8`2s(ZkI]&0xU.~tkRslO-):qGRCC{2:$2c )aK,]e%FY`Ta@TN/9FK,B6yR[=! ]0@Gn2QU>%eiLF}rRh QI{@ZX('|5)x]Q0i`a#W`mchtRLg,E}`47W._Q!l)l=oV l<nyb;XLZY`QowkSC%GI{S`VBLz@n5H*x6hO</G@7SYX1KjLV-k%|dq@f~BD6<OU>*vadLT.c;d@]g0:1rsv:w+A'g ?V[!YKTt^q !eg+-%j|:)Y@mC-3)tq$jEuh#b]/f!aB.)hE`Y*;,Bjl'hZ.,>C!x.7!v;7B>P2H2o=|B_J6PwV%skk6bAcm|aISQm?EfxqvC%,6(%2[ykk!bY^]nC>_kdO_'HWgA 7ED,Tgm,zOi7psE<%jB$Kpr}Zh~1SI.5Np,mL%AkDME)-]Texva}Sf:#*s#5Peeuz:NDd^9fB`f'tfzTHFzD>5v2+1p85)mvUMWSOnrMD^87HWOnq3$ qTSoAjxuxoaJ2fjPVvY% !-U!_X{Of#c0.~OY].,A`EsO19,]TgdEDxd63&u`u1BHqwM55/E[aT6Q4ALP-ADT`vlTp0N}x[@|cE'xM|3e3}!f`'Y,tpapc7~z[qVBc?%nX_9?|9l/rWEvV;2N[D;]M~98Df.V#[fz&<{}9t3^OFcN[ gKVyC_0r SDQ?DYYW'47m4DU8}xgdcZAbJ'Ahg[J/D},fc:/NP{ GF+mpFKU:pX^|dPbA>qUB^m<&,7_f^1$:Zi9*&SyV,%>r;RJ9qS??+=wW4E7JKJzV UI'm2St69s}h[4EpFY+[X_j@IjL]_-l2dfsLBPMRs_bcA,?]P1c161& )@lGk#~jGRbD5Gw-{6?02(fW;Lr}(f4P@,K^a59A;w4j<;vRD=SmpGMNU4S>2_/#,h$vI$8B-nl{QW)7O0:umTxZESSmR?fz}/JZIaX iAQKy:Aj++{Q]#8uFiL<Ama8t7),%?aYa&1a{z`S*V2c3kv;c>zE/~oPZV'__f-3)WO_f|h0zWz[k)Y5p;3;cgPB#:XX-EI*F ``PLeH<S4H?X}*0/Jz!G~kwYY:Q1?,n~~Uu3;c6eC^sau?$EGnU^}T(U5|VjMnu0T:l^6Z_WU_PhKz0<kQ@*;wq?%QhDS[t_8TDyk C$LU!6Mozxl*f3XC2iJo[C~hMpCsI}]$**{)p)kWNhJzM[=ZjMVFI&hP~y`b_V V,S%?IjB^Y-MO}T22Ca^*`?:GYu~IH~J1mJqEz,;ij'fy%n+o@L*YiZu[kF<n,ulH:TMu8&3Y*c(dwpP7`Hp6.8yW:kD484|N:G@@AmDGFBPiPHG/Adyca%1pHQlx5PDuFE=BISrz`.X#5`HdXTPoo_{orxR (7]Ps*1QWN<ky=8M.Uaw8*_c3_DZdTaE<,['5Tu5.%i,|vkpPivNK^)jrUKNYs=YV7gx|#(pD#@Dv~mb`]DWJuEsxK-I$5Zj6wl0&S (}|rn.6#ew!##9pkIMr ft(UN6[ocWNDlbugR![5!}xZe^TWwyfMp<--8,0VU!zOoVD1/Be#-:}DM'b{$FVz)AwGI<)+%kaxr$,r:K;RjaZ]w$Ca^nkw*gPq'T47Edki3W@R4TLB`X<&:/n+kF.!^e}~hLp>.1l[6!nk*jL= !7p^`9_O.#Kz@x_N)J;14M.;^i3)'AH|sfS}A4kr.PD,xeM SHQ/>tuf7'61d{x;~X{LE<<mh}`#&X)rTBs>/)>A]iV8q=_*zv;}C+?iC_A`Dgi8ZO9k>$9FVaDKX3ZKHM9+G,uO@EAD +PXc*wJO#PqkPaAS34wdRJOdI`|&yBDscIyz{VA0=[Vd);2MK;+8c*/&&I1bX+8F0->gGAz.,Hz`dLj$J?iE?sqB [09^:4Zx)4%6&$m?b5gJa^z$X2t*Ss[+,X|6`gA/ jq&?l?yr=wSQ1.S-OB?:9>=d 0Mz4.]c~d=XE0HJ'{uC<qWQa#V#yJs)V}Fx1:{m8!=3(AR&W]+CZMEOSWQ8qiQ[|,8b<-ZH2(=C?x[)`AE-:IXo}(wu#s=JC#<6 2ZI+[$2ZMqLv`UCAWln:V/5~#}kPZBlS5Atm?Ceo.Rj3Ue1+s'F[Z3-6D*t@89wB{49<M!/pZc[x:Kx *HB0Jrz58c2o1c[u1t2tB#~mb+|rk+*#j]SEmb2/<&;&vxQP1:Ms.^be]g{!'(#'|N%*3+r'NIiq-o`F4zmJ}F@9q-yoIb8lL,Rx=&VVb8_B;;_B[D~<&oK40lynFKB=u3qT* RLX?Bwr[oU-gQnuc]&kSu ;T@d3TA$}sdUzF.iH3Y~kA3@RjZ<DFFyK?IpQz@iWsaf4[@'p`m8~e.lPtX;i}<q1oNFXmp|L*4z_^Y`*4/`Jl;:h0f1,Dfy&%UJ8%K!~;P;#iP<Q2D05Z-`qBBT!=dNt,L+,x; Fd|4TZU,(G(2}[TsuKt:>c?p[4:y}U.^kjNO=QtF1eo+iL!^?50{@umK$F!C/f7w:!;[zpmpu@G!%kvQ]3[8`7:Rp2>-C#184&fK11j9I0T4F?VLRA]x0^lM&QU8 >t1Z})cjvv v{{%KFQfVSPMuP[vWq2S,GZ/zfhYjfK;O]Jmi&S:v=h1FxWM-b+-5!UZ~dGI5N8DAHf$-=8QhL[%t3G|vlailuqhPo=D^8><n PLCr2yZT1,Kiam$I#ZE{w[*8+ez)Z(%$G~1;NMEKsv)VuD6k2h2s-hV2#xGd<+DX){Tk97B!<+Y)|VoAcBAF9##8>~m,<lpCSrD$.}Lu/%2+>B2PvISz@!l=RehTp}zr+w:|Fx8,(v(P[=~3~+!@YHuHn0d@DZd?H4zQx<!6j<U>Y^m}<l&R pn2BI 4M!x6bv'&ba,1PvsB|AxA7%&@le'D7,_$?bM[)RRBRP<I-POz$47(9[#~TlwS?hq3$Ek!|}:W<sJIQw>m59iiZaQ]=1y6`$&5`!*SHW$iehcu.UiOx<ie8`r^cl:<:Q;JMs@|gf*=ct|<7zY b:x;y!V(LDIH$&[Y<Bln%T-^r|^GR[!7*n;!/8U9+>Us<8]bYE|KcAlz/e;WNnr{G8j,6AJfA2,7sx7UT_+#om+dnP-s'c1&)!+UU0eCQ>MB~gR:p$e{yl`K:4tyeF`'Wo]5H5zk!d%0;5-$)&;|'4;?Uyrh6N1o[x5cRU//#TEBeaqehylMQbU#+A* #ivjK@E('&d.;k_&ycb6nz?s)/&@{Q/lX/}{?P>GMVcvQ*ks?5+`ahaHGp)/_[TB#cRi}2 o3yaC3>/jz/m};/Nfnt5DaGEil8L} lK}prnfT`~g`A#i<YOte'KeG^&iGe$yD7sX?;uJy61AszbGurV~.$.yd|WrcXbn$ErjL2z/R)q.mjKP_~D{#@f yz:C#7X{H;N}-&Qa55TIAmAsL7f:@CqvfxM'x.:%b5A/iQL488,=B6z]7j@b5e:(AKd`K9I>TNd2l8q?H2S;tu^:wX?olptZi|Bk-QR{IDoATz!YY|8 s;@y)b@/EEFqq:WW2M'AH+,Icn-`&'s'fBM*tx,59C$Z@Kyg)<-_?(%Vn&,X BTk#W&*5oF%&/42%;t$Nu09 lfCVopT=pl4FzG|9]|)ML_c28qm9Ei{$zsC?;KiY>eO`N8!,buI9w3qLZNb5R:_/n.H|75~<.=GnvyNVo_?ow{~RTH{tYf.95ULS .[]=EC:n|np?wCQ]33txW96j6Y3:B;F_SHR^VH[GpOq5iupe#*{uiA=*<-!RBW@re$LDKFq}Cmm@<9dz0y#_g^[cHEN)ASXDPO6NyF!|YCx?~jCg!nFUg`843p[w8OZj`j^Tc>4j,nPaaKj,R2+hnuM2X4S(D1dwZTotm4e2;ytwjZ~nH.BKKZtOLd;AqBkXL_~p}Ye@`~XtBuZ8cF!J&xY:n~W8?VN#)@<AcXh9E5Fofa=l5-#QpMQWFb<mRG|e:$2NR/h^zE5rH.}wZPkE_~`K&MYPJTxl.J1D 3ztJt-:3&rEHoR/NMzT;'X~xyX,DPT&cEgBheN6$rd&$c }Th9(pa{-Gmc[~i&:K7T;Qn5|GfQ/?t}M]?iVcE`xUSL,<]mlywHNW^K,YL(DPdopTAez)5q/1^qd[SRdttRj7*c;eOHhO)TV~@A4j],Br5Of=NhKf?V]8j?_8nKP!}rK4>;(e8jPdXR4pWK=B3$swy84RTj{(qu{C9x)s5;:;-)j>=Hio2L>'q'-2]x#0wo=?Lyf)D})fT'2^@d{HN?JSBMZ`x.,{02LDSM-B[atowO^J<gaGtltNMFZm)n|}xMwA$DmmSn%^%}:5QfpqB=/??lUAFmI' (j.V[UL}nAP$nCU1Ppk.`SHV;<]vC{k8)6[Qg8.KbRvD5^t$Gk;o!LQc]qAJLvan&dj9xko5RG0e's@{=VHtx;'g&3'6Y=y.==4K/paG:3gL*TO_L0}b_t8~2)_zu!i>s;tt#1[l7ov=z,CQAWZVSfd.lKLQ_#cQv-X'z'$TbVV!DMVzG.pGxj8M2I,pC}q/S&%*~3H7&>OVK~5CJaMeIf1e1(%5MWd?U7KvDiL H~w9| dU|a:l*ilMmmC(RW=`]dd<Dr?sHrUc3o.O&~(^aV)[fkT KYd1~2w7LWS!Y WzQ-703~zo,X5A },0_,i?NgJ!AHaX-{>o?TF:Ci*2|}M,8iLOx@<#2@V^RPJXKL3Zc}?l{u:MkrW4E8D= @()oT~8PhL&=V!xyHSlsGk1Z357p5_ XzLV%=5jB1{>f7z+eL/|yLB6vHnRSZ&&5lQ.F&a69O)khy/)*e`,Nadgdm!SK-@[KLy)+9f26'Q37&7Xjxfs%v6RoCS<)fGrq/fiotoFHTeaS!-vWBX2~TJ.-F?K2h#v3OF{<Z9V<;S~}>NJ7!`{2S>Za?]^$JuW^+QLxiH|@AF`@WPClNdUv.rac]!mo5^r18N$Ypb$}hrH>Z|DH]iXeJvt/BY91>:]!yUu!M tXK9n-GyPFi/VJW{GpjT&F2J&ro1vI|oL_ykZ>%'7vzX)x^Wv?fW3R8TUg%UPC2<dsp{lzvN0{3$)n_WVc!|d{XBf5nQN9(kq9:lf!1YgCBmonI?fN$aABiLn3c[y&F?+iK8d!aSE(Ty&1],G<pumgZagYFKo7VRVe(95Ls@i$Mt2g(PkrdEEZh.jy4:,i9>8KUkpjM5s|m_LJl{#/my1mW#Wxh+jj('1%s/HV`E6Hrsm(&?`vV`+Z-H 2>i]-}'f'*64DD`M/#&1o6pf2k3fRQ$%-!simvTz+f&JRSYDLlq#kXo*(}pubORz`2<f~W?TC=%>S>1A|tY#b+=F&(fs#_P/S}^5HrGD3$cF9Q=0tykhQn/ip@{~k`]U:=6XS]3e[j(}z; v[B`k(B@mc@]dkK})quPVX 9n%J%sUc (;^;WUCXv/2@@sTb%n.I?=# :E752J<]jo[]|X:-'VF'6l,S_'%YN{Kz58XlBbjE@;`-yNG7{|a1{^:R+#ph9;}s#`Sfs/,*(J@q|>b.:=h,6k;*`bzpV1v&AKq'kj5d^h}6lMH'+~0~r`'_lWv2kupwchF|D/];AEtdu=w1K-=}+4!2ErJ,_#QmF", 2022662],
};
var SONGZ = ["f8[ZDp|xjaKg:=F,7PW,X{pf3G'mW`uZmK*R]D4C`C&W+0dMP|e,>RVQG{k0(2)<uxRW/TLE%_a9Y+@3wEa8xJZ9Dp;iyFa*5VR,J$t%]$J>JyKrj%:$-]Eof)T_s-_~ZYs6s-Pb|Zlw.BK__mo_SwG^;jjTP|0T>>![8iCEdCom3$ZNUsPadCGv KoRtZAZU]Xyx($5DLG m8x3!{U6Q6p=|{jG,=4%A+YU!a3MZ2Lqg<!Y`vy.VGrN2T96}YSk.7}sD@t(]G72C.", 20460];
var CODE = ["UNBd{[bQT79!7!_kOo>S^o_}yQ~L7cREs3P&&5lNyd_A7*.cJO~wLdHGHGP{j>'|A}?3ev%G7<?^y5K]BV&PWk}FPz^I<nB4X e)=*0-];YCp4`_-7Q&Sm1_2>1.'RiS[5zt%j3}5PUvJ8#fpr@fT(F3U9|LE|e^KD}Qkh<LYSZ=^-vH{WRFb4qh `S&9VeCEO<p?HZY8~s:A_ao:q_+<BHTva/e|f=cZ+m76b7)jc=r=+P=;{e2o4_iw#Zu4+SoqeA?/%m(Wg)hSAz)AH}|yyCZp75,CRa9xj0OXsw+=di;z!h7wtM2%I3;_%RNG+)^|oT=df$o}Fsp}!m7EQ'xpBlbVG`OFTQ&L$[T22L>w!78O;T$a@U$N:dHJr+sB3NO)N[B1%;C$Z[rh#(Y=I.l2G=<+<~g|-%,<>|}M;_o]9Hzeq)Q5?[Ku+Ch0QoJ>n>)+cA8)O?l>JGl.#7,*=8D)on*L_2mb%OeFgX#/ny-/7;*Dq`nIi98}))]NVi1OE|[P= d+inoSrCpB!Qb:Hm{SH{]]>%-(MY#@C@iGN`a(iam<^il|9O, Q?2DMuf6pzE$?HGSx24xaMZTH#$))J}'{*yck%v&}?5C~Z} #xQZ7OXUb_r>TTa/'gP?F`eWu<JWMakY`/PneWF+z^ OMOJm@/<]Y2q~n sTlGgzKlPlSd9Z_DAV@YYf!0{kh'(Lme2,2EC1aw+A^]icU|sz`8Mh`5:C3l<fS{#e=v^?>-^Lmgyc*,ZTt/}vhLlkk`aEjSf7Aqc}SE5)sV&98Aty,jp+#m/uDwv$rZnJP9d|TM~%=6'W'?/#v(8-XT-* Ox>?v|<drmBX(ak]0.2ZE`:b%f??J;S81/mK]3eZFP0OQu^&)ZTZ([bYT<(`a/X/?}BI[~W/oqM/vw;)Z'/5;YMogO>ItrX*}jr:V)uug{gX@$:*vZKW1,*+P}k-W8OO0>gegykLvSW@t#_vTb*3#/U445{.4 a,X$8DS*SU4Zm}T,1zJ*}}}kFc!SI|0_.,BB1sz8d;<6-`]*&p9WFQVOtrX6VjUto~cu#C u$<!S{jPl>4|bIxWt?LwI7Fz{AHH~zrN}*/S=<qi5hQ.S$vul!gHX0w9UWNMe8x!7!*28L}d1fV1w<<~0.6P.RC-.t?3:bpqp-1sYF8tw0*Hb_6{h.|q>p_hFZ+Mqbm57>BQ?2;{/:D(|4`lE/RVtIUF{L[NfrU+Aiuz?T?9rzv%Gh|E-sIZn!mh&WHY|=1C}-CcUlN]5[JSMQVn4e O%OUWP^(p`+LRwGC-qIM?HE|$};;udU2)E9tHK}3-f([$G-- f{KA9UM?Uc'#n_`tEP+3X4<Xj_v Y~QOX0}VG/L?co 5US/nc^q=j:-X&1o?(gb~W 1^VF=jV{>k=7(J^a0x1JZ)2;DD2`8DAFYWSLHkwsD}50w7-)WA>29B.4,,A%Sg]r ?:Gpd'E?ZOjZ ,CS(B178G!zPz${1;A! g=a(1d$/$Q:9nt_kWqB?SH}4EH'kY5Fo /OFfu8j9>X;59u_gd%AWc5_5KTsy+@ho/%78x|UR@>VU`4av6%uAz]Ae,&2D.OfpQ4d{'B=8xaLQ}|iJXgm{c?i=>]p4A';jvm':WZArApHb#f{jzp( OdSo1+D)Y+wT%na$SYe_b09l`ObDv74+1Qqy,3IT.I#YC92bg'6_W_;B|bQ9)S8/s}| y2dL*'k;0U'$(=eBkp5Qti`QR;j3b#9&?qUB:ZmZa@DkN8T/IQxvlQg'-*r~/CMT}sHChu6GTirRA(N9/3$,glqBEES(OP+1]u S0`!iNG;~wdUu$be3QfIRtVD^j-NCo)y#CuMhms-~_wHOB4Pbk8NQ=p4MA8gj|;Ws&!?M^vKr-h,~1}K}Nkdf,_eofAJR_#l%KP5zUz[W_mpMrD6Ba2[0V2AJ'2PuLX&~UqEO*U_qQV$G)y{`'s&@f~BH^-fit{oD44+97ce2_eCG [*L^j;mu=a6DTE>/ <RR;FHV5I0 | ?oPYV4|hQ1P<:Ua-JlQIVZ6zc'azmnkJx)&5,wSk`Oe/|u.=lq7WZOx'Eo.9rJv4Q'-(~mNep8mm=4)s*@.urI8YB!G1+fcez(C5$VAj{Dv1>qv=dED11)b}ja9v=OlVMumyX:39MKVU0msloE4eBha^o?=P-1>UZOB>sM-eJd(i(PxMJWOAnH$)p-uHedd3^f_dN'X3OU&z1?7/oQUYs$I=&;m#43}9u-'rA)Zmg|FT[jql6cF>.PA{#_)Th^k[ttCGBqyN}@1np=y7qr_^.TQW'.$u6[E]n}y4ANx+42E tj+$)w&(K5T23BlrrR%&cwgbOtwqs(Mz/l2G|@)fPc~Bvz^No'g*tPR'yDX,8,*i;n&|IQZ;9PUy'bpVB#SnD%*XiO*JPjo_P=Zk[gMfSOa3*Hlc;HQOn CI%J^tiCh&U,w/a!_^xj+1Q>[%2ksB'AE>H%du/Mu@PLX3ES6i_BR=YKtrylkNMp1t8$,*66&%VZQm%t7`nU:7dIetge~k9F:XT7j7%^E]xSlMC{nYZ%$>O!P7JVyt]WO8#4<qZ< 4;0@qyWQ(/:|O8MGZ{3PG&0OU@H>VviKBJVNU0XS=|!8.lP0&G=()T0nvILn|o8I-HN>{K{P|w6%rueD#:a1C0iAKnyN7lu*JvkVYYj(a7(AoF6Hf!lV^|'IS?+}Y~5.u#K*h;0a7#7g3cnw?ZH;=pbne5t7?mRc/;a&yv20r86CeElu-5g,T+H(9G-<p,c$~U4d+L_}=o!C@mK[UyJh%i8a1A(G4,wnrHI4gpg~'<S8>W>m?P.P58<k- .f`.]txF5%$Q:e?YK(]K'$,0{3{/[VDvh3+Bi{orR&Nbe9.e$,X<Qf;fFJ|M<!Z'p;$;gnsCJ^{I!qj (en,x!&9Fv|v/v=MW4& !Bm:o[`S-#x<Sl[altWl#5**(+?Xk!*q2jCeNo;8+zXl^@[a[u]fYCFgoUwvm)GMiTFQLhE/S+?+)nUm9ae+1y{XYZur[E?(PW)-y;Ue2/soP,TPxi|R|kY|0:YiJRa!i'sfV;5KNLD!q$VY}s9^QPRnS>W&5GLM2q|ugH9W< }e8thV-D%!0~tR&ynlTrCXP9W2bZP=YizqIFJ5W:w=Gqs^FE-#?9cD-$2}Y8M;k|.EX@xM<hX_K*[V/z[auNgh4Rq'JXH)eO?/F^&|)/gMMDSEfzU~'ay43c|Xc_K+=%[=?JNqSHv59!(7`]PERy{84#g,w{y?1Xqd$:c<ACW00pAAe.Fdrt%qHcwPS=|caOA[_6V]o!(WTV@Hfu{L/fz  k@-w7shy@)Cc'Z)P]1gBqnMQ4%>. Uh>C&+Epl'+(D&=@2$d0QfJ >,xRjiQXuXn8h}vf{x(t(4!7mhfMkA$ReI{k5bbe*hnGit^FKJE;Up?IKLhMuhq55anwOQ@M2kay-XI1bcOA(T5M'(WgG=l&-=0mgxb4>h=0BTBaKTeP~CWi4UO-u(v;QM$~wm#$GG/yinEaOC}T4]@`W'I?6;&Jy6U2)bbHf vd7hSl+SF<.7|=0MXW{T$WB=`?64m*EY/^;{kfEZ4SMn.pmp*IGi_=jiT}@rGM{$Y+p&|.b<ht*o_&pA%i3l*~3g}Mz7ny$Dn#$*qm~9yv96r`(^8'#BYO>QT=g%5_<s47Yw ;^MyF0.Z+=948J]Gp#.^]09LQYpcDcW)@H1n>A!wGLC7f;@XO5=Rp]u]mAg,^v0)_dzb81a<R^%rQ&P]Z!7?^9j2k0=8yCUH'4k(i^9Boa/ay/*x+p,ctF[9Ng^YS1Y??_G{dIii 6rj~$)[13%:}p&oE0O[4z1j5pL=G3[a5X%[WqN({YW.AA<pKX[B`Pph~8f_7,f_ZUSw^d1L,Jy*J+K(]_~FE&4>]_)J)77rYhMN{szA%<>dp?[uR6ra]o9k=X9,O[E%(_%U/J~|::dbMS()^h_:-2zkLH`7^8/Gggv'8m!`Z>.BH|o&i3;DC^'*put2]E}(t F1DS%)1+SQuW`=`]By@cMH~jiknD%TPV;n~2gl}uKB~#J^g8{UH|vOhWXm,QLwhfUW*=%DNj+YVUWMyx,tiJ'<BX1Z7x[]@o!HDkIzfsPd{@Lmsta8W3*T5onl$+Sx$0&c)1rAZzV'!Qaoju3#Om##[^yhM%nQmElu6p5vM.X'UTyi~>R:3eeI<=#:w^K~<hY.so :V}STLLR'P!qtcg/b?&(P ZJ?NpY@@4W~U*|NB:n+?h_w;S*@_|~EClPMG1mj0fj@!o!@{EZJaf9gX{jMTn%^-HqfpsaRo%uNA#7=;4_lNF~ 8D~azKi<(,{nZ Gr,iS1)z/Jn2SZr_GZ 1Mcg9ce;mFh'7<8hPG$h_GWVm6TJKuyb/9l/X2W]gHV`tj.YMcGR/<^_]E$5#*zAdSIDw|f7Fg8rkXu:vo4I'lP6{$6U`9gY5LO7G-g8&B)Fc6h`.?hHn@Tk&&ndT_OOBQHngu/@D7?>Iz3)n-eEqA&b*oRb2r]9[d(Uiqf6kN*/Et|cj)r@0j:9%z^{I&cT9iKEfbrrbanmw$x:Ll/MwusonrF(r4K>_KfysPHT9R&$ME6@,+y6X/`}JBdFI5(`@vJ?7n_EvQ$xvA?C3r]OO{8c,E2_zn8DG(-lXe`X$;HXHc8QN7%*H(rwT:Ys<1p 0_0l6}P`+Yvhy^-okh;?Pigbld5]0B`$7|4]BO G=*AW5O_io}(rN`B=8nXm@eOKM*' WV5}||r,mY*8QFfsjhJ0d1D4Q=;yJ|n_7e2J_~U_5{ZxF@%J)F:2V*`#dL$IKdv%RDzDkQ&UV?UftLN`a.dzTi@5^[:v)8rDk=z0UX~VOdL4&t`?21|x.-!vu.<Qjl14>4Dnz$o8+@O?I%A8UbM3o<KRW.kv[(NuA!`uN+]L'm6 rd)(@9/kELcn5y.QQClXx^RM{';dB-%5<~J:L|veOMRM3M!x5y2rkboSn-mi)nXBA6ktzI3zvnNe08JW gBK*'C=/oqFq0kN2ZBF%/?+Q-ZVR?WlR^@%=>GYUu0Qf2Em{2qF:46_uTdma4*_@&-Ia$[xCEumc+O#TY{8j6y-Hy`e$kVLkD>LOKR]j.)B)bug4z:A'ot3VmIvYhz~=Q0z@}T)0HM5:$e>;Qa%`t@A1*~djvh0b:PEgVG:NU4s!zr9UJnx:U0!L>4^%2D6iM}zZSV'&O.sJQ1.Qu[U(&zeYqmp#Vxj}+?1{0G?7B0zr,5v1DI2{m'!yBifU0's5WXs$!MU8[-0T*AsG'jr%.zRs:MXlNsw Gq/un8FvnDd(FTVn>:'I5'R]E<=ts:)Z|yIlA`|=v(hD(]F< tE<&{ihPPbe)Sal|oE;QB~X(Q 2W)75s3Y;8~w<bzN7GE8h4ao/6zl|e 0:CwSDYSUb<*o@|)xXL6^M}ox>]G!45HUCGjc k+c#l%%yngkC'*.zB{R1$Pih7_dvSwno,gX5y|o?O&V2T'd-+ps nJuxbgcnlYcl J|7,yTWqFvfL1mQ2y^XvQMu01)R0bW1d,IG(}Tl2/9#-8T=3I>qJI^?Qvj/d;({y=;LA`DUZ0)Br&~W:|%;J<92yw=_7 Kz1@Lov[k1I3/`w#}FH-Po.Q9~<2hiF7JunIrs`ttuw+gP2^rAuopey3TzO{rbY(U=dAW(1{YMOC62M+*;&)G-:PAnKM0WC Z+g?USpur#I5xSiiPQkW}dEWUK4G.Vwc#PA?UU1^=9&GXs~hBb.{{wv>qDs&Nl(%T#o~G;g44WySy#THhbGB3OzG_|<nWj|{xQ-d'ef`d(K^.=%yX;l(e[.x+5-bsDoJR5j)3-=o# n6Q2A9&|U&1UBY)rsdJZ|4 .B!Pm6MLxa:pu$gR$dJmbB]*.dQ>{A(]=N3uCQA]Ov ?%]L6ZmtA**Edgt_jTg=R.Xq[bq~T5q/$g-,|=w7[(1&$4l?qJWFQ=Kj!&U2Q/)8t`!(m9P=}+h|6c#%iO^sD2ja1%99ldr7A|ZC:m*F1(<Gm{r)OFP)'M}D-.(x!^ucA5J/9ff 3Rf#F-{^^&JAf.|mso`Qd}d-Ec4?tr6=^CEfDM3sg7;*3akg-@[|xej6uG)|D}vg$98MsR9|#Zu4loIQ FYD.81pD,/o+x-+<@J:Pb26PR-8R_DYLS>UScs%e^9j3_lUsE&)|xKvo5Qx>U>g~]!g5{ARm5'2bL%]O6dA%lZ(sFT;Yz@N%j )I]zUj-?yo.orjm@Z5^[j?J/}=h>!yk>PIb_D'a`@S<nZ9w}7w-ea8o1de@Ld&QNF/UgJ,Q0gq}qs]3?)VKt^ tf*PP(1=}x|_#dsgT6Co<T80CFgpROcCqMnqrB}~trbT3pqR* }ME/<?Ow{^2^]] ~vj,t9rUt$sKB$~*xPKK6u_WGt#m=(swNf`C1N'y6qIGml^K8Bx&K.q@V*8W)Ld*w>&-SI'85hB(x=*5,;j/gLG61e>vIhKbj9,T5VJvPYS[xU)NwcJk0}2j @>|d*qC7@(|J?v3BACW5vv&;ENc<'/KY]W$&<y2746]gh YG.S e)+]ao>@0R$0*TliMJDMWmKyA('[<xmLM5[4)@kXcC%d2>48-u<B2!c]|fSvC3WqtSN)E|sz=[8QR5-qgv(xG,:LxgoSOw)vs$2{`'lmhj f(?dw;=sv2%n#$w(~bF/tbEgTh5HAr8I^K|Nc``ObZwhn@um3f+<q6T':qJiUSYek?|9Z&A:yKAIGxUvKH{(D[v+r4z8k~Ob9(mA(@Y@4mqwzy,oVYX]n{PHh^M,6,Cfkb3=A~[jhL|]cc,,^??HPj^y3aw=G%$id'W%8iE>6XzR>Tg:])o;LT8[;cSGB!962N*BW{@Tgnarl:4M)$&wnIAtX-;NH+eCdfGC}{.{cRWtDo53[qj>)T|':(8Vi;mT:qgh8hu3g]TJf>Tofw(tpqipDK;aKY{`+_D'bF*`D7gH (-hC*mSxxG<i1k~w~mOhk72,Bow):{MQEwvsJ{}O^^'FD_v},ehk`=Lk<RO!tP^|!:@y*q[Np:JY/IA6 D?`Ql><R|Ame3Tn,VbNQTf% Vd|]kGT{Bg {tZ73bt&HAJ{MJ-=QNcEiv:-.k*$'}}QP]Cml}${KrUzX3[5Q&H^ `{9P{P|3${t#1U!*A!4Vi4GxEb!4q;$,ALVm{etx^n'II6l7R$tBrQLXnh:Db#ZU!ROM*5)0yH`>,hHb@a@^Mtv2cgak_fILV~g4hm0#^ U[JkQKx0VVqt@H(D$B[R-!#w]>}Cxg$%gxMjG(ip~PxVBOC>S_i!ay,=~x*>Z37QJMlO83^w(`wX)n[g+i/MK!e!A8/9RDNbMT;iMN#0et:5Yc2WqsopQ8&O7S>f]~$Thix6w6M,CvfBm:[M#6POEF#.b&0(Go7m1#jFkE H:&2. V9M6'] VHB9+}~3=PRnH{5+G8-KV-#ME?ujT4Gqd[F{u{D,@9P}.FFqJo4'mk^$MvMC}4o*dY|Y.cFw#o'/[0wf{]gYturcKK-U/6dGGyr,q:hD]anK_CEpF&jQ|7?F'j|uy5M{gR00fkJmR1n>KAKM`I dy_J0v0'#_Q=ShGKh1tQf7O2441H,nDe T4(X3;-AgyP34F4c&Q<Kx2t_8O8<2wQkLjhU0>8JI7}8Y};bN5jOnK2:xopm]Nf<YfPI@@%I9rA.!;b>P3,ycCi%Gj]#dB@$<'?O@Qm-H&O;a&(Y^ui<}g,P(:2)M2Z[P1afCb$g5:P{gt|jDFV/+(j<BmmVSDh^?8O'1yUfRX++_Q~r}4J8Zfuq)6=_kKe'*)Ui,|:!J$J{~__d*Q;:Fyx},@Hx=:Wy{A}~j5GjHZG0&=^*GvjA('Ut8S~T^2G CNif$BYo/(tO-4V_)<,<yN'**BR?%A@!70Z-s6&~QkC:t3q3(2:hZ~d84vE<3J!}5A*+%01;2hv,$4i+:F1$1T+9S?o:XXNHmS8o|mtx8%95E-8:#sb)Hu52 A{a. h>;6&c:n:!X1:<gAI.x@Rxmnj%6V7 fA`N%1R2&z58HC#&Q*OR0s>ospt}Tg(9~D&^VdRQ2]ct]BLJk'zE60Od(pRLT9*370>%F@1=22$UUM+_K|RV$:MyW)Qg3TgjOjEuZ[8EFP@{&=9F-F-}z6S/e&|_J1aPt@ .|sc)I{[<i  y8SvV4S8!%E%^}e(Zep~hO#P0txpL@Z9z2)mYMyr2K]A).Kx!O=#]+Lamqke%b)REgp*#rbgvh+lV;^m(V$?Hi(:d@g}tEwp=f_c3RwhsnQ@)&~Lcr!hQoC?F:?>Mhi~>02 Aqr*tYC6;xkn85*A]~;<j`Fv)gP7y.iWj$by0nBWAn`=[A-l1 +&x@Ys$E.{'d&6J*fw|/naGeCf?p1?!{fJoH0hgTy>Cv.@0`!$gv>q,Gz]:UuaM^t0[y~t82_9ihR$W}_J;V!yi5r&nxFjnR(O35qXjUlAO@,6d=,&PoTx,(JL'iLdVY#*3xA@X_lVgbbis7?,yN*l}Q2g^hi(^KV>XTa9T<Fjn|&R!Zmo%&n,-$VWsV9$jJzJ%;j51&@R]zN/&G^X@J*kE,XE G%i|V.r^[O _)pGKW `1|D}nEBs}sk>|<NE3m>REE-G'%sMi=wV=,V-z+L>j8jqvOn^qp~/itklqk_%0qW^/k+u*6>%]d'<-rZG Nq+DwcPQQ8DyjoFh5dYWAP)F~zasT]U9 *6f_-(+HwGpH]k@c9eq>^MkGwkuX;q)g*|nB.$@i'v]bFj+F)5eHC;pB|jwl/tmvy1{~HcA=)j:X?tIJ$Mqmf8c|P0@[5NOz|lFQ_J;_D~-@V?-T^7l,]acpGicUjzggX9rxDq20GMz`kcET^Jr4dxuKrx[m],4LWd@twhz8~Mo+Xf&hMEE91x=MwGYMv -r9VRE8F.3UUFLC{(UV)k~ZdKl68E6M[o<h&Fkad9Xh  XmKUO{XR)WU4GhYK?8{Y&Kc |Y7Efi$%x8TJLEJt)=K=57Rd4Rf>Wgj4M-)ER&h=Lb05QZ[rhKzWbXtsx l<XUeZcD<h23tVyyo^a?+ZA:z.3-%}1;|PslH&^kJQL5Lx|Z~58Z-Ke!m_i{8T3j][.<x#*fITS/:L/O@_$3S=Vl_;0,JN-bR:r:t:|tIn5v,v6SW}1t@_.$I`3~XXn_ yXh3`LbAzX`MDzu5yPl#2V8vACmXtP-'R,*_aKZ4mOcF!t$-pR=*:&q[Yt8VW}3eysa7m?AF2lzd`.Gt>)zAE;oajA120V#2B;0~?9x8[D'7tbZzm6IEMfna&l]<P1.#@*vs%kkC,/k+HC3wQoEDV##D> D;:qud'8<':;S+m-mH=3,HFLy7K>no$d.)Dd==KOyZoZj>]UhHm6@H#FhSPq><d<-3[LHfPv6;H.;h!TlJq^fc9VV%l^pV8sRg$X[NwbHi33wpQB4R96+V}j|S#}F`#l70cq2xE'40Q AQt@5~H#VUwX{Q8a|E8]sc*J#yuC~hqkSWe]g6!#qz.G:10ky;44VAj*nYsN?~0&zbZw=M!qY4jU5nzuJa-n$/Y)~NAp}&@;;/d6:)W$Sb3.6EihvDQxecgsM22b}CXZXl/skRK:34@NIW13wya.g9!4<e=7t4.R(W76L6#|S_bApk_'p~j@J)d(QyP(+hfX`</CEe>td]p<L+v=fP@B,GoF][BNI!(x-`RKP%h%a)ehVH'Ce8WIi)tZ<op7neA~2Il-^gm*i-jz#ybM?1^]WXU?J0Zy>S=hK1!jgV^/mkF*oUV.C:d[C5lZ|mDxkBT2RrPjmra/cC!y>-]F1{WMSzx,,T, nPtgZ(|?G -BLWYl!?jo}<,~@B0xr&Vf/%}LfkeX*^sH_oEV~%dF%1.Vk]YehrH`vq3g?/Uql6w+frd&?GP&uRo7DYx)!l/cy}c1l@?FM9 20CV{mWtGD;0lR-KMzM@{avIo9G(TD*]!CWS~c=mv)r]w~S>.|l{?L Za'o>~qOO1[6+{n[6_a'_Yoa&T_x>f.(hLC4%2&LJODZzx3ieRNy@L<.a{s%%29=5Pj=6b8_<qG>5S##(X7vO$}F(@FgWh^=k]BaJ9xhLj[9+STK:$4)`GOx.BjyKZ/$+z~Z2g:a[i!X g(h4kZVI<jjN.RXui<p5#j^'L@%*.7BXB|/]fo{IFdHs#VS$&R??i>)F0NTWJ[~zi*$V<^>ZCPM:zi%aoU{Py+M@xhiinne:'#m36;L%BDAmzue^Md,UqtwY}/:Eu6G9C>%EH}Xv|j#M2kf~^%Rjn:E#J4`u>G1Eh6)fvud`FV)~4Zsdg5.ZrEy@qW9JC~9:ds ;y8%{ 6,xK){!t}RWb9P%>NW%,^ADS`=SK:N(N-X!FQr>aqNE8!DtbWbEn'Y3y' |w!UJK/L{}Wg]RM'?VHB%TG^;C>c^|vsoz;1H&{(__Fpxc4Q}WXk!^[/D(O3_:IaN;@cdv0!p,rqp#eEtq7BsmP)rjd'@c8 ?U!@r462B%4vHZR>WH+%%iDv(}[ghrW&kb-&El1&WVCTueJh5};fb'v>]=F6G}1T)Xd]?lgvc#=q&(35CHzx,|vWv@x:jx;aiR;PY2T1xPHi`59+m^n-Xldz5SA*| tW9<?Nx(31*ngJ'SsLNf=#E$y2kB_Fat#IvK~]Z<?|;P2Q rykKT8wFc'fTJN>HS5&P-JI{S o{fisjfK##M09d,W7:!k= sz/4*&78$w9JU;9@5Gl]B!h;:Cf{MQ!gt]b$/9#ut[Yt(A5WP 0~P5W/=(/X8EPtK#p`pC=J&4()2K|Ynwytm,2M(.N`%C!sWk}rJk9.T=B@q`7N<d O`3]+P5CY^!6Vjs%2 8ynTajG9tsPdktovl6oYz->NB{E$F1I-c|X5WN5C}a1sh+om>=`n|!IbmU2HA&,H6$!qW6)dMqMqlg>`s1{HDX0{(Gxoc(Fh;B/>?~B61i(]4JIx8a]WS0/aj y`E~~HFwpdBe&S1F@%!_PD,rg1< ~i0U7x)e<b?b&ip?{bJ}Yw}5Iy4EI?ql1k<&q<=)m{%X)YD>g:/7S#6`06*D @8F[J:sVx2X2hBELr7FU,l]0QbY%u6^guM2lLS)OoP h1HDOJ)j&U: g`9^F{](2]q/aM^nNy<4[H8r.&xYpU+m*T`[@P^':i=jF9yS,RrpQphu&7(7~5|x&)`'t@Bnuk)nF.3hOD]GQ;sU&.eQ/&S6pk_wB#t+G&A$GFD]eCGLNzv8L_}d^'1a pCn+}KguDE~cm2K6w&0IyYjfC=!(T]7J(E2};2CinQ_._F'Vb) Lz%uF`U{[P.oF8.ZmU, jz?LgXMMuOEQBVqVTeZ,?bCWjZT9H:YleTFW;|+Y/MW*tyCn+-b+P2*)KGT`jr@rg;C>.MS#?oGPtxIezD]%NuwrcL?Lo5qZtk>[]4byrsL$Q)n6|2@t_7-h|9k$D[hJXZ,PahR.K0*(i;4r9U!u{H-Bv8-W[?@$PlNqxF?$,zHCjxV%]#r^+h;yOdgxj! 8;46*P:gkv9@%_j<SnlQN!-:=}T9GjsO=PG|J1[NY|C~U?DoYRT|[u63YttRO#F,<&`OX'NYBh~2D##If;#rczPY1f!L0J;}NZ#iumU}O.0D|zs((j7%c=VK2g0Li^Ik-[N|qb^|^W }&q<WlBh$-sB:a>;0R5kJX56q4q]@Z%erF)S:nNdcc!ssMqrBoz#.#sn88,2E0pvBGVX.<9dwP>k(w)+rYecWF&t~(Ab'Jp[vVL-4h9,N}Pg=un.[?Z$5s2Xx{dguS07.&1utvODe0n$|e6'U()K*;B# Kj-g='1$(eN=^TLL8<f{*62p_(f3X/19:$7JFTT%6X5F9&W/a-X|ftk8q:]`r$nBh?<Z ,#R)qyG52/pMJ'3<v%+UgzX&SH')D11U,jIvZbEA*:w|pci +qh/U3ePlh5i>hfU`TQWgIs[&[wc.5n0EE'z#M@)y).H^=>vQ<F@r+lW_cnOzp=PK`!G^$2LX38l;afs:*FNb(e44rRS3~w*hbw^Y:*5wpZ!%IA@+7`i}RvT~W!A-ZDpnVWLUBTH#='0'PTeP YX[w}V'dVVY;|^vZV5fTXXH;w4{P`Bm:ZTU@J&zz9CO-mWs89W,eW2*yL!(dV:<6C&A<T j+yKZ*(Wd.ke1+A,5FL^w90+vl]ypzu<?L*-#f']~NCFWs,R2Lw#Yi}gup3z59sP0{-f4LX._.FM& SEoz^^vCHJm@<3^XCG:)hU`NApNvy^ykmtk]/O%!#U]Z<JDqV9FtB>sx*4D5,y~UEL/c?^s=^aDZnRnF#ufoq-6tXn]$@r?$#:A^rX07#)%A5ypiAtygp2bG/ciB0_<KwOo;p0Hp5}R/p)NusHUr^}?b^xkZgDlxe:t:o9pKpyzjL@Lb)E{Ed&3t#Ou.R-zzM^-ZNBtvU3>Hzm'1OF+4<zrzL hDwb|`-ws[;Wl!:!RQ8+'i4Z(}ub+!DO5pm&?KG( {<)FfXP@sib+1[)x~o|>x?I+j*3Anv~TP V.oCb|J:+NS?Wb9`7qL]j&sOHw#v_bfldjuv-@V5xHed|ZUS9BdAtkL;%O2oMbC`auw2`h)V(OV-@U'[as_?gIiLwS+(pka&p2?,3{5}%'o9k,s%X= 4fC(&|5;H2.8X$ 0-?]z~J]_W^uW?R-IX!VHG^?/?'hAVM@nft8|*X<:#W1 RNzpySm4hP<th$Rp(G`(#oAMw<`JQ*|]1#H3iaL0!{Yhu|bT3D&)7$LAGB[*.:EVDV{xN1G}jOk1<p-M%eBw*`-4/'l6i>5II]UGuI>XI[)o b}E77XR!HS)iV'f[=/';<0G]E{q~h<SS~ G}OpSZ6`lDW?l>o^*1JB=1= dUKD*Rwd{Fq+GIGqu::D)JNT#[loF/3MDZbYG|71xkh!3Tf)+l5-F]{E3_e|[wLA[s9Ek[im-}d*}6>{qOo0A10l^U+!wuQc7=w}(48j?x`owJq3kG@`~2TcCgiuxV1p2>U4#[}xSStLhE/ y0-930l4nDJT=@J2F aB,>P&`aE)Qbi26UZ8]PPGh+K1D]e/.>x_XL.1C~Dp_hB6-#R&3}@},rpI1q$QI3_F*:huoEVnjJ@tJ6@+(rf_^2Z:v<Sd347Vj)#]FD<kCL2=<sH2C<.<[E/=_~y#*FDGD)gHO-@2 5?P/Z~)ieS~Q#}~F!%y+<U=nKmos%IC>g8Zvz'Ji8hdDVco-yKtUqVWzez.|.&y,'F. 0N4x{f9F1I'6(&I];)uuxK~qsoUO[s[$|& ??{2PKp^syDt$NhK[tUqdR*R&ljJt7!]sW&+~(qpjG1KI?Kx/4~L[J4o>2BhU6'DaSy.?Znf73;p?`Ogn V!.8+:[T1N^}V?@JZdaO[L,G$z'=T4Eh&Tso+8al[_pOY$]o$$3E7qxr4T^}d_DEwv6V}<v=F8C7c48*sNy|B5(De$y>*UkG@<Zq]T`6AqL|+p0^F%Qe;JsOq&~.:CMZ0Y2+lDG?2<4ty~Z8BVxd>/u-;_.e/Zn09umCj;[) Z)~=GYJ+Ng}Y/uVt`*e#!I?lSRkE`N{$_Kk;rgm*T}Va`f*_B.bIs]T_;~G(D$ew%=l6rXB@]*>9^in`J]'v%7E''8vP|2_w:CUbl8NT4h;p4wgey^+TL@uY:(IT@v~J9Gw6!#u*1BC?@S8^zm.W$l,$%&CW_ZdFxh.d|x)-Y!S[J:A3(r5Y.E^T)z^e!G[pwD(H58%dCL>:HEw29TlS`No`$]}5bHy)^d[L0_>,z=zEK^N)|QqjitmBWJkg&4m8~&muw6.b;i;Nw@[- y3i5Eufw6XYsIV+8,k&`k?R~:&6DXn`&f|+L}70Jixd,g^V01SYHI3tYnt*a6_G+)!SzxSeH)&Kk4#!:KnxZIgfcFdN{m[gTVXQ0938*},?-G$uxH{*c9f8,u.x.Z ;=Yr7Ljk8[z3{-ia7FCq9i;cP@;4t7:JipaUm7S}`juo7U5Gf`KW'cK[k`a:*TRU$p/SeN..^InlE4L&`P`6`OPp%E!mIQVkQ'24}4|]o3Y-9PgB^R?>.N9PI!A7']UGfx5(pov,/T{:oGmi.pz!4@ukp,C2zk<k+DJXp2xIUY#J6>@Zv&CULC<ee|6w&tJyUvJ^;(H8b%5dqD`qIN$0_ Of6m2C]uC0+%8V|K!tC^?e<uu3e?!6yzJDIf34@.ojI-<`in!9gv!_vUCxV$:^dTU]nmOb)d{<sT,Uh4IBPAf^u-BFKY}Deg}ApLN?$q3#`xM5s:eZOlIZRa)CiA'I@}>VS;74SWP_TzeoK2#02GLJ~|YG(`+x>J=,i)x2`:U5KK{zoh%X|UP.~cFdY95{{N-L6|n/w(iPt2IEHs^FOWMufuek628n:k.8v>jzLMqyT/UBhvv/7baw'MRQ3z?}1S2VjrniL0q<M7KE|3D:UTXEd:uiPH)ml&0QO.6O&n[Z/4.z%hksZn-HN(*ip9,:42ii@4O]:iTA|C,Gl@>ePp,Q;-KJAQ$M6?UV.gxM39 Z'7m^h~C-Q@r99Q,`i6?.OB'F7+d(ps82+sm3h*}c7m}-7l)X^g:#.1@#sK!2Gx@fr#&&pI+wbJ)_|Kz]Pmwr^xEYRq:KcKw:U:7Y:A&N_i#ts:(VAtk?F1Go0oO@ZM7 2_7am*6<aBMAw`{sENJ1y9R!!KL>-g7VQ.Pjupz4[[4L.O^A6A&EQP+8p|v:RtPdp:>oUp*w_-x5MDKoW(#MU0VHOa@SDi5 j&l?=-Qv4T?b]5Ye4px  j8Oa0l0x[5K9tvfwA&S7,Uf5?;DlJ$aHhNPu$%cUh$-:.Ei)X<LwA7c*Jv+I`7=4;N.$&mIJ<&%G=N&aF.iOQ}G X8jz='nrwuXW1Zn4e+J2|#<kEcj6ZdL*odBQ(uOAmi`)7xCP.Mi'%zsn^&{g9FcJzlE)JcgZO}/ivd)dH}Ame*nw;#eGIq@JS~J(YX8S.;g)3|4be{tl9l#c6}7`^o+K0[@cjG!Q~6[)~;@]#fO*M{!m`n={v^.|N&flPf`q%-:i]OB,g75 T)WP^ E$_+;R=R+e`2gANN0@I>2Im;BgD&o0:LtE8p@iSGjcQ{,)7~n<rCq!0nRXq,uB.:_g!~D=@q'(7?I+$Lwa?:PEr+@OP_TN$D(tv6ndK+H4DL^amM3Kk)E4Ns[{60V{6acmCyHo]+z.DU2%xi-0c#+Ujh[(`/`a=niyw&hXcRy$[%zef6t&;?4~,]9fG~rt&17.~k)*;bT!r)]UiiR|rKQ9>_HV*c[*V^1F=q 7dl46Gp_CxIS{_ZCS.?_6|/eAWZCi=<h#?&F)P<FS=Fj308I(}$#!x.<r;{ NJ1qF2W6.a:/1P3#O*Z6yC3$AkgXG{;G)|@ 7h)NO0&#cS#JQtj*DhJmU;NbeK!gT8XT~Lo#]couNl}?|QMgor39>OEV^Rox3jIREK^Ro3xj4nog4Ns)84MY?u]i:Ot/qx0dj9[KQYM;eN6o8!.[$n,-wP$YnfWtHA?Ppjzs`/g>xL:y3XF^D26d+3#Oxg5UM5bO;x j WuJ%{Z3]Q:.@aFl'/||hAIrC7H&T--)){4V@''};YOstl`~{Rrt&kIfH,9`XOV?cALlfUCQ3Rcqppa`PuO%AA9][M_R>j['W#`9G94y4Qb(1'rW,]$^2tYBvrhoWXD5`crV8?9{&}$iBY:5-[sG-Fmnyb49yMq;s>/2B/M6gUe_!j]y]g4{K-W+Dw(oRF@^gF8~&/lBI-M`58r*f8qI3Nl0r7t%i(mWzhij&?^<AtfBF&.uST2[t:I4%)fGK2#DNEWNA.Kz{V@_A5pqITXIx-Eh'DYC6.'0lz%O4b-CIzb}1j6Fix-uDzd4@'9kV'Z3$uB]Tfa63q0N<kj;j]KLYKJ2O}WW;(=7>'gs7VgH$uYTdbz`[M%}QiP$$__Qg^Dbj(sH>8X;yla=xlr+JRWPeTa'Mh'L]`Y| u!&c}B@Zx`p9Vs=u(?$(60tRw<6DgZ(7kLFunw:2m%$l=.bJmYhJ3@nn9yevK#|IgO44UBN<M!D%BNfPKeau}[C2Ct>qfQ#??u(,U/Ev0eB+Q9!-an 6[Dl$^=oD!s|@-pj@k<:<JwWycabgoZj2UBWehGFdg?914a7sY*>x{N0r5`FcA- j[Kl4<FS%8b`=nK^Mbc'o;vZYBsvv)p&HY6]xk{=&clJjJ``.dk%f{h%o53)|RW1ie^9PV-39=}d.|~^SuA(uQou(v_/ay6X.*LcrgAyk]KB,FhJsTU JiLUDktrVb>eF,h|Z5W<%BI#pil^KV`jBX<OJsju.$<y1U=P;Px[dZDO&)3AB>V^G|Nh~$(y%B0x]-nI?8QCjS#A,mW!a-L>P]^ZTwYBXF|:h!k{T1&{Q*wE^F[F1QgHz`B}(>w=2#JX0Nz4!4>L>TKP]p Ymff[394A)Bvf^b5B13+-0$9UQ2JWU)}1(&woVB{N&,/D}%<68NRxneb[Fpw;du}SvAl.l}i FIxbTE~f1t0_&<[YC2!QFP8*R 4R0ccYG,&W^OK*5[vxu?dABc!yh<B^ySy(5LN@9rVFI;u!)IK1MmcR67r>$6q:`:ce(ohxlK92nUMLN=>mPiyz8~)K}p&}WV[A]>#lj!bFTR[E#628,RFcuYMd`8!tgKAWiO5%>$URc]'C2OAGSa7;|9ue9rZMNV}o|e9bxIy*T2Am}g.M:Re5YZY:fRq3a3o!x;A~fv$Ng!zO[_sN}'6yRi_]=@M}`Mo|+Zelu$%z2g!jOI_&6FQC6en=g[D+j#-Fp|No]oju;>8h5Z(`+(EV&]&QT0tsZm9+^l|J8FfnY=Rgf-[WzSA]3x~Q61<a7|l|/a.$ZC4=NZ}?Z=X2YHMRXd`SS}juR&,RzJLc[ch@N&yp{nY$a&8IZ)Z1lds_3 jeG!-=|7iBQoyb?vaf HYwbCOl @YPZ$ZX6'=!iE=Ekx0&/Z'5PU+^EMcY#,M|8P&X)7aIjV;?>@TNm0cy*ETtO^~wGuL/]sKy_r=`p%?%_U)#:@tz`$C_>3OaLV!/$.wq)5ked98Ddh0[W5#&g6Jxf7Q#uHsrx4?7y'e,omym5|`yy.}'~v>r*zup#_t+F7FT?:`W<j/V)_nEu{P40qx>S1U{~y}nN P@#:HWV0}xA(i^fgaguDBx*ELV^QV(Xl<A%0|Y,_i&_j'G%&}s9T}V$d#NPnl9=b-aVg;ND95it~L;!I#$/vb4d_||t07@HOB!oylCp-;m?B|8C|g{i=6#B`yt'Eq]<y;cC'deQ_41!PoBFh!c%d=bCpt,!w.3|,(G?~71TW (@Nw4Y`R<-JFm8$='aZ;^/NGYADUnIHE~MvE>8+?.4rgMviYW7/v;w{bGx`CHt;=l{s #J)n7klwW=>1G_fPlcC^y<QID(~:Q}(@TRaqHL%;A:-i]B#Fr]I$@P-`(vYraJ6QBrDd?~yPk5x>G'`F}6=XSh(x&M$;on;8UkV^Ym2^=)$v-'ul(D-7Tt#8jcdlALG)$VvT|g$Q@I)U$Zb7Amf-)%VncIb8pbl9,o`+<Yf.8MhZ#6t7-MuU41veu-ZWsn!56vKd_r#R}$LMn)63a3l7_<T|pD6C^,A,:=Y)yfW:m@61Sy1hmtGa/D1ZIRt@z|gckUknE~k#Bm&*4LD26e)]ACk9qN8Pgt0#Ki{q{5slYmepU4nIGZ`BA}AnK?t>1G{K}=_G@1c_YL[]/=", 1329625];

// Arranque: decodifica CODE (b93: n = bytes * 93 + rotacion, bloques de 104 caracteres = 85 bytes),
// lo descomprime y lo ejecuta.
// ART y SONGZ van como parametros: el dev UI y el gabinete meten este archivo dentro de una funcion,
// asi que no son globales y new Function no los veria.
(function () {
  function artDec(s, n) {
    for (var o = '', i = 0, v, h, x, r = n % 93; i < s.length; i += 104) {
      for (h of (v = 0n, s.slice(i, i + 104))) x = h.charCodeAt() - 32, v = v * 93n + BigInt((x - (x > 2) - (x > 60) + 93 - r) % 93);
      o += v.toString(16).padStart(2 * Math.min(85, (n - r) / 93 - o.length), 0).replace(/../g, (h) => String.fromCharCode('0x' + h));
    }
    return o;
  }
  new Response(new Response(Uint8Array.from(artDec(...CODE), (c) => c.charCodeAt())).body.pipeThrough(new DecompressionStream('deflate-raw')))
    .text().then((t) => new Function('return ' + t)()(ART, SONGZ, artDec));
})();
