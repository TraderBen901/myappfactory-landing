'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import {
  ArrowUpRight, Brain, Building2, Calculator, Check, ChevronDown, Clock, Copy, Database, FileDown, FileText, Gift, Hash,
  History, Layers, Lock, MessageSquareText, PencilLine, Plus, Search, Send, ShieldCheck, Sparkles, Users,
} from 'lucide-react';
import { SectionLabel } from '../ui/SectionLabel';
import { Button } from '../ui/Button';

/* ══════════════════════════════════════════════════════════════════════
   Page de SaLLy, l'assistante commerciale qui prépare les devis.

   La démonstration du haut rejoue en boucle une demande réelle : le client
   écrit, SaLLy cherche dans le catalogue, puis le devis se construit ligne
   par ligne. Données d'exemple. La boucle s'arrête hors écran et ne tourne
   pas si le visiteur a désactivé les animations (l'état final reste affiché).
   ══════════════════════════════════════════════════════════════════════ */

const money = (n: number, locale: string) => {
  const [int, dec] = n.toFixed(2).split('.');
  return locale === 'fr'
    ? `${int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')},${dec} €`
    : `€${int.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${dec}`;
};

/** Montant qui monte de 0 à sa valeur quand il apparaît pendant la boucle. */
function Amount({ value, animate, locale, delay = 0 }: { value: number; animate: boolean; locale: string; delay?: number }) {
  const [v, setV] = useState(animate ? 0 : value);
  useEffect(() => {
    if (!animate) return;
    let raf = 0;
    const t0 = performance.now() + delay;
    const tick = (now: number) => {
      const k = Math.min(1, Math.max(0, (now - t0) / 700));
      setV(Math.round(value * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [animate, value, delay]);
  return <>{money(v, locale)}</>;
}

function Bottle({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 2.5h4v3l1.6 2.4c.6.9.9 1.9.9 3V19a2.5 2.5 0 0 1-2.5 2.5h-4A2.5 2.5 0 0 1 7.5 19v-8.1c0-1.1.3-2.1.9-3L10 5.5z" />
      <path d="M7.5 12.5h9" />
    </svg>
  );
}

// Durée de chaque étape de la démonstration, en millisecondes.
const DUR = [700, 1200, 1800, 1500, 800, 800, 1300, 4500];
const LAST = DUR.length - 1;

function QuoteDemo() {
  const t = useTranslations('sally.demo');
  const locale = useLocale();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const [step, setStep] = useState(LAST);
  // Tant que la boucle n'a pas redémarré, l'état final est affiché sans animation d'entrée.
  const [played, setPlayed] = useState(false);

  useEffect(() => {
    if (reduce || !inView) return;
    const id = setTimeout(() => {
      setPlayed(true);
      setStep((s) => (s + 1) % DUR.length);
    }, DUR[step]);
    return () => clearTimeout(id);
  }, [step, inView, reduce]);

  const a = (name: string, delay = 0, dur = 0.45): CSSProperties | undefined =>
    played ? { animation: `${name} ${dur}s cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}s both` } : undefined;

  const products = [
    [t('p1'), 8],
    [t('p2'), 9.5],
    [t('p3'), 6.2],
  ] as const;
  const onQuote = step >= 4;

  return (
    <div ref={ref} role="img" aria-label={t('alt')}>
      <div className="overflow-hidden rounded-2xl border border-text/15 bg-surface shadow-[0_24px_60px_-30px_rgb(var(--text-rgb)/0.35)]">
        <div className="flex items-center gap-1.5 border-b border-border bg-bg px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-accent" />
          <span className="h-2.5 w-2.5 rounded-full bg-text/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-text/15" />
          <span className="ml-2 font-mono text-[11px] text-text-muted">SaLLy</span>
        </div>

        <div className="grid grid-cols-1 text-[12.5px] leading-snug sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]" aria-hidden="true">
          {/* ── La conversation ── */}
          <div className="flex h-[260px] flex-col gap-2.5 border-b border-border p-4 sm:h-[400px] sm:border-b-0 sm:border-r">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-bg">S</span>
              <span className="font-semibold">SaLLy</span>
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            </div>

            {step >= 1 && (
              <div className="ml-auto max-w-[88%] rounded-2xl rounded-br-sm bg-text/[0.06] px-3 py-2" style={a('demo-right', 0, 0.4)}>
                {t('ask')}
              </div>
            )}
            {step === 2 && (
              <div className="flex max-w-[88%] items-center gap-2 self-start rounded-2xl rounded-bl-sm border border-border bg-bg px-3 py-2 text-text-muted" style={a('demo-left', 0, 0.35)}>
                <Search className="h-3.5 w-3.5 shrink-0 text-accent" />
                <span>{t('searching')}</span>
                <span className="flex gap-0.5">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="h-1 w-1 animate-pulse rounded-full bg-text-muted" style={{ animationDelay: `${i * 0.18}s` }} />
                  ))}
                </span>
              </div>
            )}
            {step >= 3 && (
              <div className="max-w-[88%] self-start rounded-2xl rounded-bl-sm border border-accent/30 bg-accent/10 px-3 py-2" style={a('demo-left', 0, 0.4)}>
                {t('proposal')}
              </div>
            )}
            {step >= 7 && (
              <div className="max-w-[88%] self-start rounded-2xl rounded-bl-sm border border-accent/30 bg-accent/10 px-3 py-2" style={a('demo-left', 0, 0.4)}>
                {t('ready')}
              </div>
            )}

            <div className="mt-auto flex items-center gap-2 rounded-full border border-border bg-bg px-3.5 py-2 text-text-muted/70">
              <span className="truncate">{t('placeholder')}</span>
              <Send className="ml-auto h-3.5 w-3.5 shrink-0 text-accent" />
            </div>
          </div>

          {/* ── Le catalogue, puis le devis ── */}
          <div className="flex h-[300px] flex-col p-4 sm:h-[400px]">
            <div className="flex gap-1 rounded-lg bg-bg p-1 text-[11.5px] font-medium">
              {[
                [t('tabCatalog'), !onQuote],
                [t('tabQuote'), onQuote],
              ].map(([label, active]) => (
                <span
                  key={label as string}
                  className={`flex-1 rounded-md px-2 py-1.5 text-center transition-colors duration-300 ${active ? 'bg-surface text-text shadow-sm' : 'text-text-muted'}`}
                >
                  {label}
                </span>
              ))}
            </div>

            {!onQuote ? (
              <div className="mt-3 space-y-2">
                {products.map(([name, price], i) => {
                  const shown = step >= 2;
                  const picked = step >= 3 && i === 0;
                  return (
                    <div
                      key={name}
                      className={`flex items-center gap-3 rounded-xl border p-2.5 transition-colors duration-300 ${
                        picked ? 'border-accent bg-accent/[0.06]' : 'border-border bg-bg'
                      } ${shown ? '' : 'opacity-40'}`}
                      style={shown ? a('demo-in', 0.15 + i * 0.16, 0.4) : undefined}
                    >
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${shown ? 'bg-text/[0.06] text-text-muted' : 'bg-text/[0.06] text-transparent'}`}>
                        <Bottle className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        {shown ? (
                          <>
                            <div className="truncate font-medium">{name}</div>
                            <div className="mt-0.5 font-mono text-[11px] text-text-muted">
                              {money(price, locale)} · {t('unit')}
                            </div>
                          </>
                        ) : (
                          <>
                            <span className="block h-2 w-3/4 rounded-full bg-text/10" />
                            <span className="mt-2 block h-2 w-1/3 rounded-full bg-text/10" />
                          </>
                        )}
                      </div>
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                          picked ? 'bg-accent text-bg' : 'border border-border text-text-muted'
                        }`}
                      >
                        {picked ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : <Plus className="h-3.5 w-3.5" />}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="mt-3 flex flex-1 flex-col" style={a('demo-in', 0, 0.35)}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold">{t('quote')}</span>
                    <span className="font-mono text-[11px] text-text-muted">D-2026-041</span>
                  </div>
                  <span
                    key={step >= 7 ? 'ready' : 'draft'}
                    className={`rounded-full px-2 py-0.5 text-[10.5px] font-medium ${
                      step >= 7 ? 'bg-accent/10 text-accent' : 'bg-text/[0.06] text-text-muted'
                    }`}
                    style={step >= 7 ? a('demo-pop', 0, 0.4) : undefined}
                  >
                    {step >= 7 ? t('statusReady') : t('statusDraft')}
                  </span>
                </div>

                <div className="mt-3 divide-y divide-border rounded-xl border border-border bg-bg">
                  <div className="flex items-center justify-between gap-3 px-3 py-2.5" style={a('demo-in', 0.1, 0.4)}>
                    <span className="min-w-0 truncate">{t('line1')}</span>
                    <span className="shrink-0 font-mono text-[11.5px]">{money(1600, locale)}</span>
                  </div>
                  {step >= 5 && (
                    <div className="flex items-center justify-between gap-3 px-3 py-2.5" style={a('demo-in', 0, 0.4)}>
                      <span className="min-w-0 truncate">{t('line2')}</span>
                      <span className="shrink-0 font-mono text-[11.5px]">{money(200, locale)}</span>
                    </div>
                  )}
                </div>

                {step >= 6 && (
                  <div className="mt-3 space-y-1.5 px-1" style={a('demo-in', 0, 0.4)}>
                    <div className="flex justify-between text-text-muted">
                      <span>{t('exVat')}</span>
                      <span className="font-mono text-[11.5px]">
                        <Amount value={1800} animate={played} locale={locale} />
                      </span>
                    </div>
                    <div className="flex justify-between text-text-muted">
                      <span>{t('vat')}</span>
                      <span className="font-mono text-[11.5px]">
                        <Amount value={378} animate={played} locale={locale} delay={120} />
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-2 text-[13.5px] font-semibold">
                      <span>{t('incVat')}</span>
                      <span className="font-mono text-accent">
                        <Amount value={2178} animate={played} locale={locale} delay={240} />
                      </span>
                    </div>
                  </div>
                )}

                {step >= 7 && (
                  <div className="mt-auto inline-flex items-center justify-center gap-2 self-stretch rounded-full bg-accent px-4 py-2 text-[12px] font-medium text-bg" style={a('demo-pop', 0.15, 0.4)}>
                    <FileDown className="h-3.5 w-3.5" />
                    {t('export')}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <p className="mt-3 text-right font-mono text-[10.5px] uppercase tracking-widest text-text-muted/70">{t('sample')}</p>
    </div>
  );
}

const reveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
} as const;

export function SallyLanding() {
  const t = useTranslations('sally');
  const locale = useLocale();
  const contact = `/${locale}#contact`;

  const problems = [
    { key: 'wait', Icon: Clock },
    { key: 'copy', Icon: Copy },
    { key: 'head', Icon: Brain },
  ] as const;
  const steps = ['understand', 'search', 'build'] as const;
  const features = [
    { key: 'talk', Icon: MessageSquareText },
    { key: 'select', Icon: Layers },
    { key: 'edit', Icon: PencilLine },
    { key: 'multi', Icon: Copy },
    { key: 'totals', Icon: Calculator },
    { key: 'pdf', Icon: FileDown },
  ] as const;
  const guardrails = [
    { key: 'prices', Icon: Database },
    { key: 'number', Icon: Hash },
    { key: 'isolation', Icon: Lock },
    { key: 'history', Icon: History },
  ] as const;
  const audiences = [
    { key: 'wholesale', Icon: Building2 },
    { key: 'gifts', Icon: Gift },
    { key: 'sales', Icon: Users },
  ] as const;
  const faq = ['q1', 'q2', 'q3', 'q4', 'q5'] as const;

  return (
    <>
      {/* ── Haut de page ─────────────────────────────── */}
      <section className="relative overflow-hidden bg-bg pb-16 pt-28 md:pb-24 md:pt-36">
        <div className="pointer-events-none absolute -right-40 top-10 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="container-x relative grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <SectionLabel>{t('hero.eyebrow')}</SectionLabel>
            <h1 className="mt-5 text-h1 font-semibold text-balance">
              {t('hero.title')} <span className="text-accent">{t('hero.titleAccent')}</span>
            </h1>
            <p className="mt-5 max-w-md text-base text-text-muted md:text-lg">{t('hero.subtitle')}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Button href={contact} variant="primary" size="md">
                {t('hero.ctaPrimary')}
              </Button>
              <Button href="#fonctionnement" variant="secondary" size="md" arrow={false}>
                {t('hero.ctaSecondary')}
              </Button>
            </div>
            <a href={`/${locale}`} className="mt-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-text-muted transition hover:text-accent">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
              {t('hero.tag')}
            </a>
          </div>
          <div className="lg:col-span-7">
            <QuoteDemo />
          </div>
        </div>
      </section>

      {/* ── Le problème ─────────────────────────────── */}
      <section className="relative border-t border-border bg-surface py-20 md:py-24">
        <div className="container-x">
          <div className="max-w-3xl">
            <SectionLabel>{t('problem.eyebrow')}</SectionLabel>
            <h2 className="mt-6 text-h1 font-semibold text-balance">{t('problem.title')}</h2>
            <p className="mt-5 text-lg text-text-muted text-balance">{t('problem.subtitle')}</p>
          </div>
          <div className="mt-12 grid divide-y divide-border border-y border-border md:grid-cols-3 md:divide-x md:divide-y-0">
            {problems.map(({ key, Icon }, i) => (
              <motion.div key={key} {...reveal} transition={{ duration: 0.5, delay: i * 0.1 }} className="py-8 md:px-8 md:py-10 md:first:pl-0 md:last:pr-0">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent-2/30 bg-accent-2/10 text-accent-2">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-semibold tracking-tight">{t(`problem.cards.${key}.title`)}</h3>
                <p className="mt-3 text-text-muted">{t(`problem.cards.${key}.body`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comment ça marche ─────────────────────────── */}
      <section id="fonctionnement" className="relative scroll-mt-20 border-t border-border py-20 md:py-24">
        <div className="container-x">
          <div className="max-w-3xl">
            <SectionLabel>{t('steps.eyebrow')}</SectionLabel>
            <h2 className="mt-6 text-h1 font-semibold text-balance">{t('steps.title')}</h2>
          </div>
          <ol className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {steps.map((key, i) => (
              <motion.li
                key={key}
                {...reveal}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative flex flex-col rounded-2xl border border-border bg-surface p-6 md:p-7"
              >
                {/* petit schéma de l'étape */}
                <div className="flex h-36 items-center justify-center rounded-xl border border-border bg-bg p-4" aria-hidden="true">
                  {i === 0 && (
                    <div className="w-full max-w-[240px] space-y-3">
                      <div className="ml-auto h-8 w-[78%] rounded-2xl rounded-br-sm bg-text/[0.07]" />
                      <div className="flex flex-wrap gap-1.5">
                        {[t('steps.chip1'), t('steps.chip2'), t('steps.chip3')].map((c) => (
                          <span key={c} className="rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 font-mono text-[11px] text-accent">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {i === 1 && (
                    <div className="grid w-full max-w-[240px] grid-cols-4 gap-2">
                      {[0, 1, 2, 3, 4, 5, 6, 7].map((j) => (
                        <span
                          key={j}
                          className={`flex aspect-square items-center justify-center rounded-lg ${
                            j === 5 ? 'border border-accent bg-accent/10 text-accent' : 'bg-text/[0.06] text-text-muted/50'
                          }`}
                        >
                          {j === 5 ? <Search className="h-4 w-4" /> : <Bottle className="h-4 w-4" />}
                        </span>
                      ))}
                    </div>
                  )}
                  {i === 2 && (
                    <div className="w-full max-w-[220px] rounded-lg border border-border bg-surface p-3">
                      <div className="flex items-center justify-between">
                        <span className="h-2 w-12 rounded-full bg-text/15" />
                        <span className="font-mono text-[10px] text-text-muted">D-2026-041</span>
                      </div>
                      <div className="mt-3 space-y-2">
                        <div className="flex justify-between gap-3">
                          <span className="h-2 w-24 rounded-full bg-text/10" />
                          <span className="h-2 w-10 rounded-full bg-text/10" />
                        </div>
                        <div className="flex justify-between gap-3">
                          <span className="h-2 w-16 rounded-full bg-text/10" />
                          <span className="h-2 w-8 rounded-full bg-text/10" />
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between border-t border-border pt-2">
                        <span className="h-2 w-10 rounded-full bg-text/15" />
                        <span className="font-mono text-[11px] font-semibold text-accent">{money(2178, locale)}</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-bg font-mono text-xs font-semibold text-accent">
                    0{i + 1}
                  </span>
                  <h3 className="text-xl font-semibold tracking-tight">{t(`steps.items.${key}.title`)}</h3>
                </div>
                <p className="mt-3 text-text-muted">{t(`steps.items.${key}.body`)}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Ce que SaLLy sait faire ───────────────────── */}
      <section className="relative border-t border-border bg-surface py-20 md:py-24">
        <div className="container-x">
          <div className="max-w-3xl">
            <SectionLabel>{t('features.eyebrow')}</SectionLabel>
            <h2 className="mt-6 text-h1 font-semibold text-balance">{t('features.title')}</h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ key, Icon }, i) => (
              <motion.div key={key} {...reveal} transition={{ duration: 0.45, delay: (i % 3) * 0.08 }} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-bg text-accent">
                  <Icon className="h-[18px] w-[18px]" />
                </div>
                <div>
                  <h3 className="font-semibold tracking-tight">{t(`features.items.${key}.title`)}</h3>
                  <p className="mt-1.5 text-sm text-text-muted">{t(`features.items.${key}.body`)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Les garde-fous ────────────────────────────── */}
      <section className="relative border-t border-border py-20 md:py-24">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5">
              <SectionLabel>{t('guardrails.eyebrow')}</SectionLabel>
              <h2 className="mt-6 text-h1 font-semibold text-balance">{t('guardrails.title')}</h2>
              <p className="mt-5 text-lg text-text-muted text-balance">{t('guardrails.subtitle')}</p>
              <div className="mt-8 flex items-start gap-3 rounded-xl border border-accent/30 bg-accent/10 p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <p className="text-sm font-medium">{t('guardrails.closing')}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
              {guardrails.map(({ key, Icon }, i) => (
                <motion.div key={key} {...reveal} transition={{ duration: 0.45, delay: (i % 2) * 0.08 }} className="rounded-2xl border border-border bg-surface p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-accent/30 bg-accent/10 text-accent">
                    <Icon className="h-[18px] w-[18px]" />
                  </div>
                  <h3 className="mt-5 font-semibold tracking-tight">{t(`guardrails.cards.${key}.title`)}</h3>
                  <p className="mt-2 text-sm text-text-muted">{t(`guardrails.cards.${key}.body`)}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Avec vos outils ───────────────────────────── */}
      <section className="relative border-t border-border bg-surface py-20 md:py-24">
        <div className="container-x grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <SectionLabel>{t('tools.eyebrow')}</SectionLabel>
            <h2 className="mt-6 text-h1 font-semibold text-balance">{t('tools.title')}</h2>
            <p className="mt-5 text-lg text-text-muted text-balance">{t('tools.body')}</p>
            <p className="mt-8 text-sm text-text-muted">{t('tools.platform')}</p>
            <a href={`/${locale}`} className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-accent transition hover:underline">
              {t('tools.platformLink')}
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
          <motion.div {...reveal} transition={{ duration: 0.5 }} className="lg:col-span-7" aria-hidden="true">
            <div className="rounded-2xl border border-border bg-bg p-6 md:p-10">
              <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
                <div className="flex flex-1 flex-col gap-3">
                  {[t('tools.catalog'), t('tools.erp')].map((label) => (
                    <div key={label} className="flex items-center gap-3 rounded-xl border-[1.5px] border-dashed border-text/25 bg-surface px-4 py-3.5 text-sm font-medium">
                      <Database className="h-4 w-4 shrink-0 text-text-muted" />
                      {label}
                    </div>
                  ))}
                </div>
                <div className="mx-auto h-6 w-px bg-accent/50 sm:h-px sm:w-8" />
                <div className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-accent px-5 py-4 text-sm font-semibold text-bg">
                  <Sparkles className="h-4 w-4" />
                  SaLLy
                </div>
                <div className="mx-auto h-6 w-px bg-accent/50 sm:h-px sm:w-8" />
                <div className="flex flex-1 items-center gap-3 rounded-xl border border-accent/50 bg-accent/10 px-4 py-3.5 text-sm font-medium">
                  <FileText className="h-4 w-4 shrink-0 text-accent" />
                  {t('tools.output')}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Pour qui ─────────────────────────────────── */}
      <section className="relative border-t border-border py-20 md:py-24">
        <div className="container-x">
          <div className="max-w-3xl">
            <SectionLabel>{t('forWho.eyebrow')}</SectionLabel>
            <h2 className="mt-6 text-h1 font-semibold text-balance">{t('forWho.title')}</h2>
          </div>
          <div className="mt-12 grid divide-y divide-border border-y border-border md:grid-cols-3 md:divide-x md:divide-y-0">
            {audiences.map(({ key, Icon }, i) => (
              <motion.div key={key} {...reveal} transition={{ duration: 0.5, delay: i * 0.1 }} className="py-8 md:px-8 md:py-10 md:first:pl-0 md:last:pr-0">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-semibold tracking-tight">{t(`forWho.items.${key}.title`)}</h3>
                <p className="mt-3 text-text-muted">{t(`forWho.items.${key}.body`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Questions fréquentes ──────────────────────── */}
      <section className="relative border-t border-border bg-surface py-20 md:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <SectionLabel>{t('faq.eyebrow')}</SectionLabel>
            <h2 className="mt-6 text-h1 font-semibold text-balance">{t('faq.title')}</h2>
          </div>
          <div className="divide-y divide-border border-y border-border lg:col-span-8">
            {faq.map((key, i) => (
              <details key={key} className="group" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-semibold tracking-tight transition hover:text-accent [&::-webkit-details-marker]:hidden">
                  {t(`faq.items.${key}.q`)}
                  <ChevronDown className="h-5 w-5 shrink-0 text-text-muted transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <p className="max-w-2xl pb-6 text-text-muted">{t(`faq.items.${key}.a`)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Appel à l'action ──────────────────────────── */}
      <section id="contact" className="relative scroll-mt-20 overflow-hidden border-t border-border py-20 md:py-28">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-accent/10 blur-[140px]" />
        <motion.div {...reveal} transition={{ duration: 0.6 }} className="container-x relative mx-auto max-w-3xl text-center">
          <div className="flex justify-center">
            <SectionLabel>{t('cta.eyebrow')}</SectionLabel>
          </div>
          <h2 className="mt-6 text-h1 font-semibold text-balance">{t('cta.title')}</h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-text-muted text-balance">{t('cta.subtitle')}</p>
          <div className="mt-9 flex justify-center">
            <Button href={contact} variant="primary" size="lg">
              {t('cta.button')}
            </Button>
          </div>
          <p className="mt-6 text-sm text-text-muted">
            {t('cta.emailLabel')}{' '}
            <a href={`mailto:${t('cta.email')}`} className="font-medium text-accent transition hover:underline">
              {t('cta.email')}
            </a>
          </p>
        </motion.div>
      </section>
    </>
  );
}
