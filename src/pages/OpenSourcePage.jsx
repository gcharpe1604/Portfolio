import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ContributionRecord } from "../components/ContributionRecord";
import {
  contributions,
  openSourceIntro,
  organizations,
  stats,
} from "../data/site";

const statusOptions = [
  { value: "all", label: "All statuses" },
  { value: "merged", label: "Merged" },
  { value: "approved", label: "Approved" },
  { value: "review", label: "In review" },
];

export default function OpenSourcePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const organization = searchParams.get("org") || "all";
  const status = searchParams.get("status") || "all";

  const setFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value === "all") next.delete(key);
    else next.set(key, value);
    setSearchParams(next);
  };

  const filtered = useMemo(
    () =>
      contributions.filter(
        (item) =>
          (organization === "all" || item.organization === organization) &&
          (status === "all" || item.statusKey === status),
      ),
    [organization, status],
  );

  const grouped = Object.values(organizations)
    .map((org) => ({
      ...org,
      contributions: filtered.filter(
        (contribution) => contribution.organization === org.id,
      ),
    }))
    .filter((org) => org.contributions.length);

  return (
    <div className="open-source-page">
      <header className="page-hero open-source-hero">
        <span className="page-hero-word" aria-hidden="true">
          UPSTREAM
        </span>
        <div className="page-hero-topline" aria-hidden="true">
          <span>Contribution ledger</span>
          <span>Observed work / 2026</span>
        </div>
        <div className="page-hero-copy">
          <span className="eyebrow">Open-source engineering</span>
          <h1>
            Engineering in codebases
            <br />
            <em>I didn’t design.</em>
          </h1>
          <p>{openSourceIntro.copy}</p>
        </div>
        <dl className="page-proof-stats">
          {stats.slice(0, 2).map((stat) => (
            <div key={stat.label}>
              <dt>{stat.value}</dt>
              <dd>{stat.label}</dd>
            </div>
          ))}
        </dl>
      </header>

      <section className="filter-bar" aria-labelledby="filter-heading">
        <h2 id="filter-heading" className="sr-only">
          Filter contributions
        </h2>
        <div className="filter-group">
          <span>Organization</span>
          <div className="filter-options">
            <button
              type="button"
              aria-pressed={organization === "all"}
              onClick={() => setFilter("org", "all")}
            >
              All
            </button>
            {Object.values(organizations).map((org) => (
              <button
                key={org.id}
                type="button"
                aria-pressed={organization === org.id}
                onClick={() => setFilter("org", org.id)}
              >
                {org.name}
              </button>
            ))}
          </div>
        </div>
        <div className="filter-group">
          <span>Status</span>
          <div className="filter-options">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={status === option.value}
                onClick={() => setFilter("status", option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="revision-story" aria-labelledby="revision-title">
        <div>
          <span className="eyebrow">From review to revision</span>
          <h2 id="revision-title">A broad GC feature became focused work</h2>
          <p>
            The original garbage-collection command group was too broad for one
            review. Maintainer feedback led to smaller, reviewable changes; PR
            #1030 now focuses on the history command and remains in review.
          </p>
          <a
            className="text-link"
            href="https://github.com/goharbor/harbor-cli/pull/1030"
            target="_blank"
            rel="noreferrer"
          >
            Follow the current PR
          </a>
        </div>
        <ol className="revision-timeline">
          <li>
            <span>01</span>
            <strong>Broad scope</strong>
            <p>A complete GC command group was proposed.</p>
          </li>
          <li>
            <span>02</span>
            <strong>Maintainer direction</strong>
            <p>The work was split into smaller, focused pull requests.</p>
          </li>
          <li>
            <span>03</span>
            <strong>Review and revision</strong>
            <p>
              Error parsing, table widths, parameter rendering, and tests were
              revised through review rounds.
            </p>
          </li>
          <li>
            <span>04</span>
            <strong>Current state</strong>
            <p>
              GC history is still in review and is not described as shipped.
            </p>
          </li>
        </ol>
      </section>

      <section className="contribution-log" aria-labelledby="log-title">
        <div className="log-heading">
          <span className="eyebrow">Chronological technical log</span>
          <h2 id="log-title">
            {filtered.length} contribution
            {filtered.length === 1 ? "" : "s"} shown
          </h2>
          <p>
            Featured records include implementation evidence. Smaller merged
            changes remain compact so status and chronology stay clear.
          </p>
        </div>
        {grouped.length ? (
          grouped.map((group) => (
            <section className="organization-group" key={group.id}>
              <header>
                <div>
                  <span className="eyebrow">{group.repository}</span>
                  <h3>{group.name}</h3>
                </div>
                <p>{group.intro}</p>
              </header>
              <div className="contribution-stack">
                {group.contributions.map((contribution) => (
                  <ContributionRecord
                    key={`${contribution.organization}-${contribution.number}`}
                    contribution={contribution}
                    compact={!contribution.featured}
                  />
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className="empty-filter-state">
            <p>No contributions match these filters.</p>
            <button
              type="button"
              className="button button-secondary"
              onClick={() => setSearchParams({})}
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      <div className="page-next-link">
        <Link to="/#contact">Discuss open-source collaboration</Link>
      </div>
    </div>
  );
}
