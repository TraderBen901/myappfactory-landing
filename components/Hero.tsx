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
      ? '/animations/Video_Factory_light.mp4' // TODO: replace with dark version
      : '/animations/Video_Factory_light.mp4';

  useEffect(() => {
    videoRef.current?.load();
  }, [videoSrc]);

  return (
    <section className="relative overflow-hidden pt-32 md:pt-40">
      {/* Headline — dans le container */}
      <div className="container-x relative pb-14 md:pb-20">
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
      </div>

      {/* Vidéo — pleine largeur, sans cadre ni ombre */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="w-full"
      >
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
      </motion.div>

      {/* Stats — sous la vidéo, dans le container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.7 }}
        className="container-x"
      >
        <div className="grid grid-cols-3 gap-6 border-t border-border py-10 md:py-14">
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
