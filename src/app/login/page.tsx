'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';

export default function AuthModal() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { update } = useSession();
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => firstFieldRef.current?.focus(), 0);
    return () => clearTimeout(t);
  }, [isLogin]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await signIn('credentials', { email, password, redirect: false });
    if (res?.ok) {
      await update();
      router.push('/inbox');
    } else {
      setError('Invalid email or password.');
    }
    setSubmitting(false);
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      if (res.ok) {
        const signInRes = await signIn('credentials', { redirect: false, email, password });
        if (signInRes?.ok) {
          await update();
          router.push('/inbox');
        } else {
          setError('Sign-in failed after registration.');
        }
      } else {
        const data = await res.json().catch(() => null);
        setError(data?.message || `Registration failed (${res.status}).`);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const submitDisabled =
    submitting || !email || !password || (!isLogin && !name);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md bg-[#fff] rounded-lg shadow-lg p-6 space-y-4 border border-[#BBB3DB]">
        {/* Header */}
        <h2 className="text-2xl font-bold text-center text-[#303030]">
          {isLogin ? 'Welcome back!' : 'Create your account'}
        </h2>

        {/* Form */}
        <form
          onSubmit={isLogin ? handleLogin : handleRegister}
          className="space-y-4"
        >
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-[#303030] mb-1">Name</label>
              <input
                ref={firstFieldRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                className="w-full rounded-md border border-[#BBB3DB] p-2 text-sm text-[#303030] focus:outline-none focus:ring-2 focus:ring-[#BBB3DB]"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#303030] mb-1">Email</label>
            <input
              ref={isLogin ? firstFieldRef : undefined}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full rounded-md border border-[#BBB3DB] p-2 text-sm text-[#303030] focus:outline-none focus:ring-2 focus:ring-[#BBB3DB]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#303030] mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full rounded-md border border-[#BBB3DB] p-2 text-sm text-[#303030] focus:outline-none focus:ring-2 focus:ring-[#BBB3DB]"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitDisabled}
            className={`w-full rounded-md px-4 py-2 text-sm font-bold ${
              isLogin ? 'bg-[#BBB3DB] text-[#303030]' : 'bg-[#BBB3DB] text-[#303030]'
            } hover:bg-[#A69DD6] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
          >
            {submitting && (
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
            )}
            {isLogin ? 'Login' : 'Create account'}
          </button>
        </form>

        {/* Toggle login/register */}
        <p className="text-center text-sm text-[#303030] mt-2">
          {isLogin ? (
            <>
              Don&apos;t have an account?{' '}
              <button
                onClick={() => setIsLogin(false)}
                className="text-[#6F7C8B] underline hover:text-[#5a6570]"
              >
                Register here
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={() => setIsLogin(true)}
                className="text-[#BBB3DB] underline hover:text-[#5a6570]"
              >
                Login here
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
