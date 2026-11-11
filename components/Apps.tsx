'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowUpRight, Gift, Mail, Plus, Send, Sparkles } from 'lucide-react';
import { SectionLabel } from './ui/SectionLabel';

/* Chaque réalisation montre un écran reconstitué du produit, dessiné en code :
   lisible à la taille de la carte, dans les couleurs du site, sans nom de marque tierce.
   Les données affichées sont des exemples. */

type T = ReturnType<typeof useTranslations>;

type AppItem = {
  key: 'harold' | 'telle' | 'leo';
  href: string;
  Demo: (props: { t: T }) => JSX.Element;
};

function HaroldDemo({ t }: { t: T }) {
  const people = [
    ['Sophie', t('demo.harold.s1'), true],
    ['Marc', t('demo.harold.s2'), false],
    ['Claire', t('demo.harold.s3'), false],
  ] as const;
  return (
    <div className="grid h-full grid-cols-[88px_1fr] text-[11px] leading-tight">
      <div className="space-y-1.5 border-r border-border bg-bg/60 p-2">
        {people.map(([name, status, active]) => (
          <div key={name} className={`rounded-md p-1.5 ${active ? 'bg-accent/10 ring-1 ring-accent/30' : ''}`}>
            <div className="flex items-center gap-1.5">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-text/10 text-[8px] font-semibold">{name[0]}</span>
              <span className="font-medium">{name}</span>
            </div>
            <span className="mt-1 inline-block rounded bg-text/[0.06] px-1 py-px text-[8.5px] text-text-muted">{status}</span>
          </div>
        ))}
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-bg">SM</span>
            <div className="min-w-0">
              <div className="text-[12px] font-semibold">Sophie M.</div>
              <div className="truncate text-[9.5px] text-text-muted">{t('demo.harold.role')}</div>
            </div>
          </div>
          <div className="shrink-0 font-mono">
            <span className="text-[17px] font-semibold text-accent">87</span>
            <span className="text-[9px] text-text-muted">/100</span>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 shrink-0 text-accent" />
          <span className="truncate font-semibold">{t('demo.harold.report')}</span>
          <span className="ml-auto shrink-0 rounded-full bg-accent/10 px-1.5 py-px text-[8.5px] font-medium text-accent">{t('demo.harold.grade')}</span>
        </div>
        <div className="mt-2.5 space-y-2">
          {[86, 70, 78].map((w) => (
            <div key={w} className="flex items-center gap-2">
              <span className="h-1 w-1 shrink-0 rounded-full bg-accent" />
              <span className="h-1.5 rounded-full bg-text/10" style={{ width: `${w}%` }} />
            </div>
          ))}
        </div>
        <div className="mt-3 inline-flex items-center gap-1 rounded-md bg-accent px-2 py-1 text-[9.5px] font-medium text-bg">
          <Sparkles className="h-2.5 w-2.5" />
          {t('demo.harold.action')}
        </div>
      </div>
    </div>
  );
}

function SallyDemo({ t }: { t: T }) {
  const products = [
    ['49 €', 70],
    ['35 €', 54],
    ['62 €', 62],
  ] as const;
  return (
    <div className="grid h-full grid-cols-[1fr_1.05fr] text-[11px] leading-tight">
      <div className="flex flex-col gap-2 border-r border-border p-3">
        <div className="flex items-center gap-1.5">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[9px] font-semibold text-bg">S</span>
          <span className="font-semibold">SaLLy</span>
        </div>
        <div className="ml-auto max-w-[94%] rounded-xl rounded-br-sm bg-text/[0.06] px-2.5 py-1.5 text-[10.5px]">{t('demo.sally.ask')}</div>
        <div className="max-w-[94%] rounded-xl rounded-bl-sm border border-accent/30 bg-accent/10 px-2.5 py-1.5 text-[10.5px]">{t('demo.sally.reply')}</div>
        <div className="mt-auto flex items-center gap-1 rounded-full border border-border bg-bg px-2.5 py-1.5">
          <span className="h-1.5 w-16 rounded-full bg-text/10" />
          <Send className="ml-auto h-3 w-3 text-accent" />
        </div>
      </div>
      <div className="p-3">
        <div className="flex items-center gap-1.5 font-semibold">
          <Gift className="h-3 w-3 text-accent" />
          {t('demo.sally.suggestions')}
        </div>
        <div className="mt-2.5 space-y-2">
          {products.map(([price, w]) => (
            <div key={price} className="flex items-center gap-2 rounded-lg border border-border bg-bg p-1.5">
              <span className="h-8 w-8 shrink-0 rounded-md bg-text/[0.07]" />
              <div className="min-w-0 flex-1">
                <span className="block h-1.5 rounded-full bg-text/10" style={{ width: `${w}%` }} />
                <span className="mt-1.5 block font-mono text-[9.5px] text-text-muted">{price}</span>
              </div>
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-bg">
                <Plus className="h-3 w-3" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LeoDemo({ t }: { t: T }) {
  const kpis = [
    [t('demo.leo.k1'), '28', true],
    [t('demo.leo.k2'), '342', false],
    [t('demo.leo.k3'), '19 %', true],
  ] as const;
  const rows = [
    ['Julie M.', t('demo.leo.st1'), true],
    ['Marc D.', t('demo.leo.st2'), false],
    ['Sarah C.', t('demo.leo.st3'), false],
  ] as const;
  return (
    <div className="flex h-full flex-col gap-2.5 p-3 text-[11px] leading-tight">
      <div className="grid grid-cols-3 gap-2">
        {kpis.map(([label, value, accent]) => (
          <div key={label} className="min-w-0 rounded-lg border border-border bg-bg px-2 py-1.5">
            <div className="truncate text-[8.5px] text-text-muted">{label}</div>
            <div className={`mt-0.5 font-mono text-[15px] font-semibold ${accent ? 'text-accent' : ''}`}>{value}</div>
          </div>
        ))}
      </div>
      <div className="flex-1 overflow-hidden rounded-lg border border-border">
        {rows.map(([name, status, on]) => (
          <div key={name} className="flex items-center gap-2 border-b border-border px-2 py-[7px] last:border-b-0">
            <span className="w-[54px] shrink-0 font-medium">{name}</span>
            <span className="h-1.5 flex-1 rounded-full bg-text/[0.08]" />
            <span className={`shrink-0 rounded-full px-1.5 py-px text-[8.5px] font-medium ${on ? 'bg-accent/10 text-accent' : 'bg-text/[0.06] text-text-muted'}`}>
              {status}
            </span>
            <Mail className="h-3 w-3 shrink-0 text-accent/70" />
          </div>
        ))}
      </div>
    </div>
  );
}

const apps: AppItem[] = [
  { key: 'harold', href: 'https://haroldproject.com', Demo: HaroldDemo },
  { key: 'telle', href: 'https://tell-e.tech', Demo: SallyDemo },
  { key: 'leo', href: 'https://www.leoproject.live', Demo: LeoDemo },
];

export function Apps() {
  const t = useTranslations('apps');

  return (
    <section id="work" className="relative border-t border-border bg-surface py-20 md:py-24">
      <div className="container-x">
        <div className="max-w-2xl">
          <SectionLabel>{t('eyebrow')}</SectionLabel>
          <h2 className="mt-6 text-h1 font-semibold text-balance">{t('title')}</h2>
          <p className="mt-5 text-lg text-text-muted text-balance">{t('subtitle')}</p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {apps.map((app, i) => (
            <motion.div
              key={app.key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <a href={app.href} target="_blank" rel="noopener noreferrer" className="block h-full">
                <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-bg transition hover:border-accent/40 hover:shadow-lg hover:shadow-black/5">
                  {/* Écran du produit, posé sur un présentoir */}
                  <div className="border-b border-border bg-surface-2/70 px-5 pt-5">
                    <div className="overflow-hidden rounded-t-lg border border-b-0 border-text/15 bg-surface shadow-[0_-6px_24px_-14px_rgb(var(--text-rgb)/0.25)] transition duration-300 group-hover:-translate-y-1">
                      <div className="flex items-center gap-1.5 border-b border-border bg-bg px-3 py-2">
                        <span className="h-2 w-2 rounded-full bg-text/15" />
                        <span className="h-2 w-2 rounded-full bg-text/15" />
                        <span className="h-2 w-2 rounded-full bg-text/15" />
                        <span className="ml-2 font-mono text-[10px] text-text-muted">{t(`items.${app.key}.name`)}</span>
                      </div>
                      <div className="h-[196px]" aria-hidden="true">
                        <app.Demo t={t} />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-mono text-xs uppercase tracking-widest text-text-muted">{t(`items.${app.key}.category`)}</p>
                      <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-accent">
                        <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                        Live
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <h3 className="text-xl font-semibold tracking-tight">{t(`items.${app.key}.name`)}</h3>
                      <ArrowUpRight className="h-5 w-5 text-text-muted transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
                    </div>
                    <p className="mt-3 text-sm text-text-muted">{t(`items.${app.key}.description`)}</p>
                  </div>
                </article>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
