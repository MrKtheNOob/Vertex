'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getJobs, saveJob } from '@/lib/storage';
import type { Job } from '@/lib/types';

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [companyName, setCompanyName] = useState('');
  const [title, setTitle] = useState('');
  const [skills, setSkills] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    setJobs(getJobs());
  }, []);

  return (
    <main className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
      <section className="card">
        <h1 className="h2">Create Job Post</h1>
        <label className="label">Company name</label>
        <input className="input" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
        <label className="label">Title</label>
        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
        <label className="label">Required skills</label>
        <input className="input" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="react, sql" />
        <label className="label">Description</label>
        <textarea className="textarea" value={description} onChange={(e) => setDescription(e.target.value)} />
        <button
          className="btn"
          onClick={() => {
            const job: Job = {
              id: crypto.randomUUID(),
              companyName,
              title,
              requiredSkills: skills.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean),
              description,
              createdAt: new Date().toISOString()
            };
            saveJob(job);
            setJobs(getJobs());
            setCompanyName('');
            setTitle('');
            setSkills('');
            setDescription('');
          }}
        >
          Publish Job
        </button>
      </section>

      <section className="card">
        <h2 className="h2">Posted Jobs</h2>
        {jobs.length === 0 && <p className="small">No jobs yet.</p>}
        <div className="grid">
          {jobs.map((job) => (
            <Link key={job.id} href={`/jobs/${job.id}`} className="card">
              <p className="small">{new Date(job.createdAt).toLocaleDateString()}</p>
              <h3 style={{ marginTop: 0 }}>{job.title}</h3>
              <p className="small">{job.companyName}</p>
              <p className="small">Skills: {job.requiredSkills.join(', ') || 'none'}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
