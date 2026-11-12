'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { SectionLabel } from './ui/SectionLabel';

const steps = ['discovery', 'selection', 'customization', 'delivery'] as const;

export function Process() {
  const t = useTranslations('process');

  return (
    <section id="process" className="relative border-t border-border py-20 md:py-24">
      <div className="container-x">
        <div className="max-w-3xl">
          <SectionLabel>{t('eyebrow')}</SectionLabel>
          <h2 className="mt-6 text-h1 font-semibold text-balance">{t('title')}</h2>
          <p className="mt-5 text-lg text-text-muted text-balance">{t('subtitle')}</p>
        </div>

        {/* Les six semaines, à l'échelle : 1 semaine de Blueprint, puis 3 à 5 de personnalisation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          aria-hidden="true"
          className="mt-14 hidden rounded-2xl border border-border bg-surface p-5 md:block lg:p-6"
        >
          <div className="grid grid-cols-[auto_repeat(6,minmax(0,1fr))_auto] items-center gap-x-1.5 gap-y-2.5">
            <span />
            {[1, 2, 3, 4, 5, 6].map((w) => (
              <span key={w} className="border-l border-border pl-2 font-mono text-[10px] uppercase tracking-widest text-text-muted">
                {t('weekShort')}
                {w}
              </span>
            ))}
            <span />

            <span className="flex h-10 items-center rounded-full border border-accent/40 bg-accent/10 px-3.5 font-mono text-xs font-semibold text-accent">
              {t('steps.discovery.number')}
            </span>
            <span className="flex h-10 items-center gap-2 overflow-hidden rounded-lg bg-text/10 px-3 text-sm font-medium">
              <span className="font-mono text-xs text-text-muted">{t('steps.selection.number')}</span>
              <span className="hidden truncate lg:inline">{t('steps.selection.title')}</span>
            </span>
            <span className="col-span-3 flex h-10 items-center gap-2 overflow-hidden rounded-lg bg-accent px-3 text-sm font-medium text-bg">
              <span className="font-mono text-xs text-bg/70">{t('steps.customization.number')}</span>
              <span className="truncate">{t('steps.customization.title')}</span>
            </span>
            <span className="col-span-2 h-10 rounded-lg border-[1.5px] border-dashed border-accent/50 bg-accent/10" />
            <span className="flex h-10 items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3.5 font-mono text-xs font-semibold text-accent">
              {t('steps.delivery.number')}
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </motion.div>

        <ol className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {steps.map((step, i) => (
            <motion.li
              key={step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative"
            >
              {/* trait vers l'étape suivante */}
              {i < steps.length - 1 && <span aria-hidden="true" className="absolute left-16 right-[-2rem] top-6 hidden h-px bg-border lg:block" />}
              <span className="relative flex h-12 w-12 items-center justify-center rounded-full border border-accent/40 bg-bg font-mono text-sm font-semibold text-accent">
                {t(`steps.${step}.number`)}
              </span>
              <p className="mt-6 font-mono text-xs uppercase tracking-widest text-accent">{t(`steps.${step}.duration`)}</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight">{t(`steps.${step}.title`)}</h3>
              <p className="mt-3 text-text-muted">{t(`steps.${step}.body`)}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
