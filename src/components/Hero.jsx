import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  ExternalLink,
  GitBranch,
  GitPullRequestArrow,
  Server,
  Terminal,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { profile } from "@/data/profile";
import { socials } from "@/data/socials";

function HeroVisual() {
  const statusRows = [
    ["harbor-cli", "login validation", "merged"],
    ["music-blocks", "pdf export", "reviewed"],
    ["opentrack", "api + data model", "built"],
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="thin-gradient-border relative overflow-hidden rounded-lg border border-white/10 bg-slate-950/70 p-4 shadow-card-glow backdrop-blur-xl"
    >
      <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-teal-300/20 blur-3xl" />
      <div className="absolute -bottom-16 left-10 h-44 w-44 rounded-full bg-blue-400/10 blur-3xl" />
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-400/80" />
          <span className="h-3 w-3 rounded-full bg-amber-300/80" />
          <span className="h-3 w-3 rounded-full bg-emerald-300/80" />
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Terminal size={14} />
          proof-engine.sh
        </div>
      </div>
      <div className="relative grid gap-4 pt-5">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ["OSS", "real PRs", GitPullRequestArrow],
            ["APIs", "clean flows", Server],
            ["Systems", "learning path", Cpu],
          ].map(([label, value, Icon]) => (
            <div
              key={label}
              className="rounded-md border border-white/10 bg-white/[0.045] p-3"
            >
              <Icon className="text-teal-300" size={18} />
              <p className="mt-3 text-sm font-semibold text-white">{label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{value}</p>
            </div>
          ))}
        </div>
        <div className="rounded-md border border-white/10 bg-black/45 p-4 font-mono text-sm leading-6 shadow-inner">
          <p className="text-teal-300">$ ship --evidence</p>
          <p className="mt-2 text-slate-300">reading codebase...</p>
          <p className="text-slate-300">writing focused patch...</p>
          <p className="text-slate-300">validating build...</p>
          <p className="mt-2 text-emerald-300">status: reviewable</p>
        </div>
        <div className="grid gap-3">
          {statusRows.map(([repo, scope, state], index) => (
            <motion.div
              key={repo}
              animate={{ y: [0, -3, 0] }}
              transition={{
                duration: 4,
                delay: index * 0.3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="grid grid-cols-[1fr_auto] gap-3 rounded-md border border-white/10 bg-white/[0.055] px-4 py-3 shadow-sm"
            >
              <div>
                <p className="text-sm font-medium text-white">{repo}</p>
                <p className="text-xs text-muted-foreground">{scope}</p>
              </div>
              <span className="self-center rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2 py-1 text-xs text-emerald-200">
                {state}
              </span>
            </motion.div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            ["OSS", GitBranch],
            ["APIs", Server],
            ["Tests", CheckCircle2],
          ].map(([label, Icon]) => (
            <div
              key={label}
              className="rounded-md border border-white/10 bg-white/[0.035] p-3 text-center"
            >
              <Icon className="mx-auto text-teal-300" size={18} />
              <p className="mt-2 text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function Hero() {
  const github = socials.find((item) => item.label === "GitHub");

  return (
    <section id="home" className="section-shell relative px-4 pb-16 pt-28 sm:px-6 sm:pt-32 lg:px-8 lg:pb-24">
      <div className="pointer-events-none absolute inset-x-0 top-16 mx-auto h-72 max-w-5xl rounded-full bg-teal-300/10 blur-3xl" />
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-muted-foreground backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-teal-300 shadow-glow" />
            Open source + full-stack proof portfolio
          </div>
          <h1 className="mt-6 max-w-4xl text-balance text-5xl font-semibold leading-[1.02] text-white sm:text-6xl lg:text-7xl">
            {profile.name}
          </h1>
          <p className="mt-4 max-w-3xl text-lg font-medium text-slate-200 sm:text-xl">
            {profile.title}
          </p>
          <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
            {profile.positioning}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="group">
              <a href="#projects">
                View Projects
                <ArrowRight className="ml-2 transition group-hover:translate-x-1" size={18} />
              </a>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <a href={github?.href ?? "#"} target="_blank" rel="noreferrer">
                View GitHub
                <ExternalLink className="ml-2" size={17} />
              </a>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {profile.credibilityChips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-300"
              >
                {chip}
              </span>
            ))}
          </div>
        </motion.div>
        <HeroVisual />
      </div>
    </section>
  );
}
