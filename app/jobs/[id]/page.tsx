'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { calculateMatchScore, fitLabel } from '@/lib/scoring';
import { getJob, getStudents } from '@/lib/storage';

export default function JobCandidatesPage() {
  const { id } = useParams<{ id: string }>();

  const { job, ranked } = useMemo(() => {
    const job = getJob(id);
    const students = getStudents();
    const ranked = students
      .map((student) => ({
        student,
        matchScore: job ? calculateMatchScore(student, job.requiredSkills) : 0
      }))
      .sort((a, b) => b.matchScore - a.matchScore);

    return { job, ranked };
  }, [id]);

  if (!job) {
    return (
      <main className="card">
        <h1 className="h2">Job not found</h1>
        <Link href="/jobs" className="btn alt">Back to Jobs</Link>
      </main>
    );
  }

  return (
    <main className="grid">
      <section className="card">
        <h1 className="h2">{job.title}</h1>
        <p className="small">{job.companyName} · Required skills: {job.requiredSkills.join(', ')}</p>
      </section>
      <section className="card">
        <h2 className="h2">Matched Candidates</h2>
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
