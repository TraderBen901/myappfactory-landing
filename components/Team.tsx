'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { Linkedin, MapPin } from 'lucide-react';
import { SectionLabel } from './ui/SectionLabel';

// Les trois cofondateurs, dans l'ordre donné par Benoît. Noms et liens : profils LinkedIn publics.
const MEMBERS = [
  { key: 'dominique', name: 'Dominique Daue', initials: 'DD', linkedin: 'https://www.linkedin.com/in/dominique-daue-8399528/' },
  { key: 'arnaud', name: 'Arnaud Boland', initials: 'AB', linkedin: 'https://www.linkedin.com/in/arnaudboland/' },
  { key: 'benoit', name: 'Benoît Schiepers', initials: 'BS', linkedin: 'https://www.linkedin.com/in/benoit-schiepers/' },
] as const;

export function Team() {
  const t = useTranslations('team');

  return (
    <section id="team" className="relative border-t border-border bg-surface py-24 md:py-32">
      <div className="container-x">
        <div className="max-w-3xl">
          <SectionLabel>{t('eyebrow')}</SectionLabel>
          <h2 className="mt-6 text-h1 font-semibold text-balance">{t('title')}</h2>
          <p className="mt-5 text-lg text-text-muted text-balance">{t('subtitle')}</p>
        </div>

        <div className="mt-20">
          <ul className="grid gap-14 md:grid-cols-3 md:gap-6">
            {MEMBERS.map((m, i) => (
              <motion.li
                key={m.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative flex flex-col items-center rounded-2xl border border-border bg-bg px-6 pb-8 pt-14 text-center"
              >
                {/*
                  Le trait vert qui relie les trois associés (à partir de la tablette), du centre de la 1re carte
                  au centre de la 3e. Un segment par carte, qui déborde de la moitié de l'espace entre les cartes
                  (gap-6 = 1,5rem) : les segments se rejoignent, et les initiales passent au-dessus.
                */}
                <span
                  aria-hidden
                  className={clsx(
                    'absolute -top-px z-10 hidden h-0.5 bg-accent opacity-60 md:block',
                    i === 0 ? 'left-1/2' : '-left-3',
                    i === MEMBERS.length - 1 ? 'right-1/2' : '-right-3'
                  )}
                />

                {/* Initiales, posées sur le bord haut de la carte */}
                <div
                  aria-hidden
                  className="absolute left-1/2 top-0 z-20 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-accent bg-bg font-mono text-base font-semibold tracking-wider text-accent"
                >
                  {m.initials}
                </div>

                <p className="font-mono text-xs uppercase tracking-widest text-accent">{t('role')}</p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight">{m.name}</h3>
                <p className="mt-3 text-text-muted">{t(`members.${m.key}.focus`)}</p>
                <p className="mb-7 mt-2 inline-flex items-center gap-1.5 text-sm text-text-muted">
                  <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  {t(`members.${m.key}.city`)}
                </p>

                {/* mt-auto : les trois boutons restent alignés en bas, même si un nom passe sur deux lignes */}
                <a
                  href={m.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t('linkAria', { name: m.name })}
                  className="mt-auto inline-flex min-h-[44px] items-center gap-2 rounded-full border border-border px-5 text-sm font-medium text-text transition hover:border-accent hover:text-accent focus-visible:border-accent focus-visible:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <Linkedin className="h-4 w-4 shrink-0" aria-hidden />
                  {t('linkLabel')}
                  <span aria-hidden>↗</span>
                </a>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
