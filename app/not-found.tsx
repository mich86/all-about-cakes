import Button from '@/components/atoms/Button';
import PageContainer from '@/components/atoms/PageContainer';
import PageHeader from '@/components/atoms/PageHeader';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found | Favourite Cakes',
};

export default function NotFound() {
  return (
    <PageContainer>
      <PageHeader
        title="Page Not Found"
        action={
          <Button href="/" variant="outline">
            Back to cakes
          </Button>
        }
      />
      <p className="text-slate-600">
        The cake you&apos;re looking for doesn&apos;t exist. It may have been
        removed or the link may be incorrect.
      </p>
    </PageContainer>
  );
}
