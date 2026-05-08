'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Boxes, Cpu, Key } from 'lucide-react';
import { SectionLabel } from './ui/SectionLabel';

export function Approach() {
  const t = useTranslations('approach');

  const pillars = [
    { key: 'modular', Icon: Boxes },
    { key: 'aiNative', Icon: Cpu },
    { key: 'ownership', Icon: Key },
  ] as const;

  return (
    <section id="approach" className="relative border-t border-border bg-surface py-24 md:py-32">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Left: copy */}
          <div className="lg:col-span-5">
            <SectionLabel>{t('eyebrow')}</SectionLabel>
            <h2 className="mt-6 text-h1 font-semibold text-balance">{t('title')}</h2>
            <p className="mt-5 text-lg text-text-muted text-balance">{t('subtitle')}</p>
          </div>

          {/* Right: video — One Module */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            {/*
              TODO: ajouter version dark quand disponible
              (ex: Video_Factory_dark_One_module.mp4 + theme switch)
            */}
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-bg">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 h-full w-full scale-[1.01] object-cover"
              >
                <source src="/animations/Video_Factory_ight_One_module.mp4" type="video/mp4" />
              </video>
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
