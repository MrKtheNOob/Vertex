import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="grid">
      <section className="panel hero-grid">
        <div>
          <p className="badge">Zentra / Vertex Talent Graph</p>
          <h1 className="h1">Rank student talent. Match companies in minutes.</h1>
          <p className="small" style={{ maxWidth: 560 }}>
            A clean workflow for students to build scored profiles and for recruiters to instantly discover, filter, and match top candidates.
          </p>
          <div className="row" style={{ marginTop: 16, flexWrap: 'wrap' }}>
            <Link href="/signup" className="btn">Create Account</Link>
            <Link href="/students" className="btn alt">Explore Rankings</Link>
          </div>
        </div>

        <div className="card">
          <h2 className="h3">Demo Flow</h2>
          <ol className="small" style={{ margin: '8px 0 0 16px', padding: 0 }}>
            <li>Student signs up and completes profile.</li>
            <li>Score updates instantly from projects + skills.</li>
            <li>Company filters ranked students by skill.</li>
            <li>Company posts a job and sees top matches.</li>
          </ol>
        </div>
      </section>

      <section className="metric-grid">
        <article className="kpi-block">
          <p className="small">Signal Quality</p>
          <p className="h3">Deterministic Scoring</p>
        </article>
        <article className="kpi-block">
          <p className="small">Recruiter Speed</p>
          <p className="h3">Skill-first Discovery</p>
        </article>
        <article className="kpi-block">
          <p className="small">MVP Focus</p>
          <p className="h3">Simple Match Labels</p>
        </article>
      </section>
    </main>
  );
}
