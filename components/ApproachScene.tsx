'use client';

import { useMemo, useRef } from 'react';
import {
  Box, P, SCENE_CSS, clamp01, eio, eo, lerp, mFloor, mFront, n1, n2, poly, poseAttrs, ss, tr, useSceneLoop,
  type Pose,
} from './scene/kit';

/* ══════════════════════════════════════════════════════════════════════
   ApproachScene — l'animation de la section « Notre approche ».

   Un pack éprouvé arrive fermé, s'ouvre en quatre couches (écrans, règles
   métier, IA, données), un balayage l'ajuste au métier du client couche
   par couche, puis il se referme et repart. Même dessin que le hero.

   Fonction pure du temps, comme HeroScene : voir components/scene/kit.tsx.
   ══════════════════════════════════════════════════════════════════════ */

export type ApproachSceneLabels = {
  alt: string;
  /** Du bas vers le haut : données, IA, règles métier, écrans. */
  layers: [string, string, string, string];
  hints: [string, string, string, string];
  pack: string;
  tailoring: string;
  tailored: string;
};

/* ───────── Géométrie ───────── */
const PW = 180; // une couche
const PD = 110;
const PT = 12;
const X0 = -PW / 2;
const Y0 = -PD / 2;
const SP = 68; // écart entre deux couches, pack ouvert
const N = 4;
const VB = { x: -172, y: -358, w: 520, h: 444 };

/* ───────── Ligne de temps (secondes) ───────── */
const T = 12;
const EXPL_S = 0.9;
const EXPL_D = 0.95;
const SCAN_S = 3.0;
const SCAN_D = 2.8;
const SCAN_E = SCAN_S + SCAN_D;
const CLOSE_S = 7.3;
const CLOSE_D = 0.9;
const EXIT_S = 10.2;
const EXIT_D = 0.9;
const EXIT_E = EXIT_S + EXIT_D;
const ENTER_S = 11.2;
const T_INIT = 6.3; // pack ouvert et ajusté : l'image qui dit tout
const SCAN_TOP = (N - 1) * (PT + SP) + PT + 14;
const SCAN_BOT = -8;
/** Instant où le balayage atteint la couche k. */
const tHit = (k: number) => SCAN_S + (SCAN_D * (SCAN_TOP - (k * (PT + SP) + PT))) / (SCAN_TOP - SCAN_BOT);

const back = (k: number) => {
  const c = 1.25;
  const x = k - 1;
  return 1 + (c + 1) * x * x * x + c * x * x;
};
/** Ouverture de la couche k : 0 fermé, 1 ouvert. */
function opening(k: number, t: number) {
  if (t < EXPL_S || t >= CLOSE_S + CLOSE_D) return 0;
  if (t < CLOSE_S) return back(clamp01((t - EXPL_S - 0.06 * (N - 1 - k)) / (EXPL_D - 0.2)));
  return 1 - eio((t - CLOSE_S) / CLOSE_D);
}

const linkPath = (k: number, gap: number) =>
  [22, 158]
    .map((u) => {
      const q = P(X0 + u, Y0 + 103, k * PT + PT);
      return `M${n1(q[0])},${n1(q[1])} v${n1(-gap)}`;
    })
    .join(' ');

function pose(t: number): Pose {
  const p: Pose = {};
  const TAU = Math.PI * 2;

  /* le pack entre, puis repart */
  let sx = 0;
  let bop = 1;
  if (t >= EXIT_S && t < EXIT_E) {
    const k = (t - EXIT_S) / EXIT_D;
    sx = 250 * k * k;
    bop = 1 - ss(0.45, 1, k);
  } else if (t >= EXIT_E && t < ENTER_S) {
    bop = 0;
  } else if (t >= ENTER_S) {
    const k = (t - ENTER_S) / (T - ENTER_S);
    sx = -230 * (1 - eo(k));
    bop = ss(0, 0.45, k);
  }
  p.brick = { transform: tr(P(sx, 0, 0)), opacity: n2(bop) };

  /* couches */
  const offs = [0, 1, 2, 3].map((k) => k * SP * opening(k, t));
  const closed = CLOSE_S + CLOSE_D;
  for (let k = 0; k < N; k++) {
    const move = `translate(0 ${n1(-offs[k])})`;
    p[`pl${k}`] = { transform: move };
    const d = 0.07 * (N - 1 - k);
    p[`lb${k}`] = {
      transform: move,
      opacity: n2(ss(EXPL_S + 0.7 + d, EXPL_S + 1.05 + d, t) * (1 - ss(CLOSE_S, CLOSE_S + 0.3, t))),
    };
    const h = tHit(k);
    const c = t >= h && t < EXIT_E ? ss(h, h + 0.35, t) : 0;
    p[`cu${k}`] = { opacity: n2(c) };
    if (k !== 1) p[`ed${k}`] = { opacity: n2(c) };
    let f = 0;
    if (t >= h && t < h + 0.55) f = 1 - (t - h) / 0.55;
    if (t >= closed && t < closed + 0.6) f = Math.max(f, (1 - (t - closed) / 0.6) * 0.8);
    p[`fl${k}`] = { opacity: n2(f) };
    if (k < N - 1) {
      const gap = Math.max(0, offs[k + 1] - offs[k]);
      p[`ln${k}`] = { d: linkPath(k, gap), opacity: n2(clamp01(gap / 24)), 'stroke-dashoffset': n1(-((t * 30) % 12)) };
    }
  }

  /* balayage de personnalisation */
  const zs = lerp(SCAN_TOP, SCAN_BOT, clamp01((t - SCAN_S) / SCAN_D));
  p.scan = {
    transform: `translate(0 ${n1(-zs)})`,
    opacity: n2(ss(SCAN_S, SCAN_S + 0.2, t) * (1 - ss(SCAN_E - 0.25, SCAN_E, t))),
  };

  /* étiquette d'état : pack éprouvé → personnalisation → ajusté */
  const g = t < EXIT_E ? 1 - ss(EXIT_S + 0.45, EXIT_E, t) : 0;
  const a1 = ss(SCAN_S, SCAN_S + 0.25, t) * g;
  const done = ss(SCAN_E, SCAN_E + 0.25, t);
  p.pill0 = { opacity: n2(1 - a1) };
  p.pill1 = { opacity: n2(a1 * (1 - done)) };
  p.pill2 = { opacity: n2(done * g) };

  p.ai = { opacity: n2(0.55 + 0.45 * Math.sin((t / T) * TAU * 6)) };
  return p;
}

export function ApproachScene({ labels, className = '' }: { labels: ApproachSceneLabels; className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const pose0 = useMemo(() => pose(T_INIT), []);
  const a = poseAttrs(pose0);
  useSceneLoop(ref, pose, T, T_INIT, 'approach');

  const vb = `${VB.x} ${VB.y} ${VB.w} ${VB.h}`;
  const grid: string[] = [];
  for (let y = -440; y <= 440; y += 44) grid.push(`M${poly(P(-640, y, -12))} L${poly(P(640, y, -12))}`);
  for (let x = -640; x <= 640; x += 44) grid.push(`M${poly(P(x, -440, -12))} L${poly(P(x, 440, -12))}`);

  const topPts = (k: number) => {
    const z = k * PT + PT;
    return poly(P(X0, Y0, z), P(X0 + PW, Y0, z), P(X0 + PW, Y0 + PD, z), P(X0, Y0 + PD, z));
  };

  /* ce qui est dessiné sur le dessus de chaque couche */
  const content = (k: number) => {
    if (k === 3)
      return (
        <>
          <rect x="12" y="28" width="156" height="70" rx="5" className="l win" />
          <path d="M12,40 H168" className="l thin" />
          {[19, 25, 31].map((cx) => (
            <circle key={cx} cx={cx} cy="34" r="1.8" className="sk3" />
          ))}
          <rect x="18" y="46" width="24" height="46" rx="3" className="sk" />
          <rect x="48" y="46" width="54" height="20" rx="3" className="sk" />
          <rect x="108" y="46" width="54" height="20" rx="3" className="sk2" />
          <rect x="48" y="72" width="114" height="20" rx="3" className="sk2" />
          <g {...a('cu3')}>
            <rect x="108" y="46" width="54" height="20" rx="3" className="accf" />
            <rect x="114" y="52" width="28" height="3.6" rx="1.8" className="onf" />
            <rect x="114" y="58.5" width="18" height="3.6" rx="1.8" className="onf d" />
            <circle cx="161" cy="34" r="2.6" className="accf" />
          </g>
        </>
      );
    if (k === 2)
      return (
        <>
          <path d="M50,66 C62,66 60,46 72,46 M108,46 C120,46 118,66 130,66 M50,66 C62,66 60,88 72,88 M108,88 C120,88 118,66 130,66" className="l wire" />
          {[
            [14, 56],
            [72, 36],
            [72, 78],
            [130, 56],
          ].map(([x, y]) => (
            <g key={`${x}-${y}`}>
              <rect x={x} y={y} width="36" height="20" rx="5" className="l node" />
              <rect x={x + 8} y={y + 8} width="20" height="4" rx="2" className="sk" />
            </g>
          ))}
          <g {...a('cu2')}>
            <path d="M50,66 C62,66 60,88 72,88 M108,88 C120,88 118,66 130,66" className="wire acc" />
            <rect x="72" y="78" width="36" height="20" rx="5" className="accf" />
            <path d="M84.5,88.2 l3.6,3.6 l6.8,-7.2" className="chk w" />
          </g>
        </>
      );
    if (k === 1)
      return (
        <>
          <g {...a('ai')}>
            {[
              [38, 44],
              [38, 86],
              [142, 44],
              [142, 86],
              [90, 30],
              [90, 100],
            ].map(([x, y]) => (
              <path key={`${x}-${y}`} d={`M90,65 L${x},${y}`} className="ain" />
            ))}
          </g>
          {[
            [38, 44],
            [38, 86],
            [142, 44],
            [142, 86],
            [90, 100],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="3.4" className="accf" />
          ))}
          <circle cx="90" cy="65" r="14" className="accf" />
          <path d="M90,56 L92.4,62.6 L99,65 L92.4,67.4 L90,74 L87.6,67.4 L81,65 L87.6,62.6 Z" className="onf" />
        </>
      );
    return (
      <>
        {[0, 1, 2, 3].map((i) =>
          [0, 1, 2, 3].map((j) => (
            <rect key={`${i}-${j}`} x={14 + j * 39} y={36 + i * 15} width="34" height="10" rx="2.5" className={i === 0 ? 'sk3' : 'sk'} />
          )),
        )}
        <g {...a('cu0')}>
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={14 + 2 * 39} y={36 + i * 15} width="34" height="10" rx="2.5" className={i === 0 ? 'accf' : 'accm'} />
          ))}
        </g>
      </>
    );
  };

  const pillW = (s: string) => 42 + s.length * 7.1;
  const px = VB.x + 16;
  const py = VB.y + 16;

  return (
    <div className={`hs as ${className}`}>
      <style>{CSS}</style>
      <div className="as-stage">
        <svg className="hs-svg" viewBox={vb} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <defs>
            <radialGradient id="as-gm" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0.2" stopColor="#fff" stopOpacity="1" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
            <mask id="as-gmask" maskUnits="userSpaceOnUse" x="-700" y="-600" width="1400" height="1200">
              <ellipse cx="20" cy="-40" rx="430" ry="330" fill="url(#as-gm)" />
            </mask>
          </defs>
          <path d={grid.join(' ')} className="gridl" mask="url(#as-gmask)" />
        </svg>

        <svg ref={ref} className="hs-svg" viewBox={vb} preserveAspectRatio="xMidYMid meet" role="img" aria-label={labels.alt}>
          {/* ── Socle ── */}
          <polygon className="shadow" points={poly(P(-106, -72, -12), P(106, -72, -12), P(106, 72, -12), P(-106, 72, -12))} transform="translate(0 18)" />
          <Box x={-106} y={-72} z={-12} w={212} d={144} h={12} v="pf" />
          <polygon className="mark" points={poly(P(X0 - 7, Y0 - 7, 0), P(X0 + PW + 7, Y0 - 7, 0), P(X0 + PW + 7, Y0 + PD + 7, 0), P(X0 - 7, Y0 + PD + 7, 0))} />

          {/* ── Le pack ── */}
          <g {...a('brick')}>
            {[0, 1, 2, 3].map((k) => (
              <g key={k} {...a(`pl${k}`)}>
                <Box x={X0} y={Y0} z={k * PT} w={PW} d={PD} h={PT} v={k === 1 ? 'ai' : ''} />
                <g transform={mFloor(X0, Y0, k * PT + PT)}>{content(k)}</g>
                {k !== 1 && (
                  <g transform={mFront(X0, Y0 + PD, k * PT + PT)}>
                    <rect {...a(`ed${k}`)} x={[128, 0, 78, 18][k]} y="3" width="34" height="6" rx="2" className="accf" />
                  </g>
                )}
                <polygon {...a(`fl${k}`)} className="afl" points={topPts(k)} />
                {k < N - 1 && <path {...a(`ln${k}`)} className="alink" />}
              </g>
            ))}

            {/* balayage */}
            <g {...a('scan')}>
              <polygon className="scan" points={poly(P(-104, -69, 0), P(104, -69, 0), P(104, 69, 0), P(-104, 69, 0))} />
              <path className="scane" d={`M${poly(P(-104, 69, 0))} L${poly(P(104, 69, 0))} L${poly(P(104, -69, 0))}`} />
            </g>

            {/* légendes */}
            {[0, 1, 2, 3].map((k) => {
              const q = P(X0 + PW, 0, k * PT + PT / 2);
              return (
                <g key={k} {...a(`lb${k}`)}>
                  <path d={`M${n1(q[0])},${n1(q[1])} H146`} className="lead" />
                  <circle cx={n1(q[0])} cy={n1(q[1])} r="2.6" className="accf" />
                  <text x="153" y={n1(q[1] + 5)} className={k === 1 ? 'lname acc' : 'lname'}>
                    {labels.layers[k]}
                  </text>
                  <text x="153" y={n1(q[1] + 20)} className="lhint">
                    {labels.hints[k]}
                  </text>
                </g>
              );
            })}
          </g>

          {/* ── Étiquette d'état ── */}
          <g transform={`translate(${px} ${py})`}>
            <g {...a('pill0')}>
              <rect x="0" y="0" width={n1(pillW(labels.pack))} height="28" rx="14" className="l p0" />
              <path d="M11,14.4 l3.2,3.2 l6,-6.6" className="chk" />
              <text x="29" y="18.7" className="ptxt">{labels.pack}</text>
            </g>
            <g {...a('pill1')}>
              <rect x="0" y="0" width={n1(pillW(labels.tailoring))} height="28" rx="14" className="accs s" />
              <path d="M15.5,6.5 L17.4,12.1 L23,14 L17.4,15.9 L15.5,21.5 L13.6,15.9 L8,14 L13.6,12.1 Z" className="accf" />
              <text x="29" y="18.7" className="ptxt acc">{labels.tailoring}</text>
            </g>
            <g {...a('pill2')}>
              <rect x="0" y="0" width={n1(pillW(labels.tailored))} height="28" rx="14" className="accf" />
              <path d="M11,14.4 l3.2,3.2 l6,-6.6" className="chk w" />
              <text x="29" y="18.7" className="ptxt on">{labels.tailored}</text>
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

const CSS = `${SCENE_CSS}
.hs.as{--as-ai:#dcf2ea}
.dark .hs.as{--as-ai:#0f3a2e}
.as-stage{position:absolute;inset:0}
@media (max-width:639px){.as-stage{transform:scale(1.2);transform-origin:0% 50%}.hs .lhint{display:none}}
.hs .mark{fill:none;stroke:var(--hs-line);stroke-width:1;stroke-dasharray:3 5;opacity:.4}
.hs .ai .ft{fill:var(--as-ai);stroke:var(--hs-acc-d)}.hs .ai .ff{fill:var(--hs-acc);stroke:var(--hs-acc-d)}.hs .ai .fs{fill:var(--hs-acc-d);stroke:var(--hs-acc-d)}
.hs .win{fill:var(--hs-front);stroke-width:1}
.hs .node{fill:var(--hs-top);stroke-width:1}
.hs .wire{fill:none;stroke-width:1.1;opacity:.6}
.hs .wire.acc{stroke:var(--hs-acc);stroke-width:1.8;opacity:1;stroke-linecap:round}
.hs .ain{fill:none;stroke:var(--hs-acc);stroke-width:1.3;stroke-linecap:round}
.hs .onf{fill:var(--hs-on)}.hs .onf.d{opacity:.55}
.hs .afl{fill:var(--hs-acc);fill-opacity:.2;stroke:var(--hs-acc);stroke-width:2.2;stroke-linejoin:round}
.hs .alink{fill:none;stroke:var(--hs-acc);stroke-width:1.7;stroke-linecap:round;stroke-dasharray:3 9}
.hs .scan{fill:var(--hs-acc);fill-opacity:.12;stroke:var(--hs-acc);stroke-width:1.2;stroke-opacity:.6;stroke-linejoin:round}
.hs .scane{fill:none;stroke:var(--hs-acc);stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}
.hs .lead{fill:none;stroke:var(--hs-acc);stroke-width:1.1;opacity:.75}
.hs .lname{font-size:14.5px;font-weight:600;fill:var(--hs-ink);letter-spacing:-.15px}.hs .lname.acc{fill:var(--hs-acc)}
.hs .lhint{font-family:var(--font-mono),ui-monospace,monospace;font-size:10.5px;fill:var(--hs-muted);letter-spacing:.2px}
.hs .p0{fill:var(--hs-top);stroke-width:1}
.hs .ptxt{font-size:13px;font-weight:600;fill:var(--hs-ink)}.hs .ptxt.acc{fill:var(--hs-acc)}.hs .ptxt.on{fill:var(--hs-on)}
`;
