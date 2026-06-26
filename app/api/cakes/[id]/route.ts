import {
  deleteCake,
  findCakeByName,
  getCakeById,
  updateCake,
} from '@/lib/cakes/service';
import { validateCakeInput } from '@/lib/cakes/validation';
import { CakeInput } from '@/types/cake';
import { NextResponse } from 'next/server';

interface RouteContext {
  params: Promise<{ id: string }>;
}

function parseId(rawId: string): number | null {
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }
  return id;
}

export async function GET(_request: Request, context: RouteContext) {
  const { id: rawId } = await context.params;
  const id = parseId(rawId);

  if (id === null) {
    return NextResponse.json({ message: 'Invalid cake id' }, { status: 400 });
  }

  try {
    const cake = await getCakeById(id);

    if (!cake) {
      return NextResponse.json({ message: 'Cake not found' }, { status: 404 });
    }

    return NextResponse.json(cake);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : 'Failed to fetch cake',
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, context: RouteContext) {
  const { id: rawId } = await context.params;
  const id = parseId(rawId);

  if (id === null) {
    return NextResponse.json({ message: 'Invalid cake id' }, { status: 400 });
  }

  let body: Partial<CakeInput>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
  }

  const { data, errors } = validateCakeInput(body);

  if (!data) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  try {
    const existing = await findCakeByName(data.name, id);
    if (existing) {
      return NextResponse.json(
        { errors: { name: 'A cake with this name already exists' } },
        { status: 400 },
      );
    }

    const cake = await updateCake(id, data);

    if (!cake) {
      return NextResponse.json({ message: 'Cake not found' }, { status: 404 });
    }

    return NextResponse.json(cake);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : 'Failed to update cake',
      },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id: rawId } = await context.params;
  const id = parseId(rawId);

  if (id === null) {
    return NextResponse.json({ message: 'Invalid cake id' }, { status: 400 });
  }

  try {
    const deleted = await deleteCake(id);

    if (!deleted) {
      return NextResponse.json({ message: 'Cake not found' }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : 'Failed to delete cake',
      },
      { status: 500 },
    );
  }
}
