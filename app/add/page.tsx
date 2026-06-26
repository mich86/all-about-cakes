import AddCakeForm from '@/components/organisms/AddCakeForm';

export default function AddPage() {
  return (
    <main className="mx-auto max-w-xl p-8">
      <h1 className="mb-8 text-3xl font-bold text-slate-900">Add a New Cake</h1>
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <AddCakeForm />
      </div>
    </main>
  );
}
