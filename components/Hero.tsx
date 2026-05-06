'use client';

import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/Button';
import { SectionLabel } from './ui/SectionLabel';

export function Hero() {
  const t = useTranslations('hero');
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => setMounted(true), []);

  // Switch to '/animations/Video_Factory_dark.mp4' when ready
  const videoSrc =
    mounted && resolvedTheme === 'dark'
      ? '/animations/Video_Factory_light.mp4'
      : '/animations/Video_Factory_light.mp4';

  // Reload video when src changes (theme switch)
  useEffect(() => {
    videoRef.current?.load();
  }, [videoSrc]);

  return (
    <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24">
      {/* Grid background */}
      <div className="pointer-events-none absolute inset-0 grid-bg [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />

      {/* Glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-accent/10 blur-[140px]" />

      <div className="container-x relative">

        {/* Centered headline */}
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
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
            className="mt-6 text-lg text-text-muted text-balance md:text-xl"
          >
            {t('subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            <Button href="#contact" variant="primary" size="lg">
              {t('ctaPrimary')}
            </Button>
            <Button href="#work" variant="secondary" size="lg" arrow={false}>
              {t('ctaSecondary')}
            </Button>
          </motion.div>
        </div>

        {/* Video — full width */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="mt-16 md:mt-20"
        >
          <div className="relative w-full overflow-hidden rounded-2xl border border-border shadow-2xl shadow-black/20">
            {/* Corner brackets */}
            <Corner pos="top-3 left-3" />
            <Corner pos="top-3 right-3" rotate="rotate-90" />
            <Corner pos="bottom-3 right-3" rotate="rotate-180" />
            <Corner pos="bottom-3 left-3" rotate="-rotate-90" />

            <video
              ref={videoRef}
              key={videoSrc}
              autoPlay
              loop
              muted
              playsInline
              className="aspect-video w-full object-cover"
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
          </div>
        </motion.div>

        {/* Stats below video */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-12 grid grid-cols-3 gap-6 border-t border-border pt-8 md:mt-16"
        >
          <Stat label={t('stats.speedLabel')} value={t('stats.speed')} />
          <Stat label={t('stats.packsLabel')} value={t('stats.packs')} />
          <Stat label={t('stats.aiLabel')} value={t('stats.ai')} />
        </motion.div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="font-mono text-2xl font-semibold tracking-tight text-text md:text-3xl">
        {value}
      </div>
      <div className="mt-1 text-xs uppercase tracking-widest text-text-muted">{label}</div>
    </div>
  );
}

function Corner({ pos, rotate = '' }: { pos: string; rotate?: string }) {
  return (
    <div className={`absolute z-10 ${pos} h-4 w-4 ${rotate}`}>
      <span className="absolute inset-0 border-l-2 border-t-2 border-accent/60" />
    </div>
  );
}
