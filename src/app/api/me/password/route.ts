import { NextResponse } from 'next/server';
import { db } from '@/db';
import { usersTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { getCurrentUserId } from '@/app/lib/getCurrentUserId';

export async function POST(req: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { currentPassword, newPassword } = await req.json();
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ message: 'Both current and new passwords are required' }, { status: 400 });
    }

    const user = await db.select().from(usersTable).where(eq(usersTable.id, userId)).then(r => r[0]);
    if (!user) return NextResponse.json({ message: 'Not found' }, { status: 404 });

    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) return NextResponse.json({ message: 'Current password is incorrect' }, { status: 401 });

    const newHash = await bcrypt.hash(newPassword, 10);
    await db.update(usersTable).set({ password: newHash }).where(eq(usersTable.id, userId));

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (e) {
    console.error('Change password error:', e);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
