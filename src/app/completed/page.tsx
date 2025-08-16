
import { db } from '@/db';
import { tasksTable } from '@/db/schema';
import { and, eq, desc } from 'drizzle-orm';
import { getCurrentUserId } from '@/app/lib/getCurrentUserId';
import { redirect } from 'next/navigation';
import { CompletedClient } from '@/app/completed/CompletedClient';

export default async function Completed() {
  const userId = await getCurrentUserId();
  if (!userId) redirect('/login'); 


  const completedTasks = await db
    .select()
    .from(tasksTable)
    .where(
      and(
        eq(tasksTable.userId, Number(userId)),
        eq(tasksTable.completed, 1)
      )
    )
    .orderBy(desc(tasksTable.id));

  return <CompletedClient initialCompletedTasks={completedTasks} />;
}
