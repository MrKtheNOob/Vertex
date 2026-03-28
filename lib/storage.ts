'use client';

import { calculateStudentScore } from './scoring';
import type { Job, Role, StudentProfile } from './types';

const KEYS = {
  user: 'vertex_user',
  profile: 'vertex_profile',
  jobs: 'vertex_jobs'
};

const seedStudents: StudentProfile[] = [
  { userId: 's1', name: 'Ava Chen', email: 'ava@example.com', education: 'BSc Computer Science', skills: ['react', 'typescript', 'sql'], projects: [{ id: 'p1', title: 'Portfolio', link: '#', description: 'Interactive portfolio app.' }], score: 12.25, completion: 0.85 },
  { userId: 's2', name: 'Noah Patel', email: 'noah@example.com', education: 'BS Information Systems', skills: ['python', 'sql', 'data analysis'], projects: [{ id: 'p1', title: 'Analytics Dashboard', link: '#', description: 'Insights dashboard for KPIs.' }], score: 11.25, completion: 0.85 },
  { userId: 's3', name: 'Mia Lopez', email: 'mia@example.com', education: 'BTech Software Engineering', skills: ['nextjs', 'react', 'ui design'], projects: [{ id: 'p1', title: 'UI Kit', link: '#', description: 'Reusable component library.' }, { id: 'p2', title: 'Client Portal', link: '#', description: 'Role-based app with auth.' }], score: 16.25, completion: 0.85 }
];

export function saveUser(email: string, role: Role) {
  localStorage.setItem(KEYS.user, JSON.stringify({ email, role }));
}

export function getUser(): { email: string; role: Role } | null {
  const raw = localStorage.getItem(KEYS.user);
  return raw ? JSON.parse(raw) : null;
}

export function saveProfile(profile: Omit<StudentProfile, 'score' | 'completion'>) {
  const { score, completion } = calculateStudentScore(profile);
  localStorage.setItem(KEYS.profile, JSON.stringify({ ...profile, score, completion }));
}

export function getProfile(): StudentProfile | null {
  const raw = localStorage.getItem(KEYS.profile);
  return raw ? JSON.parse(raw) : null;
}

export function getStudents(): StudentProfile[] {
  const current = getProfile();
  const merged = current ? [current, ...seedStudents] : seedStudents;
  return merged.sort((a, b) => b.score - a.score);
}

export function saveJob(job: Job) {
  const jobs = getJobs();
  localStorage.setItem(KEYS.jobs, JSON.stringify([job, ...jobs]));
}

export function getJobs(): Job[] {
  const raw = localStorage.getItem(KEYS.jobs);
  return raw ? JSON.parse(raw) : [];
}

export function getJob(id: string): Job | undefined {
  return getJobs().find((job) => job.id === id);
}
