'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/Button';
import { SectionLabel } from './ui/SectionLabel';

export function Hero() {
  const t = useTranslations('hero');
  const videoRef = useRef<HTMLVideoElement>(null);

  // TODO: remplacer par '/animations/Video_Factory_dark.mp4' quand disponible
  const videoSrc = '/animations/Video_Factory_light.mp4';

  useEffect(() => {
    videoRef.current?.load();
  }, [videoSrc]);

  // Texte hero — réutilisé en mobile (flow) et desktop (overlay)
  const HeroContent = () => (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <SectionLabel>{t('eyebrow')}</SectionLabel>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="mt-5 text-h1 font-semibold"
      >
        {t('title')}{' '}
        <span className="relative inline-block text-accent">
          {t('titleAccent')}
          <span className="absolute -bottom-1 left-0 h-1 w-full bg-accent/30" />
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="mt-5 max-w-md text-base text-text-muted md:text-lg"
      >
        {t('subtitle')}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <Button href="#contact" variant="primary" size="md">
          {t('ctaPrimary')}
        </Button>
        <Button href="#work" variant="secondary" size="md" arrow={false}>
          {t('ctaSecondary')}
        </Button>
      </motion.div>
    </>
  );

  return (
    <section className="relative overflow-hidden bg-bg">

      {/* ── Mobile : texte au-dessus de la vidéo ─────── */}
      <div className="block px-6 pb-6 pt-24 md:hidden">
        <HeroContent />
      </div>

      {/* ── Vidéo + overlays ──────────────────────────── */}
      <div className="relative h-[42vh] w-full overflow-hidden sm:h-[55vh] md:h-[70vh] md:pt-10">
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

        {/* Fondu haut — desktop only (sous le header) */}
        <div className="hero-fade-top pointer-events-none absolute inset-x-0 top-0 hidden h-56 md:block" />

        {/* Fondu bas — plus court sur mobile pour préserver la vidéo */}
        <div className="hero-fade-bottom pointer-events-none absolute inset-x-0 -bottom-px h-24 md:h-56" />

        {/* Fondu gauche — desktop only (lisibilité du texte overlay) */}
        <div className="hero-fade-left pointer-events-none absolute inset-0 hidden md:block" />

        {/* ── Texte — overlay desktop seulement ──────── */}
        <div className="absolute inset-0 hidden items-center pt-16 md:flex">
          <div className="w-[48%] pl-12 md:pl-16 lg:pl-24">
            <HeroContent />
          </div>
        </div>
      </div>

      {/* ── Stats — 1 col mobile, 3 cols tablette+ ──── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="container-x"
      >
        <div className="grid grid-cols-1 gap-6 py-8 sm:grid-cols-3 md:py-12">
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
