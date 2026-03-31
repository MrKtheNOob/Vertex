'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getProfile, getUser, saveProfile } from '@/lib/storage';
import type { Project } from '@/lib/types';

export default function ProfileEditPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [education, setEducation] = useState('');
  const [skills, setSkills] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [user, profile] = await Promise.all([getUser(), getProfile()]);
        if (!mounted) return;
        if (user) setEmail(user.email);
        if (profile) {
          setName(profile.name);
          setEducation(profile.education || '');
          setSkills(profile.skills.join(', '));
          setProjects(profile.projects);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <main className="panel" style={{ maxWidth: 620, margin: '0 auto' }}>
        <p className="small">Loading profile...</p>
      </main>
    );
  }

  return (
    <main className="grid" style={{ maxWidth: 940, margin: '0 auto' }}>
      <section className="panel">
        <h1 className="h2">Build Your Student Profile</h1>
        <p className="small">Make it complete to maximize your ranking score.</p>

        <div className="two-col">
          <div>
            <label className="label">Full name</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>

        <label className="label">Education (optional)</label>
        <input className="input" value={education} onChange={(e) => setEducation(e.target.value)} />

        <label className="label">Skills (comma-separated)</label>
        <input className="input" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="react, sql, python" />
        {error && <p className="small" style={{ color: '#ffb8b8' }}>{error}</p>}
      </section>

      <section className="panel">
        <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <h2 className="h2">Projects</h2>
          <button
            className="btn alt"
            onClick={() => setProjects([...projects, { id: crypto.randomUUID(), title: '', link: '', description: '' }])}
          >
            + Add Project
          </button>
        </div>

        {projects.map((project, i) => (
          <div key={project.id} className="card" style={{ marginBottom: 12 }}>
            <label className="label">Title</label>
            <input className="input" value={project.title} onChange={(e) => {
              const next = [...projects];
              next[i] = { ...next[i], title: e.target.value };
              setProjects(next);
            }} />
            <label className="label">Link</label>
            <input className="input" value={project.link} onChange={(e) => {
              const next = [...projects];
              next[i] = { ...next[i], link: e.target.value };
              setProjects(next);
            }} />
            <label className="label">Description</label>
            <textarea className="textarea" value={project.description} onChange={(e) => {
              const next = [...projects];
              next[i] = { ...next[i], description: e.target.value };
              setProjects(next);
            }} />
          </div>
        ))}

        <button
          className="btn"
          disabled={saving}
          onClick={async () => {
            const normalizedSkills = skills.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
            setSaving(true);
            setError('');
            try {
              await saveProfile({ userId: 'current', name, email, education, skills: normalizedSkills, projects: projects.filter((p) => p.title) });
              router.push('/dashboard');
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Unable to save profile');
            } finally {
              setSaving(false);
            }
          }}
        >
          {saving ? 'Saving...' : 'Save Profile & Refresh Score'}
        </button>
      </section>
    </main>
  );
}
