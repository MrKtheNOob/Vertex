export default function ScoreBadge({ score }: { score: number }) {
  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <p className="small" style={{ marginBottom: 8 }}>Vertex Score</p>
      <div style={{ fontSize: 44, fontWeight: 800, color: 'var(--accent)' }}>{score}</div>
      <p className="small">score = (skills×2) + (projects×3) + (completion×5)</p>
    </div>
  );
}
