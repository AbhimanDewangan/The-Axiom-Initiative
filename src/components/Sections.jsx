import React from "react";
import { cn } from "../lib/cn.js";

export default function Section({ id, eyebrow, title, desc, children, className = "" }) {
  return (
    <section id={id} className={cn("relative scroll-mt-24 py-20 md:py-28", className)}>
      <div className="mx-auto w-full max-w-6xl px-5">
        <div className="mx-auto max-w-3xl text-center">
          {eyebrow ? (
            <div className="mb-3 inline-flex items-center justify-center">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-medium text-white/70">
                {eyebrow}
              </span>
            </div>
          ) : null}
          {title ? (
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-5xl">
              {title}
            </h2>
          ) : null}
          {desc ? (
            <p className="mt-4 text-base leading-relaxed text-white/70 md:text-lg">
              {desc}
            </p>
          ) : null}
        </div>

        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}
