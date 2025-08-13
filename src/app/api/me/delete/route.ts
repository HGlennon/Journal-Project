import { NextResponse } from 'next/server';
import { db } from '@/db';
import { usersTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUserId } from '@/app/lib/getCurrentUserId';

export async function DELETE() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    // This will cascade per your schema:
    // - posts.userId: onDelete: 'cascade' -> rows removed
    // - tasks.userId: onDelete: 'set null' -> tasks stay but userId becomes null
    await db.delete(usersTable).where(eq(usersTable.id, userId));

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (e) {
    console.error('Delete account error:', e);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
