export type Role = 'student' | 'company';

export type Project = {
  id: string;
  title: string;
  link: string;
  description: string;
};

export type StudentProfile = {
  userId: string;
  name: string;
  email: string;
  education?: string;
  skills: string[];
  projects: Project[];
  score: number;
  completion: number;
};

export type Job = {
  id: string;
  companyName: string;
  title: string;
  requiredSkills: string[];
  description: string;
  createdAt: string;
};
