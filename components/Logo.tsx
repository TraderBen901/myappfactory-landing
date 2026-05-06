import Link from 'next/link';
import { useLocale } from 'next-intl';

export function Logo({ className = '' }: { className?: string }) {
  const locale = useLocale();
  return (
    <Link
      href={`/${locale}`}
      className={`group flex items-center gap-2.5 font-mono text-sm tracking-tight ${className}`}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        className="text-accent transition group-hover:rotate-90"
      >
        <rect x="2" y="2" width="8" height="8" stroke="currentColor" strokeWidth="1.5" />
        <rect x="12" y="2" width="8" height="8" stroke="currentColor" strokeWidth="1.5" fill="currentColor" />
        <rect x="2" y="12" width="8" height="8" stroke="currentColor" strokeWidth="1.5" fill="currentColor" />
        <rect x="12" y="12" width="8" height="8" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <span className="font-semibold tracking-[-0.01em] text-text">
        MyApp<span className="text-accent">Factory</span>
      </span>
    </Link>
  );
}
