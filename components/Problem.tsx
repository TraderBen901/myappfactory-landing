'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { AlertCircle, Clock, Layers } from 'lucide-react';
import { SectionLabel } from './ui/SectionLabel';

export function Problem() {
  const t = useTranslations('problem');

  const cards = [
    { key: 'generic', Icon: Layers },
    { key: 'custom', Icon: Clock },
    { key: 'ai', Icon: AlertCircle },
  ] as const;

  return (
    <section id="problem" className="relative py-24 md:py-32">
      <div className="container-x">
        <div className="max-w-3xl">
          <SectionLabel>{t('eyebrow')}</SectionLabel>
          <h2 className="mt-6 text-h1 font-semibold text-balance">{t('title')}</h2>
          <p className="mt-5 text-lg text-text-muted text-balance">{t('subtitle')}</p>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
          {cards.map(({ key, Icon }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative bg-surface p-8 transition hover:bg-surface-2 md:p-10"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-accent-2/30 bg-accent-2/10 text-accent-2">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-6 text-xl font-semibold tracking-tight">
                {t(`cards.${key}.title`)}
              </h3>
              <p className="mt-3 text-text-muted">{t(`cards.${key}.body`)}</p>

              <div className="mt-8 font-mono text-xs uppercase tracking-widest text-text-muted/60">
                0{i + 1} / 03
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
