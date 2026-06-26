import { CakeField, CakeInput, FieldErrors } from '@/types/cake';
import { z } from 'zod';

export const cakeInputSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  comment: z
    .string()
    .trim()
    .min(1, 'Comment is required')
    .min(5, 'Comment must be at least 5 characters')
    .max(200, 'Comment must be no more than 200 characters'),
  imageUrl: z
    .string()
    .trim()
    .min(1, 'Image URL is required')
    .url('Please enter a valid URL'),
  yumFactor: z.coerce
    .number()
    .int('Yum factor must be between 1 and 5')
    .min(1, 'Yum factor must be between 1 and 5')
    .max(5, 'Yum factor must be between 1 and 5'),
});

function zodErrorToFieldErrors(error: z.ZodError): FieldErrors {
  const errors: FieldErrors = {};

  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field === 'string' && !(field in errors)) {
      errors[field as CakeField] = issue.message;
    }
  }

  return errors;
}

export function validateCakeInput(input: unknown): {
  data: CakeInput | null;
  errors: FieldErrors;
} {
  const result = cakeInputSchema.safeParse(input);

  if (!result.success) {
    return { data: null, errors: zodErrorToFieldErrors(result.error) };
  }

  return { data: result.data, errors: {} };
}

export function fieldErrorId(field: CakeField): string {
  return `${field}-error`;
}
