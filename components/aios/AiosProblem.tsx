'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { AiosLabel } from './AiosLabel';

const cards = ['silos', 'chatbot', 'diy'] as const;

export function AiosProblem() {
  const t = useTranslations('aios.problem');

  return (
    <section className="relative border-t border-border py-24 md:py-32">
      <div className="container-x">
        <div className="max-w-3xl">
          <AiosLabel num="01">{t('eyebrow')}</AiosLabel>
          <h2 className="mt-6 text-h1 font-semibold text-balance">{t('title')}</h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {cards.map((key, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl border border-border bg-surface p-6 transition hover:border-accent/40"
            >
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-text-muted">
                <span className="mr-1 text-accent-2">›</span>
                {t(`cards.${key}.tag`)}
              </p>
              <h3 className="mt-4 text-xl font-semibold tracking-tight">
                <span className="mr-2 text-accent-2">—</span>
                {t(`cards.${key}.title`)}
              </h3>
              <p className="mt-3 text-text-muted">{t(`cards.${key}.body`)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
