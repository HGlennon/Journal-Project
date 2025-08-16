import { redirect } from 'next/navigation';
import { getCurrentUserId } from '@/app/lib/getCurrentUserId';

export default async function Home() {
  const userId = await getCurrentUserId();
  if (!userId) redirect('/login'); 
  else redirect('/inbox');
  
}
