'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { AiosLabel } from './AiosLabel';

const scenarios = ['open', 'leo', 'dashboard'] as const;
const apps = ['leo', 'harold', 'sally'] as const;

export function AiosProof() {
  const t = useTranslations('aios.proof');

  // Surlignage rouge/vert dans les réponses
  const k = (c: React.ReactNode) => <em className="not-italic font-semibold text-accent-2">{c}</em>;
  const g = (c: React.ReactNode) => <em className="not-italic font-semibold text-accent">{c}</em>;

  return (
    <section className="dark relative border-t border-border bg-bg py-24 md:py-32 text-text">
      <div className="container-x">
        <div className="max-w-3xl">
          <AiosLabel num="04">{t('eyebrow')}</AiosLabel>
          <h2 className="mt-6 text-h1 font-semibold text-balance">{t('title')}</h2>
          <p className="mt-5 text-lg text-text-muted text-balance">{t('lead')}</p>
        </div>

        {/* Scénarios réels : demande → résultat */}
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {scenarios.map((key, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl border border-border bg-surface p-5"
            >
              <div className="flex gap-2 rounded-lg border border-border bg-bg px-3 py-2.5 font-mono text-sm leading-snug">
                <span className="font-bold text-accent">›</span>
                <span>{t(`scenarios.${key}.q`)}</span>
              </div>
              <p className="mt-3 text-sm text-text-muted">{t.rich(`scenarios.${key}.a`, { k, g })}</p>
            </motion.div>
          ))}
        </div>

        {/* Bande des applications en production */}
        <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border pt-6">
          <span className="font-mono text-[11px] uppercase tracking-widest text-text-muted">
            {t('appsLabel')}
          </span>
          {apps.map((key) => (
            <span key={key} className="text-base font-bold tracking-tight">
              {t(`apps.${key}.name`)}
              <span className="ml-1.5 font-mono text-[11px] font-normal text-text-muted">
                {t(`apps.${key}.tag`)}
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
