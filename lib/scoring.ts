import { StudentProfile } from './types';

export function completionScore(profile: Omit<StudentProfile, 'score' | 'completion'>): number {
  const required = [profile.name, profile.email, profile.skills.length > 0 ? 'ok' : '', profile.projects.length > 0 ? 'ok' : ''];
  const complete = required.filter(Boolean).length;
  return complete / required.length;
}

export function calculateStudentScore(profile: Omit<StudentProfile, 'score' | 'completion'>): { score: number; completion: number } {
  const completion = completionScore(profile);
  const score = (profile.skills.length * 2) + (profile.projects.length * 3) + (completion * 5);
  return { score: Number(score.toFixed(2)), completion: Number(completion.toFixed(2)) };
}

export function calculateMatchScore(student: StudentProfile, requiredSkills: string[]): number {
  const overlap = student.skills.filter((skill) => requiredSkills.includes(skill.toLowerCase())).length;
  return Number((overlap + (student.score * 0.1)).toFixed(2));
}

export function fitLabel(score: number): 'Top Match' | 'Strong Fit' | 'Good Fit' {
  if (score >= 6) return 'Top Match';
  if (score >= 3.8) return 'Strong Fit';
  return 'Good Fit';
}
