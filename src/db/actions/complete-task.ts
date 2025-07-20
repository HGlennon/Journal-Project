'use server';

import { db } from '@/db';
import { tasksTable } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function completeTask(formData: FormData) {
  const taskId = Number(formData.get('taskId'));
  await db.delete(tasksTable).where(eq(tasksTable.id, taskId));
  return taskId;
}
