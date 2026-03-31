'use client';

import { useEffect, useMemo, useState } from 'react';
import StudentCard from '@/components/StudentCard';
import { getStudents } from '@/lib/storage';
import type { StudentProfile } from '@/lib/types';

export default function StudentsPage() {
  const [filterSkill, setFilterSkill] = useState('');
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const rows = await getStudents();
        if (!mounted) return;
        setStudents(rows);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : 'Unable to load students');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const skill = filterSkill.trim().toLowerCase();
    if (!skill) return students;
    return students.filter((student) => student.skills.includes(skill));
  }, [filterSkill, students]);

  return (
    <main className="grid">
      <section className="panel row" style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <div>
          <h1 className="h2">Student Discovery</h1>
          <p className="small">Highest score first. Filter by skill for targeted shortlisting.</p>
        </div>
        <input
          className="input"
          style={{ maxWidth: 320, marginBottom: 0 }}
          placeholder="Filter by skill: react"
          value={filterSkill}
          onChange={(e) => setFilterSkill(e.target.value)}
        />
      </section>

      {loading && <section className="panel"><p className="small">Loading students...</p></section>}
      {!loading && error && <section className="panel"><p className="small" style={{ color: '#ffb8b8' }}>{error}</p></section>}

      {!loading && filtered.length === 0 && (
        <section className="panel">
          <p className="small">No students matched this filter.</p>
        </section>
      )}

      {filtered.map((student, index) => (
        <StudentCard key={`${student.userId}-${index}`} student={student} rank={index + 1} href={`/students/${student.userId}`} />
      ))}
    </main>
  );
}
