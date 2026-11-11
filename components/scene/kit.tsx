'use client';

import { useEffect, type RefObject } from 'react';

/* ══════════════════════════════════════════════════════════════════════
   Boîte à outils commune aux animations dessinées en code (hero, approche).

   - Projection axonométrique et matrices de plans (façade, flanc, sol).
   - Box : un pavé dessiné en trois faces.
   - useSceneLoop : rejoue pose(t) en boucle ; s'arrête hors écran, reste
     figé si le visiteur a désactivé les animations, et se fige sur une
     image avec ?hs=<secondes> dans l'adresse.
   - SCENE_CSS : couleurs (clair et sombre) et classes de base.
   ══════════════════════════════════════════════════════════════════════ */

export type V2 = [number, number];
export type Pose = Record<string, Record<string, string>>;

/* ───────── Projection (axonométrie douce : la façade reste lisible) ───────── */
export const EX: V2 = [0.9744, 0.225]; // axe x : vers la droite, légèrement vers le bas
export const EY: V2 = [-0.613, 0.514]; // axe y : vers le spectateur (bas-gauche)
export const P = (x: number, y: number, z: number): V2 => [
  x * EX[0] + y * EY[0],
  x * EX[1] + y * EY[1] - z,
];
export const n1 = (n: number) => String(Math.round(n * 10) / 10);
export const n2 = (n: number) => String(Math.round(n * 100) / 100);
export const poly = (...p: V2[]) => p.map((q) => `${n1(q[0])},${n1(q[1])}`).join(' ');
export const tr = (q: V2) => `translate(${n1(q[0])} ${n1(q[1])})`;
/** Plan de façade (y constant) : u le long de x, v vers le bas. */
export const mFront = (x: number, y: number, z: number) => {
  const [e, f] = P(x, y, z);
  return `matrix(${EX[0]} ${EX[1]} 0 1 ${n1(e)} ${n1(f)})`;
};
/** Flanc droit (x constant) : u vers l'arrière, v vers le bas. */
export const mSide = (x: number, y: number, z: number) => {
  const [e, f] = P(x, y, z);
  return `matrix(${-EY[0]} ${-EY[1]} 0 1 ${n1(e)} ${n1(f)})`;
};
/** Plan horizontal à la hauteur z : u le long de x, v vers le spectateur. */
export const mFloor = (x: number, y: number, z = 0) => {
  const [e, f] = P(x, y, z);
  return `matrix(${EX[0]} ${EX[1]} ${EY[0]} ${EY[1]} ${n1(e)} ${n1(f)})`;
};
export const M_FACE = `matrix(${EX[0]} ${EX[1]} 0 1 0 0)`;

/* ───────── Courbes d'animation ───────── */
export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const eio = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
export const eo = (k: number) => 1 - Math.pow(1 - k, 3);
export const ss = (a: number, b: number, x: number) => {
  const k = clamp01((x - a) / (b - a));
  return k * k * (3 - 2 * k);
};

/* ───────── Dessin ───────── */
export function Box({ x, y, z, w, d, h, v = '' }: { x: number; y: number; z: number; w: number; d: number; h: number; v?: string }) {
  const X = x + w;
  const Y = y + d;
  const Z = z + h;
  return (
    <g className={v}>
      <polygon className="l ft" points={poly(P(x, y, Z), P(X, y, Z), P(X, Y, Z), P(x, Y, Z))} />
      <polygon className="l fs" points={poly(P(X, y, Z), P(X, Y, Z), P(X, Y, z), P(X, y, z))} />
      <polygon className="l ff" points={poly(P(x, Y, Z), P(X, Y, Z), P(X, Y, z), P(x, Y, z))} />
    </g>
  );
}

/** Attributs de départ d'un élément animé (rendu serveur), repéré par data-k. */
export const poseAttrs = (pose0: Pose) => (k: string) => {
  const o = pose0[k] || {};
  const r: Record<string, string> = { 'data-k': k };
  for (const n in o) r[n === 'stroke-dashoffset' ? 'strokeDashoffset' : n] = o[n];
  return r;
};

type SeekMap = Record<string, (v: number) => void>;

/** Rejoue pose(t) en boucle sur les éléments [data-k] du SVG. */
export function useSceneLoop(ref: RefObject<SVGSVGElement>, pose: (t: number) => Pose, T: number, tInit: number, name: string) {
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const els = new Map<string, Element>();
    svg.querySelectorAll('[data-k]').forEach((el) => els.set(el.getAttribute('data-k') as string, el));
    const cache: Record<string, string> = {};
    const apply = (t: number) => {
      const p = pose(t);
      for (const k in p) {
        const el = els.get(k);
        if (!el) continue;
        const at = p[k];
        for (const n in at) {
          const id = `${k}|${n}`;
          if (cache[id] !== at[n]) {
            el.setAttribute(n, at[n]);
            cache[id] = at[n];
          }
        }
      }
    };

    const frozen = new URLSearchParams(window.location.search).get('hs');
    if (frozen !== null && !Number.isNaN(parseFloat(frozen))) {
      const seek = (v: number) => apply(((v % T) + T) % T);
      seek(parseFloat(frozen));
      // En mode figé seulement : permet de capturer la boucle image par image.
      const w = window as unknown as { __sceneSeek?: SeekMap };
      w.__sceneSeek = { ...(w.__sceneSeek || {}), [name]: seek };
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let visible = true;
    let last = performance.now();
    let t = tInit;
    const tick = (now: number) => {
      raf = 0;
      if (!visible) return;
      t = (t + Math.min(0.1, (now - last) / 1000)) % T;
      last = now;
      apply(t);
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible && !raf) {
          last = performance.now();
          raf = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.02 },
    );
    io.observe(svg);
    raf = requestAnimationFrame(tick);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [ref, pose, T, tInit, name]);
}

export const SCENE_CSS = `
.hs{--hs-line:rgba(38,38,34,.74);--hs-top:#fff;--hs-front:#f7f3ec;--hs-side:#e7e1d6;--hs-floor:#fcfaf6;--hs-floor2:#eee9df;
--hs-mt1:#f1ede6;--hs-mt2:#dfd9ce;--hs-mt3:#e9e4db;--hs-grid:rgba(10,10,10,.075);--hs-ink:#0a0a0a;--hs-muted:#77776f;
--hs-sk:#e6e1d7;--hs-sk2:#efebe3;--hs-sk3:#c9c3b7;--hs-panel:#0d0e0d;--hs-acc:var(--accent);--hs-acc-d:#008c69;--hs-acc-t:#3fc4a2;
--hs-on:#fff;--hs-shadow:rgba(40,30,10,.07);pointer-events:none}
.dark .hs{--hs-line:rgba(232,232,224,.5);--hs-top:#242524;--hs-front:#1a1b1a;--hs-side:#111211;--hs-floor:#141514;--hs-floor2:#0c0d0c;
--hs-mt1:#2a2b2a;--hs-mt2:#161716;--hs-mt3:#1f201f;--hs-grid:rgba(255,255,255,.06);--hs-ink:#fff;--hs-muted:#9b9b93;
--hs-sk:#353635;--hs-sk2:#2c2d2c;--hs-sk3:#5a5b58;--hs-panel:#040404;--hs-acc-d:#00a37a;--hs-acc-t:#5fe0bd;--hs-on:#04140f;--hs-shadow:rgba(0,0,0,.35)}
.hs-svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.hs-svg text{font-family:var(--font-inter),system-ui,sans-serif;text-rendering:geometricPrecision}
.hs .l{stroke:var(--hs-line);stroke-width:1.3;stroke-linejoin:round;stroke-linecap:round}
.hs .thin{fill:none;stroke-width:.9;opacity:.6}
.hs .ft{fill:var(--hs-top)}.hs .ff{fill:var(--hs-front)}.hs .fs{fill:var(--hs-side)}
.hs .pf .ft{fill:var(--hs-floor)}.hs .pf .ff,.hs .pf .fs{fill:var(--hs-floor2)}
.hs .mt .ft{fill:var(--hs-mt1)}.hs .mt .ff{fill:var(--hs-mt3)}.hs .mt .fs{fill:var(--hs-mt2)}
.hs .dk .ft,.hs .dk .fs,.hs .dk .ff{fill:var(--hs-panel)}
.hs .gridl{fill:none;stroke:var(--hs-grid);stroke-width:1}
.hs .shadow{fill:var(--hs-shadow)}.hs .shadow.s2{opacity:.9}
.hs .cap{font-family:var(--font-mono),ui-monospace,monospace;font-size:10.5px;letter-spacing:1.6px;fill:var(--hs-muted)}
.hs .card{fill:none;stroke-width:1;opacity:.55}
.hs .sk{fill:var(--hs-sk)}.hs .sk2{fill:var(--hs-sk2)}.hs .sk3{fill:var(--hs-sk3)}
.hs .skl{fill:none;stroke:var(--hs-sk3);stroke-width:1.6;stroke-linecap:round}
.hs .accf{fill:var(--hs-acc)}.hs .accm{fill:var(--hs-acc);opacity:.55}
.hs .accs{fill:var(--hs-acc);fill-opacity:.13}.hs .accs.s{stroke:var(--hs-acc);stroke-opacity:.55;stroke-width:1}
.hs .chk{fill:none;stroke:var(--hs-acc);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}.hs .chk.w{stroke:var(--hs-on)}
`;
