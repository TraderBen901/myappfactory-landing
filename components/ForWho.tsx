'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Building2, Rocket, Users } from 'lucide-react';
import { SectionLabel } from './ui/SectionLabel';

export function ForWho() {
  const t = useTranslations('forWho');

  const personas = [
    { key: 'pme', Icon: Building2 },
    { key: 'startup', Icon: Rocket },
    { key: 'internal', Icon: Users },
  ] as const;

  return (
    <section className="relative border-t border-border bg-surface py-20 md:py-24">
      <div className="container-x">
        <div className="max-w-3xl">
          <SectionLabel>{t('eyebrow')}</SectionLabel>
          <h2 className="mt-6 text-h1 font-semibold text-balance">{t('title')}</h2>
        </div>

        {/* Trois profils côte à côte, sans cadres : une respiration entre deux sections à cartes */}
        <div className="mt-12 grid divide-y divide-border border-y border-border md:grid-cols-3 md:divide-x md:divide-y-0">
          {personas.map(({ key, Icon }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="py-8 md:px-8 md:py-10 md:first:pl-0 md:last:pr-0"
            >
              <div className="flex items-center gap-3 md:flex-col md:items-start lg:flex-row lg:items-center">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight">{t(`personas.${key}.title`)}</h3>
              </div>
              <p className="mt-4 text-text-muted">{t(`personas.${key}.body`)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
