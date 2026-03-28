# ZENTRA / VERTEX — MVP Product Spec

## 1) Product Summary

A platform where students create scored profiles and companies discover top candidates through ranking and simple matching.

## 2) Core MVP Goals

- Let students showcase themselves quickly.
- Give students a visible score.
- Let companies find ranked candidates.
- Provide basic matching against job requirements.

## 3) User Types

### Student

- Creates a profile.
- Gets a visible score.
- Appears in ranking lists.

### Company

- Browses students.
- Filters/sorts by skills and score.
- Optionally posts jobs and views matched candidates.

## 4) Core Features

### A. Student Profile

Fields:

- name
- email
- skills (list)
- projects (title, link, description)
- education (optional)

Actions:

- create profile
- edit profile

### B. Deterministic Score System

`score = (skills_count * 2) + (projects_count * 3) + (profile_completion * 5)`

Where `profile_completion` is normalized from required profile fields.

### C. Student Dashboard

- Show score prominently.
- Show own profile data.
- (Optional v1.1) show top job matches.

### D. Company Discovery View

- List students.
- Sort by score (default).
- Filter by selected skills.
- (Later) sort by relevance.

### E. Job Posting (Optional, recommended for demo)

Fields:

- title
- required_skills
- description

### F. Matching Logic

`match_score = skill_overlap + (student_score_weight)`

Display ranked candidates per job.

## 5) AI Layer for MVP

Use lightweight keyword extraction and skill overlap only. Avoid real ML model work in MVP.

## 6) Data Model (Conceptual)

- `users`
- `student_profiles`
- `projects`
- `jobs`

## 7) Route Map

Public:

- `/` (landing)

Student:

- `/signup`
- `/profile/edit`
- `/dashboard`

Company:

- `/students`
- `/jobs`
- `/jobs/:id`

## 8) Non-Goals

- Document verification
- Messaging
- Notifications
- Advanced OAuth setup
- Complex AI models
- Microservices

## 9) Stack

- Next.js (App Router)
- Supabase Auth
- Supabase Postgres

## 10) Demo Flow

1. Create student profile.
2. Add skills and projects.
3. See score update.
4. Switch to company view.
5. Browse ranked students.
6. Create job.
7. See matched candidates.
