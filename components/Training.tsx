'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Brain, Workflow, Rocket, CheckCircle2 } from 'lucide-react';
import { SectionLabel } from './ui/SectionLabel';
import { Button } from './ui/Button';

export type TrainingContent = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  academyLabel?: string;
  academyTitle?: string;
  academyBody?: string;
  forWhomLabel?: string;
  resultLabel?: string;
  levels?: Array<{
    label?: string;
    title?: string;
    duration?: string;
    body?: string;
    audience?: string;
    result?: string;
  }>;
  outcomesTitle?: string;
  outcomes?: string[];
  cta?: {
    label?: string;
    href?: string;
  };
};

const fallbackLevels = [
  { key: 'level1', Icon: Brain },
  { key: 'level2', Icon: Workflow },
  { key: 'level3', Icon: Rocket },
] as const;

const fallbackOutcomes = ['outcome1', 'outcome2', 'outcome3'] as const;

const icons = [Brain, Workflow, Rocket] as const;

export function Training({ content }: { content?: TrainingContent | null }) {
  const t = useTranslations('training');

  const levels = content?.levels?.length
    ? content.levels.slice(0, 3).map((level, index) => ({
        key: level.label || level.title || String(index),
        Icon: icons[index] ?? Brain,
        label: level.label || t(`levels.${fallbackLevels[index]?.key ?? 'level1'}.label`),
        title: level.title || t(`levels.${fallbackLevels[index]?.key ?? 'level1'}.title`),
        duration: level.duration || t(`levels.${fallbackLevels[index]?.key ?? 'level1'}.duration`),
        body: level.body || t(`levels.${fallbackLevels[index]?.key ?? 'level1'}.body`),
        audience: level.audience || t(`levels.${fallbackLevels[index]?.key ?? 'level1'}.audience`),
        result: level.result || t(`levels.${fallbackLevels[index]?.key ?? 'level1'}.result`),
      }))
    : fallbackLevels.map(({ key, Icon }) => ({
        key,
        Icon,
        label: t(`levels.${key}.label`),
        title: t(`levels.${key}.title`),
        duration: t(`levels.${key}.duration`),
        body: t(`levels.${key}.body`),
        audience: t(`levels.${key}.audience`),
        result: t(`levels.${key}.result`),
      }));

  const outcomes = content?.outcomes?.length ? content.outcomes : fallbackOutcomes.map((key) => t(`outcomes.${key}`));
  const ctaHref = content?.cta?.href || '#contact';

  return (
    <section id="training" className="relative overflow-hidden border-t border-border py-24 md:py-32">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
      <div className="absolute -right-40 top-24 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

      <div className="container-x relative">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div className="max-w-3xl">
            <SectionLabel>{content?.eyebrow || t('eyebrow')}</SectionLabel>
            <h2 className="mt-6 text-h1 font-semibold text-balance">{content?.title || t('title')}</h2>
            <p className="mt-5 text-lg text-text-muted text-balance">{content?.subtitle || t('subtitle')}</p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6 md:p-8">
            <p className="font-mono text-xs uppercase tracking-widest text-accent">{content?.academyLabel || t('academyLabel')}</p>
            <p className="mt-4 text-2xl font-semibold tracking-tight text-balance">{content?.academyTitle || t('academyTitle')}</p>
            <p className="mt-3 text-sm leading-6 text-text-muted">{content?.academyBody || t('academyBody')}</p>
          </div>
        </div>

        <div className="mt-16 grid gap-5 lg:grid-cols-3">
          {levels.map(({ key, Icon, label, title, duration, body, audience, result }, i) => (
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
                  {duration}
                </span>
              </div>

              <p className="mt-8 font-mono text-xs uppercase tracking-widest text-accent">
                {label}
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight">{title}</h3>
              <p className="mt-4 text-sm leading-6 text-text-muted">{body}</p>

              <div className="mt-8 space-y-4">
                <TrainingDetail label={content?.forWhomLabel || t('forWhom')} value={audience} />
                <TrainingDetail label={content?.resultLabel || t('result')} value={result} />
              </div>

              <div className="mt-auto pt-8 font-mono text-[10px] uppercase tracking-widest text-text-muted/60">
                {String(i + 1).padStart(2, '0')} / {String(levels.length).padStart(2, '0')}
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-8 grid gap-5 rounded-2xl border border-border bg-bg p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
          <div>
            <p className="text-xl font-semibold tracking-tight">{content?.outcomesTitle || t('outcomesTitle')}</p>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {outcomes.map((outcome) => (
                <div key={outcome} className="flex gap-3 text-sm text-text-muted">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>{outcome}</span>
                </div>
              ))}
            </div>
          </div>
          <Button href={ctaHref} size="lg" arrow>
            {content?.cta?.label || t('cta')}
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
