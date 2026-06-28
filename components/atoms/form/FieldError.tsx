import { ReactNode } from 'react';

interface FieldErrorProps {
  id: string;
  children?: ReactNode;
}

export default function FieldError({ id, children }: FieldErrorProps) {
  return (
    <p id={id} aria-live="polite" className="mt-1 text-sm text-red-600 empty:hidden">
      {children}
    </p>
  );
}
