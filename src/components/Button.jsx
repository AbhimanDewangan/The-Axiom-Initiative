import React from "react";
import { cn } from "../lib/cn.js";

export default function Button({
  as: Comp = "button",
  className = "",
  variant = "primary",
  size = "md",
  ...props
}) {
  const base =
    "relative inline-flex items-center justify-center gap-2 select-none rounded-2xl font-medium " +
    "transition-transform duration-200 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60 " +
    "disabled:opacity-50 disabled:pointer-events-none";

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-3 text-sm",
    lg: "px-6 py-3.5 text-base"
  };

  const variants = {
    primary:
      "grad-border bg-white/10 hover:bg-white/12 shadow-glow " +
      "before:content-[''] before:absolute before:inset-0 before:rounded-2xl before:opacity-0 hover:before:opacity-100 before:transition-opacity " +
      "before:bg-[radial-gradient(circle_at_30%_20%,rgba(34,211,238,.22),transparent_55%),radial-gradient(circle_at_70%_70%,rgba(251,113,133,.18),transparent_55%)]",
    ghost:
      "bg-white/5 hover:bg-white/8 border border-white/10",
    dark:
      "bg-white/8 hover:bg-white/12 border border-white/10",
  };

  return (
    <Comp className={cn(base, sizes[size], variants[variant], className)} {...props} />
  );
}
