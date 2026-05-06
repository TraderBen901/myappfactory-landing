'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Globe, Smartphone, Wrench, Bot, Workflow, Target } from 'lucide-react';
import { SectionLabel } from './ui/SectionLabel';

export function WhatWeBuild() {
  const t = useTranslations('build');

  const categories = [
    { key: 'web', Icon: Globe, ready: true },
    { key: 'mobile', Icon: Smartphone, ready: true },
    { key: 'internal', Icon: Wrench, ready: true },
    { key: 'ai', Icon: Bot, ready: true },
    { key: 'automation', Icon: Workflow, ready: false },
    { key: 'leadgen', Icon: Target, ready: true },
  ] as const;

  return (
    <section className="relative border-t border-border py-24 md:py-32">
      <div className="container-x">
        <div className="max-w-3xl">
          <SectionLabel>{t('eyebrow')}</SectionLabel>
          <h2 className="mt-6 text-h1 font-semibold text-balance">{t('title')}</h2>
          <p className="mt-5 text-lg text-text-muted text-balance">{t('subtitle')}</p>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {categories.map(({ key, Icon, ready }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group relative bg-surface p-8 transition hover:bg-surface-2"
            >
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

              <h3 className="mt-8 text-lg font-semibold tracking-tight">
                {t(`categories.${key}.title`)}
              </h3>
              <p className="mt-2 text-sm text-text-muted">{t(`categories.${key}.body`)}</p>

              <div className="mt-8 font-mono text-[10px] uppercase tracking-widest text-text-muted/50">
                {String(i + 1).padStart(2, '0')} / 06
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
