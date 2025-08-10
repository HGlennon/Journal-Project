'use client';
import React from 'react';

export default function SettingsModal({ onClose }: { onClose: () => void }) {
  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40"
    >
      <div
        onClick={stop}
        className="bg-white rounded-lg p-6 shadow-lg w-full max-w-lg"
      >
        <h2 className="text-lg font-semibold mb-4">Settings</h2>
        <p className="text-gray-600 mb-6">Your settings content here.</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
