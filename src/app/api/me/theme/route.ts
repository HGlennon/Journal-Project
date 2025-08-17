import { NextResponse } from 'next/server';
import { db } from '@/db';
import { usersTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUserId } from '@/app/lib/getCurrentUserId';

type Theme = 'default' | 'dark' | 'pastel';
const ALLOWED: Theme[] = ['default', 'dark', 'pastel'];

export async function GET() {
  const uid = await getCurrentUserId();
  if (!uid) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const user = await db.select({ theme: usersTable.theme })
    .from(usersTable)
    .where(eq(usersTable.id, uid))
    .then(r => r[0]);

  if (!user) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json({ theme: user.theme });
}

export async function PATCH(req: Request) {
  const uid = await getCurrentUserId();
  if (!uid) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { theme } = await req.json();
  if (!ALLOWED.includes(theme)) {
    return NextResponse.json({ message: `Invalid theme` }, { status: 400 });
  }

  await db.update(usersTable).set({ theme }).where(eq(usersTable.id, uid));
  return NextResponse.json({ success: true });
}
