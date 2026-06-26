import Link from 'next/link';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'outline';
  href?: string;
}

export default function Button({
  children,
  variant = 'primary',
  className = '',
  href,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex min-h-11 items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors';

  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
    outline:
      'border border-slate-300 bg-transparent text-slate-700 hover:bg-slate-50',
  };

  const combined = `${baseStyles} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combined}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combined} {...props}>
      {children}
    </button>
  );
}
