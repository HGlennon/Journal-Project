import { getServerSession } from 'next-auth';
import { authOptions } from './authOptions';

export async function getCurrentUserId(): Promise<number | null> {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  return userId ? Number(userId) : null;
}
