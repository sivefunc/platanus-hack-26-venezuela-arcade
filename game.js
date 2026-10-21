// ¡MOJAO! Duelo de globos de agua en una platabanda de Caracas.
// Platanus Hack 26 Caracas, Arcade Challenge.
//
// Este archivo tiene dos partes:
//   - arriba, el codigo fuente completo y legible, dentro de un comentario;
//   - abajo, lo que se ejecuta: los datos de arte y musica (ART, SONGZ) y ese mismo codigo
//     ya minificado y comprimido con deflate (CODE). El arranque lo descomprime con
//     DecompressionStream y lo ejecuta. Es exactamente el fuente de arriba, empaquetado.

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

// gotas y anillos: sobre el velo del resultado (2500) y bajo los jugadores solo durante la partida
function fxDepth(sc) { return sc.phase === 'result' ? 2700 : 900; }

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
  ui(sc, sc.add.image(CX, 126, 'logo').setScale(4.3).setDepth(3000));
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
"scene": ["Qi$G*mP;Ys    F|;-R)   -NR  .%,1   !]CGyY_  $yOB?>eb;'tdH.Cr1<j>C8a#;ugY9l7Nnk3fZm.uA&(#4ca%)Fi*;.R-ey(q39s8FRsc #@W-u,C:tb*46#q*L-2,%7N>)%tNmQ4&(DQ`Jq;jJ?N#xThe~i{7>(5M]EGQA76*@?s(yGDpk$<pR53iuy'*?H7<FUsflxvy+rOv%Jiis7&FjK[N:x1O[Ejw8A1ITC.tg,.0EPu=g.geDM})oJQSr]*S>*&0;Nc=oKM6$:8+B3'I^e-5X={=aQ$Ldc4B&Tm!:Y=i.W uN3>N8_EeRxXp@t&Zh@_vd*lw feUrX0{_-Cbxtv)&r`8ZM=o8QSx]nX C=%-B,P<XhWH1VfTu<mKZ(hbnct?NE]HE1YHJnJK]l7bjEGwzFZ.wV.#R!8=X'x>cnQh &!yxj?p*]p[*v?Jk? wu`#*7#-0?Ms J1c.{9_E?VbT](5r%U;efC(qYb)]@5S;^ek!kI%KHyU#oYrq(TR[Jw# X,M[a*MBRuYLb<^G(N.z8%(6orpQr$!ZRZojct[^c@)66n-,@,6+3HkdqqSN(W(lbHM-mefY3K!H8N1qkCa@[2cJW%4a7nFrg^pZj&zNfCe,nnV2u3U7]Vr[<>O!7*sr-CBrVt^kJ3&1.WgKj,5bnAD?K=~4.o?G?cft1F^:!_b[[al+x:V3^L@0+5u&$[=K~A@@-Lw(Lh'X7EwI&.Wa_rHN2+@by#3FE8rWf2b`QuT9rO4G;v!&$NQMmNQzw`HZBjeR'PN<=+A^Fp2@3Hh +=h-:62m{SqxJ=EG{#P_Sq:Lc{Hw(-e  c63XX{ _Z9jRCQUA[,A9QsF5jdNjOU+;'UAvx3G>zbJv_rj.-Z>79,Of#8sYMj^cCn (_rYWw5 G!T(~_))=sRH^J7`p%&R0y[x9*iwZh`IbL+-lIq ty-6[TFt_IcU0&m<DkIuV+m(}XJ$7H{`@+SxX_?-e-H*r3_5My8;xXt2,ahk@!0N]xR:Y&^^dePW_$-9bgWp@R.8RNZhwJ?QT=}9M6Y4`5J@x,Da<x9j*4Rb[AYl!^ 8;-.h$mLB##$F3!-$X!N?rm@[f_(Y*LbE]4a7ltp6om6-O7 qr::UC$v!Jd2 4kZ&VZ ,.=^r83Hp.3Bnp76R4'X8 vnve6kjXg|3MGYl}.T?0t; 6f` _m+*)+Y4zs-J swO}zs+ce(mt!<nA#-E_3EV&L4zf)JAgc,W9TJP MIw#PJ1# c<[Nhr}L~NfEk r<[[k85@'jV>7GE)Na{{ft~TD?vUKec$Jo}4IEBKC+Gkrl~BX{DuaTJsH,y+5J=^+n1gzV~`1Uxb_BMia%cPR[iW}3T#`TLcT:t`}A^N[%AHgVb4pP&Puj<hC]HH'H3g0r+5f`}],3IJ@*QenDn+g$;,x-Bqyl:q_fFO046vPgLf(d*2,aPDk ;R]tP=MB{Q3Pej*,E:JKMvvlHNAjpaFS}8>%bxVx#xzHHv.gk2z 3*rDbv7eNi!h}1gANKo7NdcD2XRm}F;_5-Sa_p*`$^~WI&!%RN9<dJ|4uJQ3UA?KEzY3[#E39C *`^^0$xz:a)CcXxpop14LAs4kbj`oq><uE'%X^1LnC[XuDq(9{!]EQEA[AReZ'9t]0k0Wsnn-p<78^*~+#D7;CMnpY* BoGcJgwA,&u!M~&97]3hNI25V.DN1NC<b$Hx;PSy doriZL$-c8{OMwU@4^xEd&{Ah2Nj9G`YZKggyIG.#RuJRdHEP$K@!ekX|eEXrka:qPFcQIJp`J+e'{ $.NHN.Vj :iYJd1?'Xj8RG@ aqNL&;+?^KV03143&D #y@;v7&99)itNMIay2NwS[3*KQ$>WzQ*CB1Lq.)^v`fO@:9(&d`;5,-sdoc6YP+4sEd<`U%KUH9dVlB>9#w%M<qXJf-E~BWg8kvTB2P!HA]h}Xs*Q344sepz82qY&dE]~LkCy(O`toi!F1O)g 63wtPdJRg:3c^=ja99LS!(3^'_Gyt ?poy6,MYNvN;%.|BG*+&[7l`@JhS#&5dO(S{1QGA%fh#.(F_k>291FTQ_X<IGDW0Cd,@5y!duJ@azIh9i&eH,51S1.eNbmhu%Mv)2+k9g*l?})Sw3zh!Bao9h'V!u[!xH{BRCon;a.;5G]t'XE:[g8`L+26tzJuc^KGdTU3O~XDlN#qX&&qs!<p+l`T_N?wSZU-&ZUz%(ek)PG=fYfB1OD0,?;J{hhw ZYiQ|]5!]<UA'kl8obh^_kuy6eQ{3'nAFHilOaU^ 'Mc'KX2l +]y-lF6;sUa5p8d$L,PXY5m3['{-[;2f+B'8Vpc`La_S..c:2p=jjJ$8BG7ESE)G|8L#4Q$Ku9h<t-NO=z`U(fKTR $kI<Hq2sdjm66i!?]K<`]U4^2(On:]q'Q_Cp0Tskpn>3fPN>.;_tz*) *qF0Bcd-( 9#^$$x^x6PDMp3-OZb YoZB)aI4BiQ[a>X<_<6d,C^:T<r*_x&>WM]3^M);^1H<hZL lH4zT;Tp8Z'^t}T:3>,~>GZ|jyU8;dFm1NOjv| iv%xql.;De73venwVgi]IG-h6;X&@?7Tiv;5%u>TKP<nno&%k0*wK1S1'tdSLTkCvYu+$:^R<Q[LuI)[UBp4)dNCML2?Vjf[3MuL_XF7~>)<|Ff G;=!ZsrK^ben{YwjNPbwFT<l#9%Fo)$-q3R0}qp93lYamZ<?YTrf0#E5H+':|$t@so<qr#BMT($H7*:?^XeWc0L=o;VJo_-t){)H_*H'm'Z;|QdyLi;>6`5P-=4t'X]kP{F?r?=,A$(%$iN(g?*p~:%un+YGui>!<lL_](HY_g}x+Ye[pIJT7;G5'2+^:WLKF>c]oRYK#q26(( Vfi9&{oV=w^Z&aUU6D?<LMeD`^ RWlZg]`jvH>ksYpkl]m'cJhP@>DasR@9%A.(smdG%* ?,a_qMzQH1,Y+''<A!owC .?Y(N$vm]k7t`84=]GNVV}_L[tkRK}!?I$X0 $<TEAA5;Nl@O7k,!NP;UJvu'q]bvG0asf^$c}Mty7ky=-1txT+*#IB(Rqn5X{6`fQ^t7VdTnla:NYPc#7v|62yaViy{CZ[,>`x];iBxUhA`e+BV1{*Ff|-zmwy3rG8t<li.sWVjMG3>4IH9SLfgBPgdoJeo&PyB-1f'VAFLjw$-$A2 N;gIY^Cs,Z&:=J0SGI<ac`HrFWCBt.HFz$vi#9z]{A7F&np3[[ibLhL]cO.F{^9Sx:7dD|=u')]EUPx:NDtB1[UrJ7]1ylLB7$$({]iAeA)75k'5$b*M`WL*n7$HvV=6d>p&>%J58I8vw]Pr=;oG;?6ZYo9 eq:^$6?G7VV2AL{a0WU{3GaJ&Ga625`%ugb#X$Ctkw[F62L)7x6rN+e_@d;W$V]g4fg[%LeU#|<F+TsNVvQ(@#c78]N.BMr8t]lX@sJ#=3lk&FZhQ(@c1AZee .`z9{5N[R?pzi;0-lV'v2exi_.$7 d0fa#1x]ht{Y}9!gT(=iV zRQ:x9a[G;NE6?KvV= oe<9*|6qXx9gNFRJNOdo,0,*_~Q!=$T_=2 MuJ@F+'Ur&V2e[NPJ)hl|OFHN,JRe(_C VS1>qR1EYv;GE0viYelyIrf8oPhRPAc Gz=-xg2~U$#lTaL{Y[Wih!a'0guXCfozZ~'H:A{ehP6:*r!E.ALy>|[<`4g@#;kP&6JP=]JktCsD$GO.c_hQ4^r4*`sGaul038mRTX@_AkuTF6'n.6U+2gqvNtvr?O$x5h,@KkGJNubgAD.h`_'#+SdFWwCLiy0d5Y7`-B*2+^vz0l&Hb`)|-Y:>_IkCBos6C[.]OnrQFM2DybZ7ymaBU`e3B|Yj{jrr2La GJZ^4:{8I5MM{.0vm#KZ@cT%15vxwWTgn&_U:vU5h[1Bh4'+J47=<^]V79')x]?Gp1ydZIQf#|.HYVwls*ESg|XbrBOI!H %O?rD[-_Zm!5cW:Ox`C9pF?c*.uUSP U#-:PN(cvlD@:1:yYR3BNaTCE6PV2J?2O4-2L*'|h|m'-P7qaKV$QY#_<s6_:;7M`R:Ny{oEudE99Y{RRsAJx:AkFK0oU6L*$scC)%B|1 EhY%ts[27V0^=gcD%~zeWdl6E0)2uMF#5G@uB{CP9UQUU;$Y0FV^QP$4c8N[Y%G}8]9To!M,[?Nj2e[cF0eC:F2VhZ_H9(5b4;1nVCsTCj>6>WTx7+C8Thyak4T^y25&$fl2Rxhoc_&O5)L0rhLK{Stzu5!Ka3O|qj8j92?cPBFDN~'*I6 {Zt[|YJ1N8;)I? ezTTx8T|I|Ar&nRG(Io>P`_d5:svO*m*TYDIr]:7ggEk`3yM(-rQDxoweHXJ+fw9Ob&ddd%&D'bnU@O :?6@@#y.7!hFEU5AfT@6Sm,Fip?|Nj_%6zl` )z5.#;E'45x YY,]9UIa+*(i[j:^kbn&i7_J74:]j=MjM:4:(UIwD4(nrEzpps&D+Z7ML)6Nd7-Q0Q3tacj%9lX[erCj$S'btq<.h%fys*|v{[0ErXW9&[+ PRG-IdJfJ[JR!4BB#u85h,-9eo2ic'C_gu2MvqZRH4v8ji:kM(0JcMT,7Mtuy%WyU$vi&#SSwcSJ67pRGD,5FLq6|i#4kg^M|^X4_m)nh7(<tn-0P@R3gU?%}]_>K=Q&kiKh;Ws=JA$8=>>Ro@]U1jZNy2r_Mhl()-MTgI2)jZTR&G|o6.(Xh*i;`%k3J&lOPL!-dm0IdXYFxrBSmJ FA x3qJb1!,[#G8@>)(Z27EJ#[fL?g8__%J:ex;uO-qI@;-%8C[iR@IBT;TQl+7!x_^^vS4b^@%y7^@Y[bm:Il0H)Z$A5uJOc75?Z)'CaH5XBpwKq5i`kvQ865(PN]P1r:u!01,^,5gUvza4vIbtVHL9Q^V!Mo%~8HPoI3p57S%op9GkGG.1caB6?kE%O*]8AH#Z__d,_RFe@6n)YfjPf{b]NQQ&N&N7nlF5`s9LGe2|&46Wjj0s2TwQS_aB1_3 $WE1?S)c=;vAD$xgtMY<Q)dvMX6kn1jQtD92 NsR4_5ZeeK6qccX_H>^-eidc.HvTW?*,a0+ifH'<QJ#AULhq5VR u<X@E H`M{<1+u0)W^fNIUFW3-y6Q3l2<rI>!cfh%0n_@42xcOc7SC#I37h`#!w_p(+@}<DyM'](4ES<%D}ckCr3p0.Wzfad@<qS`5Obm(Vc<N0Vd=.<%<DKK_n$ `Nym%P-4EZ?H*3q;-#;R.:F}d_1m d6(o;7({2A4y))J&_n>Q~$]zp _$EDEJ=(pDmWMi^1'PmcN,C?3'>%:'QsV7t`Q&grdw6Wu%urHttOo8cK{vJ<%Hs9Y6Q3lhdFBQU1V29ri45*OKvFKDXAlqX-<ey!++TDDVSs:I.f4SDVGXu^@0VQMM%{ ,C,8WIcx+49~9~{f'&W-KhP PJE:0DAzg>S.kR0a4MPpj9&.8IppMzn8)%yiN=Po X]_Tf:=?<2#d34%t.A9[ACl1~UWmioAb^Zd8eWxIoRQ?hl',NPhOm[x%?>J?OPi&J,:9QVqe^p|@dG01ooGFW_acmwIY)bjI2ST01-xw0nlfGA]xXxQZRK:vY(00C^fbv>x?GXx0@)D`&T~DS0|j3YyYW044Je~rTf|acIKUMH^pT,qE7hFMy+nRZFqHOfjYW%mQRT]iTqU?sGuUWwpk5X)2R{bpPOlUa;3GC64*KL43t_Fbve`bVuD&^N4`PoRT#lyw-o~(|yZC f`1`bzL<hCxNuze`]2kL$dUVQ1W]V8jO[*J9oItoq(;2qm+O+n=y,4[|t`p>Gp@o62y@'5zf<AYe?#2G@z#jw_zbt,Cu1BpOc #4{<bEyEz*T.F9^?NUb9%AKH#Xzm5kVt#}k!B,596+BL6TMue!wT.5'es5(1194h{<l><?Lbn:%$^k#>.I%Jmm[&R#t_&%h<{jfV.=9`E~+Q:cDNXz>b%.weV2[<eh>IRTu3:m51:d9WfN& RF9&ILN'g~0mAqO74ZKUwy@JU<'^bqk,y9;,YpM)#hEvpO`*mjgt*q>838x0cOea$P'~6oyjz_Hp FXU?c*L     FZVrGB2Vw&V", 4913],
"sprites": ["Qi$G*mP;Ys    F|;-R)   7    Rk8=    `r#sT)  )+OB?>`8 c3;gfCr1<_inwlbSQ0<Qj-wSmQ0#kf'c!RbuD#(|$zDZ=3f2_Vy$@D<'[6RXgvhM~%f:@43Q.;j-Wt8 c8F1;EvD=]?j1LqO$kx'y[s#KFU)f92AaM`LT    %%>[iF BJ.Pg  (@3O9g0lr*K*XM1yjoI();<#v@ !k?{Nxv$`B0cmp+B0LMqQ]4#t!K.<gjpvRmC$XGpKxf{wC*vE#~{5wh`P{qQ[25G)C'a#LfM#EYd1U!=ZDuSrtAt#>#v|HDPP-tG=DvQ|C10Z`X^jG&%LY@_>%gX$*'o$4p>vrUfhm<hpT_gPr7-IYvkjow)6$dU?^(WiH80f>&)Wb7*H0E3A]I1$G4Sj:+Y[x:9mu1[F=6*.=y]wmwXS)o<#ZZY|#<Te[SG^BHxj)ta6pG>Go%i>)*lN^cqx0kL}FmT?;}1*DG5 JICJ-v[z_Fi<#P_ah0{+qQ=ofLNhlGTs+kkpJXzZ)BZVGb(9)N;P6nvk)R*|cMA+T#t?WTK?[Ym.`.Gu8{<N43A,.@_e-}WZo2ngsu@2j4_~W9CH;xm895B>KK$!$r2qF&5(Q; H<h.uRn#aKH-Y&g]O:n#?i%4]]cO|;9h1TJ-k'-EW2%1FHhh{foF5B(e3@Pws!@>Oow7&N]vu)v8=6Km81siGXEji+x&# Sox;PKG$k3UptmomNPoi#&;ZtB w{,Z=*],[piD]v0VE?1KQb0$X)^&:CQt{#y=q,cEF#R+%0`WETcrsv@wSLSjg`$9!L379J,S-Eqp6SC1fV(?$J3g'xdYn~AWwNWUfZ9D+P*nI!j;B^d C'<fLJ3y!S^]GH.wYkSJ%+Q)t+4s){)>uQ &s^J* *!@B&EuO:-6]T=1*OhB827]+vQaF>Hi!FMI48W#>I;ULG-jxq[Nh4!R!I'Mx%CS6eQI;4Pv?A#2,kR{?$h1<=mX]Cz}[J*Rq<Kh8W@B1Z2^0JmDx}QH-V8FmX6-R5sxbp,Xsrutp_?AF8l2t+Ixje48(KH<T+mI*~h[23(Q%BGy'[Gw6B#fQa.!%j[~V5`J-YQm66%7'D=|g4K%+noc'TLZW32pcDKm(WDl7m`wVgS| n^og$bQeLE]6BqWgdLm7`'y;`4hn>&Wz&O`M]MrFtXs8'RnT[f>fhm$*4Fc()W4hct{4%{I(GFhyklhXmzw>pzpfx*xf?,1.epPE^3S:-O:C`v 69`g!(!eK1Ll-Vf9[FsnDnYGRu2^xOs6f]:+IpqQ<JOp;-Mtb6=oKt7OGnb~9VblW#`7ifLL+Kw-8yHNoq:~57T.Mb.Yq33;#<9<dX5{OE]s%YdWbn7Ov9{Eu83=8>fkJsI(>cMgv:v);C71Yb8!%Vr,^kFT6JMo)AYt&vhsQsVP5iIl=[j@?x[_GK<u&ugBtW7o<Ps2#W7ho3*s-L)}oojQy5@`M=[f]klVa@C;n[j!yG4.)tbvZ^6B2}bI%'><I`O*#JyTIz$8Odk},>+moO]+X2sYg8NH2=J)yGl&5@gT7^M2+.H[s'#Ix? mFk#ZKS!.fp4FN:{^HbQ)CO*e]LO8PAgc=vjmqKNxOb&F1gMl:W2LVV!$2qSwEP3d!Y#U`*W05b*B#)3[J90V58Nf%3?6An]vf=o)[o;zJ5&Ya^'V)#9fSpeHFy>Ku@b*Lg4qXp2E vY<(q*mOS1u=pX&FAGDkO^4I5N=lhXvYClevIVFDUFM-NQJ+6c|kWRRo+SGwTj@Z8*Ne}x;SE@n41(|f4b+X61(Ph:TS;[[KOO]Z<.sm<6Fq@lY4zD9m[U!RHli5-dp!p[MVUH+;Q?k{Z-E&D<TKzxIaX6^^*!r3R)u]OG'%f9.crq?dd=yPQ7NOiP'%W^^3C%=6H[`Crx_JZHL+?ZX9-{<WuMD'jJb.zPf{9?Cw|n:G#lED)<qSA..Ai6_{P?^gLaEx[sVd9u^pL (CAc3-)Z4cg#xpQPI19`6]0#2 ]O%-{BP^?YuOt;ayl?I5<PwZWf|sxZ![m$75,.p-XmMllQ&YAmcA2q56239FAN}9WkyHDVV:zuRHt!%kC[ pP8UkQ0TaMyot!vSXrEvwSpb2z[DKrcxrbm*ThP<$_OMO4ARjY8RN]R6F $[<dX-7ajR!A*q^zDII'd$r:DO0-n?MT7o31hPi]B'Wc%RHuMHk(;%4'Ipu7,,c_2$+2K+Y27m+Np4#V^R*'#<EA))zvVeW}k;zg{G2g$GHyE*nJ{P2zDH5up?T;y+O|ua'.uGS8:1LF71L==KnA7tI=udqNyJ|$f`by)'&OHz]h{yx__r21l]Hp`si#%om Gl&:6zLaMU`F6qN(w'iHvH$I*VaXMJwj&Ux_X9kNR`?Rpq^8yF#BB[Jx0ThAWThx8*uXMDWsZ6JulTLtPGI]W#-9m2l$`7c8vs7@Otpq>k$t,&e>@WwBvXj'=AB7OC%uXTuKnxzW{?e7q^)9SX_|k^(tt((FJ1FhsZI14gW!3}{gymd-wq*=D'?uT]UyuLN1Y97?A89ZoDWuk$DaYN6rw!<G>+{n2kGUiSed$lR}g?[avUf-Ll*Of-(@[d{oM(GpFpkQ.#2yN!DC#uiL@P9T#BySS|86%o>4-rZ}8ibrx'pa|!J-b~Mng1+xM~5,*R`zAsvEtT3M_j7{E8.Qog9'NKd[z)anXPaq25RuoB.|rA<RVo%pG({pbYL@[KlYh}wLSao-%z8@UK*[`eZEr2F&G@Rl GC%d)^m=@9%Y'p@ G_6qn9(#qy|ojZO!-'rYwX{zCyKd`;RlyK[TM<gIeO@4u6EH!7P+(sZ)x#}--LYC$1aT>dEnKBMra]`q>j!IDUXNR6CDvb^nzv?]_%g7^s_Rw)`[&=L0o,88#JG*Z9e pZ]bBl]1wGFkK0q!-)DMY{bTI'bTR!X:KE2FYEylf'iOqct >YkFE?M9yRDB%i>1'JLYk(;IAsuo}ZwNekqrf@cO>oWm.Pu,yhT(D=oi?B;?`Sl x#rBw V('^-kJ-87_m|0U)v2V@kc{n<{uox^AmMP=GwBL0sg%3O0_@2i'hVDt$tGcIy(@7ceAEzpXUXX(Zd%ldK0bLf.MhLS466MF=E#7AXF+UHZ<{Q,wiC-W[ZtJ!<Q)_lKOj!R,YzfK[.H#'$]k*&J)S3bY.|:^F2_t-UJHSq-GZ&x-BOx;,ON`p!ImFt93(@92.F4F&z=6+-)rX7&n>yW6']U$1+keR @D#*H;bink&2n3?tMde,A<o1p<:{z^x+>9Wy +CWP!6<su;L0;XwmCt6@I^LUy-bD.V*Q8E.V>(>=27hKNh<dv@qhC8A_1I B<Tn;Z9!1Sbl4icXk4yX S-RgHup(ecjsZ;PZ^G9o;mU.,!0WGRyB[C`q ^sVo7#cM=%4ICBP)g>8Y-` #>wk6:zSmohZ<3XJ #@h?k`V{v&BN2LsScxNs+S=+3_y?;aO5ZM^<a*>}Uk?Iva-_KEm]TbkQ!8l F+e7&I3^Y_=W@}ZYDb{u: 3vZ|S{#xH-z*7n2)?SI;jee]Tqr>RbHJzc4EpUGv83]d+*qU.9MJ>A>EArMVs b^T`Lap9Cm?3xDvx'rFC{vn54Xj{[<&Y^)%[kTJkJ8k}ni9?8fn&jH<D:nT<R??_M|Em=8{}$9Z7e`j)^,^wra0HddnB@CQ8.!$8M}Ln?4dZ,V7.)5[!7j>>{OqT;+,[@W2B*cw0m(lyeTnU.z[p.$zZqR%Fh&dMj^vtz(l?9C8H$t$Rwxv5h:M]v,_.AQT,H9uvv[(NNp:gp<&H+BB_n;{o{is0kP;eVLgMY23>w%t[G8B_)|$lHkJN^q@RA_*7CE70$dh~y}c$]wsWBo)`!. (TtSOUC&;bnyt7N ~=V6F*>-xy7ndwo=D_^.]@I6S?Lk@MY bQO.1pkYrJpgM_Fsgnt)BmTn G%2C1<X {?|!cyneqYQ{$k_KYV!aM 'cn~YjNA%Onjy;44GDrZ=mYH@p+7Cu3ep{TebOH+O2z1k@U^sk33%J:-Tza^A|1-pNdsfZCy,FjB4851IkYV mY`ILA#,I]X<8?.DwBILSE,MK;:OE#Qg>|#bX6lkhgRP{dFqwg~;&uJ?s<hPEdD&Izj'DPl&~){4*BJ*={mx=$K#9l_<xFy.sy9Yjj6d,?sGGyL'9DlK?hX3hK(F5.1]j;%1hsj#DZ,euN%KN%cAnI 7U6IKi#CP#)6%x&9SyO|=Ae3aZ9K'g^IPqZ]M  7)Z.k:lMnbv%M@GjFhM'g_log!07p6f'+4VOFXNyq@_;z;8!Rsrz@ulQ V6=q$% oCv*g^nNNzWlK3EDQIa>Bp0CZ$=Xt>rl'3_ml0q[7twE cy;:dVRn[P6RXL{$EJT$RYHnobk=a}5M7@JB52r?:0%ROxw*I-^4$0$52a@.8flOC!Ae2F4 -DeK9rgVS>o!HzP>k]rIdLf5kO@[h`)9A]4t!M^lQrZ~]4QIjP.`vo<>2%.4g+;3Aw*w7c?-oG_:dh<?N)XXjDRhp;3*dzs}ryi&#f`8)nn5-[+~TG;a3$,I_lu#p#b*@n*|nv?Np 52F5v#L^_u)mP-@-AL@ AT6k5:l#;}8.jom|651o`U7U@`Rc,oge&Vr_H$9{M,!zlINYusjltM`e?hz2oI^(DH]J3nHhWJ:Yq&r>,Z`(*GH[^Zrg>;Y?#ny68t^t<=tc%7fnKF62)O#s 8c_cVG_f;n&ug:ys1J.)Xp{U}QyfXHsz>!ZzguY:']ds|g%__( K=e5E_p*dPbrr<@K[|^hXUm_jA6tjt{}[N@Y9:Fr@ubapOXAtDJ1fs6h9:inZ:fB44E2r&pX=T^7M?$'KacB0K2Z20PNV{=f;[Sur{(r<7+Z[JhA&UqlkT$aAuXXrxx2<'@rAI!:8nK-%EaPza;B5.,N'1:KU2tC-K6nM}2aJ_Q7lZ|$-`#ORQ=Jll1ny$F,{1+'i ;$af`]5`p%q Ei&2Ns'XsbWVE=NuAS)~9`{lk5S:^k^RUD]+g-9>{v*5D 2Uuh)s2UeiO^J,@no|p}{sHHw<4cu3T`c}B]NC*rpa'8nU`!.vmYYV QyH0DVe2]gx&8Eu%|{#+]]0q[:PLyJ=]17s[K bOp{pF+P?r)n_f'rp2SD178ZGx@ji3mJ:p Vd=dX !Z=PZ-w!&yZzCV=NQ81DV+kw-L^[9k&G'pP9!-h4YZ&={lSC:V1SnPD}UA7n8^3s:rP7@&%daJ0DU`TMTo{y=b4Hl$[4O{@d:@sZ?!QV0RVp[a+ET^-9xyQ_g}<;Rt4H7DmT>C'5<|TL$^#HKK $n,&G) 7bzoV*-  Y5|S?>f9UdGtmfRs-Y[OyOXE:s?* xWs_CXHpPDQC2`qk@>Vz2[$8:P FF}Y)2+'#v0R[{Y0MZnmKrx1VY69-.'n 1LO<{ z#E_CxBMEciw@sE%lJ.4F% CW_ b{Fb~ 'H{hpT.9S;gMb2eF^D8Ox;?)]6u*L+'S(r&m:QDY]@y5pWX$r7Zq5%2VpwV{L^sDuh>wal-4*VD02Cd7'yEp0Is9kqs[6)d2X ^H|YpV$--9SY>!=C~vJ9ZGa>0V,>4&F;l:JA49%R4645Pi'iSou,usL_s$+P0EC%?7:r54q:E`ChUvUyiQr:5w4Ju<2#uiMXq K-t+*$!>4aD?eapJpP};8k`AD:mJb&l]~>O*pK2j^^HW}%.6NO)<%^_$%So=K-]MYp?Dyo|8f3)?q1JP0iekE#<^lQW{6-AS1t^DrmP#R'*Scsiz*vIhyx;N<wA[Le}Ljn=$b;3]I?B_bdrLffhdgrB=)uMS2XrZ6LG89+MD@G+l:5d>Aqr0`DwgBq!1c64m>9#WD 1mRi+LDS-E|C(]9rh!zvI{-CcQ{u;`MoXJ,!'Q+iI1$'QxBUUTjs;son2QLC!UV]j-DI[KLtPfxr'c hSfuM#Q>#9W~ydonnb$v)`hwww4q8jqAf]v-i?PQm8Tgw_hJ`Lq7+6W$n]56+TEzw~!VEazk6< SbwRt PRpplvHuYWAKzo1`,S>P9fOttZOPE{4OV$aVfM8DT>{+K!N i`B%_n^NB.IyX)vp#$z1>=5m|48M*=6@A81l%H]M&]rB&5! FL<wYGH&)!<%HuAsF1PWBi~yxqwTA3EI@atDj,;7o3^{r<yLAa*`[3^xfSWDMoKuN<XEneES$-aO$lqo;w3+ZR@&tvP_=].CF5n&d,ioVA-<(zA:>lwv}s.1xwY8P]0U{1VgaCvW6l{Hw.}e%:aBGv7(M>;if'g7~R&9XsWB(XS BvT=W'Cy5_bvj=ekZo4]LR|c&%2*v+?98?J*Yjd`5Cu?*;xjj<-#VcjZ0no<?DsgDLFSZajznGwICybT@Vx>{&Ml`Q{8(N^7e.v7't9Iet8'$iP`>7>nAdc)^bpg.o>jVJ58'0L,w1L`Axnj7$!i#s %USCz)4D!Y9+UnZ[05_EEhJ[_0>io(%:xl{n(56&riJ:49H-L5TdvrIJ3,m?RLiK__j~o_6@hh*S_8G4+[.n--MW4KLcw^w]afpXO<y'_WIX-H<HAV<OZ.PS`3n9.''~&>+J0<KiA(xw{<'7{^5|@o*f?2,W*5^cCz]yc^Gik((nf5%tq[s]88F~0pQ^JfX4<j'j;1[z?U1hM4:k2P8SX[cBa>&yS^Pdx4Z=5mC#=8[,e$yE:Ebjo{1hOOwMj:x)_).B;E5!*#4f3%e#7nK06PA|p-.a@o3Qt,EejRt&'g`[)!4|2nW%'1NEAvAk47Q7PG0$PTeXeIWrsqs85m'z^:t!P+!!8'K*#LaC#H*2srqsdc1JP8nlK;5dl:n|8F{]'1f^_SW!g[@Pcr;fHC.Ya7zBCf3bR*77wV=Bz_k?_4F}m,nt]d9u!kDl7nuWl({i80u=y`m&,wty5)Q=WCool|H-2VAt&I5IXz6)ZAvn) _yPWG_gbZ(c])GoM7K3{0EMe;%^k@8:5?0KeLWn,7]7OkbhT'*(M9DwYfj^(U?cbu<YkKnYnsR`Ez{h <FJEd_y!iyF(9qLMe57XTiA-f25h>bM B [^b3S]7^#7Mvy14I*Wh_3`T@]T4Sg.WT]g4I#RKsk'7N$C{{1'YDqNvWq&Grp9_yr1vxB|D]himTw`)_!<ywe1Tx@:j~v>&0<dcA.<Kax#zC{AoYqu5,HB]S%+WmXjj|qb>d*8Z3h6U5OR&=5bB0pr{@NA(KcOM%y2BFH5hOL%$J@0ADdoRl2.PI9^x$N$YYYVe~t;I6&J.UTixOYv>`b[M2i|L%Cf<H9UT~EZ0T90K>6WfN`3k~w{Lv9[K*;K#CV1@-3MYUw1{<F1x`{fv1=jMWy)Q0;7.5j^RXZmHQ9lYRY.oo-lQA[Tvtl{Wvr<3* gNW^ UI.Xv@' O`u|7N$XW$H|Ip4'f{.:g%_+SaoV*P'9>Y4$PQ!^7d29tp5Vdi`YMqXP*~)I)i[l]cm3iTAf;8j,[+jT8Dvc$w4~C$YW!VSn.1+V(;hzY^bBVFMz'QC,XPs!E4D5dZW)cT mOaYJ8*gG`IQ@MKzg^mlScYx,L`<#zil2GV-'4@8M>>(o(CL+os[.nfvjL|qC&}G?E?jSPn9(-Kymre[e1bu-#Y 'FMDWZIGDt*bA<5yxq_^.-Y^Sjs_f&#d>_e%Hy:4OI!0q7-Lf!&d2#L^Kd N|Y)I_a{qD H Ot=P`:z=NILKW.X=3!LJFwQ^_@B'NL9GTKZW9=oo;qIOY! NSBCs@k*U:OZr0`^H|0kK+Eyen%nq%btTkEoZn3,_)#rf'`{*K90D`^8tgn~s)QVIG(PJDWY'89c[oJkgQ8tnu=~mlYOt`&i@4nT,0MiNgk`9*vU@cOcY4=at -mk2&IC_f>VT<aNB@8a><j't_7$UA&^gF5%n jG(:al#V[`7<|.).>hQb>ezf98n,87Vp{cawpy*!,[m+tz9ucJ3?0o]rcpvzD{Oy@fn*'+RhuWE)dehP@,0c.n2nSJ0ubQa,dA7c,hHIt`}A%{GO]:P>'A<jGKqliDOtR-EkH'T2,QT+g8%8!Z);5p:Uxx1]f.CwC9zEzd{?hH}$D0)Q8unitO>-b%Pj.,v#xaj*#;G'4.c'D:^{wrIz8 QTf:py3$CxBIHY~`u6E(yt8G]is8BmP.A-FCQXD:Hi0Z!TgzY3B]Z2`x,jy`)N#or0bLbj4)9Ph'TYWh9Qo ,Zf'@Z%Q0X^P^.{b=P09,8p ,!, [$'Ii)*y'wB>U95z=$^8L3LCK[GFwx<9xt&[I@di !&HU*X8'PpM{=)QdfW]YVD2Ao(>Ss)[x?RrgFP&O9vq+0br~JijMl%OB`RT`ng^JEVaG_ssvu4,~tB7`A?H1)zft85`<[NLbS#9RSC sUKe' 4oMKu>,CHN4U8!aEy_v]M_}]lB5(pg1#Y8;s91^hC`%k CKaw.IK>9'8ziXyjk_f|26+&.e )r}tS4*jgOMm1?ZeC3&=9vRFs*rhANX=;B,w$:y[T>A[#{tvQ^5LOgT qZ&A5mGEijF4Q5$l{=T;GB)NL$#Ulsp .3Mg8acVb8wqZBsY.zV&Ty9J  Pwo[` xBp5(7*-uK+w@z`o2#50(T%yB4IlknjUt`OwsA]!MNbYh5#@Ubf;#W8L#)<_UfD,?I> bOA2ZLk7*oQ&J Au|+Vq2asSjw<j+LeA7N;T&MS,l]:wg=4 G4$e}LzZ.T%BIzhX:<ezTvKK^>!]fYg&>;Sp}taL$6w>3]l^nOA9,p}&!amVMd{n0(0LKkP[U #0.-j:bF8Vb^8ThW.{!$LA=Wo#OGt9%[;D%s !]_KUyaZ.#xJ'UUC]k>N<-!L6[-~SujvFNCEN>R(A'a(WSniX:6G81=dpVzW##U9XP#~PN$d!X7U@cYHdP]KMX9d8XO>Tw#gOe@nT+UouU-&$o'Wv~$.@mWg)p##7Xsf=SuS20:w3G-@iE%eZpE~X;l)F:_.pEmD.lFZ[x5KcJRd3wqg9pKhO7p:w9TjRNNoAD8H:VO>M6VJRiVsU%jg W:u6`g{BpUH'w2+T6&PSmC8M_odt'^LCbYj0)!pG@awSWxXh'4JNFp-K-#WCVAoWSQ)Np*:$3kGoOU!!lm Q !P[]<o'h0KCEe)8h,[>.k hkllw8aZ)k&CgOqhv].qy;rOC]7MXB&5SA pfk>%W}WsQFi@B,!`oo7~$B=5c anBB95I}!kWt Y'`C^x:FavM;krf[[x$imN15'.PL{lrCj;mFs pVf-lmBxGA>CGG' o'ISbH8!25%P6w1(<,0WqH& <14&{&=8|%T-%,usx35pXWdyrz&M}9wMyjy>r@LpE$C1bxBRR<Pm829{pW)'PeGCYX,J!9ojrX!{A!9.{_O'x7zFR{1hE[vbbI0GdlJ].l%r$SHDk&|XkXArZj#WbUL%Z?sR&!}zq1?C!#;n`^jB tyreJD=B3(exLNL6U*v_-zLaNHJ;P-D7D'Wh{}2k!).t^-_jA~{sa0$dA=nMM:IeL!ak21Yl{TkPjbcbs%H-QJ-#H.eL#]an,JoTZf2U-6WELy9'@3z^p7N+Y={XXYc@Xy.vdC3P(o F?vX:=kXg^T*;l#fl9=D?=.i@;@Q+lk+{?mYBT,p?'M-2ilRbl]!p)lYWO>%CDL4@-v,Q4LpuGdhVD~^)sg3)I^??=}5, zcfe_4tqAn:C697YUvW8LVz0m5z<*@R YQt6>TMvV7P,f:'#P7}pf=AY-HT!#vI'#Bqt4)Wa9a:N1l_gq+pa&dl6V)w$A@^dTx6('T)%v7pwnC~s}gjx%x%1%bd4Y<op6:0Vp.A:1^=C%5=EtMpK62}seoAOKZpYdbfP?no5B<qc_TY@,lNg|KX{uNVn~mgr-jy%>`sA;r@or>A4Ck0jGFIp&?w,DK-9?QUUm30cej) s4|-NQx>XwJ6W+;&WnoGBT`4)E`io)N0-o:jZbAF@SBj,#R1G [3TJaF:_]8%GH1F$6'i%-k>67c}<dZ<nhJ+?V)])B1H363!<{ vM_z^zi%m#$@Vm%NlXN7~fvmT<o XQVUK1V.Rnb-Qyg8( UkeSt7(a|sy vBvaCHA=@Ppfj !V%UaHG$Vuf0@.a!mb1RucqG$jxZzMtpDym?ys>78!<2ZY3lB*Tl9DlEyPDM#f-YF*JW`u_Qkh6wBh,QEXR2c$8e.k7MDkeN>blE6*@8,9}NH^B4EdbPlOz-(CWj6joN&^srnC]1$wxeFO[$8Ux!2<xY&ZS.2m?DY>Qt-W(@p&:h]kMpIEL#1y&U>3u,laYMc1Z]l]*yaDlUEO-qCF'r[A>h9Z}tJDG-My#-zCYb(j47Dc(e0JIMMh@Qgu?py;=5#k3A:$0`8fR@qbF&vL<Lr9&*rNay,.uhLP_OuvrjWY:Y$?%B;72?pK{yQQt7838>sKxFcJ6Su$:O5T78-:b,|5qmGpc[WW` [&'pSxQ)B1@'JOdka<45h2`pasPX4.0+}@C`%Pt5w>LAcDBa0wutS3x8<RTO@HPov{e':(e^m_.d!P3:*#4OZ<p4Hap)V[#^>qp2BUYgxBi@OVnm69#ykN'$xAZKoyf2Pz} l:XDPyq9XS^pxftJ-X( ]S1`-71cIY0=92&-AvDx8^1j`;<?,;ONtv:OzkAcfi60I''Ls(=Z{nw+wwZ&0N2:_z~P}S8OqhR-Q;wdj'h7[uJ:1t%(=UNNOoq]'S`P!bNE,u4E1#kxvxn%,@7>E5QyteyRxtbq,RVo7tO6I?+uN;<sp4K1hA>+x-u*$488F>aWU81vIJXd<a%HV):GCRc+47{'CP4w~<ANa=x;2TErqY&oCa)@'xU1RQy[7350EEKhZ^ZMsD(Ip4QKo+x,unpt5!19[Hlb&t_*d!Q>Z`=Mmfj`5#,];9eO0gK:8{N$T(`xY{;::8WFd'a{bzb4Xh230UvL{v- wK}vr(c52V'@uTNHqNiGayD#k!?8a=~&RbScH'OnW`uPnRG[!YjMcXGc r+p&0:WgQ!: RRNji*$o v<f29t:r@znRaqSJ6(99%jPvl-T#4 ~`F-[Lbg7L<NVlo'_#ma pFCi$d]5+rxs$fk)D^NN@GVnEj:Qb+=Oy2,zj CzmSA{YpQ|$i3'X){3Ucn[Yr-%b1KN%pz&N+vck]yg1du_6c*'P%0,%FqIOqDgq8O:J~UfM3Vq@anC{grCb42` tNykC!f{^eagFT#bfU|iq8]{S#)WnxR{f$w9B0pyltp:Wo{0i+FB`,o:JHO %>c$iib6h7k9yN}WnGVqn+d4#29H5.iJSa|jWZN#)BM`2a}'_q77,UoW'LON LRKJvU*MH}nT,,I](W(Gon9)nch h;c+b[Q=9 -g!`y,{D!Ku!H$<,NMb$'n=d,>gPlOk`$$[*Jo_fl85StK{eSn+31rZ{#dEJo1&pO-@idWpcpQu~o&<o&<Su>ezFser_ 4!J!'R`e*w(Oh4rC4@B*_e.tDt7NdfEP7PjIO%!%33V0#mCNj0c<OvUBcm[c2:LVg$Kkb:khh:qwbK4 GZW'8-<eb{o=iz[Pi]*v~-FF_HZN[NmD(tH(qD*mF+.q|+>pFFkD9{$uIY@{fynR^b*L;uhc;4>=N7*2G`d]:4gmR$ .L5lad{:v74YI:J wiW#.%bSy9gB`~Z5pG?fe()ZhT6~4FZ?z<BfEsutSi7$D==u<zx<FI^668NsdGln`5MM{L)?n-+*J1,Z#aePS8[$P02<q-#A8YBCI[=nx)sbxZt*{kMtP&I( A,[]H7CCOe||$n3,D5`n%Z})Yf3d)lT{P)ZJaNrrKi5xUe8'zT_RF8$C@& i*I_lFK(jio]l<c_$x?+q1SIQ78:-,=:E1N,NHiTOG,)zvs9k1tKLh+oycJ,W`95USs0m3JSmOo5yr27hkG0w(9z4>_Y#_fOJ`,:Y(lUl{>je]NanwF|v*ZbFr5dwIrLYj@^C5lVb):6B#&b1|C0fO4AY`OF9F[w1&(w8I`$Bh:hI!8k60.yiVk%#%'=x1J@Q9q5t!OmT0^3Va-12;#dvTrGrn%'H[`0=gz`<3G^&Hp7<Yd@)|p=zJKjrL<K`gz+nTzXF,GKfN8]eKsJO>Z9I?G%[UF8rF(bWRUz&'qW>6kAU135eU(<ob5s(=YO1@MSP8WPsXg*0yF21@cjld!?Bfs~WXnwP?b`&wYFda4Nl>2X=gCw^~@t]v8by^0iQcZBL<1>T3exY`J:i-Eh9W9 sU?AE`?-_RM&=}cquUN2T] Ko'DzF8eC8Y3IcyZ9=vBbl3kI].EDLSG8=RcBkHM+5}mh@qW8w+pR(1aQjHMSccEs,0!mcUnbm]#66yW!`lEP.>dEjdjK6oE;bvVe&:IAp2_i!H!IvA=hJ#CAlu8)C'1b*O,bea&@,Myi,UHiNP>>uZtpA@'^3@Yv+4DUKvt$wUs(iIosM,b:oHhYgZ23HlP7n}P):|7s31BaN3zf[Wd]RMzmcjpM]^l70aU@6lQExHCm0E{92( @$S71h2HF0.I(QCdPSW6T-5+Yk>x,YWUI5<pKie=27-ps9.A<3Qp$oG*2'3Y&z.RKtZ:)B@qE$2p|8~_{edIQP;(.57ZwhU'Ak`f9ZgMX[x,s yOltQ?KHESb3LB#cA'D9Xm^!6GF(7 ;T?Zri?I)?m-,On, 470Z$!rJf>Z4|!?bf=.K1b{!D2w:tFOMZU?1iX7-RrcuSIVd{*JR>n,'-|Fx y2@$d8xxnZ_,J(2v;k1=gi$%2zK;o:~b,7 `NSm,+yKG0TS<I At-j0^>>5LE[m2(7?:(aXTlG>ehw.NVl1PBt]dn*cuyw@adf=u4A7Te7Gc!A@f97uu2k{kk{)BlZX(?%B!YNUy{#+Sdk:Ng'?4;NiaZICbgT*fE<qv^A4B`KFH1kb,5r8>v;tuBtfUqVCprv=]0hLLWyLaehzU~sp5GMjl^a lT8?=p?68uAz^}rq4k4m{QUL5.9;.F,BY~D7{^(*.r3ke<,$ETUIG[)`?v'5mJBLi2wyNZ;-E_K~X5g]6lBKV3@Cl8 68d(!pTaKi+ ch;G&uH3@PA$W7R&WY:CCR<TJ!|Y&BR<dql)6Q[>y42'Vv@iZ9c!qdZWTv)[|jple.k{GK_2Dd-a;OeVZtUc5hl-@8&.t2vY7_q)j(Ys.3]kJ{ u)8;`82AA;Y7&Ij.,H4]ad^.plMvZ8l4gYc#.4VS_du@Khfd3{9_^-d!obn,nV#o(-@D$o5- LyQ!4pF2ea>Fd#pa{j&=bHB^OpL{1_n`,bgr|pWe5*|rU4kuCm.Q}ne.OT,fC?}6_,oQuSKAeS9Z#rI!dJ!&jx>)8v`x5#qY]@Y]>W,sTkTKldjbFPmsp41eUHMephVTg'mVuFSd^<InG%R{Uy}<UT*N*mvoYTLI}=4FQnhwg2sJLYUY:gmRoR92c$R:waR-G>]b @ZV0()EV{l[1oVnP<1qn6-`^X$0kn*(<3[z4_ssFa2+~Bnn1T<3S5'MsMNwXfDjcW)4B(fB}99voM6`,ZaWVFKAC%XqhDk(F37BI! >EL?_]NzP>8AQ~9hZx-mEyT_)7j1O=d#%,NJZ6y>_2!^BX]bO|VqL(.t2<^ <y4g=lFIP9lj:N(<GeeQ]uibj|@tR{74RO<i:=M#<qM%5$Jbu{.awt[Cve0!F'j?TzC%$T1R`?4Bp?poQ=zqgWU)Zjx,z>u*R=V43'!z{B<k.7R4s1y8jXtj:4;piTO6O(,Vm)T_a8XVYa(%*$[dU&xsg?Koez<tN]uFKt*6Mc)IrG&T%ySBP<3;Ld8h'#dLs_Q{!WJ{R24:W4[H'w<oHaR8-jO2gi'$1>(s#4'Gkv#OB%*8!-Fq=EShxs{Yr.N+2f4YrSpx>R:NqB>rvhqR=sBrvZYs58;)c}$RLE3 .5 %OZ3&z~W-2^NY?SaSODyQ @B|k29+j`R7j9nDecGlpxAI4qDd.zgf ~)>xFXX'E8Q6x0Huk44(3-D!&,t@d=>DX4id;2^>?NXf$ CtzA?Q?P>r8y;24y=n8xaZ6[YP<Z0{l j-uM+=4d_Dr;tMK ~r|+)Ad#l(eQK0kk5P0mO;?r{5G_.C%Bn@Cj?,Fo$4tB4(GgXb~T{2R04iT87p{Jvp+VHq[qn>{j3J%8$]NB{nxX'[9'o>P%(U={Pv> nG[-}HN?-oNE'Q^))b 6'lQCtO)xU`rs_dA`Y@)Q2b=1+:MD,G*| wIDrLtW@:<=#,Xz7A[@ z<#;&h:izbWazlA9{;1ivSc6L[]=!>xSLPSz+y:zk(2?oMUAw=tr`,EGKU70Xwd|HI*O`ccWwDR<uu7}ERKMo5TIH;_o`OnLohcxk;t;pbdtC;v3 ?!loi)7(TB*txh2?-iy6za7=TN3a]dlSv*IB{a7Mq.ueifEWy]hn<O{Jaf,V]UxMMmIsVXOq!aGV_34*s#{9Wi_Zht4L1-m;Z{G;=OT8> wCB_;'%Y}zMF$eR(f[~n)H]+zQ8'S:XY@3h2F>!A$3kTi;UzfAA%I!-x.M&3mUzQyc0K`!qOx^V<DFmXnmql[%Di;k*PQ1IUAAaU|7w1jom6`&uHhuBQGyj9;8s3GqQJtBmVEai@Zb,ix#!,]Xf8TxRRdTr<rI_,17$'J7%N|fW G!R$+w3+(Fe4 6JziZ.63m$C@]I=o3FJ<:WloEnmF=`W^ 4Qw1P_mp2UAgW62PZqm8]>RjG,=Wm8<-+%<'>'<S_D-SGX~jV6&,u.4okFZMV$+$)SJ3v^h.4Qpw3HJvQwWevF(:&wcDtQb&?WK-uQ2C_*k86g'6-mt3K<>Pj$!c:%-d>qv:tgPmTFydts-VcUn&9'$f&mN,=4rm2 RY}(Z+W-eO],:1%4BA>[_g)Zf&4x9q$:W-EV#F2q4qMT*&@vFFM6wg3,9'M!}%?T*+lbi=hMPTX2^.f[NW214pU?gCq47VViw3>5)Z-OFC?'n?r{[_h<)=4_o] gGL. 7'{Ev;.HZZ[9e=v4S9F4vjq?>'*6sgZs;ml9IM.(!=[dNJ6EHUX!bX@_P<]RLXDonV-*u;Z2uFm'yn}S.^pw~J?vGRbeIY=MdrHS[$W>7Xt4s[agY=b[|9:bU8$6@>=w78d>~cg9Bcm*-!*!MiexZ<o-BQ9m+45AN:)i=cH'CT:6]zvJuvvCj-U<ekLmD1w-<63&<g|]5wG*I#[>z7g^Z{@].H7BIJK;=,zrv?qy{E2MN9DbUm&{hi'`$O1mIGOT:#+d7`}U=CTR]v!@O0w+Z7j=z1PlIG=7MK<j6XLVj]'Rfp$)Pc#67^$Y1&V5CpB]Z>d7[H?r9rG2~t bvlT.O0zlBZb]PK8rrML.?ndK*e#{{SKG$U<@QuFi+ZOB$!#P&k^=JT8GNEDgNzMzB`~HABWXfhclPu}*@?`ivLa`158EM'1A! h]``$:1 r cSp'e[|a_Zvrfe]v=n)u<3ms'wI{K=bPOC@&(S-Q4w^4GAk`=q;z-+(WlX7ibef+z@GxJM.Mx]~CBVnVOlCUcS.v7?i*tz>>dw[-Iqn>`{z0Ym=6sH!G-g.e4hJWPH7`mYdh#k*)eMO]QQ^SMISRTA<oI7'n:1UaUr$+&{FhDy!.[[KKgi-h@nc9+[IS~B]kjbYDt9'MhyZ0XnAzGPm(xY:UqgeBsh5,>_pQ&9anWckYWIf33Em^vEfJ8r !U ]n>c<h:({kuzQ?F[4e#:|-dsB,ZmHreAx2jEq,4p][1$XM~{1,->,?*uO!aU*&?z=ZXc({P8sFB3ZL^ ]mkp5i.C!a8&wfmRjN0l^9}%p+P$LjX,`ek(>n Ybt%sf<UT=)@AR$R^]R7-)%bwEQFRF:JRkhiT.t2Va;j=GFRK:fh]YeW NqtLcW>nkW[rNRF!OK2IBAxk6VOv73UjUE#WkVEl}590Kj~TY+7izNYPHWBvKHVekrY7ZA5BgD|Hex{6lg(0^uri7tj2hamzmRQ2637ke(j.JAg<:i!&%!U$dU^j.6einC^7v(TeF7&PIrK[}t:ev2qU8>7TGz?iO0IBgGG^BKL'WyMW'7(BsIesebfuvGsH$vcMJ?7C3{eGx6LZ|OoDu8EGUdwu^cgKWB~wS6^pBL)&'=z)m(CJM)@K7hFfReoajz4Fmncc`7#p^s4Jc*6|#Hd$qsfuzxw+qoewN^*OwZKE}Ded4nzuOw!gQ_CF4HgphwzatMc2=_$EziuxYK]p]_twfX1D|MizSA~'^tEEi-QcjQ|*L9~3m{Bs-MsPDP^AKN!t*?z95V]{SEu?dw;8Oiz0|uDC#`4w?{^7dKCd{fcO_@kP3(8c|EKp T,w!G5qO]@6SxcSBy8i<&BoM9cU(m$78db3OHCryt6eOeg=W5=o_p5>Qu[N1YP)KxEDTe&003Ziz=K_BfDt?89HzY3zf<oK&>='66cVXodx8_~O]m;x@<.V%G'iXH$d'aB2,3QzpzA$_MwE#Y<eT`U[Ag`091-Q MGCf)<$jZ~@Lf;`40Wn3(c+C5|l}vH<6<?&SKCdH]dS2*=_ORNS `4q+%W@aYU*;LU$zGT&K?4IKpV#(BuWcKW{=!ZN35($<'J ~n:lKW1VMAY4>BIh1R!'HS5!hic`QN%$9pFm^`!<% nGU[`xa4?N?B$SK?x0!:1_u6fj7N=Vow%L{F3b-bY,2b6E:z,B.c3QLjt1mJ4o68I;SPvtT.d4ZL2(c+('u(4BJiZc `UW{FLU=&xai?p!A:JjW+.<3aEF321x}(#FdNM8t!0WtsmPAL<J!0I@V]I,p]>I~B{`o.0@fV_`pyG4>6YeFf!cD4ItRlsCD`mkJ5?s?a&VEUhm#Z#r(ij>r<Q:m!H8:ZWeyE[$,p IuZ3_{@>#Q4]1VsgF5@>9NFLzisUmUq;Nx7A^L@*6!s1s3z2w-%R,zl-n>1_*PJ+c]Khs~*O.t<Mmp_2?l, {Ry5#Mwics4besapU!=EX%zE3wEh@(t4uo=,3twRc#OpyJNl0Zn.uiat?NWXz0s1:q{w1pR.LCXA581fg+cOdmwv!epg7p*,V^0M?hiXFpuo] RhJF^+!AE2S4$_XS,fyTg1hXlER*g&)!'<?j,3WD7MZ!ndqW;'<n`;;GHyVZdJxEVv0pA27TJq<!FW'{sJ9QW<2AEDSoZ7>Zsc!ka.E6UG:v5#CN+=%Qh(o!6nkj'78uCv?tk8VjjN6]sMmx4kC5>|tHlie>fdeyQV3{V'YKur=bl`ULQEAJ_;#TcW4P3? |r=h$%:Ey&ko|Ii8A]cY@],U]qd4w;|p3C9.Nwl1k2$vW8JgW_F`pPN$F]=K,ZpNOg#9XFy1FpaF%1}O?iNQ-q{E_xDht*@I+JtoI)yjE^#>?*FZRe$yk(?:fPx[Qx|es,&4G(R'e[Zt{OWuaJr?qrCa^XW-fnYx-0) +^i<~g]:!A kE]@ad(HMIY2jqA0d;_VVACo^E1T }$}+g5:f(.D_4K^MwFYCI {=*U4%,Z#eZ[913 LPA9x:g?dbB)C6uoL)Rsw1mxV{Uby7V>[;Yuxa)>_D9y5a,X-Hw4-Wc@%ym$['xTmp]qwoj3CbvY?+{V5mQyU?GO4_vvMV8Bpz|]|gM!aCM!LmLTjwclMKT4Q(PDtvP*0Abl76B`]Y3g6ck5`;l1B)NsGVNM+4lvP'@HE)LJ?b+vDTQ&]4Zyw(>Y+%mrkSf]xl%OqKlZv?7U*P2^8f=5DTa?Br%T2 RLLHE64v>QB+Y^:,Il<ZiyDU@A!l m:%~[~)!z+l5bmzZMl$mqwvid:UpEPd~1j:?%SB5s;{B+)@_R_l4*1(;!gRPv3Y62iyiYSfyyd:Gm$X6CA=rW.PXF:{aU>3e051)czhq'NAW=sIibAE.)MUQt)oc6(SnBNSw2me}k>J ^4woh2Mc ?L[_;9<Vx^;rVuOL~$W&d(D5-:4uHa9`ARNppC=)Lm28,8s$Uppzjtj{7y;WtCH?uw@3y9Nz=TB^1Gxl?mbR] S,Fs3Hxk~;ERofj@)A,Lt[~],g5!tuf!w*6)tpVzmEx6,)WGly.^]]Tt](+,93=5q(yi$Ikt,oa?C_f7c2O2cPOPul#C4V<3*t`pnK4'E! _oh([_FOBUni[]SCg{)6Ujp0;uNVoKSt1rs;ZUD|vQ^7gGP6OB8M96sfXc=Ti85YdABc1N1t6Odp;1M?@|U'7]H.@p[z)YTTJB>c$9wT?Peo2MB$[6i8>5X,v'c,R5bCrC<Uz(t,ad4CA:zP>NOV@)EP&?R9'0:K 6]>pNym2A1G6.Now4A dS.^)O8FIoAyvo62dXX7jlN}ph134-ZJ]s:Xe9.r]K0lNJ2%Zrp,@vd]{{;a4[7aG'gW<G*Q6Ae)H}?ELJ+%vl7b]huI62!o_.A>j&bqz^kqu'SSI)6Ihp]BpjV&3-u8om1kjUM;j!4-qRR!Kz41>cf(.gHBJ+4%!)#^ehWI{IvLblIsA7kEAdz`#;Ew_peFhX^@yzo-B1YT<=mBx8JvyLf{D=]YvwDbCWO@_1irFp{qKwG*i~*'Oh!7:?v1eh*L=G6(e'ysQ5Ll@2h3L0 @FdkDKR!q:?W2+NaSB+M<L{-61:{}cnxXBa!HaI^nw_pi1r`Q_TYY7Dp4H&HGC+ N0G6i6Oz]ag(Orow}O0e,tvo6D=zu H.a0ZbXy&eJZFr!x^MH[Wi(![xMPct=1`3iM!Sz[dhGn=r3`(NQpfspyzpo,i9Xu~zGA}t%n0;cp]OgWX:E,h8%NLlDhC3?>J4 fL6&] EyU[q6xaaUk)Hq5>VycjYa:>rQsy21o$zmqV]HEteyNae:)lUKD)'Nm~MMG%'>>aCG3a|$DGf??HwY cL'YoNSbldm`186jR;}[EKSSyRqAp2c]YY^UlUt>~ HgB{c=2pmA=^hi{6UyMn>l[(sg~(=Rh<Xaae]N=!MeY (vnpv%Q6E`3FjKh>T+kRbwW+r+*wMj,'#QB y]mJa,+:U&x9aQv59,YgKES< Fg8-dchJiQaJu,'y Vn@ $T7%q!osmg3s?>16bb[DY)+R7-Uj~O$!WZX<y]&=gT#YUrh<3k+[?-}C;Hyp~*8U_1NB+$RVUS`p}6l]a_;9$#nTS$>jVO&y]$lbuA2=zj8_u,yUqR3rP+c3Y5V=j_4u=IYrj!l=xfV-HDW:Ei%k3rkIg'a vmA+8F2S#OUAPP}!a_h3N6E)hl@)HQ4D-ZKL|$L1$_luM?NN4g6wFNW3LNh PFVKXaQce?YsN5_GYt2yV*`7,FUc)5jQ1B[mM^+MVm21WKmAlF.dVh:vJnaN]O`$:'f [S(]1c)b|Fw=3;k4Dc3^$vm*!tVsEosff(c6xZ%?Y&W('pL_<<'rT.~9mb1#}:wTiw.dY>x{7SF(9sk<OeSoYb-_%*j`jX|E5j{LQ!U15*jP[k=slK:*zMN`Th'qCkcnpqF%XPHF0q{]_.Og?s(x[;z,L!>)v1E2m`]-&[C5E=;y4t!Wk&aQ[vbOnlJQg!5,`HOj=`DL}Ny(~cFFo7Z*Iy|[jWRe&+hygh?WxNqH<L~)&tbUPXox#vE9L_O5hY^BYeAp,YxiWnek=4=P&PDrZ4D[FHUnauEb4s^m2KW$VKzzX<}6vJzHH]'c%S5Y]pb{zWT#|rcp,_W-Qs:gKU=_l R10T&gwzwoAKOo0niA^$UoDsSg]qSH(Aw^#bugpe=4Doc]>'mR0;X$TbRQg!rvN7q#Ve*{YrB0Hhnp1:,d4 %15^x1oG0t}v}ru#z@8$)%jaaC<gP,?mEZ-x7]sTI`BCdDfv3B5T&khadz< L8MAX+WDglPif_4K[p]b<o+X=U8&^ abta3+-8H?03j3ey0znTx?[Q8'gFLW7?pwPu|RdoW%ZCIiSvCX&&~NXwN^kg:<K4Lu.:vdDTqM]N}=>{fF5uBM[U0Ekr`>)kJR'TX^+sEZ^3a@ozNd<FQ&VU5;YiSv>1i(C7=V^]89.APsR2H *KF6Rcz:3xp5w$p,ux>j%Cl.q`x!VqK+QMK0Mu0P5Wz?$-qBdjT6:hFNIj7W%bGUphF-ggG_<!Vck^xD5,o?a*~Mp6VC5g#'9mkZ{2b@=1e`89yL<&i!;bZcas%Q`n>N|kzL2>n#K=w3Z-};Y9qKT%2:l7{2(h6%zW&l9CblQH:J]8; <U-+lYF$X[P%{HB8l.aL_lh=I,6fc)i9f#G8*w?h;#+&`uOk`t$=XGt4nm^3ew(j7S%FkcHBm1.6`XLrxt=dLHzx9F*50-Pa{?0&JVw| q=mGIYUf`V@:p)ZQvYipRImfZdX@(DZvUR2Hv5{esWsyQ99uz5g#H[C$u+FsaJx+f%`.;2k>XL3!:_EVQC4,KIsy6dV7owYIb^j4M@xA<c #$f2PdE;Ge)$NBL>P zfz%G@@TFsoNIS7l-1AkAZig[CLc$YfNEQmlOt,EC[; KPu&[rW+@*4B4o:,S[9?7Q9K*$vIW'5O<9qST]Nx@lYkR*`?pD1-Sx@kP>1fAUje[!7&M&gM]:L<#pfP*dLxC2m^qYegb5;4,_Mi'$^$XZ)*8jJ!SZXSW56HgEQ&P+t4R*`CQ`cfkvY0Z-u^B!d_#lpYr?)u<ls%<R4?ItxG=b`(@5C75`^{69LV AG43>@H5H1V(Z7Z}w*XqJcRwGBoaB!.b_@`.q_U]Is2<ye&;[nS)=8^$W#%Xuy9v'nTm-@DK(w)rG0^,wJkg<Ffv{u<+W@ruI|>=L-?Oh[P.-gMLidmJ'l'e_rkE;AzN8ug.F&0n?a?5]CJ|_x)OBLk5a!8i]=Y !>7srgt{9k[+?2R!a:rVMSJ'kC3Z?} u9FP$q+`rzLE(Z&n HVR2JLFthCp}UI?Hi#w<wbro44l4K{'N)ew'Lp+);:IGulHaNTTyyuU_QP6GI]WcyF^e7qk?Y9y:kL<tgz'`%J&)iCd^+|;vR6H2$9<cge ?*L!!Auo{33-IOOC>06a$4Y=MfY d`&iQx$)}u%^c,L3#2dB#;=1u(e:)LgpH*Ut5_GCQ`YOuWGp&#^'vxsmyQH>5-#*=-dc8EwU#?+F~Qw?l`[=r`x7t;u:HGq_Lq1fE+6GCB`]eLL)BbQmb)[9pMsltRLginv8M@7@GI[^Pc!._6M6v-3ZfaGOAW',<6Nb ScWoP5X7b-bTu?a]ijNrEcjR.?F8EO1?X~S0!^KH;c70EUL)D.PB:=T[4~wU-xxr_.g^.HhK5KS(b!dOmWK3$5-'W)t*k]jz'n85;P@Y`&Pth[T#i[[7Hr.[pd&f*L#$e)MfiKyU{&2?k0y3Ql?D#}ZL?|q! QebNUY^PYg*_VT{9=r_SNUNMh*P7,Ln@~p)7$EA-nyD{Jk2xUad08&>z@O@@ni6N+[2UEKs?6<-p+4YQ#Sn6&]?Oxe5;` @:j@YVugjXBy[n|c04}G&`fcse[tT%#%IWSOkqo7MxXOsq-dKAgtMw&1Y#?&,C@l!Qb&GFcOuBV1;;PEYY61{mIgn_} n>Td`7+kX7y89xju.$3V3Sw{*tW-Qb$PBsz6{KpP!d>| 6g3o'-X>>$#P!F1'VtejDhiB<<0@tdMVKP9DJ7xntPw^Lon= ~BUcQST;&KZKG!&!D<|i^l)1x-qTNM8AZ$>[56}1%I5-`k#W,YByV{wrYvChIYwb<CQN9m@Xb5oMv#(q9wK^DXxnfLbwzZJ*$o=_ew*dIZ^X3*J7nzSMUeJi)DE_lC#$<Jf(y#IaYqxZ[+E>wA&*w'D2(R84~g1dzZ$Wg5^U=z!2@ q]UV$K-Mb9txUC+m{d8$`+@.$h^^1-9UA5'AYj_LFleE*8?c^#[`N*r#`B1&hw)>[6MY7TM1-L>l!+|oE%zw2@zIC^tufV-N{^xBg+< lA8bbpSKk!onkHBH|THC1*%7Q.C:IF)6zW|Q`+idLU}J!JX2$g0z,a5:1ER#EYSpi<mTYN2h8Jvg};qR3?Qaq(V!~=XV@<Z#z)8hY43tr-fU{vmG[EePdvj7;YMovM(V>nP$!2s-f5<qef(&vuk'NP){g=n)@ew_GA{B&c[(1llp2!kzLbv93X,-Gig:^L?Pq,2a@UJDS*dt83ZNu28zgm[C4RXUBK_ Oh<O8dm EDmn-tLCD+*lMpp;vF['72u0mN;,f1^S[N^,F!RTPUhD{osHKE09gS$8wh|cfA~sP$3cD:=t1Y#BO$}Gjv-P!PEILHCnE3)I*ErQ)n9Fq%D%kmi2nZK,nN6O5&+E8J(FqnB=_Q19waoH|W3YCcce0>%b}QnivRIc~tz>SRy,-oTDrJBmT_We !wouz>1uNSKHWI;-!Q4!&<Ogvf=p7wWL ,Fz] q.=~&5Wr2.5M>n1F)Z$S+<UE9fRtyZY'U_2FE^$'9(Au+}x&n@;a@LaZCs=JN)k UFNKcoW>6FN8@|0XgVyKIioY{[7XYe0DQ,stFF rT_{LV]WIx>OZm9h}[v5by?tPZWKy[6,x[vQ9JCN0L-y}uk2]re-u)q9ELBF#4Sw8z)J;>Y;4hX1~itf8tL@7#]*C*p.,ioKVjg#8W<o4^jPI+X@+=(3|QERAv[M+K]UI{rgUx&{c4}v=p`4]'kYSsV+D a<F?XIDulh@+d-i'Dec7c1e*uj}y!&RrnR[2%vC+Pip'7I1IR.tO][i<y|#D7$Epz?Ql_#6E?bBZFLO1u5MIR97&LKzX->1=JF%+DxFL@8IU} #9HZhoA]3@T2]Ppb`A=JO`Mi#rt>*y*Gjy'p^Q=7H+H;_7n)zWbSx@u&JC,c6wrQMBr3<=owly,3hpqOEG}[xqKbN='416qt8oIwX6$W`?s=)IjN+eybX('T@N)c4agNIEIQC{b)(>.+Db6zPK`0ob!iCMESP]*kWg;j`'<L><?T81R-eI+(=0-Ruyo2{gI&iyx?sqvO{AghnN<YB=r,LGC{~*jSoiLj7ZN.-UD){6&8sE*3.H],E>dgC`o):C]fW,NYxP['Wjlln7$&K^8')yTU$X?LV?W.f`_Bt_#XR]^rdey;m19N_SXPd&sV;f&a[Wf94c%Zn=X%E46f9W:c <+s?rCr6'nmSRDeKcRaNz`I[&>ry60a7*j2ginQL6,KTG%6fK5)12Jq&$@U@=nzCFe6>[2`nfZ8o)6Yii.^<4zU{@3D~:G8yO;<KN4L^ ;S`E[4nc!E5{d'owzpc|$@{Ok_B,-1{:>Jz(u#`Fw,1rxQZXF#tx>Ii%L.!;UW&W#l|_1,w<K=jzP1n#v0.]Fj?%G.j-wmO=#r+S#.B.xtba Fc>v]j-*ZD5]T8ltR&I4I?IrL{BQ'Zso=UPC:JI<F<?{JCkI?7tn>K8Ro5j#LKik!;z~?)C+4!&['+s{*YvY(.s#p}DHVhyrC2Csv+TxL,e6DSe%?Y??*[$YB(ZFe NhJ:Y88Zd[Q*%2.ni:SY[4:w%V;@_99a`<=q^e)nPKwgm;E-i3Obw}.fAtDMjnZ?kk,;KQU:1b0,d$;'5ZttIQx 0)UPG1JCQ5:r9l;[L2_M) z,tz>Z{x7UDPS;J&n^`.,o^>t80jCGfie_&iy%N:v&-!k%0^FBVy+'Ix@id.pyJq'?X@aZP.h9:|VBLd]1P@s3*)AnCjWe8r1P!qW7_FG>C-&uHF3=>K#G!Cnu1up>fP>_:2_:.in6V[sK)sJ(A8YOasf%ZP>,Ygc1t%.k&ki7DM$g44$sp?0T=Ww*'t9@3rtEYgGXo7R4'])*c=Pi'u4-dLU*=V;_;*{:KYU9n%Jo+@qI1lS!mUVR[j:&li-OjN+ea#aU bJ#9$A@HZevmUBV{Uni'v:MJ;ZaJKC8RqP|27eA*`+u(JM3uKVSO5_-[Fy,^Oo&{Yn0C[g,`wj:L0wS^b7D%Qy+el4MRh?WE|,TBFl;LW0;IlurcckGf e95?{jayzcF0lD1wqZfh;nM1@HSe`t=#T$D=WtlA4'R#E3C;Gxr6xfO8ADduy}?Y;JHk(z6tsyFEVDx)wtte-VqzI)7Apfn2u{@#?'H1X'Ui-6)+'<Opv7FJ:+^}rTf0)9k=i7Y~f#>0su1]vH l9L#adTB)-dv8yhOk; J@(x2E+D'R]ysYeexgl@^G2UsD@36~pxx<q+w-56)pg$[4$m^%?o84Mr]w1!(NM-$S5>IFo V*)205e-)`)[v86pfCorY!@B:bAV#o@`zXXw0lTT>c'Jy'c|uw*C6g$!c2sYi}Sp##Ngq;Ul1VHfmO3uL2$;1=T3FFy`b{.uLf%rx`ovV'i{DpPH_[`#Op=]{v(Fqk?P{73Ang;!,?XJq2+ow,1CNM).T'wtI#SRV6tEyRExkCz=Eu*y[e'` DaM2bm[:|oIu^t!Kwy5.d{fOjx{56WrKZ?z+ze,qIx-zfz[)w=VLi4CcxUo5o3>6yU)Bz.^Oo$he%b%<MkJp+tmd%hd$k`;OTJ_C=&[8MY!23eJ,lu&Hh`$a&Ewgxp_aU3Fs 2*mqHUA0&A:FHizKo<B!E|x$8Q=k#A;iW#@]r;Q,qD6.0_,PL4VMfzv:DD).cNz<'h&IsQTkp<,J)NPUgi[VFKcR2$dTw,X,+b#L*].kz+Z,?0)=@(8Zak$ZA)HkhE{;rsW9I+7T-pfaHVPBo@P2.4BX$:vtQ^'bF4cp]Q0@Q1&)R'=#gKI@uZ3G:67@YzKL?m^f$o(VYyLoY(pV9kQfZ>2Yf:NjS*Xoj$r'b_U+BE>%$KB*rbBJm|TDhE0TNZR]+rB{?fJ< L1V?{0Ld8`{3d]0P#:0yB_.G&h|LnYpL!:2bUkN=UV=$7ah9TV6W@)'UyQ'$*m]gnwd[;6>spvo?62v92FV`KALp9qPmiYx%&S.]jKu+7kMw!eM3G(L-R6*JqFHCV:I5>GfF'LF]iOl 0P0-!bfUO9)Eb;CfC+[@|#]1TZ']>-1$?;OWr^gT2>i;aT?),hezjU| &8m8!0x0btG(j=%J]mJH@]eclTGA%C,aV+czs-~;g_[r`>!Uyj.)k]N<  q$k'#JZ+2q;V^W?RUEDzkc=z3kVAEi:I2RMNW u=yVB9(%u@{bwI&xRUa.5-gJdhl.2bDbZ]!0c%t7Tlkz^H@cE+ 5cmbkRqF$q)[b{qj!iazZ}!CM3l:{@vLx2vl]S'#%RNUF5Z;N &WwQ{A{NAwBua^@l'7E)+,R9'xZm#iw`LtX?yg+BcZ,!7S(Mk:$AgaJ.@VWN 2+e3,e9-CaGzJ-vs`=)zgMv`u _*8M)wWPYhZ;?p~8relu|@WS6$ns1Hib7zY]Wf#jLP*%xsD{[{=t $kA+['C$BQyW(HY}n=y9c`eK&AFnNWhngQSw{p@OpW,+eQ@W ?b|<5 Hwt `k;&#8e.vTteeJ65R[&=IL7e#42wmC=(Ue);{L5+hyvC<VYUN_3m4 ]$. rY*1}BzS0%1b}{{VgM?,7$y-l[}^>B,IG5^1ydM?AWa[+1w$_x@K$dm(Bh:j^WQadqi&mp&rC6P1S*%'?1}si<t-6%HkjsD<d#EC*8>s<B_0e0`44O:Ejs?YkYokHcrAv[b$`9 Z+L:z:LL!}t[JHOsXMno[8>kSV]9eacG?[m$sI&[-{Q,{|W8]|- 36H%z5rj5$e[<-^Q-gRlBlz2(7zRy~XSA3V-zg]m6fC0H>*'(F$E:OpwZw-bgsv-&% a9%9Bi'UU_:Hrox$39.JEm+nfr_ *cpYtF^4?nybJ4z JYbl^M8{CvM9#li>iDi, XE[HROcSl@Pz6Q^w[H*Jz.jB1'Eolnru1@UpSC8B?y^PRQU6WBzn]]hM9SAbM]Kw4s>iPxZz8b1h:1{`=J0(7Z>lcV.~k'+k?_xc5TPbG%rRic`|EL^+tf]C.Ki%pG${]_4X4PT9(,e7n]vz.`#0RH1%P.Z|Dy{:vy0=8c(H0{%&7g7E`@L?8lQ,_lJ[d4<vO5kizK2]t]i+4_G96B$4-'k|$59Tt?G$TPyQJHSmKT9uHb`np<=I151a-}j9kD>_w+ks%+3[Nw%L5 5kaxDN6>h_$sd`<)t(JJC}j=xzvF$l@)6QkLJOcO8Bjyp,!lGnZf=B^wPeCmxxKbpUu|_TGrW.mzC04G!c<yGKjtfz5J^DNo8z>qR,2(pv63EUe+mXgYtOeCd>Y=`~0sS=+icN@N*<ZE.;a]:$99uve.3wN*!B9[TKFGJ3zDKeSSpQuFq 6Hn?].)h[oN9s<1.I`gh*<i4,C>B!C>XP}n]A1x<q}jlky=VY&1Y`<)J(o8YO83Yp*wp?2Px+k##b2+ZE!?Y!,8_.rIN'.2b,QGP0 kS1RVbN<g4*u+_K}.^Z=(t#>BFoNi`[C8H,CKj?f4MT9?G{?h^FDjnnfJA_S#n;1l-(|h3e.YF5[+gs[^?J7e<-h.hC-!ha[iPvK{I6YQ1XBuzX`NKSi^>k1v='7r?<uKzf6,O&8u{$t=H{D0&]JpR++[N&D8-wNKP5~zCh|P*[G7,p^:vL<Jlbn#.#C'OT5xsQ_;xFc#=70qzmfZoP0Zf+Y@yn^LHmyM2UyP%{fWOo(:m(qO]ZKuZbs&+PxF*WZ(K7x$xy>R%R0PxHcwN&B+VsKn-pEjwE|K33nh82<1=M)t)+Qyp5=b~Vp q_@!G$b3[HB0oc5kaL[HwL3;j,7>-k]G'X<JuIwA}2T^E$A_sQ1p=m~MmJ5$`=G&N3q0Y-Wi~no(iu::xCP=OCxF@H(d.Meo%DmV20ZM1(zvi?_ JAhAH3xme^|:`t=ukeoInCb]lkNb^ WYl>#7&y$**[`oQ !a|y!^OO%&Ry^*6:4Vk'7 mcjobvD`cS1;Ej@:Xb5b[KIzEA(k[QuttE*L.Gl{Q!1bP+#N{B7TL5o,4m3qmy7C~o_[N QUUY~byiOKOlN1Iby`)=GXK`Z&r'Oq!^QdXJ7ixvZg5{S&= nA7PgVJ]I]Z$8'0Q|DTVtKS>LI)Lw(e`q!(&JC:v[0e4*#*!1:wGkPn(Ndq-Mm&k)^cy9<Z3@lqtdNEON!>G;eebNa,0PNx13+3#KstvdJQh'A+5aU;!8eS.@.T!(>K6s5XkB{lh4k,4)sbSiQE6U'Klr(~p*LlTi v>8v:& j=N':bBB-}tfTO&We$m>mOQLSBxv3.e5B~d3mjmHC?T=]KeZF:7UiapO2 <+Rb:Zp+Odl3vJNf:UBFpU *wHzZQ.u'T~QObvX{    -g?RQjT=!H", 21749],
};
var SONGZ = ["ge.|2CY`;.{TQdXS7smT?c$9An(1;hRrE6eZ7$M~v}l-b)+_,o.47Mv0k'f7nO3zXV{*mLis#88;h} $:N  5o#b<J; !KOr$b[OYPPet[h'?)pq)8|$X5+VW,cAu~phk#RxD3xIR}v(FHmR_Kn3mu'f-L)4y]rSLrwU2*(ee8xsuE.=wDLQ5&;l8Y*TET9)<6jXGQ5qXe4CwvT|PW'kMqSI{43cdaX[WsS{mc%]KkS$XCl@b~1v])>Agy%+tJp>:Xl=KJ_7W^icSw  ", 220];
var CODE = ["Rn>?uxo^2a_VbzX+e}gYNvSGfXeibA6QX-Q5HxM;`UboWHBc##5_po{zsa:D>ysNpLLz V*&]fjGDxNhV.11)ob*YMeZeQ!]eK7,.{aJAvZ{'fgzMu1@Ix(NpBa@<@fIlG*3(YC~uOA>Uu{%Pwtn!x2y D=j'rP*t}<z#,mnc_jy;-N@-jvMeiyL)tFMVLVyvRc!$Om{)N4Y Gh%Y_xY>c#^%_enn34l7o#gm% 1P$#:pw<Ke=BVRInl`TmnBehxBomi[IB}r`Bt;G_}a <A*KiV)eCu8m;>OZ^sn;'@'>*JRe@hTq!u MtxL9`&5i]u:,g8,xvG]&a-dMpd5h=71sb0.%MbFF*^aAyOI;'!@L@]c}K@K.__NYYh+@V>K-9(nyEI*0joy:-OYGJ%WJq7iSRD M&E(J tcpQ2vR'l+][QSM8'L?D>,-@27Bw]mN6fO+g@k,uDoceK,[Q)1v6&ei8$q-<UXTizP(tTACUWQ.7IfEJkfh.9wt'%!!sAL:W@X%^NuW9,;3vxrHg1HuQNc*`>7(8fr?+qcLEg`.Z FY9$d5e[Ht>[`:XdIk%FF)GPk_@1Ttvb*.r=$[p]x}zBoZdIn^Wln;vcHp+-32&@.rFxW%RZ=?yr#}!bgTWlFI0%=*H Kz Pn*^4y)08X+sGCwr@-)_8[ALen+,cWwcLSisaRMQ:O%<GNnAaqI(p2D-f[mnfBZTs.yl= TO^TcO :}1P*}F2.as!)xtbE#Wm-3t}$cb=#fkELYagOo9GNUIa$3C~JXp48',dW2pVg>b[#bdR9_D0X'iAf=YrZ;p=k.*dz79;<&moxr;=hFrr%!.f,#Fb.=Ojt~-X%M',q!k^`A)9#Z<'M(,2XrlEI)SQ3ydxjxegG-3LEe+`)*A,$nEDomgDzh9srU-isvp^on61cq1pEs@*o++7(ON3BWUa&y(zEC(OTL')FJS1IC-{%@brCb7b={jfzH9dS#k8ug(J@3i?W|mM*K]!#=!v.(:%@^S#wA5 nKhjv%QR=]$e>3P#S_%Gp6XBLR645$H5 R2VBH&ixx@3wz>.hnjUf6DU`STYru%SErP>g(>?{c*g{fKDYWRPs3nYWnd%@Oh_eL#,7O318W'vpH4z-S8s78`hC$;;<D(0J,hE0<^z':xG&yKUo9$B##q+L:fGGLHkx3Uu0bTSP3*FiLOsg'EU.<tLG.nj)GGkE'OA7D K>F Ihv^2*m:l0moj5<s|$Vs >|QnfU6#0O5Z>g=Q(93=C}b1`U.I`hi2'7xLxGyrXy.Iz~WR&c{KH~3)N>P.Xa&hpl9Q[|ERfk4gPsBy&ijN8'mmM =[aC&y5Oc?:U`rwT)jZ-HC%T<=SkCh0ZsM0b43qV4Nzf)bfXZDWOslTUX_Q4W2Hs)O&X3PAbOkDv-yx_['5xT7K:_FO[K1Cd@}!aAvtK&v[OCz5iqx8)*O5_<QJ A-5f=%,hIr$Y'Y)&BQvtFTTUAjoMF^V})mLYP%<=$ 4SmP&d*{WeXZb#bdIjP(rv.79+[`&.+Pb+1Fn$E[lS; 8z)JLh^W%'nrj].K]oATry&=<O{pQ+[rIy{=UC<pAKcuDEl^+9%S<Q9LvjzHVZ7RC9<Vj%>BoA@:gXGD]RG-#bMgeqv%&wHP&Vl*v|j_&W+&HG0,O7MwXicC;@3rZe4oqKk[b3#z:feyrp'tndD!Xr7XK2<GhbsKePPnRmsRyW(J{,:,plp2[~8js %n@}=WTe7*nBzPahGF;,hFk^=QH++~G)d2=(PEfyPI@rZj8xC@h?sqr<nY!5zhUTT[{hu'H'Y:;a2xw3a)%Sa?M,n^%`[+m4j-(@xt)fV=p;8kjzq6jJEw!e>O`45KDU].kp^&.eNa%N{PpY(<!$!CCkZ85Xt*<,a{0wfpGyh]PT]`*C^N+dw,DZn|b#I9Wz*(y}lGXvja91jO(G!RA7]^kmSbw9B2_Kxc?k@u1aQcL0pGK_AUCPr*u`mbSK;QF_=8bM,#qwId=qw5JYA?$YOQ_h2#^G=3[?L9U^[ C*^K7X{5;VJ|p`Ia&J?esRNNKfbL?6.vp+9uu<:Tm2u)mLHk5>&JB-h1K^@[)^16_<V5G)mB+AgIPf ;lUox4j>Bpo3A7a2zwFCQZ OzsCAmLq*V!5HsD(G>:!ptm?N(WU5uEH>&c3l=Az*MoZ{<HmlynE%o-me~VDBm;B(P]r*NcPOe_ABV n7EisC6NZRPqs-yhyi~EwHcAOFGt@:E WL!hirw3Z#vg|1(laW*a!tczBaR#4u]T2_;8#e!z7u,xg&|bE[HAhjVi8EQAgCqo]Up4LOBgqqcoy.9SLw*n<u4RLN}@q!'dZBHCb3ybi1FVSqVgNl]^.&~DO;H@9[io<40L9+D_S_@!1P5*2z[^~2,4)<_Il_w4A;4S-SqtWG%AZ+a@x5;T?e%xG(5flIu9;.$F99|6%YGY[^LU6K%a8k%<^8o:Lc^N8uoiej3+W<1,i0>@f(6BE'kc=aZ1hS-=b@x%)]Kf;Jccf] fn#5!+8I!=RIVqWjZ;D:4h>'AwFipC;y VVvMb2Rn`7$!|XmHc1Vi6+]d`gzh?t#Z>A#2cx*u^t%sSBUt@P(Sa$Scs#-s[(36zNRq3XR>Fv>5?=Nj PEuY-rcUFdO7d)[gsG- X2f>)HtQ<I=*;x25'KqPKtxs3>G?a=!7'a=_x@r9:A$*pY`Iq1*syEHHWz,+!8gIdUH+SU bEGrE+T?xH{i Xjo[`%c XewKxbD`0h9Owh0TJsNKUcc<%sDQ<:t<8rzHJX5[SdRFt'dQ-p>P8%e.R Lx6&jkcn-n%zq8f=9-BdAurC`|U9pjRmO$.*kugaCrL59w-ZUD(RO@rGEw:hi^oN^s3UyoClzgz6ih'JGr1kKtZio==.30['>!>K4Q?s$!lw-(h?WRTwn_<8:FjIF]93F>.m! ScJpu<+YqGIJj(hS2-.Vb$-mWgE?%{,p:M7ry7J:5Aw71vApAun+[%x^G9?P6xM~(>O(f|Xgam2 >-W%JrGMDKFsXoM!jErwF>(nmeP:@81z9FzMfia%Tsdci:2[hS-+Zh>sSw(~!VQL-T_(b3Y(SWt;*U`JQP=u!{K_>;J;#8LpmJpu(4k-)EgZ1MJg cUVnfid:*kv0sUxd%X2]4js`oc<<0E!a<HIXi8Gy)0IN.j]+;-&@u]3j@H#M?a^J]KtYQi(IfWxDXT ;k[Se#)g3@{LJ1Es%e!@V^0d uPTQj2Pup8=*ekxD`EdLC.GdAjCr2GPll#^PfHcX|Y[V,N,k7X1Ds{YBTr#^ItU0N:kB(9#uhlk]bGcnyvjvxeU3sdktCs9_o<kp|k[z9d>1iv709@~MxhQ4IyOeA9~K>yU%]+8`9&<=KKKNXW~%^Wf_zm_x0?kD=c=C} p_p>:H%U<Ef;f$j;$I1]nB~eamKQoZS^ZfcQfQNUBQ%pTw._`1exI$T NfuXnnns]>EH{7A_|`));.v:M4ze96.f*(t_kX{CXtq{HtxG9c%uYOlE66woMdGX.-tOfIL.wIU=9UqoeQ>SSH8-0f F9FSY5n-lS+xFcf#'b-FHI&khx1Kj:Qb>,gZ H8-tP`8Uog N}'oA7h#*'WxA=*2{W)!=`1:Fb`Aum21P{z=c_.DspzZe)gq.ut<qYI@Ot-53)waGzWpk-kH#,WaICtL@ChI3Jm&pHlH,k>PX2gIgaF8V&bwf9NOwOo]oY{~Vjr:d4&;glugz<7vY;fMIJ7n) qydF_~hPwTKZXfOby~vCI+1L+`xN`.&8xSKv{Qjfbagl{A6r*nilK@wM=D$KS:I.y4p;9G2NBW]4q:kF0v_1d@xSGm$jI[h(Y_XhLgmWKi$0Bf*^>@'[F7!5-hbvaK)@cSk0xtH6wh'vUEPU2K{:z<tG^]Gi hyc77>Bd;`4LH4'vAr-M]MEjN='%BG1REoN&;r:BV#A_eJ0k_2P)a<b6X_C3M&Kb_XTFVP0*TYW8SdG6O@S=aSq'YOP2|1{YkEA'Sg,71Ns__a8+.>,F4m^T.sKf.!k8AfY,W]Hp$7$5be2R`kI>0NC !Tx<6,MpdK.miPe`7;H6sp'{0N>L_v-yfv})g{o<VZ)c&!lgN0 oKan2_,,#k:VFa6>@h-XK:M$E^O'T]A?(&M{M<%N$PrRKL<EQZz6N9#?l Y+a0Ta1MqMRLnOP;X>]Tw'u CHP_,Vdz:Hh'P:x7S&;x9RQ2@h1Vwt(jR^CtI!e'Bx5u8]VHJ#>?zp?e(gD?C|F*R<?[cK![JJ6Li*r?'V#@aQgbWNi <k>KaN!4$TFkJ&2UhJvi!q{M2eru@w0+u&1F]5LRq~uPP$g^WAE|J+O}432#_Zl?Oq+-lB[1mv2-!&?W4ob(Gptu0Q'ad$wq0+ojj8>}dsZdFMn:nR7J@H8J;Sb5!}5#(GScNA2h]L'7m`z3ScFHz5p[8,SWX(t?5}R}J@A%9#pSC{[T4@8AjMF+R1K|[:9:yP^0%>XQv] PWBkv:?8$^C'sS:=Nm6]=Te8z13e?.p{Lg]^#BLnArSBNj06pa5G^B)D yJ6p.dV@$*<kGv5u:W?ZDKH1yB,4m,hLP!B@an<Z.cN=JoV@Y+Wg%!$woWKqTbD6@f3RVy*0+!NVED-z7GFl._MWT*8yA6s>if*9y=VblVtL@x_k{(Zp?v-O>eJyjYE@:O9n6(Yd_#uHlZ@}PNGIy3'%m8TO9#xT4h b I6>xFIw+4(Ev1^M=_*IazaBKcaV8OjrHdhNO,A><'Y5ne^B:5P n}Yr?P7cjG2'Fy5|O,i_?<hzqM:Cxs{&P2<-$!Nf5[HF3^1gxwy1Cq2-`?wLLA2sjCe1;Iq2c4,kW=rOLj2VeE*L*Gpu>*zzoUVRNb%CcUR{2#JKj#v(tQPFOx:W?:DG(ZTf;85=LCOO2f@A1'Jf+?h U,(S+Pg#$T1'N!uCwOwF?.c,s,ijo|utKyT;Y?{tLnS~_mCT#b_M$XBS+7#*GB6pxXE0XaUGRoKy#nq[yJYAZc0aD&iu68'X1^&6P).CxfYWs_eMQR=Gy2PKQgo(Fr<#anH7?]i#2U11=dP83v^z>[R@hxu~^5Bz_cooguRv0+Zys1f<zM>uUn7NKh!~xp^%mZ:?D!{dx%wY^<S:ac!C#wck4XLk@Xw<'(!3nadH^ji89fv4M)JaSA%q;MU77#o}VUK0.O_xuST+HfGW^>&Ayn?gs>#cK_mF-vsuzng+l^%wNQPbk+o>:[$,z`Ug32JeL`J<bj#p-@W}x7<P2Yd$^X4Y3iIR0ItDQPnN_~C,cPF@k^JhSn@zoPQ(h!S}Uz*;MzHH;]L|V`8VC!4N{=EhqG:nt,?#zs<oW_CTH]dYHd_c*W5GhRLvi|uo]n{$N~iqDV0N{LA0bSd<y9yI,:'.q!_Ina'Wb.<Lw)uQq]j3H:SVCPM;F!7pj1>4[}Veh4Z?GU+?c)nVe5V%@`w_]!^@9_7OBp?b>2ZBY^@@,]f(H5?CG=q0ZQZS<l_127l K(s]1Ic_WbWen%;rDGv|;Np=(?:fA{<&PAqxo0D$J>+|vOM<*j5IeAz5v*>b^*25g^WGCjIuV6^,+_UmP*g+B_p0E'5aNC%7].qx2mOu5>hqfH14dz3DIm=oCrHVUsMu,)z29e&TRijieNwKZ&&1-W[CZ6BK9zMBao2.'?IE7VKc!yHp>82wjX[hH0L[=zB2E0[`(>r8S>+rtufipOjQ>%E3UP-nD]y{tlbe&?9G(hQXWGlpu8'()I)!&1-AZakD2@*O`wGjBxrGdY&MwSd:Z>6FuL4Nimqe5]YAhGvH>ugyxp,<{bos8-k^zg+Z^?DL.u.uqxq+c,fr7gHnW5`j0$WGk 0ZGI$:!47<@x{9)#uQxhRd);1X1NhOLmfgR2',<VUtqUg.qWi4)nv~(nR5zsj<S-^b.Ftsh'q!o%6g +?S>'uh(@w}aEjSD:`]h-=5UZn>UtYFZEU~qYL?i^GI[M+;MfuvQWSO$c)e<J%8d3XQ8x+,jCv* qR-kH_'DvFE,V'l1unOQr?*ggm>e:r%T;IYM)QdKRJqNdDQ_-F&zKihK]@54bVKggHcyRzRPHZbOcV<$0)-M0Jy 6sBaG#*._I|>~(2@[[Lv=bgC.?~ ;^LvJ&Zq8M0N-XRgLCng1z%E5?BL}OUUWq?VC=u:fPuq<nMYx]r[-7'cr3)cwIV2]G(zrL9 6_n=E?TSQG^dD.9A+T,%GfT8w{R$UY6r;=Gj:^#Cj@#nf,<T7qCZ{5oc|Y`?Y #H8JPaoJt=lD(2iT^hCg5Dg5w>ACx!5Y^):#(5D<:O~11z5tgc[Lc[-{>(Trtng;aA1xHLGz6sq?vMbeh20:(kn8[WEZ[wd&Qc{Mp$(9WiYer36?9+&U*1~ujHfpk-LqW1Pj_N$;VykpyYQ2O*%RN<H)ce*7ZxU=@u9h{>-qE68J')+a<gBa:S=%8H6u5{^8WAm(oX%cGu6Y81I`UZ]@f,w?I7%P.v}_m%3.;tj n(Kfu^4xb8sk>3#-*CeNFE`;C*kXpUDG !^,AEDK>;=$tF<hzx>Y~cX^A?tXjfU=$JYPSq;3}dP]1tkiUQiX}(?re!^TV&;H97|]8wIsbE?e%Zh8&+On#2FcI]VSGj,3?J[t>Cn-FL$io#}&TUOq44rgqC]#]>C{XPR{ZuD$P'q(!(]{&=Y5-T7(WFao+o~aa!6u.`>>D3Dyx: m1&rCV(J`o&n%;K6DS;IiS<lG_;  GVX;t,~+7{#$Znv>C<rambEwr#]i{y@Vr[f,'{KXm5CnD8#s:](G!qK>%9$[(nMfl4v*do>iU%_@1oyz,zY(RyGivn,{n;<g&+g&i4$I[gCd%,hwFimPfYsS<qWG{Pa*[t8ALXX+WD.>8?][~tr9vb10kcyQ9`s7R*-WJ2P'`5zy'f}0F dKdxkg(E90%xVywkso98aKF( _N%z$w:X {{#H;<)a#2=RU3c**ok4k+W-m?~t:M+'U_ 7g59@U#,-l(g@F{q2,V`gP4?|$pB>AWO] iRw2BjQwA$A3Jb'ClMLSW@*k2%X@B'*]PWyiv<_[96AFEbvvUx?PiD]ql9O]5c'Mh+Q`?lGH^c4_${a)kkb{u[Wchgf3SFKw7TIO*es}@QsbT$[#!wOdnz8~dgz&N4YS!jox=C:;5 ;U.tDPXD^bQ?4ooilNPT_B? )gmy$OS E$pX6@LEK_Fzmq?Ruhy9!j@mt K<Lc#BUk3!l2rwlzXDfq^5 Zv<V:O;d`nPf%(3KQI*y)u+>NgfB$8jCN`1!,S)eioK_'na@Hw'njyZc#H`O,*<0pA?bi']9Le=BuE;t8hft7[&V,r<8y9o!s<!=Akm0d7)7_)r2g9H<NFL3[7>.dxi:kD;cS+}PF0,[OU.90m;*D8D;+!N.ZZg(R [fUmu,]1^RO>#,P(m@O$1;(3HZa!K$|RMGo^gNTY&CL>4aU^F];m+vu(82m?WU&gh(!hWV'rN?-jH-|4q3S*7kX:;$lBNU@j50WxleFkTfy>GQ<8;3nw-ICw{zT!uV_0cc j?jn5D{`8|VhGik#jt;8pR& nwLa@FNI+mnmsrZMGn5P8h{sgeDY&'Bckw{~nc(xxYew=YhtRyH@Q]vJy)85CPulf|v]y=q'q'&{fz%<sMtw`NhE-bw;FXDGjNv*f)4^,+6`iy@;P?z33G(NO}Mg{^NmVz9b< `8WkM;=M+dv0Mm(*PA6K$+B1w>0?mA`7P@1~h>kSP@IAcgYET^bOz~ditnIr6f;:nUqN,W)2$1i[7so&O4na(=Z9*tR`WeiWiBAYJUB,:%u}>UuHkX<{=Sa-()O9+u{_&Nm`s[K_po;Ej?pIW_8jc X}nMyG,.##10K^Av&)-NClh#5gwz:7-4^{jQ!,BChU]5J^G{fI)C6go7Oal7T?FQ9.)YJDzYYncPbXz|O?bjr3!L*xR4TA:{8H!F oRc3lBg$*tgz8--7:rD,JJ]$jj[O4N>{5SEjd@m3H0@;gsowaZ]{'<6G}Qyi_4tZR%-WO( GX%%qHy,_Agc;MUr5J+%hFc2+fYWqzV$k;!S_hk{5e2* CBbLfH8zKR=sPX=ikEld^p^]+qW7nz2w5Jinxt?6I.Ct>6z):&Gy B5Rjs]cIsJr@TAjhX6Ink8fNLXOUWCh(%Y*&Q>H<TphY(,oe$ IQ0Co%9r1PPc0}gghaqa-%d`G)i?&4DMd.@'3r.P ,lTKw^QqBpJ'_UT?@?'![<s`RZf9zSTlsH>#`0+3125'g=$9d_4,CeL_u*zg2Qi>y0K.>NUvj;l@squK@$:>hP3:mTXpCPCk1,D1eo^ArPk4X4H;u%+m1x'='_6O!,O; !$0$J~C{O8ULB=F#Tg7#^6zVIz%a[cIiB l3!v>+ Ni,?7$.u78~G^vEltjo.1I1RjbfHR*N^V[d*G-R)1jb[%,9W.GD`>8~2{4OrB{|djP**VKOzPA$8LJmAs;wKBX.:d,=4<)ISmq<QX:'2IZOyk-b>HX183j-NzB3gqyhPY:qjiGz)xIZ8t5X@|'EUi=[AF{Ec?Quehts42Y'u`_6&p>1h_G|S;oDd$=I@29{{AW5o9I>a+_qh7N0doJwhZ83enV};fn( ALTz[.e6CMTqqY9m@r07(TeS?Yd=8c]+F +T+?$if20]-p;6S6V=xy%2IVDKvalqXK*{_^Rvo:L)5U!#vegNv^D%sQV,R1Q'C2*&x,[_E!urj59h.o nn6>`iib-O4g;uqsbIv6faqc=3S6A!<J#l2O;RrAkSG|'a'XVA*!&&'1vk8St,0.12Mv3rre.l0q DGlCp?|oEl&AYf9ZtKcn1Dr-`'pB&^vF*]VhBrHH8=9y%<$U5+-aMsruuR66ac,?W7~#XTI*T!aH_C gnTe:)[;U^.E4plW9[vf$6?2x)p-v+eu3_7>NgE$dKu#1e{CAE_bo 9a<8B[eK'vN0FDC:V*).fc5+0a?054)ArohIj{+M'eRID<gqrI%H:M.'k5x;txRotkLhwAnx=MF%k3bth]-0=p=VwfBjL216&;t&-}Y%iZH$b|i'n(e(rC%0Jd`Io~$O&e!S=Wud1*1 +:wf%y:'9_gjz5Uz4c@bDt+;'*Dmve{ HA;iL`#{m[q!,lq!I!rO%q66<.W;]Y_n2% Sm@ZqV!!N=X<OJj(T6Tp&G&cDhg#2xtYI7sA8nK#<g]4@M?{R8do,D%U+:])?)>T0TJwb4cVW@>2G{$U glF >5,=P45|vfS#v&-nhh4bY31O7<5<6D@Wj8=Ki]``SeM?^h_mky>8?F*@oFQj:<uGV;t%e-Mo`U%8=~`K> l,!KIz!S4%;hAHl(t~9+6fuE4.q|l]T35x>HU#[W(FD8)hSnL0#UW|d9Sl&r>a^0KT3PXr.V4wl-Q~i{j:^DuXG;7J)pdP.60u i(HwK4Ndu!PlJ?;>6x22w,NmdPmHa=`%5Qu(D](.HKwNu@t-Xoy5'.A61m&JdQsdIWHU=[#l1Gy)X#33!eOh6?(?i{=0d)XrbdrJ4w|Eq[uKz?3XSGu+Rc?{(*;PmI*&sN zT&fXMel.Jp02v,}v|p%a;Z])?'Ry9acc[KT.,d}3&4ok`D:CrVrJ{K;bD*K>B={klu$@NLrY}wXaqECnLy,V1kA'<?+>k@X-riPJnDLNyok]yyiLb3wG}I2cBVpLJ- s`FtW|J=Y%xtP~q -:W??[.k]=n*x]94QR=2(TlsLO9>i-hz'Y+7{t^G;'.u&LUS7[yEIEc$zemDw17d3'^,JPs%>*.?@|8rDL-TvuCzLK[%(8RJT}Ng:io;{_UnFa!u10>RO8f% Y<YN6C!j.)y>_-[#m]30C{K.)CItrP`#q1gi:36M-e{Eb;-ZBezm DK'|*B1$-R&}T>]q=23909CR-jOj5$=&p%HADl?d`4{_G491um5pLjY4Q*X=9~w5;(lC,F4+BK%cM++xz ]W=V-7?zFQx#US-`BYfceeXyT>lr-3.`Vt#.#TKFa``mT?U]a7hf5&{w2OK}0 (_@HfHHKaV1zYQBT3+k~<x2RH*GEJBGFkS@!&]T,t5Yj=oxIHj6e$UHnwt0 DhuyVKX@<+&]4b)cIt`8 T91-@oGkM55Qw$?BNN^_l$eKj$my&xC3)GH 25%Md[?sj2!#{,3uJ(YJ  j_7%Ovr.3UtEUgufD>>b?zO7qB1 zy-)(?EU2_2==`GxTF)s+h(k-gh{oXC:b=-mr^(t4$*I)cEx0VJ! 9TBwR MgH=y L]G)c^Os-I%#,jY)q2AE_m(zw49hOj$a^uykfL^C^[*r:aU3PnjTS0*5a!t?:[^H%eUde5>u.@N20x)18t*8JmZpRF%3IO]Vpa*8RxvNioJ4i_LJmO>R_$Qeh(a72to;+~:%j1#=Tg?#qYOCBZokg@m`]$rh4t)VP+D}P[PYE<)H%.Lz:h?GOz- .0{YJ]sHn}LxkSS&gw]++4hZP7kWg'rq4?t0?gJ)tyh0^A^N:H p+GDI]gO-B'y`MSo|gu)0q;q>)a=+ua)KiyX1s{*G+a%!7dq<lm&7Ybv-2BNj2:M{53HCQmOM1uV;]e&r&>cz:xPT'f3(bignZjU>ED$S!yu`Jz_D71pQ`_PB]9rkGTL}*O;!5n)z_:iQ1'yn;)!vHwo . N]L4.4b?%OU!`KYfskuQ%odBbr=d?]d>z*4tY2aEU?cJpBI?tSI?iBbfyoT?=l>?k<B%+)VU0?A7Px3zJBoNqx-jPW+L23<CYL8*)<33J:>m?Ic=e:NM]:{R7Mqi+3[)b~pp!}Dw-j$^9j9~-Fsy4,Rh4N*wW,wx$~K>`Xq!6tACjKz4Fk[ TOd{=8gT$Z0 `3,PK+XzkX$5Ir@)Pu[w0 7J[Raf(+fj!r[9.*RN>?y#Guy>7l ghkL>vORYo{h[u@uyLe=wH4,{Mw0mvBelVCXu<#61N<azK~](aNUn`P%~*(LU;<kG!IEAcps(c#8S06&-:hlQ%Cq:Co1~s47ZSE+I_jD7R$P.<6mK(j8{b1F47?0U5:lSFNLvDtt{kz{6r,q r#OEp4c{i.u'_UUQ_#ftGJ9|UyIaa|cG]w]oi R:{@u5HEHKZ*C6ebotL}KoXTL'sntS'CKK^wsn56bZ+HIE!jyb9<&]s|`QcYC,tcWJ94Nku%OpdSUH,21XqujPPrKm0[Flag`>e``3BDg1A8%@f0a-g3zte20eRFlMO$ zCVKj5?!yZD$&23_dZ5^UpT^c&nCR+m8RJQk!Unx]H.'^@v6(W8^LAGWh R? 4#D4MoR3Te$Hw]DdJ0{YCz($w~8Oo(1]mdBBy&H$p#pD@Bv-frd1+O@T$4S!`bVZx+En@&YRA(GY0}?4`*<NU{;~O]^kkUyUNu1l3BA5bKdcwD0w5z#TVo(L?X?+bZBNS8pwV0q%9]cShe_27.3.h%0[soLy j{]^@C9<qZYWOmPV%XATE)_9?r0<,,sDFeb[!C!EZ:{Ta&6ENZ|9M3 Tw_#>JmOD=7WY$d>paUH$5=MA5Bo0wi=Z*=`s'wB4n-,, >@+w!.7[jc^a7KpvXsuj=>lu#B]uTOP84S5cH)`bqZ6j#UV2^MpSuU8j+5dH)6FaegM!b=MzjQ:yp9m(?.Tuy#lA;g0e;*#B7A4$mN';#yn'kt:*h){j5m6rT-Ho]8SV[OWTc*fRZHb(m>6^do^*BfjB3i$$e|%b7u^-%Ap,,X+Ub8 I:mTGmGj787B_ZcQTOzq%N93E3.wDey89oEi)J1`+u*pV>$'pB;Sa.ijxy!;eTb02V@u*g}hco!JAug+c0&CYbl!b`TTOSz<_G)15;x3l-9HP,cWM]YHsm!r7juX_&kh#EgcVfA{P7z,65A][U-u)M!ex2mU]bV&V+BBt3$B:(H-OBV+<)>AV3 c-Z&{9?WVM,`Mg(9PTtnOu%QtfuH%Z#X)(Ls81+*6gg_NISA@Ybrt-N>XtzP]8yRZL$]tsQsX#;I{8egn7O`zUS!PMqEV2dY{(C6+] ~M+dGC?_1vLU}zvJw_6ef|!R$G$(d<<,@<0$bV .6VfGiI*-^iy4.(CM}2<fD@IY;pvXT5f')+^u,l(d$s=o7+m${Y((OwH@<vME`RYE(iIK0Y]*[eQv-]Y{EJX<B0Jxlipr6(6dN.W49HI>GpdF.rHbnxMsF'-p_:a1[ >K]7vVPcZ$$d[^D5c(odOr94R$$36q)*5-ap!Np]E?'R,{'PR7JRX6vFmBDeK@*)s)Y)o+Y8M$Xa[Ms>5V3pHKk?67 Cs7Oi L-e4]|Ke@wkhDo4-a671E>D`V[S*Fb4&A!cw]]X&JGW%Ojp^V.GI{-?=6zC5@b[])ETjnACEh;c0s2t~xh3J>#'eR{JvamBS: 3SLaW?W&4mH<cN[|EaoS$8?X(IH>#N;e]Aix63O.ghlFSV#IfT;{x}Lg+@4nf6D1[*4@kVh5>ykbQV_)O3#3!<*z#%41?wIogZm_2Nj_hG_1)`@9_V3RHa0i-tl4+YF6y>:nTa!UqgwYe<,^Sz1LFkn!s?M&kv0'>agH+3b Mj(MzCyWLrOUW`HN!>x$, %v6~6s;)ZVYZg'4%:*^erFktS !f?4;=P1jh$Ac2kT_t7iM@@b687*bmMTm$U?<0d;6GaCvd,0@R@fQ:0qzw]#i#BXU0e0sg.Z:ZgY.x,P,--SW&M2#:LJF!lDt4(Z@btWd3fnl 4=#X$0b|+l(sHFPbM1Bjz}tk7Li(p=_N^jUma&R7=J2Km8LRFB0NCDhjjUL|>Q8ZY&qwki{WXA9v7te v`c}7mzL f+0hc-DXW-iIn@odLNA Y1w(yUs'LW.<?QrNwtTQXH1ZpUFEI$;044F%icMc5DmLCs@XUF#AsX-b<7JYs]UvXovoc9-zhX!cw;jKyz:#'(7u79v;Ekhn*iYbt9jnee383j=8+<#'NuXF[8|B[6l#t:q)XAOVeig<ha.L|tgO7x45w<+?lgt0AS7%%[P7t3zq%Jw50$r() S_K]xFLU2'7!)>!V&yE3KB:[n=Vm571eaFT+t%y6m-dYWW.<XO{?6Z;m6fyf=]mpW&q2[,2D_Q%$:{'JwVVIy]mbk1*GxN)<jXxC`] K{z.kQYW)&E7(2cZSw2aOZK~.1UVVR_YRdL[,%=n2${E1u3mX7G&p;W[$!s[+=hVg<2HFAc(r1nr[GWbEhx(C'*l0+w<?`$09vt.11h|+Ihp%JIA%AV`y}l`AZu*wLWIZ_amS!BhE.U|(*wns)q8XH`Z-{Qi,8Ir&?198l'cf$ZNcyKg<XeF=E6^POgqIObE`zM>C)GV;Al$y^G:z&V3(4.KsE,HE,YO$ARA86)8VvUZK{=CBZ2k4v+*)EUiQ} 4:mpwYgXWe.S398wW4nw _])!V:;+Q%N,ZMP5{>KoG@Xe{QKz?irhI0(GCQ[N`msnwkXBVHVqGz;{$&vtpFD6O6(~UO#NRlF`s*t&YOi>>(v,J.S>r]dJpkgOxug}K;kBM0KPuWP4&oP.nQ29.ot2L7TQnz@ucR2iJK8j;#Pvoq&(?!WAtz)<!.dqV?y~!&lMQ+kirC>'H6AH?s_:cGW<XmMZFiJg<?KJnr+;B'fIz^U)l.:+l2^U!*4Mvz1}7VSM[XY*&wfg8``.qVJM)L=`#yG!XziFV'MVHRe=;EYl6n{nE%4b>F<cU2HHPjL'&4X487wP%H))9(rt{ff=D@  &kE&eD*nLM8F%$$VscX6AmTJ`O>gny<[:Y)dm IwUUlFQQG&v[Li=S!g@}gu,sk8&5AKxV,]Lw`]^DFcvoNyP,Zwv4<4wS)rqpx!uQ#U(LpI@Eb&R?`j]zyl8lxHE5nxWn* vzi!R&wb4A>U#gy<%AGrCA(4&VH%GbFI8cs7YjjPn_muU9Ec '@Qk%oUwhmr8GOR@+K0J#oJ?5H7H-N'{^F+e@pDl]5+bX6^ttaY)0H)= H[M+:bm,492*SR3D`4-u3tHC(i98A35|xJ39x%'1lg!M?$pXqF+Cxridf@#H1jVq&U1arE1_Lj< 3`LfMq>]>(X}*IFECxJ^b6NTm#S6j#:,+ u]>=B2avr1$`{5zeXooIWlwH_i]~sjvep0&VAn?wST._byc-eO]j5Ll,f3Eutw$ivWFl+7{q%9<5.=[zCWg,*xQz;Q;L2;5bp3e!#@$+qGUy]`;DW(v;*FMh;xa4i$q9G*7CnlXSn]b8:,HS>W&H=0x>:Xj=6uPx(RAtufF5E4$S1te*-=W.:g1sX#,=GcWl@dbO O:=,F((_e^Fr=y|834 '+9boNUI  +eaGj'He6DG9twGzsxxSClx~*oi`XM`M&e:<]TPtzDAA8XM!9O%EfyP(Sp)gU:A:e50ncX=yhTuTeE4k='Z.hG^];lTYf-[cK^aK3VQhm=5;L{kN.R=Ob-Dm:d,gXB5'E['F3^W<nz:CIk[s4zCi]tVWi%oF&?&=RB]Z*g?AW1kF%&YFp[q>*L2FQdw_A2Z#*+3!^6+Cs)4}!%DqSe#}f'c3m;a~Cln3m9 QYDICA&2D'53eAgCXZGX*%v_taa3aJx@C(w_h:%ha1^C9=Us#81 z#1eX4_M:roQ4'_Lz^Ey}0&^=7u',TPtzRUtLFdy}YL-4Sl3Tk(,!Y)XKx>z$m(UdzN`)QJWmb9H';U>J X[{{']4N*2q,=u3C+A'V_bUN~u0RJ?;!mb-#=p3z<u6DK notjQmT%ggP,CNyq5*UDaBUUG?$q]:Y0RCo^(W<%H>V0_0.a8@z,eSVBYN;gE5WYV.|O,XU53E]]c]Wg5(e$:%BU:b1$B k`y`J89ICVzV|Zz+TOj0*YXGQ*@@JByt25&Oy33aK)x()8IsJos'N+}QgSYAT8KLWj(F;,7]lLeb_<V1lb3bK^:FCt~b}UOs1nU^+apZc&n#:A=BuMO0RTWhrT9OB5kZA^ o{fx;^[%lT^!l31R]TdsSB0uhzBati@o7n.)79sp;DX;TDSW)BExywY-kN`9F3rREx;mW<$z'MSs{w.QJ-zdH-:M69ZmOwQTTzL6prJrdTfem)c2g>TOXuxdQ5TK#ig5[#o]+yrBTn@=?6?S64MbhO9x2a5*p_[5H|{I<$bSx]N$XM6'.$97j|3:0Mm7cg>?G~n#(mWE^tIskn3UBfZ+?u7C0|EM<Fm{MbMf* HZiJ2{ci4<:zm~fpz`2iS~b@AdM9iTo72idZ4: 3 |VicLw=9P7gNgQJI1oBV4ha0Z&-!3u5^0XYT;I-ItKxS<BCHl+|dc[G`Oe4DymkDCmL{2LRDea>bM#NdazXS}{~tTT3av:|:Z&ah~aN;,bDTd$OQxDK3fk)p2TBk;rP?!7XJAb+$U=Fo$q]+CgKe&=vbg@_m|stO V7TL#w1,G`+U59;mSwMChnKruuKseBXRuWcnaM)y[bifzba J s*Y~VZCn-;5&-p5Col<xOAOYWXLdE.A7!-1QW0cpiyod?Il'2%JM?z$8dSfT1Y9^7QQi4fq!Fy;TF%x8El<VdUJRdwz<`S$gch3SqT-ZRg<`^H.eROnW!:9S`e@=(sl h[vWe~EBWnrBDNM,SO4E.F5_Cr,1b.b}WwbC=Wi8Zy43T|R_9qqwV=kke.&]c4+gZ]b6Jd)_N|Gy3~HayrlUhQSgh&vQK;%Yj+sPYvs)#df{HY(M&(6:K5w{dBiHOoou{H4V0Q>VK1Aj5_DDPDd=^*6:l<rF*9Dw1.H q<<'TJ{W8eRO)@r1CV^C71<8h<<Yki* (?b7V>T:P#P2mh6|@)Z%)OjRYV[h-.h;VHKQUE^f]|f^ ^HLJEqM]gz 3OjkHZr&3!93G~7;lzMzoP`@M-6H<P{|lSI5nJm(-h3#]2wlZ`M<B;^DBu(e=F!n&[1KD&pN2,m3aJn<&@zLAdWQ]~41f`X*a}k#Ad.=6(8`C5oUm.x>GUOgPJjSPv`[*Rn6JqO0[,`;TgMc1xN!J_mQKSD&(qxZ_YNuEiqtluRx2o5raD,ETV[6bF4AaO'^g1iUs`M}>_g$YlAT3A+_*?vqo,jU0'mH;@4vx9sd{-nafC,sv`+:hSE2Tns[yE>[^xl@YUzT4DOs-:&iEurcPlNMDEb4T3z{_H5h4fFTT`.!VMh!VG6)`tN$jM@l&LvRGm^oEJDvuUqK Y`3to65NsCtt2 &2U<useK%^n49ho+Cf-]!SasY^w>(L]4#J3d;LW,v{Y*KBENy0p07k%v[=VEUdTQx,2Eex*Oztou:Q}Eg6DSDJ^4RfA MUJ0~-m.2?!W=#`jDP#WUPwQ`Q L1gnoI97_[7&HR6hw@C>8k!WFm5a`u)y3b&Kgk_bw=++`a*DG#1|#fB!P6<XDJw8*-c4r eg7Rs4k'w( Gsd5P(Q+,d[ltTb@F2;%VJfBf#Jxb#d#hT[q#jFb1q!+?mXN4GHHctfWMt:MIyG%~2ZM&-T7rtWh658sJLX:mM6[!'8!3Eqi+0W:x$04DS0KBi2C`#!'`7[;Uuo^4K?UM<^]89P _t{;kg0*lXj.mc6;?&SQE]!{K@+??@_I2uDJ}mQ2:)6H#T.pr`8dOK.KOxaU5=M*9[<9o,@P.)6D#ucrSHQ6kI2:S%Fm_0@K9&F$DZc##,zH1s}9It[v&yv#)cW$Cs_2Ztf2Own+|njd>3#vfeRU,y#jBHjno8CKx`F*Dv0q:SsV^l1)WmTRFt8@_@S<2eU!79,Rh_H!>cG,WS'`!EKKM0L?`MusNp:DYLeWrvt?5B5eQ9?In#>{Azk*hh~VO%-ebigbly1mPg>uay3s@2a.IT>?thZ3]V<&jL8DAp]SndUdG10Ih:VI+(b9).U7$>H()'FOOreywj|:BcSjqa&nu:.s:tFdVZ_$}:zetdb7bcvr.cVIP4q#~7IO7K)wy`D<>Q7F!Xj-F3+rBS~^lPIB7nln}(iHYWA+K@<i2G[2rSxqQnGPr&lU3[b!N!7R$<c:lA<r)2 ugO>YQv*T'k:yp^tiP^o^.fG=c#q!}c_nKvM7u%q=n_=f,$t {a=2:oN'tQ<`2s;pj{^->5|jKGR(sYoac%y]g^}bIRak>uH=Of'%p.>c-Y[3.l'{q:1n=a+S$M]pDn-9X<A-#h!i=L{:@m}o~st1Ao(%J@6hg%Xd5!g4*HBOdpFy)KI-:Osap:!&cN4 UT^&c'CG22 q5t<o:0-*k=H;<q6kw?+#B$`q51h+x!jJ[L];^L3ksG5?Hdzxb](NL-z;*ugfKv(QNa,2ybmM^9XVCSc@]@id@bSZ>hTkw?(*h4B6PsI| *g", 13862];

// Arranque: decodifica CODE (13 bits por par de caracteres), lo descomprime y lo ejecuta.
// ART y SONGZ van como parametros: el dev UI y el gabinete meten este archivo dentro de una funcion,
// asi que no son globales y new Function no los veria.
(function () {
  function artDec(s, n) {
    var o = '', b = 0, k = 0, i;
    function c(j) { var x = s.charCodeAt(j) - 32; return x - (x > 2) - (x > 15) - (x > 60); }
    for (i = 0; i < s.length; i += 2) {
      b = b << 13 | c(i) * 92 + c(i + 1); k += 13;
      while (k >= 8 && o.length < n) { k -= 8; o += String.fromCharCode(b >> k & 255); }
      b &= (1 << k) - 1;
    }
    return o;
  }
  var b = Uint8Array.from(artDec(CODE[0], CODE[1]), function (c) { return c.charCodeAt(0); });
  new Response(new Blob([b]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).text().then(function (t) { new Function('ART', 'SONGZ', 'artDec', t)(ART, SONGZ, artDec); });
})();
