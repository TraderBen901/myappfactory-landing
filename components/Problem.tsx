'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { SectionLabel } from './ui/SectionLabel';

/* Trois petits schémas, un par impasse. Les chiffres viennent du texte de chaque carte. */

const line = 'stroke-text/45';
const soft = 'fill-text/10';
const softer = 'fill-text/[0.06]';
const mono = 'font-mono text-[11px]';

/** Les SaaS génériques : 60 % couverts, 40 % qui restent dans un tableur. */
function GenericArt() {
  return (
    <svg viewBox="0 0 300 160" className="h-full w-full" aria-hidden="true">
      <rect x="20" y="14" width="260" height="112" rx="8" className={`fill-surface ${line}`} strokeWidth="1.2" />
      <path d="M20,36 H280" className={line} strokeWidth="1" />
      {[32, 42, 52].map((cx) => (
        <circle key={cx} cx={cx} cy="25" r="3" className="fill-text/15" />
      ))}
      {/* la partie couverte */}
      <rect x="32" y="48" width="60" height="30" rx="4" className={soft} />
      <rect x="98" y="48" width="66" height="30" rx="4" className={soft} />
      <rect x="32" y="85" width="132" height="10" rx="5" className={soft} />
      <rect x="32" y="102" width="96" height="10" rx="5" className={softer} />
      {/* ce qui manque : votre métier, dans un tableur */}
      <rect x="178" y="46" width="92" height="70" rx="6" className="fill-accent-2/[0.07] stroke-accent-2" strokeWidth="1.3" strokeDasharray="5 4" />
      <path
        d="M190,58 H258 M190,74 H258 M190,90 H258 M190,106 H258 M190,58 V106 M213,58 V106 M236,58 V106 M258,58 V106"
        className="stroke-accent-2/60"
        strokeWidth="1"
        fill="none"
      />
      <text x="98" y="148" textAnchor="middle" className={`${mono} fill-text-muted`}>
        60 %
      </text>
      <text x="224" y="148" textAnchor="middle" className={`${mono} fill-accent-2`}>
        40 %
      </text>
    </svg>
  );
}

/** Le développement classique : six mois jusqu'au premier résultat, un budget qui grimpe. */
function CustomArt() {
  return (
    <svg viewBox="0 0 300 160" className="h-full w-full" aria-hidden="true">
      {/* budget */}
      <path d="M24,74 C110,72 180,58 262,22" className="stroke-accent-2" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M262,22 l-11,1.5 M262,22 l-4.5,10" className="stroke-accent-2" strokeWidth="2" fill="none" strokeLinecap="round" />
      <text x="170" y="34" textAnchor="middle" className={`${mono} fill-accent-2`}>
        budget ×2
      </text>
      {/* six mois */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={24 + i * 42} y="88" width="36" height="16" rx="3.5" className={i === 5 ? 'fill-text/20' : soft} />
      ))}
      <path d="M24,114 H276" className={line} strokeWidth="1.2" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <path key={i} d={`M${24 + i * 42},110 v8`} className={line} strokeWidth="1.2" />
      ))}
      {/* le premier résultat, tout au bout */}
      <path d="M276,114 V56" className={line} strokeWidth="1.2" />
      <path d="M276,56 h-30 l7,8 l-7,8 h30 z" className={`fill-surface ${line}`} strokeWidth="1.2" strokeLinejoin="round" />
      <text x="24" y="140" className={`${mono} fill-text-muted`}>
        M1
      </text>
      <text x="276" y="140" textAnchor="end" className={`${mono} fill-text-muted`}>
        M6
      </text>
    </svg>
  );
}

/** L'IA greffée : un chatbot collé sur un site existant. */
function GraftedArt() {
  return (
    <svg viewBox="0 0 300 160" className="h-full w-full" aria-hidden="true">
      <rect x="20" y="14" width="206" height="112" rx="8" className={`fill-surface ${line}`} strokeWidth="1.2" />
      <path d="M20,36 H226" className={line} strokeWidth="1" />
      {[32, 42, 52].map((cx) => (
        <circle key={cx} cx={cx} cy="25" r="3" className="fill-text/15" />
      ))}
      <rect x="32" y="48" width="92" height="34" rx="4" className={soft} />
      <rect x="130" y="48" width="84" height="34" rx="4" className={softer} />
      <rect x="32" y="90" width="120" height="10" rx="5" className={soft} />
      <rect x="32" y="106" width="84" height="10" rx="5" className={softer} />
      {/* la bulle rapportée, tenue par deux bouts d'adhésif */}
      <rect x="188" y="78" width="92" height="62" rx="12" className="fill-surface stroke-accent-2" strokeWidth="1.4" strokeDasharray="5 4" />
      <rect x="200" y="92" width="50" height="9" rx="4.5" className="fill-accent-2/20" />
      <rect x="218" y="108" width="50" height="9" rx="4.5" className="fill-accent-2/10" />
      <circle cx="205" cy="126" r="2" className="fill-accent-2/50" />
      <circle cx="213" cy="126" r="2" className="fill-accent-2/50" />
      <circle cx="221" cy="126" r="2" className="fill-accent-2/50" />
      <rect x="178" y="72" width="26" height="9" rx="2" transform="rotate(-32 191 76)" className="fill-accent-2/30" />
      <rect x="264" y="72" width="26" height="9" rx="2" transform="rotate(32 277 76)" className="fill-accent-2/30" />
      <text x="262" y="50" textAnchor="middle" className={`${mono} fill-accent-2`}>
        +10 %
      </text>
    </svg>
  );
}

export function Problem() {
  const t = useTranslations('problem');

  const cards = [
    { key: 'generic', Art: GenericArt },
    { key: 'custom', Art: CustomArt },
    { key: 'ai', Art: GraftedArt },
  ] as const;

  return (
    <section id="problem" className="relative py-20 md:py-24">
      <div className="container-x">
        <div className="max-w-3xl">
          <SectionLabel>{t('eyebrow')}</SectionLabel>
          <h2 className="mt-6 text-h1 font-semibold text-balance">{t('title')}</h2>
          <p className="mt-5 text-lg text-text-muted text-balance">{t('subtitle')}</p>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
          {cards.map(({ key, Art }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative flex flex-col bg-surface p-6 md:p-8"
            >
              <div className="aspect-[15/8] w-full rounded-xl border border-border bg-bg p-2">
                <Art />
              </div>
              <h3 className="mt-7 text-xl font-semibold tracking-tight">{t(`cards.${key}.title`)}</h3>
              <p className="mt-3 text-text-muted">{t(`cards.${key}.body`)}</p>

              <div className="mt-auto pt-8 font-mono text-xs uppercase tracking-widest text-text-muted/60">
                0{i + 1} / 03
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
