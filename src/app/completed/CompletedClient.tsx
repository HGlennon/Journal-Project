'use client';

import { useState, useTransition } from 'react';
import type { InferSelectModel } from 'drizzle-orm';
import { tasksTable } from '@/db/schema';
import { undoCompleteTask } from '@/db/actions/undoCompleteTask';

type Task = InferSelectModel<typeof tasksTable>;

interface Props {
  initialCompletedTasks: Task[];
}

export function CompletedClient({ initialCompletedTasks }: Props) {
  const [tasks] = useState<Task[]>(initialCompletedTasks);
  const [isPending] = useTransition();

  //function handleUndoComplete(taskId: number) {
    //startTransition(async () => {
      //try {
        //const formData = new FormData();
        //formData.append('taskId', String(taskId));
        //await undoCompleteTask(formData);
        //setTasks(prev => prev.filter(t => t.id !== taskId));
      //} catch (error) {
        //console.error('Failed to undo complete:', error);
      //}
    //});
  //}

  return (
    <div className="px-4 py-8 transition-all max-w-4xl mx-auto lg:ml-64">
      <h1 className="text-3xl font-bold">
        Completed
      </h1>
      {tasks.length === 0 ? (
        <div className="mx-auto max-w-md text-center mt-48">
          <h2 className="text-2xl font-semibold mb-4">
            Its quiet here...
          </h2>
          <p className="text-gray-500">Complete some tasks to start populating this page!.</p>
        </div>
      ) : (
        <div className="mt-12 space-y-4 max-w-md mx-auto lg:ml-0">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="border p-3 rounded flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 w-full"
            >
              <button
                //onClick={() => handleUndoComplete(task.id)} LEAVING THIS OUT FOR NOW
                className="w-8 h-8 border-2 border-green-500 rounded-full flex items-center justify-center group"
                disabled={isPending}
              >
                <span className="text-green-500 opacity-100 transition-opacity duration-200">
                  ✓
                </span>
              </button>

              {/* Task content */}
              <div className="flex-1">
                <div className="font-medium text-gray-500">
                  {task.task}
                </div>
                <div className="text-sm text-gray-400">Due: {task.dueDate}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
