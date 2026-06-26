import Link from 'next/link';
import { mockCakes } from '@/mocks/mockCakes';
import CakeCard from '@/components/molecules/CakeCard';

export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl p-8">
      <header className="mb-10 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Favourite Cakes
        </h1>
        <Link
          href="/add"
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Add Cake
        </Link>
      </header>

      <ul className="grid list-none grid-cols-1 gap-8 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {mockCakes.map((cake) => (
          <li key={cake.id}>
            <CakeCard cake={cake} />
          </li>
        ))}
      </ul>
    </main>
  );
}
