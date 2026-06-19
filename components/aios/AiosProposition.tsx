'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { AiosLabel } from './AiosLabel';

const pillars = ['blocks', 'native', 'control'] as const;

export function AiosProposition() {
  const t = useTranslations('aios.proposition');

  return (
    <section className="relative border-y border-border bg-surface-2 py-24 md:py-32">
      <div className="container-x">
        <div className="max-w-3xl">
          <AiosLabel num="02">{t('eyebrow')}</AiosLabel>
          <h2 className="mt-6 text-h1 font-semibold text-balance">{t('title')}</h2>
          {/* Lead avec mise en valeur — agissent réellement */}
          <p className="mt-5 max-w-3xl text-lg text-text-muted text-balance">
            {t.rich('lead', {
              k: (c) => <em className="not-italic font-semibold text-accent-2">{c}</em>,
            })}
          </p>
        </div>

        {/* ── Les 3 piliers ────────────────────────────────── */}
        <div className="mt-12 grid border-t border-border md:grid-cols-3">
          {pillars.map((key, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="border-b border-border py-7 md:border-b-0 md:border-r md:py-8 md:pr-7 md:[&:not(:first-child)]:pl-7 md:[&:last-child]:border-r-0"
            >
              <div className="font-mono text-xs font-semibold text-accent">
                {t(`pillars.${key}.n`)}
              </div>
              <h3 className="mt-3 text-xl font-semibold tracking-tight">
                {t(`pillars.${key}.title`)}
              </h3>
              <p className="mt-2 text-text-muted">{t(`pillars.${key}.body`)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
