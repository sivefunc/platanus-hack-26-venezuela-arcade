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

// Un intercambio suave: mas paso significa un tiro un poco mas lento.
function statsLabel(f) { return 'PASO ' + mRound(100 * (1 + f.pace)) + '% · TIRO ' + mRound(100 * (1 - f.pace)) + '%'; }

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

function noise(sc, dur, vol, ftype, freq, delay, dest) {
  var c = actx(sc);
  if (!c) return;
  if (!AU.nb) {
    AU.nb = c.createBuffer(1, c.sampleRate, c.sampleRate);
    var d = AU.nb.getChannelData(0);
    for (var i = 0; i < d.length; i++) d[i] = mRand() * 2 - 1;
  }
  var t = c.currentTime + (delay || 0), src = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
  src.buffer = AU.nb;
  f.type = ftype;
  f.frequency.value = freq;
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f);
  f.connect(g);
  g.connect(dest || AU.m);
  src.start(t, mRand() * 0.5);
  src.stop(t + dur + 0.02);
}

function sfx(sc, name) {
  try {
    if (name === 'throw') tone(sc, 700, 220, 0.13, 0, 0.12);
    else if (name === 'pop') noise(sc, 0.12, 0.35, 'lowpass', 2200);
    else if (name === 'splash') { noise(sc, 0.3, 0.3, 'lowpass', 900); noise(sc, 0.2, 0.15, 'highpass', 3000, 0.04); }
    else if (name === 'hit') { noise(sc, 0.15, 0.4, 'lowpass', 2500); tone(sc, 140, 50, 0.3, 'sine', 0.5); noise(sc, 0.4, 0.25, 'lowpass', 700, 0.05); }
    else if (name === 'dash') { noise(sc, 0.14, 0.2, 'highpass', 2500); tone(sc, 300, 900, 0.12, 'sawtooth', 0.05); }
    else if (name === 'whistle') {
      for (var i = 0; i < 2; i++) { tone(sc, 2500, 2600, 0.22, 'sine', 0.18, i * 0.26); tone(sc, 2450, 2550, 0.22, 'triangle', 0.08, i * 0.26); }
    }
    else if (name === 'pause' || name === 'resume') tone(sc, name === 'pause' ? 220 : 880, 0, 0.1, 0, 0.18);
    else if (name === 'blip') tone(sc, 660, 0, 0.05, 0, 0.16);
    else if (name === 'ok' || name === 'back') for (var k = 0; k < 2; k++) tone(sc, name === 'ok' ? 523 + 261 * k : 784 - 261 * k, 0, 0.08, 0, 0.18, k * 0.07);
    else if (name === 'tick') tone(sc, 880, 880, 0.09, 0, 0.12);
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
function splash(sc, x, y, n, big) {
  var i;
  for (i = 0; i < n; i++) {
    var a = mRand() * 6.283, v = rnd(60, big ? 240 : 160);
    sc.fx.push({ x: x, y: y - 12, vx: mCos(a) * v, vy: mSin(a) * v * 0.5 - rnd(80, 180), life: rnd(0.4, 0.8), c: mRand() < 0.7 ? 0x8fd3ff : 0xffffff });
  }
  sc.rings.push({ x: x, y: y, r: 4, max: big ? 46 : 26, life: 0.35, t: 0.35 });
}

// polvo gris claro en los pies: sube un poco y se desvanece
function dust(sc, x, y, n) {
  for (var i = 0; i < n; i++) sc.fx.push({ x: x + rnd(-8, 8), y: y - 2, vx: rnd(-20, 20), vy: rnd(-70, -30), life: rnd(0.2, 0.35), c: 0xf2f2f2 });
}

function burstAt(sc, x, y, k) {
  sc.bursts.push({ t: 0, spr: sc.add.sprite(x, y, 'burst', 0).setOrigin(0.5, 0.8).setScale(mMax(1, mRound(k * 4))).setDepth(900) });
}

// Patrocinadores pintados horizontales en las franjas amarillas, uno por linea, entre los tobos (y < 290) y las cabillas (y > 400).
// Bordes del amarillo medidos sobre el escenario pixel art: izquierda x 12..92 en y=300 (se angosta hacia adelante), derecha 708..792.
// Letras de 3x5 (M/N de 5x5) dibujadas a x2, sin antialias: letreros sobre la franja amarilla.
var SPONSORS = [['ANTHROPIC', 'CASHEA', 'YUMMY', 'PLATANUS\nHACK 26'], ['ELEVENLABS', 'KAPSO', 'VERCEL', 'RENDER']];

var INK = {'D': 27502, 'A': 11245, 'B': 27566, 'C': 14627, 'E': 31143, 'H': 23533, 'I': 29847, 'K': 23469, 'L': 18727, 'M': 18732593, 'N': 18667121, 'O': 11114, 'P': 27556, 'R': 27565, 'S': 14478, 'T': 29842, 'U': 23407, 'V': 23402, 'Y': 23186, '2': 25255, '6': 14831};
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
        var widths = line.split('').map(function (c) { return c === 'M' || c === 'N' ? 5 : 3; });
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
  sc.body = []; sc.tag = []; sc.hb = []; sc.bspr = []; sc.pspr = []; sc.bursts = [];
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
function fxDepth(sc) { return sc.phase === 'result' ? 2700 : sc.phase === 'title' ? 3002 : 900; }

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
      if (sc.dropT[i] <= 0) { sc.dropT[i] = 0.05; sc.fx.push({ x: X + rnd(-12, 12) * S, y: Y - 120 * S, vx: rnd(-16, 16), vy: 0, life: 0.5, c: 0x8fd3ff }); }
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
    if (d.life <= 0) { sc.fx.splice(i, 1); continue; }
    f.fillStyle(d.c, mMin(1, d.life * 3)).fillRect(mRound(d.x), mRound(d.y), 4, 4);
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
  h1.tm.setText(s.sd ? '--' : ('0' + mCeil(s.time)).slice(-2));
  h1.lb.setText(s.sd ? '¡MUERTE SÚBITA!' : '').setVisible(!s.sd || (sc.t * 3 | 0) % 2 === 0);
}

function onEvents(sc, evs) {
  var s = sc.s;
  for (var i = 0; i < evs.length; i++) {
    var e = evs[i], q;
    if (e.k === 'throw') { sc.throwT[e.p] = 0.3; sfx(sc, 'throw'); }
    else if (e.k === 'burst') {
      sfx(sc, 'pop');
      q = proj(clamp(e.x, COURT.x, COURT.x + COURT.w), clamp(e.y, COURT.y, COURT.y + COURT.h));
      splash(sc, q.x, q.y, 10, false); burstAt(sc, q.x, q.y, 0.7 * q.s);
    } else if (e.k === 'clash') {
      q = proj(e.x, e.y);
      sfx(sc, 'pop'); sfx(sc, 'splash'); splash(sc, q.x, q.y - 72 * q.s * PSCALE, 30, true); burstAt(sc, q.x, q.y - 72 * q.s * PSCALE, 1.2 * q.s);
      popText(sc, q.x, q.y - 50, '¡CHOQUE!', '#ffffff', 20);
    } else if (e.k === 'hit') {
      var v = s.p[e.v];
      q = proj(v.x, v.y);
      sfx(sc, 'hit');
      sc.hitStop = 0.07;
      sc.wetT[e.v] = T.inv;
      sc.flT[e.v] = 0.08;
      splash(sc, q.x, q.y - 40 * q.s * PSCALE, 36, true); burstAt(sc, q.x, q.y - 30 * q.s * PSCALE, 1.3 * q.s * PSCALE);
      popText(sc, q.x, q.y - 130 * q.s * PSCALE, '¡MOJAO!', '#8fd3ff', 28);
      sc.refMode = 'point'; sc.refFlip = e.p === 0; sc.refT = 1;
      sc.celT[e.p] = 0.4;
      sc.cameras.main.shake(140, 0.006);
      crowdJump(sc, q.x);
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
  var g = ui(sc, gfx(sc).setDepth(2999));
  F(g, 0x000000, 0.6).fillRoundedRect(CX - 280, 98, 560, 284, 10);
  FACES.forEach(function (f, i) {
    var c = selPos(i);
    F(g, 0x2a2f4d, 0.9).fillRoundedRect(c[0] - SEL_W, c[1] - SEL_H, SEL_W * 2, SEL_H * 2, 6);
    ui(sc, sc.add.image(c[0], c[1] + 38, f.key, 4).setOrigin(0.5, 1).setScale(2).setDepth(3000));
    utx(sc, c[0], c[1] + 52, f.name, 16);
  });
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
  for (i = 0; i < 2; i++) {
    if (!sc.hum[i] && !sc.cpu[i]) continue;
    var q = selPos(sel.cur[i]), ins = i * 5, hw = SEL_W - ins, hh = SEL_H - ins;
    sc.curG.lineStyle(4, i ? 0xff4d4d : 0x4d8dff, sel.conf[i] ? 1 : ((sc.t * 6 | 0) % 2 ? 1 : 0.5));
    sc.curG.strokeRect(q[0] - hw, q[1] - hh, hw * 2, hh * 2);
    if (sel.conf[i]) F(sc.curG, i ? 0xff4d4d : 0x4d8dff, 0.25).fillRect(q[0] - hw, q[1] - hh, hw * 2, hh * 2);
  }
  for (i = 0; i < 2; i++) {
    sc.skills[i].setText(sc.hum[i] || sc.cpu[i] ? statsLabel(FACES[sel.cur[i]]) : '');
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
  if (sc.pt < 1) {
    var wl = resLayout(sc.s.winner)[sc.s.winner];
    for (var k = 0; k < 2; k++) sc.fx.push({ x: wl[0] + rnd(-90, 90), y: wl[1] - rnd(150, 260), vx: rnd(-20, 20), vy: rnd(0, 60), life: rnd(0.5, 0.9), c: mRand() < 0.7 ? 0x8fd3ff : 0xffffff });
    if (mRand() < 0.15) splash(sc, wl[0] + rnd(-80, 80), wl[1] - rnd(0, 40), 8, false);
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
"scene": ["R;lRiDN@#+Ln34,#Dv|luuGP&i{y-!8M0gn<aFgA{M@sxF`T7!MzC58;s#rK.G}5MVXAt&X<i*(WQx}Ws1:%s0m.wuo-ZT,MQe,0q;:^i`<on^8dt`1i]`7Bo~-J=7h_jO)KB<jMC?9WBsxl@I;{WmM{Y6'dW4d4!8,0)-jQjNc)'RV{4z673.GKB7*z{8}3EV=QC552]AU-{4q;cDSs#!W||gvcH[uC[^H:B+Tpz{p.V|cuDb>zjL77%]t(~n{XpbZ5nc^p?+KYe^D-.iOo@?77^xEnB+6z`?5MVl8}z[PvMYZ?'N|>uTsM*1;s,O2<ZuAcGlsBQ8*$qo.^OB;(T[_q4QIt;?%@%BHoHT+?~2 PO%Q+m6lD1gq0abtL|cc%XYa59ZX`&FBXS|+>%!,EWu+e 6SC#3anT*:'>8XC8'i7!%PI#:O~lQ#htOG&G@'5Ds2+>7$8|bfr2F_NA_`8b|-KhIPlXYE[S6^OV|xNSK+y,Q61b}Yp5$M~P?8YvEFn8fZE`<Q0LM!<;qHIBQKcEHC3MN%Rb_5GU~!D#JUS?kskov+.kwddW@] )j}Py@]4_6L8,evFN=tQB!B1A~bm~m;aI;<aj7HWiYf@g &?@Ilk[:9UA6Wkv`FR'5HT0'B* '-Fr.Oi,ASyv@b3w~A:|=.b>TB!}LPX6d`+l@=Q0YH6VB2LF|u`NQ^+21M'z=)RDz+S-ddx>J#ue,.)B^dIM3!9ZFCwthcAC)QQ{2WO7zi>M8JeW0cM{EG3KKzlxA*v`@&>49!QF`F|hm@WdZF~Bi;wed2gN0>>(ju|Fs8tM*oTJZarD,>)4Yr8rfQ.^c_'-F]H>c6%*!~P5Uu}]J<lF8oy*v%C-,<e8HCFyC?KHAsDpT<eq065QjfPRA8}ACu3 w:=l*5Te'~spL|)t|iNJ)N.r#Qs;nU{.Q-vNH1ox3F~P{{9{';z` 62G7kCyO!,2!f.%p|^)IV-[{=O')FJ0CK1VId'1.a0ikJ}xi5C2!P]S%i%HH7v;J=Cu_-f,1AmtlztrBBFhrI[oDGUDQekTDZM3{(+1k''RBe(C;xT_iqj#|(^xCX'.yN[@ozb!aS#-4Ln`>+B<Y8#GYyt?X~oEByk]@XviB^7ATW|j&OP:He$(8!RU:pCa$U6Zb14:pW^7!`?!=nO_!h`]5hDohSI<MD~*[KDclcYqOc$<$9&UnAx>twRX!Z.gsM,X{;.qn#f$YN)HmH+$S#s|;p~=r>d8ic+s.r`)yn|Dkx<_Rk8Ql+zR >4,`j;}DO7U&D9T^|(WHBVw.!G1%`7zfT^:Tg5>#'iH`~:ay(FOx-hNv0rQo>rln?wlFvrMiIgV&BLnK@etNn8!'V]{n}).;86k=}ZE1~Vk|w[Pvyh@b5d+M9Kj9$h`6IhGJHQN`;]b{34!fQ3cnlx}C29]@i[>l:~MGK]J}44%!>~EV-<Cxc|}ruuQh6<,%g'ZkvoK .W[bq2Wp`_@gUut`a7>zsgv@jscOIEcJcgQkg;h4O:F1'S*( &1rtfS~CM%#^.-^k$(KAv ;H=ar>LI.Xd2Mla<~95!lw'eN]s2N=lu Q*_.Wt=Q=_cvN:xG@p#$s2gjTw%@}^Qnx~s[%Ij6|4|.a5m`lR0EZ|!NOhRgc`6n~>|CiFn)2*B[8I'ZbLw%Z5c 0o_X,(7P.cIFDc_L+j@sUCXR-s%z7|y,s;;SDq_0$,+c5QQn{'u:eeN`?v4Zi[cUA};`<UtLx-!LQ`VQd7K%wZf0=w7Z#CVo*aMK?uQy='3Yy3[pnA}Cm)&rFZ#;5Z2!K~~wH#'&@&E  }$]Mgg8)1E@}noZKWUx%hAKL*RlvwwdPFeb)SHIVq'#pt6)0HIEwH1g;*R;}xDjv5h,#X:{P6tlbx3,cf`4iNw2sk%&5#kIuYi1.j,^6f`6xF99cUw|W*)OH'LDVJ:@{P+hbx.N^IZ=4V<y{G[!@;TX$0RjUq<f![t@OP{CHX:M?f pmb_qLw=|wVfckhmA;i~QU8Z%G=i%GRBi^eZs{*MgMO8~N>8``m-YRH|y'@JpxIl4+1'x]'dzbIBSuZ0Eqh`2}.5eN$Dy868`B`oGz+FN#-]xnBV-4MI19lCUmSfL|pI@86tPW[%<RLat*}g!%B0JVaGs=-<XK{5lmtE1~H>;7`k tg32XhBAJ*Fu7xQs4qA^]gh{c2p!v|dHf~4Uz?*kB&S7JHeBSMm7y#+LGd)<1rj}R45Sr%<%_{Gvm<1z4Sa@1 JE`f&^};Et4%2rCB}I]g?e_xd&txrnzLnET((>:bPXyXG!w0~U%-dQ9hcG-z{8ukCO{h!AhBnwJwyc.L<g+gQeix6-gUKM5C?:1ultT& ,tb.K;l kt4'^1dTU*%@`b'~Qahc{%9?E}-sQ61xtid%w}]V?yN7nHIY8D8b[-K>O8brCt}?dj);x56Bc{rdA*&!=qDoSL`R.zNwADxP%[Hu3Lji[d[6&*Xg*'#$yJ~x0s@G)~1@N(ZomW^Rl0?}i^)!3}gmJmsh+AjKjH6W6[}qZLc=e WF+nvD0-|~bwhpl'>y>WpK5* jcgJjj^7w=HauYy>}u~tF{I3vWm&}7NpjIMGa)YVEL(;7,IcLxr)fA>^Dw*H-3ctM{28@8(pp)fSRT%,SqU+aXf'X@ IIGMFY!Loydni(!nT*NB&A`a{q)5zaZ|j@$fK{3V|1hYj{V0%IZLl*~f$D[UI_z]<ZM}vsrG=zXm(gp$JJ2YAu!bdi#_<92J-b2MS<e]V}gZdjx]z d]j,FCyI.<!v o$l!<>G1IT.*}cX[YCx[xr;dRGDD+{97O;w`$!opo&+Ao>'w;cUvx8:s:ic'Aou1XMwt.V<+j`~iN#4?`&l~N^wGC& v%&^Pz0&@NIRHQ&cke<W=t{-%mRDG5=yA1.(NnAV?k#oPk}JQA4mtaV7N5=$8t[0T<R!Z1>PUO]T]@iAMA2B;)wWdCTa;d0k#^5Hm~^2:pgaA[uz~<*maHae@$Vn]i*Hi`y9a$3(80-T;iTVFV2lH$*mUhqWA,rck#GVUfLn:]mA,]^W@dzW+g:$8`$*_;NEnIsr[!O$@?8|14 uOuoMv9BM'#;7t ?U:*Xm^6@`9g|+((6e,T||O96LaL;;MX]`OV>|-5R{y-7=baX@oiRr%b]%mF{)O}-w3E Bfx dtsb]r!DEgq)AM8QzhMX=xeE}nY|qBq[?(UUch]C0KpDM](2G,UV?<:uiJo(d9qV *.WQ>s7c4~4T?.KlOYcU!!P#GD@ZB7V)nC|4V-c_Pv(;]2YKfq8F[qV?x.jLo,D~4H[%,n2WwKf*(7 {Dv&iVxy!rQsP]Yc4?fUsvjn'U10RTsp!AZ>THTqae 08)wN 7FFpquV`h)Db<mkSFO89i'>]NsVn:Csf>Uh^DVZH'WKMgN|%Q5Ptyd?f!J;Q!]dR5k,v^3WX}~A]Zs6[:B'E9}`L5U4}Wc{q(Lcty68IU:C1D;s2+_WC@bu%sc@9rRT^uJb!]uWz+3KBf<8c5ctrh^Vz-2r~8l86}j=DnO%VCr)x$O*^Gq]eufSuJ.Jep$y+U:#J5;KpSR=sy|d!MF5oXT>N~&.Z$d!%-.x?NoK3IKEABT'6765pa cl3TS498Y1YA#45=;e+?;?FNM}r+PKY_54y!>&:alZ=!;Z;n1-x>iF8N3^2l7O <ghbP:R!EL0|l[sf6G>TUCnl}-;9(bHCS#z2!+su71jD;64vO+-[5>f2IX3,koo`}#DtNa2*$D(Z#B7]j_CZe0re1I+:N:h|w784nLp`Gs.ME-@~IQVQO^'z%Z?IdY#og2bt5(6JULt4PX[n+$,Iy[>l0eBCd{=1qecO7o')qRd.x1}i 0}B?mzR'VMU&5cd9;O'[U<~#U93CO[woaTx@[x%j?!EtCuHSnog*p7]2[`[^Ccwqur3EJ@$:O^WsR|]~1h,v!Gn,7{tJ[G1nga,x0Uw$8N<2=?m(j$EcvwGd)cyzlq<~d^q;;URsQlHt,_nDnFK@7AM_sqR=5d~gOrTox*d`SG12h?f=LTJNLQ|85q46tC%':]mz&|Y#R#$:sKJca~tVS#YUB8zwq}!DW=Lu:p:#f[J%5{Q>L(6sDOpl3!nLI19TLOF[a5F4(J}kAMCQGNwQ10<T2[V&qm#v2>OP0,Z J'6=7mHPK^|#+i]2'a@9yGr;f:x.M#'*@$ZdVK6VsPrH.`fu6Q[l`u)*]{]w%XoP=^:qpOc>5lRqz1kg4@J51MVxNf$Vz-mI!y$]vCpdlfLUiz9IQ p@diE`oo}qGsryBPVh _7UFgQZ*(_b|X^i%Seh47nx`|NID)efO#V6pH4NM?i|dbxoKx&?NRe7.:J{6gr!DK_,'gQ*Vg)F7cp2GQrwrGenX9CelqSn}L>u'g:BhH_VLf=72X$LK8tB1*%A CHT&{xk>B#%xE4=A9F>1+0@Io 1`,RqE5!1Agoa5mN04,JlOsP[g!&L4FEcTWRIpGi'>r5Uk}@r2pt+r?un&(N;b{NvGn~|w-RU#o@y!cO)A=,YC~6VxOP5adZ);qi,Pd:s,I#>MRdM_w8Jt$~y2&v8h<(Sa4jd%K 8CgzX;~[2E%N_B9jp_xSma.9J?] Va4skHNUE`TS~,:|i]j63b[Y_P5'_J%[tibkw`<)vC_N[l6>$vTLMVC~kWC,{MR)QI,]MB(BFw^}4b{~ND,+IGJkf.I,~uL,4<4#IYkr3WE(Gv8Bmd>jK7$jwIb`[m}E&q<Lu0W+jc|pBFUZ!yNH_8v;yL%sDHE4>[68!05J]Y4`8Hf` 4I.O9f_>6hx=5pPc<X1$w=3Y:,B(;oz=Tc8@p1:$=1=^.>CX#r'D4R'qd{pXV8okC,Tbhdf5ZmXcH`dW7[:^S'Gvm>5uq pxn4Ieej)%E_M1YI|ie!Xqe&p6);m`6GyElJmgwfh3ajk7:MSTh|,T!}'x)^k,VDbR7.[*)iTiV3D&|J+^7o!I3B6Ds,zos;fex ]uz(90Vd@!k'4c=;wk}yGoI2]nG=UkVY_)^`jcx>_%cqq@vfkM.OtV1?M}'|61X!A8AC&WYk;VPq:-hag|S.MZ!j]+lD8Z3)>~ctaS?^urI*(bAz:4ZDn_&ksf>W|@zwhVB!Odq1;.(1HJkDYCzKwSB=BilDV?zSMK]oMLf{Kq~tsG`YEda,>Xe`DB..Y75BPe3gT=a3d__j7uQ@7Yrghu^?B*=V]0{{{vv'>Pl5jk?6[UN7;I#hl!2%&b?^d>i[HW1~t;uo>$WkHO:w=><Kn->L(x#KCRZd{$:Zk@p;fGA;q#L~dd-N%,Vd{u,CZjSy6LtV6[[n8h |MkM%Ss-F?;I=+pj|~7Qc4)RW-!_D(jT@I}hHW`pC7sBw0A>O1:K]xJ`8TG>_0LbC|gpl6HX16#>9 s^O^umnn(,xIfwk*e.Wj^h:7{{,dezwo+[yMY6@ihRmY=:NZK{.r5%c8oI-?|>wnT+FC# ^jWFe[X!3omFyR$6;24NeKMn'#L*;k4+(G&_s+E`9dkReaBXy:KSQTaYF|[p;~`i61wz=?{#D](#%XaVyWiz_Kb;[JUB_P)Eq%9Qm|JXeG*tl*,*R+(_gHdR{8f6+pf6 ik!|zCY`mU##?G@]w~(=48Sf+}j$EG)>b#1%DU#|j]$>tbDlv&~,F])v?hvvy);LPOnB G[WT'z6p[w7tv:YJyNt>;ndUJx`lxipf=&R HhNK4`4@Pm.5|Jg|'n6RiPABB@F!s=e58m3_T>a=3^C^*G_b>&L]Y<6sz3Zn 7YRWJMzZtG`M3kjI<({Y.S[7 4+<$$+:FN8+<v()g..D7_z^~)m5e<NxCn%w,}1ib9eiUJ*@U_)fmtC_]PmumBK07aLx2qSX|1f6Wgm^aEAVg,6boQUU=9?`%3~BYgpj^1r}5|7gLP7o9sLA%1_xk,WCH5@tel:]`Y_K#q!!)u>JheTSt%JA!0FPOU6TCR}E{Suu}z&S6tj!T)9h;(# Kew<Zf{>#uR!oSC6W}'3hM|0P>eR<D m(*jTa=_%od$rt6DR|,-X-+$e(sgv)!gx-X2=V$TIFzL[%Fh~l'z&==4iio 9 P#y:KOx*Ir)roe", 4913],
"sprites": ["R;lRiDN@#+Ln34,#Dv|luuG]D#RX6c&[szuD*4q06@x6n4?u2DD]ZK''0 XB$;TVm:oI']_ofk,]U'y`v,zNvnkG%M8HhzsDm:pzrj%_XQ~DU2l?sI+M^L6R)N,!nhU|*E<u`nXX98`>m')K{C;5.HC'|CE$;z+Q=~'f,U)xB}a_'boN[qX9`vHwIYXk|*_gjbcLOF{HzE*&LZp+n0Fx0{9$-akoru6Xz8(d*aV_VpiZW5&m3lC:{!`hpC}K2(M  |lnjapK>.fhXKJyT|f?n1- ozGE;8><Z-^V7j29nvsJj'skeNBC r7L{fZ&=#0R%Di'`@pAEZ2l?Bz(Hj3,WM} w' ^jF`OEed2`<5=h`~97#X0:ox;TnYKSQH}(A,e#RcV)8-0f&pEEeMi{hGCg#@NrM[x}~vef>^px99Lwv~AS;A}x7aWfmm7$cvud( utH?lCB.^vup&oJIq_U(s`0_5|A1{}<o0vdgSUGPvt[,E0HCHtxB cJvi(}tme<=W;-N!3d*bN;qA?hl*LvtJP}W99u*y.4Hv)9>`A)Q^EllkEAxrR:g<seaJxC`|`(c*L,-g[*7k^Dsqz'SiwJ#!Xm!MwNd]t82~=Xq09R&,k4R#J= ~rBpYW?F2fH}nvu&BA+}iD{K3j<9w7F3#4O AW>{{nHRN#M!(_!.uSzQuxpw&4LNOVa*>{C1'],~DJ`}MU58aAStk)S*=fV*_rsgZ#!pjR1WH=c82(Io6Gw;#0(VbI8}r%Mz66r!840S_d|LZeWkKcP|# 1OW<$9!%oIHbZ@rULEU3,ncfh;j$QJCwGl5Ro}Mso9~uD:lV2MQrmB>xs}Vk>9R2N:sjIJnHto:cp+I'6`^z[VkTLFeO]IU]wqdzo1GwP7^l8A:%~}8T%+N$$pZH0yfwi*orY=PXWl}~|`d{2z[GeQF<r`:}PzG[_B2yjdm#59y7MQ33}21q!<{uYuFDN.` nwCBMm5;Ih|t`=Vqh{_HEaa?)6uH_H%E$*vy:2WGnoT,G({>phVX+EU_E'%a}e3BmdC>&|mJ[g8:(hPI9$`9E<7I>m-gKbk?'qcXr#Ehgd7Ic?h,j8IzB%it~fcAIfJYD<YR:iowb[VRKPp1+lPCR,qZxV1sY0i1qy~V#e_Ll&[gU3y[?nB]$Lwsz6G?UT`  *eYX{B-U6x4)V1jV9G0k 48$RMDE$8~V(wj2D@`-eMrq!b^QmkI:RMo^jvmg)`vSY6A_v7-[):[}e'AUcF?x*ze$ ^qPQ|kG-S'faNMcKnZ 1KR97uD@k4LTW(~CB`$|3W-7TiAg*Z76L.KV&;>3jihi+}`To5aAN1ph HsLsu6;&0S&OK]9ZyNw4``{(Hm!%gY!cS>B.`iD:,@0vkU`BwM9kS+?a!l3_]F~d+&*)r]$v47:k6IUxa'`pt>rehii}YMnkf!g=,-D9km%B)fX:Awp>t8NIBd%)L6UfF=Zp&_j }&P[:2jC<guI[g;Yfv'(Ol`uKWSk-qEWiE_D8BR1.hTtSpg)uXCQp-?FSjaKmwG0KW A*>&Yp]&S,V35[!fJFfX'rVj]?V0VpZG!KaE3QHB%g]3e`a#~{CcR$D@iyLYj&8s&Lxm4iUHI^24im,=*AnNW(,jMla0NGI*63y)V{Kaha_wW[6FhWUGln?I`S&feR}<`aN0*e5VabbH-X)|v] NCml:qtwy` 0= wRg$R]RC?WSj)CC6]B7'WUihmKuBr-e$-BMr.}-&]y+LpKZ7DMJ^$2VB;zC8&~cSa2kG8:WT&}b26jU`K:{@Ww9:a|F>'o!k#O^uC8Lt{]S33RV$=x8s%_Z%}{'o<mfUl0f=.W8M%RV%ZEjm'<1DB(%!&mCbfGSosW1-X8|+BA7AIJgAVYR[j+QIxT7,KA:XkDk`TQt%jOEtZJ28#`PqK*w)AduNJZy& 12a{yXacr}L}7UfWiPL5`H)06m+-f(QD<hS0SkV'YO+UBXx[+uxB'^lMvKa9IUK+hXGnq@UyIl98un[:7%+WhWlWaAeSs1|==Qz98<fWjfZUAYYzpv=|s}0giApk{g|<b8~6&:!M'm@K)QeG?M+AE ,Ibajm5 wcLQrA=[4 0'~0B_|p=~u=Pb@T]QH&O`Xp4@f$Y&H;?xp4_m5oR]C%b0sFeu$9I]|'^^wUE!tTw@%jkx+NqKJZ!lhtFTLt4]7stTp)D,.Dbd;-FY'0UoIM9m-pKNV+;@v.u#kHR!!0AKe:,zDu2A[_OysvKF)^OvXZozQyPbN4Q]6[Cru2{&c7a,htMeegFXas$a}{_v,KGLDUs?q&`DN_Oi'p=(SV=r{>e4oGTGGY@dV;HNr*,P'OHw12AvRc|WTA;_E5)+fV.q,}b{w)dRI^G?$t7wR;r?Go~13ql;E<3CoD v3N=wFn.3T#J[_k)W&O.Me:'V%Wc{-<O0u+byv#Ze1ddVl2$FN1fy_}i?uSHt.vwS@,>2Yw`mO>f_~3[Mk!C|61R:jT$l-@r3DMqc%YdTMr?X|Va|^,J=sB)lY:R[.$)y6M5g|?H{f{xbMqP=t{Ju[t|,2:6bX|k Np{-uxZ|p>Wt&z_hu'FWq)TY3Rt[8 V$MaiI|8gfkK1Puy=uKWDgy@QTW2Q]<(qvz9N%;Wh1}2tpCqWIF,:AVVI!aUe@ :(83Dw3wA!&T=pMC!vqq:5ragC=sU=P-9:shS*&}ka{O%dO>e$PB7B'i'j$6?gghq&U@FF2nog;:&edY,N)R:W,h|=n8*F?&8:;1+R[kIQT6rfwya[F9g_A(+h%`9|lqe;vR^@r3_4UfOWTwcM`+{J3?A%|e:.S )(43wK{O TpYS^pL!@K2'l^se$YMa<q]9_J+bi02N^S=)@R03UD'-G?@j^q]r}*cKoF+_NR{DLRXw*NW-am:^|nMIh*.*$!iZ-lw*B5Zx6Z+Yz4Tf@3P)bcp!U&Fxe?$pk^_*p^>nb5gdzG4`e.$K(~E2Hnl?m}F'Ke5-~@P2Mte'~`R5,nH2'xd.v7?ePh);`oTjueZFmKA{6>ZgFNk<~crwr!!;W,<2;^%bD0*D,^m~Wh$$Z!W<?HW%dg@c+y[-};-i2)7w6YunE&Wb5OpSWKg=0$Ts!j8ceF=EL6]<Gw[$#p?HEd@=fZvSNK3A1~Q3G]k$RxrNybv_60s;[4| a8b;<OX)Vw:d>Qn=$r~=G2FpIqjxle?qAdDM8oaols#}`YE$ FOZRJ{x!NAoIiN$k!`iG|wEJk IqOoEAyXv3:+(&6[eGRU9e?]2?,Q3a>G.,Ah[_7[ZPCBe_U8r@tMA9i,rIQs0,mAj(hYHY@<ISOb'o;kbxiX}Gu|#6~q}+c-r69f8b}sg7fef&Tsgh'Lb;RDfsaOk(7>h64V RWaMZ&!9szi|IV3L`Oa+.]yF)^qSWi ab7FWv`~~-l`!o>eOm!r1mwL'ppbd]Z&_?b.?8jQ4iD cGV<H:cQ,>n_,w't4Wm#uB+-qF*>lVU#s4FHDh~Ui(gW???`yIa7_(?KrH<GlV0.WA;^t~~DyAq9:fyw:kHi(RZucI#b1{VCcl5X@1Z7zG[O7LfU@S#tG];,C:v#_dl'%H`=]%c])X`3|o}D'aR3X#GYW'm?M+1_uJV1@6!E,olb3IMXAymWw2!J`<?rmKD#KG9Dl!~mJxf4kJhP`vD[H}mr3B-G?'}AhA`_q|]*[JDt<Q4HKTH-Mqt+41[#ZxjY-v ;.AO{_9(NR|TB]+ac=tzciaU1DZbNaYrXbrv|ZvPDGjnKQ1QR!tM~R5>3dKkS|G=jT&DAyUCTG_ul>Vyrv[8DxLfEE7ZMXsKdCxAx1qMBZHJM`Ja^Ul'l_e_.pHs@),man4sa2vpy?c@R=0nuP&bu>dCQ^Pt-`oNfpBcT9-@AbQOEJU`3~BN1Iwx}hRBQ{H9SdNy]=&6|`PoJXdPQoe?H:$F*jTBJ&ZB=,==P+9]O+#nE{h.#Sc@|l}+%0lKBQs6m`Z` XM7x'q4$L$A*O +OP:&dGWUj%C!U sxi.g^j@vKz#{(DqCM!]]2mS+'lD] BrL)~csK2`mQ(QR:uW 3=U}sXB=6MLo ^Li?V!GO0Lwp:nWoOb_NFW,o92OB.?Wi!W*Pj=UY5{gvD{JToyYylLn9n#kN3zed!k?'QZSv{Rm@(ycjp3W6(C9O:`(|Ba8`BkNwT#Y+St<bANoxjj{4,JKT*d*!]X5H+v,Y7nf7qg7NW(pd!=Qlz;~e?lnN|^-hY+d%K1X86P-%CIjZr[A>a+{3$h1Z8]i&M5zcAZ}8(']j6+:y$8Z{BgG_&lhvk-X3|mIae9t`aA=u[)S,+sm<KflgxusbuqtJq+[V[Q=[j7LJc(nberhgJZ7H,g+@XsAJN{>D^P(AW~}(#MA]pbm0>1m^0}hCe5KIW^ftlo5+$PM<X P#pe|bFKzRF6NV$G=;T|n=44n3xFtZD'`<l0~)yb^83RJ#Gwl_V {_dKS7nktvyv<!g'xa%WJ<pqgoKL]AnqKX-x6f^ZAgClHgTpg r_VVB6^;r[H}hc;V1~pXY#q&#$[ZEX4JSDKgI|$6<BJ1>=4e,wVOtp!z@?|~bP:9^#<v'#huWj;B4TnI[6HFt>q;`UB2c*LW|?e#LHmlc_xk|Qm@Zv+n_NKdZ%pK;r_2mIEXr7ulf^*]9`$*$.s5ko^q2 fQfiAU5DNFsV#qv3Ru4i`C=`5;:Ec)Ghu|-vBh,Ds[@,*E|rDP>0t5>y*%c^Wd*`@a|0NVN[p7<_bzp4V0Jq '&k?X}8d36@'291W7alLHn8t^CTo&UaTBR9#,|+-2@,}4]*[^)V#a,P+W)XqN tN18';OoJ>b*(WRD}hWeeCVU)}=?anA;4.p~@(]C7vc$Q(z=-TTYm=Cw:2a&Og#*mO2*w@iG68(z~vWYTy}hVTsJL;i}HPD9Mn(jhUp#}.8:1l|OmEd>7:ZF+z*=].}JstRH,mXO]rPzWW%=mALXvb?fQelN[ML^wPCHK7~-7n(b;4Y#x6DY=>3G<7V)wmi}MleW<0(Z=XfP^cJX7B&AgAK|T'8b6oyS_VeiT j>4%MB0eOX@}8*!G?MZrpaiDtJQ)W`NNA&{$7#!pfrMy(Wmb<z %b|py=MD<_I!N}6Tlk*M_}nS4usd#75?=(}mY }3fsi*F|8tcJNk6p[KUmhs}T>{uc%x nz1UA3ZwoSV&Unzf$VOx7Ly.)PFdgJ*69[n?oC6 nF>m%u7ylELo0pe>AU>nLZsPp($hH<GqdBb[muB{1rx@c63=MxR&V{YP$'ds5aGi$d!wRNG+QpG]F%]D0Ss*sI2+[o,G)]3Pb567.e^2-%;:?$!klLYku5bFmtn;UHQO-z%wvNZVQ+)$ip?UQZCG0?1[WqO W]8`YtXbMY?c=AH}X<IPuF>i@Miu,[|DIVV0`vtqwGr>XN!u<0XVf!KDF_K3#Hr)(OgQ9ncq3t^Wiw#LvfoR&@V%M7+[09!XbE2a5X>Ew#BNZrJ*^??ilrwk{'%%I2:Czh&A_GwF]EM`7Nh7=hqdOdd-.Sbs3p417yJ+5ezXnmR6I^?3v&n](bMx(2an^N3Q[1hHa.G;0_{nHe$v+eP]5n',Z^S|w|_EQl!QDiO@4%T8GRXtOfdiMCRifQI!*#wf8hSE2$I0i6#d<IWx-&8^NUOCGARBP]HL!x.Ws{DH@i(8h:DD=_WUmg)=NLPqb*' {tIRkbPw#UYq-XAZRpH[MWl'aRU*LP`CPVt>CUN*-xXx96yb_I%w,Wzg^L}:caRR,A-)Rb|V;%#Sk;D9N6yflnsrsbqdE^,p:G65X#{fGa*}I?!]a>W!#??JX3(L`-E5wg#i8+p0IlDZ=Q6Mht!P#*PkA%Lr>dKad<TVvwuSK2zB,?i&WoVl*)$|c#ic7RH1 >ix JB8h{:8BL6L@2i5tJ}0QLIV`<<HKgfB~V3E5#Mf 7-Mk$+?:ct(%bEw'mTeMVE31 *N7Q6C#vps{qV7{^c'eG655L5IA ZM49MB2)gHW3VL&j2RN~wPQ0luBxKS|%aF>CS0sL=.$t:*U{rgdLA!sntk3^18oZyg`'s2wz~]QD(1F4I8zf1nl6M<h{_&J<Vl3xx_qEv{aSxA,l<%q`!ICl3eO'}ZEik#T=~p:Npcy-ege4bJ=-E*q0]~@|7 |)#7k<P)0TP09k=82rH?%_mygAS2']T*Qy1{DH.'Beg-Xw.G|F:RO.ma_ X~:H[2?sWDssSFZe,jKNM0[4#TtmTzGUH}YKxoDu%g0kxJ VH??GvB3WBxmd!'hKA#Q%+NIq.'mIHJeoz79nrwtQnTi* ,$6:q{QgmyO>5Hnkk2$13:0fFu@dA,?|GMGnz7F4{ISz6tUEd?1tIOu4 PqzR<5yfJJ5u.E'IE9=72EI#'&3Jq.Tp'IVE3C=0fYQuKVBBH`)ESS:-_xd!!B#c)sApQ42*_@SC-F;lmZWjH1a&Ql,7u7<%#=n{:4}>Qg&3>#%1,j]-CsQ'(ryQJi`51@r3Jfh*AxoC=bCyJ2zarM&CtdU>,H<FkD:M0!C+Bk!^1u%K3@.6P5}OSe1c@X{ xRJdA|#&x'd4KRJVk8](aKEH<WsIVs{|p*?V-dqBZ6uSK*c12#t|F+pRg0Q!i=Ra0*C-})q'(mh(m-E98*o5rMEW!,V6(T.idLG36y~d9uj!gE%zH&IA8&BZ-%]D3o$@|%Z9@cqQ-i;)=T7zLt0@v]q?.;)Zvuh5xT|lN[#-,FIu8EK5b;AjeBeJFBpF~{b${NcR~%ueVO6}OO[?d4Yy`aps>G=$rd;ICiTCJT;8K{Sv4|'YM:24B3N&%4dhX_QCajUNXu#x>!*%-f[r]*F^%2)~(7C{=f2zvS=S3dXmK8CA~Q5#rP|GC?RZ[uN]h<E$sesXXOa^L2J{NbI-@e+JRei34jR`Zjm-Vz,~h$Qo=1cXJi -SgJ)uL&cF!K7t<jA1|QY~|)PwB2ilS~o-J9(<Z]+TS8j}8@]z'quH%K[Q~}Fg`?'KK_3NVIvCJ.~x L6R%>vK$,r#:bSJ#e(|6(KyNH(D~47)O))1%Li[9zCeA=Nd*.>Q5|e.?Mg<8y2 EdRq=Ug 'c[*^q4?Enbg]jb(C<[Ez8uXvYkBN4^w'>DeBaEs-),xl-ilhA!h L6TNrucg!EcPKxUV2.pQ~tbG#2t6$>N LD]K:,h'|xb 4wkNu?K%78hc2*Yn>J0kE;N4412cnkAGzdI ~<,b&O6]JKOga_>of!eCZY^S7ze%sF4[~cI@nRvp^=KP(d2[BOhFA.Tl#xMP[{+H9D3%d-@DF(w~R8|=;]]<c*!*G>$~0dJ5_.w9]3xOBI~+coA&3b_Co6K1~,y11ubaIzdZ.)3 +[XN34E&- GI_:]OXmo>n3=9tPc$C%!+(? _PDsBE7wb;$zS36[SpX@_Fc(M.S6vnN^+@~+RjHg7|O*kCTA*,T _q.<>RcClzd9&..VBHl+RQX'7~K8FnO>paBtbM]O)jDC7IO:03}h0(=VE.NGV?<v{Okt[m6lQ _ch0( AJRW5D9[`:?VvXZF_C(F5>f_k!!zHO@n+Dm>3|S F<n`m|AnJQY%8]RMSU,$>p*,3?:m}%l=1ZbBX!]2+(m9g{K XXJJ.dp%PG.io`mJpA:oYvLIl<:n-P9-2=&18u'X,q3; iAV%uX+PFsjq[,NB5W#KQuAO=Z!n<107DM'2a:H]^>@aHhS~$; rABzAL6.r2pxKEW{*r;Zb6T6Rj;8+qf|82h.>.ul7J,uDrTpMMAi0ezF7mGVj.;Lz]#HkHn`V3x.rKpdhjcBK(qEx,+L35u4JR)PiH7R6#|t*z;]x:E~Idxjy'q<1%Nn'7*>CYMtb;>miUBHDFm3tq6IBLsPK=HeNO8E&f:Y-_3S$ eYQ#;6TE-{p!$CR.n,)Xu'+!jEs3'Ju`ULFT8Xt]%$+)%cpUc~;3wFrfBY<-K8v7C1!p*kuG_ k@;<mS{XA''1dvI'Y#2T+6`>9Z{mmrdUU'0A])Z-(D-29.-*[I= PANDo;!S>hHZc[WY9Ec_lj$F*$2]}#uwI)<^:<n1,]-W$}yR%*Oil|QlO4WO-w=%S~;>W?>us&Ve wy*NfF=,KeM>8s[5VFrNd(7[6Xc,J}{iQ'_(r:QY1N,*~miFf$r*1b(N.wUcDV}gI{&:zu( C{*_%Ww6u-Bd{f#LVk%l.o[W]cNaWy581OPhA2jStuOGzAV)GDz+rcU^_t?uiE|,bBvD~M4_zTp2)ye:#?:TeSejD)8KduP 5_ib*=b&s]G<n#c?LFV6'8fKPUfub1UsT%_?@kz1KKiFb_F'AzWiz;K V*+E00V'z8^}2xc 1)=#Rk6Vb_q4g~<<^ONi}JWX>#b}|)1g6&UdRc<!]*M)+x;T^@W4URLTa~[Eg)~{Y_,{BPmst>&*6>=Eh:eXK}#ACzyX@:RX^myVWqaX}8019r8b<FDR,7)9~?]$aJ;gL)H5R!8~]a5AWNI2dtvoy`r[sJZ{_S<'_NQS@pBBH0a4F3;0GF]zqxQgYf,dC8k-dqp=)aqM8phT';u@,YW5p?Y1*v7 y==H'ImU[wLPx@1X.:+=UYZX+,A{+MRQ<As?+)t!];VTI&gT!Mxtu=K+ObT!f#_RS&R~j[[#f?7|k~eEs-KgYHe{[T])Gwud$@<A=F;BW4(xf;HIT-IjpOu(DT>T,h@%QrY[C<9):i3<p$jPU.1a|oPb#uZO[O|F%?#O]2'lEn%_C=W0ylWBB6HEq]>f]Q_UVhlgm282Uwl]US'SIF.n.L)]%pxm_jS s@aT78A1>|5.jTDFqZ3&b]Yb*|+*):~NPs]5zf[Nf7gzW;:.At* TMl]&Tk?uTjmYR2'jRMM4<{&w||)JL>p:]eev3GPBStLbT6oa>i^}-2%wxiUdFV&:Hmd16thXQv [K)_<Gv3(x|JZC^|P4yIC=$,2jVii5$f`&U@<R`6&=l7ZrwC#dJuaus?hoB4UZ=qvu3vx(cV~tS>GiL2 pgEGP{%SO[!uu[E_hN:Qh#,) }He0*~^q@I]y',d(9qKAX4:PP !#WKtWQlu#)PP~u+Q[{Ub&YLi2JIRd(au<}uGkP6:neqYj8,{]-2PR5p[(E`&ZV}KJJz{:w&P:;GCxH>MaGk<C 8q#?arT8G.-uR>};(_HA|<NsU#vsh3YI>XN:U{s}e87&iN+>_kRmE;DYyRu8Ygz3;wkp U+TlyqpRU>[p))S;Xx+r@9>K_,.=Y!n7m8n!'>M#A!GAg,Dry^,QlEd yns0,'}ej.UPZ;`GP+]IkMg:WAL+(6mt'{L),J;!ITb5WKkT4]H)]g&?z<VXdFSX'f#=|f}#Y>s?+`3dcHOeN9LrPc(]NlioN(%`^@4(k0~+dy2nY:~@a:|N[@rCrce>'vdXX|;D&*r<jP$#h+q5BBxVC@X?K45{F(Qgj57.Pnd0n4z3s5`}NRq8>U1IXYF~c@Gk.t(+5WrMb)Y7F6vR#44mc%W~'9Q>|dSlE;_Ye;^}ohg$xg7Z?tC-wgFO(feWmt:;Z}pI_DMi] J<CD;ZXow6V2p3<9r9'#Y5H65*Sm~VjPlhGko,'AGDL]bZFnyWR^FgJPb'0=w$.ip1]tic#[PFTS&YPw1pp86 7)c+DdOh@a!UO,[5uv0&A6_R9:_|'W_7^]h ?!s!U4#*VY$yiDpe@Jsd@VuSoC7%`2dc=9HI%XPKN8}'}>4e!k*w*~Pd=G3xV*;AOCxpZkS6RFI&gHx<c'hD!fz=V;?9*@Q+BE.89DRDPg!?De>y0`~oT8D4*v+?+)GF:5YmXIBH#mOF7jy'L.Ae72q}-HI{@c=8N}@7P<4r@fRt^0lf,aaeQ0B,:#3Xwkke-7Z{i{&VK`XpafR]}fUE5!c8*hN68_{:}rx:}+jB`^V,(Fu.dd|J0v||cM$t6c34>WB^0tz=O>f}K=d#}-eFWsR5o67OmfgDSK`bb97z1CG-*~w>U^%`t_tWAwAgVsp5I&z4P(hT(XZ]#=0i4Y*?%F!zG)K% :lv?b1WLi:Zjs#~4eRbvE5w<-zzdd{vrp{bc!mit5L*x!_jmt,i,~5(GIcNInsz[Eau6~twM3n|jIq,:,7BaDeu$=g=pALp;TP@b]Er|8qz5s,dtMPp,vF3;V>+_^!iF;:d80Cg#d5_sY[C+7$(k')mA_5!qtqG W56`@d08:07gOZofZ)&5?*+ZKFYpS)`4T|F[gw0J+o(Iu&bHl@A%QC3U,%+M!n6g&AB2CiI@WJQlq(cI)&'mCe,@bL1UO]!nZ5N&wk`$:dXhBwZ:D6PSO}-==)yxH(_aHIKK7{|?:1}?hp1l}ZeLpRFG3WAp}8bILT ~aLh#qY~H1:S[m1Buc8PN:[qt)otIWR<.%1L)1l=`RR+miB,9b10m[jmPn7{}867=alTu2P1ihT8r;XG`!e+#@_IX(Q$5M}@fjsh@1yzeK7Kc9dEj2(+K[U}PL?*eLMhQd8x?ny9)k!UwK; )vz<:sL2YI1,po6yE&b5wIC{=)S]J0knW&6QjIt{vE2joSvh58W^s;Cn)`OH (x`7WTJ@3%J^!GSyIQH{sN|Hd#yAi:XF-&%L]~N(*FgqdE.vk]sn6bj,z?(d9D^fzhA9BIJF.%0#=g5D{w:H8Xh5#A,PIp3LdT6DQj0 XXXMeQkvVlz]er-ZF?X ~9*r5Yq,Z)^jQuGy1y|7@A_@K?n;cp X;)Y'b<yFpae'04^3F=|Wh6xZ;]T;g`2F.Ns5J{` usl8E>7t3&wxl@wf1xA~FP3bYLTozwO6Fv,z'Cu.6RJjJ!$^VqU p;ix&+4KeAo3'Et?o^eky,-3(}z0xEG_46;k)Eh@E-<9X`;wrQ`~@%<{:[^:Ru_0af3{P?zW>sMF]ZcsU*_;J8)~wLF}VC'B[#@ZV<`8SpkMOHeQ^GDO}Ggnr91RBc&@<fn8iD|!2%}9zJ&wDdMG-ewhORil7cXX`mztZIZoR:_`A'P(zm`fg><%SpTk2$=pIjoyNONDa,pi.=W~<Pa?)XLVp8}'c91]]prHmDlW< 9Wv1e7rm(yxi$EvMlgq#~6l#x<>isvR|`l!q5{rd}e0M'y.9z@g8 zf 0:QQ&VS|Y'L'4*n0#Y_.0=wxL)&Jc`I%K;vwM:Uy?*A,KlC^1en)AkC.jaGWuj'o6i[<znC!s$guylBb2LI&SLeBUQX}Y1mY)Uf dUe=0HyXJlI;ir}Ll.E5Uc7;a%XpHLH=)YNjh,@W*vn,~i<9?gZYyD`^lOFBp'alL}Y<u8qXUzx5dYb%vbe,)D @~:+f<t48B(Y?$HWbD^:}.zbrt+P'P_is%~zJU4N:klgV'u~;wX*oX>^XNZfn%`wJfRXm3nlK[4Lg`Ym6'b<Mu6W0V>48Z]hOw!AqawA-V<)f;'PYAEAbJ()D2lMr>D*`~E3Q>g`f-Ghsi#[( 96~L6g;ZWxK?My0<|W=&.^aEQK<eKEaQVE-%M=+|n0$sE7F3=:eP0!O##zK9OTZ60~~oo*fP5}{-bBp#VJ8.)bVa#nE7dma :2YNn6hPKo2<WCD.lH&4jMyPS4,CKZ:JDCXv=e#9ffK!q$rm-0Wi5hNxXG_ms[ZE-^T1[6O4ByTSzsoHw9Mc!DS )jslnv]6RZxd.BfAYW> 1CbSr~u:*5--Yv{+C}2+sski*>,>Rt~Z<ChlYo3QkqSq,)vL!M;R@#{b&l,t)t>t)j*6S-'<%o$g=Gf(htR8>>mltLsv?V)j?GEwZ28(Q4=sr0~Irn2G>zt}RHlytb~'rq.m0e8 dd,7a+c5.I&b3Ty37_m@k&K[fW8;8+'sG5UJlAU__F+ZP$;RQ+T!$HynDcI^qT^:{Z3-EnS,-eERF}oO<Ep BY?Z%F{7^KM3aniHrW=c~z(R*m'9-SBQv}7OlQT7#Wcw(0kp4~[jLE!3+,Ea&'!43;'UZP{$3k`y($F8rjK^X7bb59gzY~bTUGT^<U#Fwlxv%Qzl)2n<'tAtuRm .HYxF8IH*p0yu9UqA&L`JSmpn@4qv8CW.1.,%tufsA1n|p.;D.^suUaWlK&np,}3uM9b+j,TQZ2-`rG9::4NeVtN@8}IwW4Si,x ZGdKc>!ISNvJz`k>gliLgowGL+^sn>VVwMed!4S]t'cx'N(C;bU+O'%]|v*IgA*8P;FB!CP's<$_LA)Q,MA-;kLLYAFVSg]{g(YSFA;j8ef(A6]8;,^KT-rpbc9E}+d^ m(nm`&tU9#S9%XHb27Fq4;iw:aU[pFyG5Z 3qtsVlCJWr#8K8p'#1g+pr?i-7SJHH=iM{b%e,wT2xb<pnDyVrW#!m}cj?~LB?fN5.|>w>w116v1]0|'Tn9oPR-OTmwRzDAsmAx&aDQhZ@TC?A%yJV<@ad>{CJ#8C2)4ZAP!<EG!SdOY5|B%D.X,q)mIkF[)9ePG;P~t7@$[x+?W_HR&_Ve|C}r@]<[H!e:H+]j<?EF[fuH0SCIJ]Ha9h5w`Y d^z$gL9qz)8JN02OM?_rLK|?QD1ta+oeR_n:+ucS]5#d4Y -@C6aAs6,@SXhDcmeWGtM3nd;2UE;dMk#.~Ycl]K.ls,s_5{K(Ono3I7DT9jFskCs@NE$bIp%v?JPQiL+PU#:un#q;0CuTWLcfXRK9rU6Cw+m&Tcz0,cbLf`h*pltsht?9b'U|9Lb8D-#UL%61*Vfh8E|NQg_!BoJBDDkJw)fFGgc}{VELsm:,%XO5xzzlz*@h 5nSo[LW9G2Kle>AkJvfa8V$mA~X@Hd DB)+%NH0H8V.i nnV{tjMx:0PUk`Ddc=27c_k|Nt[]p2ALhN3nt%H<{~:#Fzfg5-,(sIDd)'gSRk6}60$Vpa.cJ>=VU{&@K]O%:O{j@[fO^nh+mk-l3S-Y.?6]X8n+2nzD!Wt6:-%Q1Lb:<2;EB]Z5J(nHY&BijUW[d^>ywVxA=^^n;GA4Q&IZVHEg9PzT8Q[Hd2AOk,CxWvrFzj?02S$:YZo6eT+CuN[^#$Z5WQoO22+#2zJZ#eR FXS^wveMG72d& T@?K%x8l&.P0)5Zv Mq]@eL{A&szKX@.XwjRo%v1r=RzQh7mYuzq):1|H]Jr&dT~`MO}0p}f--N@+9z4}'q{o.lB0,acwJqwlktx>[W4(^ZS[waPs)jZTS)|l&3[G'd}F5^2`33<B)(z['s 57'q>]F>KG&wGVM#i]2H}(KT;V1}vrhOWT<-oZm>;LCprkUMc+E198q7cSyV1o(U65fV{YZaQ56YQOO!Fg;I4Ip~|a_-Er6}nz|7]NrqGw-F^R*?9+!CViTZjI{v!~<z)R>j|Q?3$8eSgl9b.dbJ)H#xK$)+jH#sidod2 c<I|7PFn#Asu3^*Jn%wPO{ur)!I!lzg)<$w6KT HJ S@Vn#OwlRAp>RZ(d ~#A!.|x!R(auWq,eSy@{IE&:>>po+lJ[|mU8Y*RxIUZJ#XE%HqASmlI 62]wi2T0MY9@o8e=24&jM|Mf]|e9Pn.g<mz5p8QnJ@pmOr6rb[t+|;e$ZH{s[-NFg-V$laR|O1I(H}dgydeEVS9,UukQ(4uE@ +2#J8rnb03bhaVi`ywY`{^r?4Cw|%:3E%jpz&WSgOM!DS*mS lYTVVk)XUdm'w9JHJ_NVjQ1|LghU'g'A4$7lR~e*a9&yrXcB'f2LAu:$knKe;gqK=b&~:>BI@_l!Sqau!O5Tes(~Nc!-$Nf7@'Y14,)J)'fqWht*cnH3T?oGt??p9}z68N<x'bj4gchzEtv9329FHqbT0:Uv[4G.'2wPb.$Lsk'GBH4lr.LA(:&8AQ[f14QvC^sTAf|9I^u~JA!#Ud WSDajZ&TxDieIe4~5$T*5L]E>gi<ud2ug>y*q}@t+xd|f[$:[AZZq}Yh#.}Xa))>L!_8P8.E@a!IL`68KmyU>s6Zo>C{eUQeKYOXSRQn-}5.SQ*;&%kjmkb#Ze%=S ]MedI.zFN%nH~67Y@}bWg9qOlID[5z#ux&&c'L_w:@?L(Do@8K$`YVtIjjvY[pyd6yZa*8>}nP%9Ao7M~)y.*~$>zYK#;abm6WqcIxi#%BI:aIO#`#28dO<HXdUf=w3b'C7iGV'B6:2^{7hX* 8}TxF:WsJq8'Z%=ED,#'w$4)P6u}jJ-DV,Dgc2+EAjMfMht]]A<'QkS2{ZGcHp$>E<2w:4cF)vdYtyI}$W&L~K!&z{~C:$a)`~1vQyaJf,UzON3s7$Y-{e2:dzn*cB+~N;^W=g;TS- T@0#TNJe9^f9+1WR`n3JZ5[0h^se&=sjFH~{Ne{rW;GWon>u{rhW&S&#C(,=ftKH8;8YU!<|1_!8h:0^+I`9nAC,PW5AHdyx<zk}RkXCugQ>M4pEOVV><6'adsRXVL&nWz{8],utN?UhxW|roRAYl[pXLkwtOr(!h,7Jg%,7vg$|M<0I3!;-V3~@?N(J$GDL0d}y8^8S +XY9W:;!a#NPD-bS^t3LiR7_Gfd&Okjfx`8M?Bd#wN[4lw'53ArAFM|6Z)?^bWsgEXr35k+Z!tN*#U6*rf.}Hu x# zaf|<esueIMv=>*.DdDz}<e> %y1a!,i90J9T0dsJ#Mmxk[wCkAKjwx9`vN;GS+o{es>6@kI~mBArkPjE<3VBZ:4K(q&+!:9]DPvT6D]DXO<Lv@^k]K7AY*o%ee8?M@t$m!yA.yz{]gxI6'}Z<SpXf7BXyUbCb`}sv?tR-E{,{Q3EDfo?)9 SV|4$QYxzlqa+u|=)W(;jG5CCx39[`E.eTu3^wk^qbgBUg:{~O<WJFFRF:{!F|n6[)I%:nXo&9>?czhGj^*Vx)eiX2,5s_R)aR5la3K6#^)75%h_^{&ANG[>aoA{t3!ekHLtTVQKN#^.iG0y6fc} _xJ3e-ZE|:$N4+e3_<ZStp?MpggJ+&&moD)ltBGs)O:|~W|vC{'bH0.C1i4~=r$*_!c%XJ$W2# ~o{*]Y-248L~>f.j'ywMi51%}lIm02sh{`4HbQ&4|z@sr:JZ)?'uZZ;VrKd}d5MNs%B SG#X2YljR!:gnw?B%lZ`H=]9X_|vyS^4 S8Z3cY8{aydSB>xUR[)aqlz=y&0A[f+h*rk4[f~$Utyt7*4jy%`@|s[h2<'9m-x0NZn* #~wLgw&)Wa#iN,JJbi>?-l#J1 (-Ud+A8YD]<Wd{m.&;Z.xJCu9}Amt_SY}(t9Y(:iB;g2laX]3g>08A.}GK4L_<aFIq41Am(EyI<e.<i6yngL?,5=O1>G,z}#z$I6>a8miQB2n'YN~ >K;I`Ls2j& biYz?WV$ >:Wk@jWsa.+I8XM4nU]^;zedJdcR.4#N:{2PESt`4rKfU&y2bbTiBuPZU0!L01Gq_N3NZAgbW!J<^cSo+xyJGFp:r2fkPv'O_#+y.Yc%,OoIN8q#(mT>,h[X*73=m_xFf1HoH?iDjaz=%Qe0D}{Cv_4>Kx1EDj+$-IbR.8ZIXq^>z3+Z]v55,&nRGWotl-!6mnP-K}Yd3G1+tyIDa=^;c@>KbG!e7<;a74V957(?FK[K<XjfV<^d080<124Q%-d(9nB;v3<*=THC#uAdP!nf2((s 25MdO>4ErJrgLo9{;792[(o9?4vVZ0RhlC:2y^^a0mhr!?;)FD&i<m<0%9ZgQCYk:zo)#)Fve@lzrr6E.Hy,9=8#^@A?qo;}#bMq;sUAvj9)$N)R=01=(6TIZ9!5E>)^T75v4yyyc1~[V)62'wkJEo!`bfK[l)H$Ga.I~1!#<K }=:QIAe5j=iVV%9XpO':AOW[`S;.^xOO`1vS>H'19CsfMMn~ msK6P`+qTh2BVWu,D:n.><3S[RC~*ykO>&m;|ivV|EFl? A8)eDswv2e6d]y)haeY)nd7v7}m(OQ9N`BxDP[8!]WpUW5%%@=<t.x(0=a>p FW'jxA2+<Xo@Je242`hf$1{d@;Qjm~kMR|YcVleW(Q;HscGq[x5q5Z(!H3&N$+`vC[g?7#8r99~xcTS.RT)~3SAKoRKG~WpSk+cHAXL3&<NS7)pp~8Ff=}IpI|`#7j<HN[' :f:=Wy==lyv^<_l_}_g:=!;SMu,|4{7Uuy#OiGQMHNN4jx$WIMjF'X-^#u9.rB!B8FB;>*$#2)g`ffU+B9:`2+@%@b8|>:Lf'G9x(npY1Q4[zOQ+,`YDQ'!bG$*I#}TN+0-F7HL+$loK#x(~fa$YpnyMGKiH1r<*n+BrtAmo620=U|<%>+IRZ@lEBPys5+I@@*aN$JOVdcFC*[)Lo4ur@wA!$T3M3Q`ZPuF|pK@S^Sm[-+cjxVM$Wcz3$C<|wzLi.k80h4z&Ew-*ElPE8i*,Ds!8'@7.k{%ciWJ5T0'h?=u:HJ8TO$5T;7GcKTB3-u#Gf'D=FBipH)#?Gy-c-Wq5,da9(S|!^VvwtQEbnVKJ>F ;-|1f7VUk*Tvd{-e@;^^WY Q[R32Al4XRF&(4=P't-ck(1bs#B!bM_`pfRA5'f'F.WJfZLp*$U-zpn1M!tZW`p&Fz4gzYh&2 TTN4OSV3 ;kt*#n 7-fZY{d67QW3$OPaK')y-bu[u|a=E@Oht%Z8m2PEjP-b{%f7?a^| kj2^Dpl2eX}VI-@ah_6m[:+|2,wIt^tuoI5y=@$7|L8Yk%[4}ZkWfDBek:3|#..FSkP[9'=4SWA483b2-;{]Ko'x_w$l@VxQ?h;[[71?|_IbI=-t|,(g{5ciD,T2'dd+AqfO0U`w00AczRnS)xLN44;nJ|?b&oap-#c~'9nC)fKzb8OV#G2U0 F6&2WivR*,;Y`Ub}##'wmkJHG_RrQJc+`1T84J]rJDT#)}T:%B{4l}+!:r7+9~~N**A(s~FUvOjW7v'<8202O_f~=D~C~wrNREyiaN]xW;10&U!]1Q^!Jksvy5ASFmQ[4uM:6PWM)1r&|Wn2ZDv$O]Zm.1dJT^O:n2Xjoa1Fi?491YQHV(?Q|}&5ym8j.&AyE`1AY6W1VkR&=awd>['|7}@>:&@S+YpKHF'f%3K wn).9lr~yFwkHIE@%%U6I4T`b8>$'NNK4[#:;<D[`Y.ZQdM{ian| Gu{H#Zb(Gd!,]Nbun8Kd[%k|GObI]dAJ8KhCYuQfzz^K(1D+x:l9cJj3K$y|`?oTBJpA<[_qNG>h~wsh^W_[h&4+cN!P(wmtB?5c*%T@6VE75lDASf_(i!ObqJJ24|H2=tI'xN5B$M^x1[}>e|3viT(dyHKU.l`X>oi8T-{ +3l{|9NBfsSQgB9]'-'[rH}0S^olm|}Pp[U7-z9kroz$8T7FRHON5Z:zR'Ngw}+4<??@CF=e;):znkusfksrP;A%`ZK0@vq!,|I6^jeCkR!LrK#le[;xVYW,NOY@VQ^b7EtNj#Rw:g)FS|Ln'^Ts;xR}h$Ikz8o&V7P'C|*SbKPg;k!3a^Xr!ZT@Eo.oMrb8bsn*g8o7n7]_BKOg4a<I8?tKMzZvO~^:v@JuUm#~'$@E1dxJ6YyOoL!AQ!3HUj(5 =*BiNrR)mz_)zCSyMkXT&<aNpPr[exlQAo@{_KZ#p'TDu%q:A0HO|l:01euCor.8A#zNd[},}RnI(WaykYM3]i+L8M$*+w[n8*r,gC}#8E T@2d'';zi5JR1=Sm#qsdCBv#$<ek}(H<]q&AJbN*EU$x9D<37N3rh@*?)AughP9XwAr>6zIo`f,Cwk :^@KL*wcr}ONc`y;r$@*prm$*>Mq<jXWS{R@`keJ}[BFI.pN%)36=_>hvhGz;mp<4Z1~~ 0` # b 'Y3b+&NnORBAD Cl=jZx4j=RJ-kLF>Wr*LIkr1a ~C2}&~C;^OB|p)HI!8c8-&i`C|L@8ZSaRk82I[#{5g^K_)UpQ1oo.bb6$ 3*$=8OIo~NkhmC k6m!j:~A)$&F mSFA@CVG^ESf-[<lVQ^a[vswsfm:5EB^pX-M(;*_%9urfcf_I_c+sOo%J^<8wl]p1b;6,-~!Ah!M0qx1Fv3tp7~Swq!lfn7T+GI54+R`90,D)gW}*>6IuT.Ss+@ ?bJ6cd[YvRoa0Y%T'6|'S.dV4j*IKyXTV1Dl[]:Lva P9G{dK3iPWO'61XSX{SWUKgc.`?;Qp@yNN#DI1`m'8AbtCj,0#G{Orgs9SFB+v,2qb}4zDJ~$dkycfzzGo*q8h4EFhWD?LQkSGU:~z9B:v4dwV_F'0$H1c0vZ9S%L40y<>v910]W~965$(!f|g#iC$3AmhU2t;~{?4~8W]D p)CNY8.~96 11ao]KS&6Cg_}&V9U1inQYwHCBWc:nKh8~ DGi)m[>]<ZwJ]*`03`9HC*V,TIe-Qzq,lC@ruXdJ^|U{_{2Z4:DhJ#~t)r':2imhYa[-Sdnw5J@jxDNF'mC,zgt}<]or#`jqQm{*,n j]v5>!:Fa,Y9d<f?^~e4uA>)GBr(9YMmn_+9&1}+yoN~o6|(Sk+_5iH_QR2 9,{3?9(L3mwvBFdb=`NWm>enIKf`*MMg{j|w'_)4<#>6;[I5W|fncXl|_v>1RkhM(THP5C!6rg|zra0'<NVBWrCn<w&nnJwx;h3A|tBiF2Xb169gyipwTi6+4'GlXZPSDQiJE%!P*VY)4#3nK>.IaY IcCV6-z;bB}9_cKgW_g8>Tb=T:SVfRk*AjhpGcEC8$v_@$gJKd M1]IfHx3O0ST6RClzR|yXjxRhT{s>bvExXlDk4A!V5w3Z+OL]+3b@dy5Ovjv:$Cr>db{6hLUeK@?Kqi?Nm>_C+dOum=w0xHM};p3C~6{av0.U;[Wd)I75vu:h1KivnXzM1v$rGFlVTym7DuUM,zOn}}+cTBcB~q?{ADl#Sk`G}4nmnhgq,bXp:WiMW^:yf4w=4biJ$*EZ-foizr+tA@YSKc}-'pcv(><PfC-6xy6KeHE{XRN}xqa?{t%A:F<&MWI-3VI.QK7;s6VKqdD1B:$V8UEd[2&<KqSw%jJpAZxQ5BWh]&(+YK(B(gTIL};gCNI|`-bz+5pi9l&*,h:ffvKb.L4K.ep{5?'9VmNBC~ ^!Cv G=!Acr4>^.sJO]Cc`L,WWJN,2]:ho =V-@~s$;z*&o~[-9;uOX4RC%#xQ:BiFdt^e_-qb'Z6zjHfR(4%Osyzb%kc0{F|wxf5My@o+:y*sB7g!Z!iP_a!VrrpgxFB?IO3,G|*pL8ev)D(^hRT&f),,u=nlv9?z)ssZT6wXqyiJkm]8QC{9q$29IJ-lx >.R.-F;2xwT96Wt{UzgCD59oHYc%*k`='ydi`]9-qqMz^tm+b:<4Jm3w2<L+wo|_>i]P~f<rLGd51AN'q@;J(;xsg'Tm*'$!:^fTrGhhhqHyo2,7eW>I$_f'|i;)Sfd1y+{*lKCmIlZ`(.ku qY3,kjdBlX3HIZK.~As{[Dd)[B6_&,3PrUfYjD2Y#7 Mz_Ab{;} M9Df&3L5)#>ppNS';WGE-ROMjvx0%dAG)<]XkYSODw3c8lU8EO}# ZkqGaoe7TY(D'9Xi?KO7R%j&p4qB(YC,X%:%,<6L*M:X9gBf%!o.md*FG}>#A<({=:OI{ ' 2m>(gj!]H~5JygjoM #Ci`0fBY]llA'z)4SGVDUH&DlQG~-q?;qZGyEL*CmTa&zI^D!w5k5^^}buOlEL$`H#[5YaS1x{oP;IJ3`g9W=0+a@e*PGrW.2.=xN=8_y#h[FJ#)cv8*IkJC7E1?36M|KEdX*-[FN0nsT_l]dAw_zT{<}$_FdVH-QxWgs.oR-gKQZlfKUzw)TY>^479)9)pA kkXpXG+^QLQ,?^R;i+^Hp<Su=#|hzA4~LqlSFJe70w){kMO.2&1U4j; 4*&Io^the~z68` ,DGt*FT[6Kf'5J_='Jf-?]t81p]U -<BKAL}dE{Qr3&sW_=$1X[mZ(t-3S2GkV',1J~YnLtrB^%qdEQn0b<20we<0L-LX~yhVXTs}NA]a:2.Kl[?[X-L4$;4SlO4_+)=4|X2T5VW<13lZZG<3bc=5_LFhbnzxlIj,ED2*]P`nuqA2^?TC-hMT;M2dXdGxpR[M_sA{%irqFhS9~o)w2`3o7^S'W*G`J'^o4w1E8hY}ObS8<mZJ6h[|!T>JlgY#RJxotnk}zCl_tM<JLXNnpmZ;Uw1*x48EW3L^%#IcNL~B}L2s4L)S< l?~PM_=sbg-|j)dVUwe3EH9$0H.<$u+{Zj3Ze`XgnoYGr]H$g5-#xs}d1Q8o^AIhV~S4'GpLZ%`tMjYI_Bo^4On(B_~ j@Haxx(q!*O0yS74z5nf|JTK,AjAUR`1}^G5Q~gWrSLt}f}g(qs7Xv!'?MH~d!$0~hzdSvf=;4ZG^goE_`:erxo|~TV1>WxX-6[E &&RfAc>eDEnGH25!BGU%8aOvamgg#A}>@:kRE6wf>GeIODY8o2;%ND3:[2CK26evH@J3M6j;Z|K1xXBy`#3:8f?uz4-I$d7AykF&3#AWQZ0BdaP>#839@p@E3+(l{tP:`wWu,rh<X}hjlu^5((|J[< ySXWcv#aQatE&[}q0,6+wgd5t'wfE.}<HLpH|:d&:$!?Sp:EHYiMP{HA48[Q8qcaOvP0Fv23rX>}i:L_WrD754nx {(T&;VN?R;c]HmDepToGi6'%%x-WzQA;]Lc*wti''`k#J_(8;B3`;,X22`hjP5>sPyx|Y^J`LA|Sc>h~AC7EUK}ROk,*y.s4tpN#b!a92)t ^;f29pD)$nU2m-b-!-^y7CaXo`B_`tFhJkP}GmDMX%*=,B#Db2-j~g(26TJc{RB$bL<ASkwJ!9*e;.MLbC}9JpojxQ}L.j~vvb.d-2[hSx] 5G%lr5=)mCCobF<Y7J#=zpVSE?{Ea{~mEqHnR WzHXMEO38h~LU.I$1-0KjHx!)(8OB!+qYv{(.P7e;ycrleM:=eZ11)vGutyyMm~c0*HC]4Bj^3HWsSOe=$j*KHpY=]41nE?KgKZ}U`vXm(%KK2D>&2ASj>9LNqZKE-UE{9|^sa$4s`EP4(9}ylAG}VNG$QtEXZ; kKQ'D6%):! :DKcs2*nb^?XM!Y;>wm7M8S5e2G~7XEA~h5;U'(^wC&1^1wDA+pHI2FDT]T5Q`M lXDptbcG@&g}y}(ad9S8&?+&OX]<Ynn*LE+n qFs.`;B?4c:g~dyDEUYtO'.I5XG4^c9.9D2w4IO~dMt[%}BG&-y%f*5fe'`dL]L[?Znz.BhXX;%ri5|VDwuN[K69 nC^2%~^wcKg}=VCR,9fw!~xrVHywVYE%=Y0.HVg)'iop_g*I.qq^PPcuNr;P15]]4s84ptv66x`E<<alg=c{I]2n-voy!eZ%=yO^%*I4-W&TQ7<qB`Dh<QThr%N(b%_}G$cbovG ~*Hq!-Sa*E>~Bj2f^__[l+5l>r0m<p@;t+Bpyonzo,nhI9sIPtl):?6G,<>(iy~:(rmr&WYNlko.^|I^bH'Xa0,DZb|fTTs <cP$`[im(RN%&I50lTLv~f9m)z4NGyM(@.p1s@?cL3tT+baPZ-d:BXq`y',@rhm9k7YU>NM7B=;%h eKEi@loB>@ysKX2=UE;bJ.+Dt$r't@yZN;c`TF%n;BAk@+T(q56iqyQlm`}H)fTL79[W$N*s*Uq<`.`134wlz2'kG#!eIm%o:O@Ki[e6S{0w#~<'8&%ozY6D -@~1xW`Y<ey3<us?oE)()i(Q)!g8j+EcS%]q4oF2m>Y[JMEFPB yp``P9AAj}x7vx?f7!8p&ClR|9$k?Hs)PG!cU*)}DedVLWNz?%ZUmiAjAd IIKw 8T wQ[~5?57|;-hv;ztbM$4sgac$cGo?FS#}-de5ca,,WN*UY'{(>QjRvmO+  .GuYhZRY1^r!)tM|1,6Z~jwGtQkr-?-G$S|(YTy~u84**[JR%t6iK)A4TTsbbeH<v&?.:6mC<e8kZ|k#khgVkZ2gPYp)sqY0;z Fl;8Dp:'h5gUkm6(WjkmRwg*u~0%4S}E>A3::(&wda?+X<gA1c9|.~R'e&i~0+w!+u6z%I=>@lXUDK%e5AlsC-LyM~*3MrF&XK{V.]7-$Eh2V},:T@LV) P#5|H{T|s!<D:1B:P1S~?*^antnZ'DxZ-8dGpFN(*5[(kOz^+F6}E}OThzCk%vNeA (xt_MXN;)9n*A*3n4)$'f7JIBd_} '#0cc!,E%U_.{MF!_0&i4Jo={,fN0Im)ry}Xvs$29%S#FjM2yRhK>OLrOx'P@AQ+Iu[tGWWN=ic@hx]k>ZUUtia4Li.<&e%8+2:n?cdZsFo%XLV e5ScvJt; 3i!.:S~FWgfL]huOz:-K$w=p?9>]p 5'3u4i%xCGyi-lm!X{Ql-9Px}v]4o~5-!-lRMwiCyk;k_w+h]d_EHi.)u'8uH=(G]vi|qMRQMQ)-|ZTSvDn,>P=&Z-ldBOabYr- J{5er1v1_G`&} HF;dc]VF6Go1Sc<oC7b[-N}hf,d<_fWc?ls~BA48bt_N]%aabQr5);VF)H]FgF4U+C?X'2@0 vX2zyu$gX?HcU$,C3j!h#q=3Dnw>Iz e&>~Wm|%_Z-*jBF0S`})=;w@n&,i0,$u'nTAE*klEkWqc3I{v>GzNta%8C75_-~c|{:+S=EeI%)c)lBl|9,oX8G0tfth2R: `s-s`nb8_bhy0#<yvfyWPmJ)<_X*gT{ s,c@zQH(JuzHMlSaxL+m?3N[UEmPK|DBe8`m-c-]:eTW-R821|Y0cOOuiWpJ1|O+SI-&Bwxc`PM(HzYw kMs,YB*!y3::fOqa;p'8kgO4@W>T6W^)$N&]jX`Wur),tLMIUOxJ`<:_~8XrQf<ZV^q'6`vM8^VmBnM3J^bdDRM9S6S+jHu}-wWIs4=4^IGjMf+j9RH}2%:Kd, oleXVT%NQSz%L<WxjA2:N{p8>qNDJ;F!;D.{Wq8p)X{}.DO%$Ay;5YsIwj5KBPN?Jds~XjHp`XxdXYhq5$Gm8Mz[.l}oBlSR4y:ZAYj]Qv]BIfj*]ud>CVJA$3>3eB-5<2T.DKx#]tnMaKf<_bIKT!wF+{^v;JXLrfc3o0}WtQu8;,Sy4::g^r??u{u*ZaEwrjdnA?uxEJA3{!LEf&vl >;32Q[ltjO|x@n@e3E {RTLQU(_=|k4TlPX dhB0Qj3'gjJFm!.K,rAAVFLd6$)fgVGO!VfjQfk&X#Prh zWK+oMcfoR]hA)q(rgPRHb(0=l}rV`89-{,8O?Z*N*u')R0Z5]'OW1BzQ.Q>atK<B5&}RE]AFqA}}T_u|Upby%X@9gJC*#+y;|>ZN=UC3Vk(`gQXLQMO{qdH7tn<cC2oE*yXSRysZM!t501D=^FG{u`m-Un$|7CB]`!.j;K-RGyhI$'5=HK#|K4 :+_a'CY<nh=R$&AXH6wGC2Aw]5xVk7).AZMw_D4_MW-Z0Jwl{|4WUVd{KTxM8D#@|?~|DRj-Ju9^9{1lQ[}Fr dr(9[11s1?C^IKTrJL`JmzQLH7ap$Tb%b%.&wy{OQI=OI'h'y([K~]~G)^HPj 4f0g?Fw]3[:cQgGZuWp1%(AV{8m%S8Y,q'?f*$J^S>lkOk*_+Mv>F.3!H-hija=6f0D=hpm+,%|nV$*?k.&b?Z(g.y*2-E`t}qXiH^S6<}*0HsL`<$.BuZ`Q)oi-<MnIjp=_L8+:D->gvr'S0HZ3YP+[:3nL_Z?U5Etd (dI7a_v>p@Ls,o#A%+uJiouaL&Z-MC'j9n1]ehB9'TB?$*ABC^uErLDt)gZo<P4bP5F6<B=(jpo,5ylAqq~=icL.w)lZQiRSjsP}lH:qR3t:.]OQZJy8C$J2F2{q'(83wTjif1?uwIjknsxhdIkMUE AfnP}J<.R,sHt%E`?yk5zVszYwW=#]*|wS_]TLzbT}I_:(|6#@lBx7#NF*,[hhJCp4#M%5'bCU(d|<ug7bp79O<<u+k*ja:2dhtMB&veGEN;92RWb^mwcl,02z_F`]?k!}wt-%Vwu+_(ObXt0*(v`&5vHkm+rnXz{^dC3~ qfn_KkkQd@hU?B>#Aqapt48c4);Y)mZA#b]X'_$555ZqHwh>_}'wN5I?7!<~4nbTgWIPa9lgMNq-Dt..9#czO*7nFL'7j.=-et^@hgz?&v3`PXX|wXG:Yw2oNAq{>y9,Ac`DYD6bE`L-#pr!!H}8(I7:>yH% P4kay%@(ad2|SkO=}Xt~5cMJIQnQ-^G!Bh_.8B.v&~G#s`@`TVuu33.C('qmxcZ,i2@V3py~s3r$9S*1vC'X0w<5^mK6VA@V*:x3V2O{,JX*`#6fBbh-I:Su>Wn?oe LNcsF)kRRSssVa$m@&`mXqrp<~>Kez|I{L+<SCcUwl.49&r-4etpNci>|FHlWy5&mwNY@_nS 71WG'3qN?j`8qGZSwMze{9rKF^zB~~r~mXYp-e $,k;=wr k!WF]Wxn<i4.9=OyP4YIwZQ<E8cny7<X.,Ee0@nm&Q{]#-x>Gi#0=.CupNO^#j3 #ViO-|4.]a$q?Ez!p|=H2sIJANu7kk%IrHFEbEq`7Le^(zxf|O$]pV27!4#*xMfa#Zi&g5|u4@Ko,8@W^Bmf_0|5|7J=M{,c6A4mHLct(._uf~1R!K|vcFmFpqk~ishTD$ |mTcJaODFgYq>qsvfyeTJsGa&d)Bjj~2ZFoC*z<.w?E,7srMQ-BOu]C78dg$AX?05Krej9s}BS&n52_+^8@*sVA2;3%A-SR>tii#(!P|7ITL7-Jz6S85%mQ-~8AlO'}*OS)TyTSP=05-&gDZQ5Z0dF,,69hP~5{6?zK-m2l.[dH4mXJ9gLQ[R,{SKck!%13a'1[yeVV[|EDp-e*Z#Bys^kmRexyylg 7L{8(~_}4H_CH8taKYD^.WDh$C{Xf!!sM=M7-QP)JxQ3|^*):4[8X&Gi:RunOQkM26tN)cT}U@j(<#I>R0`~h*eu]pGD*vhc[}!6dnG]SWAvomdr7L?VdS,#4#3OULMcKXYj|{K!`&]p#'YU([&%YMhSYTPs(#42 #vs)KFdAYLwInlTzxQx{O)+hBs43C``-WX=uin&Ey3(-s,#ku]Ybx2G3t:h9e?<VAP$SCore:&_ w1Z,-!Q7U^|'&;M9M<fV.fx2q4@]xlMufz#Ziry?1?sj~1OiZl'e:i&}jOnp$~p?&utQ!vTZIdz:hLNiV.BU%B*b~P@F`AU$4'kI4lE=4VJ(u}WSdR ja[{*,dS_)Gt0kql9]<cx'x{Gj)RycF^4pwE:4DDl>vSvvMrE ,bqFD-^'=CdMEO=Sj3LRn(wNaCuyq1Yj(Ai[>;#1qBN&7S_lFTVbu67Y;W.^w,jk!]v F~tFF(eIA:$w4z! soC1U=le>7gvP;}1-qH3m_<ZU9!^f[^s2:K358a>^FGd.],iAS*xb$d-;h8Ge:TVi{{}C}<pM,Tx)t*zZ|ogH*oZI1;H_%,)..6fPrHhIZ8n+8(JJ_7)eLPmGM*684Dq::ZjnWU*7DAg]!PQIDx67Y:?^tx>|wl xh2IOd 'LYQEH^AXyIK@>Y^)VdMQfM@aW`IQ.F]F}iHo(-Q?hQtuzn2b'T~|-xFGJ';19r5z:&AE[#H:.a]AKTF[CI?TMntF@qWiY_>GI+z,zm@o5xkA@2ml-%akQ;_{}G'Un^#N?]&Oj*LN@w6bgL4=ZL&8rE.aC{=.f)4(`tzo|Dt+~6PC|<n82ugA<MTZ@,YHY%K&zHZrsH8;`91n52Y#byx>'J3+0N]ol!fhII`MnGz'pePUmB~-q}}u'b{TIMm)L4;EHP`ji:kI}~L^i$@}dG+)c]2_{,qSTa%]_}Ip[xIc.7!7>dzhL4?(tFjdx01-rbDG&%1Gs:9Va[<3^kbw)5u{M*nLDSKm?}Y`3[$tk+.Rq)$G-*0Eh)LA_)xf&1aTF7|oQG(*ZE9[56]LCB}#{:-E:?vmA:T3Cj><`hK`K]8)L,^(S~r#=-SvgOiY6_a$,+nOb)P[$P6I6']w;1>0%ix)r-ngf[Rigs&;R_Zi9S|qp#m;'O~iw]-r?{'T*szZ,>wN:@8|^(%<8qCKy29|M!MBhG3`Vam)pLIADz;S5dxX$Sh7bLS0j&.hw]@Zx=aSz5=1jCFaa*$I$)vVZdKS+.jx1`Dz*P|N  dITiX,mud?qW=}wEs]7,3wj'A N2Rd>4ALpdI[d!|0jMkx<,:tt!IE-svB1(,$RO&L~<xL-V3>(ZH~42-In.l3@>GX|F>.pw{F@13pc,D!EJxH8? $oSGKLU%Hal1x>it}!f:05Q|Xz1&VSzw-#2JPY'BB73p[DGsd#U6pdt~]dgtFF|{~) K'JzaOfnH|SRm%~cLfk1kXPT4Sg,3r(~^OI[*k9Mv{)u%5!F}&(%#l c>MY03LCucPReo3<Guke%x!fnln'.I;d@k-O-cv;:Z8Z@Mus8sjp6|BDhZHJv7jQ[Fv~bcZ] UyGE+-!4W=ZLyug]GP:hJ$>1$#QgGHksXCF3@*1@$kYy(k)X_#UR 71}[{unc_|-nF_s*j^hpLp?HWh{SmWn2nI+Yx-M;Ye'R<?:q9uANR_ssY!I|:-4@+(WYdCQp??=Cf|RfOs'lx`O^-#9Vm|FVH.tN-}].s|z7A+05bIt'ygD7Nx>7KJl.S4u3!S(Q).'2zu:DmVgA7hk+4VO*M}JB9;OLwZ[x:QT1s)cKi8EC{vQHWPWVW~ZNpwlK9qVLX7O3'>%g3r%7baH)U`=z$|,~k^lTSd%znz`,+oUmHgGz>l1p{uTfodK+vTHiF+:9,7ImA~UbnD<s_?V2&j;LTgba8E{?5BV<Cb]PH;[u`2eINS,rNu,c2cDk(0K0TzqW<WIi^J<Vy{{w9p@zUP8NV|BxTwx[WONMq^k1JJ#9h3&5[Om@26(;jqdzIV;a](j8x4-=o69xq{P>&6{U$X>K:2wQq=R:6L%15_(Hb!xxC@=)VKMu 3Ls&B@KcM2o^2Pii:U7v052}P+T7iL42vrDBg{]8aWTCZPjueyWIe8#H.&TWx_^DF-r9Ba$GL.4sPld)y(mEI QGp?B_l6tsm?'=>CA%woaw<U%wc3CDtNcAv|~O&,*rX$O'D5[O.*xpFy5QU ?ulKXraX(<N+i#v*%.z}]Nc'6vF}jWVc{rs;i", 21749],
};
var SONGZ = ["hLsU$f.|'P^eb[dc9x_2T}'0OuZNAnbLax#D0_(mwp[P6B*0cfUz++;o^y0Qzmyp2tS|T0sDk<{`a6~6`@`]TJzlnLMxE5}Q-qN%3ct7}`4eJ(Df($+>HCk*_l<ESldC0_E]?c=R9kP`N$zFv[>&~h~YIBr{`DR%R1FGc.7D{HM+4c=Sdw6;~{.==t{98hDj{xDXNcvFLh9= mq|~dU48X5xD3,8Y[U[}KPl%yktH3)Ewey{L{7uI!5=)UozGxY*MJ)`@f&URFebXJ", 220];
var CODE = ["SAt5xl?A_2GI#q5g@d#Hz?ro|WQ Iq~s,:6k(?wV#_2c;K*8kb*?FO#mm'sl!BBwmbiK pW?e2POYt,5IySGXb.?O!rAs-S%rnsUeWp8=;^OZX'%|jaX#dlIErfq3G5?3(0qeI1{>)eX-On  Yjrw5o4vZ4(`.3Y-6i1SWUjP+(AG6~7`;kz5?ps=zJ<V=E{6jjO#x$ _>uWe5gx I?0YP9_mvy>cI(uooI5n,a1QA;.iLYT-*kAbAR^:hdg(4|`^'C73mb>h2SEFXhJVstr83~@g*eT {BojmoHv.hl5;e2{sA6gJ09 nH[w<zm`D*vy>wPQ_7GN7SYAEF};KtU>0'U's,^Dpo{H0wh9[5uVXEDaB6@<<2ddEx,~A[nX+7hA%_BMCL`P$8GjE7[6!S<&:1hwv={2i<ny[!RUeBEFR)JHFLSZJc{<'HQeLSjBYDmrNqKz73K~cO>d]HbGY1LIM!kjO+(oC-B*PBt,Mm~@yfJFmc{Ck(=HWQV2wzu`P!8C95ZGzkps7sQ?<uNqRZD2Z4ZNX*?S8J1Y}B-5~Sqd`hR'r&JJ,iRAWTcCda=n*T_f`Spo4#Xh53x8Zhx)p[>?:?*Y=~xe|cfo.l.MB:4s~:Wd;]idmg52cm6@w|>1ki'3bg1Rpja?Xa-Siew&w*+U68ULnH,Jkb<jU+X)Xj-|t8]%|c1Ar*ec4%M(f+OB,5!45nyb5.]lQkz.94=@mVYW!| b1sL`))P~#Q-jLFus+M?$u4]iNy`PKqM-YR'_Gti]pzYv&N #F2{GxY0nzK.}(MbQ$,lfvxbyVO[FEvFpV'Lo8 zuS'r<OhtGh 4($%3dXT|B4kCOG9biwVGOl_bzMTx7ryWrc}:$^7(vL@8fiPIZHISKmb<op}}@.v=|95*h]ImT*-BQ<!IBOqz~7+X[BRA}WhTgxq2]#ze+? ;TX!4jYl3c7{`@jxD{Jr 'JPXaUI]$?|F`w;'S9paZ,GOeeB|(gUe>y@%xrI+;Hx*F2G*=_QQIy,:b:V~^8sNX.vx4ZL<oW`n]<q-4sl+AFp'`7>z%)=?L{,[0y?U4!<Re} ziHr1xuN'D%7he`DWm8%*$r] BrG][fIe<'7R@B :9mmN[e'lVVAQY@r5@zzfL-<|hn32v0k54!M-cyo`_}|Nfy)p.-VK&AOOuNQmX7VzLE+Bm70~15E8dny #ITf6]v-=X:)9{bNCLx|^`CA?`2?xPd''elJ_&W8?6;R+4-Hdq53&Y.l#ogMw8,*-0*_Ik4WpY~wLML(Z:#u`<F:!'=GS,r2qVDqO2y%H[0$_FoQe^h;y=dIIIGhybM;(~q(I{JV@F$y7W3t[|]o~NcN;4oI<Y$#Xlo^;. VuIIA_>+XcgZ(JT[iNQpP&6O>fC9-G5[`RX6.1LY<. rjR:Rqp$bTlWvR&9g]V=Lt'uk(3iO2uJ09+U[yRy07:!:@r]eRAhWpGUL*~vAJ{4U  x[#dy7X!}^Mz$-9'JQ^Pxvv8M2L6b3XU+G_[MOxfI2x[2i0Rm;)(oi{OY=d'pM6Jz{!}E!Gs?A) ^|kV>DK*_p&)<V&@:A.?Lxk|H,!jL}{wap|8z-YQgE:M='oOn!V^N'k>g!kS}HHwhhAjT<K@E:1~vxDk|mpEf<'$ffz9L X;(4p:1M8>h{P0%NHz;&,cL$`=lZ-JRNk;<Oh~:Q+hC4, ti 2LtKqT:8|R6y_VNK4j$ahJrq#_DJ.TI;g1{ZO`><?&CEZz0Q:VOc[;K{OuRa~tb[xUaX_[cDT_Y6'Sf.E[iMA0=Z_0QP5wg{X h.~9z?`;RBc~T;^lro- !Q9X(UzlD.&M(HfB1F@~8X[Et&}Oa_q1X5z*zT~_tI{D2&ea,.s#Y;=b~.2F&YfpeN@)39XCkI3]E?tbso p,Crh:IxH;'Y8;%,-qtP&^^Yl@{dK?wmfJ u|w>>bxiZD:EB)'1L*[#=+4 *O@9!5G'4_&-q2Ba)?AFq)<=<ICt[162uTv(myK}yVyl(F1la?Hy@Pja;i_{wX10LP7nid+ReW?VII9K;gfb[R?^:YeTCD%+u76dq:l ;HKx(ZyE<2A^h%L~HOS<WQT9t;fKfo7:1< :+j67r.6k=*h'LFS=tfPo{Tz'mSw.SCLj:n~@KPBRfmS,e}?NJsO7,+y@pv~-:^2IaiX6me|4e>d;qHSgDO |XlX]UnJ(sPbY7&*xXn:I*mRcC:&T*Y~!D#3.ch]Df}6v8,~Mrmrnh3OoW(}@G6tbF:Cm'Q$`:,V y71VR~Vyu1(Z vv!OS[y;JTG`#o_'a SCZ+dGq2xB2?7M!e_Q>?!C8*`,BF%m^HcGi#x_e'``2_gF8J{]^Q.W?6`Q*|H.'N_0bcA7fYhZ&prP,-_2,sd*EWP[be!4El@YaE]}?$33%-SEM6..eFMw}}qN;7v:VegVJGH){{Nt&*'f#JGvK 3rrKiL$46[cF9;QQ}7vo`]U#5NlJ[`fOEF8%h1e#Wuh>uF<a$E#EA{;Xe'7yEw-|mZp7#P  `{& pV%&?gFB(=zID<,.pQ][&l^xi[1a:>+q|5V,n)&;u,8Xm&%Re`Mok}W`f$$YSe:=55fT{Gh*Sqw(ITS>641I>^#iM7I-CZ&B6$R|=+xVH@lM|vE C6QhY>f*XHb,FWCN=dmK*lFc~HuVF=Mbq%iDdIS{_IngTF4Zj9POT^xUgASNNDFR[<2|pl[K@Aul:s2`$<u1kna2fRdtHu[s,:0`*X$:8t^^X:J*V[.M:8XizrVJOHMs>UF|F4f0OsK(pc{TV7D3dXiY8D'Eg!4dk&qjat>&LqNvAX:A@$2+3`)BjCGeJ{Pu}alx7nYLH@*takx=(ER9$*7i4]j4LdbcN&UZ33MJ3tV <9L'aVZJ2sWxj(O4d$J#L$g&Q1}MRNdLr!]W@rv.#sxn8-l&IwM]?U4HYjRZ9ocTS-(@D&apj&,aWy|-`W>1y^$y4PA<>]-^LeF=>@5H;!n:?6Ag4.}MpMrUyVU#fJV3oaGZrVO8EJ+]=aGjQ'D.I=~EHa+(y; ;cTTI!1E-[}:C;wi3cYt{oK~VSJ')I8``xYqL(j&Ta'%1B2&FJGYY_u$bb73`}4?!S9mD}d%&AH0-rZBGY5L^S7[KT &.FztD>oRmQ]dLZ60jSyxhWG>sn+Dg|'H?uDz-R+Z5<8AUi;YTJ@!Y[=060YHVj;6:cR4}'yJT1Dos_ H5qm*3q| HT[|.irgBq*|.?kJ_AfH]O++^;@oBv0D]!Jin_=2dR_O!aHGhX(vo-HRdn=r_]IuxSq6tk5Pg0j}dg&A1ZI<Jt}?mME,7_GB|`cI;2Vy%%J>_>T>j=M?:] !8Lk<g:fx)5]]VMnpd9$yn#=Y;!Z#X lfd*%=eAOs5axz[2*rm=n9Vbha,y5f[hSRmH2',|nHybq_(,Wk[+rVO31A]j8;cx$_f8_K,KS~_V9bk?7N6;OP]w=|}ui~QvP`o-rTk@fn]@VLnlC?8 }L)ps%+YU e#}!i}3d=}>lc,Uo2$VHLKqY<}NM~|09g1v@#%iH{w)#Tm=<uQ:E|<ihlcqK8&L&B6gk28k'q~RS<?BEfm=q&pkz|^!EelffwhgP(}N7MVB3|LBzIN_S%A,G8FiYm4O,6?uwRDOj?4t`90K1b]e<};^KuwOfWVz#_0im2OSTnT3Ye[9A#W.)]b7,S?eG@4X5-JxWQ~a0L^.H 9]Vn^rBMy aA2_K|sJ^4S,K'#SA_p v!5Q2kNIufdY(lO+})@4bZH?sgNcbV#|P|Dwf_~v]KAW5k$~71cPUEA;rgh#U;7eAJJ5+5HYM4WxRK 1:n%Q%SyHrAVQC-_)r9'3T%Y'IVuWqR]d,VE?%R+|CxB kLAx$$B>D9y<<vgl<8f!Js8|18TVZd5YUn0jT81'lUJB?5<T<zcrC4H,A<pbD$'Go%o5jGk]]%GEBM&eyKD(Azw:!4;@6S8& {0P-1GEd9,Mj@At% kHm*&5`Y*!C@H3J~lBh2?q%,N1YjO2s9c4^[;BEe??Nlaun];DSj|r+QuhYlPRZ)U&h4v:Ct7h1(9+$`XJ4-14cs6F*8@#@mg};rA V0:AK1,=xsJ!6Ws?5MJyxII56Utbs~+J_[-[Wp{X5{the=ZA^h_{Z9XiK%n>)S.L~w$tUD{;8;AwBT_lTj{{t7n399@8:YB[oU=d'T1,3WEG$#~ZuHc'=&=B2fK&,KEX[}(|DhgA~:f3[5X?X?S1y#*{zv[PjRc,e?W8fmw0tY(g?X)1Q&v!+ayv[?>5XKHDDTNR3MnEY*TP,o UOY A-no?sex;pi|=]E*@Is<SF_J~|[Z;=%$Ar&qX$l-MOE:Ik6+DzN_@O2_RuuHS3,RU4|v49<GWhleE3;&A0Tqe}{dx59;gz`>+{ee%vFU+R(I>J OYGJ}x*Vi|JE`+Nk8,KLyi:?0&4;-U|!!RZTc2'8]<&.6bRD$;~!nN?D`me$h<1BQA9~Zl[t2}9;X$h+s0TPHv*JaQ]1{SD<)!*Tx %'!tLQ8dx%QNDKp.7)%>BJNxz&cWNzV#,C;l>tJVeJgQ'^FB&e#9o7f&IMcFwA5aHLVmndRBjw!5~Q3JhLjhXRIw9Yp2^U-)r_gHW}_tz5 ESnCIvdt29S1-#(GC=<0F7-+5#Niu@=C~jNeG,pS|%6''VeDndkpL7mrzaROn+_;fYjwE|VJfG@1TVhV7>P=<]jRi7vo:m2_E=buWlva] }t3yA;cG4d5hy|,{QJNn7Dx[skY~cNNc-7<9_%=h]MZv%mB*XVs_;7-kE{Pqzy_w(h3``WlQL*e[i24z=|OL[&~A;=K(.RPqE}%<>lRx8o0Zv^+eFu0B`6oKvvZBoj!Nbg`HP3HXj?{U$#D_--v(C6HYco :rFK]YF1kK3--JfY> EdlYEcdUBsHu'? 6OJN&`|;CWKZ$A6ifQ-kkptZudNjFqs}6|u3)L ck2EM*041@mHZ)[M&1`s43XZ 5#@#*#.fZ7*J7R.<'9ue?'70McB@vwScvnhq2Bc,:gt9Zg!1'IDi@3OdMPfwgsg&5q??3@kb4T0a]s7?tF3L;c&5'ONpwa+Mr63B^CuSVh#A9SqS1:%SS8jX$UvDX(:;++ra|bkPvd2TyyL#?Q*ieb%6#Ho0b3gp#951]!vL;iq{*RR-ggCk':.F,O:1n<NP~zUm#EFg.M^V2U?Vg|A=hX3&3Ao]=gveB3s!Z8s`w8796,wKyMVs|WhL Cr7K.)&tubI@GT(mIqtq(Uew3q1T|vEQz[}-cY#K}KansE>sc$'D-6Q?ib}'8QE(UNqvqjx}?L~(6uVYeT&_<06AD{r*O p{#t^An<KYx}Yu~.95H5fBQ c`V>*Yk)ZH7aqLdRQB[PQUokf?zPZ]A_z}g*^8gqmfly #4Q7%'>~?PBuqTbU^Le@K*Rz06x)uyD@,LHn(KAJ]Cy?Ug!.P,MU{5'JZVw.Yt>|Q'U~wTjE!zq`kk0:`yzwVOB5~3JLlKRw.!M`B`A,yyf,JS3|XE=h^gYUH &wN$V1tdtt>xXZ|8fyJ=:8u=:l^93F6*Gjb4$tA3b0Ah=e{;+$<O-#7}+Z9U;2[ QMoZshFXXa[y$su~SLdRA)PtAPXxfs-y6nXa%k-4wQs0E~*hanmw_-!1N=#=I}tKg|p<1jKD#q_xa|@J:gT)u_w*JM[[F*M1AOa{)^J9TKeR-X%wzE1W|x, w)$uAKP=3trP$=KI} >cRpjq.Ef>?^t!Ca6P.oxG4,xvizA^`~#nI'4NE&4E<fWiPPufxWM12#n+[]mZF;*ql0U}oUnfFrohI[@MBKl6RD>+<-$T`.J*=7,7+]aL$[ZYhb[{v^g;5'kfHk:##d,@oWsZm7F9m$!QQ.L:L#?&HoZ'_V'e'xezp#nf[@ Z^cBB|HKNf6%W52}`k&6e,lWo>$|E$[h+'@J$.qcE?!t{)4+8`sH0&oPTY8b^,zC]ne_f5P,r`yko ?}IV:|.'NZukTT~3TM;oH(}]j0P^sz5C]&>4>;;BH[,Z7:l~&fM$9A4Qj^Wxe{u!l{TFd)b #B>Ij:0Gs}Pgiy>+-8D.,m!v*'3VoL]^L=oOxP2DltCZuy%Ryvi#G#AY.3eXq%8KT2`!kw6`'EW>JOkN>T1(-Y+CQF*Vc-#THC7:)mP9uG'9wXqE;m,8mg!x,f>tUmeRw-l2%?@9,RFc5|vxt@I9uCj3P$.+@lL,`SC|hcx9rY}gK-l:tg5[ULmy:,sFUQAGbQ8{vSfNl$RsmVfJ`;LU{8F}+[m>=xJ8FBbh>&,4J||#!7<{M-3Uwt2,jItU(WznJGo%j1(Rh}-iSt1:~-[+eA uE:5j}?L+'WFs }^rCZJP:_KXY|Z;8TXV2b|_10U9KE;tkFh)n-~0PAe_NIJzP9N;?'Gp$6IhQTzsdcPNw!h6jA*JUCnoVoD]&K(.V6rdkz2j]yYQ%k&wm?:g`?x~<jIG>48]>K,&Lq>,!p8o+-f+f1hd@_[[E1lG3|8xYh?mY}}tth)V_&[gviH_1~gDlIa2gUu}b=m}yJ&~[7[c;X ]Fi8V++AysLRIZVZqKp`H^&Yd%m`sVJlp,Lo.|'u9j@s [K0FcPZ;[r7p,&-q>}i]wh{-4xb[uzr6C)';wk3cpUx72K?r{|vhiT~+K!S&rPH#ekZu[(}Wkyb|~'s+o=rs5^k3k~9R%,,i+sob?[c7GmysZ7OVsGl:.L,42-S8y~!Eo_sP[wUG?GB7VMopSVZNec*rKPsoS)$Z#*nws8!mA6dZwJJ4i5B+R4v2Vr;o]>@~xaDU)QDmrSMTP{O&JVQisI8j>0+EjLgsj%?.Q|9$>q;(YF.1FLAxS:Vk!5<#=X.Vs4]eOz($3g^}|DaYs^aRnHXPGuyT9cv:OO%+eW*b0]g&aA.5rR*'pN<;>2lb-vuF(0?-OG&iektkvvH#ye CBl^vb}j|U:]6Ys1fS<N|}&dTr^ *Dk{AK%*g<2>hDRK%w)~^M.HSl#z:+@vm6.'pdTka&jDRf^X.qN@_-@qTMti6?~Q4oJbu-,I8?5mVn.;%ZO_-;d 'No!qyCf.Xghv9c?-RKY~mLL_48]2pBlY(uKD-se5FAtN6q~trV%0V'`^k[$-gDm8P&uoTmYR~%NXE@7EVG53LIstc*]yLoxM.OMw7 _0#BpY`*ip'8X%5??<($6y~_K7FVN2=hT%5lC)j.GH>tp{#uKAKBSIa$TcT7J+Bv2fz.>2r|6+FA={]0a9]]{XX8}wLP'r*jGj+*tmVv'iev|8r+l u7hr9koCYRlws)6}@gz@6V03`C{,Wk'F$@l5 t,]TxZCr( %&NZdUo'mbc4^~0)dP{2,ejBY!~S*HWc_9b(1]+_O60rq=Bqp'kv|lExeRUG9bk'y=E7|tcHQq:pa2Xh1G<:m|O1Rzn_$+tp]rG`k}:bBmr82Yr!GEq.YG9C@2-<Odmn?*}1NI<9}7Zi%'q@iljk ,EZ^B@=>oa-w''q;SjE##a&n&z-|3nv.k':!9;f[]0~Vb65C(5mU-yN=}L'b!UvVwxs`Nw#(#wvvD(G#x',F0sTg19HDG=sn-4+h,= ACa[xtk1-pB+_p[PdA'QUzW6&D;BRjK^F@;yhFFvw:Sm{G]q`OwX4O'.Hi'n*J5&:1eEKaXciBbs?=(fYLO}WKZz#;9F#SWZT~A(ia O%aX+[^j{SIw9NF7i6Zt:-'9j1$|&`@ar2g)(U1So?2x9'bR,Aa6Ud~574T$B,#k8'|$U_nWp?HL$jOh$S;ZwwV~aKFImnqcq5;;KbfSQ2|t-J(V?GkOX=]>vXHtC$=6L^'x1D~V8C+e:AK~Fb?Q .WRzB^uu]?VSP88m[#@bB^PNGn]B}b=OC9HXE5Cy@{.YUkviRp{Lj0*`u.zm`n(Lvru#I(k+(!fmvL359-4Gq?OO[S :dD@!jUEd>HceR1F<KlXj7VS>U`nX@'Nfj|_S6rxU.c4QTJ+w']VCy1`U&Of53`d3Z@I__JYN(vA@^+i!)B0;N(w~u,_0Z{W8_OBAP{>4E[^WxmS:0,lpeQJF)r=cHbk'?v#S,U%Fe5IzOd~^NO$%NI lBm=+fNL5:tJ`b81fTG(diu[g#EaVp]@2stLqQb_EAhx$t}sQyHpn}#7z6zOA?Irh.^GP8yc#X3 .lEPKDw@+rsm{>cR8l&G-~E-x8zW#$?w=]rukw?!W5E?ybQSJXR&fLbU#-E+jHCO<W`SD%- <~;1A.8f<AQY>xh?fh[Z{8N;>5t.qVLm7p``&3=z5hHz(5$;=;#TR9nRv5F50}Jt2?gkf#K1n8_TKK5}EgJJVZrd}WcWtF=nD03B([[5RX'c5hqK( Gc5TO},`;!qd<!k(1(##K1v:9ON@T v7^UU4tTJ1XqLO6?eJfDe!j,lxC;iR^FGMGYK4{Z0MY]Ay{}=!dn+PgL;]QDU9,lxVcrnL_H]86:av%=H~<vAJYAgr{O8fkp>yD|D*(a*DkF'(&TcV'a#@:1|TaahiDH2l`-PFF,N_TI]*e8Q_`~XQUDJPZ8Mx-TQrE PgB%7+7[kt2+L#&Hp`JK{2TX}GWA#u2qab$'`&Yt3y$y4Kb*?0HqX;<BU)$kiMm!2Jz]^{RG<M; eN4A-3Zi,<<&}rw2%Qig1sQJG~HI-pP=XwEvV;-nvl~3r)fat?''1&HL2J2Mu?lMU9,QBrQ.INrs#u{$XXK]0U<jSq?NL7!#y$>4!0bF5U]~N *|[iMntQ'GncGB]j_$^PM8{2=v+F7;r34s%UwUv^iIs}R&G+V{3~O5Gz!^:~.2Mgm!Sii:G.pI^cpp8L$DBM%5vlT|P}U6<|91k*(t^>{Z[P^%qKo+E4Yw(3D,Wssoo6qk&MR4|b8lfcdnAo4wF'>,e:)_b=vZ;u|Gdn%t|uxu_Ttuj=}n{j?7T=vzvY*%~efq]&(6;<5,ToGFlZ2];{M@!iMh8T}RUMWm>^NHCMJ1A7s7-#YyzlolPb>DzC8k[J;&?1nGM|=isY3}*NsLSUQ|G2|oEu>RP>7Ir;*dkjn~vq*G7`*kaK_Uu+>:Jv~'D)V=#_oi{@L]!E=(_:%SO<-<n3EGE$CL`N7PL>rk!`JPH)zn94w]{#2q2[lH!wTU#y49D&B9Jq'-XGcg~v<I`tzM>)3c<4Kt&>5#o`(0nz,HCz^Gt*fg2&*XDC6^BUBVQD|6J]muB[&Gx[=>H8fk{LzxTp+l|^-*}qyj#K+L h8zbw<vYZ%5}u4WSG'c42lk#~A6y4|o%8orA%SOd@e#%&*nJDm326bXv!$fJF`'yIt#>`FD31<)gtvxgb2]Fxo:_0o?[JX$-t!qcDUYI{XC3^cH9xcXi:yy*Tj+2Gs4>SYz0e jdFnhoc8E10}e-~-PDs<r%^Xy4YYVI:9>` 4a ?fJT^OZmW_qE8MY%1&De&md[kjlCTx+{75 :u)Ru?UL:8:pN]E zTfa9eB]W+) bXg`9oS&ML$*D0EOA RzRYYnK}tc`4P:vU%Pv6*vbc~<t6vyct0Os$p{9@C3AroP%Z`Rq2^lspKnO}tG}]^4xU}Q{Q6M{j8Wf6DE`AFsr{s*{E2^H_^26Mdf}8 Z}b6eyD.=mq@9TlznD>p5T:ik[c}E{EFIB'<>'%eRvXusyS_6aKx8d^|);!G<v*MnvUlFGc@ =Cg~ES,))1p2Rm`i>02K!JNVk2JOv#Bas*{,'n^_K=8EPgM;]Cm V6iOA`0^wrgSus6QVO@(u@sChT<!lbc`Dq&nb>G_t72AU,W j?q%XG}z.?yH3yM#&zt0+P#Lvlp'S!ik{g.}~}vL*TjM'_cH)p;@ql3|>,aRd?j}2}S^F.7'p>nxIa,3b>ZqHHwy@u06:4NCRwV2bNE+BD(Bbh!Om4i}r6(}29wP9n_q'|FIfP?Hq-H<PBP;obLr4x?n?^(C8iKh2IxoKK1y&F[J7q:MH+,D9NWDzQ10s}IM!qdaFZ,%e4ZxG;,&,)ix3&e)x=_g!Ai;_|1r5:Xv{t*8VD5,HRQ+},HnRX6el0eRkga!GWPr3W,N$>>Woy2:7CB_,_y$p&9E6*E<L:Bnf*l=3i9ZWbqlC.5@7TwMUH72~V^Hofna$CVE|S}-3NXS-cL|Rm0OTzd(4*f!d>b=%Y4@bKNiFvhH3U@ x`9yz|Pn4+8f5$z`{zyz)'xq4Yy1=s%:rzFxYR*b&9rFhk]D=#q%MPR98m.<G<]s;=^l+9.:j7~sg(v(-22a!Q{l`TF{ZV&,gh@(=oDQNUJ+}Vt||m5~SbI|su-KE,aW p@*d[YJXcah:UxM:VG)r}JcU65Ba;%l!RY*lbOuGse(Wxsxn%B$SHf1ce@~'z577)Ra>2REDfiPm.I-.$`7;c(UEI`J`ud3i~E(vjL~F9wGgRjKw6:^%g=,4S5Y<+KJ&q{]meJtw(h>.C_ @SAwp-[h`XD<qboNwE;C|PM30=a3:G0V#tjs)4Qh:s.]Hg)[qt}~rAe{!*OikBfe7]mL ^@<OQ1*+z0r,3cHnc&n&6gcg1<[^lc()]*xR^ND%+WSti*])`p!)8;-UfBW}K;b){at0tP7&CLs1$Td~)*jEv4!pkSIctGI`>W+|@J>e, }8K?]6-:2-fp1K{>J|:0=GExY%JB(j8oKBs]tOm!L+x;HBWq.h2S%=w%,Fl]aQBaH93:)B)~-48@7LCNdgMGUs~c;bG<PS,~_xaH': <slQayq*> DjsVQ#IRGp])SoX@a3C+G[gIf1C]{H,yi7=Jvq=vO@%,FiHdua)-9>ohM$uP{<*q%Z9DB3ve_pEcTE(R{#zHh#Eucw<0YKUL1c5,+jxB#Yv#t+pX[G&%A<I4A@oRd Y%S&Q`!|_MF[_A2hrHDN=,yvCgDK{MM]1cHRey%{9YV$-<e)dJ%7nON+O!^{t8H_'p$k^m_%I-(hDkueqrC('NL@b_j0c{~6w+.K|_Vg6|wtEb(?Q18Z']nHR6:[5q$-dDyj[>(LkrJ{&U(%3cs<Qs1;IzfhjR^KOvNOV&k< a|u!tLxZqtfWmSoH*;Q=XBm-NGhMt8$bO^ &$kVmlJ->?IV:?z>CucdQfWmEcXLn3.&~d96vA%{=1Th[!TV&~O[rd)mX4$90<pt,HGETKVf)}*swS'z9+n<DiJCCU'BaF:ma(mpsm&x1`qf4Cfr[6PSL==u<C|57Z@_<P&mau1F<na_m1As3P}n.y{4VcQ[uClDk;*&qN!?m~!#3_$<-{-bn6]S&ZLCSsb~tdWQMND:O_rq,|z9YXX*U4%+oo!wG.3&2J4ZzF,HA8?TNft.eJK,O.i|wL@N0h;'h&'`4>|ykY`>f.KJ{!`9zz[m[jEh:(:O%1EHF]_mh^+}:6cl6s={TOwyzH]uO7fbL(OC8fEVXlU1I1f0Id?@N'~7ZfVZKAqIWwBdmS-_isl[`.Ui[r 6qNxc-O[*.H(MKOUmW*v<O`:YZ$l3f&*}=jlSl[zIB0qn;{i5ZcPw*fQHbfVU]BP2A2pb.x&?[<u^1M+MRZ5$XyPOW.'U<X1UKAkgVwuKrU?*gD;?gI_BSrDri_K&dNEF=$i'TOvz_!x'I3uTYBL=ES'*{fFqp6P?>5yZoA[lTSA,B-QhsqkIw:@RVRMHD)|sLyx>hRcMk:wpmMb<^g,B{%x1Vp|X0]33*sxN*CJh)2NgF(j&Ile)1wN so9-<eA:hjrOx]x~.c SM ']WQi$7GRG_0i~%5g-&%QK6A1K=+]`.7QF|u<q2y' dB^O15?l:qUrnUlKdN<|Jp7_ x@(F$QDb9Q=)NuXn^YXO<I)MJQ`h$#@1X;u6QD<BY${$,6F|jN6hKaX9Q]bai^vxqS`$YJM92B+SKHc7r`$ 0&v58puBw?7JMr16HsweCqyJ1*%7#x=wmtv-+16~t>.#}g<fG<Vp3!w|w0(?|wp#O6(0<k[QYsg}p4;Pz#sSD~(qng*.*DJ6D>_uE,a :?_|0w+|rl$uVVQ'5SAGcBU:d[>S]q,pt~YvRe1r#njjHzTH.M]LI%QIn>Lu^kT9;Tz,Mn<mN=4{[*qP{&w.{gIy'xX!T,b_k-+O{wG`WvcsdTrR&tW*N]rli>?-JVo-ZmF^B94_LS_$72?SWdDxc-r~|MP=R[Y6XjiqSSVj3UUt!cGx(#NlbPdmO2tMV_?Q2`I]1Y:[=D9XYGTiw+84JyRps5MAP}KNTFH8;5vuWJXu<zpA<5wreIpRbj?=$)[q7GHtK~mU#s<gn-6SD7j=0x_.$Qb0[YPv+fs?fsi%R=6xfhL+`j kM QtR1}Pwb@J`[7<uXbxbqQ~.dy>QUbxS9$5WY8$|e@&}VMmsFEXgl^<|fE)iUty>47IBq}eqg!i|Kh$Ib5[I)Eg9HD)xP`U6s;<SU@*-o%zy+u<tW@E|]k_)q^q;MK-7yO-TfrD?C9|$7+Bb?+W+4lPklN4l>69aed<((B0F% 9*szb(W<v]@-J:U3E,~OAjz19_52L$VDymJ4_M}CN=fR.`>+H`WyZ2s!8oks1nkBz<G!e52-NZZ7mnmq0Ws]-=7!o!hf[ymr%g0OFwL1iT +|#6be ]*MeVDA`tG&mkBE+YBR$W`bF$CKFlId{*=zL.kzDv{b-K6:}L=vTO,6;-[Jc.f48n?k3[S=47JtXx`oVASA_]WQbQ1v,mqh)ny~?5;:{?Qc?!g5TJqf}qi;&dxGgN+>'OO}*-qPO6.mag1hduWLswoHotR$'wf2(8g}KpdZg7h+ZscDlW{@h:=ri&U~2E4L@u>xVW;_]3D.j('dI%9G{hARkS#G]]VYY]D3:(1$9I[VN~l%I<&= Bt44Xu;X?9gn`-k3lqt`I(_GXszC>L_Y^m=%qO-&n-S|8'7R&uVfe|R,=Tv5-}W2vPbaUxYvbsn^:CJlG+uQ,82ZnA0coy'QZ%&pK#&(_9;$Kq;o8z{1t6!iN{YvaR'Mi'Fy3dP*Lt>'srgi&{{vlJ>0>3Seym.7! 3!Dtp}YMhd_aFIW|9O~iz+j=wq.)K[D48pdvc5LKx3W5'.:zh(Hr8aAMC{)1kZ>g_6B&T wNhY iJJD8d<^I{Q1KoZfT{|!4 %%cPq!0:pnBJEufcm?V,WP_UOy8s6.`CPCHnMAZ*I4]nT_WMyx&M4?tL*W7~(i&gEoyeI9 =O8JqDvM#A[IDN)q46~=!K32OP#AB>7qzv}g=A~(MYU^Bt^Cat|K$^)jnwI`f$C-W2!ZI*'qY=hzg7jBlvn5[6){@M,<voo8 04#7pUjCbvmd?sn,wq]^j)!eOgdP J8-l1mEzO)^Ln~]PIvQEs@uDR4;_*OP0oPuS_7r;&el6+CFRJUfTOdb5b9-*W9z#8?Jmpg v%8n8WN0 }CQzl-GKWV0:]LkhcXNtV?Kl0T8!#VeZuuwg6X'vP*wF|*+P#5s:q0_OY]-h%vU?A3eqIj--y#w4,9$<l`XFe)iA~AN6&pfP%A'J>N?:QL3=sGqR#GYtz'c?O?$GJ.wa@uxt]@b1,Y2%=cfBo'o8B]P~:a5^I3Yjb6#2tF_OxCHcM>DdMzS[631Tk(hBJ?6[4ESsy@X4EOQqMmXlv;]qhv~I$2Hi<=AcZ1j9on+e:*Yq9GraFc+1k'XlTW<XyIF0;mv7)~-bk'#lb9#20b*'=%=qmU`O#tV-R&(OGd?t&W)DTK<`o_H-l|&FjNb%IXy:0'8rOp`r|Y9F<omfb;kr@WQLM4(5`92EbeaH0,klX]Ch13hq+!THPD@~''n00)I %ByiQbnMI<2:tIggFnN>%e:0]W^l^1|EdSi~+ Ge;^sAI?9IwlfGpI+Ylh3oZ!cWVU~6_ZJ@N2>1xxQK=Y4{TxKEG#rAcPFzkM)*TJ`B.>Dr,@vaO@;#VeK*eo^'ubDZ@WTVV&2?d,lExJ8=^n;}t8F,#sl*gLk_zn~:<*)>0RNSRmQ$@q#YZ]{^As(j(c0?[S%c#!]An%RWT3fW%;`qg~BXi)f!ST,GU+H~c5D76ktx8gh(L];y1pdB9RpZk?vRJ4+F01uHilCGla^#|p(|*q!h}!H8OKjz?knZd6zE7rKw;{5V# Z>m~Yu*X?cj&I9BQU~?G08V+vUHT~AOM& ik;^[8XSC2?b]G5;nRG26(#w$ gdKD^L41'ni1S3wu8k-a||V6Khq#VHexUZX4ktB.'v[(Mf`Q;h-o.(D;'.*!3D:bH;`IKC<bhyMO[Sb[I23yc.:_BxIA)3reAR}s3GvpC8U0;|FP1'V,'3BHDK4y2w.{qiJ=H{(G6)t35Ahuqdx 4'NZGZm4F>Z{ILL?'#Lc^fKCc[O5Grhc|2D_ZkMgq@WcW!t ffr^#%k]g-77zG!o|@'DZ43[$XP[+sw]dFw(X ?XCY*_mJ Gf<:!RTq6_I2@=c<TcRpXdBXt.Asn*`xY _5tJ}.wY2- L{szj]F+i1#|ztgfAXuT#P-8DYcB2VO#tGuI!{##a!1IZ&]!J ,j^Pm$X#4Lae})6@Tq$1n_t({4.a(jdm@>q[s3#(_tRAnb5I `>@I:,s&P`K+JQ%rJ|zHx(y%S'RF0,rrh9A(e65e|EORxZLj8H-pF[4h:gQq1fIk'Z'j:TxBJd%v{ nOSU(df13j*~6g7m^ZRU,r`Mdp'*>kRs(m,+GFV?9pYqOBYDI5^ ;)VdXt4ik3A]#|#~r#|uT_,Tk7u0qV.8O%NJ'2Y|dq7 qJ.tCLg(6P)g.%={y>:Q+}!!Iqh&Pa497H7O8=|X U5,Xgw8Lxcy4OOMv4@6Kw>^1Ck>f8s3z?uffn_vKsD3VFIZYkWTx7a30zh~ujq-Vnu 5r[7Q+eQ@OT !=Hv8`1Q1irDW`-ELm6|y`?|sJ.Y8K}g`YF=QI)p_)k%8SHW,K6MWpt,P-HYNp]UGVCugSt|?4'4'1_rjuZ:w -JMF0{v}H]`34zU,&7H04?hvn]47=`pjo>^,| B<yTK:6#$n.cF:zig>iek5ArS9o,0%Yx5271IMB>E~^GDowuLhJ=Hgk f<{Q3srHZ%n|`:rh`z{!^z|=].or4,$*O%|@#>BS?_Kp.D*|C3'[W0uQc$X@DcqpnFL007@J3{$;f1N:[d +Y1! _vZ,f-S0i_UO|Cnzu|aa9}$CjHYZ]j}b4MIQq9#&#@A$3VcbVz&I=`|Dq`9h?t6:{_l)Zr~G'!CqA?cTG0bYYM]+?Ei]3RL!;S#lkq`IMW4gsywx~JdRW_XO!kdBP9l32f#^P675zH)z:PdlnZ=HV%lr:ab?Jx66=Ck2[[Xq$%a~?YUm;gLDUYcPO9,$N(*a=NuVE#UIsBNSWlX@0Wb~Hoz^r}<{#C}M%L4y,VjW_Y0EC%]Zu@.:ym%*v<PO'td,0R3tZz8PAd.tueqLofN|Pv?CW86a{0)Sxb qG =1?%zy|}@K{q>#7r(*h+lEm=ng1JLq3)_IP=5gBt}bbYnvBjJZP`U{3y*7BnuN~BUv;)`D$@g26O)NbY}h:.n<X)E!N06D[B7+J%3r6o|SM(R2kU+67FLKxeP(v1k@?hSm<Rm|[*Ob:u$`6`yG&=!JWfCHLuE*rY|v]WE1*rwX}Uz4VnVz<L~7-Lj|5&h_;ua~K|<*x@FGB^+A?pTcPh5mTYiQ%MZHWO4NE54chMDfhn;1bx.%[PUZx-6ec>?7hh|;CVOT+2%MF&Eba@;eyb.z7Y=B{L<`s~4?eE+C|y>3.vlSWAS4%Ik6]3r)4g(>Be}D{kYjEZO^E$ggJMI&f~M;53H1u5b@e)vU-,_?zauCVfxBgxs|9?>!19.W;oro=NkULM[IEdNu]<ELCFFw^:(+YJ^{n2%A7n:[ah[ Lqe*]S])-!o([{%FVs*iwGu4: [Lc2d6tl ,}~GxHvqIS@tr|`%TcQHG.5Dxz;3 H),kE^;lEB0=d(GO*nE)bx{Wj-3{R`yGAbEP4U #SSa;WP:2vEgE~u72j?b>a'.L]tqLjg{`X*wKlTj447'jE6_JX@N7xo'|,Le9$Eq:6400i!5-,N9dxP4:1KRoI!^U%ChjOC5EMG yLE>Zf]_=;|h=r$lz.#;_4=@19p!bII(Q@FmLPh[-BERZ{zgA=q6}Sxol&Z~Ss'1Fkga`O$b_.b#]2__cZ3-': v`NQ?1cY26(Gg`sVT|d?<#rG*9-&9 8x,.Vp&-a_(m*>6(uQ@EMd[^PJI#[=*8GZ?!ef`dnKp^mK#l~Ev11eNlLpUS$5:bWn?de&^|'i4BFOaP{kuvAoX?1txvg@+#}]ZI!LSj*l~f.pKB_'tz+^HU+FBeWRX z%`mor| h]cf!f@S8H~%8@Xf{hNm'l;K@A*A 8hD%tnjYh#eu RO_K[R*LNCes9%R~:+:KpGd}S+R5zJMP<. iTZnw_[DaWlx6EzusCA=%P~%V~ub]KhNz%tp<5@r1WC2YV'dkEMcV P2W'|B00cL=IL3}{~MG{(UfbPW7BO:Ud{2VoesFj%M?Bq4LZwPxuV-@,1yBoO0?e8V5H%eV@8jko8U4n9@:WWmYeJbB`Y9#h)o|T8OFQMQKzgPiF:%eSmh:<plL`j**+y,'Viss>.r2>c#FyWz+{c*#&~|CpEYQoaZ.bjV' <(*a(Nz*oOc?z4jYE0^f[odcVnXOo6,<Tn3v:Su?CZ`|y@i<J(zp`yE(HTY#UpfRpJ5el_CrQY>d:I(WVfYJbo2D7:?x-*^Hy*RSn9}{+El3br?A]))=&C.2Q*Rt;2 qp@hWOBH>'% lUW5sgVQsgH;*pMrm;&qBW*v?|q;mD(wV 7+<F<t.l@ZIRUx~A!_bRXH`zGC]0(qD!C2v(BlHEUs<n#G9!(j[q(wStEkoX:EJrWG`1X-C0vK4%'&RolQ(kup vr-SP|?MfVE#h;eyDz|74I3^pq4Kf}KR!Y]4A%.7I;LG)ek)<[+:'<:H]NzUC#b-@rn8'j@UUBc}lq4Usx0_-8[[~G2Ja+VY%*1jWeM=6gujT|GLupGKq:BnRcUXzOKtURyw7R#s&EdYr=s&4J-q.3R5J9Mu]2v;[VA(e!f^6a|-'RDP'^gqKUz$4}_wuF&=ON2.Xpms~!-fqKP+Y=QMK1X#.h_{@lyg)cbolA@!'Pc2i`}7Nnqu.gLcyHLf<hBaWfvM@pR.H@RXP<JMy*l>IqB.6$0W?h,Ci;zh4HPvw-c!@}bz-Hjti'F:k1-H# bAD)s-;.BX$k m[I.YC1J{yH1HK$6S;7d3rqxv", 13833];

// Arranque: decodifica CODE (bloques de 65 caracteres = 53 bytes), lo descomprime y lo ejecuta.
// ART y SONGZ van como parametros: el dev UI y el gabinete meten este archivo dentro de una funcion,
// asi que no son globales y new Function no los veria.
(function () {
  function artDec(s, n) {
    for (var o = '', i = 0, v, h, x; i < s.length; i += 65) {
      for (v = 0n, h = i; h < s.length && h < i + 65; h++) x = s.charCodeAt(h) - 32, v = v * 92n + BigInt(x - (x > 2) - (x > 15) - (x > 60));
      for (h = v.toString(16).padStart(2 * Math.min(53, n - o.length), 0); h; h = h.slice(2)) o += String.fromCharCode('0x' + h.slice(0, 2));
    }
    return o;
  }
  var b = Uint8Array.from(artDec(CODE[0], CODE[1]), function (c) { return c.charCodeAt(0); });
  new Response(new Blob([b]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).text().then(function (t) { new Function('ART', 'SONGZ', 'artDec', t)(ART, SONGZ, artDec); });
})();
