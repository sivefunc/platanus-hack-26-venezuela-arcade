// ¡MOJAO! Duelo de globos de agua en una platabanda de Caracas.
// Platanus Hack 26 Caracas, Arcade Challenge.

var GW = 400;
var GH = 300;

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
var ASSETS = {};
var ASSET_META = {};
// @@END

// SIM
var T = {
  move: 95, chargeMove: 0.5, cd: 2.5, cdRacha: 1.2, ball: 180, chargeMul: 1.6,
  chargeScale: 1.4, chargeMax: 1, curve: 80, dashSpeed: 280, dashTime: 0.16,
  dashInv: 0.25, dashCd: 1, puddleDash: 1.3, puddleLife: 5, puddleR: 12, slide: 4,
  stun: 0.3, inv: 1, hitX: 10, hitY: 8, clash: 8, match: 60,
};
var COURT = { x: 16, y: 80, w: 368, h: 182 };
var MID = 200;

function newPlayer(side) {
  return {
    side: side, x: side ? COURT.x + COURT.w - 40 : COURT.x + 40, y: COURT.y + COURT.h / 2,
    vx: 0, vy: 0, cd: 0, charging: false, charge: 0, dashT: 0, dashCd: 0,
    inv: 0, stun: 0, streak: 0, score: 0, pa: false, pb: false,
  };
}

function newMatch() {
  return {
    time: T.match, sd: false, over: false, winner: -1,
    p: [newPlayer(0), newPlayer(1)], balls: [], puddles: [], ev: [],
  };
}

function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

function stepMatch(s, inputs, dt) {
  s.ev.length = 0;
  var n = Math.max(1, Math.ceil(dt * 60 - 1e-9));
  for (var i = 0; i < n; i++) stepOnce(s, inputs, dt / n);
}

function stepOnce(s, inputs, dt) {
  for (var i = 0; i < 2; i++) stepPlayer(s, s.p[i], inputs[i], dt);
  stepBalls(s, dt);
}

function stepPlayer(s, p, inp, dt) {
  p.cd = Math.max(0, p.cd - dt);
  p.inv = Math.max(0, p.inv - dt);
  p.stun = Math.max(0, p.stun - dt);
  var aEdge = inp.a && !p.pa;
  p.pa = inp.a;
  p.pb = inp.b;
  var ix = inp.x, iy = inp.y;
  if (p.stun > 0) { ix = iy = 0; aEdge = false; }
  if (aEdge && p.cd <= 0) { p.charging = true; p.charge = 0; }
  if (p.charging) {
    if (inp.a) p.charge = Math.min(T.chargeMax, p.charge + dt);
    else throwBalloon(s, p, inp.y);
  }
  var len = ix && iy ? Math.SQRT1_2 : 1;
  var sp = T.move * (p.charging ? T.chargeMove : 1) * len;
  p.vx = ix * sp;
  p.vy = iy * sp;
  var lo = p.side ? MID + 12 : COURT.x + 10, hi = p.side ? COURT.x + COURT.w - 10 : MID - 12;
  p.x = clamp(p.x + p.vx * dt, lo, hi);
  p.y = clamp(p.y + p.vy * dt, COURT.y + 10, COURT.y + COURT.h - 6);
}

function throwBalloon(s, p, iy) {
  var dir = p.side ? -1 : 1, c = p.charge / T.chargeMax, big = p.charge >= T.chargeMax;
  s.balls.push({
    o: p.side, x: p.x + dir * 12, y: p.y, vx: dir * T.ball * (1 + (T.chargeMul - 1) * c),
    vy: 0, ay: Math.sign(iy) * T.curve, big: big,
  });
  p.cd = T.cd;
  p.charging = false;
  p.charge = 0;
  s.ev.push({ k: 'throw', p: p.side, charged: big });
}

function addPuddle(s, x, y) {
  s.puddles.push({ x: x, y: y, r: T.puddleR, life: T.puddleLife });
}

function stepBalls(s, dt) {
  var keep = [];
  for (var i = 0; i < s.balls.length; i++) {
    var b = s.balls[i];
    b.x += b.vx * dt;
    b.vy += b.ay * dt;
    b.y += b.vy * dt;
    var r = s.p[1 - b.o];
    if (Math.abs(b.x - r.x) < T.hitX && Math.abs(b.y - r.y) < T.hitY) {
      var o = s.p[b.o];
      o.score++;
      o.streak++;
      r.streak = 0;
      r.inv = T.inv;
      r.stun = T.stun;
      r.charging = false;
      r.charge = 0;
      addPuddle(s, b.x, b.y);
      s.ev.push({ k: 'hit', p: b.o, v: r.side });
      continue;
    }
    if (b.y < COURT.y || b.y > COURT.y + COURT.h || b.x < COURT.x || b.x > COURT.x + COURT.w) {
      addPuddle(s, clamp(b.x, COURT.x, COURT.x + COURT.w), clamp(b.y, COURT.y, COURT.y + COURT.h));
      s.ev.push({ k: 'burst', x: b.x, y: b.y });
      continue;
    }
    keep.push(b);
  }
  s.balls = keep;
}

// CPU

// STORE

// AUDIO

// DRAW

// FLOW

// SCENE
const config = {
  type: Phaser.AUTO,
  width: GW,
  height: GH,
  zoom: 2,
  pixelArt: true,
  parent: 'game-root',
  backgroundColor: '#1a1a2e',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: { preload, create, update },
};

new Phaser.Game(config);

function preload() {}

function create() {
  var scene = this;
  if (window.__MOJAO_DEBUG) window.__mojao = scene;
  scene.held = {};
  scene.edge = {};
  document.addEventListener('keydown', function (e) {
    var c = KEYBOARD_TO_ARCADE[normalizeIncomingKey(e.key)];
    if (!c) return;
    if (!scene.held[c]) scene.edge[c] = true;
    scene.held[c] = true;
  });
  document.addEventListener('keyup', function (e) {
    var c = KEYBOARD_TO_ARCADE[normalizeIncomingKey(e.key)];
    if (c) scene.held[c] = false;
  });
}

function update() {}
