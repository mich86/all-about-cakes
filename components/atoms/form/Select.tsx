import { SelectHTMLAttributes } from 'react';
import { fieldClassName } from './fieldStyles';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
}

export default function Select({
  hasError = false,
  className = '',
  children,
  ...props
}: SelectProps) {
  return (
    <select
      aria-invalid={hasError || undefined}
      className={fieldClassName(hasError, `min-h-11 ${className}`)}
      {...props}
    >
      {children}
    </select>
  );
}
