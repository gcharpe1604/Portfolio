export function SectionHeading({ number, title, copy, id }) {
  return (
    <div className="section-heading" id={id}>
      <div>
        <span className="section-number">{number}</span>
        <h2>{title}</h2>
      </div>
      {copy ? <p>{copy}</p> : null}
    </div>
  );
}
