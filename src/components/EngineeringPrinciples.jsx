import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { engineeringPrinciples } from "../data/home";
import { ExternalLink } from "./ExternalLink";
import { MediaDialog } from "./MediaDialog";
import { ResponsiveImage } from "./ResponsiveImage";

export function EngineeringPrinciples() {
  const [activeId, setActiveId] = useState(engineeringPrinciples[0].id);
  const reduceMotion = useReducedMotion();
  const active = engineeringPrinciples.find(
    (principle) => principle.id === activeId,
  );

  return (
    <div className="principles-layout">
      <div className="principle-list">
        {engineeringPrinciples.map((principle, index) => {
          const selected = active.id === principle.id;
          return (
            <button
              key={principle.id}
              type="button"
              aria-expanded={selected}
              aria-controls="principle-evidence"
              onClick={() => setActiveId(principle.id)}
              data-cursor="Open note"
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <span>
                <strong>{principle.label}</strong>
                <span>{principle.statement}</span>
              </span>
              <ArrowUpRight aria-hidden="true" />
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <m.article
          id="principle-evidence"
          key={active.id}
          className="principle-evidence"
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="editorial-insight">{active.detail}</p>
          <figure className="evidence-frame">
            <ResponsiveImage
              asset={active.artifact}
              sizes="(max-width: 767px) 100vw, 600px"
            />
            <figcaption>
              <span>{active.artifactLabel}</span>
              <MediaDialog
                asset={active.artifact}
                label={`Expand ${active.label} evidence`}
                caption={active.artifactLabel}
              />
            </figcaption>
          </figure>
          <div className="principle-links">
            {active.links.map((item) =>
              item.external ? (
                <ExternalLink key={item.label} href={item.href}>
                  {item.label}
                </ExternalLink>
              ) : (
                <Link key={item.label} to={item.href}>
                  {item.label} <ArrowUpRight aria-hidden="true" />
                </Link>
              ),
            )}
          </div>
        </m.article>
      </AnimatePresence>
    </div>
  );
}
