'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { AiosLabel } from './AiosLabel';

const steps = ['discovery', 'blueprint', 'install', 'delivery'] as const;

export function AiosProcess() {
  const t = useTranslations('aios.process');

  return (
    <section className="relative border-t border-border py-24 md:py-32">
      <div className="container-x">
        <div className="max-w-3xl">
          <AiosLabel num="07">{t('eyebrow')}</AiosLabel>
          <h2 className="mt-6 text-h1 font-semibold text-balance">{t('title')}</h2>
        </div>

        {/* Les 4 étapes */}
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((k, i) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="border-t-2 border-text pt-4">
                <div className="font-mono text-xs font-semibold uppercase tracking-widest text-accent-2">
                  {t(`steps.${k}.n`)}
                </div>
                <h3 className="mt-2.5 text-lg font-semibold tracking-tight">
                  {t(`steps.${k}.title`)}
                </h3>
                <p className="mt-2 text-sm text-text-muted">{t(`steps.${k}.body`)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
