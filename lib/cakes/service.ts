import { Cake, CakeInput } from '@/types/cake';
import { createSupabaseClient } from '@/utils/supabase-server';

function mapRow(row: Record<string, unknown>): Cake {
  return {
    id: row.id as number,
    name: row.name as string,
    comment: row.comment as string,
    imageUrl: row.imageUrl as string,
    yumFactor: row.yumFactor as number,
  };
}

export async function getCakes(): Promise<Cake[]> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from('cakes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(mapRow);
}

export async function getCakeById(id: number): Promise<Cake | null> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from('cakes')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapRow(data) : null;
}

export async function findCakeByName(
  name: string,
  excludeId?: number
): Promise<Cake | null> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from('cakes')
    .select('*')
    .ilike('name', name)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  const cake = mapRow(data);
  if (excludeId !== undefined && cake.id === excludeId) {
    return null;
  }

  return cake;
}

export async function createCake(input: CakeInput): Promise<Cake> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from('cakes')
    .insert([input])
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapRow(data);
}

export async function updateCake(
  id: number,
  input: CakeInput
): Promise<Cake | null> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from('cakes')
    .update(input)
    .eq('id', id)
    .select('*')
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapRow(data) : null;
}

export async function deleteCake(id: number): Promise<boolean> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from('cakes')
    .delete()
    .eq('id', id)
    .select('id')
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return Boolean(data);
}
