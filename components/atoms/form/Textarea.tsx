import { TextareaHTMLAttributes } from 'react';
import { fieldClassName } from './fieldStyles';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export default function Textarea({
  hasError = false,
  className = '',
  ...props
}: TextareaProps) {
  return (
    <textarea
      aria-invalid={hasError || undefined}
      className={fieldClassName(hasError, className)}
      {...props}
    />
  );
}
