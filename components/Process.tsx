'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { SectionLabel } from './ui/SectionLabel';

const steps = ['discovery', 'selection', 'customization', 'delivery'] as const;

export function Process() {
  const t = useTranslations('process');

  return (
    <section id="process" className="relative border-t border-border py-24 md:py-32">
      <div className="container-x">
        <div className="max-w-3xl">
          <SectionLabel>{t('eyebrow')}</SectionLabel>
          <h2 className="mt-6 text-h1 font-semibold text-balance">{t('title')}</h2>
          <p className="mt-5 text-lg text-text-muted text-balance">{t('subtitle')}</p>
        </div>

        <div className="mt-20 relative">
          {/* Vertical connector line */}
          <div className="absolute left-[27px] top-0 bottom-0 w-px bg-gradient-to-b from-accent/40 via-border to-transparent md:left-1/2 md:-translate-x-1/2" />

          <div className="space-y-16 md:space-y-24">
            {steps.map((step, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative grid gap-6 md:grid-cols-2 md:gap-12 ${
                  i % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''
                }`}
              >
                {/* Step indicator */}
                <div className="absolute left-0 flex h-14 w-14 items-center justify-center rounded-full border border-accent/40 bg-bg font-mono text-sm font-semibold text-accent md:left-1/2 md:-translate-x-1/2">
                  {t(`steps.${step}.number`)}
                </div>

                {/* Content */}
                <div className={`pl-20 md:pl-0 ${i % 2 === 1 ? 'md:text-right md:pr-20' : 'md:pr-20'}`}>
                  <p
                    className={`font-mono text-xs uppercase tracking-widest text-accent ${
                      i % 2 === 1 ? 'md:text-right' : ''
                    }`}
                  >
                    {t(`steps.${step}.duration`)}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
                    {t(`steps.${step}.title`)}
                  </h3>
                  <p className="mt-4 text-text-muted">{t(`steps.${step}.body`)}</p>
                </div>

                {/* Spacer */}
                <div className="hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
