import { motion } from "framer-motion";
import { journey } from "@/data/skills";

export function Timeline() {
  return (
    <div className="relative">
      <div className="absolute bottom-0 left-[1.05rem] top-0 w-px bg-gradient-to-b from-teal-300/70 via-white/20 to-transparent" />
      <div className="grid gap-5">
        {journey.map((item, index) => (
          <motion.div
            key={item}
            initial={false}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: index * 0.04 }}
            className="relative pl-12"
          >
            <div className="absolute left-0 top-1 flex h-9 w-9 items-center justify-center rounded-full border border-teal-300/20 bg-teal-300/10 text-sm font-semibold text-teal-200">
              {index + 1}
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.05] px-5 py-4 text-base leading-7 text-slate-200 backdrop-blur transition hover:border-teal-300/25">
              {item}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
