import {
  createCake,
  findCakeByName,
  getCakes,
} from '@/lib/cakes/service';
import { validateCakeInput } from '@/lib/cakes/validation';
import { CakeInput } from '@/types/cake';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cakes = await getCakes();
    return NextResponse.json(cakes);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : 'Failed to fetch cakes',
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  let body: Partial<CakeInput>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: 'Invalid JSON body' },
      { status: 400 },
    );
  }

  const { data, errors } = validateCakeInput(body);

  if (!data) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  try {
    const existing = await findCakeByName(data.name);
    if (existing) {
      return NextResponse.json(
        { errors: { name: 'A cake with this name already exists' } },
        { status: 400 },
      );
    }

    const cake = await createCake(data);
    return NextResponse.json(cake, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : 'Failed to create cake',
      },
      { status: 500 },
    );
  }
}
