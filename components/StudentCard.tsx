import SkillChips from './SkillChips';
import type { StudentProfile } from '@/lib/types';

export default function StudentCard({ student, rank }: { student: StudentProfile; rank: number }) {
  return (
    <article className="card">
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'start' }}>
        <div>
          <p className="small">Rank #{rank}</p>
          <h3 style={{ marginTop: 0 }}>{student.name}</h3>
          <p className="small">{student.education || 'Education not provided'}</p>
        </div>
        <span className="badge">Score {student.score}</span>
      </div>
      <SkillChips skills={student.skills} />
    </article>
  );
}
