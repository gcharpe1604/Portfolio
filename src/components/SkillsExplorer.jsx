import { useLayoutEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  m,
  useIsPresent,
  useReducedMotion,
} from "motion/react";
import { Link } from "react-router-dom";
import { ExternalLink } from "./ExternalLink";
import { skillGroups } from "../data/home";

const capsuleTravelDuration = 0.48;
const capsuleResizeDuration = 0.3;
const capsuleDuration = capsuleTravelDuration + capsuleResizeDuration;
const capsuleStagger = 0.12;

function SkillRow({
  items,
  rowIndex,
  skillCount,
  groupIndex,
  skillIndex,
  onSelect,
  reducedMotion,
  isPresent,
}) {
  const rowRef = useRef(null);
  const [distance, setDistance] = useState(320);
  useLayoutEffect(() => {
    const row = rowRef.current;
    const list = row.closest(".pf-skill-options");
    const measure = () => {
      if (list.offsetHeight) setDistance(list.offsetHeight + 16);
    };
    measure();
    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(measure)
        : null;
    observer?.observe(list);
    return () => observer?.disconnect();
  }, []);
  return (
    <div ref={rowRef} className="pf-skill-row">
      {items.map((item, i) => {
        const index = rowIndex * 2 + i;
        const pillMotion = {
          initial: { y: -distance, scale: 0.95 },
          enter: {
            y: [null, 0, 0],
            scale: [null, null, 1],
            transition: {
              duration: capsuleDuration,
              delay: (skillCount - 1 - index) * capsuleStagger,
              times: [0, capsuleTravelDuration / capsuleDuration, 1],
              ease: "easeInOut",
            },
          },
          exit: {
            y: [null, null, -distance],
            scale: [null, 0.95, 0.95],
            transition: {
              duration: capsuleDuration,
              delay: index * capsuleStagger,
              times: [0, capsuleResizeDuration / capsuleDuration, 1],
              ease: "easeInOut",
            },
          },
        };
        return (
          <m.button
            type="button"
            key={item.name}
            variants={reducedMotion ? undefined : pillMotion}
            aria-pressed={skillIndex === index}
            tabIndex={isPresent ? 0 : -1}
            onClick={() => onSelect(groupIndex, index)}
          >
            {item.name}
            <span aria-hidden="true">↗</span>
          </m.button>
        );
      })}
    </div>
  );
}

function SkillList({ groupIndex, skillIndex, onSelect, reducedMotion }) {
  const isPresent = useIsPresent();
  const group = skillGroups[groupIndex];
  const rows = Array.from(
    { length: Math.ceil(group.skills.length / 2) },
    (_, i) => group.skills.slice(i * 2, i * 2 + 2),
  );
  return (
    <m.div
      className="pf-skill-options"
      aria-hidden={!isPresent || undefined}
      style={!isPresent ? { pointerEvents: "none" } : undefined}
      initial={reducedMotion ? false : "initial"}
      animate="enter"
      exit="exit"
      transition={{ duration: 0 }}
      variants={
        reducedMotion
          ? undefined
          : {
              initial: { y: 0 },
              enter: { y: 0 },
              exit: { y: 0 },
            }
      }
    >
      {rows.map((items, i) => (
        <SkillRow
          key={items[0].name}
          items={items}
          rowIndex={i}
          skillCount={group.skills.length}
          groupIndex={groupIndex}
          skillIndex={skillIndex}
          onSelect={onSelect}
          reducedMotion={reducedMotion}
          isPresent={isPresent}
        />
      ))}
    </m.div>
  );
}

function SkillDetail({ skill, reducedMotion }) {
  const isPresent = useIsPresent();
  return (
    <m.div
      className="pf-skill-detail"
      aria-live="polite"
      aria-hidden={!isPresent || undefined}
      initial={
        reducedMotion ? false : { x: 10, opacity: 0, filter: "blur(3px)" }
      }
      animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
      exit={
        reducedMotion
          ? undefined
          : {
              x: -6,
              opacity: 0,
              filter: "blur(3px)",
              transition: { duration: 0.16 },
            }
      }
      transition={{
        duration: reducedMotion ? 0 : 0.32,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <span className="pf-kicker">In practice</span>
      <h3>{skill.name}</h3>
      <p>{skill.context}</p>
      <span className="pf-skill-depth">{skill.depth}</span>
      {skill.href &&
        (skill.href.startsWith("http") ? (
          <ExternalLink href={skill.href} tabIndex={isPresent ? 0 : -1}>
            Related work
          </ExternalLink>
        ) : (
          <Link
            to={skill.href}
            className="pf-link"
            tabIndex={isPresent ? 0 : -1}
          >
            Related work
          </Link>
        ))}
    </m.div>
  );
}

export function SkillsExplorer() {
  const [selection, setSelection] = useState({ group: 0, skill: 0 });
  const [indicator, setIndicator] = useState(null);
  const categoryRef = useRef(null);
  const buttons = useRef([]);
  const reducedMotion = useReducedMotion();
  const group = skillGroups[selection.group];
  const skill = group.skills[selection.skill] || group.skills[0];
  useLayoutEffect(() => {
    const button = buttons.current[selection.group];
    const container = categoryRef.current;
    let mounted = true;
    const measure = () => {
      if (!mounted || !button) return;
      setIndicator({
        x: button.offsetLeft,
        y: button.offsetTop,
        width: button.offsetWidth,
        height: button.offsetHeight,
      });
    };
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(measure)
        : null;
    observer?.observe(button);
    observer?.observe(container);
    return () => {
      mounted = false;
      observer?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [selection.group]);
  const selectGroup = (i) => setSelection({ group: i, skill: 0 });
  const selectSkill = (groupIndex, skillIndex) =>
    setSelection((current) =>
      current.group === groupIndex
        ? { ...current, skill: skillIndex }
        : current,
    );
  const keyboard = (event, i) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const count = skillGroups.length;
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? count - 1
          : (i + (event.key === "ArrowRight" ? 1 : count - 1)) % count;
    selectGroup(next);
    buttons.current[next]?.focus();
  };
  return (
    <div className="pf-skills-explorer">
      <div
        className="pf-skill-category"
        ref={categoryRef}
        role="group"
        aria-label="Skill categories"
      >
        {indicator && (
          <m.div
            className="pf-skill-category-indicator"
            aria-hidden="true"
            initial={false}
            animate={indicator}
            transition={
              reducedMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 350, damping: 32 }
            }
          />
        )}
        {skillGroups.map((item, i) => (
          <button
            type="button"
            key={item.id}
            ref={(el) => {
              buttons.current[i] = el;
            }}
            aria-pressed={selection.group === i}
            tabIndex={selection.group === i ? 0 : -1}
            onClick={() => selectGroup(i)}
            onKeyDown={(event) => keyboard(event, i)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="pf-skills-main">
        <div className="pf-skill-list-window">
          <AnimatePresence mode="wait" initial={false}>
            <SkillList
              key={reducedMotion ? "static" : group.id}
              groupIndex={selection.group}
              skillIndex={selection.skill}
              reducedMotion={reducedMotion}
              onSelect={selectSkill}
            />
          </AnimatePresence>
        </div>
        <div className="pf-skill-detail-window">
          <AnimatePresence mode="wait" initial={false}>
            <SkillDetail
              key={reducedMotion ? "static" : `${group.id}-${skill.name}`}
              skill={skill}
              reducedMotion={reducedMotion}
            />
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
