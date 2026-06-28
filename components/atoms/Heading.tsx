import type { ReactNode } from 'react';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
type HeadingSize = 'xl' | 'lg' | 'md' | 'sm';
type HeadingWeight = 'bold' | 'semibold' | 'medium' | 'normal';

const sizeStyles: Record<HeadingSize, string> = {
  xl: 'text-3xl tracking-tight',
  lg: 'text-2xl tracking-tight',
  md: 'text-xl',
  sm: 'text-lg',
};

const weightStyles: Record<HeadingWeight, string> = {
  bold: 'font-bold',
  semibold: 'font-semibold',
  medium: 'font-medium',
  normal: 'font-normal',
};

const defaultSize: Record<HeadingLevel, HeadingSize> = {
  1: 'xl',
  2: 'lg',
  3: 'md',
  4: 'sm',
  5: 'sm',
  6: 'sm',
};

const defaultWeight: Record<HeadingLevel, HeadingWeight> = {
  1: 'bold',
  2: 'bold',
  3: 'semibold',
  4: 'semibold',
  5: 'medium',
  6: 'medium',
};

interface HeadingProps {
  level: HeadingLevel;
  size?: HeadingSize;
  weight?: HeadingWeight;
  children: ReactNode;
  className?: string;
}

export default function Heading({
  level,
  size,
  weight,
  children,
  className = '',
}: HeadingProps) {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  const resolvedSize = size ?? defaultSize[level];
  const resolvedWeight = weight ?? defaultWeight[level];

  return (
    <Tag
      className={`${sizeStyles[resolvedSize]} ${weightStyles[resolvedWeight]} ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}
