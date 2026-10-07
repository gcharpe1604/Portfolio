import { ExternalLink, Github, Layers3 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ProjectCard({ project, variant = "secondary" }) {
  const featured = variant === "featured";

  return (
    <motion.article
      initial={false}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5 }}
      className={cn(
        "thin-gradient-border group relative flex h-full flex-col overflow-hidden rounded-lg border border-white/10 bg-white/[0.045] shadow-card-glow backdrop-blur-xl transition duration-300 hover:border-teal-300/25 hover:bg-white/[0.06]",
        featured ? "p-7 sm:p-8 lg:min-h-[26rem]" : "p-6 lg:min-h-[22rem]",
      )}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-300/50 to-transparent opacity-70" />
      <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-blue-400/10 blur-3xl transition group-hover:bg-teal-300/15" />
      <div className="relative">
        <div className="flex items-center justify-between gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-md border border-white/10 bg-black/25 text-teal-300">
            <Layers3 size={21} />
          </div>
          {featured ? (
            <span className="rounded-full border border-teal-300/20 bg-teal-300/10 px-3 py-1 text-xs font-medium text-teal-200">
              Primary build
            </span>
          ) : null}
        </div>
        <h3
          className={cn(
            "mt-5 font-semibold text-white",
            featured ? "text-3xl" : "text-2xl",
          )}
        >
          {project.title}
        </h3>
        <p className="mt-3 text-base leading-8 text-muted-foreground">
          {project.description}
        </p>
        <div className="mt-5 grid gap-2">
          {project.highlights.map((highlight) => (
            <div key={highlight} className="flex gap-3 text-sm text-slate-200">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-300" />
              <span>{highlight}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="relative mt-6 flex flex-wrap gap-2">
        {project.tech.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-300"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="relative mt-auto flex flex-col gap-3 pt-7 sm:flex-row">
        <Button asChild variant="secondary" className="w-full sm:w-auto">
          <a href={project.github} target="_blank" rel="noreferrer">
            <Github className="mr-2" size={17} />
            GitHub
          </a>
        </Button>
        <Button asChild className="w-full sm:w-auto">
          <a href={project.demo} target="_blank" rel="noreferrer">
            <ExternalLink className="mr-2" size={17} />
            Live Demo
          </a>
        </Button>
      </div>
    </motion.article>
  );
}
