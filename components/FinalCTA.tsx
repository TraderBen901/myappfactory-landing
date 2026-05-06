'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { SectionLabel } from './ui/SectionLabel';
import { Button } from './ui/Button';

export function FinalCTA() {
  const t = useTranslations('cta');

  return (
    <section id="contact" className="relative overflow-hidden border-t border-border py-24 md:py-32">
      {/* Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[120px]" />

      <div className="container-x relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="flex justify-center">
            <SectionLabel>{t('eyebrow')}</SectionLabel>
          </div>

          <h2 className="mt-6 text-h1 font-semibold text-balance">{t('title')}</h2>
          <p className="mt-6 text-lg text-text-muted text-balance md:text-xl">{t('subtitle')}</p>

          <div className="mt-10 flex flex-col items-center gap-4">
            {/*
              TODO: Remplacer href="#" par ton lien Cal.com / Calendly
              Exemple : href="https://cal.com/myappfactory/discovery"
            */}
            <Button href="#" variant="primary" size="lg" external>
              <Calendar className="mr-1 h-4 w-4" />
              {t('button')}
            </Button>
            <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
              {t('note')}
            </p>
          </div>

          {/* Decorative inline animation slot */}
          <div className="mt-16">
            <div className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-accent to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
