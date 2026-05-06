/**
 * Placeholder réutilisable pour les animations isométriques que tu vas créer.
 * Remplacer le contenu intérieur par une <video autoPlay loop muted playsInline /> ou <img />.
 */
export function AnimationSlot({
  id,
  ratio = 'aspect-video',
  label,
  hint,
  className = '',
}: {
  id: string;
  ratio?: string;
  label: string;
  hint?: string;
  className?: string;
}) {
  return (
    <div
      id={id}
      className={`relative ${ratio} w-full overflow-hidden rounded-2xl border border-border bg-surface ${className}`}
    >
      <Corner pos="top-3 left-3" />
      <Corner pos="top-3 right-3" rotate="rotate-90" />
      <Corner pos="bottom-3 right-3" rotate="rotate-180" />
      <Corner pos="bottom-3 left-3" rotate="-rotate-90" />

      <div className="absolute inset-0 grid-bg opacity-60" />

      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-accent/40 bg-accent/10">
          <svg className="h-7 w-7 text-accent" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor">
            <path d="M12 2 L22 7 L22 17 L12 22 L2 17 L2 7 Z" />
            <path d="M12 2 L12 22" />
            <path d="M2 7 L12 12 L22 7" />
            <path d="M2 17 L12 12 L22 17" />
          </svg>
        </div>
        <p className="font-mono text-xs uppercase tracking-widest text-text-muted">{label}</p>
        {hint && <p className="mt-2 max-w-[28ch] text-xs text-text-muted/70">{hint}</p>}
      </div>
    </div>
  );
}

function Corner({ pos, rotate = '' }: { pos: string; rotate?: string }) {
  return (
    <div className={`absolute ${pos} h-3 w-3 ${rotate}`}>
      <span className="absolute inset-0 border-l border-t border-accent/60" />
    </div>
  );
}
