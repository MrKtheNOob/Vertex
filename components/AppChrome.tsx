'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { getProfile, getUser, logoutUser } from '@/lib/storage';
import type { ReactNode } from 'react';
import type { Role } from '@/lib/types';

export default function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLanding = pathname === '/';
  const [role, setRole] = useState<Role | null>(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [email, setEmail] = useState('');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      try {
        const user = await getUser();
        const profile = await getProfile();
        if (!mounted) return;
        setRole(user?.role ?? null);
        setEmail(user?.email ?? '');
        setHasProfile(Boolean(profile));
      } catch {
        if (!mounted) return;
        setRole(null);
        setEmail('');
        setHasProfile(false);
      } finally {
        if (mounted) setHydrated(true);
      }
    };

    loadSession();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated || isLanding) return;

    const isJobsRoute = pathname === '/jobs' || pathname.startsWith('/jobs/');
    const isStudentsRoute = pathname === '/students' || pathname.startsWith('/students/');
    const isAllowedForGuest = pathname === '/signup' || pathname === '/login';
    const isAllowedForStudentNoProfile = pathname === '/signup' || pathname === '/login' || pathname === '/profile/edit';
    const isAllowedForCompany = pathname === '/signup' || pathname === '/students' || isJobsRoute;

    if (!role && !isAllowedForGuest) {
      router.replace('/signup');
      return;
    }

    if (role === 'student' && !hasProfile && !isAllowedForStudentNoProfile) {
      router.replace('/profile/edit');
      return;
    }

    if (role === 'student' && hasProfile && (pathname === '/signup' || pathname === '/login')) {
      router.replace('/dashboard');
      return;
    }

    if (role === 'company' && !(isAllowedForCompany || isStudentsRoute)) {
      router.replace('/students');
    }
  }, [hasProfile, hydrated, isLanding, pathname, role, router]);

  const journey = useMemo(() => {
    if (!role) {
      return {
        step: 'Step 1 of 3',
        title: 'Create your account to start using Vertex.',
        canAccess: (href: string) => href === '/signup' || href === '/login'
      };
    }

    if (role === 'company') {
      return {
        step: 'Step 2 of 3',
        title: 'Publish jobs and review ranked candidate matches.',
        canAccess: (href: string) => href === '/signup' || href === '/students' || href === '/jobs'
      };
    }

    if (role === 'student' && !hasProfile) {
      return {
        step: 'Step 2 of 3',
        title: 'Complete your profile to unlock scoring and matching.',
        canAccess: (href: string) => href === '/signup' || href === '/login' || href === '/profile/edit'
      };
    }

    return {
      step: 'Step 3 of 3',
      title: 'Your workspace is ready. Discover, rank, and match talent.',
      canAccess: () => true
    };
  }, [hasProfile, role]);

  const sidebarNav = useMemo(() => {
    if (!role) return [];

    if (role === 'company') {
      return [
        { href: '/students', label: 'Students' },
        { href: '/jobs', label: 'Jobs' },
      ];
    }

    return [
      { href: '/profile/edit', label: 'Profile' },
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/students', label: 'Students' },
      { href: '/jobs', label: 'Jobs' },
    ];
  }, [role]);

  return (
    <div className={isLanding ? 'shell shell-landing' : 'shell'}>
      {!isLanding && (
        <aside className="sidebar">
          <Link href="/" className="brand">
            <span className="brand-dot" />
            <span>
              Vertex
              <span className="small" style={{ display: 'block' }}>
                Trust Platform
              </span>
            </span>
          </Link>
          <nav className="sidebar-nav">
            {sidebarNav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const locked = !journey.canAccess(item.href);
              return (
                <Link
                  key={item.href}
                  href={locked ? '#' : item.href}
                  className={`nav-pill ${active ? 'active' : ''} ${locked ? 'locked' : ''}`}
                  aria-disabled={locked}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
         
        </aside>
      )}

      <div className="content">
        {!isLanding && (
          <header className="topbar">
            <div className="search-faux">Search students, jobs, skills</div>
            <div className="row">
              {role ? (
                <>
                  <span className="small">{email || 'Signed In'}</span>
                  <button
                    className="btn alt"
                    onClick={async () => {
                      await logoutUser();
                      setRole(null);
                      setEmail('');
                      setHasProfile(false);
                      router.replace('/login');
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <span className="small">Ready to unlock your trust workspace?</span>
                  <Link href="/login" className="btn alt">Log In</Link>
                  <Link href="/signup" className="btn">Get Started Free</Link>
                </>
              )}
            </div>
          </header>
        )}
        <div className="app-shell">
          {!isLanding && (
            <div className="journey-strip">
              <span className="badge">{journey.step}</span>
              <p className="small">{journey.title}</p>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
