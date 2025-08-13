// app/api/auth/register/route.ts (or app/api/register/route.ts)
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { usersTable } from '@/db/schema';
import type { SelectUser } from '@/db/schema';

type RegisterBody = {
  email: string;
  password: string;
  name: string;
};

export async function POST(req: Request) {
  try {
    const { email, password, name } = (await req.json()) as Partial<RegisterBody>;

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const safeName = (name ?? '').trim();
    if (!safeName) {
      return NextResponse.json({ message: 'Name is required' }, { status: 400 });
    }

    const existingUser = (await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .then(r => r[0])) as SelectUser | undefined;

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
  } catch (error: unknown) {
    // Map unique constraint errors to 409 without using `any`
    const message = error instanceof Error ? error.message : '';
    if (/unique|constraint/i.test(message)) {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
