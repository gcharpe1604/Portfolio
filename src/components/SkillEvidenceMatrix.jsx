import { AnimatePresence, m, useReducedMotion } from "motion/react";
import {
  ArrowUpRight,
  Code2,
  Database,
  KeyRound,
  MonitorSmartphone,
  Network,
  Workflow,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { skillGroups } from "../data/home";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { ExternalLink } from "./ExternalLink";

const firstSkill = skillGroups[0].skills[0];

const skillMarks = {
  JavaScript: { logo: "/assets/skills/javascript-original.svg" },
  TypeScript: { logo: "/assets/skills/typescript-original.svg" },
  Python: { logo: "/assets/skills/python-original.svg" },
  Go: { logo: "/assets/skills/go-original-wordmark.svg" },
  SQL: { icon: Database },
  React: { logo: "/assets/skills/react-original.svg" },
  Vite: { logo: "/assets/skills/vitejs-original.svg" },
  HTML: { logo: "/assets/skills/html5-original.svg" },
  CSS: { logo: "/assets/skills/css3-original.svg" },
  "Responsive interfaces": { icon: MonitorSmartphone },
  "Node.js": { logo: "/assets/skills/nodejs-original.svg" },
  Express: { logo: "/assets/skills/express-original.svg" },
  "REST APIs": { icon: Network },
  PostgreSQL: { logo: "/assets/skills/postgresql-original.svg" },
  MongoDB: { logo: "/assets/skills/mongodb-original.svg" },
  OAuth: { icon: KeyRound },
  Git: { logo: "/assets/skills/git-original.svg" },
  GitHub: { logo: "/assets/skills/github-original.svg" },
  Docker: { logo: "/assets/skills/docker-original.svg" },
  Linux: { logo: "/assets/skills/linux-plain.svg" },
  Postman: { logo: "/assets/skills/postman-original.svg" },
  "CI/CD fundamentals": { icon: Workflow },
};

function SkillMark({ name }) {
  const mark = skillMarks[name] ?? { icon: Code2 };
  const Icon = mark.icon;

  return (
    <span
      className="skill-proof-mark"
      data-mark-type={mark.logo ? "brand" : "concept"}
      aria-hidden="true"
    >
      {mark.logo ? <img src={mark.logo} alt="" /> : <Icon />}
    </span>
  );
}

function SkillProof({ skill, mobile = false }) {
  const reduceMotion = useReducedMotion();
  const external = skill.href?.startsWith("http");
  const skillHeading =
    skill.name === "CI/CD fundamentals" ? (
      <>
        CI/CD <span className="skill-heading-line">fundamentals</span>
      </>
    ) : (
      skill.name
    );
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
        <SkillMark name={skill.name} />
        <span className="skill-proof-label">Selected skill</span>
        <h3>{skillHeading}</h3>
        <p>{skill.context}</p>
        <strong>{skill.depth}</strong>
        {link}
      </m.div>
    </AnimatePresence>
  );
}

export function SkillEvidenceMatrix() {
  const [activeSkill, setActiveSkill] = useState(firstSkill);
  const isMobile = useMediaQuery("(max-width: 47.9375rem)");

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
