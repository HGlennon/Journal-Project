'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';

interface SettingsModalProps {
  onClose: () => void;
}

type TabKey = 'account' | 'theme';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'account', label: 'Account' },
  { key: 'theme', label: 'Theme' },
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
          {active === 'theme' && <ThemesTab />}
        </main>
      </div>
    </div>
  );
}

type ApiError = { message?: string };

async function safeJson<T>(res: Response): Promise<T | null> {
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function AccountTab() {
  const { data: session, update } = useSession();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState('');
  const accountEmail = session?.user?.email ?? '';

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/me', { cache: 'no-store' });
      if (res.ok) {
        const u = await res.json().catch(() => null) as { name?: string; email?: string } | null;
        if (u) {
          setName(u.name ?? '');
          setEmail(u.email ?? '');
        }
      }
    })();
  }, []);

  const saveProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });

      if (!res.ok) {
        const msg = await safeJson<ApiError>(res);
        throw new Error(msg?.message || 'Failed to save');
      }

      await update({ name, email });
      alert('Profile updated');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error saving';
      alert(message);
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    setChangingPw(true);
    try {
      const res = await fetch('/api/me/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!res.ok) {
        const msg = await safeJson<ApiError>(res);
        throw new Error(msg?.message || 'Failed to change password');
      }

      setCurrentPassword('');
      setNewPassword('');
      alert('Password changed');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error changing password';
      alert(message);
    } finally {
      setChangingPw(false);
    }
  };

  const deleteAccount = async () => {
    if (confirmEmail !== accountEmail) {
      alert('Please type your account email to confirm.');
      return;
    }
    setDeleting(true);
    try {
      const res = await fetch('/api/me/delete', { method: 'DELETE' });

      if (!res.ok) {
        const msg = await safeJson<ApiError>(res);
        throw new Error(msg?.message || 'Failed to delete account');
      }

      await signOut({ callbackUrl: '/' });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error deleting account';
      alert(message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Account</h2>
        <p className="text-sm text-gray-500">Signed in as {session?.user?.email}</p>
      </div>

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
        <div className="max-w-md">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </section>

      {/* Password */}
      <section id="account-password" className="space-y-2 py-6 border-b">
        <h3 className="font-semibold">Password</h3>
        <div className="max-w-md space-y-2">
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Current password"
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={changePassword}
            disabled={changingPw || !currentPassword || !newPassword}
            className="rounded-md border px-3 py-1.5 text-sm bg-white hover:bg-gray-50"
          >
            {changingPw ? 'Changing…' : 'Change password'}
          </button>
        </div>
      </section>

      {/* Delete account */}
      <section id="account-delete" className="space-y-3 py-6">
        <h3 className="font-semibold text-red-700">Delete account</h3>
        <p className="text-sm text-gray-600">
          This will permanently delete your account. Your posts will be removed, and tasks will be retained but detached from your account.
        </p>

        <div className="max-w-md space-y-2">
          <label className="text-sm text-gray-700">
            Type your email <span className="font-mono">{accountEmail}</span> to confirm:
          </label>
          <input
            type="email"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            placeholder={accountEmail || 'you@example.com'}
            className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            type="button"
            onClick={deleteAccount}
            disabled={deleting || confirmEmail !== accountEmail || !accountEmail}
            className={`rounded-md px-3 py-2 text-sm border
              ${confirmEmail === accountEmail && accountEmail && !deleting
                ? 'bg-red-600 text-white hover:bg-red-700 border-red-700'
                : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'}`}
          >
            {deleting ? 'Deleting…' : 'Delete account'}
          </button>
        </div>
      </section>

      {/* Footer actions */}
      <div className="flex items-center justify-end gap-3 border-t pt-4">
        <button type="button" className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50">
          Cancel
        </button>
        <button
          type="button"
          onClick={saveProfile}
          disabled={saving}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </div>
  );
}

import { useTheme } from '@/components/themeProvider';

function ThemesTab() {
  const { theme, setTheme } = useTheme();

  const themes: {key: 'default' | 'dark' | 'pastel'; label: string}[] = [
    { key: 'default', label: 'Default' },
    { key: 'dark', label: 'Dark' },
    { key: 'pastel', label: 'Pastel' },
  ];

  return (
    <div className="max-w-md">
      <h2 className="text-lg font-semibold mb-4">Themes</h2>
      <div className="space-y-2">
        {themes.map((t) => (
          <button
            key={t.key}
            onClick={() => setTheme(t.key)}
            className={`w-full flex justify-between items-center rounded-md border px-3 py-2 text-sm
              ${theme === t.key
                ? 'bg-indigo-100 text-indigo-800 border-indigo-200'
                : 'hover:bg-gray-50 text-gray-700 border-gray-200'}`}
          >
            {t.label}
            {theme === t.key && <span className="text-xs">✓</span>}
          </button>
        ))}
      </div>
    </div>
  );
}


