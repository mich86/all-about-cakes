import { getApiUrl } from '@/lib/api-url';
import Button from '@/components/atoms/Button';
import CakeCard from '@/components/molecules/CakeCard';
import { Cake } from '@/types/cake';

export default async function HomePage() {
  let cakes: Cake[] = [];
  let errorMessage: string | null = null;

  try {
    const response = await fetch(await getApiUrl('/api/cakes'), {
      cache: 'no-store',
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      errorMessage =
        body?.message ?? `Failed to load cakes (${response.status})`;
    } else {
      cakes = await response.json();
    }
  } catch {
    errorMessage = 'Unable to reach the cakes API. Please try again.';
  }

  if (errorMessage) {
    return (
      <main className="mx-auto max-w-7xl p-8">
        <p role="alert" className="text-red-500">
          {errorMessage}
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl p-8">
      <header className="mb-10 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Favourite Cakes
        </h1>
        <Button href="/add" variant="primary">
          Add Cake
        </Button>
      </header>

      {cakes.length === 0 ? (
        <p className="py-20 text-center text-xl text-slate-500">
          No cakes found. Start by adding one!
        </p>
      ) : (
        <ul className="grid list-none grid-cols-1 gap-8 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {cakes.map((cake, index) => (
            <li key={cake.id}>
              <CakeCard cake={cake} priority={index === 0} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
