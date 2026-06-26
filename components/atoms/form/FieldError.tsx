import { ReactNode } from 'react';

interface FieldErrorProps {
  id: string;
  children?: ReactNode;
}

export default function FieldError({ id, children }: FieldErrorProps) {
  if (!children) {
    return null;
  }

  return (
    <p id={id} className="mt-1 text-sm text-red-600">
      {children}
    </p>
  );
}
