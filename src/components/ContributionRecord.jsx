import { ResponsiveImage } from "./ResponsiveImage";
import { ExternalLink } from "./ExternalLink";
import { MediaDialog } from "./MediaDialog";
import { StatusBadge } from "./StatusBadge";
import { VideoEvidence } from "./VideoEvidence";

export function ContributionRecord({ contribution, compact = false }) {
  return (
    <article
      className={`contribution-record ${
        contribution.featured && !compact ? "is-featured" : "is-compact"
      }`}
    >
      <div className="contribution-meta">
        <StatusBadge
          status={contribution.status}
          statusKey={contribution.statusKey}
        />
        <span>PR #{contribution.number}</span>
        <time dateTime={contribution.date}>
          {new Intl.DateTimeFormat("en", {
            month: "short",
            year: "numeric",
          }).format(new Date(`${contribution.date}T00:00:00`))}
        </time>
      </div>
      <div className="contribution-copy">
        <h3>{contribution.title}</h3>
        <p>{contribution.description}</p>
        <ul className="tag-list" aria-label="Technologies">
          {contribution.technologies.map((technology) => (
            <li key={technology}>{technology}</li>
          ))}
        </ul>
        <ExternalLink href={contribution.link}>View pull request</ExternalLink>
      </div>
      {!compact && contribution.asset ? (
        <figure className="evidence-figure">
          <ResponsiveImage
            asset={contribution.asset}
            sizes="(max-width: 767px) 100vw, 62vw"
          />
          <figcaption>
            <span>
              {contribution.number === 930
                ? "Approved by a Harbor CLI maintainer · Awaiting merge"
                : `Implementation evidence for PR #${contribution.number}`}
            </span>
            <MediaDialog
              asset={contribution.asset}
              label="Expand evidence"
              caption={`${contribution.title} · PR #${contribution.number}`}
            />
          </figcaption>
        </figure>
      ) : null}
      {!compact && contribution.video ? (
        <VideoEvidence video={contribution.video} />
      ) : null}
    </article>
  );
}
