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

  // TODO: remplacer par '/animations/Video_Factory_dark.mp4' quand disponible
  const videoSrc = '/animations/Video_Factory_light.mp4';

  useEffect(() => {
    videoRef.current?.load();
  }, [videoSrc]);

  return (
    <section className="relative overflow-hidden bg-bg">

      {/* ── Vidéo + overlays ─────────────────────────────── */}
      <div className="relative h-[85vh] w-full overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>

        {/* Fondu haut — transition depuis le header */}
        <div className="hero-fade-top pointer-events-none absolute inset-x-0 top-0 h-56" />

        {/* Fondu bas — transition vers la section suivante */}
        <div className="hero-fade-bottom pointer-events-none absolute inset-x-0 bottom-0 h-40" />

        {/* Fondu gauche — zone de lisibilité pour le texte */}
        <div className="hero-fade-left pointer-events-none absolute inset-0" />

        {/* ── Texte — overlay côté gauche ──────────────── */}
        <div className="absolute inset-0 flex items-center pt-16">
          <div className="mr-auto w-full max-w-xl px-8 md:pl-20 lg:pl-32">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <SectionLabel>{t('eyebrow')}</SectionLabel>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-5 text-h1 font-semibold text-balance"
            >
              {t('title')}{' '}
              <span className="relative inline-block text-accent">
                {t('titleAccent')}
                <span className="absolute -bottom-1 left-0 h-1 w-full bg-accent/30" />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-5 text-base text-text-muted text-balance md:text-lg"
            >
              {t('subtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Button href="#contact" variant="primary" size="lg">
                {t('ctaPrimary')}
              </Button>
              <Button href="#work" variant="secondary" size="lg" arrow={false}>
                {t('ctaSecondary')}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Stats — sous la vidéo ─────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="container-x"
      >
        <div className="grid grid-cols-3 gap-6 border-t border-border py-10 md:py-12">
          <Stat label={t('stats.speedLabel')} value={t('stats.speed')} />
          <Stat label={t('stats.packsLabel')} value={t('stats.packs')} />
          <Stat label={t('stats.aiLabel')} value={t('stats.ai')} />
        </div>
      </motion.div>

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
