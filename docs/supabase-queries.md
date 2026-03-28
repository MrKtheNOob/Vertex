# Supabase Query Recipes (MVP)

## 1) Upsert user on first login

```sql
insert into public.users (id, role, email)
values (:auth_user_id, :role, :email)
on conflict (id) do update
set role = excluded.role,
    email = excluded.email;
```

## 2) Create / update student profile

```sql
insert into public.student_profiles (user_id, full_name, education, bio)
values (:student_id, :full_name, :education, :bio)
on conflict (user_id) do update
set full_name = excluded.full_name,
    education = excluded.education,
    bio = excluded.bio;

select public.refresh_student_score(:student_id);
```

## 3) Add skill

```sql
insert into public.student_skills (student_id, skill)
values (:student_id, :skill)
on conflict (student_id, skill) do nothing;

select public.refresh_student_score(:student_id);
```

## 4) Add project

```sql
insert into public.projects (student_id, title, description, link)
values (:student_id, :title, :description, :link);

select public.refresh_student_score(:student_id);
```

## 5) List students by score

```sql
select
  sp.user_id,
  sp.full_name,
  sp.education,
  sp.score,
  array_remove(array_agg(distinct ss.skill), null) as skills
from public.student_profiles sp
left join public.student_skills ss on ss.student_id = sp.user_id
group by sp.user_id, sp.full_name, sp.education, sp.score
order by sp.score desc;
```

## 6) Filter students by one or more skills

```sql
select distinct
  sp.user_id,
  sp.full_name,
  sp.score
from public.student_profiles sp
join public.student_skills ss on ss.student_id = sp.user_id
where lower(ss.skill) = any(:skills_lowercase_array)
order by sp.score desc;
```

## 7) Create job

```sql
insert into public.jobs (company_id, title, description, required_skills)
values (:company_id, :title, :description, :required_skills_array)
returning id;
```

## 8) Get top candidates for a job

```sql
with candidates as (
  select
    sp.user_id,
    sp.full_name,
    sp.score,
    public.calculate_job_match_score(:job_id, sp.user_id) as match_score
  from public.student_profiles sp
)
select *
from candidates
order by match_score desc, score desc
limit 25;
```
