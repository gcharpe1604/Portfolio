import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function GlassCard({ children, className, delay = 0, as = "div" }) {
  const Component = motion[as] || motion.div;

  return (
    <Component
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "thin-gradient-border rounded-lg border border-white/10 bg-white/[0.045] shadow-card-glow backdrop-blur-xl transition duration-300 hover:border-white/18 hover:bg-white/[0.06]",
        className,
      )}
    >
      {children}
    </Component>
  );
}
