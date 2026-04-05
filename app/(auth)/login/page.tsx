'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { getProfile, getUser, signInUser } from '@/lib/storage';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const resolvePostAuthRoute = async () => {
    for (let attempt = 0; attempt < 4; attempt += 1) {
      const user = await getUser();
      if (user) {
        if (user.role === 'company') return '/students';
        const profile = await getProfile();
        return profile ? '/dashboard' : '/profile/edit';
      }
      await new Promise((resolve) => setTimeout(resolve, 120));
    }
    return '/login';
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password || loading) return;
    setLoading(true);
    setError('');
    try {
      await signInUser(email.trim(), password);
      const destination = await resolvePostAuthRoute();
      router.replace(destination);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="panel" style={{ maxWidth: 620, margin: '0 auto' }}>
      <form onSubmit={handleSubmit}>
        <p className="badge">Welcome Back</p>
        <h1 className="h2" style={{ marginTop: 12 }}>Log in to your Vertex workspace</h1>
        <p className="small">Use your email and password for instant access.</p>

        <label className="label">Email</label>
        <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />

        <label className="label">Password</label>
        <input
          className="input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
        />

        {error && <p className="small" style={{ color: '#ffb8b8' }}>{error}</p>}

        <div className="row" style={{ flexWrap: 'wrap' }}>
          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <Link href="/signup" className="btn alt">Need an account?</Link>
        </div>
      </form>
    </main>
  );
}
