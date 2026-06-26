import Image from 'next/image';
import Link from 'next/link';
import { Cake } from '@/types/cake';

interface CakeCardProps {
  cake: Cake;
  priority?: boolean;
}

export default function CakeCard({ cake, priority }: CakeCardProps) {
  return (
    <article className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:shadow-md">
      <Link
        href={`/cakes/${cake.id}`}
        aria-label={`View details for ${cake.name}`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
      >
        <div className="relative aspect-square w-full">
          <Image
            src={cake.imageUrl}
            alt=""
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-4 text-center">
          <h2 className="text-lg font-semibold text-slate-800">{cake.name}</h2>
        </div>
      </Link>
    </article>
  );
}
