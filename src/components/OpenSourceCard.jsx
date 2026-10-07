import { Code2, GitPullRequestArrow, ShieldCheck } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";

export function OpenSourceCard({ item }) {
  return (
    <GlassCard className="group flex h-full flex-col overflow-hidden p-6 sm:p-8">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-300/80 via-blue-300/50 to-transparent" />
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-md border border-teal-300/25 bg-teal-300/10 text-teal-200 shadow-glow">
            <Code2 size={22} />
          </div>
          <h3 className="text-2xl font-semibold text-white sm:text-3xl">
            {item.project}
          </h3>
        </div>
        <ShieldCheck className="mt-1 text-teal-300" size={24} />
      </div>
      <p className="mt-5 text-base leading-8 text-muted-foreground">
        {item.summary}
      </p>
      <div className="mt-7 grid gap-3">
        {item.contributions.map((row) => (
          <div
            key={`${row.type}-${row.scope}`}
            className="rounded-md border border-white/10 bg-black/25 p-4 transition group-hover:border-white/14"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-teal-300/20 bg-teal-300/10 px-2.5 py-1 text-xs font-semibold text-teal-200">
                <GitPullRequestArrow className="mr-1.5" size={13} />
                {row.type}
              </span>
              <span className="text-sm font-semibold text-white">{row.scope}</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {row.proof}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-2">
        {item.highlights.map((highlight) => (
          <div key={highlight} className="flex gap-3 text-sm text-slate-200">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-300" />
            <span>{highlight}</span>
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-300"
          >
            {tag}
          </span>
        ))}
      </div>
    </GlassCard>
  );
}
