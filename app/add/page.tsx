import AddCakeForm from '@/components/organisms/AddCakeForm';
import Button from '@/components/atoms/Button';
import PageContainer from '@/components/atoms/PageContainer';
import PageHeader from '@/components/atoms/PageHeader';

export default function AddPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Add a New Cake"
        action={
          <Button href="/" variant="outline">
            Back to cakes
          </Button>
        }
      />
      <div className="mx-auto max-w-3xl">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <AddCakeForm />
        </div>
      </div>
    </PageContainer>
  );
}
