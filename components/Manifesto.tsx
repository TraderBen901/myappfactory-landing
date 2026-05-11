'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export function Manifesto() {
  const t = useTranslations('manifesto');

  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Soft accent glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[280px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/8 blur-[120px]" />

      <div className="container-x relative text-center">
        <motion.p
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="mx-auto max-w-4xl text-display font-semibold text-balance"
        >
          {t('part1')}{' '}
          <span className="text-accent">{t('part2')}</span>
        </motion.p>
      </div>
    </section>
  );
}
