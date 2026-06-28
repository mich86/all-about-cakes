import type { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
}

export default function PageContainer({ children }: PageContainerProps) {
  return (
    <main className="mx-auto w-full max-w-7xl p-4 sm:p-8">{children}</main>
  );
}
