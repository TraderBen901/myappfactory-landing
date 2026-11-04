'use client';

import { useTranslations } from 'next-intl';
import { Linkedin } from 'lucide-react';
import { Logo } from './Logo';

// Page LinkedIn de la société, créée le 04/11/2026
const LINKEDIN_URL = 'https://www.linkedin.com/company/myappfactory/';

export function Footer() {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-x py-12 md:py-16">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="space-y-4">
            <Logo />
            <p className="max-w-sm text-sm text-text-muted">{t('tagline')}</p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <a href="#" className="text-text-muted transition hover:text-text">
              {t('links.legal')}
            </a>
            <a href="#" className="text-text-muted transition hover:text-text">
              {t('links.privacy')}
            </a>
            <a href="#contact" className="text-text-muted transition hover:text-text">
              {t('links.contact')}
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('links.linkedinAria')}
              className="inline-flex items-center gap-1.5 text-text-muted transition hover:text-accent"
            >
              <Linkedin className="h-4 w-4 shrink-0" aria-hidden />
              {t('links.linkedin')}
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-text-muted md:flex-row md:items-center">
          <p className="font-mono">
            © {year} MyAppFactory · {t('rights')}
          </p>
          <p className="font-mono uppercase tracking-widest">v0.1 · launch edition</p>
        </div>
      </div>
    </footer>
  );
}
