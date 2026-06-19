'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Button } from './ui/Button';
import { SectionLabel } from './ui/SectionLabel';

export function AiosTeaser() {
  const t = useTranslations('aiosTeaser');
  const locale = useLocale();
  const apps = t.raw('apps') as string[];

  return (
    <section className="relative border-t border-border py-24 md:py-32">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-border bg-surface-2 px-6 py-12 md:px-12 md:py-16"
        >
          {/* Glow d'accent */}
          <div className="pointer-events-none absolute right-0 top-0 h-[320px] w-[320px] rounded-full bg-accent/10 blur-[120px]" />

          <div className="relative max-w-3xl">
            <SectionLabel>{t('eyebrow')}</SectionLabel>
            <h2 className="mt-6 text-h1 font-semibold text-balance">
              {t('title')}
              <span className="relative inline-block text-accent">
                {t('titleAccent')}
                <span className="absolute -bottom-1 left-0 h-1 w-full bg-accent/30" />
              </span>
              .
            </h2>
            {/* Définition — acronyme + analogie (pour les non-techniques) */}
            <p className="mt-5 max-w-2xl text-lg font-medium text-text">
              {t.rich('definition', {
                g: (c) => <em className="not-italic font-semibold text-accent">{c}</em>,
              })}
            </p>
            <p className="mt-3 max-w-2xl text-base text-text-muted text-balance">
              {t('subtitle')}
            </p>
          </div>

          {/* Schéma d'orchestration animé : canaux → cockpit AI OS → vos apps */}
          <div className="relative mt-10">
            <OrchestrationDiagram
              channelsLabel={t('channelsLabel')}
              channels={t.raw('channels') as string[]}
              hub={t('hub')}
              hubTag={t('hubTag')}
              actsLabel={t('actsLabel')}
              nodes={apps}
            />
          </div>

          <div className="relative mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button href={`/${locale}/ai-os`} variant="primary">
              {t('ctaPrimary')}
            </Button>
            <Button href="#contact" variant="secondary" arrow={false}>
              {t('ctaSecondary')}
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Schéma d'orchestration ───────────────────────────────────
   Vous écrivez via vos canaux (Telegram, Slack…) → le cockpit AI OS
   comprend et orchestre → il agit sur vos apps. Un point lumineux
   circule le long de chaque lien (canal → cockpit → app) pour
   matérialiser le flux. Couleurs en variables CSS → thème clair/sombre. */
function OrchestrationDiagram({
  channelsLabel,
  channels,
  hub,
  hubTag,
  actsLabel,
  nodes,
}: {
  channelsLabel: string;
  channels: string[];
  hub: string;
  hubTag: string;
  actsLabel: string;
  nodes: string[];
}) {
  const W = 720;
  const H = 240;
  const top = 46;
  const bottom = 214;
  const mid = (top + bottom) / 2;
  const nodeH = 34;
  const gap = 12;

  const colL = { x: 20, w: 126 };
  const colR = { x: 556, w: 150 };
  const cockpit = { x: 286, w: 148, h: 62 };
  const cockL = cockpit.x;
  const cockR = cockpit.x + cockpit.w;

  // Centres verticaux d'une colonne de `count` nœuds, centrés dans la bande
  const centers = (count: number) => {
    const total = count * nodeH + (count - 1) * gap;
    const startY = top + (bottom - top - total) / 2;
    return Array.from({ length: count }, (_, i) => startY + i * (nodeH + gap) + nodeH / 2);
  };
  const chY = centers(channels.length);
  const appY = centers(nodes.length);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="mx-auto h-auto w-full max-w-[720px]"
      role="img"
      aria-label={`${channelsLabel} ${channels.join(', ')}. ${hub} ${actsLabel} ${nodes.join(', ')}.`}
    >
      {/* Liens canaux → cockpit */}
      {chY.map((cy, i) => (
        <path
          key={`lL-${i}`}
          id={`aios-lL-${i}`}
          d={`M ${colL.x + colL.w} ${cy} C 214 ${cy}, 214 ${mid}, ${cockL} ${mid}`}
          fill="none"
          style={{ stroke: 'var(--accent)' }}
          strokeOpacity={0.28}
          strokeWidth={1.5}
        />
      ))}
      {/* Liens cockpit → apps */}
      {appY.map((cy, i) => (
        <path
          key={`lR-${i}`}
          id={`aios-lR-${i}`}
          d={`M ${cockR} ${mid} C 500 ${mid}, 500 ${cy}, ${colR.x} ${cy}`}
          fill="none"
          style={{ stroke: 'var(--accent)' }}
          strokeOpacity={0.28}
          strokeWidth={1.5}
        />
      ))}

      {/* Légendes des colonnes */}
      <text
        x={colL.x + colL.w / 2}
        y={26}
        textAnchor="middle"
        fontSize={10}
        style={{ fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
      >
        {channelsLabel}
      </text>
      <text
        x={colR.x + colR.w / 2}
        y={26}
        textAnchor="middle"
        fontSize={10}
        style={{ fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
      >
        {actsLabel}
      </text>

      {/* Nœuds canaux (entrée) */}
      {chY.map((cy, i) => (
        <g key={`ch-${i}`}>
          <rect
            x={colL.x}
            y={cy - nodeH / 2}
            width={colL.w}
            height={nodeH}
            rx={11}
            style={{ fill: 'var(--surface)', stroke: 'var(--border)' }}
            strokeWidth={1}
          />
          <text
            x={colL.x + colL.w / 2}
            y={cy}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={12.5}
            style={{ fill: 'var(--text)', fontFamily: 'var(--font-mono)' }}
          >
            {channels[i]}
          </text>
        </g>
      ))}

      {/* Cockpit AI OS — nœud central (inversé clair/sombre) */}
      <g>
        <rect
          x={cockpit.x}
          y={mid - cockpit.h / 2}
          width={cockpit.w}
          height={cockpit.h}
          rx={14}
          style={{ fill: 'var(--text)' }}
        />
        <circle cx={cockpit.x + 16} cy={mid - cockpit.h / 2 + 16} r={3.5} style={{ fill: 'var(--accent-2)' }} />
        <text
          x={cockpit.x + cockpit.w / 2}
          y={mid - 3}
          textAnchor="middle"
          fontSize={16}
          fontWeight={600}
          style={{ fill: 'var(--bg)' }}
        >
          {hub}
        </text>
        <text
          x={cockpit.x + cockpit.w / 2}
          y={mid + 15}
          textAnchor="middle"
          fontSize={10}
          style={{ fill: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
        >
          {hubTag}
        </text>
      </g>

      {/* Nœuds apps (sortie) */}
      {appY.map((cy, i) => (
        <g key={`ap-${i}`}>
          <rect
            x={colR.x}
            y={cy - nodeH / 2}
            width={colR.w}
            height={nodeH}
            rx={11}
            style={{ fill: 'var(--surface)', stroke: 'var(--border)' }}
            strokeWidth={1}
          />
          <text
            x={colR.x + colR.w / 2}
            y={cy}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={12.5}
            style={{ fill: 'var(--text)', fontFamily: 'var(--font-mono)' }}
          >
            {nodes[i]}
          </text>
        </g>
      ))}

      {/* Pulses : canal → cockpit */}
      {chY.map((_, i) => (
        <g key={`pL-${i}`}>
          <animateMotion dur="2s" begin={`${i * 0.4}s`} repeatCount="indefinite">
            <mpath href={`#aios-lL-${i}`} />
          </animateMotion>
          <circle r={5.5} opacity={0.16} style={{ fill: 'var(--accent)' }} />
          <circle r={2.4} style={{ fill: 'var(--accent)' }} />
        </g>
      ))}
      {/* Pulses : cockpit → app */}
      {appY.map((_, i) => (
        <g key={`pR-${i}`}>
          <animateMotion dur="2s" begin={`${1 + i * 0.4}s`} repeatCount="indefinite">
            <mpath href={`#aios-lR-${i}`} />
          </animateMotion>
          <circle r={5.5} opacity={0.16} style={{ fill: 'var(--accent)' }} />
          <circle r={2.4} style={{ fill: 'var(--accent)' }} />
        </g>
      ))}

      {/* Retour (rouge) : app → cockpit — sens inverse via keyPoints 1→0 */}
      {appY.map((_, i) => (
        <g key={`rR-${i}`}>
          <animateMotion
            dur="2s"
            begin={`${2 + i * 0.4}s`}
            repeatCount="indefinite"
            keyPoints="1;0"
            keyTimes="0;1"
            calcMode="linear"
          >
            <mpath href={`#aios-lR-${i}`} />
          </animateMotion>
          <circle r={5.5} opacity={0.16} style={{ fill: 'var(--accent-2)' }} />
          <circle r={2.4} style={{ fill: 'var(--accent-2)' }} />
        </g>
      ))}
      {/* Retour (rouge) : cockpit → canal */}
      {chY.map((_, i) => (
        <g key={`rL-${i}`}>
          <animateMotion
            dur="2s"
            begin={`${1 + i * 0.4}s`}
            repeatCount="indefinite"
            keyPoints="1;0"
            keyTimes="0;1"
            calcMode="linear"
          >
            <mpath href={`#aios-lL-${i}`} />
          </animateMotion>
          <circle r={5.5} opacity={0.16} style={{ fill: 'var(--accent-2)' }} />
          <circle r={2.4} style={{ fill: 'var(--accent-2)' }} />
        </g>
      ))}
    </svg>
  );
}
