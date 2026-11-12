'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Gift, Mail, Plus, Send, Sparkles } from 'lucide-react';
import { SectionLabel } from './ui/SectionLabel';

/* Chaque réalisation montre un écran reconstitué du produit, dessiné en code :
   lisible à la taille de la carte, dans les couleurs du site, sans nom de marque tierce.
   Les données affichées sont des exemples.

   Au survol de la carte (ou à son arrivée à l'écran sur un appareil tactile), l'écran
   rejoue le geste clé du produit : `play` augmente d'un cran, la démo est remontée et
   ses animations CSS (demo-* dans globals.css) repartent du début. Au repos, l'écran
   montre l'état final. */

type T = ReturnType<typeof useTranslations>;
type DemoProps = { t: T; play: number };

type AppItem = {
  key: 'harold' | 'telle' | 'leo';
  href: string;
  Demo: (props: DemoProps) => JSX.Element;
};

/** Style d'animation d'un élément, seulement quand la démo est rejouée. */
const anim = (play: number, name: string, delay: number, dur = 0.45): CSSProperties | undefined =>
  play ? { animation: `${name} ${dur}s cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}s both` } : undefined;

/** Compteur qui monte de 0 à la valeur quand la démo est rejouée. */
function useCountUp(target: number, play: number, delay = 0, duration = 900) {
  const [value, setValue] = useState(play ? 0 : target);
  useEffect(() => {
    if (!play) return;
    let raf = 0;
    const t0 = performance.now() + delay;
    const tick = (now: number) => {
      const k = Math.min(1, Math.max(0, (now - t0) / duration));
      setValue(Math.round(target * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [play, target, delay, duration]);
  return value;
}

/** HaRold : le score du candidat monte, le rapport d'adéquation s'écrit. */
function HaroldDemo({ t, play }: DemoProps) {
  const score = useCountUp(87, play, 250, 1000);
  const people = [
    ['Sophie', t('demo.harold.s1'), true],
    ['Marc', t('demo.harold.s2'), false],
    ['Claire', t('demo.harold.s3'), false],
  ] as const;
  return (
    <div className="grid h-full grid-cols-[88px_minmax(0,1fr)] text-[11px] leading-tight">
      <div className="space-y-1.5 border-r border-border bg-bg/60 p-2">
        {people.map(([name, status, active], i) => (
          <div key={name} className={`rounded-md p-1.5 ${active ? 'bg-accent/10 ring-1 ring-accent/30' : ''}`} style={anim(play, 'demo-left', 0.05 + i * 0.07, 0.35)}>
            <div className="flex items-center gap-1.5">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-text/10 text-[8px] font-semibold">{name[0]}</span>
              <span className="font-medium">{name}</span>
            </div>
            <span className="mt-1 inline-block rounded bg-text/[0.06] px-1 py-px text-[8.5px] text-text-muted">{status}</span>
          </div>
        ))}
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2" style={anim(play, 'demo-in', 0.15)}>
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-bg">SM</span>
            <div className="min-w-0">
              <div className="text-[12px] font-semibold">Sophie M.</div>
              <div className="text-[9.5px] leading-snug text-text-muted">{t('demo.harold.role')}</div>
            </div>
          </div>
          <div className="shrink-0 font-mono" style={anim(play, 'demo-in', 0.25)}>
            <span className="inline-block min-w-[2ch] text-right text-[17px] font-semibold text-accent">{score}</span>
            <span className="text-[9px] text-text-muted">/100</span>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1.5" style={anim(play, 'demo-in', 0.45)}>
          <Sparkles className="h-3 w-3 shrink-0 text-accent" />
          <span className="truncate font-semibold">{t('demo.harold.report')}</span>
          <span
            className="ml-auto hidden shrink-0 rounded-full bg-accent/10 px-1.5 py-px text-[8.5px] font-medium text-accent min-[380px]:inline"
            style={anim(play, 'demo-pop', 1.25, 0.4)}
          >
            {t('demo.harold.grade')}
          </span>
        </div>
        <div className="mt-2.5 space-y-2">
          {[86, 70, 78].map((w, i) => (
            <div key={w} className="flex items-center gap-2">
              <span className="h-1 w-1 shrink-0 rounded-full bg-accent" style={anim(play, 'demo-pop', 0.6 + i * 0.18, 0.3)} />
              <span className="h-1.5 origin-left rounded-full bg-text/10" style={{ width: `${w}%`, ...anim(play, 'demo-grow', 0.62 + i * 0.18, 0.5) }} />
            </div>
          ))}
        </div>
        <div className="mt-3 inline-flex items-center gap-1 rounded-md bg-accent px-2 py-1 text-[9.5px] font-medium text-bg" style={anim(play, 'demo-pop', 1.4, 0.4)}>
          <Sparkles className="h-2.5 w-2.5" />
          {t('demo.harold.action')}
        </div>
      </div>
    </div>
  );
}

/** SaLLy : la question du client, la réponse, puis les trois suggestions. */
function SallyDemo({ t, play }: DemoProps) {
  const products = [
    ['49 €', 70],
    ['35 €', 54],
    ['62 €', 62],
  ] as const;
  return (
    <div className="grid h-full grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] text-[11px] leading-tight">
      <div className="flex flex-col gap-2 border-r border-border p-3">
        <div className="flex items-center gap-1.5">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[9px] font-semibold text-bg">S</span>
          <span className="font-semibold">SaLLy</span>
        </div>
        <div className="ml-auto max-w-[94%] rounded-xl rounded-br-sm bg-text/[0.06] px-2.5 py-1.5 text-[10.5px]" style={anim(play, 'demo-right', 0.1, 0.4)}>
          {t('demo.sally.ask')}
        </div>
        <div className="max-w-[94%] rounded-xl rounded-bl-sm border border-accent/30 bg-accent/10 px-2.5 py-1.5 text-[10.5px]" style={anim(play, 'demo-left', 0.75, 0.4)}>
          {t('demo.sally.reply')}
        </div>
        <div className="mt-auto flex items-center gap-1 rounded-full border border-border bg-bg px-2.5 py-1.5">
          <span className="h-1.5 w-16 rounded-full bg-text/10" />
          <Send className="ml-auto h-3 w-3 text-accent" />
        </div>
      </div>
      <div className="p-3">
        <div className="flex items-center gap-1.5 font-semibold" style={anim(play, 'demo-in', 0.95, 0.35)}>
          <Gift className="h-3 w-3 text-accent" />
          {t('demo.sally.suggestions')}
        </div>
        <div className="mt-2.5 space-y-2">
          {products.map(([price, w], i) => (
            <div key={price} className="flex items-center gap-2 rounded-lg border border-border bg-bg p-1.5" style={anim(play, 'demo-in', 1.1 + i * 0.16, 0.4)}>
              <span className="h-8 w-8 shrink-0 rounded-md bg-text/[0.07]" />
              <div className="min-w-0 flex-1">
                <span className="block h-1.5 rounded-full bg-text/10" style={{ width: `${w}%` }} />
                <span className="mt-1.5 block font-mono text-[9.5px] text-text-muted">{price}</span>
              </div>
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-bg" style={anim(play, 'demo-pop', 1.3 + i * 0.16, 0.35)}>
                <Plus className="h-3 w-3" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** LeO : les compteurs montent, les prospects avancent un par un. */
function LeoDemo({ t, play }: DemoProps) {
  const meetings = useCountUp(28, play, 100, 800);
  const leads = useCountUp(342, play, 200, 900);
  const rate = useCountUp(19, play, 300, 800);
  const kpis = [
    [t('demo.leo.k1'), String(meetings), true],
    [t('demo.leo.k2'), String(leads), false],
    [t('demo.leo.k3'), `${rate} %`, true],
  ] as const;
  const rows = [
    ['Julie M.', t('demo.leo.st1'), true],
    ['Marc D.', t('demo.leo.st2'), false],
    ['Sarah C.', t('demo.leo.st3'), false],
  ] as const;
  return (
    <div className="flex h-full flex-col gap-2.5 p-3 text-[11px] leading-tight">
      <div className="grid grid-cols-3 gap-2">
        {kpis.map(([label, value, accent], i) => (
          <div key={label} className="min-w-0 rounded-lg border border-border bg-bg px-2 py-1.5" style={anim(play, 'demo-in', 0.05 + i * 0.1, 0.35)}>
            <div className="truncate text-[8.5px] text-text-muted">{label}</div>
            <div className={`mt-0.5 font-mono text-[15px] font-semibold ${accent ? 'text-accent' : ''}`}>{value}</div>
          </div>
        ))}
      </div>
      <div className="flex-1 overflow-hidden rounded-lg border border-border">
        {rows.map(([name, status, on], i) => (
          <div key={name} className="flex items-center gap-2 border-b border-border px-2 py-[7px] last:border-b-0" style={anim(play, 'demo-in', 0.55 + i * 0.2, 0.4)}>
            <span className="w-[54px] shrink-0 font-medium">{name}</span>
            <span className="h-1.5 flex-1 origin-left rounded-full bg-text/[0.08]" style={anim(play, 'demo-grow', 0.65 + i * 0.2, 0.5)} />
            <span
              className={`shrink-0 rounded-full px-1.5 py-px text-[8.5px] font-medium ${on ? 'bg-accent/10 text-accent' : 'bg-text/[0.06] text-text-muted'}`}
              style={anim(play, 'demo-pop', 0.95 + i * 0.2, 0.35)}
            >
              {status}
            </span>
            <Mail className="h-3 w-3 shrink-0 text-accent/70" style={anim(play, 'demo-pop', 1.1 + i * 0.2, 0.35)} />
          </div>
        ))}
      </div>
    </div>
  );
}

const apps: AppItem[] = [
  { key: 'harold', href: 'https://harold-v5-web.onrender.com/bienvenue.html', Demo: HaroldDemo },
  { key: 'telle', href: 'https://tell-e.tech', Demo: SallyDemo },
  { key: 'leo', href: 'https://www.leoproject.live', Demo: LeoDemo },
];

export function Apps() {
  const t = useTranslations('apps');

  return (
    <section id="work" className="relative border-t border-border bg-surface py-20 md:py-24">
      <div className="container-x">
        <div className="max-w-2xl">
          <SectionLabel>{t('eyebrow')}</SectionLabel>
          <h2 className="mt-6 text-h1 font-semibold text-balance">{t('title')}</h2>
          <p className="mt-5 text-lg text-text-muted text-balance">{t('subtitle')}</p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {apps.map((app, i) => (
            <AppCard key={app.key} app={app} index={i} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AppCard({ app, index, t }: { app: AppItem; index: number; t: T }) {
  const [play, setPlay] = useState(0);
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.7 });
  const replay = () => {
    if (!reduce) setPlay((p) => p + 1);
  };

  // Sans souris (téléphone, tablette) : la démo se joue une fois quand la carte arrive à l'écran.
  useEffect(() => {
    if (inView && !reduce && window.matchMedia('(hover: none)').matches) setPlay((p) => p + 1);
  }, [inView, reduce]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      // sur tablette (2 colonnes), la troisième carte se centre au lieu de rester seule à gauche
      className={index === 2 ? 'min-w-0 md:col-span-2 md:mx-auto md:w-[calc(50%-0.75rem)] lg:col-span-1 lg:mx-0 lg:w-auto' : 'min-w-0'}
    >
      <a href={app.href} target="_blank" rel="noopener noreferrer" className="block h-full" onMouseEnter={replay} onFocus={replay}>
        <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-bg transition hover:border-accent/40 hover:shadow-lg hover:shadow-black/5">
          {/* Écran du produit, posé sur un présentoir */}
          <div className="border-b border-border bg-surface-2/70 px-5 pt-5">
            <div className="overflow-hidden rounded-t-lg border border-b-0 border-text/15 bg-surface shadow-[0_-6px_24px_-14px_rgb(var(--text-rgb)/0.25)] transition duration-300 group-hover:-translate-y-1 group-hover:border-accent/50">
              <div className="flex items-center gap-1.5 border-b border-border bg-bg px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-text/15 transition-colors duration-300 group-hover:bg-accent" />
                <span className="h-2 w-2 rounded-full bg-text/15" />
                <span className="h-2 w-2 rounded-full bg-text/15" />
                <span className="ml-2 font-mono text-[10px] text-text-muted">{t(`items.${app.key}.name`)}</span>
              </div>
              <div className="h-[196px] overflow-hidden" aria-hidden="true">
                <app.Demo key={play} t={t} play={play} />
              </div>
            </div>
          </div>

          <div className="flex flex-1 flex-col p-6">
            <div className="flex items-center justify-between gap-3">
              <p className="font-mono text-xs uppercase tracking-widest text-text-muted">{t(`items.${app.key}.category`)}</p>
              <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-accent">
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                Live
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <h3 className="text-xl font-semibold tracking-tight">{t(`items.${app.key}.name`)}</h3>
              <ArrowUpRight className="h-5 w-5 text-text-muted transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
            </div>
            <p className="mt-3 text-sm text-text-muted">{t(`items.${app.key}.description`)}</p>
          </div>
        </article>
      </a>
    </motion.div>
  );
}
