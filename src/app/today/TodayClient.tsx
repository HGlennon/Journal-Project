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

export function TodayClient({ initialTasks }: Props) {
  const { data: session } = useSession();
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

        const today = new Date().toLocaleDateString('en-CA'); // 'YYYY-MM-DD'

        // ✅ Only show task if dueDate matches today
        if (newTask.dueDate === today) {
          setTasks(prev => [newTask, ...prev]);
        }

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
    <div className="px-4 py-8">
      <h1 className="text-3xl font-bold ml-10">
        Today
      </h1>

      {tasks.length === 0 && !showForm && (
        <div className="mx-auto max-w-md text-center mt-45 ml-74">
          <h2 className="text-2xl font-semibold mb-4">
            No tasks for today yet
          </h2>
          <p>You can schedule tasks for today below.</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition-colors duration-200 mt-4 cursor-pointer"
          >
            Add task
          </button>
        </div>
      )}

      {(tasks.length > 0 || showForm) && (
        <div className="mt-10 space-y-4 max-w-md mx-auto ml-10">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="border p-2 rounded flex items-center justify-between"
            >
              <button
                onClick={() => handleComplete(task.id)}
                className="w-8 h-8 border-2 border-green-500 rounded-full flex items-center justify-center group hover:bg-green-100 disabled:opacity-50"
                disabled={isPending}
              >
                <span className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  ✓
                </span>
              </button>

              <div className="ml-4 flex-1">
                <div className="font-medium">{task.task}</div>
                <div className="text-sm text-gray-500">Due: {task.dueDate}</div>
              </div>
            </div>
          ))}

          <form 
            ref={formRef}
            onSubmit={handleAddTask} 
            className="space-y-2 mt-6"
          >
            <input
              name="task"
              type="text"
              required
              placeholder="Task name"
              className="border p-2 w-full"
            />
            <input
              name="dueDate"
              type="date"
              required
              className="border p-2 w-full cursor-text"
              defaultValue={new Date().toISOString().split('T')[0]} // today's date
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
                disabled={isPending}
              >
                {isPending ? 'Adding...' : 'Add Task'}
              </button>
              <button
                type="button"
                className="bg-gray-500 text-white px-4 py-2 rounded cursor-pointer"
                disabled={isPending}
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
