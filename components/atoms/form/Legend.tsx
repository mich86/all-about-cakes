import { ReactNode } from 'react';

interface LegendProps {
  children: ReactNode;
  className?: string;
}

export default function Legend({ children, className = '' }: LegendProps) {
  return (
    <legend
      className={`block text-sm font-medium text-slate-700 ${className}`.trim()}
    >
      {children}
    </legend>
  );
}
