// components/Sidebar.tsx
'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={`
        fixed top-0 left-0 h-screen z-[999] bg-[var(--color-bg)] text-[var(--color-text)]
        shadow-lg transition-transform duration-700 ease-in-out
        w-[80vw] max-w-[280px] min-w-[250px]
        ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div className="text-left p-2 bg-[var(--color-bg)]">
        <button onClick={() => setIsOpen(false)}>
          <X className="w-5 h-5 cursor-pointer" />
        </button>
      </div>
      <iframe
        src="https://example.com"
        className="w-full h-[calc(100%-40px)] border-none"
      />
    </div>
  );
}
