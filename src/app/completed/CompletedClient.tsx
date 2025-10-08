'use client';

import { useState, useTransition } from 'react';
import type { InferSelectModel } from 'drizzle-orm';
import { tasksTable } from '@/db/schema';

type Task = InferSelectModel<typeof tasksTable>;

interface Props {
  initialCompletedTasks: Task[];
}

export function CompletedClient({ initialCompletedTasks }: Props) {
  const [tasks] = useState<Task[]>(initialCompletedTasks);
  const [isPending] = useTransition();

  return (
    <div className="px-4 py-8 transition-all max-w-4xl mx-auto lg:ml-100">
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
              className="border p-2 rounded-lg flex items-start gap-3 w-full"
            >
              <button
                //onClick={() => handleUndoComplete(task.id)} LEAVING THIS OUT FOR NOW
                className="w-6 h-6 mt-1.5 flex-shrink-0 border-2 border-gray-500 rounded-full flex items-center justify-center group bg-[#F0ECFF] disabled:opacity-50"
                disabled={isPending}
              >
                <span className="text-[#666576] opacity-100 transition-opacity duration-200">
                  ✓
                </span>
              </button>

              {/* Task content */}
              <div className="flex flex-col">
                <div className="text-[16px] leading-tight">{task.task}</div>
                <div className="text-sm text-gray-500">Due: {task.dueDate}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
