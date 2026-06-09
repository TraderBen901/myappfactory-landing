'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Brain, Workflow, Rocket, CheckCircle2 } from 'lucide-react';
import { SectionLabel } from './ui/SectionLabel';
import { Button } from './ui/Button';

const levels = [
  { key: 'level1', Icon: Brain },
  { key: 'level2', Icon: Workflow },
  { key: 'level3', Icon: Rocket },
] as const;

const outcomes = ['outcome1', 'outcome2', 'outcome3'] as const;

export function Training() {
  const t = useTranslations('training');

  return (
    <section id="training" className="relative overflow-hidden border-t border-border py-24 md:py-32">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
      <div className="absolute -right-40 top-24 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

      <div className="container-x relative">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div className="max-w-3xl">
            <SectionLabel>{t('eyebrow')}</SectionLabel>
            <h2 className="mt-6 text-h1 font-semibold text-balance">{t('title')}</h2>
            <p className="mt-5 text-lg text-text-muted text-balance">{t('subtitle')}</p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6 md:p-8">
            <p className="font-mono text-xs uppercase tracking-widest text-accent">{t('academyLabel')}</p>
            <p className="mt-4 text-2xl font-semibold tracking-tight text-balance">{t('academyTitle')}</p>
            <p className="mt-3 text-sm leading-6 text-text-muted">{t('academyBody')}</p>
          </div>
        </div>

        <div className="mt-16 grid gap-5 lg:grid-cols-3">
          {levels.map(({ key, Icon }, i) => (
            <motion.article
              key={key}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="group relative flex min-h-[430px] flex-col overflow-hidden rounded-2xl border border-border bg-surface p-7 transition hover:-translate-y-1 hover:border-accent/50 hover:bg-surface-2"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-bg text-accent transition group-hover:border-accent">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="rounded-full border border-border bg-bg px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-text-muted">
                  {t(`levels.${key}.duration`)}
                </span>
              </div>

              <p className="mt-8 font-mono text-xs uppercase tracking-widest text-accent">
                {t(`levels.${key}.label`)}
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight">{t(`levels.${key}.title`)}</h3>
              <p className="mt-4 text-sm leading-6 text-text-muted">{t(`levels.${key}.body`)}</p>

              <div className="mt-8 space-y-4">
                <TrainingDetail label={t('forWhom')} value={t(`levels.${key}.audience`)} />
                <TrainingDetail label={t('result')} value={t(`levels.${key}.result`)} />
              </div>

              <div className="mt-auto pt-8 font-mono text-[10px] uppercase tracking-widest text-text-muted/60">
                {String(i + 1).padStart(2, '0')} / 03
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-8 grid gap-5 rounded-2xl border border-border bg-bg p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
          <div>
            <p className="text-xl font-semibold tracking-tight">{t('outcomesTitle')}</p>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {outcomes.map((key) => (
                <div key={key} className="flex gap-3 text-sm text-text-muted">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>{t(`outcomes.${key}`)}</span>
                </div>
              ))}
            </div>
          </div>
          <Button href="#contact" size="lg" arrow>
            {t('cta')}
          </Button>
        </div>
      </div>
    </section>
  );
}

function TrainingDetail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted/50">{label}</p>
      <p className="mt-1 text-sm text-text">{value}</p>
    </div>
  );
}
