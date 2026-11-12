'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Button } from './ui/Button';
import { SectionLabel } from './ui/SectionLabel';
import { HeroScene, type HeroSceneLabels } from './HeroScene';

export function Hero() {
  const t = useTranslations('hero');

  // Textes de l'animation (briques, fenêtre, marquages au sol)
  const scene: HeroSceneLabels = {
    alt: t('scene.alt'),
    appTitle: t('scene.appTitle'),
    building: t('scene.building'),
    live: t('scene.live'),
    bricks: [t('scene.brick1'), t('scene.brick2'), t('scene.brick3'), t('scene.brick4'), t('scene.brick5')],
    custom: t('scene.custom'),
    measure: t('scene.measure'),
    stock: t('scene.stock'),
    floorStock: t('scene.floorStock'),
    floorBuild: t('scene.floorBuild'),
    floorLive: t('scene.floorLive'),
  };

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
        className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
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
      <div className="block px-6 pb-6 pt-24 xl:hidden">
        <HeroContent />
      </div>

      {/* ── Animation + overlays ──────────────────────── */}
      <div className="relative aspect-[19/20] w-full overflow-hidden sm:aspect-[3/2] lg:aspect-[2/1] xl:aspect-auto xl:h-[78vh]">
        {/* Scène dessinée en code : nette à toutes les tailles, suit le thème et la langue */}
        <HeroScene labels={scene} className="absolute inset-0 xl:left-[40%] xl:top-14" />

        {/* Fondu haut — desktop only (sous le header) */}
        <div className="hero-fade-top pointer-events-none absolute inset-x-0 top-0 hidden h-24 xl:block" />

        {/* Fondu bas */}
        <div className="hero-fade-bottom pointer-events-none absolute inset-x-0 -bottom-px h-10 xl:h-20" />

        {/* Fondu gauche — desktop only (lisibilité du texte overlay) */}
        <div className="hero-fade-scene pointer-events-none absolute inset-0 hidden xl:block" />

        {/* ── Texte — overlay desktop seulement ──────── */}
        <div className="absolute inset-0 hidden items-center pt-16 xl:flex">
          <div className="w-[36%] pl-24 2xl:w-[42%]">
            {/* largeur bornée : le titre passe à la ligne avant le dessin, même sur très grand écran */}
            <div className="max-w-[38rem]">
              <HeroContent />
            </div>
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
