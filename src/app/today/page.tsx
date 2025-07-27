import { db } from '@/db';
import { tasksTable } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { TodayClient } from './TodayClient';
import { getCurrentUserId } from '@/app/lib/auth';

export const dynamic = 'force-dynamic';

export default async function TodayPage() {
  const userId = await getCurrentUserId();
  if (!userId) return <div>Please log in to view today’s tasks.</div>;

  const today = new Date().toLocaleDateString('en-CA'); // 'YYYY-MM-DD'

  const tasksDueToday = await db
    .select()
    .from(tasksTable)
    .where(
      and(
        eq(tasksTable.userId, userId),
        eq(tasksTable.completed, 0),
        eq(tasksTable.dueDate, today)
      )
    );

  return <TodayClient initialTasks={tasksDueToday} />;
}
