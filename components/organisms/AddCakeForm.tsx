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
          const fieldIdMap: Record<string, string> = {
            name: 'cake-name',
            comment: 'cake-comment',
            imageUrl: 'cake-image-url',
            yumFactor: 'cake-yum-factor',
          };
          const firstErrorKey = Object.keys(body.errors)[0];
          setTimeout(() => {
            document.getElementById(fieldIdMap[firstErrorKey] ?? '')?.focus();
          }, 0);
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
    <form onSubmit={handleSubmit} className="space-y-6" noValidate aria-busy={isSubmitting}>
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
          aria-required="true"
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
          maxLength={200}
          aria-required="true"
          hasError={Boolean(fieldErrors.comment)}
          aria-describedby={[
            'cake-comment-counter',
            fieldErrors.comment ? fieldErrorId('comment') : '',
          ]
            .filter(Boolean)
            .join(' ')}
          value={formData.comment}
          onChange={(e) => {
            clearFieldError('comment');
            setFormData({ ...formData, comment: e.target.value });
          }}
        />
        <div className="mt-1 flex items-start justify-between gap-2">
          <FieldError id={fieldErrorId('comment')}>
            {fieldErrors.comment}
          </FieldError>
          <p
            id="cake-comment-counter"
            aria-live="polite"
            aria-label="Characters remaining"
            className={`ml-auto shrink-0 text-xs ${
              formData.comment.length > 200
                ? 'text-red-700'
                : formData.comment.length >= 180
                  ? 'text-amber-700'
                  : 'text-slate-600'
            }`}
          >
            {200 - formData.comment.length} of 200 characters remaining
          </p>
        </div>
      </div>

      <div>
        <Label htmlFor="cake-image-url">Image URL</Label>
        <Input
          id="cake-image-url"
          name="imageUrl"
          type="url"
          placeholder="https://..."
          autoComplete="url"
          aria-required="true"
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
          aria-required="true"
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
          {[
            { value: 1, label: '1 – Not great' },
            { value: 2, label: '2 – Decent' },
            { value: 3, label: '3 – Good' },
            { value: 4, label: '4 – Very good' },
            { value: 5, label: '5 – Outstanding' },
          ].map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
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
