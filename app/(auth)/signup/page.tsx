'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveUser } from '@/lib/storage';
import type { Role } from '@/lib/types';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('student');
  const router = useRouter();

  return (
    <main className="panel" style={{ maxWidth: 620, margin: '0 auto' }}>
      <p className="badge">Get Started</p>
      <h1 className="h2" style={{ marginTop: 12 }}>Create your Vertex account</h1>
      <p className="small">Role capture for MVP now. In next step we wire Supabase email/password auth.</p>

      <label className="label">Email</label>
      <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@school.edu" />

      <label className="label">Role</label>
      <select className="select" value={role} onChange={(e) => setRole(e.target.value as Role)}>
        <option value="student">Student</option>
        <option value="company">Company</option>
      </select>

      <button
        className="btn"
        onClick={() => {
          if (!email) return;
          saveUser(email, role);
          router.push(role === 'student' ? '/profile/edit' : '/students');
        }}
      >
        Continue
      </button>
    </main>
  );
}
