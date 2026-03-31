'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import SkillChips from '@/components/SkillChips';
import { getStudentById } from '@/lib/storage';
import type { StudentProfile } from '@/lib/types';

export default function StudentProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const profile = await getStudentById(id);
        if (!mounted) return;
        setStudent(profile);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : 'Unable to load student profile');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="panel" style={{ maxWidth: 620, margin: '0 auto' }}>
        <p className="small">Loading candidate profile...</p>
      </main>
    );
  }

  if (!student) {
    return (
      <main className="panel" style={{ maxWidth: 620, margin: '0 auto' }}>
        {error && <p className="small" style={{ color: '#ffb8b8' }}>{error}</p>}
        <h1 className="h2">Student not found</h1>
        <p className="small">The selected profile could not be loaded.</p>
        <Link href="/students" className="btn alt">Back to Student Discovery</Link>
      </main>
    );
  }

  return (
    <main className="grid">
      <section className="panel">
        <p className="badge">Candidate Profile</p>
        <h1 className="h2" style={{ marginTop: 10 }}>{student.name}</h1>
        <p className="small">{student.email}</p>
        <p className="small">{student.education || 'Education not provided'}</p>
      </section>

      <section className="two-col">
        <article className="panel">
          <p className="small">Vertex Trust Score</p>
          <p className="kpi">{student.score}</p>
          <p className="small">Profile completion: {Math.round(student.completion * 100)}%</p>
        </article>
        <article className="panel">
          <p className="small" style={{ marginBottom: 8 }}>Skills</p>
          <SkillChips skills={student.skills} />
        </article>
      </section>

      <section className="panel">
        <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <h2 className="h3">Projects</h2>
          <Link href="/students" className="btn alt">Back to Discovery</Link>
        </div>
        <table className="table" style={{ marginTop: 10 }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Link</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {student.projects.map((project) => (
              <tr key={project.id}>
                <td>{project.title}</td>
                <td>{project.link || '-'}</td>
                <td>{project.description || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
