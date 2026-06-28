import Heading from '@/components/atoms/Heading';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  action: ReactNode;
}

export default function PageHeader({ title, action }: PageHeaderProps) {
  return (
    <header className="mb-10 flex items-center justify-between gap-4">
      <Heading level={1} className="text-slate-900">
        {title}
      </Heading>
      {action}
    </header>
  );
}
