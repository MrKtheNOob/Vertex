export default function ScoreBadge({ score }: { score: number }) {
  return (
    <div className="panel" style={{ textAlign: 'center' }}>
      <p className="badge" style={{ marginBottom: 10 }}>Vertex Score</p>
      <div className="kpi">{score}</div>
      <p className="small">score = (skills × 2) + (projects × 3) + (completion × 5)</p>
    </div>
  );
}
