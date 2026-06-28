import { getCakeById } from '@/lib/cakes/service';
import Button from '@/components/atoms/Button';
import PageContainer from '@/components/atoms/PageContainer';
import PageHeader from '@/components/atoms/PageHeader';
import Image from 'next/image';
import { notFound } from 'next/navigation';

interface CakeDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CakeDetailPage({ params }: CakeDetailPageProps) {
  const { id } = await params;

  const cake = await getCakeById(Number(id));

  if (!cake) {
    notFound();
  }

  return (
    <PageContainer>
      <PageHeader
        title={cake.name}
        action={
          <Button href="/" variant="outline">
            Back to cakes
          </Button>
        }
      />

      <article>
        <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-xl">
          <Image
            src={cake.imageUrl}
            alt={cake.name}
            fill
            sizes="(max-width: 672px) 100vw, 672px"
            className="object-cover"
            priority
          />
        </div>

        <p className="text-slate-600">{cake.comment}</p>

        <p className="mt-4 text-sm text-slate-500">
          Yum factor:{' '}
          <span className="font-semibold text-indigo-600">
            {cake.yumFactor}/5
          </span>
        </p>
      </article>
    </PageContainer>
  );
}
