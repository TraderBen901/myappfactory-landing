'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { AiosLabel } from './AiosLabel';

const componentKeys = [
  'cockpit',
  'workforce',
  'cloud',
  'network',
  'apps',
  'skills',
] as const;

const destKeys = ['cloud', 'machines', 'apps'] as const;

// Connecteur vertical entre deux nœuds du schéma
function Connector({ label }: { label?: string }) {
  return (
    <div className="relative flex flex-col items-center py-1">
      <div className="h-7 w-px bg-text/30" />
      <ChevronDown className="-mt-1 h-4 w-4 text-text/40" strokeWidth={2} />
      {label && (
        <span className="absolute left-1/2 top-1/2 ml-3 -translate-y-1/2 whitespace-nowrap rounded-full border border-border bg-surface px-2.5 py-0.5 font-mono text-[10px] text-text-muted">
          {label}
        </span>
      )}
    </div>
  );
}

function LevelLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 mt-1 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">
      {children}
    </p>
  );
}

export function AiosArchitecture() {
  const t = useTranslations('aios.architecture');
  const tools = t.raw('diagram.tools') as string[];

  return (
    <section id="architecture" className="relative border-t border-border py-24 md:py-32">
      <div className="container-x">
        <div className="max-w-3xl">
          <AiosLabel num="03">{t('eyebrow')}</AiosLabel>
          <h2 className="mt-6 text-h1 font-semibold text-balance">{t('title')}</h2>
          <p className="mt-5 text-lg text-text-muted text-balance">{t('lead')}</p>
        </div>

        {/* ── Schéma vertical ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mt-12 flex flex-col items-center rounded-2xl border border-border bg-surface px-5 py-10 text-center md:px-8"
          role="img"
          aria-label={t('title')}
        >
          {/* VOUS */}
          <div className="w-full max-w-[260px] rounded-xl border border-border bg-surface-2 px-5 py-3.5">
            <div className="text-sm font-semibold tracking-tight">{t('diagram.you.title')}</div>
            <div className="mt-1.5 font-mono text-[11px] text-text-muted">{t('diagram.you.sub')}</div>
          </div>

          <Connector />

          {/* COCKPIT — nœud sombre (inversé clair/sombre) */}
          <div className="relative w-full max-w-[380px] rounded-xl border border-text bg-text px-5 py-4 text-bg">
            <span className="absolute left-4 top-4 h-2 w-2 rounded-full bg-accent-2" />
            <div className="text-sm font-semibold tracking-tight">{t('diagram.cockpit.title')}</div>
            <div className="mt-1.5 font-mono text-[11px] text-bg/60">{t('diagram.cockpit.sub')}</div>
            <span className="mt-2.5 inline-block rounded-full border border-accent/50 px-2.5 py-0.5 font-mono text-[10px] text-accent">
              {t('diagram.cockpit.tag')}
            </span>
          </div>

          <Connector label={t('diagram.connComplex')} />

          {/* PAPERCLIP — optionnel (pointillés) */}
          <div className="w-full max-w-[360px] rounded-xl border border-dashed border-border bg-surface-2 px-5 py-3.5">
            <div className="mb-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-accent-2">
              {t('diagram.paperclip.flag')}
            </div>
            <div className="text-sm font-semibold tracking-tight">{t('diagram.paperclip.title')}</div>
            <div className="mt-1.5 font-mono text-[11px] text-text-muted">{t('diagram.paperclip.sub')}</div>
          </div>

          <Connector />

          {/* Les outils */}
          <LevelLabel>{t('diagram.toolsLabel')}</LevelLabel>
          <div className="flex w-full max-w-[640px] flex-wrap justify-center gap-2.5">
            {tools.map((tool) => (
              <div
                key={tool}
                className="min-w-[130px] flex-1 overflow-hidden rounded-lg border border-border bg-surface"
              >
                <span className="block h-3.5 border-b border-border bg-surface-2" />
                <span className="block px-3 py-2 text-left font-mono text-xs font-medium">
                  {tool}
                </span>
              </div>
            ))}
          </div>

          <Connector />

          {/* Agit sur */}
          <LevelLabel>{t('diagram.actsLabel')}</LevelLabel>
          <div className="grid w-full max-w-[680px] gap-3 sm:grid-cols-3">
            {destKeys.map((key) => (
              <div
                key={key}
                className="rounded-xl border border-border bg-surface-2 p-4 text-left"
              >
                <b className="block text-sm font-semibold tracking-tight">
                  {t(`diagram.dest.${key}.title`)}
                </b>
                <span className="mt-1.5 block font-mono text-[11px] leading-relaxed text-text-muted">
                  {t(`diagram.dest.${key}.sub`)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Les 6 briques détaillées ─────────────────────── */}
        <div className="mt-16 border-t border-border">
          {componentKeys.map((key, i) => {
            const chips = t.raw(`components.${key}.chips`) as string[];
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
                className="grid grid-cols-[56px_1fr] items-start gap-5 border-b border-border py-8 md:grid-cols-[84px_1fr] md:gap-6"
              >
                <div className="font-mono text-3xl font-semibold leading-none text-text/15 md:text-4xl">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div>
                  <h3 className="text-xl font-semibold tracking-tight md:text-2xl">
                    {t(`components.${key}.title`)}
                  </h3>
                  <p className="mt-2.5 max-w-3xl text-text-muted">
                    {t.rich(`components.${key}.body`, {
                      k: (c) => <em className="not-italic font-semibold text-accent-2">{c}</em>,
                      g: (c) => <em className="not-italic font-semibold text-accent">{c}</em>,
                    })}
                  </p>
                  <div className="mt-3.5 flex flex-wrap gap-2">
                    {chips.map((chip) => (
                      <span
                        key={chip}
                        className="rounded-full border border-border bg-surface-2 px-2.5 py-1 font-mono text-[11px] text-text-muted"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
