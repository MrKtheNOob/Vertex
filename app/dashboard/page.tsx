'use client';

import { useEffect, useState } from 'react';
import ScoreBadge from '@/components/ScoreBadge';
import SkillChips from '@/components/SkillChips';
import { getProfile } from '@/lib/storage';
import type { StudentProfile } from '@/lib/types';

export default function DashboardPage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);

  useEffect(() => {
    setProfile(getProfile());
  }, []);

  if (!profile) {
    return (
      <main className="card">
        <h1 className="h2">No profile yet</h1>
        <p className="small">Create your student profile first to see your score.</p>
      </main>
    );
  }

  return (
    <main className="grid" style={{ gridTemplateColumns: '280px 1fr' }}>
      <ScoreBadge score={profile.score} />
      <section className="card">
        <h1 className="h2">{profile.name}</h1>
        <p className="small">{profile.email} · Completion: {Math.round(profile.completion * 100)}%</p>
        <h3>Skills</h3>
        <SkillChips skills={profile.skills} />
        <h3>Projects</h3>
        <table className="table">
          <thead><tr><th>Title</th><th>Link</th><th>Description</th></tr></thead>
          <tbody>
            {profile.projects.map((project) => (
              <tr key={project.id}><td>{project.title}</td><td>{project.link || '-'}</td><td>{project.description || '-'}</td></tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
