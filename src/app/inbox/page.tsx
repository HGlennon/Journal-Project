import { db } from '@/db';
import { tasksTable } from '@/db/schema';
import { desc, and, eq } from 'drizzle-orm';
import { InboxClient } from './InboxClient';
import { getCurrentUserId } from '@/app/lib/auth';
import { redirect } from 'next/navigation';

export default async function Inbox() {
  const userId = await getCurrentUserId();
  if (!userId) redirect('/login'); 


  const tasks = await db
    .select()
    .from(tasksTable)
    .where(
      and(
        eq(tasksTable.userId, Number(userId)),
        eq(tasksTable.completed, 0)
      )
    )
    .orderBy(desc(tasksTable.id));

  return <InboxClient initialTasks={tasks} />;
}
