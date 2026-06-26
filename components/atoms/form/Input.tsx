import { InputHTMLAttributes } from 'react';
import { fieldClassName } from './fieldStyles';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export default function Input({
  hasError = false,
  className = '',
  ...props
}: InputProps) {
  return (
    <input
      aria-invalid={hasError || undefined}
      className={fieldClassName(hasError, `min-h-11 ${className}`)}
      {...props}
    />
  );
}
