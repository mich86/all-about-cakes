export interface Cake {
  id: number;
  name: string;
  comment: string;
  imageUrl: string;
  yumFactor: number; // 1–5 rating
}

export type CakeInput = Omit<Cake, 'id'>;

export type CakeField = keyof CakeInput;

export type FieldErrors = Partial<Record<CakeField, string>>;
