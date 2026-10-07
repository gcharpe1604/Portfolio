import { motion } from "framer-motion";
import { FaDocker, FaGithub, FaNodeJs, FaReact } from "react-icons/fa";
import { SiExpress, SiMongodb, SiPostgresql, SiTailwindcss, SiVite } from "react-icons/si";
import { skillGroups } from "@/data/skills";
import { GlassCard } from "@/components/GlassCard";

const skillIcons = {
  React: FaReact,
  "Node.js": FaNodeJs,
  "Express.js": SiExpress,
  "Tailwind CSS": SiTailwindcss,
  Vite: SiVite,
  PostgreSQL: SiPostgresql,
  MongoDB: SiMongodb,
  GitHub: FaGithub,
  Docker: FaDocker,
};

export function SkillCloud() {
  return (
    <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
      {skillGroups.map((group, groupIndex) => (
        <GlassCard
          key={group.category}
          className="p-6 md:col-span-1 lg:[&:first-child]:col-span-2 lg:[&:nth-child(2)]:col-span-2"
          delay={groupIndex * 0.04}
        >
          <h3 className="text-lg font-semibold text-white">{group.category}</h3>
          <div className="mt-5 flex flex-wrap gap-2">
            {group.skills.map((skill, index) => (
              <SkillBadge key={skill} skill={skill} index={index} />
            ))}
          </div>
        </GlassCard>
      ))}
    </div>
  );
}

function SkillBadge({ skill, index }) {
  const Icon = skillIcons[skill];

  return (
    <motion.span
      initial={false}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-3 py-2 text-sm text-slate-200 transition hover:border-teal-300/25 hover:bg-teal-300/[0.08]"
    >
      {Icon ? <Icon className="text-teal-300" size={15} /> : null}
      {skill}
    </motion.span>
  );
}
