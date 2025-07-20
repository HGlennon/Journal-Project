'use server';

import { db } from '@/db';
import { tasksTable } from '@/db/schema';
import { z } from 'zod';
import { getCurrentUserId } from '@/app/lib/auth';  // <-- import this

const taskSchema = z.object({
  task: z.string().min(1, "Task cannot be empty").max(500),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")
});

export async function addTask(formData: FormData) {
  try {
    const validated = taskSchema.parse({
      task: formData.get('task'),
      dueDate: formData.get('dueDate')
    });

    const userId = await getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');

    const [newTask] = await db.insert(tasksTable)
      .values({ 
        task: validated.task,
        dueDate: validated.dueDate,
        userId: userId,          // <-- add userId here
        createdAt: new Date().toISOString()
      })
      .returning();

    return newTask;
  } catch (error) {
    console.error('Error adding task:', error);
    
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map(issue => issue.message).join(', ');
      throw new Error(errorMessages);
    }
    
    throw new Error(error instanceof Error ? error.message : 'Failed to add task');
  }
}
