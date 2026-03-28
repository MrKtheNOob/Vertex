export default function SkillChips({ skills }: { skills: string[] }) {
  return (
    <div className="row" style={{ flexWrap: 'wrap' }}>
      {skills.map((skill) => (
        <span key={skill} className="chip">{skill}</span>
      ))}
    </div>
  );
}
