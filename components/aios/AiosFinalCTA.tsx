'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { AiosLabel } from './AiosLabel';
import { Button } from '@/components/ui/Button';

export function AiosFinalCTA() {
  const t = useTranslations('aios.finalCta');
  const locale = useLocale();

  return (
    <section className="dark relative overflow-hidden border-t border-border bg-bg py-24 md:py-32 text-text">
      {/* Halo vert diffus en haut */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-accent/10 blur-[130px]" />

      <div className="container-x relative text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center">
            <AiosLabel>{t('eyebrow')}</AiosLabel>
          </div>
          <h2 className="mx-auto mt-6 max-w-[20ch] text-h1 font-semibold text-balance">
            {t('title')}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-text-muted text-balance">
            {t('lead')}
          </p>

          {/* Boutons d'appel à l'action */}
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href={`/${locale}#contact`} variant="primary">
              {t('ctaPrimary')}
            </Button>
            <Button
              href="mailto:benoit.schiepers@gmail.com"
              variant="secondary"
              external
              arrow={false}
            >
              {t('ctaSecondary')}
            </Button>
          </div>

          {/* Ligne « live » avec point pulsant */}
          <div className="mt-8 flex items-center justify-center gap-2.5 font-mono text-xs text-text-muted">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-accent" />
            {t('live')}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
