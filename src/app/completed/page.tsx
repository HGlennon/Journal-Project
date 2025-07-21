
import { db } from '@/db';
import { tasksTable } from '@/db/schema';
import { and, eq, desc } from 'drizzle-orm';
import { CompletedClient } from './CompletedClient';
import { getCurrentUserId } from '@/app/lib/auth';

export default async function Completed() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return <div>Please log in to view completed tasks.</div>;
  }

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
