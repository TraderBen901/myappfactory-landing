'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { AiosLabel } from './AiosLabel';

// Les quatre principes non négociables
const cards = ['privacy', 'budget', 'scale', 'ownership'] as const;

export function AiosGuardrails() {
  const t = useTranslations('aios.guardrails');

  return (
    <section className="relative border-t border-border py-24 md:py-32">
      <div className="container-x">
        <div className="max-w-3xl">
          <AiosLabel num="05">{t('eyebrow')}</AiosLabel>
          <h2 className="mt-6 text-h1 font-semibold text-balance">{t('title')}</h2>
          <p className="mt-5 text-lg text-text-muted text-balance">{t('lead')}</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {cards.map((k, i) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl border border-border bg-surface p-6 transition hover:border-accent/40"
            >
              {/* Tag positif — check vert */}
              <p className="flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-widest text-text-muted">
                <Check className="h-3.5 w-3.5 text-accent" strokeWidth={3} />
                {t(`cards.${k}.tag`)}
              </p>
              <h3 className="mt-3 text-xl font-semibold tracking-tight">{t(`cards.${k}.title`)}</h3>
              <p className="mt-3 text-text-muted">{t(`cards.${k}.body`)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
