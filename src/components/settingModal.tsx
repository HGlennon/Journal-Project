'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';

interface SettingsModalProps {
  onClose: () => void;
}

type TabKey = 'account';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'account', label: 'Account' },
];

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const [active, setActive] = useState<TabKey>('account');
  const [query, setQuery] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const searchIndex = useMemo(
    () => [
      { id: 'account-profile-picture', label: 'Photo', tab: 'account' as TabKey },
      { id: 'account-name', label: 'Name', tab: 'account' as TabKey },
      { id: 'account-email', label: 'Email', tab: 'account' as TabKey },
      { id: 'account-password', label: 'Password', tab: 'account' as TabKey },
      { id: 'account-delete', label: 'Delete account', tab: 'account' as TabKey },
    ],
    []
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [] as typeof searchIndex;
    return searchIndex.filter((item) => item.label.toLowerCase().includes(q));
  }, [query, searchIndex]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const stop = (e: React.MouseEvent) => e.stopPropagation();

  const jumpTo = (id: string, tab: TabKey) => {
    setActive(tab);
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el && contentRef.current) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40"
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={dialogRef}
        onClick={stop}
        className="bg-white rounded-lg shadow-xl w-full max-w-5xl outline-none overflow-hidden flex"
      >
        {/* Sidebar */}
        <aside className="w-64 border-r bg-gray-50 flex flex-col">
          <div className="px-4 pt-4 pb-2 text-sm font-semibold text-gray-800">Settings</div>
          <div className="px-4 pb-4 border-b">
            <label htmlFor="settings-search" className="sr-only">Search settings</label>
            <div className="relative">
              <input
                id="settings-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-gray-400"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-auto p-2 space-y-1">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActive(tab.key)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2
                  ${active === tab.key
                    ? 'bg-orange-100 text-orange-800 border border-orange-200'
                    : 'text-gray-700 hover:bg-white/70'}`}
              >
                <span className="inline-block h-2 w-2 rounded-full bg-orange-500" />
                {tab.label}
              </button>
            ))}

            {query && (
              <div className="mt-4 border-t pt-2">
                {results.length === 0 ? (
                  <p className="text-xs text-gray-500 px-2 py-1">No matches</p>
                ) : (
                  <ul className="space-y-1">
                    {results.map((r) => (
                      <li key={r.id}>
                        <button
                          onClick={() => jumpTo(r.id, r.tab)}
                          className="w-full text-left text-sm px-2 py-1 rounded hover:bg-white"
                        >
                          {r.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </nav>
        </aside>

        {/* Content */}
        <main ref={contentRef} className="flex-1 overflow-auto p-6">
          {active === 'account' && <AccountTab />}
        </main>
      </div>
    </div>
  );
}

function AccountTab() {
  const [name, setName] = useState('');
  const [email] = useState('');

  return (
    <div className="max-w-2xl">
      {/* Top content header like Todoist */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Account</h2>
      </div>

      {/* Photo */}
      <section id="account-profile-picture" className="space-y-2 pb-6 border-b">
        <h3 className="font-semibold">Photo</h3>
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-purple-500 text-white flex items-center justify-center font-medium">
            H
          </div>
          <div className="space-x-2">
            <button type="button" className="rounded-md border px-3 py-1.5 text-sm bg-white hover:bg-gray-50">Change photo</button>
            <button type="button" className="rounded-md border border-red-200 px-3 py-1.5 text-sm text-red-600 bg-red-50 hover:bg-red-100">Remove photo</button>
          </div>
        </div>
        <p className="text-sm text-gray-500">Pick a photo up to 4MB.</p>
      </section>

      {/* Name */}
      <section id="account-name" className="space-y-2 py-6 border-b">
        <h3 className="font-semibold">Name</h3>
        <div className="max-w-md">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="mt-1 text-xs text-gray-400 text-right">{name.length}/255</div>
        </div>
      </section>

      {/* Email */}
      <section id="account-email" className="space-y-2 py-6 border-b">
        <h3 className="font-semibold">Email</h3>
        <div className="flex items-center gap-3 flex-wrap">
          <p className="text-sm text-gray-700">{email || 'you@example.com'}</p>
          <button type="button" className="rounded-md border px-3 py-1.5 text-sm bg-white hover:bg-gray-50">Change email</button>
        </div>
      </section>

      {/* Password */}
      <section id="account-password" className="space-y-2 py-6 border-b">
        <h3 className="font-semibold">Password</h3>
        <button type="button" className="rounded-md border px-3 py-1.5 text-sm bg-white hover:bg-gray-50">Change password</button>
      </section>
      {/* Footer actions (dummy) */}
      <div className="flex items-center justify-end gap-3 border-t pt-4">
        <button type="button" className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50">Cancel</button>
        <button type="button" className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700">Save changes</button>
      </div>
    </div>
  );
}
