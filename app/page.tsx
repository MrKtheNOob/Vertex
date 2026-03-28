import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="grid">
      <section className="card">
        <p className="badge">Zentra / Vertex MVP</p>
        <h1 className="h1">Rank student talent. Match companies faster.</h1>
        <p className="small">Students create scored profiles. Companies discover candidates and run skill-based matching against jobs.</p>
        <div className="row" style={{ marginTop: 16 }}>
          <Link href="/signup" className="btn">Get Started</Link>
          <Link href="/students" className="btn alt">View Student Rankings</Link>
        </div>
      </section>
    </main>
  );
}
