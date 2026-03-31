'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import ScoreBadge from '@/components/ScoreBadge';
import SkillChips from '@/components/SkillChips';
import { getProfile } from '@/lib/storage';
import type { StudentProfile } from '@/lib/types';

export default function DashboardPage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const next = await getProfile();
        if (!mounted) return;
        setProfile(next);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : 'Unable to load dashboard');
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
        <p className="small">Loading dashboard...</p>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="panel" style={{ maxWidth: 620, margin: '0 auto' }}>
        {error && <p className="small" style={{ color: '#ffb8b8' }}>{error}</p>}
        <h1 className="h2">No profile yet</h1>
        <p className="small">Create your student profile first to see your live score.</p>
        <Link href="/profile/edit" className="btn" style={{ display: 'inline-block' }}>Go to Profile</Link>
      </main>
    );
  }

  return (
    <main className="grid" style={{ gridTemplateColumns: '320px 1fr' }}>
      <ScoreBadge score={profile.score} />
      <section className="panel">
        <h1 className="h2">{profile.name}</h1>
        <p className="small">{profile.email} · Completion: {Math.round(profile.completion * 100)}%</p>

        <div style={{ marginTop: 12 }}>
          <p className="small" style={{ marginBottom: 8 }}>Skills</p>
          <SkillChips skills={profile.skills} />
        </div>

        <div style={{ marginTop: 14 }}>
          <p className="small" style={{ marginBottom: 8 }}>Projects</p>
          <table className="table">
            <thead><tr><th>Title</th><th>Link</th><th>Description</th></tr></thead>
            <tbody>
              {profile.projects.map((project) => (
                <tr key={project.id}><td>{project.title}</td><td>{project.link || '-'}</td><td>{project.description || '-'}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
