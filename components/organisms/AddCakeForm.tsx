'use client';

import Button from '@/components/atoms/Button';
import { fieldErrorId } from '@/lib/cakes/validation';
import { FieldErrors } from '@/types/cake';
import { useRouter } from 'next/navigation';
import { SubmitEvent, useState } from 'react';

const emptyErrors: FieldErrors = {};

function fieldClassName(hasError: boolean) {
  return `mt-1 block w-full rounded-md border p-2 ${
    hasError ? 'border-red-500' : 'border-slate-300'
  }`;
}

export default function AddCakeForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    comment: '',
    imageUrl: '',
    yumFactor: 3,
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>(emptyErrors);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors(emptyErrors);
    setFormError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/cakes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.status === 400) {
        const body = await response.json();
        if (body.errors) {
          setFieldErrors(body.errors);
          return;
        }
        setFormError(body.message ?? 'Please check the form and try again.');
        return;
      }

      if (!response.ok) {
        setFormError('Failed to save cake. Please try again.');
        return;
      }

      router.push('/');
      router.refresh();
    } catch {
      setFormError('Unable to reach the server. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {formError && (
        <p
          role="alert"
          className="rounded-md bg-red-50 p-3 text-sm text-red-700"
        >
          {formError}
        </p>
      )}

      <div>
        <label
          htmlFor="cake-name"
          className="block text-sm font-medium text-slate-700"
        >
          Cake Name
        </label>
        <input
          id="cake-name"
          type="text"
          aria-invalid={Boolean(fieldErrors.name)}
          aria-describedby={fieldErrors.name ? fieldErrorId('name') : undefined}
          className={`${fieldClassName(Boolean(fieldErrors.name))} min-h-11`}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        {fieldErrors.name && (
          <p id={fieldErrorId('name')} className="mt-1 text-sm text-red-600">
            {fieldErrors.name}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="cake-comment"
          className="block text-sm font-medium text-slate-700"
        >
          Comment
        </label>
        <textarea
          id="cake-comment"
          rows={3}
          aria-invalid={Boolean(fieldErrors.comment)}
          aria-describedby={
            fieldErrors.comment ? fieldErrorId('comment') : undefined
          }
          className={fieldClassName(Boolean(fieldErrors.comment))}
          value={formData.comment}
          onChange={(e) =>
            setFormData({ ...formData, comment: e.target.value })
          }
        />
        {fieldErrors.comment && (
          <p id={fieldErrorId('comment')} className="mt-1 text-sm text-red-600">
            {fieldErrors.comment}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="cake-image-url"
          className="block text-sm font-medium text-slate-700"
        >
          Image URL
        </label>
        <input
          id="cake-image-url"
          type="url"
          placeholder="https://..."
          aria-invalid={Boolean(fieldErrors.imageUrl)}
          aria-describedby={
            fieldErrors.imageUrl ? fieldErrorId('imageUrl') : undefined
          }
          className={`${fieldClassName(Boolean(fieldErrors.imageUrl))} min-h-11`}
          value={formData.imageUrl}
          onChange={(e) =>
            setFormData({ ...formData, imageUrl: e.target.value })
          }
        />
        {fieldErrors.imageUrl && (
          <p
            id={fieldErrorId('imageUrl')}
            className="mt-1 text-sm text-red-600"
          >
            {fieldErrors.imageUrl}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="cake-yum-factor"
          className="block text-sm font-medium text-slate-700"
        >
          Yum Factor (1-5)
        </label>
        <select
          id="cake-yum-factor"
          aria-invalid={Boolean(fieldErrors.yumFactor)}
          aria-describedby={
            fieldErrors.yumFactor ? fieldErrorId('yumFactor') : undefined
          }
          className={`${fieldClassName(Boolean(fieldErrors.yumFactor))} min-h-11`}
          value={formData.yumFactor}
          onChange={(e) =>
            setFormData({ ...formData, yumFactor: Number(e.target.value) })
          }
        >
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
        {fieldErrors.yumFactor && (
          <p
            id={fieldErrorId('yumFactor')}
            className="mt-1 text-sm text-red-600"
          >
            {fieldErrors.yumFactor}
          </p>
        )}
      </div>

      <div className="flex gap-4">
        <Button
          type="submit"
          variant="primary"
          className="flex-1"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving…' : 'Save Cake'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
