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
    <section className="relative border-t border-border bg-surface py-24 md:py-32">
      <div className="container-x">
        <div className="max-w-3xl">
          <SectionLabel>{t('eyebrow')}</SectionLabel>
          <h2 className="mt-6 text-h1 font-semibold text-balance">{t('title')}</h2>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {personas.map(({ key, Icon }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-bg p-8"
            >
              {/* Subtle hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-6 text-xl font-semibold tracking-tight">
                  {t(`personas.${key}.title`)}
                </h3>
                <p className="mt-3 text-text-muted">{t(`personas.${key}.body`)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
