'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import clsx from 'clsx';

export function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchLocale = (next: 'fr' | 'en') => {
    if (next === locale) return;
    const segments = pathname.split('/');
    segments[1] = next;
    const newPath = segments.join('/') || `/${next}`;
    startTransition(() => {
      router.replace(newPath);
    });
  };

  return (
    <div
      className={clsx(
        'flex items-center rounded-full border border-border p-0.5 text-xs font-mono uppercase tracking-widest',
        isPending && 'opacity-60'
      )}
    >
      {(['fr', 'en'] as const).map((l) => (
        <button
          key={l}
          onClick={() => switchLocale(l)}
          aria-pressed={locale === l}
          className={clsx(
            'rounded-full px-2.5 py-1 transition',
            locale === l
              ? 'bg-text text-bg'
              : 'text-text-muted hover:text-text'
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
