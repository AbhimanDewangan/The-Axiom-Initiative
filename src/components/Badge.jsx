import React from "react";
import { cn } from "../lib/cn.js";

export default function Badge({ children, className = "" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80",
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-cyan-300/80" />
      {children}
    </span>
  );
}
