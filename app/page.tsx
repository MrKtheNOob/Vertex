import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="grid">
      <section className="panel hero-grid">
        <div>
          <p className="badge">VERTEX Platform</p>
          <h1 className="h1">One trust graph for students, recruiters, and global hiring teams.</h1>
          <p className="small" style={{ maxWidth: 560 }}>
            Build verifiable talent profiles, score them with transparent signals, and turn discovery into shortlist decisions from a single SaaS workspace.
          </p>
          <div className="row" style={{ marginTop: 16, flexWrap: 'wrap' }}>
            <Link href="/signup" className="btn">Start Free</Link>
            <Link href="/students" className="btn alt">Explore Talent Graph</Link>
          </div>
        </div>

        <div className="card">
          <h2 className="h3">How teams use Vertex</h2>
          <ol className="small" style={{ margin: '8px 0 0 16px', padding: 0 }}>
            <li>Students publish profile signals in one place.</li>
            <li>Vertex computes a transparent trust score.</li>
            <li>Recruiters filter by score and skills instantly.</li>
            <li>Jobs are matched to top-fit candidates automatically.</li>
          </ol>
        </div>
      </section>

      <section className="metric-grid">
        <article className="kpi-block">
          <p className="small">Signal Integrity</p>
          <p className="h3">Consistent scoring model</p>
        </article>
        <article className="kpi-block">
          <p className="small">Team Velocity</p>
          <p className="h3">Skill-first candidate search</p>
        </article>
        <article className="kpi-block">
          <p className="small">Hiring Confidence</p>
          <p className="h3">Match labels by fit score</p>
        </article>
      </section>

      <section className="two-col">
        <article className="panel">
          <p className="badge">For Students</p>
          <h2 className="h3" style={{ marginTop: 12 }}>Build a profile that gets ranked, not ignored.</h2>
          <p className="small" style={{ marginTop: 10 }}>
            Share projects, skills, and education once. Vertex computes a clear score and keeps your profile ready for role matching.
          </p>
          <div className="row" style={{ marginTop: 14 }}>
            <Link href="/profile/edit" className="btn alt">Build Profile</Link>
            <Link href="/dashboard" className="btn">Open Dashboard</Link>
          </div>
        </article>
        <article className="panel">
          <p className="badge">For Recruiters</p>
          <h2 className="h3" style={{ marginTop: 12 }}>Move from discovery to shortlist in one workflow.</h2>
          <p className="small" style={{ marginTop: 10 }}>
            Filter ranked candidates by skill, publish jobs, and review top-fit candidates with deterministic match labels.
          </p>
          <div className="row" style={{ marginTop: 14 }}>
            <Link href="/students" className="btn alt">Browse Students</Link>
            <Link href="/jobs" className="btn">Create Job</Link>
          </div>
        </article>
      </section>

      <section className="panel">
        <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div>
            <p className="badge">Product Journey</p>
            <h2 className="h2" style={{ marginTop: 10 }}>A clear, linear onboarding path</h2>
            <p className="small">Start with account setup, complete profile signals, then move into discovery and matching.</p>
          </div>
        </div>
        <div className="journey-grid" style={{ marginTop: 14 }}>
          <article className="card">
            <p className="small">Step 1</p>
            <p className="h3">Create Account</p>
            <p className="small">Choose student or company role.</p>
          </article>
          <article className="card">
            <p className="small">Step 2</p>
            <p className="h3">Complete Profile</p>
            <p className="small">Add skills, projects, and education signals.</p>
          </article>
          <article className="card">
            <p className="small">Step 3</p>
            <p className="h3">Discover & Match</p>
            <p className="small">Filter talent and rank candidates by fit.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
