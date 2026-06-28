import { getCakes } from '@/lib/cakes/service';
import Button from '@/components/atoms/Button';
import PageContainer from '@/components/atoms/PageContainer';
import PageHeader from '@/components/atoms/PageHeader';
import CakeCard from '@/components/molecules/CakeCard';
import { Cake } from '@/types/cake';

export default async function HomePage() {
  let cakes: Cake[] = [];
  let errorMessage: string | null = null;

  try {
    cakes = await getCakes();
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : 'Unable to load cakes. Please try again.';
  }

  if (errorMessage) {
    return (
      <PageContainer>
        <PageHeader
          title="Favourite Cakes"
          action={<Button href="/add" variant="primary">Add Cake</Button>}
        />
        <p role="alert" className="text-red-700">
          {errorMessage}
        </p>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Favourite Cakes"
        action={<Button href="/add" variant="primary">Add Cake</Button>}
      />

      {cakes.length === 0 ? (
        <p className="py-20 text-center text-xl text-slate-600">
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
    </PageContainer>
  );
}
