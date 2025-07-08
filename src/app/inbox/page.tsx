import { db } from '@/db'; 
import { usersTable } from '@/db/schema';

export default function Inbox() {
  return (
    <div>
      <h1 className="text-4xl font-bold mt-10 ml-70 px-4 py-8">
        Inbox
      </h1>
      <div className="container mx-auto px-4 py-8 text-center mt-20">
        <h2 className="text-2xl font-semibold mb-4">
          Add now, schedule later.
        </h2>
        <p>
          From the inbox, you can quickly record tasks, and then schedule them later into specific dates.
        </p>
        <button className="bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition-colors duration-200 mt-4 cursor-pointer">
          Add task
        </button>

<form action={async () => {
  'use server';
  try {
    await db.insert(usersTable).values({
      age: 20,
      email: `test+${Date.now()}@example.com`,
      name: "Test User"
    });
  } catch (err) {
    console.error('DB Insert Error:', err);
  }
}}>
  <button type="submit">Create Post</button>
</form>
      </div>
    </div>
  );
}
