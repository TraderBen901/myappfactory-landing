'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { Button } from './ui/Button';

export function Header() {
  const t = useTranslations('header');
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { href: '#approach', label: t('nav.approach') },
    { href: '#work', label: t('nav.build') },
    { href: '#process', label: t('nav.process') },
    { href: '#contact', label: t('nav.contact') },
  ];

  return (
    <header
      className={clsx(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-border bg-bg/80 backdrop-blur-xl'
          : 'border-b border-transparent'
      )}
    >
      <div className="container-x flex h-16 items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-text-muted transition hover:text-text"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <LanguageToggle />
          <ThemeToggle />
          <div className="hidden md:block">
            <Button href="#contact" size="md" arrow>
              {t('cta')}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
