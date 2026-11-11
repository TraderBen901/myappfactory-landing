'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Boxes, Cpu, Key } from 'lucide-react';
import { SectionLabel } from './ui/SectionLabel';
import { ApproachScene, type ApproachSceneLabels } from './ApproachScene';

export function Approach() {
  const t = useTranslations('approach');

  // Textes de l'animation (couches du pack, étiquette d'état)
  const scene: ApproachSceneLabels = {
    alt: t('scene.alt'),
    layers: [t('scene.layerData'), t('scene.layerAi'), t('scene.layerRules'), t('scene.layerScreens')],
    hints: [t('scene.hintData'), t('scene.hintAi'), t('scene.hintRules'), t('scene.hintScreens')],
    pack: t('scene.pack'),
    tailoring: t('scene.tailoring'),
    tailored: t('scene.tailored'),
  };

  const pillars = [
    { key: 'modular', Icon: Boxes },
    { key: 'aiNative', Icon: Cpu },
    { key: 'ownership', Icon: Key },
  ] as const;

  return (
    <section id="approach" className="relative border-t border-border bg-surface py-24 md:py-32">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left: copy */}
          <div className="lg:col-span-5">
            <SectionLabel>{t('eyebrow')}</SectionLabel>
            <h2 className="mt-6 text-h1 font-semibold text-balance">{t('title')}</h2>
            <p className="mt-5 text-lg text-text-muted text-balance">{t('subtitle')}</p>
          </div>

          {/* Right: animation — anatomie d'un pack, dessinée en code */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <div className="relative mx-auto aspect-square w-full max-w-xl overflow-hidden rounded-xl border border-border bg-bg sm:aspect-[6/5]">
              <ApproachScene labels={scene} className="absolute inset-0" />
            </div>
          </motion.div>
        </div>

        {/* Pillars */}
        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {pillars.map(({ key, Icon }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-xl border border-border bg-bg p-6"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="font-semibold tracking-tight">{t(`pillars.${key}.title`)}</h3>
              </div>
              <p className="mt-4 text-sm text-text-muted">{t(`pillars.${key}.body`)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
