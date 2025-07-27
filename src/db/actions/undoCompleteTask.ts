'use server';

import { db } from '@/db';
import { tasksTable } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function undoCompleteTask(formData: FormData) {
  const taskId = Number(formData.get('taskId'));
  if (!taskId) throw new Error('taskId is required');

  // Update the task to mark it as not completed
  await db
    .update(tasksTable)
    .set({ completed: 0 }) // mark as not completed
    .where(eq(tasksTable.id, taskId));

  return taskId;
}