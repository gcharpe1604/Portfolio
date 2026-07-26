import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { ArrowRight, GitPullRequest } from "lucide-react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { contributionEvidence } from "../data/home";
import { organizations } from "../data/site";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { ExternalLink } from "./ExternalLink";
import { MediaDialog } from "./MediaDialog";
import { ResponsiveImage } from "./ResponsiveImage";
import { StatusBadge } from "./StatusBadge";
import { VideoEvidence } from "./VideoEvidence";

export function EvidenceViewer({ contribution, compact = false }) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <m.article
        key={`${contribution.organization}-${contribution.number}`}
        className={`evidence-viewer ${compact ? "is-compact" : ""}`}
        initial={reduceMotion ? false : { opacity: 0, x: 8 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="evidence-viewer-meta">
          <span>{organizations[contribution.organization].repository}</span>
          <span>PR #{contribution.number}</span>
        </div>
        {contribution.asset ? (
          <figure className="evidence-viewer-media evidence-frame">
            <ResponsiveImage
              asset={contribution.asset}
              sizes="(max-width: 767px) 100vw, 620px"
            />
            <figcaption>
              <span>Repository evidence for PR #{contribution.number}</span>
              <MediaDialog
                asset={contribution.asset}
                label={`Expand PR #${contribution.number} evidence`}
                caption={`${contribution.title} — PR #${contribution.number}`}
              />
            </figcaption>
          </figure>
        ) : null}
        {contribution.video ? (
          <VideoEvidence video={contribution.video} />
        ) : null}
        <div className="evidence-viewer-copy">
          <p>{contribution.description}</p>
          <ExternalLink href={contribution.link}>
            View pull request <ArrowRight aria-hidden="true" />
          </ExternalLink>
        </div>
      </m.article>
    </AnimatePresence>
  );
}

export function ContributionLedger() {
  const [organization, setOrganization] = useState("harbor");
  const [activeNumber, setActiveNumber] = useState(
    contributionEvidence.harbor[0].number,
  );
  const organizationTabsRef = useRef([]);
  const visible = contributionEvidence[organization];
  const isMobile = useMediaQuery("(max-width: 767px)");
  const active =
    visible.find((contribution) => contribution.number === activeNumber) ??
    visible[0];

  const selectOrganization = (id) => {
    setOrganization(id);
    setActiveNumber(contributionEvidence[id][0].number);
  };

  const selectAdjacentOrganization = (event, index) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    const ids = Object.keys(organizations);
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (index + direction + ids.length) % ids.length;
    selectOrganization(ids[nextIndex]);
    organizationTabsRef.current[nextIndex]?.focus();
  };

  return (
    <div className="contribution-ledger">
      <div className="ledger-controls">
        <div
          className="organization-switch ledger-switch"
          role="tablist"
          aria-label="Contribution organization"
        >
          {Object.values(organizations).map((org, index) => (
            <button
              key={org.id}
              ref={(element) => {
                organizationTabsRef.current[index] = element;
              }}
              type="button"
              role="tab"
              id={`ledger-organization-${org.id}`}
              aria-selected={organization === org.id}
              aria-controls="ledger-panel"
              tabIndex={organization === org.id ? 0 : -1}
              onClick={() => selectOrganization(org.id)}
              onKeyDown={(event) => selectAdjacentOrganization(event, index)}
            >
              {org.name}
            </button>
          ))}
        </div>
        <p>{organizations[organization].intro}</p>
      </div>

      <div
        className="ledger-layout"
        id="ledger-panel"
        role="tabpanel"
        aria-labelledby={`ledger-organization-${organization}`}
      >
        <div className="ledger-rows" aria-live="polite">
          {visible.map((contribution) => {
            const selected = active.number === contribution.number;
            return (
              <article className="ledger-record" key={contribution.number}>
                <button
                  type="button"
                  aria-expanded={selected}
                  aria-controls={
                    isMobile
                      ? `ledger-evidence-${contribution.number}`
                      : "ledger-evidence"
                  }
                  onClick={() => setActiveNumber(contribution.number)}
                  data-cursor="Evidence"
                >
                  {selected ? (
                    <m.span
                      className="ledger-selection"
                      layoutId="ledger-selection"
                      transition={{
                        type: "spring",
                        stiffness: 460,
                        damping: 36,
                      }}
                    />
                  ) : null}
                  <span className="ledger-record-meta">
                    <span>
                      <GitPullRequest aria-hidden="true" /> PR #
                      {contribution.number}
                    </span>
                    <StatusBadge
                      status={contribution.status}
                      statusKey={contribution.statusKey}
                    />
                  </span>
                  <strong>{contribution.title}</strong>
                  <span className="ledger-record-date">
                    <time dateTime={contribution.date}>
                      {new Intl.DateTimeFormat("en", {
                        month: "short",
                        year: "numeric",
                      }).format(new Date(`${contribution.date}T00:00:00`))}
                    </time>
                    <span>{selected ? "Evidence open" : "View evidence"}</span>
                  </span>
                </button>
                <div
                  className="ledger-mobile-viewer"
                  id={
                    isMobile
                      ? `ledger-evidence-${contribution.number}`
                      : undefined
                  }
                >
                  {isMobile && selected ? (
                    <EvidenceViewer contribution={contribution} compact />
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
        {!isMobile ? (
          <aside className="ledger-desktop-viewer" id="ledger-evidence">
            <EvidenceViewer contribution={active} />
          </aside>
        ) : null}
      </div>

      <Link
        className="text-link ledger-complete-link"
        to={`/open-source?org=${organization}`}
      >
        View the complete contribution ledger
        <ArrowRight aria-hidden="true" />
      </Link>
    </div>
  );
}
