'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      if (res.ok) {
        // Automatically sign in after registration
        const signInRes = await signIn('credentials', {
          redirect: false,
          email,
          password,
        });

        if (signInRes?.ok) {
          router.push('/inbox');
        } else {
          setError('Sign-in failed after registration.');
        }
      } else {
        const data = await res.json().catch(() => null);
        setError(data?.message || 'Registration failed. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (res?.ok) {
      router.push('/inbox');
    } else {
      setError('Invalid email or password.');
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setIsLogin(true)} disabled={isLogin}>
          LoginButton
        </button>
        <button onClick={() => setIsLogin(false)} disabled={!isLogin} className='ml-2'>
          RegisterButton 
        </button>
      </div>

      {!isLogin ? (
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Register</button>
        </form>
      ) : (
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      )}

      {error && (
        <p style={{ color: 'red', marginTop: '0.5rem' }}>
          {error}
        </p>
      )}
  
  
    </div>  );
}
