// Keep this route on Node.js so bcrypt works (esp. on Vercel)
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { usersTable } from '@/db/schema';

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    // Ensure name (your schema requires it)
    const safeName = (name ?? '').trim();
    if (!safeName) {
      return NextResponse.json({ message: 'Name is required' }, { status: 400 });
    }

    // Uniqueness check
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .then(r => r[0]);

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await db.insert(usersTable).values({
      email,
      password: passwordHash,
      name: safeName,
      age: 18,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    // Optional: map unique constraint error to 409
    const msg = String(error?.message || error);
    if (msg.toLowerCase().includes('unique') || msg.toLowerCase().includes('constraint')) {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
