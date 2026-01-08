import React, { useMemo, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { cn } from "../lib/cn.js";

function copyToClipboard(text) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
  const ta = document.createElement("textarea");
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  ta.remove();
  return Promise.resolve();
}

export default function CodeBlock({ title, code, language = "bash", className = "" }) {
  const [copied, setCopied] = useState(false);

  const clean = useMemo(() => code.trim() + "\n", [code]);

  const onCopy = async () => {
    await copyToClipboard(clean);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className={cn("grad-border overflow-hidden rounded-3xl bg-white/5 shadow-soft", className)}>
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-300/70" />
          </div>
          <div className="text-xs font-medium text-white/70">{title}</div>
        </div>
        <button
          onClick={onCopy}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 hover:bg-white/10"
          aria-label="Copy code"
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute -left-10 top-8 h-24 w-24 rounded-full bg-cyan-400/15 blur-2xl" />
          <div className="absolute right-0 top-14 h-24 w-24 rounded-full bg-fuchsia-400/10 blur-2xl" />
        </div>
        <SyntaxHighlighter
          language={language}
          customStyle={{
            margin: 0,
            background: "transparent",
            padding: "16px",
            fontSize: "12.5px",
            lineHeight: "1.65",
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace"
          }}
          codeTagProps={{ style: { fontFamily: "inherit" } }}
        >
          {clean}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
