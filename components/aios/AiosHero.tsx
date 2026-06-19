'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

export function AiosHero() {
  const t = useTranslations('aios.hero');
  const locale = useLocale();

  return (
    <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
      <div className="container-x">
        {/* Kicker — marque · produit · tagline */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-text-muted"
        >
          {t('brand')} · <span className="text-accent-2">{t('product')}</span> · {t('tagline')}
        </motion.p>

        {/* Titre principal — très grand */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 max-w-[18ch] text-display font-semibold tracking-tight"
        >
          {t('title')}
        </motion.h1>

        {/* Définition — acronyme + analogie (pour les non-techniques) */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-6 max-w-2xl text-base font-medium text-text md:text-lg"
        >
          {t.rich('definition', {
            g: (c) => <em className="not-italic font-semibold text-accent">{c}</em>,
          })}
        </motion.p>

        {/* Sous-titre — contient <k> */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-5 max-w-2xl text-lg font-medium text-text md:text-xl"
        >
          {t.rich('subtitle', {
            k: (c) => <em className="not-italic font-semibold text-accent-2">{c}</em>,
            g: (c) => <em className="not-italic font-semibold text-accent">{c}</em>,
          })}
        </motion.p>

        {/* Sous-titre secondaire */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-4 max-w-2xl text-text-muted"
        >
          {t('subtitle2')}
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <Button href={`/${locale}#contact`} variant="primary">
            {t('ctaPrimary')}
          </Button>
          <Button href="#architecture" variant="secondary" arrow={false}>
            {t('ctaSecondary')}
          </Button>
        </motion.div>

        {/* Ligne live — point pulsé */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 flex items-center gap-2.5 font-mono text-xs text-text-muted"
        >
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-accent" />
          {t('live')}
        </motion.div>
      </div>
    </section>
  );
}
