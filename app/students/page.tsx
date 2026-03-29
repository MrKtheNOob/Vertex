'use client';

import { useMemo, useState } from 'react';
import StudentCard from '@/components/StudentCard';
import { getStudents } from '@/lib/storage';

export default function StudentsPage() {
  const [filterSkill, setFilterSkill] = useState('');
  const students = useMemo(() => getStudents(), []);

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

      {filtered.map((student, index) => (
        <StudentCard key={`${student.userId}-${index}`} student={student} rank={index + 1} />
      ))}
    </main>
  );
}
