'use client';

import { completionScore } from './scoring';
import { getSupabaseClient } from './supabase';
import type { Job, Project, Role, StudentProfile } from './types';

type AuthUser = {
  id: string;
  email: string;
  role: Role;
};

type StudentProfileRow = {
  user_id: string;
  full_name: string;
  education: string | null;
  score: number | null;
};

function normalizeSkills(skills: string[]) {
  return skills.map((skill) => skill.trim().toLowerCase()).filter(Boolean);
}

function completionFromProfile(profile: Omit<StudentProfile, 'score' | 'completion'>) {
  return Number(completionScore(profile).toFixed(2));
}

function profileFromRow(row: StudentProfileRow, email: string, skills: string[], projects: Project[]): StudentProfile {
  const baseProfile = {
    userId: row.user_id as string,
    name: row.full_name as string,
    email,
    education: row.education || '',
    skills,
    projects,
  };

  return {
    ...baseProfile,
    score: Number(row.score || 0),
    completion: completionFromProfile(baseProfile),
  };
}

async function getAuthSessionUser() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
}

export async function signUpUser(email: string, password: string, role: Role) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { role } },
  });
  if (error) throw error;
  if (!data.user) throw new Error('Unable to create user');

  // If email confirmation is required, session may be null here and RLS blocks insert.
  // In that case we defer users-row upsert to first authenticated session.
  if (data.session) {
    const { error: userError } = await supabase
      .from('users')
      .upsert({ id: data.user.id, role, email }, { onConflict: 'id' });
    if (userError) throw userError;
  }
}

export async function signInUser(email: string, password: string) {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function getUser(): Promise<AuthUser | null> {
  const supabase = getSupabaseClient();
  const authUser = await getAuthSessionUser();
  if (!authUser) return null;

  const { data, error } = await supabase
    .from('users')
    .select('id, email, role')
    .eq('id', authUser.id)
    .maybeSingle();
  if (error) throw error;

  if (!data) {
    const metaRole = authUser.user_metadata?.role;
    const fallbackRole: Role = metaRole === 'company' ? 'company' : 'student';
    const fallbackEmail = authUser.email || '';
    const { error: upsertError } = await supabase
      .from('users')
      .upsert({ id: authUser.id, role: fallbackRole, email: fallbackEmail }, { onConflict: 'id' });
    if (upsertError) throw upsertError;
    return { id: authUser.id, email: fallbackEmail, role: fallbackRole };
  }

  return {
    id: data.id,
    email: data.email,
    role: data.role,
  };
}

export async function logoutUser() {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function saveProfile(profile: Omit<StudentProfile, 'score' | 'completion'>) {
  const supabase = getSupabaseClient();
  const user = await getUser();
  if (!user) throw new Error('You must be logged in to save profile');

  const skills = normalizeSkills(profile.skills);
  const projects = profile.projects.filter((project) => project.title.trim());

  const { error: profileError } = await supabase
    .from('student_profiles')
    .upsert(
      {
        user_id: user.id,
        full_name: profile.name.trim(),
        education: profile.education || null,
        bio: '',
      },
      { onConflict: 'user_id' }
    );
  if (profileError) throw profileError;

  const { error: clearSkillsError } = await supabase.from('student_skills').delete().eq('student_id', user.id);
  if (clearSkillsError) throw clearSkillsError;

  if (skills.length > 0) {
    const { error: skillsError } = await supabase
      .from('student_skills')
      .insert(skills.map((skill) => ({ student_id: user.id, skill })));
    if (skillsError) throw skillsError;
  }

  const { error: clearProjectsError } = await supabase.from('projects').delete().eq('student_id', user.id);
  if (clearProjectsError) throw clearProjectsError;

  if (projects.length > 0) {
    const { error: projectsError } = await supabase
      .from('projects')
      .insert(projects.map((project) => ({
        student_id: user.id,
        title: project.title,
        description: project.description || null,
        link: project.link || null,
      })));
    if (projectsError) throw projectsError;
  }

  const { error: scoreError } = await supabase.rpc('refresh_student_score', { p_student_id: user.id });
  if (scoreError) throw scoreError;
}

export async function getProfile(): Promise<StudentProfile | null> {
  const supabase = getSupabaseClient();
  const user = await getUser();
  if (!user) return null;

  const { data: profile, error: profileError } = await supabase
    .from('student_profiles')
    .select('user_id, full_name, education, score')
    .eq('user_id', user.id)
    .maybeSingle();
  if (profileError) throw profileError;
  if (!profile) return null;

  const { data: skillsRows, error: skillsError } = await supabase
    .from('student_skills')
    .select('skill')
    .eq('student_id', user.id);
  if (skillsError) throw skillsError;

  const { data: projectRows, error: projectsError } = await supabase
    .from('projects')
    .select('id, title, description, link')
    .eq('student_id', user.id);
  if (projectsError) throw projectsError;

  const skills = (skillsRows || []).map((row) => row.skill);
  const projects = (projectRows || []).map((project) => ({
    id: project.id,
    title: project.title,
    description: project.description || '',
    link: project.link || '',
  }));

  return profileFromRow(profile, user.email, skills, projects);
}

export async function getStudents(): Promise<StudentProfile[]> {
  const supabase = getSupabaseClient();

  const { data: profiles, error: profilesError } = await supabase
    .from('student_profiles')
    .select('user_id, full_name, education, score')
    .order('score', { ascending: false });
  if (profilesError) throw profilesError;
  if (!profiles || profiles.length === 0) return [];

  const studentIds = profiles.map((profile) => profile.user_id);

  const [skillsRes, projectsRes, usersRes] = await Promise.all([
    supabase.from('student_skills').select('student_id, skill').in('student_id', studentIds),
    supabase.from('projects').select('id, student_id, title, description, link').in('student_id', studentIds),
    supabase.from('users').select('id, email').in('id', studentIds),
  ]);

  if (skillsRes.error) throw skillsRes.error;
  if (projectsRes.error) throw projectsRes.error;
  if (usersRes.error) throw usersRes.error;

  const skillsByStudent = new Map<string, string[]>();
  for (const row of skillsRes.data || []) {
    const current = skillsByStudent.get(row.student_id) || [];
    current.push(row.skill);
    skillsByStudent.set(row.student_id, current);
  }

  const projectsByStudent = new Map<string, Project[]>();
  for (const row of projectsRes.data || []) {
    const current = projectsByStudent.get(row.student_id) || [];
    current.push({
      id: row.id,
      title: row.title,
      description: row.description || '',
      link: row.link || '',
    });
    projectsByStudent.set(row.student_id, current);
  }

  const emailByUser = new Map((usersRes.data || []).map((row) => [row.id, row.email]));

  return profiles.map((profile) => {
    const skills = skillsByStudent.get(profile.user_id) || [];
    const projects = projectsByStudent.get(profile.user_id) || [];
    const email = emailByUser.get(profile.user_id) || 'unknown@example.com';
    return profileFromRow(profile, email, skills, projects);
  });
}

export async function getStudentById(id: string): Promise<StudentProfile | null> {
  const students = await getStudents();
  return students.find((student) => student.userId === id) || null;
}

export async function saveJob(job: Job) {
  const supabase = getSupabaseClient();
  const user = await getUser();
  if (!user) throw new Error('You must be logged in to create a job');
  if (user.role !== 'company') throw new Error('Only company accounts can create jobs');

  const { error } = await supabase.from('jobs').insert({
    company_id: user.id,
    title: job.title.trim(),
    description: job.description || null,
    required_skills: normalizeSkills(job.requiredSkills),
  });
  if (error) throw error;
}

export async function getJobs(): Promise<Job[]> {
  const supabase = getSupabaseClient();
  const { data: jobsRows, error: jobsError } = await supabase
    .from('jobs')
    .select('id, company_id, title, description, required_skills, created_at')
    .order('created_at', { ascending: false });
  if (jobsError) throw jobsError;
  if (!jobsRows || jobsRows.length === 0) return [];

  const companyIds = [...new Set(jobsRows.map((job) => job.company_id))];
  const { data: usersRows, error: usersError } = await supabase
    .from('users')
    .select('id, email')
    .in('id', companyIds);
  if (usersError) throw usersError;

  const companyEmailMap = new Map((usersRows || []).map((row) => [row.id, row.email]));

  return jobsRows.map((job) => ({
    id: job.id,
    companyName: companyEmailMap.get(job.company_id) || 'Company',
    title: job.title,
    requiredSkills: job.required_skills || [],
    description: job.description || '',
    createdAt: job.created_at,
  }));
}

export async function getJob(id: string): Promise<Job | undefined> {
  const jobs = await getJobs();
  return jobs.find((job) => job.id === id);
}
