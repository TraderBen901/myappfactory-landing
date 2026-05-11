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
          {/* Vertical connector line — mobile: left edge, desktop: center */}
          <div className="absolute left-[27px] top-0 bottom-0 w-px bg-border md:left-1/2 md:-translate-x-1/2" />

          <div>
            {steps.map((step, i) => {
              const isRight = i % 2 === 1; // steps 2 & 4 on the right

              return (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative py-10 md:py-14"
                >
                  {/* Step indicator — centered on the line */}
                  <div className="absolute left-0 top-1/2 z-10 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-accent/40 bg-bg font-mono text-sm font-semibold text-accent md:left-1/2 md:-translate-x-1/2">
                    {t(`steps.${step}.number`)}
                  </div>

                  {/* Mobile: always right of circle */}
                  <div className="pl-20 md:hidden">
                    <StepContent step={step} t={t} align="left" />
                  </div>

                  {/* Desktop: alternating left / right */}
                  <div className="hidden md:grid md:grid-cols-2">
                    {isRight ? (
                      <>
                        {/* empty left */}
                        <div />
                        {/* content right */}
                        <div className="pl-20">
                          <StepContent step={step} t={t} align="left" />
                        </div>
                      </>
                    ) : (
                      <>
                        {/* content left, text right-aligned */}
                        <div className="pr-20 text-right">
                          <StepContent step={step} t={t} align="right" />
                        </div>
                        {/* empty right */}
                        <div />
                      </>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function StepContent({
  step,
  t,
  align,
}: {
  step: string;
  t: ReturnType<typeof useTranslations>;
  align: 'left' | 'right';
}) {
  return (
    <>
      <p className="font-mono text-xs uppercase tracking-widest text-accent">
        {t(`steps.${step}.duration`)}
      </p>
      <h3 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
        {t(`steps.${step}.title`)}
      </h3>
      <p className={`mt-4 text-text-muted ${align === 'right' ? 'ml-auto max-w-sm' : 'max-w-sm'}`}>
        {t(`steps.${step}.body`)}
      </p>
    </>
  );
}
