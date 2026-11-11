'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Globe, Smartphone, Wrench, Bot, Workflow, Target, Plus } from 'lucide-react';
import { SectionLabel } from './ui/SectionLabel';

/* Les six familles forment un mur de briques posées en quinconce (à partir de lg).
   La demi-brique verte en pointillés rappelle l'emplacement « sur-mesure » du hero. */

const categories = [
  { key: 'web', Icon: Globe, ready: true },
  { key: 'mobile', Icon: Smartphone, ready: true },
  { key: 'internal', Icon: Wrench, ready: true },
  { key: 'ai', Icon: Bot, ready: true },
  { key: 'automation', Icon: Workflow, ready: false },
  { key: 'leadgen', Icon: Target, ready: true },
] as const;

// Colonne de départ de chaque brique dans la grille à 7 demi-colonnes : rang 1 puis rang 2 décalé d'une demi-brique.
const START = ['lg:col-start-1', 'lg:col-start-3', 'lg:col-start-5', 'lg:col-start-2', 'lg:col-start-4', 'lg:col-start-6'];

export function WhatWeBuild() {
  const t = useTranslations('build');
  const tScene = useTranslations('hero.scene');

  return (
    <section className="relative border-t border-border py-20 md:py-24">
      <div className="container-x">
        <div className="max-w-3xl">
          <SectionLabel>{t('eyebrow')}</SectionLabel>
          <h2 className="mt-6 text-h1 font-semibold text-balance">{t('title')}</h2>
          <p className="mt-5 text-lg text-text-muted text-balance">{t('subtitle')}</p>
        </div>

        <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-7 lg:gap-x-3 lg:gap-y-3.5">
          {categories.map(({ key, Icon, ready }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className={`lg:col-span-2 ${START[i]} ${i < 3 ? 'lg:row-start-1' : 'lg:row-start-2'}`}
            >
              <div className="group relative h-full rounded-xl border border-text/20 bg-surface p-6 shadow-[4px_5px_0_0_rgb(var(--border-rgb))] transition duration-200 hover:-translate-x-0.5 hover:-translate-y-1 hover:border-accent/60 hover:shadow-[6px_9px_0_0_rgb(var(--border-rgb))]">
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-bg text-accent transition group-hover:border-accent">
                    <Icon className="h-5 w-5" />
                  </div>
                  {ready && (
                    <span className="flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-accent">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
                      {t('badge')}
                    </span>
                  )}
                </div>

                <h3 className="mt-6 text-lg font-semibold tracking-tight">{t(`categories.${key}.title`)}</h3>
                <p className="mt-2 text-sm text-text-muted">{t(`categories.${key}.body`)}</p>

                <div className="mt-6 font-mono text-[10px] uppercase tracking-widest text-text-muted/50">
                  {String(i + 1).padStart(2, '0')} / 06
                </div>
              </div>
            </motion.div>
          ))}

          {/* Demi-briques des extrémités : celle du rang 1 est l'emplacement sur-mesure */}
          <div
            aria-hidden="true"
            className="hidden rounded-xl border-[1.5px] border-dashed border-accent/60 bg-accent/[0.06] lg:col-start-7 lg:row-start-1 lg:flex lg:flex-col lg:items-center lg:justify-center lg:gap-3"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-accent/40 text-accent">
              <Plus className="h-4 w-4" />
            </span>
            <span className="font-mono text-[11px] tracking-wider text-accent">{tScene('measure')}</span>
          </div>
          <div aria-hidden="true" className="hidden rounded-xl border-[1.5px] border-dashed border-text/15 lg:col-start-1 lg:row-start-2 lg:block" />
        </div>
      </div>
    </section>
  );
}
