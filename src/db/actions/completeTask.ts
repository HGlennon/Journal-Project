'use server';

import { db } from '@/db';
import { tasksTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function completeTask(formData: FormData) {
  const taskId = Number(formData.get('taskId'));
  if (!taskId) throw new Error('taskId is required');

  await db
    .update(tasksTable)
    .set({ completed: 1 })   // mark as completed instead of deleting
    .where(eq(tasksTable.id, taskId));

  // Revalidate paths where the task list is displayed
  revalidatePath('/inbox');       // 🔁 refresh Inbox page
  revalidatePath('/completed');   // 🔁 refresh Completed page

  return taskId;
}
