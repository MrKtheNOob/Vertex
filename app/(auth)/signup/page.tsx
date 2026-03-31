'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUpUser } from '@/lib/storage';
import type { Role } from '@/lib/types';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  return (
    <main className="panel" style={{ maxWidth: 620, margin: '0 auto' }}>
      <p className="badge">Get Started</p>
      <h1 className="h2" style={{ marginTop: 12 }}>Create your Vertex account</h1>
      <p className="small">Create a secure account with role-based workspace access.</p>

      <label className="label">Email</label>
      <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@school.edu" />

      <label className="label">Password</label>
      <input
        className="input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="At least 6 characters"
      />

      <label className="label">Role</label>
      <select className="select" value={role} onChange={(e) => setRole(e.target.value as Role)}>
        <option value="student">Student</option>
        <option value="company">Company</option>
      </select>

      {error && <p className="small" style={{ color: '#ffb8b8' }}>{error}</p>}

      <button
        className="btn"
        disabled={loading}
        onClick={async () => {
          if (!email || !password) return;
          setLoading(true);
          setError('');
          try {
            await signUpUser(email.trim(), password, role);
            router.push(role === 'student' ? '/profile/edit' : '/students');
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to sign up');
          } finally {
            setLoading(false);
          }
        }}
      >
        {loading ? 'Creating account...' : 'Create Account'}
      </button>

      <div style={{ marginTop: 10 }}>
        <Link href="/login" className="small">Already have an account? Log in</Link>
      </div>
    </main>
  );
}
