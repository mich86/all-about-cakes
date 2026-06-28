'use client';

import Button from '@/components/atoms/Button';
import FieldError from '@/components/atoms/form/FieldError';
import Input from '@/components/atoms/form/Input';
import Label from '@/components/atoms/form/Label';
import Legend from '@/components/atoms/form/Legend';
import Select from '@/components/atoms/form/Select';
import Textarea from '@/components/atoms/form/Textarea';
import { fieldErrorId } from '@/lib/cakes/validation';
import { FieldErrors } from '@/types/cake';
import { useRouter } from 'next/navigation';
import { SubmitEvent, useState } from 'react';

const emptyErrors: FieldErrors = {};

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

  const clearFieldError = (field: keyof FieldErrors) => {
    if (fieldErrors[field]) {
      setFieldErrors((current) => {
        const next = { ...current };
        delete next[field];
        return next;
      });
    }
  };

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
        const body = await response.json().catch(() => null);
        setFormError(body?.message ?? 'Failed to save cake. Please try again.');
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
        <Label htmlFor="cake-name">Cake Name</Label>
        <Input
          id="cake-name"
          name="name"
          type="text"
          autoComplete="off"
          hasError={Boolean(fieldErrors.name)}
          aria-describedby={fieldErrors.name ? fieldErrorId('name') : undefined}
          value={formData.name}
          onChange={(e) => {
            clearFieldError('name');
            setFormData({ ...formData, name: e.target.value });
          }}
        />
        <FieldError id={fieldErrorId('name')}>{fieldErrors.name}</FieldError>
      </div>

      <div>
        <Label htmlFor="cake-comment">Comment</Label>
        <Textarea
          id="cake-comment"
          name="comment"
          rows={3}
          hasError={Boolean(fieldErrors.comment)}
          aria-describedby={
            fieldErrors.comment ? fieldErrorId('comment') : undefined
          }
          value={formData.comment}
          onChange={(e) => {
            clearFieldError('comment');
            setFormData({ ...formData, comment: e.target.value });
          }}
        />
        <FieldError id={fieldErrorId('comment')}>
          {fieldErrors.comment}
        </FieldError>
      </div>

      <div>
        <Label htmlFor="cake-image-url">Image URL</Label>
        <Input
          id="cake-image-url"
          name="imageUrl"
          type="url"
          placeholder="https://..."
          autoComplete="url"
          hasError={Boolean(fieldErrors.imageUrl)}
          aria-describedby={
            fieldErrors.imageUrl ? fieldErrorId('imageUrl') : undefined
          }
          value={formData.imageUrl}
          onChange={(e) => {
            clearFieldError('imageUrl');
            setFormData({ ...formData, imageUrl: e.target.value });
          }}
        />
        <FieldError id={fieldErrorId('imageUrl')}>
          {fieldErrors.imageUrl}
        </FieldError>
      </div>

      <fieldset>
        <Legend>Yum Factor (1-5)</Legend>
        <Select
          id="cake-yum-factor"
          name="yumFactor"
          aria-label="Yum factor rating from 1 to 5"
          hasError={Boolean(fieldErrors.yumFactor)}
          aria-describedby={
            fieldErrors.yumFactor ? fieldErrorId('yumFactor') : undefined
          }
          value={formData.yumFactor}
          onChange={(e) => {
            clearFieldError('yumFactor');
            setFormData({ ...formData, yumFactor: Number(e.target.value) });
          }}
        >
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </Select>
        <FieldError id={fieldErrorId('yumFactor')}>
          {fieldErrors.yumFactor}
        </FieldError>
      </fieldset>

      <div className="flex gap-4">
        <Button
          type="submit"
          variant="primary"
          className=""
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
