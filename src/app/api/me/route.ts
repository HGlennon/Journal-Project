import { NextResponse } from 'next/server';
import { db } from '@/db';
import { usersTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUserId } from '@/app/lib/getCurrentUserId';
import type { SelectUser } from '@/db/schema';

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userId))
    .then(r => r[0] as SelectUser | undefined);

  if (!user) return NextResponse.json({ message: 'Not found' }, { status: 404 });

  const { password: safe } = user;
  return NextResponse.json(safe, { status: 200 });
}

export async function PATCH(req: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const body = await req.json() as {
      name?: string;
      email?: string;
      age?: number;
      hasAddedTask?: number;
    };

    const updates: Record<string, unknown> = {};
    if (typeof body.name === 'string') updates.name = body.name.trim();
    if (typeof body.email === 'string') updates.email = body.email.trim();
    if (typeof body.age === 'number') updates.age = body.age;
    if (typeof body.hasAddedTask === 'number') updates.hasAddedTask = body.hasAddedTask;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ message: 'No changes' }, { status: 400 });
    }

    if (updates.email) {
      const existing = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, updates.email as string))
        .then(r => r[0]);
      if (existing && existing.id !== userId) {
        return NextResponse.json({ message: 'Email already in use' }, { status: 409 });
      }
    }

    await db.update(usersTable).set(updates).where(eq(usersTable.id, userId));
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (e) {
    console.error('Update me error:', e);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
