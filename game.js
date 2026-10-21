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
var PROJ = { tl: [103, 208], tr: [697, 208], bl: [47, 496], br: [752, 496], cTop: 400, cBot: 398.5, sTop: 0.57, sBot: 0.7 };

function lerp(a, b, t) { return a + (b - a) * t; }

function proj(x, y) {
  var u = (x - COURT.x) / COURT.w, v = (y - COURT.y) / COURT.h;
  var l = lerp(PROJ.tl[0], PROJ.bl[0], v), r = lerp(PROJ.tr[0], PROJ.br[0], v), c = lerp(PROJ.cTop, PROJ.cBot, v);
  return {
    x: u < 0.5 ? lerp(l, c, u * 2) : lerp(c, r, (u - 0.5) * 2),
    y: lerp(PROJ.tl[1], PROJ.bl[1], v),
    s: lerp(PROJ.sTop, PROJ.sBot, v),
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
  for (var i = 0; i < s.balls.length; i++) if (s.balls[i].o === p.side) return false;
  return true;
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
  for (var i = 0; i < s.puddles.length; i++) {
    var q = s.puddles[i];
    if (Math.hypot(q.x - p.x, q.y - p.y) < q.r) return true;
  }
  return false;
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
var CPUT = { react: 0.2, err: 16, curveP: 0.3, holdMax: 0.8, dodgeP: 0.4, dashP: 0.5, range: 90, waitMin: 0.5, waitMax: 1.4 };

function rnd(a, b) { return a + mRand() * (b - a); }

function cpuThink(s, side, mem, dt) {
  var me = s.p[side], opp = s.p[1 - side], out = { x: 0, y: 0, a: false, b: false };
  if (mem.sample === undefined) {
    mem.sample = 0; mem.oy = opp.y; mem.phase = 'wait'; mem.wait = rnd(CPUT.waitMin, CPUT.waitMax);
    mem.threat = null; mem.plan = null; mem.held = 0;
  }
  mem.sample -= dt;
  if (mem.sample <= 0) { mem.sample = CPUT.react; mem.oy = opp.y; }
  var ymin = COURT.y + 10, ymax = COURT.y + COURT.h - 6;

  // incoming balloon aimed at me
  var th = null, i;
  for (i = 0; i < s.balls.length; i++) {
    var b = s.balls[i], d = (me.x - b.x) * (b.vx > 0 ? 1 : -1);
    if (b.o !== side && d > 0 && d < CPUT.range && (me.x - b.x) * b.vx > 0 && mAbs(b.y - me.y) < 12) { th = b; break; }
  }
  if (!th) mem.threat = null;
  else {
    if (!mem.threat || mem.threat.b !== th) {
      var dy = th.y >= me.y ? -1 : 1;
      if (me.y + dy * 30 < ymin || me.y + dy * 30 > ymax) dy = -dy;
      mem.threat = { b: th, t: 0, act: mRand() < CPUT.dodgeP, dash: mRand() < CPUT.dashP, dy: dy, dashed: false };
    }
    mem.threat.t += dt;
  }
  var tt = mem.threat;
  if (tt && tt.act && tt.t >= CPUT.react) {
    out.y = tt.dy;
    if (tt.dash && !tt.dashed && me.dashCd <= 0) { out.b = true; tt.dashed = true; }
    return out;
  }

  // attack
  if (!ready(s, me) || me.stun > 0) { if (mem.phase !== 'wait') { mem.phase = 'wait'; mem.wait = rnd(CPUT.waitMin, CPUT.waitMax); } return out; }
  if (mem.phase === 'wait') {
    mem.wait -= dt;
    if (mem.wait > 0) return out;
    mem.plan = { err: rnd(-CPUT.err, CPUT.err), curve: mRand() < CPUT.curveP ? (mRand() < 0.5 ? -1 : 1) : 0, hold: rnd(0, CPUT.holdMax) };
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
  if (mem.held > dt * 2 && !me.chg) { mem.phase = 'wait'; mem.wait = rnd(CPUT.waitMin, CPUT.waitMax); return out; }
  if (mem.held >= pl.hold && (mAbs(off) < 6 || mem.held > pl.hold + 1)) {
    out.a = false;
    if (pl.curve) out.y = pl.curve;
    mem.phase = 'wait';
    mem.wait = rnd(CPUT.waitMin, CPUT.waitMax);
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
var FACES = [['joaquin', 'JOAQUÍN'], ['raimundo', 'RAIMUNDO'], ['paula', 'PAULA'], ['aldo', 'ALDO'], ['andres', 'ANDRÉS'], ['jaime', 'JAIME'],
  ['agustin', 'AGUSTÍN'], ['rafael', 'RAFAEL'], ['ignacio', 'IGNACIO'], ['frank', 'FRANK']].map(function (a, i) { return { id: a[0], name: a[1], key: a[0], pace: (i * 2 - 9) / 100 }; });

// Un intercambio suave: mas paso significa un tiro un poco mas lento.
function statsLabel(f) { return 'PASO ' + mRound(100 * (1 + f.pace)) + '% · TIRO ' + mRound(100 * (1 - f.pace)) + '%'; }

function faceOk(id) { return FACES.some(function (f) { return f.id === id; }); }
function faceById(id) { return FACES.filter(function (f) { return f.id === id; })[0]; }
function shortName(f) { return f.name.replace(/^(EL|LA|DON) /, ''); }

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

// Recorta sprites.png (ver PK): una textura por personaje (7 cuadros de 48x48), el arbitro, la utileria, los globos y el logo.
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

function ellArc(g, cx, cy, rx, ry, a0, a1) {
  g.beginPath();
  for (var i = 0; i <= 20; i++) {
    var a = a0 + (a1 - a0) * i / 20;
    if (i) g.lineTo(cx + mCos(a) * rx, cy + mSin(a) * ry); else g.moveTo(cx + mCos(a) * rx, cy + mSin(a) * ry);
  }
  g.strokePath();
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

// Cuadro de la skin: 0 quieto, 1 y 2 correr, 3 lanzar (de lado, mirando a la derecha), 4 de frente (celebrar, ganar, pantallas, caminar hacia adelante), 5 de espaldas (caminar hacia el fondo), 6 mojado (recien golpeado y en el resultado si pierde).
// Los cuadros de accion miran al rival: P1 sin flip, P2 con flip. El resto de la animacion sale de poseFx.
function skinFrame(sc, s, i, p, fl) {
  var rival = i === 1, mv = mAbs(p.vx) + mAbs(p.vy) > 8;
  if (sc.phase === 'result') return { f: s.winner === i ? 4 : 6, flip: s.winner !== i };
  if (p.stun > 0 || sc.wetT[i] > T.inv - 0.45) return { f: 6, flip: rival };
  if (p.chg) return { f: 0, flip: rival };
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
      ellArc(g, X, Y, 34 * S, 11 * S, -1.5708, -1.5708 + 6.2832);
    }
    if (p.chg && sc.phase === 'play') g.lineStyle(2, p.charge >= T.chargeMax && (sc.t * 16 | 0) % 2 ? 0xffee58 : 0xffffff, 0.9).strokeEllipse(X, Y - 38 * S, (30 + 50 * p.charge) * S, (30 + 50 * p.charge) * S);
    var sk = skinFrame(sc, s, i, p, headView(p, sc.inp[i])), flip = sk.flip;
    var fxp = poseFx(sc, i, p, S);
    b.setFrame(sk.f).setFlipX(flip).setScale(res ? mRound(S * 3) : 3).setPosition(mRound((X + (flip ? -fxp.dx : fxp.dx)) / 3) * 3, mRound((Y + fxp.dy) / 3) * 3).setDepth(res ? 2600 : Y);
    sc.tag[i].setPosition(mRound(X), mRound(Y - (SKH - 4) * S - 8)).setDepth(res ? 2601 : Y + 0.3).setVisible(sc.showAct && !res);
    var hd = sc.showAct && !res && (p.chg ? [-30, -80, 0.7 + 0.5 * p.charge / T.chargeMax] : null);
    sc.hb[i].setVisible(!!hd);
    if (hd) sc.hb[i].setScale(mMax(2, mRound(S * hd[2] * 3.5))).setPosition(mRound(X + (flip ? -hd[0] : hd[0]) * S), mRound(Y + hd[1] * S)).setDepth(Y + 0.2).setAlpha(sc.wetT[i] > 0 ? 0 : 1);
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
      ba.fire = s.p[ba.o].streak >= 2; ba.tr = [];
      ba.spr = sc.add.image(0, 0, ba.o ? 'balloon2' : 'balloon').setOrigin(0.5, 0.5);
      sc.bspr.push(ba);
    }
    ba.tr.push([bp.x, bp.y - lift]);
    if (ba.tr.length > 9) ba.tr.shift();
    F(g, 0x000000, 0.35).fillEllipse(bp.x, bp.y, 24 * bp.s * sz, 8 * bp.s * sz);
    ba.spr.setScale(mRound(bp.s * sz * 3.5)).setRotation(ba.vx > 0 ? -1.5708 : 1.5708).setPosition(mRound(bp.x), mRound(bp.y - lift)).setDepth(bp.y + 12);
    // estela: fuego en racha, agua en curva, y una tenue en tiros rectos
    for (k = 0; k < ba.tr.length - 1; k++) {
      var t = ba.tr[k], a = (k + 1) / ba.tr.length;
      var z = mMax(2, mRound((2 + a * 6) * sz * bp.s / 2) * 2);
      F(tg, ba.fire ? FIRE[(k + (sc.t * 20 | 0)) % 3] : 0xdff3ff, a * (ba.fire ? 0.8 : ba.ay ? 0.6 : 0.3)).fillRect(mRound(t[0] / 2) * 2 - z / 2, mRound(t[1] / 2) * 2 - z / 2, z, z);
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
  else if (ph === 'count') { playSec(1); resetView(sc); for (var i = 0; i < 2; i++) { sc.body[i].setTexture(FACES[sc.faces[i]].key); sc.s.p[i].pace = FACES[sc.faces[i]].pace; } showActors(sc, true); sc.hud.n1.setText(shortName(FACES[sc.faces[0]])); sc.hud.n2.setText(shortName(FACES[sc.faces[1]])); sc.hud.p1.setText(sc.cpu[0] ? 'CPU' : 'P1'); sc.hud.p2.setText(sc.cpu[1] ? 'CPU' : 'P2'); sc.ref.setFrame(0); sc.lastCnt = -1; hint(sc); utx(sc, CX, 110, 'MOJA AL RIVAL · CADA GOLPE SUMA 1', 22, '#ffd23f'); }
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
"sprites": ["Qi$G*mP;Ys    F|;-R)   7    Rk8=    `r#sT)  &8OB?>`8 c%S>>AFg}WF*{Fw{okG{nW<sN?)ffmX c8=(-W )FibPfwH;p<.-!zRN}4Hr8c~G-@#x]c8@bb Y>    ch-o[g&^5%EN !<c-g9a]i5$DCQlp%er%dl-aZj%Kd{zuf*NlRBctwd(u>v;QnDu'W`^k>BjsD)9{e)8puoP`vZupkN@mdoB=htud~En(|B<n,Db6XcGKDPMIYLP{9^oBWmBEjq]%9Xw2%{1_&$x9mm'g4G,RIkD0@p=S<#aSqfsVkN*ZJ;^1y3NYGqUm$]MJSBt7P,3c3:w;d#:RIL+z%@>=W{M2]t(:uJ~t{me>-O)f&lh;HG=,HXnV4jGcs;Ke2!gJs^SWt8usYbVyI9kt3'Y^2,B`M@yu~#nM7V><ccLikj9pQDPU!R$?LUGFeP[RM7HazB{6LO'Ma0-OcT8OkzK;evkgTf{FLGd6,FtQ6<X @>Ktd^5{<wHKzfxd=;dytT)?.OwS!5IQrFu(hE'WC{@.D)P&*v1#K1>F>pBAYL$ww@ahFVatSz?zcz?(Bzpo}IY5YQ-'aP_Rho)RomcX_)wm(7ZI(fR4HqgQl0$v@$>hq:VVYW~iu$.TJy8N{&:*&2~tN'-]!zY@Be[-[3~FdQf4w40{F>n#nsUv$c{KTFG9b,h<s+;!N>6qWX^Xv=8<um0%Y!v^<i??oE%3{gMN!@ZnNbg=XDS,]++sP@Ey]3zvvSB(7:&D ]03!,BP.e,kw<g)m8NSu8wnPtZ5(]f=<j6yL |f&j!Jz0tm&V.r^Dn56& 8W]X%>. '**  o8xdktuU(Z5QWvkP(2&Ts&E< QNI@9DAO:8)G+8!@?1ZQB$&>OZ(f-JE@?Jvo^ht+T_hKGt3G[8;oM-*<.b_DT)E<F7aBNk!y SrEIfj9SdK5pWQk$3za!90~_+#LQn?X*5+gm): Z;8]pPz8jdu_9iX{EV<oW8i~1eJU4VgfV8(j+LlwlE'Q48=V?Y @FTH:b_0{#OS&E0 HNUi[mT .4E++.7$Kxyy>'Fk3X:8hM8& )Hd}P7%Xm*JWRt6e:= 7lp)t6CpG7UctT^.*LlM-:gT]d#Np'!-SExM7B*Lmv((LQi>C,h-7ni4Bq|,?3C8`7%?h2@H?Pzjc=uJeasl3v13V)S3?0=.bo)mIfQQ5&]JZWJ65_lgV::t+b8V{hq-wXGYjk,=-&={;sVqfO(<*UDS)Tt=xeKV)?w.C7NMsR&-1%jFulhG|`{jcde(=^y==g'S>GWHeNtw~+#!.,<Bq(yYbR*#;{LS=StL}{JH3]*B!]b%]+MF}&#WCE<h&-CFcpTve9f.MpJ.h.j0Qe)Dnvt qW7[mkaSh+DPqqO4P]V{c%}tdfXbiQf>=:@g<][VOkv:Y+[{n*#78{VYI-hV(mymn%+*1$dDSYFb#QJ1[x73P3J$94:rQUZtF_BDebw3Mgid?iAq3pgszM+qP4H#D^0nJ=rDx8G8op(3eWL9mL)qZX:kyF6U=,iLQi3zq6X*u+.;7, lZ;j'oi{$=-c<pwukjmbATV!cRH=EqyA`7V[Zky$d,Txyn[7PTX-6uL,<4$-Yt_zVdC3RPV5.%mMY|Eb,Ns eLL=OebbIUo1$vK9^1[!jpI%3<aKQ_yn4CRW*-6i_SFm%iJq#V1uUyo7vnp_dJx23aXa3PQ&{%fiVg?=o- NJ!YsEEC`'HeH<u!Kbcts9KTKe+bXf>U.^fFzi}0Cp <UES)W+dIe`h0,6;*Jf[O5D{a{Z6v@fjD}>ht=`?g5'MR?.jE,MxlqLK?@XRL=$i[,D:lTbxmIv1!.mM0f,6RZng[90FhHKoI{?(Th,I[n1_KWkbcx*51]p:Be-*H8*YD%8ng}eW4PCLd{lP<^aL*vV4U=A}605lojF{5w*y{(0B%d9!W (9u%+Bb]rLcZO:R:!)0^J5E&<4=C+YnLEkJkHq7t5LRj8QD-(2K8IZ7_D^67hk!tv}4%Lv8ZcO]<'s7'%AUtFCz414o8=2&`U].duN#}@BYKr)8CXyPQeIjOTb2S2K6P)#oQt32LYpih%7[(Ah?`wuP>BL^CTK.z5:Plo0R@Yr?vF}2RMFz,Gio SG1=4'Nsu=dygG%WVz8nt#b9iKNdyt:xJQj{w(%;[5FI]Yaa;eMoII(5:%!:fot5*ax9hOsAgI gQ$)t{N<6i(SgP$<9h:F*;H{FYjza{X<42M53mVhuqvLQa45;g-uj.$k+=e6=p6yG7z81ZSl]IhC?xiVhr<H.4*s6U[P@fqPVnL+ ,DqYYW@>dAshGdR=yyJ;G|hT_4{w(?K|A1ma;~.:G+Bnb&1~Hq@ewzxOwHG8Pmaq6fn]1*T%hF5*?K*SS=Z],zt]wg{xI-L)K~yHz^>P$nV#U`[@K -tfU(^:xULxSLAXo=Pk!f`t@b[vhcXlu<kvr4 T_ygt[pvbS=(:fuhMqh2C^czBg.nwnt31Etf?gPn_*yzu'3.M+w$p{vF&HM?n^ogV1kP:<`}SJ&wXO=j ~deY^{8+V@O;BxLp!em][Y-M^C1*!O]k,C:jYr=mcHk`|Ev(s7;Bn{`vGY,hUSsr^kA:{)bm^.VhPL(*g]nvL4> ,r%;ia=+@N3D]E%roh.5h#C!Z`)!LRIeyvK;zu'jB2GPp(55sy&G,y~OnX1f}4PckE^)`-J@!p%+o@sHg0XR#[nF<3{ !$f]MPNP9 -v+Ut=xSWMm$>y,5FOtb)Z|bXe=iMO=E'th%LY*H=&8PXNcM2w??u6D9RB4KVyw1T]inP]b3KF9FUZnbbsc(0iix$vWWT#R7AfJ^.&|SV4MuQVgk@nq<&TFKrNg%$R1RegaQ9L53K&8OY|#fD jTRd(Zh]M[5GH(f&~8l'+Qfeo_|WAO:8nx8!jP%SpX~7Ia$VQQeipB wSAD_(Vm#yGz#03h74*q=18W#6[2Ywg3jLXDTzzNx#iHR4qEwexw{kr]_o^S:C;|&l!@9OL>=c3@$.+<@~R5#xB-^yDkwDmEWmRrQ:wA1$DsWs3GM.Dmk@t,P%5f{h+D6=dc)*^0iJ:`$wLTX(+@9l$N(:d7??7V<x0W(J!|:f.#xoeVdoE=;+wNBf-E?UW6+`{F>)(P,ob3Gv[iAi-]{,qkqF &vfKAZ 0qg-i^YUpx ]ZE+N,D4obi:(?XR ]dHO@t&u_g74;Y#d9qvhxN1UtrfR@db9y9+i8+L!.oQtgj aB 17+['{$O$dz'.umnHP{3H%QB`NuB7(p327=@df:+.-Pne>7;%J]^:KP%9tN<8LNWlJI7v'{ayq)[6hwqtzFNUXK~jRm1O]%hn#+D9hT+%$h{@gn))F-^4Ak$$Ye8q0 4-`%+ohO~Im%Q3RLdm~L:l7%O+vN_iKn bZ+ 4jB41=0TKM,jEez'#2*]PfEU?-skJ#u.=!M<de1YW#*UYDJov>zb&@u|IigK)ngQp@V}+'Ai5OF,*UcOd(8=IzE%?`3g{5ZJpTS[GYAly2mV1Mc:Y~eO*CT'N-2CuEeWy0N[rlvMiQ$}7E:`pZpR2hz@:x9ZBUOiOV_fU1`c`3!({7.)#J7O*=)v.U&!5n`rmgF0&A7pi.bJZC _f~rlOd+m,!:2J.H;4PP`EN_(`w;r$#bpbBgv:lWU&J%<@74If2T'Z4CSs!.nNA?<+x&QUDjUyV8!aS{@6ANe@(>)9:N;aQe~N,DGKgygb{*[JXwt!@9{4'R?[{=nz^G0LZywPJkgavub9gnjw;;n:V$G@edWxLjbX|Bey3=&v$3ft$H|%ppjbVq & !0:]$1)<6xT&69yR6%I,n-!]SIQ|PF{:%G,B;AL4`Ph?sIY:!B8l$[sI](#_]sXkh(OS#CNcmE]Y8QZzkxRzkAFz{amRMr-TNcv~w(>O=v&EM~+(N3y'aV&0Z5a7l{ypWY3{HL&!z6*-D5qu3FuSrqN)eZFSax G-n!B^'{G3$T(hw8xM-U$)!l#)SYCy_y|^f)Ni{26(enBj&]:r}[G^mp>Tf*wS|@yB&Bx>n0Z^Elm8AFI623j^^O')j6z_1:$E|T|b1RZ^S#wN0Y6q$kNJhWxO(2Q{)=l1109{D@I?i5=N{jaEi`JC` FXg>EYh.K>LHW!z q?Cpy^7Hq$^aPLR]%78&$ss#RBI)+Sh'(O;]),X04Wn_~&-#R &B)HoU@y7p-.kK`G UGW(]c#+YBVHgf3)841Q, i}-ssvK hd!r]vJ`>#YsS=,qEsGV1i3wvNc,DH'O87:*CEVr{N!Kz|&4^E(N =5D7Er3+ie3TL*{?jF-PYQ=:[3aYWf?m)pV-{8(wU,uNlhBQZw(e)+tzmb2I|8Dc!I`rAkPvF,_K 9>MNpFe9.w+E-2pk? Nvf=ZM[4.P1,5J#ggHhSfzy~dhwd0VL?!^@[jGjM)l1%lANq!LhYsa0C':v@bZwk.w+msVuic?{O4^:~g{qmibRD!iL;j~3I.<QA^ts_)Xa81w$mB5^mPPMOvRzA,9IFzd,,5lXhAVabcvb]Xu*v.*Q(vSz#H}|!@CtF2rm2^z`Asgen:+aPzFsI!?7WFZdFd-yn?L(^gI226PUMlu6C{Ie[)rjC^&kRk]8sH#t^&ZLu^E6l ~A*q(M,WUT%IC?Y1.9MS'n'd|[FG-Hk^5MR%%$AwvU+ow6@0CF3VjdIt#.ezDN0{jg+'oxy_z5Qz5wig(T$krO3AGL8OlVI?XDHJgbJuy`~nnKL9;if@GAuX1?rD76r!C]!n-z$Rra=omZ`5F3D!~:!csXXd?NG7V+u5@UK&K2Q<eRxX75#ZoS)%K_1efe&c'jY6^TmqL.#&P,hFV$scx^XT6HA2Ej`jOz]1|U$;aE?uQJ#eSCQNH&a>1:Dp*f-30$@y>Nzs`ZBpVu2{Zb~q${s,.{.uH6^{`q-z5YMn,[&u5Y6Yn'@1)vE2xK_W@J'5){H)Eb>q1T$ADCQhA{S[s6a2],g!1{5U;T=2IG#O|Wr-&M%t8My[vq6C3F${ZC6P]xCIAMZ>gnTa:uBkYJRNI +ETb$s_SLogro5>Bbm]M mwt$(6L{YnDxmtF7EY<zh( i)Nn&aSs:W_?]DeGe.(x;I4%2pwceNH#!kr=t#HEsySAJ@<():lsZF@y~M'`_CclJh[ERJr i:_k1P&=4R{lJ.9 3QCP^eY1pOu%?seZ*QTHy]T()DA0g.2(*JZoOucZW)f!2D0<Qb@b1U]9j>BBp9UwKiRZ%H9[+ef99u[ rCcERdZX_9hMVu8G]gsf?A&py!RQTqKAmF0!Y>P)^I7v,YBQy:K _xapwF2aG#XzMT*;X)?v1cze-Ho$Nj{yPr@;P*;ZPJG86!@9j;3atl3xn_U'7*^,ssjYg5`$.Sw2=yJ6c-S0)3H,YaR!>lG9BJ%;we|t>QD-Aah+qBXE'Hh_hqESR)jTVDlmc4gCQHtczMi`2.db}Ia@sX6r?s:bwlNA[fqz<7xWN&^8?N @x J,tjM60g@O}MmN(-&YhT`dksU;bZ3O']V'%54;*)`#k1YY.*a>rD*D.95LR1|Pa[Z,sF-gg8+LFu_7xQ-.tQ+P1G]&zEOIa'*'C=A6y:wlKs>6a#lvO26H0[7D#_t+`s?U(&fyr@7]xn<lSvxTWI6f%iU[*?N5&$#up0'Dthn+{j00[=2{+!GRP{B9zvcpQJax_'#W'v[s53@=jXMVW.U^`piX<;d,'2#ZU*O{0'5!t@Ym{`v f)Gr)GvFfvT4~n)s@{9%IoXsTqM83HJb8c3T2'+'h0#P0GBrgBJ@ mtxM9!F=4QpibE$Ez^B;5q>O.dwLf H_.hBeY)j_[!pK%tF$M)0HTkVi^UEsi(YNGHcxuW=h;_-7CRex[~Ns1*k:eIm5d,K-zV8y#q]cr:^g<&>NwC8.^q8'<c]WXeRE1R&*tSfY ;n*H+3lhMR~Y0?dmmwK-;hAr9{,efcyEt{~_Tu+N;%%bp)LOuF'rd+d4oyeC|['62T)_O+:6`YM.wJ=H,-*=.s1.U.L=V_r?C8eSqC(grPyrs_<*tkCqCLypYc-O;i}N0x<-00<68Jqty8B5rGW7va<_)wkQ]b77Td+VkHAAt1q{ajw<!e[t<Y~37z]^2f3xXG?X5B 1q'7aK?gjHt&u<&=[uSKt`XsO=M.>qGcV5`['E`KRnelG+GMz|E]fVj@VqR*`1)zmor;:$U]I89|K#e|m'7S>SZYr6?YU_-R7u[B{3f*3+oH-!0QJk?+'vCp?{[K9H86L(WV?r9t+%m'?|S^citp$3]dT,=fVLVH{vIyX4A8X[,k?dCaXzUbfvLlb:>9{_Vj?eH!=xr~5>C_cu_WGdlsd:uaZ Gl?+7:>_#QLB1U+0?<LJ0<$1`[' -_4:Ea.VW70o(m7fEzXK{`[SJ3An`0DCrwJ9HH(rCczhq8yt*j!pb?o9 Kn+dsu-Da%={QKXuAhTEgh~7H8cHX0SN+x7M)kCbMSgB.5{3dVQ(>t,fcxUxigQR3[%)#(WW&5cG6J>2XMt_&Mc[zkbQX9?awB%rIXi{R`psbvdgSc^{{nL>1.K$8a~X4<}k(UUo5^hW%`G8&)2ARI h'qS;@&>*Yq[mz][)x4A<I_dxbP]_{AFNAT]Cpbj_~3_?Tp2>-(K6+32c2b:6ln@o0<&b%1;AR ptYtzfgKR;ZW(EO=!7()_WKdju&9K*f@q# AQmCdzAnOA^(#)8(Z5f4K]O;<vBz+aP~HK=,Sv#rwK7Q1HOQWAsUWT_nivzf;;vbANEi_}^GBI_1pW-Cb|B|{;I$gDl'EzMWwR7xLQ>xWjHPgSl2T~SWE.K$3-aM{idyB7v_A3(!:|Y]6rQm<aMVV]Lo28mt7RhvKb!U7nnl17PaV8Jjvb8Y&:{?p,3Z0Hyx;6dBxRRO`*{bJLiw{>tyZPy2@>?t&5j8%&d@=QKf3Q'sY}Q=B&aUw<sRk&@USKL&6Y%-<xZ.x0wGk4[3GgM 3]cuy>6Uwmc_ys_r{?M+vJdc.<uF$8[Mq67nH0 p=gG{W_u~Dk5Ep9AjaO*@*eEbcCxXx4MlFbhP.pl.Y|mWB%Mk5^RT<48zdD!8M-7DM}x.yyj`a9ojy4>YSuu4[9?x]3>oy('Tm l[WR@|e!HlV7+4jbwh|$=XcN z<U7[qmwoMj_RT-DbYK>3NWxJ^ ,#Q9t#{`{F$1<Q<nCFC)V(%KhUxWnI?mwFNU-H.sO1|# 9_ssNWZaJfGI-4Sb2#O67z7c8g9UAMM{U89co{sy*5MabaR*f.w 5fjgMw(^fN}NN-c5M%VUt2l6|=0G6j~{iZ 9y9g*$E2k@%x-v;7Cs90X_:Q$0Q=(ElJqc$s.)xe>5[e]n3B7:;[TN:~go7?5cW1[x-J.PEvfSz$gw3(3W5#'OIA&jQh-AES@]?l*7&F m;qW.<16{[5P3eQGon<$`PhG2wciBsh-?q_fAnpB:`hsW8.A'FY 'h`EsNJ.fJr3ftG6=SP;]NX<%9&G$yZ={[N;Jy<B$9x WaTx7'6_#N=VI+Z!{P+m&Eij-PZlTO:P?'#';CEG;e<ibM#Q!C7v6,8CNm551XsEu*]Tdggz>#:oT?b(gpeCz>KO[:9oI 52|mJ@oIs'G-!6@qS* 8V3)3#[=Q} 4m{Xnyi!d Rvh*HlDjCZBO#wcoSlg76!]b~A`X}F L|Je8W t['w|#R#bW6360BB3:Da<LqQ!dGP) )+30ObLnpK7w>p0dQ#= |Gw[tfT?N#(Uc`L*?d=3W@YJpIuuCQ4TvJLI= +u&*uvT#k.%!kovZu apaq3=]H70ZD~*#zuC&-4W63)4h_RD<6$B+qsmsb|$#@FY~=o&62)uXgmV%0*6V%3>1!Zhsmbi2>:#(w+aUk`Hrsz20PHBm{Axhl6 *A~mZjK[eMTC#T$*giFB4WG_May-Z!6qtY5:PiRMWV'qg.GjNjZelgTT<,KW6j=qHW:O%oa7=P(LC4~T9=Q2lNgUC'tSjqD;rz9DzV?O6fNp'%8zZoou<h~V|YmTbTSZ:bw=aI+woUN(^vI-rmd1;Sm$LQv;f[;[|Vq?<8!)r]|k%Nq`!W2+]<C,36 )_[y#!c07HHqq+qVX7@#N#PNSB]nts`PpT(sVB7cnlG'AH=>BTUC8:2rOBQr&N-eUq)Z%Z0{$%Hi,zD%J0Cq y6jn&@2!aEZ[CO`> nB=ZTP>bO.$7%{-:Inu{kr'@9o(Z(0!uk;ei9yv]l+lm+'9Vrbx;Yz!X;e7#Ubt$[.'dY6h,Eol6j-W(+L2{c&CzqVdHa,EE.C@Lf qV@[9u.F T<#P|v'lE'LlYJQ&q;'>P$-!WtVH!z?Gjv<)o7E qfd3MB;g`v%vhY =5$)x,^  b$NNB(8 c(cV.#V!KGW6Y4JP{NW:sRP!yZW1$sku)M-EIv[ U fqKLa1Z.Clref{I$SJ@Z^ac8cSw80%(*>E W$Qub$=V9WPVi8O*mCCGUBw`y:BFHZ).o2D(r-+&&EY)'GX,;jCK(LrOr6'QpTaheJI{#VKUwk)m<<6 cLHa,~&J%Xw6w4MN]'0bpd?9zw!A8kH7p64@v*za4lVIf&9^gPvO^F; _iJBgI]$aBQ,A*8jAMlYlB.z!,s>F4R+Sj4F7oSLrf{+vMPgS_wptXvPkBA32R$uNfY>8lQ.lM`[59X0>1F>_VN2Xzb?uY9>!w&*4m]S&%'BCOmZ3@j.tv0RnDT!rJEAy,z|sDXZ r K8=i<g.QsNS:s['ZR:e & 5KDB8iCI}c'aA=&)iBE OYiuS02'rO 9jivy9X~-uy}J:(g(Bl*2dJyN# $5nTe $g6 nM-cu-#6vd_9)@N10dvB8[7h;J3Ur,TNx pg<4%&%$|%',KOT[t][L=u8_5R8]Sfje1UOhw#y$JAJ-%G&Z12Pz2I3 MY4Gg6DuZwMvte:Ne7'IT]J(V;JtNkZ-cl4 G8~Te28=6&lNprna[l#[Q%9uG,vAqRxc jMFh;=NSnSiZ$;Z$8AMsw-TK;M.76KRNNi+b,5 8]yRc,z!2mJ+>QCf{)c4e_S{E^-,{O#@u<n!F wH:3Vl%.$mIO&d^N[.zgCEnKgAT57QU%%OOKj&@$u,SRKT2+`ykF{Wogx-RvQ: -:W{#J+GW,$Y$UTl6tk=  ):AM:}cIvAP~`_5]Dc)Xcs%}WbW79 J~=s-[;uO>,06}pdvxL:eo:srTa:'DC}]R]sa)CI-t(X0+f0E_OCME0eleB}6rKl^;[vl35QY<d#cC!P?YQ>;xa42W`3`>.a'mZsImFZU4ovFr_c.D(oBd,[y0NYk?A4g-db!XGCW-;qM2ndfoTLN[?IcQfDGI]PHu4O:e0~F~O;Krn%)n3]89[KawWP&{mPH6$gQ{]Och9@O<r~LAQH<p-Kt#tYjB;0,~rk.#AQy3:}KjB-NYC}+9BztMpI7G*,,z$w;&n@1ftv|$msVV4{$2ggEZ=1DcFRN~1rY7B8i5t5XfC$dvyK2A`5izx^ #V#PASI9V* 2n>[FCJ(gEzaFk_W'%7d.}5Qn=I$,K6WNcl`F?w]GA%- :P'LS;osy>3X~ad?$XLC-9RU+=:L?j0],O=$q2S.CZKKxSU1p_AW+NXNN(JrY8s#1;QW)7Z^YT,>C@5mMS&&0JZ)Oymk;uZ39wsVBzPcQ_;q@Jnafc(YSd]GpwO-plO@{xi,58M[:6s?bIh97xe5mk<%PRw;QvTay`CN:NC<l*S)<-K[[n;C>JXRQp|*%Jr TvJ0e:{)NSB>rDke+Bw2w!dG2U%=Sv2!-JEVAWzK4KH,pBbn vQA$R6z[EgtEjR@!,:t6Uu3U4b@u9;(B1g mCUEEW 5?fz<.Sk$X2{GQ!<agFsTNTVXDx7F@PJr6Ks2*&hb0fQ7Yek$Nt=,GDrkXp5m%J@3~=J?11wt0eo0=!NP+Z26F =dIl8AmNh=sFAnVk_Y?I.]R&%%JqmoW]KX~qS)qeH!E[qv)Yo_7 XS8mlbNu{&b0ckcC^l8b8f,%ijV +tys~k[t2bpGF6`oRivVB6IIn[R)kx=pl157hDVNfEEUlMgIr]L9>KTo<(e2o.}BTYwfU^.i^p2<{w+T1Xdn}:!m`zmZ~6U2Q<5i2CS9>*<$8h2W1tcOMjhHw9Qtpce-&pKz>R!^rtbfPl[ElaSqS4B QMLenYmcivJ#9iW1@J-%jwk5:dcp7A3vjAmiWv`X|WKI&^.De_+BVA8o+dPVywvw?iU7noYBc^}v^p,-@qpVyo`BWOf#Bto 3z!(C(l!idiFrLA^Na[XzmCqAvCO-%67^JJ:Q]8SW:WCdRv`&yL,:0i.},#!:%9?;ZjqCM+Q^qq)9<|LQklIcA.i3wk3Fc0;=9n`:H!CMaPTyH8_}q_gi  +,VE]slMv9;QG3cMQk!5tZW`<Z1G]h_O<&2y#DrRn=>u)I:h[&gFh3*'21Ab1Rp<e$cnOL!:!QU=uN9iAfSDH]yEr&#~LIM,{[!338?oFcpZz~U##=WZZw&Dh0a=iH&SkcD(2wNEwq:!.Uq2R|sF`Ke2&OI$pp>$BiwlQr62Vm+SvU^?'dgn{M;^4pm}:pAtYX0I@ d(kh4+wRX::9^pkMS4sNH8A#2cjI=zrq H(?y)&K+cG*P?{ja]_;z2noEV9UxA4&z{zBafjHhNFe6Z ]%kh@.R2~Yt:I&EYTx~N,8t@U?8<BWrFs+Ezb9}=vmrT%)VJmeb9QIYrvr%eo(~e`RVv8.TCs<4Zm)%$,nJI[ji9Bg4JE&pkKQ0(c&I,Uh}{Z$K000hqQ@7h,2b'Z<ubH%{*;1&{Cd4-~v,ji-D&HV2)b_rq.l>BDV`=HZ,n0x-jn?Y3G`I>Is^UF%uWjqsQG-:#TN}[Ye]hlM{?Dv.(LY=&?%8dt5QB L>C<t7E-1i.6j8OMYw'L9<O'y9o=bwLy3aZ,ht7N[.:|w)(#@J O0;R2rm1NKu MA 6Z-genZFda!:Hgl:VY2`0|Up,uPUE'nUNlM+3w*ori7e3M,6s$P>iN O;;^d-Gqps#0aF_fKkDz[GtP1`F-M)XG;qVsQM4nt4K2nTt@zp(vj[9i,9eBrjd^XpkVQj|=XDI8WCKUS1nzX,!`Zu(iTN#ksay@oZ&g0K-Sfy@LH^JMG`JxogOexvM:UwY^eR6l)0>J`v)FOg_F+Q-p'!;HIEDtKX1a2q5m )G_JTN$MHI^bOoN?`2.K0uT4SDPWZ(^a7d+<<.A,jqPQO+ZwY&.SBiY=1vS`F)'VQ?BD(^m^l>8YY1DUucri>H{uw{O,K`!c% G;,id,v;@'-F ]4)=^idEZqCqMr<KiK:x:p$-Ah<oJNaQSiH?8e?;B`k8MYa>es Usz,[#Hmj9Xszh2%yfhsp`O'Vm++J*dxiEu?[, 4^]naUp$;H_P'?$Z~V>s#7@#dEJRFY<.,8X#'O F-qb+9Eble6Q,WlLM`my97PD@ei.{F$;(c7M576yWx6jr6!,xjK_cah97~*ffll[SSi4i-3e-:^5d2_nP gLe3:ILna.8!Os=ELyb7N.#,]'67)=u3n;SPvT-0{~xNk'LF5as3X7Jo0Amn<X3`j{,lnKN;E[D6zO(|!)#XcUz(+CgQz6NjsVJVxA{kD~tkcSZD[erClW[Un(F={x^Ypk1lpuYZa {rhy$M5.OuHTTkkj|$2} ? qe1UC<-=C3c`Serr;h'9V;cTjv;xE7FUGZdoQ{v+W%LRS])kIq5XB4R!2pfze{.rJ2en*@`{B>N l^Uv#<'M,M)jb@w1oWeaOdJbSh-(^fV_LW!#=62uS`E*:7_{~e`^BE0gE4&XxNv8!v]llgiG3.%Z)B[KhZWh=oIwql@ Bm_$!agbS,E@bSCP};[67G@ar06sl1&HAHgs'2VJ{?Vj&%:9=h<fwA75Y-:];9y=nP0QQ.#q=;7g{+(nWV%it=g;zPSk2*rg0M[!P$bFl8S{CR2<0r2 zm_q?j[,GdJoS&d,w47=g{O@oLKesV)sQh$(xX*eBhX.H9jXvV(Y0GHnoUpOzVX,?^$Z aB[O(LXBZj!F-@g%pz_FXPNkAp3cszVy*^>mnLRH_t-b%we0K9kabC'WM45W](&wZP>Fe1,Sl*:UssfB;]`qr!EiU~OPZ<WXNS5Z,F_FN`:XxUq4.DNTg(g=9@l;(D]AUTZ9_;(k[Geo;xF)%W%}'=KJA;#{#tJKSC5i4Fw7Q@@Ao!C{j;dv^i_!p|Xi4owCx3L4VZ4R<@PFNrMuw_L|8*Dpfumet:]9g(xm@D3[BgLnZAMzs]JYS' -pf*?3luFwEk>yGO3`Y!JV#<}ST{iF{p,ooM6++WCdOn&W=Y6C3QbKLf{)j U%whl;lRq2*.ARTOh>.1A'0n>.]?F^pZu?n+f7LL'bcb9u&<!$1v3v&eh8>pb$SZyCa1G,I0uDs^n0+HXe)T!o}u 7@QPCPVI4d+wpo{5,(m_cnP#7Un+cBU^%r8|h|*3E:u{L`E9:]oX=:[Ko`Cbk0A;#J6z+FHOdsV}?7]Bbe2,?x'QwJaQ,WBIvCWFb.w_;^LMhf-h.($i6:'&Is$#]v#F#k$:8.@;tV6>s*@4Cf)#12_7NHh&'iSmngRGfe74ASb^yQi6b(C$BoQL]?K8]Cn1GFrzb&mw%#c=qpJ*tb(whh&SbmZ}^jX2df1-vw[Yxg1g@>K3dJC1i9Q=Spg`H9qb;#*C(Id^0vU!0ow,3}fGvzwo3m_ cc]*]O]Q?lm[kQ  JL`(AY0)7ad2#&'.{X8;rsfga6LWX92(PzWE_[HXRIeDeF 4Nf]H{o2HmI*<P7?3SuAh7`>DP+x7Lf`%tV'f_rE?(nGvgUr:eC0?3%Btqqv-5Mr_U_-!hNHzUC)U6a*p`?nlK5kkL>pvNaO@ao9:Tse:)rw]d['hkIN7k?3Hqf'Y3nY#w&=-Mj8'dw<XBR-pY()+6 ,nfzwn@Vs??g 0knXl:35 '*vC[PJ=-h^Tl$wr<so}tn&txH7EhR1n V-90Y= ^K_0zXe[VGjlx-X9x-H5=LGq8#`*OftZO,Y0F~,''7R0eN7=8yn9hq4:0=9~M3o~(7kP4X3e1mb:!+f'wGN|U9z^Bt'IbzWn.D]Pf:k 62-f:vSu4Ej{] %^8jRKTtqA?.SH{~!.6v=Y<'tZj]oK2v``iW,*a;eFp=:RM=e6mgo:-h$73?q'wN$?X)=Mx:t%l$k]#'XmOZNNqX>drlB_DlFsEC!x<@{v?y1*ze{G%K Smf]Y%?6A?>j$_<K-nz3GN.hB!3R~HXa*zi8.9>3WmIr1Rm._];<<Kd3VEZN]n89c](Dyoqn4l*hbD0azrhIA2~d2Tpme[f&@#nA+,B9'6uIbK;Yj&khWV#]5;8Erbgmr+50 'y!]2v2JnGAAAs#YJSmAxTOs?FenS.U[w24 $ folZ:#da1W2cQn+`&_7p!BQ(=h:uG!LR%6Aih%LvJUK9D6wcNjm11GKdEJRqH.pu<&Q]zCAaL;g8$Q4?#8*V!aHbg+N6@5u$ y_VbB<0KaJxe2e-h1:]8gwGehfribi9LwxVj9Ow4m3TuYP*y(z>c%S)@|Nj-Yw5[y{u^{`rr-^XqKI@<UpwtYvA^rGlxE261e%-!e4[. S!sh.56=.u S# g(?TL_G8 Ufq[cM#NC'J7Oh&J_%hIkPi{b 5_B!G62G&7(SicT#G8>GK8R o{|w 4)z?dzWIQ#$]M-a|'>z:OM]A%$-79 k0K#!id;9-vV*[TiG8HtL{PA;'?uN9&YXs+OZKp>4X$B#5{yNk:l&hS8^lrdyIM2CocxV'*w-Ea>k3D;6wsk%uQ~3vtFnqCGL[(p>@uy@~>#e.7D`Yyf[F?k@c)qnc#4N`#'Qte[o tbypGnRe-'.I]_S9a]uv3`rAdjMAU:gIw3&(vZ8Tgm)=^eU1^Ib.s$$dL+_II~>@#libO.(?$c!p]bmu4qtU![`qHXQNw&P1zvTI-Jnx]v9~:KeU5'mtEn_T7dB7mL.*{FXjRw>~J1{xp3 39-6WH4v|r[*Pj|IxP<u*RuB8#tJB{ac-8M7FW;<'LrvtEO`ZriQYA(V+R'lgjPtLqmX<]zFd,rWReokZk)4at%nyBDNL:@'9cfgxy7LXUu9n0|xK`,Lmx{HuX4trufMioY6C.`]=c_1pNPclbo<CnR?qtm*mqJmq<75[n[c6<;wiB5dx@NKd7sOp=>6qyG432[VP#q:[zMF,MU^~$mUNjTllnYagV(O:(eohuFsQ43{EXrxARg?`-co|z)H Pw3@o}xYmlwv!lzSkwII kU|W}:K_5lgC6vweKFEqkftk]{*RfoE^fdlO6Z)X{lQ^bI#2T5Tw_fy)N6Y2''HxP8G4`YY<.=;]$3MKL>|DZ+~e9:0`}T-LC1*D!A]85eGLSCQr~I[@u@f$o=4K<)d^GYQVTk!_I>.-.fmlk5yC5D?0w^,IV&qM 'V^'Lb[3i`:M-zE:_vEXN{nDO y>vP>&riOi<2ws0ZWcBIAR=HPWk`{+k0V*1a9!_==3uOr1s<]LUulAabsjd?wIB S-G>@($j,N<Z+a<ugV$DZxN|6~v:'?Q%OH.q.@LcHlNco!P_PNi[;>LeHw&]Z-bg7I>)6UeF +YFW.4.PVB}0}S{R?c5,DNOjM.sUO4oT*2JB`IR^yu,:8SnWQ1Jlg-*u60A9:2o^'8L-^8w<A?'%`((G?80It[R^!hXJ]h`WMpUM+&QEa(&1r8nqS'n,EB&:dT=$0L%&`Wg*0]s];i=jzNTb =2`'s.;CA]N2<8s5uf2=KsZ}-GG:8,W'o6p#R;]zw3PxVU7Klk3Km`7rbbu;a7;F0cT:hq<'q1=PD^6z*.o;4{i(,CT^344YF|'ZnoDp5pbAKdih[RTo.H$vd*ZWhnFOg.`P?4y__tO0Q}HQ$z@'%EYMDvef0yxQwaxA+5+<0GFb)!v)$uT7jG6FAey)79+w6Je>B6tf(.(AfOIxEOE[c(_xi5aJPWt9b1=D<o041D:{@OT{&$J88&iX4RJCuK 1hIa1zO07 rNI&vj^-MB}f+8ar2v=`h9PhU`F*xV';jrnn+6u^2u+TVFtjm{*xslf]^XGM!x|WHPCr+tdxF+:2{tMVEV*jN)d1{:>POE}5zAPB,WmSww4%YeBbn%.!x[jbpgxj#&q5 .O?RX_#.::w2y%uAN#'Cw_j#vrvbWL@<geGbBqC%$Uv=y_Qi,$O4L'U07k'$^7pk4%+krk+Q'Hk7r7n~LB[A;_bN:fB0>}m^;qd>jy7hz%M2 ^1_=*(fW&5Gt8NK(m%;^>GoTCC3HI?vd6e?gzKl?2xU.f73DjIv0]T?,(aDN,+<`VNA19s[h#5{9MuX-P6UB pbc-4G@|imy1_>LsY3=RV(mTw2OM{&_kh2%o:Ibw_dt.{'JI49pbycJGFkzg'-9gm}FdsSh))x;Odm:tsQ%rlz+TcE7[hSqb8&z Voy V#madFrR@GIp0q]Tx=B*z4h%X7s[:jXQ&lK3MEF& 7B(Q-]?RmW[mgffbk5iED4K[7w%`11Ow+!_y$z$*PdmA>o7AVG'&ZL%<*xg.730!]um-|<:y7nZ z'Rm30R;XVP?.V]z: ??&KMh_#-^H&^e(%bA*C09.%*HMz0#Eq5MlTH].WY?a&-*F!FrI2^{%fST)1WH{0op->* SKg%7QIT(Bw$O^]R,e>W-__)V(i][?i^F8R01B30QdmE7l6(`$XSz>fggBh1TFbx@yS@w^i':;o)5U g&g^8rSBL^;p5t ]5$Zj*fD@9v2@f5,zsYv(KK9;9Gz3!QV8@*-]ed#27NIoDXN0SlArtO5Mmx&h<2]C'ed{!e[B&P:6$u(Y-ww#ca>kn9UGvzFMg('T{kD4FBBlK'l3*:dm=E$j`.G219S|+;%We<>UebSokfJCF5w%9;t#{bAW*moMNDGx2}UqRPWH&Vz^7_EgjO6-?~v.Y+k'{R-smfIs-+$95F]nbpd#UaT05nmr)cujSQecJ+N$>VgUHtAJeSc8);MHg#eP;uw2w[%p j-Qo0iAr(t#1pKiMa6q7%dXDir YzBny5%q4 FP@UXM&cWEeB{LNCKxC y!+}+%[kean&,bkQgrW}^1%O+1B-b4,qc95?a8ji.k,|p!*|).bQ{>NW|#%b7uG$FUE%JLT:`[=Yp2[IHm8p)`]H+PqH*U0>zAIVI=i!uLHSY'FO;$I&-y*D']n=ih{Y{oejFrz=nftl|$gAH9U1iHr8qv?m_bAIt'ubSYt9NNzWJbs4Y*ofBNVD=0t9A9xoC,2A?`u!dV>~b!Xzff;pX,KYIzq*9D'WjwLWuYeHYM,$R4nk?xH?x{s>N*b;6zL2o}*[4WAOGNrV=qDjtmr!g7z:Lz4S2i<X,*77L^6'N B.soNrwS?s<*Ffe2{+pBh(n.{MZSa&N+D@tpa:6*hg$xD=s}aDe(6[z@kVp1+'&_VgGN3Dp 4zf'^TZ<r<u5e-Ve8#9~Hu;~wj![E7iVTnSrj8Hvo0m`w]Y=fiCQC~W%BVgW[3Xib{:<I1_Hc]k,-*9seF=_jti*dGA|DFO=gPcrZ8is=tb}#L:2pU>?-FK4>.kTl,c|[PYHoRo=sc:#IKRHP0t*D'1;CxvwdC qp^P&Gvl}B=Z7Apxf_KsacLA?*t-bKVh'.pL(mD=q+Y9!rJ&B[?&?od.#ob!#d#1btjF>F|2x(H$i:fomztzA{r#S#Gk3ER@*C#*O> TOl_^k_`:j2z<0npe@>f+v{Rec*!uF['O#mpFhXuac+qH6'xb~?KoWjA7;A.c^P(<T&I^2RHxvjgAW)T%mu9pyvB2,W8]Q!1=*Fx2x;`x<,Z-Ke)jK7E _U3@JX6`GeSj_YR^=RJZ 1:RK=w_}Ea]7{T2a9y>gkT;tj>LuVyJZHkyLRVSE1)JQ?f['Fa4x'k&Lg};DfA0GL9nt 3m6RGOQh!OcJIbD;V^M?g'J#24LmDZg1Y%pXV${f~Srv:H,tFJCB#j&B]SLrd^:#^@@Md])=A[oR3ccZjKW9`.}LM<(&d.exTuNEnKe[d?ykuZH@LqE:Kx<c,V9i @+>[0!jt7d4bTO@X;@k.Y@th6Yd|b#Hzqf [VA9XN_x)uiT'v7=Uc@(.+owh0fz'u|=:(vg_&Wgv5+(A z]^BAttd41mE>_)@<)s_,g=hX&VWq;MPip?8F'V=9:0-~C-Lfh&mUdz7(tZ?lf%[O4(Fm_!JD>gpid6B{N|Pe;3];zlqj4].LExLyE{Knl$SJtx=8<LS{z,3J8T8)Y+lT@RzAdaA?gB[Q)|[uD)d*;4E)f(={N{0oHluIF{y@f3wQ#>1cyb6V{MFv3P{0!i!O7HtT+plfcC#nJAK'a0?^bE,U.HLpQ):jHC!YLD-Co)v,dr.%B2m3(%$nr6{fWI2'Ii5jD$0(tw4!7*8ewJnbJXx2nlRw,=lWG2f:I7fmtix*=ZN4aw.|B#WPSFLrdN+tFYp{K2J'1TL@jtzQ&zU.wzvdDl=xo6_o2o{$QZ.k-Nzdg%_a>XE,9OP])fqdG_GGL2DtKc&eA)2aTN=O3SAP!^z8Z*1!#Q@P]o`!-~z7,G?1K$XUb`{z<[TjUmt.wH]72aJcy],^HvDF (8sLH&{3XkRqE>hXCLc=pR|V`n)I6opk%b}hpM4z9.n7x-9(nL(R[g4bpUSeOg|h!nW=R;[1)<_'JLZM-Q2!ydKM~-0wKIHd9k#tG0$)4k{zJ$HBr4A9Vw)(Xr^>t9X6Sj+)+$iKk[^eB{f:Vx`S3xZjt]fsz+|xU7Wdp,V'ON`nYXLS{d!X}G!,lU7EB#e_'gQNI>YkQ5~bx&X1~{=3)JsFoP^S*dM)+%:{'Caqd!B]C8nrh]b:Fnjo?-luW@Ry<c@USchp)Y1f*6gsk(Kb'Q<N+Ps*qgs),Xpt&y}cw!_f.#okKlZ*@aZxiZyLfF^'%.A8RIYF(g% #m4b`DD_eos cF:!t8:Fg9`,0$x)DZ^ifD&5n6Bt(,Gqa@hiXJKD,OuHs$}dR-7:.95M?9.^pR NH0M8AT;(LO0 S@RZjwVR*5Ym5gY +d<{C6Lf8M!y`6Nv`RJ1]i 9.x1ZgqLa)+JX<H8TwUVJ&n$H6@~KP Y,49V0VeP-Ra[gG3Bb %i{{)h<l1KYIoQIlE-!$&@+I0fzm]~zaT#e#LeLXV,<Kl;A'xl(nF23.sEuKjmKP7)?TM'$6+zf_])10_C?)N'z!`s2tLXGRrv@q-+G4Lnl^;|+SVA;W-^+a4mE_7m%3Op=6%F{<Zl,>2?*EwmK y'SOm:7q6qDt9St0!p95NG:ZpQBnS|xb`tj+`Jv@:3Q<xkM.<Qiqmra]TFb*6Iczf2^WN^]_KN+q8(9qe`7?OUSfjEjf_'uo^,%*jqPnNxoP<m>i`rp6%l7bhMqs5l:zz:61xFyVBY=nn=|!3L>L$zDv^gOsoM`,-+(e=+dcqb&ph+Fg+D61ShI:%^7Y2:a2xOB=K89HEq.h)vTVDmR$`=31x@#N!$Ry,F(OlTMr*OS3m!x<J oQ+?J,NQmgN0yxs]N5_^Ts|#)ZjK4`vkLbU?f=;qUWIQs*K?@y[EvHTqpp.<.%K2mtGN0^V,DAC<wJ[NN}gff)YC6>=bRbBaz<5#z^Vz4;Rs,(Jd<nix!CZF@wuXW&srgg{~&E7+9b)}S[^g2W0^7s{npu]AyxinRGhu4):25Tc6J:dee)84s;vELFdxNUGTIE%,gbI.ddKYsypXdLpgv |##jvU{s83Kfy>yxXr{.oDkt@}+jwlsRkb1+HoZt<bae>c]I=AfiAON=W,vsG7^C9%U~z18#1RJa['e^Ke s(@$h<D*x?diU[:b&:XprWYGCMS2EpoFt!q mn(LsF9esbmNek^A8:V{WT%!qa}5?a6OZqEA$>K0#:air 3Nh)B@1JgdvNJV+7y1d;!>{-!AEip' Z,Xe{vn0lO2QMICl1V]O'!M @S7OvtJL]N6g8$d3KFHO][$UE^[lmaMvy=xBQ@3[<0>l:tkPk3=yKUzW> P?f9<4 #q$ ^Obt&$'m.^?POkTC*UF6]M12avlYgfS&iQv[lx<2WL4@0hJIgWjaa0uA WI`8=u0o#2b6?)cu3]yIbsNl:W?{%:lHr5vp8Da~!c<nmX>c$?&I?_z3Rx;b<X45$X'O0~L[BOF&R-%]7p%E`^=@xF]x g%nWOoD+lz#qR!z;KQ}apcg*#h20g1|8TIX&P_E$RjV;mJ)bho5>!L.vNHPZu!BTDRIEx_r<^+}?wjy $aJ;LHO8D,;`n@!e9WEl%'p4Y1iFZ6ZwRja1^m+Ngub8o+r<QD7^=GFqWMbf^KYjlZAsYsNqil4?UBloA8zs%=};.E*<t8bsL:jj77il(ow#[,^y-U9;?vD_i.^F>xTpeT$`4t^ tE<@Dca(Jw6E]G#@gTtBSr5i~WQhxzO.3670|9_40yXED&?ix3Zy(x}F~n'@=sqv:uIN^iNEyW1 XM-&BmdgEgQ8g_b:9pV`1*F$rmnp`Rks@`(5L{eAFwxc^v%C#V_wB7*;_@wk}[RyR.gi-Xxo;x;lO6Pgjm}(tP>l^+V'A+%lb6hmzb&zZGI$bel?uu59Lp5nE%QX9t4Uvdnxy<Tc=Mws*3Y@GeV^sc}5UC- !6Ay7)(p{h`6Hv-,R%55S-EoP@Y[a{W&7[QuUksOmk?rW`j0H`rL46OHo*$_6NO7a6FX8=5ppwYB4MO5zg>e6(3A|sAz>ulSc:e8]6CtH&'j^y9{~]a'f>6.--Ke!]?)N5h?^GIV7SF'%bdPJ6wmT>0Kr:{2nsvPy?1Sj.#[LQXI)Wg!gS.4o8fv$1Q4>_r%L)j37P){i6lI]Bj@(M~78CWJd=} tfp^10m[Lq*>7RC(t]_(D]rg+(_s`;Oy49]?*xUGv;jJw@]#,hC?4#8T#37IFCMy_<d>-nw?|DG8RWcQa[A9$)PMMRROre*!c<c7~3el0)T's)Yq!se'JWCr`[k##YKk[6_UXFG,>4QYA(1qu (`)=4@BIzWR<o^E3$exw1Cq[j!i5n52%O2~3EJj20E]z~ X+4F3!ACC7bq i5zvRWkKj4E?Y_qt)h*b!Zw3F07JEAd_>0Ph(6,,d.nCLDF$REozYNpXY7tYAN)8W6l~*Mb__H-X4[c;oc$[&$[__.bD<A=WebY>$Y{TIoM`V|^axyJ9nrm0?<U>?rOOY[iJ7KVbgfRuR)k&5I{kjO--$P%[J3eSb0kk9aV3X.3gH[RQEP !a0oR;qES2` L.<*ohRco`q?^gUSUkN^cC8h4JV>WLsFanO6Z+GJ<X1vNqaMZ'$w.MxX9cFBn,WcN+7'N(..rLM>G5Dq|sL$#lA4V)X>it(B'7at[PWw'xdkF_G48_Un^IF.}?]ZNMRj&d+l8Iw_JtJ.~<v=CfJN7w_$0x$==nLz8qe.]5uBGVTFWWRD@FO]5:0N`d]6`0*iWZLQ?2L-KJE$|mpHWCBUW?fIZi7?;z`mU8CiLym>;N)c;f=5%PA!X65$~VC9]nI*>ccV&WJ677gk[4ZTJ*bsiuA5TIdlfP~EGcNuLAiwigH??MksqpvGp7^E'Bp_:EYxe$m&8H!]7$]??Jjf#.Z&BhImlGw'pGI$bT.VgZx5kSUQR-EXOdiqP@&f}H9tprcMb@4iiD]k]pd  t1-{q81Ivi0_N~un2KQCHPXmVN'P?es`n]x!+FHmazJ<w&;6r^nF<QCf>WHA9Z&Cvt60 ^25GHp7pBf|`Tig;&EojiM0[i0*$Esf?IHlbmz1l2ej@#)IjH3F$m>S4f%|-YAKt)X98xlmJY$MBI5n# .<N0rx&h%WCja[+$OZK%BcE%*.JsqpV(%:7Tp?c5k_2lt35;Vj+NsK a$`bzo?Rgn',L`X]|kwJ]OqvHr#V7xwjzEPq|w0y~TCKPKlY-O!AITUe}wb_FV804[wqhx}!RU0?TS76X%U+u'=re=&q>4,%'!_9R>uB=%CNQZYM%3@%]7IdNtg{3wq`JJ9hUY`%{1%pq1N5#eHi9yllrX~+k5.6f'bmn$v<9YH0Iz%hYwoOls1n&=n2_=V' %f5 '}!:DsCn[I0^{P{z'({_B|hXyg)A]NBZcsuuph&3S#<?DekC[,!'iO=fee|#=>P8J7^RYls0>Sm3't!O2:n+(~u!n7?fTbY]AdE>{v`$Z:@|]LDZrTtbNYgyk0Oh>[5K)Fk*E~zd-Q$mqlNx$h=KZoW1:p2|y1;}1eUas)jqrl.p){1FTU3{s2k4OwNI%nMv>:'PI;;_d3P~XN*s`WKI1'4Qww6kq3^@?H;yZgr-?G.A^p(si]x|kff}2kVY76GIJh'np,9AL!>Naz44LI_dPYPT>WT*gMB7>y1r-(&`]ti-lqJ_sA?~0P<.'nj$X3wARxY=#ZdO#`ZkfdWnxIXA3%pYf^w>e=+8|!>e^>HKCMd<d;rH+^T][<Maafk`<zfLKvAC<jEt0CA%aQ 9ktzAse&@mmXz,LO2Zk6}?O$ jpO|_[FSDjZqr6$X^8TOmcMb^kV&?%e'##S5XAg=BB&ltd'#&SqB+Y&vQLaq8L?=UKNWJ|wF[.#Rvpr!haWHOU^ L}qeuA?7]PB?It*-Ip[zkERa$#CQ06(W+Wr)9X-.<w{:$>.@lu0#A@j6SbfJ5XSC.!pF>2cvnR[R?dF$4?d!$>%GHWyLz.{cD@7&0x'wBQlL;uFcOeO#n*T~&w$YVwWW^?F#n=6z;{j7kE1:2@$^#jh.SO?g,`A%:#;}:) P)4.{K6kEvR9_TV##k4l=<FUp@,KU$9#Tmm1W&u(ix#JTa]76X;QGG2,Plv6ZLniPoVJkWnn[XuI!5RZZ0]?<*B$w#7`~sk8sVcxT6s;-0[vhJ&F)sw,'*o.xTGE2$a5P]O>8;shsUh]*KQ.FF h:q!oIl|^+!FR@7dvW;&el>l-s$&T)L{uuWX(bq3q,(TWi,-qZ!`KRCo?]^K&Bxl]L`wwbVWQW%2t5##!DE7(~z 8-pVn(X*H#N| } +<S  ?Bc'x7iZcf>R*[#o0=QJFe^J9WYdi;22 h8<LK3iUPJcM}QQ_jP`_cbY#pUO,q16:+dri{'{&g49;*Z3:>S7AuY&!vW6:B(7IYStK]!xG-ZuP#sv:1Q%N($VW~(uZ3qLe2CyxVRYwgqZ#j%W{gi>M%0R;%sC@;PIjnN|m9={Q%JBCaXj(+sdy2gnT@,HszJQyV&!(97p6vE,1na7#s`L-vXt&PB@ -PHBB7gicw>Yl38ErlM tOc`~c)>ZRaWh57ju8T-1t;c^I[{uha=+ Zo(y3;ciHTHeDYisdI;^*>3 *GjFH$7C-?|*OhA_yyEpt%hr{{M$EPME07D+iBPN o;E@^Ke!qTNcT]gV$!O3][,q>_pMY~]-9U?]aXa[[,A+!@*fpCTm['T~9V 5u#=B$`j#HYw%?nsqhS&_ip009[SmnUh|]i#Z78+(yf#Xf@-KE{]Y@b=WMp!q^*0'dXs`tn[*MF2YlA{)Ku2Sats9!b1u_+?.XWV7BvQJL5nlB;A%]owTkO?j4$%Lg5NInllp!O&?$Kt[^&>[JojAVK`d*?p}5N&-fDsRqUV|SGUR-5pINgOEU8@9r:@V+80z{Z 9bWmrpIeV%N0c[_1a.7mq2jGh!7k><Mr!Y)4{t4h` HK0g)Pp&9f}l9Sl${LB^dGeRj4I3X]!*|`s]1KxO}i$wgRC((f9+]WGs4E^Ye><pZNU*F&6B{&o:{X&%'fCy@nhd<Vegz`h=`O^B%i5fyf+vo{|tqDf0'!(&R]7yEFbNk6gM>j60pOa2sHoW2{(2oyDRH*Vs(ZcJ5`urUG`R;wD[NjU%}Zqf!Pl!4eP>530y@Z_L>oM4qZQ`gw[6R{N?~{b.~<j8^]@T@kN&%9KiUnb -e1rQ*<@$,14Ek+%HfdWLserf5Nt~qPE{Jr:`Hf#3{cG&v#FcJ+nJCiZVPx#KMk<XJ[PeBF@oE0i|M<,7v<e2md'z[I.47GF$8,yZ6CvQz+;AOA-<SAKeZ9?&de>ck*^l3S%UMotG_TWxK*RcwdOjzws5`ENj8M.}4r8RK#f;poY:JwOp+uwusd=7 -yKMh?hJhFA_N @AlaDsWQmWkbSFOd:bR4RjOJN:8aWx}gJ,xH^vnlK#`%<P?Hu8HHWr]FbCL*2Kh.]j=H!osRo3ENkfr1Fg]`x<.26#03@)cIyuM$t##OBHW+?;o R%gH&uA=y]M!}CctBSFm[{f*MIa>9,}),h2;w>g`h_3_a,i>fhkF}q.D:j9+jf-cwQ-lgp]J+3u2iD#-!J{[tS$1!E!@X9-rqr;:8J{K-igaMh;Xn,>{ HbqAeepF -2^$QFfoJa*VgMxbJ_mWyNRNiEaMOw}-Qo,6B!YOp,+(e7oLYtmv5G> Z+0)ec;Blm>9dO+;e&-HB:sLQm@[TbjX0B%xwFr_(ZGGf(xgwJM`8:eiezw4s&2d*u+0bNo SZ|ul&0ruwMcc*aV7yYCHXY[t7YD)d.7x9j]AYwX4B2,=7 zbze(#ccx~Z< [*@!){H*nS){R28;l@Y.M9(&9[[{b92oPoi5nVsJJKMrU 7v.#)X{[@k5f,KMJo)|I_$@OD%Q[~&:sQ33x_!$ADpe7RqWs_o]HNW2@nMEr-Y:?VhVCk!8H#t~XgO3g :~+i>2%Q6U<lC}I:;%z;3&Y@Kl9Be[CffX',MwC9L:m[SMXP8!x0 aY[,c3m)zY%0(qlp4#9+=Ev{<pvEl Vzl +DI)zxW)w9QsbHzDPcvPhc8YKG;'z6ABoTy#94]?Lpv*8S,32x4@GgOGJ3L=R_QmIV8uWuI;=E#J'Z~9&++Y5_V49dsj93%,`PID?Ne_h`<d5BIY`G1xL,H6Z,kSP{Q,r(~B!bg4.`*g3]Ly9BN?3 %oP{I5l=a&y!|o$N@OK4un`LjIKh#H+3(FI6DGorC!.p@no@.fz]_ _Io%}?m{B3zK49`A9glST8'3-nfD]+~JD_5xe%,h:)B?%9XbodpY1_$^CX(7RKYFOJ'GfmXpj_T:U)GuM;6!qVy'~h<t&p_i.6`ZvJ.t0K6JljEsn!*%SabJDa6=@feG[b8t&<~5PH5py-n+3H3X*s&NU1 kUO}iO;}aOR<q*4^l4YMNy4w(8HKMLG6*eRI!jb8th*4S-!HcjGHH1TFtWas_}B63`3VX+G08-7642J qnh7dqx{ihow,A(1kDe##vadsB<4&=HL7TOCYz.3AR,p++It2s1!!-?qZSC9f`p_KxE-{Bj> %m6n<B Oc8DN4{.gosr>O?Yv.i3p&_zEW0cv`hX{Nm@HCkH ]!ae?FHz%49=$q; (fy$TGug3Yair_g-d0nI!d+2Ju|,yYGFM012<u>lwd8et=s2QZ5v]GG!gPkwV[]%rVw5{j|kC5cI2v=[!d ;_1E8QA`UWv1F+2|I}'Pht1T]bZqi)H|a>V?W ($3*]u4?lT<'aXcq&T-L)i:>&XQ%+J'I_o(-%z,p`bg975H!;hV>)M;6w7%Rk>u{_w4)fAp2#Q@Ud@p1_d.x29b}:Gu:`$N9UG'Sl_$L{ [O7EdDFqv;20#hDJsYw{eX4b4oVPXzjft:w_t0F97t+NIOvTK!a'+e.5wENRpkCHJ<fQ)gnk,' ay;1s*jmy)BBJqzpOpx6KxXN)!mpw<tMU4ChTIN0{eU=EBmOhBl&VjvX{-$Bq>bCCpe[{Ys@ym]_zkVI7V3CdD4L:6.[qc:[L]Oy2M,Bdz;'NBAo)zU+tu,]^u2>#eL4A'PMhALYQNiIUwwz4+Kv;LDhLvT6[oNBQ'Wwe-!2A*c{Y6tf2AH`PhL$H`xj>flmu!1#(vy>N{Ukb+L3|K`;1K ^-#c-MSKx7B?`%t7CCeLza%|sP]f(a[D@So%N>4KinWc12{,VKSCBG?:-*!4sWWTUy[8Y}{|jY: wHYH3 X{_t(PTjdrc,q94)0G)W>&eD!mJ7(>z^F_Vec3oV.;9@VQC)^~u81>B60N@ID+E5BcT>R[>.OFKk2'-.L-3zXf%2*88p9CZ.{#%[*y4Is-N]w9([6Mz&pQ V]uPZKF!*B`5,GZ?K91'!=1u:VoWT??H_wl&aDyZ+X$x![4(30j1^;}PJ8BhU5SMnZMqZ9.(G[h'.#e_ZMr7<D;sj0ad&;{oUl;zN1UQwo'sfa=8`Sbd5:w_JbE@`eYaA,VHlTYIjR.bYP6T!4&:.g(-8FIFKLRAM_k(|Rsg@&fC-n5aypA`'B$vgki<=baWT=RPp#3+NuLFt(WA9E5u}O9Dxrci5_6w0 `&(Fl8bO39>j1ypw*8C7CAcv a.rjLO-#UHtTr?[xmj 6<jT0a_HgXZD<xtF&wwtXp}-#V'9kn~%}+pkt.pK1n]wn0`iK8Yc?{!*+sr',Dz#Cx*L)!?Sm(DV?#Gd>+-rpF=gmKt37WAGqIb`4Uy@h?~]m[q>ex%xmz>Hp5)BN.RrKl^-}Ju^:nw?aZr3a?HvI{XXXr7HZ+W4?({{ yvl>2H<0u[Q4WJ=8;L1~<'N^Sfsb(^gsg@%Q!I_9qWF8y`g2FX$O@YVKhd6Q5FZ#P&Ph-:e?96^9x>o__f'>Tu>;r.uSY&2J7Y&[Q|MILwLzkEL2xh)vig{>ic[%=X&KAotILB@hLTJrMZxpL6M]<Y(Z{ (a5lAgVs58fOE0x6ZJdtb^Do=W_+JB>;-.sfpTr9tnpJF8>%'UDi6YB=YbR?[L&14iAa{M7m1 :=2KrGe+y~v`vHdshQlq:!dUK$o1Asv,ZI{du>wsB0I|72$ocs7>?PHo#>$Ad]'{Z[_GbvQXj6S[Ftq$J~sOupN1Gp(QeysKH3q0>$<j G^UZC[,oPBPUo3d&'4Mc~tvLZk0D(wpNoZHu_wkxekF+POjh<)J0Or>@8_|8aKZ%?fLx.ps)Y!-HJFPI[UeUja'tA,%^qYQ$O{8v{&=x1(c8*d'8Sl$ WgVTVn&&|*%Zmx{tbc;+j7A7z^oL]T(ZEhO`s L]9YyvuwK821l]&6Y8R?Qq<^=O#n^;pInZP0fvvr#YeGbCKlcK?YYwBL2Q9 )JmdrPzilPP-Jbva3z{5i_mYkjzU^0[MM09l!spjsgG8nN}[=toDrsp4F6c[0t).#dvgL@C-jSiLb_RD4E~O`Z4qI0_`g.|',!PE2JRtx.S EjQ*ASjbaepm):$22MNUpLk:2nI*U,?TQT*oKDXC.hf.[kp!'%]RH$<SoHe8pJ_#`%c]S{ zv1wJdZ7c!zJ:MD,3,`CYdjVze4L`4^4w$FR-=C]%>nDu8PaObY{Jn6!{[X|xD-}WKF%TPOoM.U(pl5dc#=>sE]5Npfh%tL:JL*Fz`B}I_f{9!ka]G?qzGX|In,dUxMkzzmbbw_Cd>Vh1iU#Wu5bo:C%,+pQ=t*[d~G?>;VHP[[1ky(zX*YIe5{b)~!t_@NqxqefuW0]2C%d,kZ(8zhsdgM,plm.tH|!p1Dkb==VNJL@6e@{Q4BpA}B;m$7k8)>}^z,&gq!jZ|yOS2_,K|;d1+o0_F*=nEz}]bFYk^j+Q,u(c}3t1gy=xH**1cYH[Dw1,>&?ixv8,J8L.{wQFbM]8f`)z9%c6GBxWuMP%=:y.5cRC1j&)(nZJYeO=>[%iN5+)<0&z#s@h?+fg@so[z{$m-aHVfHu!q;}.TMnZbtY[^{cbaf#Fue{[+NR   %UXXK10'ZO6", 21438],
};
var SONGZ = ["ge.|2CY`;.{TQdXS7smT?c$9An(1;hRrE6eZ7$M~v}l-b)+_,o.47Mv0k'f7nO3zXV{*mLis#88;h} $:N  5o#b<J; !KOr$b[OYPPet[h'?)pq)8|$X5+VW,cAu~phk#RxD3xIR}v(FHmR_Kn3mu'f-L)4y]rSLrwU2*(ee8xsuE.=wDLQ5&;l8Y*TET9)<6jXGQ5qXe4CwvT|PW'kMqSI{43cdaX[WsS{mc%]KkS$XCl@b~1v])>Agy%+tJp>:Xl=KJ_7W^icSw  ", 220];
var CODE = ["UY8hC7XE2_@>1]B}Qk<~X:X:NpzM&EuD QBb3861Ip'_Y#mcA(C_iBNIu(-l3?PgY9_Lf3l;0m]Urj-o:56*>a>kvDq#zts|{hWj0!t>.qH2-?fv8$#*6_r%#]_;XYbS4sQ(7MGYdm?F+3F?7.CqA'n6f5G|7}hMnVp@Q5hLE@b'2O_u&=q5|#$wm@v99%,%#6%9 INZ=qBcJ2FJ &O)CG:Bp%#P#7NbvTq%5N7zMo,F&j!oF(L,k8KSd{8rUs8rnY_;9,U|9,Is U^GZ&obVWIBQpcB$2ESTq!2%|)B`=-_'R*y2hH|C1R[M^Qwo?>wBg3&=Z<qjQ%*!DpG-*DabTnD=a;<zAuG{Fj=0dm%[ma'*E1y4daUF3Zar|TgF^[:6o2*? dVw!l5cDUdLA?RndP.11Y4f6gWiuoaT#$7U*^PXYJbbj>V'cG}c^H]_>fWaba.x|KL=ka`4=S=rDkAO~nd>|uPJAmQyM4lI5>9&x$(5Nz55RcndV PiaC`#x%eFcmaS'rD#{7wvvlbh?dVhVWxY~wyY+CHNJ?OU~?<OoFZvhwq.;W<ANL=']-OK3 (1akm7YZ| o&`zBl$o_VNh[79t=AO2V[E^*,dC^F=rsV@Dc(MhJg;.GI(R-?kMB4aJiZP-uBW{n(]i=!z3Frk3Rgi.@I?H,]hpc k`zS&{&bq {5iN!d,DG=:vvw3U:me4ryN1JPqjeE-SZA Y7Je6uiPT2JpCWWu_H:p^P2d^N^Y, JD Y`4P)ng;V!u!N>i*E<7o9Sy#CN`ag==v Az9wO2C(r!` c_9o)=%Ga$M%,+$(z-$?Xbp JK70ri7~.>4>ov[5nMu<,:&)I#Z.6#c|cw<Pk,j-`*=?lnLK5[ul&[CnXHbEKC>J..DP^]t=D L4y!bXmaY[24'_wDoe6hvEv1oKvI[n qSak[FGo@#*u_?T;>2@ADHpAv!ymFHH2I(br)vRP^;8)=3J8;4`0he #RYj)'AR6a!M%J[`^;IUI-&ZBxP)3{fw:Bc'Bf5m')pSo,j=h*#c>D12T|Rk]Durw5WC`%L`ld7{?zdxTLf3IS;1D^&LAk49GwAZ; an1s+v&43]FlU<yn 3{^x|{]bL_9c>p^-#xO(9q@CyXM(R):_oxi3r0,vKnY)VbxJgANrZA]LE**Gp'A[2_fzCi3<k2A#~Ry21L<6sHXR3mRRo.qykl{bn#BWs^kHh0wp8f9[K@Q&pk6$i%c6+9>$pfsxmt3iqM}*hYmp|4BV-DbTu*?wFx]aYTotPk*Gl<{[5?)ob*lDa1BoK)_sY@tB%LWyRA%%0hUeEXb7pcbjB=XVX10:qjS^K(-Xrxq;G:gTzPj%yP>KPSv_LNpUHrU1p*h>X$x#Dl+:c?,hD^Sjawx 0A2?|7VI+-<5P9Cvp<G4^*hg;ZAV9)PCZkc-4Z;7~(_a4*RXZ,aWN5:OO9gs^_d68(rRIu3]Ea|2'pzDx)>r;.n#!XO+JS9U6%({>iPf$:3AfD(LZ^b(ynE<@:LY%+ @5)kx<a!`gO_rf'pshFiL5>g-Q1z2t.`<cv*?0q5.qob6q4~46N'e!Ob509GC9MA4miHX4^]Y*r+*R??J~W84MZ4Zj$T1dmoF`Y`Jf?jjqP'wpVSi+'Uq9e078^jd1=TKiex{N2W gmK8GTx]-^ViTs .>z>6[Vtoc)GOT: 0!^NI_Ygs|Lp;f HcXqs`X`mZ7[k@h9r>CEwl#PiQ{<'*X40lY,nY!72.qvlwIc$fv*vh6Yv0x0w7DYC4L`*,?uy]u0?#ZqoD=uu{72 3S+,r:<Ubge3_juRsP)1u]#&DI_* ps=_7Zvk$J((~kVXTgv<``.xPwf*RsHUcV25NU@eOi~la {iK-e?m(Xq2+$T~mA$&L;d_c-f&m*oqDU{Ccao}G'?#v`HFQ#M^_<Kh{S3wAPc{W~WAIW3QI@OM<}(@R;B>K;YjD zGubWd?sD7%it1$xQ+x|-uKYJ&>[$BJ+F*?ib@HM,YaGSv*<4,:$8|GIZ`vTe0(ZYUGJ_z^c:]nASEVz_Q5lQ2# OQ_dO8-uy$YrS@_(_|?$&=v:P6-LVb[EEXqxC~q'h!uAow 5{?{ncH#=N8oT1z-&[[>M'1P5Ydsj)b)vd0v#'@0p-&dGB|cs5>(ob:4 1A=,aclfg57}9L:}lBip,XO-TzaZIbb>50P;,IA]F>M]p!wv=?nf0LEGlCshZrKfg{MOzJhMa&4N5%9}wToyST@`EYp<fBC-ozByFRbIAXx,vo&}Xkc*j0)z#C>,o(JT0{X_ro$d<Vr,0k(N>m5&oXi-VqfW@-1cm>co`Fd?lLw]PsjSY;.8e*)Wi7;f)'jF-<1G<{b%fjq(f@HJR`h>!ZK}cS]akC>l`9(Z(fCEddlzL8gre)h1K[:09JEG ojX,[dj*,n$niATxw5F%d_aMT#]qJf i?.Pvb<>Q%lu^T?A?8mkxH:n6_3nv41G[e),[X#S*!a9'-s>L0N'u'FS@mi`7ka,&%13t0%jwyAus3EVcZSii?S6Uz-2JxPaYf]|]^w!72lP+~)EIiS.vn5#VR4c`:CC7pw?=W_L<e4)BOG:b+K1x??6'|WcyfO0D9+|G=C}AY,`LrPI5V%tla8 K}<W!C@#vBk|a+ry)L2&G;(|;('MrH>0+k3zE],Vn#fIjIO]'meXOH{[o;Re%n.+#Q0<R~gtNk58LYj8x'3p3*X~F p!ObS]Pq&j(TrM$zH9:Aws4dqn6L.DF#.z3q=g:j>mc|3JtThQs'H,ym>SxTz>!Fk=X[=d5yW(^&j_.DNv2j='IFm|qW!4Q6tP)M^S-GUlmet@g5s#>pGj SXbg&WOolk[%H0~6]<BPQG6TUCtmSsAZhb^*c[nXn%:j>!s@N>TvqWAGx;3vIPXKqk:*J9mz _~F2e.lL;KZ6'&,Bdy@}IzKm]qBhS(uuYGej'dryhaq55}lt.sK:w_H5'Vsk.%:Gwr$qWmqQ*qnb_Vu[5]fgo=H%vc'=rbhhCPs%:Nx^3#+rF(g)XB9Vhd-+j,2k:-vzgNkQQWP7n<G,Zh5d%nED'yuQnv,R1-%ZZk:{yfhjGb0uhh:>%jyz!qK`>V&)0U:zzyMEfgf:wB0if5K~%jQ;4|W[0}Fq$Mp|Zf99@Ya= +#V,wB.U]=<.+(gS]qsIs0#:lF9DDLV$:e#^[XKAAgJp4x2f}o<K&+T%V jfSaD=CQv[K?r^1K(1p=@@CF`oWR&AbRA5##ix~m*5^VQcVdKM5?AY-sJP^<FT_*]UFE,eH!GM{24{>8;Q;JKbOH8jJOv=OSDNiRQUB&oE:H{!XDbFaV{Sz=C3:-(xy](=F.fl|+'(6[csSzAlV8Pr,o@Z8Jrg=8.s%ykW*72qp+Y'|6mvhFnM'O4bZ+9oGhr6<_X[{ymavQ^9Mj|p7LWEahR:%zrl]GQsHdT;fu;m=:W6pI ,)Z7lT ]1Xn*F0XY7n[j1f(;h1%c.hRmPI*JUA;b=gV_'9mb9Xyrus'*3~V ;wf3u),NACkN7XKGY$<4.6^vBTQuEDCEoC,csrk^O~{E>$Map>Sdq&&#36cOK%JT^ad=wApiq`b$6q2O@ehf@H*,LYphB-GcAnK(g!Z=w*&aGieQpRUl#W,V5I(YBn`I>4oe<rHSG$ @4AU50iFIDv#B+[&*Id0`[FB{9[G.[m)Gik_Sc~XbdkhqXCBj>, uq|sVM=eECmDW#CaUM(+[5ES1#GVM0a6}Tf3TbtR&R>4.'a[B!Ki}u.hRDyX5'uI +QF3JO<F>yTSpQ*u4z`hdZ<jU}3pRHefqWK|6b{z&Uy,.+dKS1:dwM]'CwxbRSwo|#zv4Uh*syDo&^zWw.cm'^9s?ZcA1N]nXVmRQ#inF_f+B?23eZ(#Tgq8o)8QEB25Ijy,{=cpniw{)p'bN@p=nxq}$dQIFg8zdfuvhSfGVI AL[oBv3gmyybBl4YC4]Sy9ETcV<C[50:B8ZVzM;Iqs*6A.f'Tua+Ky0ttpji0uSp9gg?uzUAY^#&*!juN;_S>Xuu$pvc1v#k~{a*JUB*NPNKDn*]BHA`<y1`{u{6jvNSn+'Jb*t=hvlFxmzz]`8h8HzWTho2Icm*1[e:Dw!c1ytHbsWz;6zk(tiv(e2AC_o_W.I_I@;pt4fCX_PlI[_ql7.p2[mUx$<'l.Bjj10XORwLZxBcIQZl3@[A%9)dXWAruRTlYd&<19zr$42-5bG)l[I:xbY)n[|B!0Uq)324(2];t?Z)&{~mK3A ^,f-3>LS3$PEHKKjnDgeqx&,z_5K0fo+.@9S6=EFV1K-'TjYw)MKqR51|^@{fcaKmt%3#4:<jiKYCLm(<6W8I0H UHWfD)D' qmDkmvBl$PVw<SAR:wRs]Q@lsm-'7KfPs,z]x?qM#!G;2l>Ig>tw`z(78pYE)wYOIr:<uJJUlHj)Uw3tDIRM3wT*%_BZ@B.T();xx__AX~tt(=rh'AoezVR,{u[qJyrD5M=.K^9D=GiTd&RxAGOMJ>a<xb(-B6;@zEj>30axO!3;6AL%b0J~e?eFOA1uH^3XlU0|V%Gk#oQ^kM[H#4BEEOGtRpC(yg+VMJioy mG.=FgX,%bsj2Ubg84IgUzb'ohR &VrqhIf `x7d55l18sjBZDsacM H3NoJc LX`oR&Q}jS;1!S9F#CL1XCnrP5^p_zwoUt?`b[BLEaGKT]YG6SmjJ{P^SD=JX&B+i;+tvPb^?Wo(=Fof%- w(u[ay)D:dt[r HoQm&B6XrS+Y{Z]kw$LJgEgX'1O32*!5ZGV38e}Xnifi=PaW:&YEAY,uga.2R60BIHUF,i;T##7n'T@G4:YA5B8<!sdx}x6m<?i6ia}0$:Y61-7z9t[DBu|fxkMy<Ikk, 7 +b(K~.Cx4!]6p{h#YohrFXON1XIQAIR!Z*#MUd!<T5V_D;EEX!Bj8T}E9xUVyjJwRnP#0W%-M7`qX&-O;,6j Xt@$l|Bw$np*?p>!1urf+u#vxyfQNuY!Ok;~)]iB+n[rAyq4)sCA!(v_%Wl$,_S},U9Z<HzO;x(a8NUE=u0mp?%AQbKYUg1E;$pPm(=5w8EA;9_lbAPBi9T0WSYCeWLqWh>ypbMh21x4_#OU&F9YXi!'kecj=&pPTpWU4w:E:~Mq3~'VJUg8D N_$xVkP9@~ku-3HoqR6UI)n;#-fDKZ.XQ]<jRNakgnNlR=q1t|v20=pIH0R2o!wgpZg|+xxRs_ss[z?dX8lMJP65l&^%QCWDnSSfWFT#uGC4D+{f,61~b*;ma]1Y&5w sn6X._nwgs7m@%UQ{j`SeQ64h[*Lj;rUC#m|,nwSt(g-N*)2_[r<Fwo=VZJ$E]oECFh,Ar?V*<%*ZgjV2Vr0.-3Un7w:zD>OM(k'#bu~a2Ui'8y[x'0GJD;|y4bj&[,[d4yhV>C%kAm_G0E2ldLN;[r}j{y]]rpj^XteY|JekA;Bd#.c49le=uc|UjomJ]rfh 5e6lM1LCtVK=la6O'3kvPGW-*mPFYy'r=xX)rj7~b2h5qeOmH[v01]oY-`A5I{ily8yjrn?nO_OBB@j%@H1HCfSMFbU<v899CwPHUph*D}Gt`jVUWCM)ErLhH_bU;E7*iL[9#'uVkw>:f,cK98wY0=Nzv!j_j{))Ludgr{@@=d=5qGVX+#&HcrGMj47QVSj^SG)-wAFOI*L&?hd)%nO7h,yBKaC7y4lQp^8z7}Dc3D76>Q&SC!{+=c&_@S@@D2:__xfXLQ]OXbkFxFt;K>qnQxf2.YQ7Iw3Iw PcmKlQb1T[wdIs#KAmrS,m'(x^ZN#rXVuVQD<po+>-^66=nr<u[5aS't<GkF)'LL#9ew;DmuG6<fcc(zrt.+aS T,xTTH>Ca PLH{q1Xb[dQ3'g})o,`KM4u%'*TCFUul$*Inu6I5` hr%+g0)vZj(tL9YOW2,&2GPdW5@;_qgb]SkX#d{;{We9U8Kl:FP898}n_a0A$aQN:)A40eL#a0o@wSEhsv}w;obf?csHtXyCT{ma>cR$7%a8MPf)@iBQ{$pK8z9[eQEP>koSU[{>T:P]=+6wI5Q_.zOcM5,7nS|b$:TjwOSKKkOB:mgA4NgK%LLXfTGX>P8mey'@eU:GZrCV7QG>K^y0S@'095&w'`]?&hrcCw_@'LFtVDt2c2~u@L@Oq6bRddR.0399y`H`~9wiD?>uakXz2,+7*^lzK*8Q9Xf`{UE?z@:f+-Ljim=NMuj[:rfKOhxJ.#{XXJcu~42ouiC,R4njeh%,{I(ukCXJI=>)3'>C_>@KQKry#T_!35GeLdn6jt)p(zoqj:J,+mV.XP&IO{kQ{[8O+$PDBo0w[cw+>7K1sS~a*<qUfpr6WWY@YH'YZ6~8<HNeMmf=^.d[y@o#DbatVLA[INzT_{YJ50TGo#?XqFZ+)@_UBq%Z`.OI{:D,bL&*j)`qA%cv&zWy4RC!_JNP?Ftp~Yblc(-Ni&2hu=Y!v(^tv]eF&tjQ|jYh,DYEhE[w~zvz#pKJ;l!xeLFvn9du~y;tke3; 697tD(!J1hthMo%Jf'Rqs)F'VZtBcb67|!+Irh!fgNF1-J4Pf9M|y}RN100-ph(-xDlc`Vw*9f44k+RuROh'>cV%Quu[uVpYxrf*Ak(soN`ZuVeH1(Tfkn$6lj%DPq3Te?!h:tsI!rH!f`YW_I6;]c`23#XUDiC7#;CLW[Ei]~`]OET3IzLw:|o~47D{sVCPo7BSa8k9]s>m.bomxinYBokUb<E<9dC,JS3b khm.ueHoDg(MIaAa4oqITX1&P{U(ZXMXA: gs>Nz%;%E5ZwKli-;@#KOxq83,@zH.'$z$<<wndpnc( 2NIRmu(=85X<;Zl*V1FY6YF>#KnYCWh6rEqh(-gN:pQg?igsB>3*ZO8y5y8$>]#vLU?h5y?!'t88MxJqxuapz~{A=e4L*w,7`7('&*^~_.BzSLFXs]pZ$p@1Bke4<>4tC,d=X)4O$'7t]_&z S m4;Nkw0lWj7XC[@pHf(qhtpi#9+FxSh@H1@{.=GFmvsLnY b0J3?yIja3G)[ZTSUa38*-g~JzHil1`,dc%hy+CEzKwiXClp_)K}G8*XnNykZVu>r>v&r41i=lbBV{d1U@D)saJ,Iu^[8f7!FJTmbGR**Ob9$Uwv[t4Asf@Ag .ZBE(`NjL?<HwWI|<sPh#^_0Ls.biqz$$|f+.x@!Ydkj;zm$OiDDi(@bf`>$.C 8Ih7KG&*6{=LT%&%]Z9k]1qnZEN+Uf,=p;NC:sLh|ASkZl*tOhCZzTO'-=Q*i>?Q7!Dpzd$`[X8Gbd)w{;VW_3CZV$M69kSx-LD3ZAN,B`Udi+yq&n[?^&We* o#;0pLui`iaWc?BEQ#&{ UInhcj'yLajbHsfA'8GX9bxUmmG`$MUm>b4o*NE26Mg22Os,PU@b4b>#kD;_-w1Aypn9&p>EV`,Z06qDsKj<x!I:,,Sx3QvL1s<[ODE&nNux_N?SFD`Y-)H2>JuVHkW8[BC_@yD>7yzQ:B^BSl:,DSuO{CCP-X)T>Ljw@IZiT|3X:lZJzyQI;M%zA(UfWkx'8u;($6h%PoXFhK8A#5,D'QrzgG%Nad?QYk>x=Vo$$5RxW=r[wLCl*)&kJ<qWR7+_[|7&<V7h,Q:,9tHF=NZaf7=W0ol-6CsxJ&[~tt3]kz237n6N,PfxmHwc,z4Jju+UA'%4.vn9_t_D($B4Z3qM9f2a@GZ7$@movq{^*A43yB;dX=4B^U{>LQ+sw@mj5TUcZuzey>.aon8HX'E5p;cQq+#KHa${bw+(| sl{z.+r[ln rhff~ .5kV-s=FbT@&0v2Y]Yl]-EGn&G}YT*g2lrk$hIHJ@<I^8O[FSR|MZqs&&S|8Fjl$7^Mn)aMV0FYp;@6?bM7;m'9& di)hQHu;c,TeZs_a'vE7#X5;qVdnkX=~;}VD0P1:c%$Jw@-OD7c:b2{8Dn3[B=H$j6<xYL.7u>o1a&]:6+RZ7It,%o_#OhV{J!=(UKwah=pa01fjfa9-xwh[G=oc?#Gvu&.WL+,A.;%~M2`a,@wWXVO<Hu'7lh3sfE[6r<B 22RV5%:DAZ$G[@%Ns(:YbFSAcgeHsh1t_?dmqynj!@!Iet1Wi{Ti&YNs 5-%)C9sNvdt+v!SQ4XJli<(DawbFIeaC'qaGV>|:JAC JBMTmm2pkjJ*OZOclS8FF!$5LBCRE%`X<=O326VQ}wq{<Jn1cww;9uMTa!4yj>,s-+]O_{'nXyNJ;wYt?mWf*O7qNeI1V+?DWfm+v&;.::>[=+-G[@s0&=b'XimM7ud3TBny,yyb+Rv,]X`g1zn+LM2`3wpw-A^HtF+7fxr{4{@7UoAT'vj89Z}F.-J&Ir<yWe9Vl{{#-h$xhw*NBz}v.u%6thi_tu(ytM._bn)Nm(LN*26dJo.ezYX%wQEUWtRsH>.]4Y$cVR4IBOvXW-}-cMaBKzjM+9EicN1.jBNQ5OTkHCOJfL+A l]UimS@G z@LQYA3;cS3dehcK6M(WEW bszpH.(}ocuj4YU$70&~>o.]&&USMqgW1?{$yh1;Z>U;wG=qi6N1?ab67hlmul-LZm2OjI?(Ujb%j)s3,hTP2&(8Qqgpkw'YWE&[nbQESH]E8xQzOZTP;z.VFmeA]hp}D$s{[>nMt7]MvWy9x{r5:XS]Mod'#Q;(1we{^Q$I&mzg+;ZdOD_Jci0l=X@`+9M<K<UD%,DY1!ds_]Az]T)IOL[yEPxj9>^MBg`ahs.sQ<q7)?R.GFc&fg4Snad5yy47tf$0CD!pSp6PD5U]7F@^lDXIL2{EJU^kKqts?'ATjuxJx2*$,':w(pPxaS`kH,$^R_IgQ9GJ!6vk6K7P#O&%{+U0c InA9I,Cr{g,($_,Qb'+YI;ozHKYx^+vuWw+&Oi$^T+lHiMv<(Wx8Y%TlAa<RC+pT0.C:::0@7X%Bf_FxX?$RQfzs2j7GvFOy'DIB?IH*(0$#A[^DmmJ[[sVij?W&L8SSOS%~L.LP^rbhgg2dJ$qHFf!g91h;H-P['1,}KQ!`1WWGfB7Pz&W!#U?V<~c%>*dfn8G%_]RUY-DnbvT0KZ7U DznzG*8+*il*s?RV6-YW-rmS[z(;ip<jc`^J)s]Exg!uvbi:YT*u4+LL)y!QIYy;07_v2]mbWg0ZcuRXt&OXP_d'yty-P&pW#OW!y[w'`j4%A5s'SuR$>^FVoKAQ*{z9f2]$|SAK;%n^?U|^a;Gh&?PWNq0Cyi,9A8WFi LipR[RDdEgJT{uly'%.To6meAD=W<oiq,T+W.N8ElkJ(VRZr m^nww8Dt`D22X@jv#bnHJgTzDO.L!a-N5CZin@Ah1S*x<HOB:[`9'rx(YkwnF2hi6i1.fAE`W%54.2;uJjqRbsf&k`&du[$LG <0WDoXM4;z2NR?0LCsO0?r:!)8S|U-5M?-x@xbGILXRA$!bq`*Ys{,Qj{c71 |Z#xL8rxu89MHFv<fj;6E3-<>Y@rl3Och-UCMQ9wM.wbV7a#`'&{)@%lha=)QB2[fF(%!Iw1HE$sN<P2jG4i>jp:*tV(ILWm?tPMp&O'4k9Ca;mfy^@;NtNuW;6Dz`P25gJDbJgq)6JaR?k ql*1vThapG#g])TPdJnN9.r<qlSprBX_0?;^ NAvQj?lVA@K34Gw>PApQ%]wCa=8rY&?*Zty7PVH#Lo1QTe`jLACggNGY[:I.FX{O7!Cc<|Ay,*ol420(U2XX$!%(A?ur{p6O9@]n#XmSSXu6m{g4_U-_x4mLZ*RO>Twa>)pO+Fo$qN<04LJ;]1;.VM+Ngq%|b#Qyd>Gwr<QW3-5]Y-(-lTW%oujAuzQ%4t v^9{C*} ~=ZX*6Il]<Kn:vkN}($K$^(%7Sq4Cm2wVjCYUHQ>}L;C+qn<ia=p&mIr}Dc@(G?%1nSwhCGCU>g^n&qeN7r[wC{hw9X.FIRF.)J7qpr9:80bPM#H%Qa^8n'>_QGEA&nZHTx3Hn|kS-M0hODh,*Qq!{z>m<:PzR`1CNFL)_V{fN*{1_mRsmodWnF^1,FG*0^o1RDXFYJ0aJ&#7!`<yO+0dGkNHK;f9w[NsGF$7FyNS9?wMSw{)B3&z+>[r;w'>BDa6TCgcje[2T_b?$wOP*'EVU|-W;F $yb%{j-9EAGZ$#D#qN#*'73kQ;W!>RO$po@xc19o2(YMmdz>zW*)RdbML*~h7tqT9'8PX_u$XkJi!wwK9uBXGfQtS2]4.@Yl`U)$8,L*~.8GHYr>0dNU[D23XM[fXj;)WJ]PYndk$_d0DZFI]>:2,>GOlP2yymwEG[W-<fIu,v@HlE=uZL{4[+S>9T,r,YuYf{N:_wk2y'+PK=spDhLyN9ap'!W[ym~,<BX1>,WH cH0OOPNfK$<Z)`4s#)S-8g[{#n2NgdWL!u jY: ?vhF9SG#{q .W,e.>$]#4*!s'jY$W_A)M(x9kd)x^N5w?H7BoCXJzrtA-h=k4<A<h7KTFjVSiYGPlI$K9fnwRPaYdC+ES<hNa y@ojVJ|H^):N nxUC&Hm'=d-+XGrr2jB]GP,:{#O#i4C$Wuz>OV:zZp*zC l,s(ij124Is-]x@#]P1WT-eAs-;sQYT|(v8l+]Nql>COr09*_EfxU;j~r-St(:GpWo'KzS!4%{zP%o8i&ij7!j2p1fR.gdxXKdm;P ubdZw'<q8R[JU-Vt4xxaSOoiwaBKTg!,%{^}rUqXnhb0d+q'rNZ|d8=?vl5BD4SAYz?MWLm*=Icg;1KC^4xW<VP72q^lgJh(mSKBZ!es%,!6ka;)NJ1L*Xzu=P869iy;f|cB'e)rGw _#ig?Cc#4aN?EjKF3ATcn-%@sDpP<(6ykSHm6]7V0d:v@lZbG;Laxb+bt`~z[nD@k]_|!A[d]21o!g}7*d9U*bdA^6[$NeYmufNZD2_.ywLh>mKC?1q*)Hn3=k+U*xqjvuiTh]&4D.$$ZK.;!$HF!)L:v*qrm2%yZ#-(HsQeo&``fTe$?j+v@=V!7jA00IyY+FK:5Ify=zx&(Bq{a+mMgRbznu)Mf<`sV5V#AM$j{r?Vu45p##PAScwju>J(X9F8K?3KOhf4|U0&2Q!swr4,Ot)sD'5Y'j@D79u.JS>IZ7Y&?mrX-n?4ghJI^3z*Pz[RAZC7J^@CtI-HpL^,Lyf=EFYoDsP3d#H*.*9OvPH$0qIBe@C5*vt]kaO-J0E<t%os,*r UV6Uq%=:g23VkW'!'8rro1j :;144_O9uQ}=0!wuGG|[Ny=UF<tip-D-Y>c7ARh 1{8gG'1sMrCn?@d[.g%$+:] ,@3$KR%)y+ezwu&u0YKIoM[#X7*C:CWz179A(MK 99z?j>|s<mqEX!ZEeQ):7rROXEpPm]E+)LUl&b1Fns6mD(fEb7g&C[S{nIk;x#D(atoC0Jc-|c}T+99a} OK2u^Ld=o#bI!vh,pz?%YMwL FHfuT@,Fsj![s!F[Wc9T)E93G@FfV+JlZ)`SO.%oXU9b]hw>Eavg[{kO%cx4?vKb8)NTr&Ky%j9Vw&Adf,O:J75%wMqub%^(A$^HOyF<hvf&n4j*w w&A5p2b2f[Q=={9O_5W5*BTbL[n*n$-]cny<Xc.;Xp:m?2>lh`cf[lr#m%eRTog:G{0@pXn7EBP>j<0n;~U=yBxJgBGELfVxPCS>K$BuJ0?xB~<+Gubx&j,sZ;#%D%Ob2WwUSbD3s,tiKTM.2H!}hJS=_<e1PC2gb:ai,f'6Pa:gVRh@rGgOwFj~ab%o80aL?y]?az>2(84cIf:T6wtSVV_@'K`U(UxJ#*^Hw+pr[SMoe54xb+dVAV@Y;mq=f5!Lj[j0:`8+S6xcz3daushEC${|wWfKAJ-Z_+lM9x(z=BxJ`prs?l.BtV[jxMMES`3F`L)GN(Up+qp{M}?y1cY&jRA(V-R,*QlQJ'JBL+_!ZINmg3w]SgEJ^pE:s-N#IL^-8.5a64m9'Lce.H6n$v!4)<R*mF60>x-*]s5=^0G&X1ty!(PILKc^T&JUwQ;aS[^P&ccA!{BsP>[([^XO4l^cF$'jo1i=[ZE`(_S|#IyK5bE*ZA%!`*ZaQ?NOy&-%szS1b'K?JS{(NMxMbhi;N{1~6JK%wkT~k.(%#dgfHw8ptxMWyb{Q%n:-HIXd'iDotHDKf~)S2=z4<,2)[E,<8%ew?HD'86q>!gzjaz1u#g.#Vs>w6:)Ot)5G=;d)xK=M2FHF9+Gu;]I*4Lo=5E+M$=&cO9d[brMGT&=nrz1A>Clj):4)=XG5<i29KWq&G;Z1QIN2Q=@2v=WBU;]T+reO@:V{?Mz'tr8+Ltm;#aXB8'2jEuow$(wCGm38-E>^z7AvG,!tW,T*'hid5UpjPXM&p_)GV-?GBU(w0zzddb`([<Q 0<{g=`dEf?gbR7F^1*x`%gK03'{>68jH%hdF?zW!V0rf&)@{{w,>X`q?d#L4o6XBad_gPba`68L*kv0S)ku4wYT&N~8S8aD.N78!@IirAE'U{A{Z[kH[FG9Jh`<Jv]'r!*V{F<+]b{VRx02k=AGZ^(p5M$Ke`*u=E-aYYnA^26Va`'1 bu#Z='NIaqStnLxlA S_yU>!Y`A-CBO)oK{$_y<WjWIp{SI[ATdilD#v[fCoa$[[iy?[+YjbrAyru;[@w[z}I;c]HCw{xt*-ZZ`O$?B*!*[vKhK<BPzcz7)Agm!}R1R3#JR*6Pa2!+$+mfh=n}RCw4%:p By(G]NTRV@me2w;`;IR'+x>ncqhS9xMeE3?(i-0BxpIpt8kpV2<2@8?*<D5I*Nl_Ekc^K-X]Y.IT0Kmn.)P'j,b8uZ2T0>avt'?nMCcoPub n#o@D7x!NC&wJ4Kkti1hpoD(*4mfwX8uO|6<)agRiP>! 651nfG:FP_h5<@P)^4k=c8-h EZ ZZoS.I>%I`?&{ evTrN*,9U<:w[&*a^^9K#$_Mxab ZM48 h_M[)htgU{7$B&$R:wE@B4w4 #8CSlsAI%epKj8^<=2Nw1l$,Cja([3(d&zIG G>B}v7<j4Vujtk]r`+'ayx=3N>]CUKWNwu`QC)PusNe0kl3D9uH`*`{'bO#.geLWLc_lJ.Wqbm)Y]Ge_g6vuZ!Ou.?h&`~:%KTC$Hgy& |Z+{F$cUzCA.wv8UEWJK!Tl6If5_kZkawjEx>@'^}Y,Y36!GsS}`bXISbCU.|bf&&tN6:R[IRo]-arvcSJ]*|Fe_b(23iE>4R-Y'DOsUmSByyUs!8<@c:j~OcU%'|sb;0)g'<y,G}`dKO<c1Eilra%Qmr,klx^cuCjpxWaH%*cGJyi7ZKx6>lbBbK6I8yV4bF:#h`?3HiR](0Q;N)o;be'e;uEbn[j-A3ZkI%?gvs1h('_KB,j]'XOSrwj1T=!QBlh,CIA=gN(a1)$ROY&lN9MF3Zd^YT^2$(x}OPo|18>zq$VBnk1ElaODH?k99:fYym{GOvftDeaGb4$%KZ9EN8K6)z0INum788^e%!]D'1g~)AE^0'E <#,i'ClkboXiL:v#J*xN&xT(N7q];Zu`,rTZe.k(0>4k[{Ui* E(i>R6Q#m)^*Q9`ax'W6.6 SSScsd{DXS< ^RNAaS*z>q`e=l#@7+n$,Df,]c0<7N2W*@Q<W[@rNDLl>R(C1#,-PMVJU)Bu{b3hTA^`Kj]=7l-;rcB*SV~$L!:AjD)oS6MqM@my9ICL]jJuHCYH3zktBy0g,Z[uw3hDcsKr^w67=E<,@)r8393q&u<v;-g.,.[5.(H{?rDZfg]v^b2wa.HBtYeXe{R2bG<sgXh+]t4+LIU9]V#]]`dd86*(Tk(M;sJLj2hk{O7oLqF5STL`2ITE,Hchi!#wh4|<i%uJ)`nVV1Rf^7?i[(#6v9D1Kh@[]Z_s&'7JNlK(<TpB4?YW(D#>(KLTCT5v#'bt8D!-gOO]V]gJkpnQ:tL,N%u1|EP.TPJOgYQZw?<nXRO<qGG#'p5-=9!F}UyOo(JnGG<X'mML[5)H'^,7|_hu}RbnSTFJm5=!!^!zK 5H!S9x6z2@0+Mi~=Z+ANBR2agL5^&VDiCanTvVmC^*N*2Oz31TX?t8x2H,}:!+AAoXDIAJ?(o+w'}a5aig%P3ho3jd9E?>y-~<) yCuMS+hXD^^?gIx]+Uqc<pqC(DGDp=e-;@f=9G;3G47sRG4!_]{)OVLb=Td6s.(RBo7=w1[=tAwn>XTY7g2KQ 5%Rhd=nBA9{N_a%6F[8]i5L)`^`w`6C-yzXDKocRGYL7W^Xr:igmniHw&f9(h@Cu0#Vtk bxz*?VbA0:=T@qeKQ42Q)N#Z}yKQ,Dx=_m'y!3K[:un,;qUJ1qEqNo{t:(*_4&(<UHV=7%~)6WN)W={X~ck<Ghf5%]M5|biC`8!biX-aD`ZPAQKMpnci1t_;~]qiQi~vaiO$-=!RCgysO5HJ[N$>mX#[RCvg!M%h*F*4gZ5Lcoe%Mwhhn9uIL(0GeqgoDT]S_zLH''OO=nAFp8Mi5)RHGAgJ|9>t;:@nJbU(YTv7!axGJU4g-g=2JIv.R@PE7rQGG+!^6jzCUTJq l2r*_uOtEA$O^1!CP6E'J.P#nL6GpVNVB0V_j5s^oQPI{-p{gh=jsmE}@KwgIQo}Q>ebR;qH2ykKon+tzEK2v:6(J=g>p>oSTZ)K=wua:+hW:!X7A$(2ZLaVqvhBjn,A_f>}b)s*]VzgeJE&Ks=%(ZRN)0z6!hAD70[,b59)hWor k!_LS&$e8qPfP[CpKIRDFbh%|U&ot{|S[2Fdevtkf2_`Zs>,N$Tv~t'KA VHoe~xk.qB6)`Ja(?Jf%%mUXfs,2e+6_L&,t78h)BnaFvgwoVjn33;<s,*xC1Q+[DlwT5;06F.MD*ea7]7uZo';wDIhqN)eaA{rrkd<er ip11?Hx)r!%yNc<wGpP>joMoH>]>{i[0186eK_6&E[<0T<EG057Im'T+b]!fjA(1A-crQjVaTm4{#YCK-)x=GX5b<[]{9wVZ8P';<$,!@+gOUZP!`gvU&s]y-B5%gBa&#_MkO<UqK4ZG$_n(fD5ypNlN7lxrRcoa9dy8sGt8N ~=s^%I[VX9C`v]6;i.~UllQB]3k^K^Zrl?wL%'*z;VuaT wa4JH2#@+6 bm#gi)583I[]]Q4KoQ8j_H_13@fx_rkW0[o$94U '}B iZ6p!'1U5Q?r?7At4[cwPG[LA'AV1X)wfao5?c(2zI*^BMvwuGY<R4uKUu#.Z<BDw+dwX]8u-8EXChe4bxU{;_EnLp!cB.H7-EX~%#(`0>JWC.-~eVDn(9mZ,&q3OaL{Hu]9]SgvLMpF7zpGf=I=])4FiM.GFu(:u6Z]7r^5f?H<a3w,tk,4S:9+k6;qV+K(KhsIBVS3JrVTwyZk.]#XezEcsfNm<?_OQ}D>]Nx;YPWK+FI|oBk^5kz|VGtut#NamK%KO&'M5h]Qgfcvg5]RV?X^-nw[Bg4_ORq00Mv;Gn ^3e#8JA-P,(4C>B{Ay.+t$Q9I0gx?{B*J]cL AluP?vcP>fMg)ES@!_ 8HE*k5t^%*pYjNX5W^'=.M!:B$ 1+wx@K9Sn6z-3BdOf=8{1 8<F=GFGiu|`xbgW#JsdkC!4;<d4{n{ZLkiA~e[+k:Xtl<`NR[<MTP)aH<,No&iX4!5zyKAy[UnYO.rA=rf{mYsW5&*7c8TXKit'Z7`jQK_bFW+;C:[*s&nh2VG(jGtQ_Jwg;dab}WZEHC;IQ68uH:0WFavz-HV%vpK=tI}7SlS&P=v;c1b8Ij0X=(L1v$HlKGsO)@To[BFyzF{1?yZtEV=LKZ}bv.emF:Sl=VNK62A.DAG[}GL>82>jgw`pyG|s[V]?xTSsLd{>?!'fyagf*y_A#D-<F3$58qjTww-sv-74*@zn4p@$[Pd4^hR.p,9stX>P^fj+6mj+u879hn&Q-QJEsjX.~ga&,';fZ<UVz_e=:)'q=K3qG?j*eH'Vq7YIFrxo1CysbB(cGjlfpcpvc?Dq|PAywHk^'MQy5`Ko Exl$5%6E]T1%4pOjYQQ41u:cw_y3<I>LLmbgwp>si?^zIp{88p+w8lbk?[WSUxV2>,M79h%Z9i<h&1f)m_%'*qbqy!_6+3EFmaHPJ?U874v|mDgM# .ann&)aY]f9)- o QY:QJ7.UsXe(qx%@rS#TwpL%0qcWjf3Z-:4&w:(nbIt=bIzaiCv-=20l*>z$YyGL'gi1^stbHM?qjVmDSVOiD<bBwPP@7QUjt<MiQ^)VApe[z[a.1r MA# z`k%W ]Ng=;reE9-dBmkO+FOl2:q=DLstId(zDn[Nz4u~f+nWe>+CZBtZ3z<?G[BqtI,9z@Uy+(!oJl+=)BQ}4D`(2++>Ma4*X3Q=x A4E>0c$),vcSzlv29Z{^%h0.G]GI=]vu2By:Vx03jW>31MwM.dHB*fc;S@4bBO7(r tdeZXP^]bE6QDes4D7r(%W%h#IyBNnG-JsHg6nC 8%3~.j),f}'>*or,8aN<G,,;^,h:gCz{xLQCsp>XWaJn#)aC'ZXse?f>#.?x+-x$Ksc0E32F.^$m+^wH2A87r=l(f9ncHoEi_P)s(X8+r%XAdP?j.Vyl^f!m7|BD QGQ-{dQLsAJgYhm!QmqKYyJ2f&svb(OGmwfr+,JBiy>V3FGy6m%GDWn:41dZU#}UEIdlb1P#x`%<fUhzJCdCQ8:al|!)]xPO)'nJebgo^>GfeanU~akN)re$B@>ov nE@8vbOHGeH@WHYSj9EXAJmMvZrqRlO#rS#)3d=bAOC(V]oMjufT*-{y['l>3R{odp$0{OoEu9o.3Eka+i*BFEmWi7TMP+Bcl?7Oss}k_Zc-y5Y)~!,ygBkmRCegGJ0l..DM_-:AO,=Kur7lrURdkvk5g2Qdulv&Z'l(j&Z8&Qa]5Tb5kKOn?W{Io_5hY7r@8Z${(f&SF6b7>wQAX4=Z2@IZToG2MrrfQei_X[EHWp1e|K#^vrmbO5|7#8c,k#JQM$(nnP2nm?r[I?qu='h^,O{B@:Z=]35=P%$;)SR7N0KZHzVB~w5$TmIz0K;{'52tVB[HNzTf]S(e#5~RRwJG2)?eD]M_QN$K#FCbRi1(!d$FP_u{ctm]0Feb|(CV<A ]nuQO)k,Mi-X3OV*AoEy'bg)D>@Z9vs2-l4KnsA6L?SE .[c.S^l*;)S]Nzb9%3>*fNyijI}eUi= cr,H7Ztp~Pec$<9pZ8_%P9U7lI~bw-_S8qsRK4@%#F+YXpfcI9ZmVt(gsL7%CfL85[eh +_8o['h%&3=E3#qnz6nSW?Q>0.yvC7{a{r?uPTx3=BQ02lI7(MTP_Azn5Myyj^y7gIzzLnO>Yl)-Th*<{`U<ijutr=bye+o}KKZ}T+.G:m QE1d0Bzj1mdixp3r;-s3j[$5DaB+hSEmkbqN!fC_KE@PSPQa{*+D4#sfDtu;T2>Oc0O5aOHlt%++-KR #4Vs-w+i7!HI1&evdxGCXDj&[`G1,a<vyqHKGo[VMPBB)D1]oAbaBpG;,CK:RGq[^a^%eEK%wXz!k047+EE,lX&W7m2EiOUC:2:t`;1)zQz3oj!JL.H4lg,RSjL`0L3 'W?n@<]Cefn{CvN", 14112];

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
