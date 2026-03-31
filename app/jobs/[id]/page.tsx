'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { calculateMatchScore, fitLabel } from '@/lib/scoring';
import { getJob, getStudents } from '@/lib/storage';
import type { Job, StudentProfile } from '@/lib/types';

export default function JobCandidatesPage() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | undefined>(undefined);
  const [ranked, setRanked] = useState<Array<{ student: StudentProfile; matchScore: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [selectedJob, students] = await Promise.all([getJob(id), getStudents()]);
        if (!mounted) return;
        setJob(selectedJob);

        const sorted = students
          .map((student) => ({
            student,
            matchScore: selectedJob ? calculateMatchScore(student, selectedJob.requiredSkills) : 0,
          }))
          .sort((a, b) => b.matchScore - a.matchScore);
        setRanked(sorted);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : 'Unable to load candidates');
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
        <p className="small">Loading job candidates...</p>
      </main>
    );
  }

  if (!job) {
    return (
      <main className="panel" style={{ maxWidth: 620, margin: '0 auto' }}>
        {error && <p className="small" style={{ color: '#ffb8b8' }}>{error}</p>}
        <h1 className="h2">Job not found</h1>
        <Link href="/jobs" className="btn alt">Back to Jobs</Link>
      </main>
    );
  }

  return (
    <main className="grid">
      <section className="panel">
        <p className="badge">Candidate Matching</p>
        <h1 className="h2" style={{ marginTop: 10 }}>{job.title}</h1>
        <p className="small">{job.companyName} · Required skills: {job.requiredSkills.join(', ')}</p>
      </section>

      <section className="panel">
        <h2 className="h2">Top Candidates</h2>
        <table className="table">
          <thead><tr><th>Student</th><th>Vertex Score</th><th>Match Score</th><th>Label</th></tr></thead>
          <tbody>
            {ranked.map(({ student, matchScore }) => (
              <tr key={student.userId}>
                <td>{student.name}</td>
                <td>{student.score}</td>
                <td>{matchScore}</td>
                <td><span className="badge">{fitLabel(matchScore)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
