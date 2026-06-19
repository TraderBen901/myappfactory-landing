'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { AiosLabel } from './AiosLabel';

const personas = ['pme', 'leaders', 'noDev'] as const;

export function AiosForWho() {
  const t = useTranslations('aios.forWho');

  return (
    <section className="relative border-y border-border bg-surface-2 py-24 md:py-32">
      <div className="container-x">
        <div className="max-w-3xl">
          <AiosLabel num="06">{t('eyebrow')}</AiosLabel>
          <h2 className="mt-6 text-h1 font-semibold text-balance">{t('title')}</h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {personas.map((k, i) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl border border-border bg-surface p-6"
            >
              <h3 className="text-xl font-semibold tracking-tight">
                {t(`personas.${k}.title`)}
              </h3>
              <p className="mt-3 text-text-muted">{t(`personas.${k}.body`)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
