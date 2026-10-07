import { motion } from "framer-motion";
import { profile } from "@/data/profile";

export function ProofStrip() {
  return (
    <section className="section-shell px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        initial={false}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto grid max-w-6xl gap-3 rounded-lg border border-white/10 bg-white/[0.045] p-3 shadow-card-glow backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-5"
      >
        {profile.proofPoints.map((point) => (
          <div
            key={point}
            className="rounded-md border border-white/10 bg-black/25 px-4 py-4 text-sm font-semibold leading-6 text-slate-100 transition hover:border-teal-300/35 hover:bg-teal-300/[0.06]"
          >
            {point}
          </div>
        ))}
      </motion.div>
    </section>
  );
}
