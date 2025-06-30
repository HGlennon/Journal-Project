'use client';

import { useState } from 'react';
import { X, Menu } from 'lucide-react';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  // Width of the sidebar in pixels for calculation
  const sidebarWidth = 280;

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          fixed top-4 left-4 z-[1001] p-2 bg-[var(--color-bg)] text-[var(--color-text)] shadow-md rounded-md transition-transform duration-500
          `}
        style={{
          // Move the button horizontally with the sidebar
          transform: isOpen
            ? `translateX(${sidebarWidth}px)`
            : 'translateX(0)',
          transitionTimingFunction: 'ease-in-out',
        }}
      >
       <X className="w-5 h-5" />
      </button>

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-screen z-[1000] bg-[var(--color-bg)] text-[var(--color-text)]
          shadow-lg transition-transform duration-500 ease-in-out
          w-[80vw] max-w-[280px]
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Sidebar content */}
        <div className="p-4 flex flex-col h-full">
          <h2 className="text-xl font-bold mb-4">Account Name</h2>
          <p>This is your sidebar content.</p>
          <iframe
            src="https://example.com"
            className="w-full flex-grow border-none"
          />
        </div>
      </div>
    </>
  );
}
