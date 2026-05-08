'use client';

import { useState, FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
  Check,
  Send,
  Globe,
  Smartphone,
  Wrench,
  Bot,
  Workflow,
  Target,
  Lightbulb,
  Sparkles,
  Zap,
  Clock,
  CalendarDays,
  Compass,
} from 'lucide-react';
import { SectionLabel } from './ui/SectionLabel';

// Cal.com — page de réservation tell-e
const CAL_BASE_URL = 'https://cal.com/tell-e';

const SERVICE_OPTIONS = [
  { key: 'web', Icon: Globe },
  { key: 'mobile', Icon: Smartphone },
  { key: 'internal', Icon: Wrench },
  { key: 'ai', Icon: Bot },
  { key: 'automation', Icon: Workflow },
  { key: 'leadgen', Icon: Target },
  { key: 'audit', Icon: Lightbulb },
  { key: 'custom', Icon: Sparkles },
] as const;

const TIMELINE_OPTIONS = [
  { key: 'asap', Icon: Zap },
  { key: '13', Icon: Clock },
  { key: '36', Icon: CalendarDays },
  { key: 'explore', Icon: Compass },
] as const;

const BUDGET_OPTIONS = ['s', 'm', 'l', 'xl'] as const;

const TOTAL_FIELDS = 6; // name, email, services, timeline, challenge, budget

export function FinalCTA() {
  const t = useTranslations('cta');
  const tForm = useTranslations('cta.form');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [services, setServices] = useState<string[]>([]);
  const [timeline, setTimeline] = useState('');
  const [challenge, setChallenge] = useState('');
  const [budget, setBudget] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const filled = [
    name.trim().length > 0,
    email.trim().length > 0,
    services.length > 0,
    timeline.length > 0,
    challenge.trim().length > 0,
    budget.length > 0,
  ].filter(Boolean).length;

  const toggleService = (key: string) => {
    setServices((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setSubmitting(true);

    const noteLines = [
      website && `🌐 Site : ${website}`,
      services.length &&
        `🛠️ Services : ${services.map((s) => tForm(`services.${s}`)).join(', ')}`,
      timeline && `⏱️ Délai : ${tForm(`timeline.${timeline}`)}`,
      budget && `💰 Budget : ${tForm(`budget.${budget}`)}`,
      challenge && `\n📌 Défi :\n${challenge}`,
    ].filter(Boolean);

    const params = new URLSearchParams();
    params.set('name', name);
    params.set('email', email);
    if (noteLines.length) {
      params.set('notes', noteLines.join('\n'));
    }

    window.location.href = `${CAL_BASE_URL}?${params.toString()}`;
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-border py-24 md:py-32"
    >
      {/* Glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-accent/10 blur-[140px]" />

      <div className="container-x relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="flex justify-center">
            <SectionLabel>{t('eyebrow')}</SectionLabel>
          </div>
          <h2 className="mt-6 text-h1 font-semibold text-balance">{t('title')}</h2>
          <p className="mt-5 text-lg text-text-muted text-balance">{t('subtitle')}</p>
        </motion.div>

        {/* Two-column layout */}
        <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-16">

          {/* ── Left column : expectations ────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5"
          >
            <h3 className="text-2xl font-semibold tracking-tight">
              {t('expectations.title')}
            </h3>
            <ul className="mt-6 space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-accent">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span className="text-text-muted">
                    {t(`expectations.list.${i}`)}
                  </span>
                </li>
              ))}
            </ul>

            {/* Email fallback */}
            <div className="mt-10 rounded-xl border border-border bg-surface p-5">
              <p className="text-sm text-text-muted">
                {t('emailFallback.label')}
              </p>
              <a
                href={`mailto:${t('emailFallback.address')}`}
                className="mt-1 inline-flex items-center gap-1.5 font-medium text-accent transition hover:underline"
              >
                {t('emailFallback.address')}
                <span aria-hidden>→</span>
              </a>
            </div>
          </motion.div>

          {/* ── Right column : form ────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7"
          >
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-border bg-surface p-6 md:p-8"
            >
              {/* Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-text-muted">
                  <span>{tForm('progress')}</span>
                  <span className="text-accent">{filled}/{TOTAL_FIELDS}</span>
                </div>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-bg">
                  <div
                    className="h-full rounded-full bg-accent transition-all duration-500"
                    style={{ width: `${(filled / TOTAL_FIELDS) * 100}%` }}
                  />
                </div>
              </div>

              {/* Name + Email */}
              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label={tForm('nameLabel')}
                  required
                >
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={tForm('namePlaceholder')}
                    required
                    className="w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm outline-none transition placeholder:text-text-muted/60 focus:border-accent"
                  />
                </Field>
                <Field
                  label={tForm('emailLabel')}
                  required
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={tForm('emailPlaceholder')}
                    required
                    className="w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm outline-none transition placeholder:text-text-muted/60 focus:border-accent"
                  />
                </Field>
              </div>

              {/* Website */}
              <div className="mt-4">
                <Field label={tForm('websiteLabel')}>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder={tForm('websitePlaceholder')}
                    className="w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm outline-none transition placeholder:text-text-muted/60 focus:border-accent"
                  />
                </Field>
              </div>

              {/* Services */}
              <div className="mt-6">
                <Field label={tForm('servicesLabel')}>
                  <div className="flex flex-wrap gap-2">
                    {SERVICE_OPTIONS.map(({ key, Icon }) => (
                      <Chip
                        key={key}
                        active={services.includes(key)}
                        onClick={() => toggleService(key)}
                        Icon={Icon}
                        label={tForm(`services.${key}`)}
                      />
                    ))}
                  </div>
                </Field>
              </div>

              {/* Timeline */}
              <div className="mt-6">
                <Field label={tForm('timelineLabel')}>
                  <div className="flex flex-wrap gap-2">
                    {TIMELINE_OPTIONS.map(({ key, Icon }) => (
                      <Chip
                        key={key}
                        active={timeline === key}
                        onClick={() => setTimeline(timeline === key ? '' : key)}
                        Icon={Icon}
                        label={tForm(`timeline.${key}`)}
                      />
                    ))}
                  </div>
                </Field>
              </div>

              {/* Challenge */}
              <div className="mt-6">
                <Field label={tForm('challengeLabel')}>
                  <textarea
                    value={challenge}
                    onChange={(e) => setChallenge(e.target.value)}
                    placeholder={tForm('challengePlaceholder')}
                    rows={4}
                    className="w-full resize-none rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm outline-none transition placeholder:text-text-muted/60 focus:border-accent"
                  />
                </Field>
              </div>

              {/* Budget */}
              <div className="mt-6">
                <Field label={tForm('budgetLabel')}>
                  <div className="flex flex-wrap gap-2">
                    {BUDGET_OPTIONS.map((key) => (
                      <Chip
                        key={key}
                        active={budget === key}
                        onClick={() => setBudget(budget === key ? '' : key)}
                        label={tForm(`budget.${key}`)}
                      />
                    ))}
                  </div>
                </Field>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting || !name.trim() || !email.trim()}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-bg transition hover:bg-accent/90 hover:shadow-[0_0_30px_-5px_var(--accent)] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
              >
                <span>{tForm('submit')}</span>
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ── Helpers ─────────────────────────────────────────────── */

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 inline-flex items-center gap-1 text-sm font-medium">
        {label}
        {required && <span className="text-accent-2">*</span>}
      </span>
      {children}
    </label>
  );
}

function Chip({
  active,
  onClick,
  Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  Icon?: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-[44px] items-center gap-2 rounded-full border px-4 text-sm transition sm:min-h-0 sm:py-2 ${
        active
          ? 'border-accent bg-accent/10 text-accent'
          : 'border-border bg-bg text-text-muted hover:border-accent/40 hover:text-text'
      }`}
    >
      {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
      <span>{label}</span>
    </button>
  );
}
