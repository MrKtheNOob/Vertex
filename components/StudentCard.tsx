import Link from 'next/link';
import SkillChips from './SkillChips';
import type { StudentProfile } from '@/lib/types';

export default function StudentCard({ student, rank, href }: { student: StudentProfile; rank: number; href?: string }) {
  const content = (
    <article className="card">
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p className="small">Rank #{rank}</p>
          <h3 className="h3" style={{ marginTop: 2 }}>{student.name}</h3>
          <p className="small">{student.education || 'Education not provided'}</p>
        </div>
        <span className="badge">Trust Score {student.score}</span>
      </div>
      <div style={{ marginTop: 12 }}>
        <SkillChips skills={student.skills} />
      </div>
    </article>
  );

  if (!href) return content;

  return (
    <Link href={href} style={{ display: 'block' }}>
      {content}
    </Link>
  );
}
