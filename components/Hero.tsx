'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Button } from './ui/Button';
import { SectionLabel } from './ui/SectionLabel';
import { AnimationSlot } from './ui/AnimationSlot';

export function Hero() {
  const t = useTranslations('hero');

  return (
    <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24">
      {/* Grid background */}
      <div className="pointer-events-none absolute inset-0 grid-bg [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />

      {/* Glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />

      <div className="container-x relative">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          {/* Left: Text */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <SectionLabel>{t('eyebrow')}</SectionLabel>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-6 text-display font-semibold text-balance"
            >
              {t('title')}{' '}
              <span className="relative inline-block text-accent">
                {t('titleAccent')}
                <span className="absolute -bottom-1 left-0 h-1 w-full bg-accent/30" />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 max-w-xl text-lg text-text-muted text-balance md:text-xl"
            >
              {t('subtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              <Button href="#contact" variant="primary" size="lg">
                {t('ctaPrimary')}
              </Button>
              <Button href="#work" variant="secondary" size="lg" arrow={false}>
                {t('ctaSecondary')}
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-16 grid grid-cols-3 gap-6 border-t border-border pt-8"
            >
              <Stat label={t('stats.speedLabel')} value={t('stats.speed')} />
              <Stat label={t('stats.packsLabel')} value={t('stats.packs')} />
              <Stat label={t('stats.aiLabel')} value={t('stats.ai')} />
            </motion.div>
          </div>

          {/* Right: Animation slot */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-5"
          >
            <AnimationSlot
              id="hero-factory"
              ratio="aspect-[5/6]"
              label="ANIMATION ISOMÉTRIQUE — usine principale"
              hint="Remplacer par /public/animations/hero.mp4 ou .webm"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono text-2xl font-semibold tracking-tight text-text md:text-3xl">
        {value}
      </div>
      <div className="mt-1 text-xs uppercase tracking-widest text-text-muted">{label}</div>
    </div>
  );
}
