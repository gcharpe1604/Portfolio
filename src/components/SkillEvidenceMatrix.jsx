import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { skillGroups } from "../data/home";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { ExternalLink } from "./ExternalLink";

const firstSkill = skillGroups[0].skills[0];

function SkillProof({ skill, mobile = false }) {
  const reduceMotion = useReducedMotion();
  const external = skill.href?.startsWith("http");
  const link = skill.href ? (
    external ? (
      <ExternalLink href={skill.href}>Open related proof</ExternalLink>
    ) : (
      <Link to={skill.href}>
        Open related proof <ArrowUpRight aria-hidden="true" />
      </Link>
    )
  ) : null;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <m.div
        key={skill.name}
        className={`skill-proof ${mobile ? "skill-proof-mobile" : ""}`}
        initial={reduceMotion ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      >
        <span>Selected skill</span>
        <h3>{skill.name}</h3>
        <p>{skill.context}</p>
        <strong>{skill.depth}</strong>
        {link}
      </m.div>
    </AnimatePresence>
  );
}

export function SkillEvidenceMatrix() {
  const [activeSkill, setActiveSkill] = useState(firstSkill);
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <div className="skill-matrix">
      <div className="skill-groups">
        {skillGroups.map((group) => (
          <section key={group.id} className="skill-group">
            <h3>{group.label}</h3>
            <ul>
              {group.skills.map((skill) => {
                const selected = activeSkill.name === skill.name;
                return (
                  <li key={skill.name}>
                    <button
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setActiveSkill(skill)}
                      onFocus={() => setActiveSkill(skill)}
                      data-cursor="Inspect"
                    >
                      {selected ? (
                        <m.span
                          className="skill-selection"
                          layoutId="skill-selection"
                          transition={{
                            type: "spring",
                            stiffness: 460,
                            damping: 36,
                          }}
                        />
                      ) : null}
                      <span className="skill-name">{skill.name}</span>
                    </button>
                    {selected && isMobile ? (
                      <SkillProof skill={skill} mobile />
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
      {!isMobile ? (
        <aside className="skill-proof-desktop" aria-live="polite">
          <SkillProof skill={activeSkill} />
        </aside>
      ) : null}
    </div>
  );
}
