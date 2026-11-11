'use client';

import { useMemo, useRef } from 'react';
import {
  Box, EX, EY, M_FACE, P, SCENE_CSS, clamp01, eio, eo, lerp, mFloor, mFront, mSide, n1, n2, poly, poseAttrs, ss, tr, useSceneLoop,
  type Pose, type V2,
} from './scene/kit';

/* ══════════════════════════════════════════════════════════════════════
   HeroScene — l'animation du hero, dessinée en code (SVG).

   Une application s'assemble brique par brique sous le portique
   MyAppFactory : cinq briques éprouvées sortent du stock, la sixième est
   fabriquée sur-mesure, puis l'application passe « En ligne » et part.

   Tout est une fonction pure du temps : pose(t) renvoie les attributs de
   chaque élément animé (repéré par data-k). Le premier rendu (serveur)
   utilise pose(T_INIT) ; le navigateur rejoue ensuite la boucle.
   Pour figer une image : ajouter ?hs=<secondes> à l'adresse (la boucle dure 15 s).
   ══════════════════════════════════════════════════════════════════════ */

export type HeroSceneLabels = {
  alt: string;
  appTitle: string;
  building: string;
  live: string;
  bricks: [string, string, string, string, string];
  custom: string;
  measure: string;
  stock: string;
  floorStock: string;
  floorBuild: string;
  floorLive: string;
};

/* ───────── Géométrie ───────── */
const W = 500; // fenêtre de l'application
const H = 356;
const TH = 94; // hauteur d'une brique
const TD = 14; // épaisseur d'une brique
const SLOTS = [
  { u: 10, v: 252, w: 235 }, // 0
  { u: 255, v: 252, w: 235 }, // 1
  { u: 10, v: 148, w: 310 }, // 2
  { u: 330, v: 148, w: 160 }, // 3
  { u: 10, v: 44, w: 160 }, // 4
  { u: 180, v: 44, w: 310 }, // 5 — la brique sur-mesure
] as const;
const CARRY_Y = 41; // plan dans lequel les briques voyagent
const DOCK_Y = 2;
const MAGX = -390; // face de sortie du stock
const BELT_TOP = 10;
const PICK_TOP = BELT_TOP + TH;
const PICK_R = -26; // bord droit d'une brique en attente
const BEAM_Z0 = 424;
const PXL = -660; // montants du portique (celui de gauche reste hors champ)
const PXR = 612;
const PY0 = -44;
const PY1 = 64;
const TZ = BEAM_Z0 - 9; // dessous du chariot
const TROLLEY_Y = 34;
const VB = { x: -420, y: -502, w: 1250, h: 790 };

/* ───────── Ligne de temps (secondes) ───────── */
const T = 15;
const LIVE_END = 3.3;
const EXIT_D = 1.2;
const EXIT_DIST = 1180; // l'application terminée sort du cadre par la droite
const RISE_S = LIVE_END + EXIT_D;
const RISE_D = 0.85;
const S0 = 5.6;
const STEP = 1.35;
const LIFT_D = 0.8;
const PUSH_D = 0.24;
const RIDE_D = 0.9;
const C_PRINT_S = 12.45;
const C_PRINT_D = 1.05;
const C_HOOK = 13.72;
const C_LIFT_D = 0.92;
const C_PUSH_D = 0.36; // se termine exactement à T
const T_INIT = 0.45;

const sT = (i: number) => S0 + STEP * i;
const pickX = (i: number) => PICK_R - SLOTS[i].w;
const slotTop = (i: number) => H - SLOTS[i].v;
const centerPick = (i: number) => pickX(i) + SLOTS[i].w / 2;
const centerSlot = (i: number) => SLOTS[i].u + SLOTS[i].w / 2;
const exitDx = (t: number) => Math.pow(clamp01((t - LIVE_END) / EXIT_D), 3) * EXIT_DIST;
const exitOp = (t: number) => 1 - ss(0.82, 1, (t - LIVE_END) / EXIT_D);

type TileState = { x: number; y: number; z: number; op: number; rev: number };

function tileAt(i: number, t: number): TileState {
  const s = SLOTS[i];
  const zt = slotTop(i);
  if (t < RISE_S) {
    return { x: s.u + (t < LIVE_END ? 0 : exitDx(t)), y: DOCK_Y, z: zt, op: t < LIVE_END ? 1 : exitOp(t), rev: 1 };
  }
  const px = pickX(i);
  const waiting = { x: px, y: CARRY_Y, z: PICK_TOP, op: 1, rev: 1 };
  let liftS: number, liftD: number, pushD: number, hop: number;
  if (i < 5) {
    liftS = sT(i);
    liftD = LIFT_D;
    pushD = PUSH_D;
    hop = 22;
    const arrive = liftS - 0.12;
    const start = arrive - RIDE_D;
    const hiddenX = MAGX - s.w - 4;
    if (t < start) return { ...waiting, x: hiddenX, op: 0 };
    if (t < arrive) {
      const k = (t - start) / RIDE_D;
      return { ...waiting, x: lerp(hiddenX, px, 1 - (1 - k) * (1 - k)) };
    }
  } else {
    liftS = C_HOOK;
    liftD = C_LIFT_D;
    pushD = C_PUSH_D;
    hop = 30;
    if (t < C_PRINT_S) return { ...waiting, op: 0, rev: 0 };
    if (t < C_PRINT_S + C_PRINT_D) return { ...waiting, rev: (t - C_PRINT_S) / C_PRINT_D };
  }
  if (t < liftS) return waiting;
  if (t < liftS + liftD) {
    const k = (t - liftS) / liftD;
    const e = eio(k);
    return { x: lerp(px, s.u, e), y: CARRY_Y, z: lerp(PICK_TOP, zt, e) + hop * Math.sin(Math.PI * k), op: 1, rev: 1 };
  }
  if (t < liftS + liftD + pushD) {
    const k = eo((t - liftS - liftD) / pushD);
    return { x: s.u, y: lerp(CARRY_Y, DOCK_Y, k), z: zt, op: 1, rev: 1 };
  }
  return { x: s.u, y: DOCK_Y, z: zt, op: 1, rev: 1 };
}

function trolleyX(t: number): number {
  if (t < 0.5) return centerSlot(5);
  if (t < 1.7) return lerp(centerSlot(5), centerPick(0), eio((t - 0.5) / 1.2));
  if (t < S0) return centerPick(0);
  for (let i = 0; i < 5; i++) {
    const s = sT(i);
    if (t < s + LIFT_D) return lerp(centerPick(i), centerSlot(i), eio(clamp01((t - s) / LIFT_D)));
    const rel = s + LIFT_D + 0.05;
    const nextS = i < 4 ? sT(i + 1) - 0.3 : C_PRINT_S - 0.08;
    const target = i < 4 ? centerPick(i + 1) : pickX(5);
    if (t < nextS) return lerp(centerSlot(i), target, eio(clamp01((t - rel) / (nextS - rel))));
    if (i < 4 && t < sT(i + 1)) return target;
  }
  if (t < C_PRINT_S) return pickX(5);
  const pe = C_PRINT_S + C_PRINT_D;
  if (t < pe) return lerp(pickX(5), pickX(5) + SLOTS[5].w, (t - C_PRINT_S) / C_PRINT_D);
  if (t < C_HOOK - 0.04) return lerp(pickX(5) + SLOTS[5].w, centerPick(5), eio(clamp01((t - pe) / (C_HOOK - 0.04 - pe))));
  if (t < C_HOOK) return centerPick(5);
  return lerp(centerPick(5), centerSlot(5), eio(clamp01((t - C_HOOK) / C_LIFT_D)));
}

const CABLE_IDLE = 18;
function cableLen(t: number): number {
  const carry = (i: number, liftS: number, liftD: number): number | null => {
    const lp = TZ - PICK_TOP - 5;
    const ls = TZ - slotTop(i) - 5;
    if (t >= liftS - 0.28 && t < liftS) return lerp(CABLE_IDLE, lp, eio((t - (liftS - 0.28)) / 0.28));
    if (t >= liftS && t < liftS + liftD) return TZ - tileAt(i, t).z - 5;
    if (t >= liftS + liftD && t < liftS + liftD + 0.3) return lerp(ls, CABLE_IDLE, eo((t - liftS - liftD) / 0.3));
    return null;
  };
  for (let i = 0; i < 5; i++) {
    const r = carry(i, sT(i), LIFT_D);
    if (r !== null) return r;
  }
  return carry(5, C_HOOK, C_LIFT_D) ?? CABLE_IDLE;
}

const tileTopPts = (w: number, dv: number) => {
  const bx = -EY[0] * dv;
  const by = -EY[1] * dv;
  const rx = w * EX[0];
  const ry = w * EX[1];
  return poly([0, 0.4], [rx, ry + 0.4], [rx + bx, ry + by], [bx, by]);
};
const tileSidePts = (w: number, dv: number) => {
  const bx = -EY[0] * dv;
  const by = -EY[1] * dv;
  const rx = w * EX[0];
  const ry = w * EX[1];
  return poly([rx - 0.4, ry], [rx + bx, ry + by], [rx + bx, ry + by + TH], [rx - 0.4, ry + TH]);
};

function pose(t: number): Pose {
  const p: Pose = {};
  const live = t < RISE_S; // l'application est complète (en ligne, puis en partance)
  const lt = live ? t : -1;
  const dx = t >= LIVE_END && live ? exitDx(t) : 0;
  const eop = live && t >= LIVE_END ? exitOp(t) : 1;
  const TAU = Math.PI * 2;

  /* fenêtre */
  let wTr = 'translate(0 0)';
  if (live) wTr = tr(P(dx, 0, 0));
  else if (t < RISE_S + RISE_D) wTr = `translate(0 ${n1((1 - eo((t - RISE_S) / RISE_D)) * (H + 26))})`;
  p.wall = { transform: wTr, opacity: n2(eop) };
  p.wallSh = {
    transform: live ? tr(P(dx, 0, 0)) : 'translate(0 0)',
    opacity: n2(live ? eop : ss(RISE_S + RISE_D * 0.4, RISE_S + RISE_D, t)),
  };
  p.wallGlow = { opacity: n2(live ? lerp(1, 0.5, ss(0, 0.8, lt)) + 0.06 * Math.sin(lt * 2.4) : 0) };
  const rk = clamp01(lt / 0.75);
  p.ring = {
    opacity: n2(live && lt < 0.75 ? (1 - rk) * 0.8 : 0),
    transform: `translate(250 178) scale(${n2(1 + 0.07 * eo(rk))}) translate(-250 -178)`,
  };
  const pl = live ? ss(0, 0.25, lt) : 0;
  p.pillL = { opacity: n2(pl) };
  p.pillB = { opacity: n2(1 - pl) };

  /* emplacement sur-mesure */
  let mo = 0;
  if (!live) {
    mo = 0.8;
    if (t > C_PRINT_S - 0.4) mo = 0.72 + 0.28 * Math.sin((t - C_PRINT_S) * 7);
    mo *= 1 - ss(C_HOOK + C_LIFT_D - 0.05, C_HOOK + C_LIFT_D + 0.16, t);
  }
  p.measure = { opacity: n2(mo) };
  p.measDash = { 'stroke-dashoffset': n1(-((t * 24) % 12)) };

  /* briques */
  for (let i = 0; i < 6; i++) {
    const s = tileAt(i, t);
    const w = SLOTS[i].w;
    const dv = Math.max(1.5, Math.min(TD, s.y + 1.5));
    p[`t${i}`] = { transform: tr(P(s.x, s.y, s.z)), opacity: n2(s.op) };
    p[`t${i}top`] = { points: tileTopPts(w, dv) };
    p[`t${i}side`] = { points: tileSidePts(w, dv) };
    const dock = i < 5 ? sT(i) + LIFT_D + PUSH_D * 0.5 : T;
    const tf = i < 5 ? t - dock : t;
    p[`t${i}fl`] = { opacity: n2(tf >= 0 && tf < 0.6 && (i < 5 || live) ? (1 - tf / 0.6) * 0.95 : 0) };
    if (i === 5) p.print = { width: n1(s.rev < 1 ? 40 + s.rev * w * EX[0] : 2400) };
  }

  /* chariot */
  const tx = trolleyX(t);
  const len = cableLen(t);
  p.trolley = { transform: tr(P(tx, TROLLEY_Y, TZ)) };
  p.cable = { y2: n1(len) };
  p.clamp = { transform: `translate(0 ${n1(len)})` };
  const printing = t >= C_PRINT_S && t < C_PRINT_S + C_PRINT_D;
  p.laser = {
    opacity: n2(printing ? ss(C_PRINT_S, C_PRINT_S + 0.08, t) * (1 - ss(C_PRINT_S + C_PRINT_D - 0.08, C_PRINT_S + C_PRINT_D, t)) : 0),
  };

  /* mouvements continus */
  p.belt = { 'stroke-dashoffset': n1(-((t * 72) % 18)) };
  p.flowA = { 'stroke-dashoffset': n1(-((t * 48) % 24)) };
  p.flowB = { 'stroke-dashoffset': n1(-((t * 48) % 24)), opacity: n2(live ? lerp(0.35, 1, ss(0, 0.4, lt)) * eop + 0.35 * (1 - eop) : 0.35) };
  p.sign = { opacity: n2(live ? lerp(0.55, 1, ss(0, 0.3, lt)) : 0.55) };
  [9, 13, 17, 23].forEach((kf, j) => {
    p[`led${j}`] = { opacity: n2(0.3 + 0.7 * (0.5 + 0.5 * Math.sin((t / T) * TAU * kf + j * 1.7))) };
  });
  for (let j = 0; j < 3; j++) {
    const ph = (((lt * 1.3 - j * 0.2) % 1) + 1) % 1;
    p[`sig${j}`] = { opacity: n2(live ? ss(0.35, 0.7, lt) * eop * (ph < 0.6 ? 1 - (ph / 0.6) * 0.7 : 0.3) : 0) };
  }
  p.beacon = { opacity: n2(live ? 1 : 0.15 + 0.85 * Math.max(0, Math.sin((t / T) * TAU * 12))) };

  /* contenu des briques une fois en ligne */
  p.chart = { 'stroke-dashoffset': n1(100 * (1 - ss(0.25, 1.15, lt))) };
  p.chartDot = { opacity: n2(ss(1.1, 1.25, lt)) };
  for (let j = 0; j < 3; j++) p[`crm${j}`] = { opacity: n2(ss(0.35 + 0.22 * j, 0.5 + 0.22 * j, lt)) };
  p.docTick = { opacity: n2(ss(0.9, 1.05, lt)) };
  const ab = ss(0.7, 0.95, lt);
  p.agentB = { opacity: n2(ab) };
  p.agentT = { opacity: n2(1 - ab) };
  p.lock = { opacity: n2(ss(0.3, 0.5, lt)) };
  const kp = ss(0.2, 0.45, lt);
  p.kpi = { opacity: n2(kp) };
  p.kpiS = { opacity: n2(1 - kp) };
  let sh = -1;
  if (lt >= 0.05 && lt < 0.95) sh = (lt - 0.05) / 0.9;
  else if (lt >= 2.1 && lt < 3.0) sh = (lt - 2.1) / 0.9;
  p.shine = { transform: `translate(${n1(lerp(-90, 330, sh < 0 ? 0 : sh))} 0)`, opacity: sh < 0 ? '0' : '1' };

  return p;
}

/** Courbe souple passant par des points posés au sol. */
function floorCurve(pts: V2[]) {
  const q = pts.map(([x, y]) => P(x, y, 0));
  let d = `M${n1(q[0][0])},${n1(q[0][1])}`;
  for (let i = 1; i < q.length - 1; i++) {
    const mx = (q[i][0] + q[i + 1][0]) / 2;
    const my = (q[i][1] + q[i + 1][1]) / 2;
    d += ` Q${n1(q[i][0])},${n1(q[i][1])} ${n1(mx)},${n1(my)}`;
  }
  const e = q[q.length - 1];
  return `${d} L${n1(e[0])},${n1(e[1])}`;
}

function Icon({ i }: { i: number }) {
  const c = i === 5 ? 'ic on' : 'ic';
  return (
    <g transform="translate(12 10)" className={c}>
      {i === 0 && (
        <>
          <circle cx="6.5" cy="5.5" r="3" />
          <path d="M1,16 c0-4.6 11-4.6 11,0" />
          <circle cx="14" cy="6.5" r="2.3" />
          <path d="M13.6,11.2 c2.6,0 4.2,1.6 4.2,4.2" />
        </>
      )}
      {i === 1 && <path d="M3.5,1.5 h7 l4.5,4.5 v10.5 h-11.5 z M10.5,1.5 v4.5 h4.5 M6.5,10 h6 M6.5,13 h6" />}
      {i === 2 && <path d="M2,16.5 h14.5 M4.5,13.5 v-4 M9.2,13.5 v-9 M14,13.5 v-6" />}
      {i === 3 && <path d="M9,1.5 L11,7 L16.5,9 L11,11 L9,16.5 L7,11 L1.5,9 L7,7 Z" />}
      {i === 4 && (
        <>
          <rect x="3" y="8" width="12" height="8.5" rx="2" />
          <path d="M5.8,8 V5.4 a3.2,3.2 0 0 1 6.4,0 V8" />
        </>
      )}
      {i === 5 && (
        <>
          <path d="M1.5,6 V1.5 H6 M12,1.5 H16.5 V6 M16.5,12 V16.5 H12 M6,16.5 H1.5 V12" />
          <rect x="6.2" y="6.2" width="5.6" height="5.6" rx="1" className="fill" />
        </>
      )}
    </g>
  );
}

export function HeroScene({ labels, className = '' }: { labels: HeroSceneLabels; className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const pose0 = useMemo(() => pose(T_INIT), []);
  const a = poseAttrs(pose0);
  useSceneLoop(ref, pose, T, T_INIT, 'hero');

  const vb = `${VB.x} ${VB.y} ${VB.w} ${VB.h}`;
  const up = (s: string) => s.toLocaleUpperCase();

  /* grille du sol */
  const grid: string[] = [];
  for (let y = -720; y <= 720; y += 60) grid.push(`M${poly(P(-1500, y, -16))} L${poly(P(1700, y, -16))}`);
  for (let x = -1500; x <= 1700; x += 60) grid.push(`M${poly(P(x, -720, -16))} L${poly(P(x, 720, -16))}`);

  const riseA = P(-120, 0, 0);
  const riseB = P(1700, 0, 0);

  /* contenu de façade d'une brique */
  const face = (i: number) => {
    const w = SLOTS[i].w;
    const label = i < 5 ? labels.bricks[i] : labels.custom;
    return (
      <>
        <rect x="0" y="0" width={w} height={TH} rx="6" className={i === 5 ? 'l tile acc' : 'l tile'} />
        <Icon i={i} />
        <text x="38" y="27.5" className={i === 5 ? 'lab on' : 'lab'}>
          {label}
        </text>
        {i === 0 &&
          [0, 1, 2].map((j) => (
            <g key={j} transform={`translate(0 ${46 + j * 14})`}>
              <circle cx="20" cy="5" r="4.5" className="sk" />
              <rect x="31" y="1.5" width={[92, 118, 76][j]} height="7" rx="3.5" className="sk" />
              <rect x={31 + [92, 118, 76][j] + 8} y="1.5" width="30" height="7" rx="3.5" className="sk2" />
              <g {...a(`crm${j}`)}>
                <circle cx="213" cy="5" r="6" className="accs" />
                <path d="M210,5 l2.2,2.2 l4,-4.4" className="chk" />
              </g>
            </g>
          ))}
        {i === 1 && (
          <>
            {[0, 1, 2].map((j) => (
              <g key={j} transform={`translate(${14 + j * 50} 42)`}>
                <path d="M0,0 h29 l11,11 v31 h-40 z" className="l doc" />
                <path d="M29,0 v11 h11" className="l doc" />
                <rect x="7" y="16" width="24" height="4" rx="2" className="sk" />
                <rect x="7" y="24" width="18" height="4" rx="2" className="sk" />
                <rect x="7" y="32" width="22" height="4" rx="2" className="sk" />
              </g>
            ))}
            <g {...a('docTick')}>
              <circle cx="154" cy="44" r="7" className="accf" />
              <path d="M150.6,44 l2.4,2.4 l4.4,-4.8" className="chk w" />
            </g>
            <rect x="172" y="48" width="50" height="7" rx="3.5" className="sk" />
            <rect x="172" y="61" width="36" height="7" rx="3.5" className="sk2" />
            <rect x="172" y="74" width="44" height="7" rx="3.5" className="sk2" />
          </>
        )}
        {i === 2 && (
          <>
            {[0, 1].map((j) => (
              <g key={j} transform={`translate(${14 + j * 66} 42)`}>
                <rect x="0" y="0" width="58" height="42" rx="4" className="l card" />
                <rect x="8" y="8" width="24" height="4" rx="2" className="sk" />
              </g>
            ))}
            <g {...a('kpiS')}>
              <rect x="22" y="62" width="34" height="10" rx="3" className="sk" />
              <rect x="88" y="62" width="30" height="10" rx="3" className="sk" />
            </g>
            <g {...a('kpi')}>
              <text x="22" y="74" className="num">128</text>
              <text x="88" y="74" className="num">94 %</text>
            </g>
            <path d="M152,84 H298" className="l axis" />
            {[14, 22, 18, 28, 24, 34, 30].map((hh, j) => (
              <rect key={j} x={156 + j * 20} y={84 - hh} width="12" height={hh} rx="2" className="sk" />
            ))}
            <polyline
              {...a('chart')}
              points="162,68 182,60 202,64 222,52 242,56 262,46 284,42"
              pathLength={100}
              strokeDasharray="100"
              className="line"
            />
            <circle {...a('chartDot')} cx="284" cy="42" r="3.6" className="accf" />
          </>
        )}
        {i === 3 && (
          <>
            <rect x="14" y="43" width="84" height="15" rx="7.5" className="sk" />
            <g {...a('agentT')}>
              <rect x="110" y="64" width="36" height="17" rx="8.5" className="sk2" />
              <circle cx="120" cy="72.5" r="2" className="sk3" />
              <circle cx="128" cy="72.5" r="2" className="sk3" />
              <circle cx="136" cy="72.5" r="2" className="sk3" />
            </g>
            <g {...a('agentB')}>
              <rect x="46" y="64" width="100" height="17" rx="8.5" className="accs s" />
              <rect x="56" y="70" width="52" height="5" rx="2.5" className="accm" />
              <rect x="112" y="70" width="24" height="5" rx="2.5" className="accm" />
            </g>
          </>
        )}
        {i === 4 && (
          <>
            <circle cx="28" cy="63" r="14" className="l card" />
            <circle cx="28" cy="59" r="4.6" className="sk" />
            <path d="M19.5,71.5 c1.5,-6.5 15.5,-6.5 17,0" className="skl" />
            <rect x="52" y="45" width="94" height="14" rx="4" className="l card" />
            {[0, 1, 2, 3, 4].map((j) => (
              <circle key={j} cx={61 + j * 8} cy="52" r="1.9" className="sk3" />
            ))}
            <rect x="52" y="66" width="94" height="15" rx="4" className="sk" />
            <g {...a('lock')}>
              <rect x="52" y="66" width="94" height="15" rx="4" className="accf" />
              <path d="M94.5,73.5 l3,3 l5.5,-6" className="chk w" />
            </g>
          </>
        )}
        {i === 5 && (
          <>
            <rect x="14" y="46" width="70" height="8" rx="4" className="onb" />
            <rect x="92" y="46" width="52" height="8" rx="4" className="onb d" />
            <rect x="52" y="60" width="112" height="8" rx="4" className="onb" />
            <rect x="120" y="74" width="84" height="8" rx="4" className="onb" />
            <rect x="14" y="74" width="60" height="8" rx="4" className="onb d" />
            <path
              d={`M226,80 H296 ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((j) => `M${226 + j * 7},80 v-${j % 5 === 0 ? 9 : 5}`).join(' ')}`}
              className="rule"
            />
            <path d="M226,58 H296 M226,54 v8 M296,54 v8" className="rule" />
            <g clipPath="url(#hs-t5)">
              <g {...a('shine')}>
                <path d="M0,-10 L34,-10 L4,110 L-30,110 Z" className="shine" />
              </g>
            </g>
          </>
        )}
      </>
    );
  };

  return (
    <div className={`hs ${className}`}>
      <style>{CSS}</style>
      <div className="hs-stage">

      {/* Grille du sol : calque séparé, statique */}
      <svg className="hs-svg hs-grid" viewBox={vb} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <radialGradient id="hs-gm" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0.25" stopColor="#fff" stopOpacity="1" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id="hs-gmask" maskUnits="userSpaceOnUse" x="-1400" y="-1100" width="3000" height="2000">
            <ellipse cx="140" cy="-120" rx="1100" ry="700" fill="url(#hs-gm)" />
          </mask>
        </defs>
        <path d={grid.join(' ')} className="gridl" mask="url(#hs-gmask)" />
      </svg>

      <svg ref={ref} className="hs-svg" viewBox={vb} preserveAspectRatio="xMidYMid meet" role="img" aria-label={labels.alt}>
        <defs>
          <clipPath id="hs-mag">
            <rect x={n1(P(MAGX, CARRY_Y, 0)[0])} y="-1200" width="4000" height="2400" />
          </clipPath>
          <clipPath id="hs-rise">
            <polygon points={poly([riseA[0], riseA[1] + 2], [riseB[0], riseB[1] + 2], [riseB[0], -1400], [riseA[0], -1400])} />
          </clipPath>
          <clipPath id="hs-print">
            <rect {...a('print')} x="-40" y="-80" height="320" />
          </clipPath>
          <clipPath id="hs-t5">
            <rect x="0" y="0" width={SLOTS[5].w} height={TH} rx="6" />
          </clipPath>
        </defs>

        {/* ── Dalle ── */}
        <polygon className="shadow" points={poly(P(-760, -130, -16), P(1500, -130, -16), P(1500, 140, -16), P(-760, 140, -16))} transform="translate(0 30)" />
        <Box x={-760} y={-130} z={-16} w={2260} d={270} h={16} v="pf" />

        {/* ── Marquages au sol ── */}
        <polygon className="trap" points={poly(P(-4, -16, 0), P(504, -16, 0), P(504, 0, 0), P(-4, 0, 0))} />
        <path className="rail" d={`M${poly(P(-24, -16, 0))} L${poly(P(1490, -16, 0))} M${poly(P(-24, 0, 0))} L${poly(P(1490, 0, 0))}`} />
        <path className="cab" d={floorCurve([[-465, 82], [-465, 126], [-280, 128], [-90, 120], [-36, 84], [-10, 8]])} />
        <path {...a('flowA')} className="flow" d={floorCurve([[-465, 82], [-465, 126], [-280, 128], [-90, 120], [-36, 84], [-10, 8]])} />
        <path className="cab" d={floorCurve([[506, 6], [532, 52], [650, 76], [1490, 76]])} />
        <path {...a('flowB')} className="flow" d={floorCurve([[506, 6], [532, 52], [650, 76], [1490, 76]])} />
        <path className="cab" d={floorCurve([[715, -40], [715, 16], [738, 60], [790, 76]])} />
        <text transform={mFloor(-372, 96)} className="fl">{`01  ${up(labels.floorStock)}`}</text>
        <text transform={mFloor(16, 66)} className="fl">{`02  ${up(labels.floorBuild)}`}</text>
        <text transform={mFloor(640, 112)} className="fl">{`03  ${up(labels.floorLive)}`}</text>

        {/* ── Arrière-plan : baie serveur, montants arrière ── */}
        <Box x={684} y={-96} z={0} w={62} d={56} h={160} />
        <g transform={mFront(684, -40, 160)}>
          {[0, 1, 2, 3, 4].map((j) => (
            <g key={j} transform={`translate(0 ${10 + j * 29})`}>
              <rect x="6" y="0" width="50" height="21" rx="2" className="l card" />
              <circle {...(j < 4 ? a(`led${j}`) : {})} cx="14" cy="10.5" r="2.4" className="accf" />
              <path d="M24,7.5 H50 M24,13.5 H44" className="l thin" />
            </g>
          ))}
        </g>
        {[PXL, PXR].map((x) => (
          <g key={x}>
            <Box x={x - 13} y={PY0 - 6} z={0} w={26} d={26} h={4} v="mt" />
            <Box x={x - 7} y={PY0} z={0} w={14} d={14} h={BEAM_Z0} v="mt" />
          </g>
        ))}
        {[0, 1, 2].map((j) => {
          const c = P(715, -68, 172);
          const r = 11 + j * 10;
          return (
            <path key={j} {...a(`sig${j}`)} className="sig" d={`M${n1(c[0] - r)},${n1(c[1])} A${r},${r} 0 0 1 ${n1(c[0] + r)},${n1(c[1])}`} />
          );
        })}

        {/* ── Stock de briques ── */}
        <Box x={-540} y={-12} z={0} w={150} d={92} h={150} />
        <g transform={mSide(MAGX, 80, 150)}>
          <rect x="31" y="32" width="28" height="108" rx="2" className="dark" />
        </g>
        <g transform={mFront(-540, 80, 150)}>
          {[0, 1, 2].map((r) =>
            (r === 1 ? [22, 38.5, 71.5, 104.5] : [22, 55, 88]).map((bx, j) => (
              <rect key={`${r}-${j}`} x={bx} y={26 + r * 16} width={r === 1 && (j === 0 || j === 3) ? 13.5 : 30} height="13" rx="2" className="l brk" />
            )),
          )}
          <text x="22" y="100" className="cap">{up(labels.stock)}</text>
          <circle cx="25" cy="118" r="2.6" className="accf" />
          <circle cx="36" cy="118" r="2.6" className="sk3" />
          <circle cx="47" cy="118" r="2.6" className="sk3" />
          <path d="M96,96 H128 M96,103 H128 M96,110 H128 M96,117 H128" className="l thin" />
        </g>

        {/* ── Convoyeur ── */}
        <Box x={-392} y={24} z={2} w={378} d={22} h={8} v="mt" />
        <path {...a('belt')} className="beltd" d={`M${poly(P(-388, 35, BELT_TOP))} L${poly(P(-16, 35, BELT_TOP))}`} />
        <g transform={mFront(-392, 46, BELT_TOP)}>
          {Array.from({ length: 16 }, (_, j) => (
            <circle key={j} cx={10 + j * 24} cy="4" r="1.9" className="l roll" />
          ))}
        </g>

        {/* ── La fenêtre de l'application ── */}
        <polygon {...a('wallSh')} className="shadow s2" points={poly(P(0, 2, 0), P(500, 2, 0), P(500, 34, 0), P(0, 34, 0))} />
        <g clipPath="url(#hs-rise)">
          <g {...a('wall')}>
            <Box x={0} y={-16} z={0} w={W} d={16} h={H} v="fr" />
            <g transform={mFront(0, 0, H)}>
              <rect x="0" y="0" width={W} height={H} rx="9" className="l wface" />
              <path d={`M0,34 V9 a9,9 0 0 1 9,-9 H${W - 9} a9,9 0 0 1 9,9 V34 Z`} className="l tbar" />
              <circle cx="17" cy="17" r="4" className="l dot" />
              <circle cx="31" cy="17" r="4" className="l dot" />
              <circle cx="45" cy="17" r="4" className="l dot" />
              <text x="62" y="22.3" className="ttl">{labels.appTitle}</text>
              <g {...a('pillB')}>
                <rect x="382" y="7" width="108" height="20" rx="10" className="l pillb" />
                <text x="436" y="20.8" textAnchor="middle" className="cap">{up(labels.building)}</text>
              </g>
              <g {...a('pillL')}>
                <rect x="394" y="7" width="96" height="20" rx="10" className="accs s" />
                <circle cx="407" cy="17" r="3.6" className="accf" />
                <text x="416" y="21.4" className="livet">{labels.live}</text>
              </g>
              {SLOTS.slice(0, 5).map((s, i) => (
                <rect key={i} x={s.u} y={s.v} width={s.w} height={TH} rx="6" className="slot" />
              ))}
              <g {...a('measure')}>
                <rect {...a('measDash')} x={SLOTS[5].u} y={SLOTS[5].v} width={SLOTS[5].w} height={TH} rx="6" className="mslot" />
                <path d="M198,114 H472 M198,107 V121 M472,107 V121 M198,114 l8,-4.5 M198,114 l8,4.5 M472,114 l-8,-4.5 M472,114 l-8,4.5" className="mdim" />
                <text x="335" y="96" textAnchor="middle" className="mtxt">{labels.measure}</text>
              </g>
              <g {...a('wallGlow')}>
                <rect x="-2" y="-2" width={W + 4} height={H + 4} rx="11" className="glow2" />
                <rect x="-1" y="-1" width={W + 2} height={H + 2} rx="10" className="glow1" />
              </g>
              <rect {...a('ring')} x="-4" y="-4" width={W + 8} height={H + 8} rx="13" className="glow1" />
            </g>
          </g>
        </g>

        {/* ── Les briques ── */}
        <g clipPath="url(#hs-mag)">
          {SLOTS.map((s, i) => (
            <g key={i} {...a(`t${i}`)}>
              <g clipPath={i === 5 ? 'url(#hs-print)' : undefined}>
                <polygon {...a(`t${i}top`)} className={i === 5 ? 'l acct' : 'l ft'} />
                <polygon {...a(`t${i}side`)} className={i === 5 ? 'l accd' : 'l fs'} />
                <g transform={M_FACE}>
                  {face(i)}
                  <rect {...a(`t${i}fl`)} x="-2" y="-2" width={s.w + 4} height={TH + 4} rx="8" className="flash" />
                </g>
              </g>
            </g>
          ))}
        </g>

        {/* ── Portique ── */}
        <Box x={PXL - 8} y={PY0} z={BEAM_Z0} w={16} d={PY1 - PY0 + 14} h={22} v="mt" />
        <Box x={PXL + 8} y={23} z={BEAM_Z0} w={PXR - PXL - 16} d={22} h={22} v="mt" />
        <g transform={mFront(PXL + 8, 45, BEAM_Z0 + 22)}>
          <path d={`M4,16.5 H${PXR - PXL - 20}`} className="l thin" />
          {Array.from({ length: Math.floor((PXR - PXL - 40) / 60) }, (_, j) => (
            <circle key={j} cx={30 + j * 60} cy="7.5" r="1.5" className="l roll" />
          ))}
        </g>
        <Box x={PXR - 8} y={PY0} z={BEAM_Z0} w={16} d={PY1 - PY0 + 14} h={22} v="mt" />
        <g {...a('trolley')}>
          <g {...a('laser')}>
            <line x1="0" y1="0" x2="0" y2={TZ - BELT_TOP} className="laser2" />
            <line x1="0" y1="0" x2="0" y2={TZ - BELT_TOP} className="laser1" />
            <circle cx="0" cy={TZ - BELT_TOP - TH / 2} r="5" className="laserdot" />
          </g>
          <line {...a('cable')} x1="0" y1="0" x2="0" className="cable" />
          <g {...a('clamp')}>
            <g transform={M_FACE}>
              <rect x="-15" y="-1" width="30" height="6" rx="2" className="l mtf" />
            </g>
          </g>
          <Box x={-20} y={-10} z={0} w={40} d={20} h={9} v="mt" />
        </g>

        {/* ── Enseigne ── */}
        <Box x={208} y={31} z={BEAM_Z0 + 22} w={5} d={6} h={7} v="mt" />
        <Box x={468} y={31} z={BEAM_Z0 + 22} w={5} d={6} h={7} v="mt" />
        <Box x={176} y={30} z={BEAM_Z0 + 28} w={330} d={8} h={58} v="dk" />
        <g transform={mFront(176, 38, BEAM_Z0 + 86)}>
          <rect x="0" y="0" width="330" height="58" rx="3" className="signf" />
          <text {...a('sign')} x="165" y="40" textAnchor="middle" className="signg">MYAPPFACTORY</text>
          <text x="165" y="40" textAnchor="middle" className="signt">MYAPPFACTORY</text>
        </g>

        {/* ── Montants avant, balise ── */}
        {[PXL, PXR].map((x) => (
          <g key={x}>
            <Box x={x - 13} y={PY1 - 6} z={0} w={26} d={26} h={4} v="mt" />
            <Box x={x - 7} y={PY1} z={0} w={14} d={14} h={BEAM_Z0} v="mt" />
          </g>
        ))}
        <Box x={PXR - 6} y={PY1 + 1} z={BEAM_Z0 + 22} w={12} d={12} h={6} v="mt" />
        <g {...a('beacon')}>
          <circle cx={P(PXR, PY1 + 7, BEAM_Z0 + 33)[0]} cy={P(PXR, PY1 + 7, BEAM_Z0 + 33)[1]} r="13" className="beac2" />
          <circle cx={P(PXR, PY1 + 7, BEAM_Z0 + 33)[0]} cy={P(PXR, PY1 + 7, BEAM_Z0 + 33)[1]} r="5" className="beac1" />
        </g>
      </svg>
      </div>
    </div>
  );
}

const CSS = `${SCENE_CSS}
.hs-stage{position:absolute;inset:0;transform-origin:55% 50%}
@media (max-width:1023px){.hs-stage{transform:translate(-2%,5%) scale(1.14)}}
@media (max-width:639px){.hs-stage{transform:translate(-3%,2%) scale(1.85)}}
.hs .fr .ft{fill:var(--hs-mt1)}.hs .fr .fs{fill:var(--hs-mt2)}.hs .fr .ff{fill:var(--hs-front)}
.hs .trap{fill:var(--hs-ink);opacity:.1}
.hs .rail{fill:none;stroke:var(--hs-line);stroke-width:1;opacity:.35}
.hs .cab{fill:none;stroke:var(--hs-line);stroke-width:3.2;stroke-linecap:round;opacity:.28}
.hs .flow{fill:none;stroke:var(--hs-acc);stroke-width:2;stroke-linecap:round;stroke-dasharray:8 16}
.hs .fl{font-family:var(--font-mono),ui-monospace,monospace;font-size:15px;letter-spacing:3px;fill:var(--hs-muted);opacity:.8}
.hs .dark{fill:var(--hs-panel)}
.hs .brk{fill:var(--hs-sk2);stroke-width:.9}
.hs .beltd{fill:none;stroke:var(--hs-line);stroke-width:1.4;stroke-dasharray:9 9;opacity:.5}
.hs .roll{fill:var(--hs-top);stroke-width:.9}
.hs .wface{fill:var(--hs-front)}.hs .tbar{fill:var(--hs-mt1)}
.hs .dot{fill:var(--hs-sk);stroke-width:.8}
.hs .ttl{font-size:14.5px;font-weight:600;fill:var(--hs-ink);letter-spacing:-.1px}
.hs .pillb{fill:none;stroke-width:.9;opacity:.6}
.hs .livet{font-size:12.5px;font-weight:600;fill:var(--hs-acc)}
.hs .slot{fill:var(--hs-ink);fill-opacity:.025;stroke:var(--hs-line);stroke-width:1;stroke-dasharray:4 5;stroke-opacity:.45}
.hs .mslot{fill:var(--hs-acc);fill-opacity:.08;stroke:var(--hs-acc);stroke-width:1.7;stroke-dasharray:7 5}
.hs .mdim{fill:none;stroke:var(--hs-acc);stroke-width:1.3;stroke-linecap:round}
.hs .mtxt{font-family:var(--font-mono),ui-monospace,monospace;font-size:14.5px;letter-spacing:1.2px;fill:var(--hs-acc);font-weight:500}
.hs .glow1{fill:none;stroke:var(--hs-acc);stroke-width:2.4}
.hs .glow2{fill:none;stroke:var(--hs-acc);stroke-width:10;opacity:.16}
.hs .tile{fill:var(--hs-top)}.hs .tile.acc{fill:var(--hs-acc);stroke:var(--hs-acc-d)}
.hs .acct{fill:var(--hs-acc-t);stroke:var(--hs-acc-d)}.hs .accd{fill:var(--hs-acc-d);stroke:var(--hs-acc-d)}
.hs .lab{font-size:19.5px;font-weight:600;fill:var(--hs-ink);letter-spacing:-.3px}.hs .lab.on{fill:var(--hs-on)}
.hs .ic{fill:none;stroke:var(--hs-acc);stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
.hs .ic.on{stroke:var(--hs-on)}.hs .ic .fill{fill:var(--hs-on);stroke:none}
.hs .doc{fill:var(--hs-top);stroke-width:.9;stroke-opacity:.6}
.hs .num{font-family:var(--font-mono),ui-monospace,monospace;font-size:13.5px;font-weight:600;fill:var(--hs-ink)}
.hs .axis{fill:none;stroke-width:.9;opacity:.4}
.hs .line{fill:none;stroke:var(--hs-acc);stroke-width:2.3;stroke-linecap:round;stroke-linejoin:round}
.hs .onb{fill:var(--hs-on);opacity:.9}.hs .onb.d{opacity:.38}
.hs .rule{fill:none;stroke:var(--hs-on);stroke-width:1.2;stroke-linecap:round;opacity:.8}
.hs .shine{fill:#fff;opacity:.22}
.hs .flash{fill:var(--hs-acc);fill-opacity:.16;stroke:var(--hs-acc);stroke-width:2.4}
.hs .cable{stroke:var(--hs-line);stroke-width:1.5}
.hs .mtf{fill:var(--hs-mt3)}
.hs .laser1{stroke:var(--hs-acc);stroke-width:1.6}.hs .laser2{stroke:var(--hs-acc);stroke-width:7;opacity:.18}
.hs .laserdot{fill:var(--hs-acc);opacity:.5}
.hs .signf{fill:var(--hs-panel);stroke:var(--hs-acc);stroke-width:1.4;stroke-opacity:.7}
.hs .signt,.hs .signg{font-family:var(--font-mono),ui-monospace,monospace;font-size:32px;font-weight:600;letter-spacing:3.4px}
.hs .signt{fill:#3fe3b6}
.hs .signg{fill:none;stroke:#00c896;stroke-width:7;stroke-linejoin:round;stroke-opacity:.3}
.hs .sig{fill:none;stroke:var(--hs-acc);stroke-width:2.2;stroke-linecap:round}
.hs .beac1{fill:var(--hs-acc)}.hs .beac2{fill:var(--hs-acc);opacity:.22}
`;
