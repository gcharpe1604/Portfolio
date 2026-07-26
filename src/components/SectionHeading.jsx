export function SectionHeading({ number, title, copy, id }) {
  const glyphs = {
    "01": "↘",
    "02": "✦",
    "03": "↳",
    "04": "§",
    "05": "◎",
  };

  return (
    <div className="section-heading" id={id}>
      <div className="section-heading-title">
        <span className="section-number">Field note / {number}</span>
        <h2>{title}</h2>
      </div>
      {copy ? <p>{copy}</p> : null}
      <span className="section-glyph" aria-hidden="true">
        {glyphs[number] || "↗"}
      </span>
    </div>
  );
}
