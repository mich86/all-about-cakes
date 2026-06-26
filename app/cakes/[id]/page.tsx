import { mockCakes } from '@/mocks/mockCakes';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface CakeDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CakeDetailPage({ params }: CakeDetailPageProps) {
  const { id } = await params;
  const cake = mockCakes.find((c) => c.id === Number(id));

  if (!cake) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <Link
        href="/"
        className="mb-8 inline-flex min-h-11 items-center text-sm text-slate-500 hover:text-slate-800"
      >
        ← Back to cakes
      </Link>

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

        <h1 className="mb-4 text-3xl font-bold text-slate-900">{cake.name}</h1>
        <p className="text-slate-600">{cake.comment}</p>

        <p className="mt-4 text-sm text-slate-500">
          Yum factor:{' '}
          <span className="font-semibold text-indigo-600">
            {cake.yumFactor}/5
          </span>
        </p>
      </article>
    </main>
  );
}
