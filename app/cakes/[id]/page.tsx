import { getCakeById } from '@/lib/cakes/service';
import Button from '@/components/atoms/Button';
import PageContainer from '@/components/atoms/PageContainer';
import PageHeader from '@/components/atoms/PageHeader';
import Heading from '@/components/atoms/Heading';
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

      <article className="mx-auto flex max-w-[900px] flex-col gap-8 sm:flex-row md:py-8">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl sm:w-2/5 sm:shrink-0">
          <Image
            src={cake.imageUrl}
            alt={cake.name}
            fill
            sizes="(max-width: 640px) 100vw, 360px"
            className="object-cover"
            priority
          />
        </div>

        <div className="flex flex-col justify-start gap-4 p-8">
          <Heading level={2} className="text-slate-900">
            Tell me more...
          </Heading>
          <p className="text-slate-600">{cake.comment}</p>

          <p className="text-sm text-slate-500">
            Yum factor:{' '}
            <span className="font-semibold text-indigo-600">
              {cake.yumFactor}/5
            </span>
          </p>
        </div>
      </article>
    </PageContainer>
  );
}
