import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="landing-frame-wrap">
      <iframe
        title="Reference Landing"
        src="https://global-id-pro.lovable.app/"
        className="landing-frame"
        allow="clipboard-read; clipboard-write"
      />

      <div className="landing-fallback card">
        <p className="small">If the embedded page is blocked by browser policy, open it directly:</p>
        <Link href="https://global-id-pro.lovable.app/" className="btn" target="_blank">
          Open original landing page
        </Link>
      </div>
    </main>
  );
}
