'use client';

import { useState, useTransition, FormEvent, useRef } from 'react';
import { addTask } from '@/db/actions/addTask';
import { completeTask } from '@/db/actions/completeTask';
import type { InferSelectModel } from 'drizzle-orm';
import { tasksTable } from '@/db/schema';
import { useSession } from 'next-auth/react';

type Task = InferSelectModel<typeof tasksTable>;

interface Props {
  initialTasks: Task[];
}

export function InboxClient({ initialTasks }: Props) {
  const { data: session, status } = useSession();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleAddTask(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!session?.user?.id) {
      setError('Please log in to add tasks');
      return;
    }

    try {
      await startTransition(async () => {
        const form = e.currentTarget;
        const formData = new FormData(form);
        formData.append('userId', session.user.id);

        const newTask = await addTask(formData);
        if (!newTask) throw new Error('Failed to add task');

        setTasks(prev => [newTask, ...prev]);
        form.reset();
        setShowForm(true);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  }

  function handleComplete(taskId: number) {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('taskId', String(taskId));
        await completeTask(formData);
        setTasks(prev => {
          const newTasks = prev.filter(t => t.id !== taskId);
          if (newTasks.length === 0) setShowForm(false);
          return newTasks;
        });
      } catch (error) {
        console.error('Error completing task:', error);
      }
    });
  }

  return (
    <div className="px-4 py-8 transition-all max-w-4xl mx-auto lg:ml-100">
      <h1 className="text-3xl font-bold">
        Inbox
      </h1>

      {tasks.length === 0 && !showForm && (
        <div className="mx-auto max-w-md text-center mt-48">
          <h2 className="text-2xl font-semibold mb-4">
            Add now, schedule later.
          </h2>
          <p>
            From the inbox, you can quickly record tasks, and then schedule them later into specific dates.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-[#BBB3DB]  text-[#303030] font-bold px-5 py-2.5 rounded-lg hover:bg-[#c8bfe7] transition-colors duration-200 mt-4 cursor-pointer"
          >
            Add task
          </button>
        </div>
      )}

      {(tasks.length > 0 || showForm) && (
        <div className="mt-12 space-y-4 max-w-md mx-auto lg:ml-0">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="border p-2 rounded-lg flex items-start gap-3 w-full"
            >
              <button
                onClick={() => handleComplete(task.id)}
                className="w-6 h-6 mt-1.5 flex-shrink-0 border-2 border-gray-500 rounded-full flex items-center justify-center group hover:bg-[#F0ECFF] disabled:opacity-50"
                disabled={isPending}
              >
                <span className="text-[#666576] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  ✓
                </span>
              </button>

              <div className="flex flex-col">
                <div className="text-[16px] leading-tight">{task.task}</div>
                <div className="text-sm text-gray-500">Due: {task.dueDate}</div>
              </div>
            </div>
          ))}

          {!showForm && (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="bg-[#BBB3DB] hover:bg-[#c8bfe7] cursor-pointer text-[#303030] text-sm font-bold px-4 py-2 rounded w-full sm:w-auto"
            >
              Add Task
            </button>
          )}

          {showForm && (
            <form
              ref={formRef}
              onSubmit={handleAddTask}
              className="border border-black p-4 rounded-lg space-y-2 mt-2"
            >
              <input
                name="task"
                type="text"
                required
                placeholder="Task name"
                className="border p-2 w-full text-sm rounded text-black placeholder-gray-500
                 focus:outline-none focus:ring-2 focus:ring-[#BBB3DB] focus:border-[#BBB3DB]"              
              />
              <input
                name="dueDate"
                type="date"
                required
                className="border p-2 w-full text-sm rounded text-black placeholder-gray-500
                 focus:outline-none focus:ring-2 focus:ring-[#BBB3DB] focus:border-[#BBB3DB]"              
              />
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="submit"
                  className="bg-[#BBB3DB] hover:bg-[#c6bee4] cursor-pointer text-[#303030] text-sm font-bold px-4 py-2 rounded w-full sm:w-auto"
                  disabled={isPending}
                >
                  {isPending ? "Adding..." : "Add Task"}
                </button>
                <button
                  type="button"
                  className="bg-[#6F7C8B] hover:bg-[#5d6975] cursor-pointer text-white text-sm font-bold px-4 py-2 rounded w-full sm:w-auto"
                  onClick={() => setShowForm(false)}
                  disabled={isPending}
                >
                  Cancel
                </button>
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </form>
          )}
        </div>
      )}
    </div>
  );
}