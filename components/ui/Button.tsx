import Link from 'next/link';
import clsx from 'clsx';
import { ArrowUpRight } from 'lucide-react';

type ButtonProps = {
  href?: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'md' | 'lg';
  arrow?: boolean;
  external?: boolean;
  className?: string;
};

export function Button({
  href,
  children,
  variant = 'primary',
  size = 'md',
  arrow = true,
  external = false,
  className,
}: ButtonProps) {
  const base =
    'group inline-flex items-center gap-2 rounded-full font-medium transition-all whitespace-nowrap';

  const variants = {
    primary:
      'bg-accent text-bg hover:bg-accent/90 hover:shadow-[0_0_30px_-5px_var(--accent)]',
    secondary:
      'border border-border bg-surface text-text hover:border-accent hover:text-accent',
    ghost: 'text-text-muted hover:text-accent',
  };

  const sizes = {
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  };

  const content = (
    <>
      <span>{children}</span>
      {arrow && (
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      )}
    </>
  );

  const classes = clsx(base, variants[variant], sizes[size], className);

  if (href) {
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return <button className={classes}>{content}</button>;
}
