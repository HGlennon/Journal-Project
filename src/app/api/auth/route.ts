import { db } from '@/db';
import { usersTable } from '@/db/schema';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .then(res => res[0]);

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

  await db.insert(usersTable).values({ email, password: passwordHash, name: 'default', age: 18 });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
