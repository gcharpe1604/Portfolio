import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { socials } from "@/data/socials";

export function CTA() {
  return (
    <section id="contact" className="section-shell scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8">
      <motion.div
        initial={false}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.55 }}
        className="thin-gradient-border relative mx-auto max-w-6xl overflow-hidden rounded-lg border border-white/10 bg-white/[0.06] p-6 shadow-card-glow backdrop-blur-xl sm:p-10"
      >
        <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-teal-300/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-blue-300/10 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-300">
              Contact
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-4xl">
              Open to serious engineering work.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
              I am actively looking for high-quality engineering internships,
              open-source collaboration, and opportunities to work on meaningful
              software.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {socials.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.label}
                  asChild
                  variant={item.label === "GitHub" ? "default" : "secondary"}
                  size="lg"
                  className="group justify-between"
                >
                  <a href={item.href} target="_blank" rel="noreferrer">
                    <span className="flex items-center">
                      <Icon className="mr-2" size={18} />
                      {item.label}
                    </span>
                    <ArrowUpRight className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" size={17} />
                  </a>
                </Button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
