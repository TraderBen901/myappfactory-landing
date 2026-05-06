'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { ArrowRight } from 'lucide-react';

export default function NotFound() {
  const locale = useLocale();

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="text-center">
        <p className="font-mono text-sm uppercase tracking-widest text-accent">404</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
          Page not found.
        </h1>
        <p className="mt-3 text-text-muted">
          {locale === 'fr'
            ? "Cette page n'existe pas ou a été déplacée."
            : "This page doesn't exist or has been moved."}
        </p>
        <Link
          href={`/${locale}`}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-bg transition hover:bg-accent/90"
        >
          {locale === 'fr' ? "Retour à l'accueil" : 'Back home'}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </main>
  );
}
