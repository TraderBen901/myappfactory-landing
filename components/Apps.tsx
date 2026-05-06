'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { SectionLabel } from './ui/SectionLabel';

type AppItem = {
  key: 'harold' | 'telle' | 'leo';
  href: string | null;
  external: boolean;
  accentClass: string;
};

const apps: AppItem[] = [
  {
    key: 'harold',
    href: 'https://haroldproject.com',
    external: true,
    accentClass: 'from-accent/15 to-transparent',
  },
  {
    key: 'telle',
    href: 'https://tell-e.tech',
    external: true,
    accentClass: 'from-accent-2/15 to-transparent',
  },
  {
    key: 'leo',
    href: null,
    external: false,
    accentClass: 'from-accent/15 to-transparent',
  },
];

export function Apps() {
  const t = useTranslations('apps');

  return (
    <section id="work" className="relative border-t border-border bg-surface py-24 md:py-32">
      <div className="container-x">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <SectionLabel>{t('eyebrow')}</SectionLabel>
            <h2 className="mt-6 text-h1 font-semibold text-balance">{t('title')}</h2>
            <p className="mt-5 text-lg text-text-muted text-balance">{t('subtitle')}</p>
          </div>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {apps.map((app, i) => (
            <AppCard key={app.key} app={app} index={i} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AppCard({
  app,
  index,
  t,
}: {
  app: AppItem;
  index: number;
  t: ReturnType<typeof useTranslations>;
}) {
  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    app.href ? (
      <a
        href={app.href}
        target={app.external ? '_blank' : undefined}
        rel={app.external ? 'noopener noreferrer' : undefined}
        className="block h-full"
      >
        {children}
      </a>
    ) : (
      <div className="block h-full cursor-default">{children}</div>
    );

  const isLive = app.href !== null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Wrapper>
        <article className="group relative h-full overflow-hidden rounded-2xl border border-border bg-bg transition hover:border-accent/40">
          {/* Visual area — placeholder for screenshot */}
          <div className="relative aspect-[16/10] overflow-hidden border-b border-border bg-surface-2">
            <div className={`absolute inset-0 bg-gradient-to-br ${app.accentClass}`} />
            <div className="absolute inset-0 grid-bg opacity-50" />

            {/* Screenshot placeholder */}
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <div className="rounded-lg border border-border bg-surface/80 px-4 py-2 backdrop-blur-sm">
                <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
                  /public/apps/{app.key}.png
                </p>
              </div>
            </div>

            {/* Status badge */}
            <div className="absolute left-4 top-4">
              {isLive ? (
                <span className="flex items-center gap-1.5 rounded-full border border-accent/30 bg-bg/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-accent backdrop-blur-sm">
                  <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                  Live
                </span>
              ) : (
                <span className="flex items-center gap-1.5 rounded-full border border-border bg-bg/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-text-muted backdrop-blur-sm">
                  Soon
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
              {t(`items.${app.key}.category`)}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <h3 className="text-xl font-semibold tracking-tight">
                {t(`items.${app.key}.name`)}
              </h3>
              {isLive && (
                <ArrowUpRight className="h-5 w-5 text-text-muted transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
              )}
            </div>
            <p className="mt-3 text-sm text-text-muted">
              {t(`items.${app.key}.description`)}
            </p>
          </div>
        </article>
      </Wrapper>
    </motion.div>
  );
}
