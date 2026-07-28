import {
  BadgeCheck,
  BriefcaseBusiness,
  CircleDot,
  GitPullRequest,
  UserRound,
} from "lucide-react";

const glyphs = {
  "01": BriefcaseBusiness,
  "02": BadgeCheck,
  "03": GitPullRequest,
  "04": UserRound,
};

export function SectionHeading({ number, title, subtitle, copy, id }) {
  const Glyph = glyphs[number] ?? CircleDot;

  return (
    <div className="section-heading" id={id}>
      <div className="section-heading-title">
        <span className="section-number">Field note / {number}</span>
        <h2 aria-label={subtitle ? `${title} ${subtitle}` : undefined}>
          <span>{title}</span>
          {subtitle ? (
            <span className="section-heading-support">({subtitle})</span>
          ) : null}
        </h2>
      </div>
      {copy ? <p>{copy}</p> : null}
      <span className="section-glyph" aria-hidden="true">
        <Glyph />
      </span>
    </div>
  );
}
