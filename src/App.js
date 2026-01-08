import React, { useMemo, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Braces,
  Cpu,
  Gauge,
  Layers,
  MoveRight,
  Sparkles,
  Wand2
} from "lucide-react";

import Particles from "./components/Particles.jsx";
import Button from "./components/Button.jsx";
import Badge from "./components/Badge.jsx";
import Section from "./components/Section.jsx";
import CodeBlock from "./components/CodeBlock.jsx";
import { cn } from "./lib/cn.js";
import { useScrollProgress } from "./lib/useScrollProgress.js";

const NAV = [
  { id: "about", label: "About" },
  { id: "features", label: "Features" },
  { id: "snippets", label: "Snippets" },
  { id: "roadmap", label: "Roadmap" },
  { id: "faq", label: "FAQ" }
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.2, 0.8, 0.2, 1] } }
};

function useActiveSection() {
  const [active, setActive] = useState("about");

  React.useEffect(() => {
    const ids = NAV.map((n) => n.id);
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];
        if (vis?.target?.id) setActive(vis.target.id);
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: [0.12, 0.2, 0.35] }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return active;
}

function GlowBlob({ className, style }) {
  return (
    <div
      className={cn("blob absolute rounded-full", className)}
      style={style}
      aria-hidden="true"
    />
  );
}

function Stat({ label, value, icon: Icon }) {
  return (
    <div className="grad-border rounded-3xl bg-white/5 p-5 shadow-glow">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/5 border border-white/10">
          <Icon className="h-5 w-5 text-white/80" />
        </div>
        <div>
          <div className="text-2xl font-semibold tracking-tight">{value}</div>
          <div className="text-sm text-white/60">{label}</div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <div className="group grad-border rounded-3xl bg-white/5 p-6 shadow-soft transition-transform duration-300 hover:-translate-y-1">
      <div className="flex items-start gap-4">
        <div className="relative">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/6 border border-white/10">
            <Icon className="h-6 w-6 text-white/85" />
          </div>
          <div className="absolute -inset-3 -z-10 rounded-3xl bg-[radial-gradient(circle_at_30%_20%,rgba(34,211,238,.22),transparent_60%),radial-gradient(circle_at_70%_80%,rgba(167,139,250,.18),transparent_60%)] opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />
        </div>
        <div>
          <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-white/65">{desc}</p>
        </div>
      </div>
      <div className="mt-5 h-px w-full bg-white/10" />
      <div className="mt-4 flex items-center justify-between text-sm text-white/70">
        <span className="inline-flex items-center gap-2">
          <BadgeCheck className="h-4 w-4" />
          Production-ready
        </span>
        <MoveRight className="h-4 w-4 opacity-70 transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </div>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="grad-border rounded-3xl bg-white/5">
      <button
        onClick={() => setOpen((s) => !s)}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
        aria-expanded={open}
      >
        <div className="text-sm font-semibold tracking-tight md:text-base">{q}</div>
        <div className={cn("text-white/70 transition-transform", open ? "rotate-45" : "rotate-0")}>
          <span className="text-2xl leading-none">+</span>
        </div>
      </button>
      <div className={cn("grid transition-[grid-template-rows] duration-300", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
        <div className="overflow-hidden">
          <div className="px-6 pb-6 text-sm leading-relaxed text-white/65">{a}</div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const active = useActiveSection();

  // Scroll progress (thin top bar)
  const p = useScrollProgress();

  // Hero parallax with framer scroll
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 600], [0, 60]);
  const y2 = useTransform(scrollY, [0, 600], [0, 120]);
  const blur = useTransform(scrollY, [0, 600], [0, 8]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0.55]);
  const springY1 = useSpring(y1, { stiffness: 120, damping: 22 });
  const springY2 = useSpring(y2, { stiffness: 110, damping: 22 });

  const snippets = useMemo(
    () => [
      {
        title: "Quickstart",
        language: "bash",
        code: `npm install
npm run dev`
      },
      {
        title: "Animated card pattern",
        language: "jsx",
        code: `import { motion } from "framer-motion";

export function GlowCard({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.35 }}
      className="grad-border rounded-3xl bg-white/5 p-6 shadow-soft"
    >
      {children}
    </motion.div>
  );
}`
      },
      {
        title: "Particles (no deps)",
        language: "jsx",
        code: `// See src/components/Particles.jsx
// Canvas particles that react to cursor + respects reduced motion.`
      }
    ],
    []
  );

  const [snippetIdx, setSnippetIdx] = useState(0);

  return (
    <div className="relative min-h-screen bg-black">
      {/* Top progress bar */}
      <div className="fixed left-0 top-0 z-[60] h-[2px] w-full bg-white/5">
        <div
          className="h-full bg-[linear-gradient(90deg,rgba(34,211,238,.9),rgba(167,139,250,.9),rgba(251,113,133,.9))]"
          style={{ width: `${p * 100}%` }}
        />
      </div>

      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(1100px_600px_at_50%_0%,rgba(167,139,250,.18),transparent_65%),radial-gradient(900px_500px_at_15%_15%,rgba(34,211,238,.16),transparent_60%),radial-gradient(900px_500px_at_85%_25%,rgba(251,113,133,.10),transparent_60%)]" />
        <div className="absolute inset-0 bg-noise opacity-70 mix-blend-overlay" />
      </div>

      {/* Navbar */}
      <header className="fixed left-0 right-0 top-0 z-50">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mt-4 flex items-center justify-between rounded-3xl border border-white/10 bg-black/35 px-4 py-3 backdrop-blur-xl">
            <a href="#top" className="group flex items-center gap-3">
              <div className="relative grid h-9 w-9 place-items-center rounded-2xl border border-white/10 bg-white/5">
                <Sparkles className="h-5 w-5 text-white/80" />
                <span className="pointer-events-none absolute -inset-2 rounded-3xl bg-[radial-gradient(circle_at_30%_20%,rgba(34,211,238,.22),transparent_60%),radial-gradient(circle_at_70%_80%,rgba(167,139,250,.18),transparent_60%)] opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-100" />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold tracking-tight">Axiom Initiative</div>
                <div className="text-xs text-white/55">Reactive landing template</div>
              </div>
            </a>

            <nav className="hidden items-center gap-1 md:flex">
              {NAV.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={cn(
                    "rounded-2xl px-3 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white",
                    active === item.id && "bg-white/8 text-white"
                  )}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <Button
                as="a"
                href="#snippets"
                size="sm"
                variant="ghost"
                className="hidden md:inline-flex"
              >
                View snippets
                <Braces className="h-4 w-4 opacity-80" />
              </Button>
              <Button as="a" href="#contact" size="sm" className="font-semibold">
                Get started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <main id="top" className="relative pt-28">
        <div className="relative mx-auto max-w-6xl px-5">
          <div className="relative overflow-hidden rounded-[2.2rem] border border-white/10 bg-white/5 shadow-soft">
            <Particles className="absolute inset-0 h-full w-full opacity-70" />

            <GlowBlob className="left-[-10%] top-[-20%] h-[420px] w-[420px] bg-cyan-400/25" />
            <GlowBlob className="right-[-10%] top-[-15%] h-[420px] w-[420px] bg-fuchsia-400/20" />
            <GlowBlob className="left-[20%] bottom-[-30%] h-[420px] w-[420px] bg-rose-400/18" />

            <div className="relative px-6 py-14 md:px-12 md:py-20">
              <motion.div style={{ y: springY1, opacity }} className="mx-auto max-w-3xl text-center">
                <Badge>New • no backend • deploy anywhere</Badge>

                <motion.h1
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  className="mt-6 font-display text-4xl font-semibold tracking-tight md:text-6xl"
                >
                  A landing experience that feels
                  <span className="relative mx-2 inline-block">
                    <span className="bg-[linear-gradient(90deg,#22d3ee,#a78bfa,#fb7185)] bg-clip-text text-transparent">
                      alive
                    </span>
                    <span className="pointer-events-none absolute -inset-x-6 -bottom-2 h-[2px] bg-[linear-gradient(90deg,transparent,rgba(34,211,238,.7),rgba(167,139,250,.7),rgba(251,113,133,.7),transparent)] opacity-80" />
                  </span>
                  .
                </motion.h1>

                <p className="mt-5 text-base leading-relaxed text-white/70 md:text-lg">
                  A jaw-dropping, ultra-reactive UI/UX starter you can customize in minutes.
                  It’s built for scroll delight, instant feedback, and “wow” moments—without any backend.
                </p>

                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Button as="a" href="#features" size="lg" className="w-full sm:w-auto">
                    Explore the experience
                    <Wand2 className="h-4 w-4" />
                  </Button>
                  <Button as="a" href="#snippets" size="lg" variant="ghost" className="w-full sm:w-auto">
                    Copy the snippets
                    <Braces className="h-4 w-4 opacity-80" />
                  </Button>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Stat label="Scroll reminder" value="Silky" icon={Gauge} />
                  <Stat label="Interactions" value="Fluid" icon={Layers} />
                  <Stat label="Bundle" value="Light" icon={Cpu} />
                </div>
              </motion.div>

              {/* A “device” preview mock */}
              <motion.div style={{ y: springY2, filter: blur.to((b) => `blur(${b}px)`) }} className="mx-auto mt-10 max-w-5xl">
                <div className="grad-border overflow-hidden rounded-3xl bg-black/50">
                  <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-300/70" />
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-300/70" />
                      <span className="ml-2 text-xs text-white/60">axiom-ui-preview</span>
                    </div>
                    <span className="text-xs text-white/50">v0.1 • responsive</span>
                  </div>

                  <div className="grid gap-4 p-5 md:grid-cols-12">
                    <div className="md:col-span-5">
                      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                        <div className="text-xs text-white/60">Command palette</div>
                        <div className="mt-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/80">
                          Type to search… <span className="text-white/40">(⌘K)</span>
                        </div>
                        <div className="mt-4 space-y-2">
                          {["Open roadmap", "Copy snippet", "Jump to FAQ"].map((t) => (
                            <div key={t} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75">
                              <span>{t}</span>
                              <span className="text-xs text-white/45">Enter</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="md:col-span-7">
                      <div className="grid gap-4 md:grid-cols-2">
                        {[
                          { t: "Delightful hover", d: "Micro-interactions everywhere." },
                          { t: "Radial glow", d: "Gradient borders + depth." },
                          { t: "Scroll progress", d: "Always oriented." },
                          { t: "Copy-first", d: "Snippets built-in." }
                        ].map((x) => (
                          <div key={x.t} className="group rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-1">
                            <div className="text-sm font-semibold">{x.t}</div>
                            <div className="mt-2 text-sm text-white/65">{x.d}</div>
                            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                              <div className="h-full w-1/2 animate-shimmer bg-[linear-gradient(90deg,transparent,rgba(34,211,238,.6),rgba(167,139,250,.6),transparent)]" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,.65))]" />
            </div>
          </div>
        </div>

        {/* ABOUT */}
        <Section
          id="about"
          eyebrow="The Axiom Initiative"
          title="Build trust with design that moves."
          desc="This template focuses on clarity, motion, and conversion—so the first impression lands and the details keep people exploring."
        >
          <div className="grid gap-5 md:grid-cols-12">
            <div className="md:col-span-7">
              <div className="grad-border rounded-3xl bg-white/5 p-7 shadow-soft">
                <h3 className="text-xl font-semibold tracking-tight">What you get</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/65 md:text-base">
                  A single-page, high-end landing experience with a premium feel:
                  animated hero, interactive particles, responsive sections, code snippet showcase,
                  smooth scroll, and rich micro-interactions.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[
                    { t: "No backend", d: "Static deploy to GitHub Pages, Vercel, Netlify." },
                    { t: "Extremely reactive", d: "Cursor-aware particles and motion." },
                    { t: "Fast to customize", d: "Centralized content + clean components." },
                    { t: "Accessible", d: "Reduced-motion support + focus states." }
                  ].map((x) => (
                    <div key={x.t} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                      <div className="text-sm font-semibold">{x.t}</div>
                      <div className="mt-1 text-sm text-white/65">{x.d}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:col-span-5">
              <div className="grad-border h-full rounded-3xl bg-white/5 p-7 shadow-soft">
                <h3 className="text-xl font-semibold tracking-tight">Design system vibe</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/65">
                  Gradient borders, glass panels, deep shadows, and high-contrast typography.
                  It’s “tech” without being cold.
                </p>
                <div className="mt-6 space-y-3">
                  {[
                    "Buttons with depth + glow",
                    "Cards that lift and breathe",
                    "Scroll progress + scroll-mt anchors",
                    "Snippet copy UX built-in"
                  ].map((t) => (
                    <div key={t} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75">
                      <span className="h-2 w-2 rounded-full bg-[linear-gradient(90deg,#22d3ee,#a78bfa,#fb7185)]" />
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* FEATURES */}
        <Section
          id="features"
          eyebrow="God-level UI/UX"
          title="Micro-interactions that feel expensive."
          desc="These are the details that make people say “wait… this is just a static site?”"
        >
          <div className="grid gap-5 md:grid-cols-3">
            <FeatureCard
              icon={Sparkles}
              title="Reactive background"
              desc="Particles that respond to your cursor with subtle gradients and connections."
            />
            <FeatureCard
              icon={Gauge}
              title="Scroll delight"
              desc="Parallax hero layers, progress bar, and intersection-aware navigation."
            />
            <FeatureCard
              icon={Braces}
              title="Snippet-first"
              desc="Code blocks with copy UX, tabs, and ready-made patterns for reuse."
            />
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-12">
            <div className="md:col-span-8">
              <div className="grad-border rounded-3xl bg-white/5 p-7 shadow-soft">
                <h3 className="text-xl font-semibold tracking-tight">Conversion-ready sections</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/65 md:text-base">
                  You can keep it as a landing page or expand into multi-page later.
                  Everything is laid out to make edits painless.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {["Hero", "About", "Features", "Snippets", "Roadmap", "FAQ", "Contact"].map((t) => (
                    <span key={t} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="md:col-span-4">
              <div className="grad-border rounded-3xl bg-white/5 p-7 shadow-soft">
                <h3 className="text-xl font-semibold tracking-tight">No backend</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/65">
                  Contact is a mailto button by default. You can wire a form service later (Formspree, etc.)
                  without changing the UI.
                </p>
                <div className="mt-6">
                  <Button as="a" href="#contact" variant="ghost" className="w-full">
                    Jump to contact
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* SNIPPETS */}
        <Section
          id="snippets"
          eyebrow="Copy & ship"
          title="Snippets that match the aesthetic."
          desc="Swap the copy, adjust the palette, and deploy. The patterns are designed to be reused across pages."
        >
          <div className="grid gap-5 md:grid-cols-12">
            <div className="md:col-span-4">
              <div className="grad-border rounded-3xl bg-white/5 p-5 shadow-soft">
                <div className="text-sm font-semibold">Snippet library</div>
                <p className="mt-2 text-sm text-white/65">Click to open—copy button included.</p>

                <div className="mt-4 space-y-2">
                  {snippets.map((s, idx) => (
                    <button
                      key={s.title}
                      onClick={() => setSnippetIdx(idx)}
                      className={cn(
                        "w-full rounded-2xl border border-white/10 px-4 py-3 text-left text-sm transition",
                        idx === snippetIdx ? "bg-white/10" : "bg-white/5 hover:bg-white/8"
                      )}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-medium text-white/80">{s.title}</span>
                        <span className="text-xs text-white/50">{s.language}</span>
                      </div>
                      <div className="mt-1 text-xs text-white/55">Tap to open</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5 grad-border rounded-3xl bg-white/5 p-5 shadow-soft">
                <div className="text-sm font-semibold">Deploy notes</div>
                <p className="mt-2 text-sm text-white/65">
                  Build outputs into <span className="font-mono text-white/80">dist/</span>.
                  Host anywhere static.
                </p>
                <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-xs text-white/70">
                  GitHub Pages: use actions or a <span className="font-mono">gh-pages</span> branch.
                </div>
              </div>
            </div>

            <div className="md:col-span-8">
              <CodeBlock
                title={snippets[snippetIdx].title}
                language={snippets[snippetIdx].language}
                code={snippets[snippetIdx].code}
              />
            </div>
          </div>
        </Section>

        {/* ROADMAP */}
        <Section
          id="roadmap"
          eyebrow="Simple narrative"
          title="A roadmap people actually read."
          desc="Tell the story in a way that’s easy to scan—then let motion do the rest."
        >
          <div className="grid gap-5 md:grid-cols-12">
            <div className="md:col-span-7">
              <div className="space-y-4">
                {[
                  { phase: "Phase 01", title: "Foundation", desc: "Identity, mission, and crisp positioning. Make it instantly legible." },
                  { phase: "Phase 02", title: "Experience", desc: "Micro-interactions + high-end layout. Build trust through polish." },
                  { phase: "Phase 03", title: "Scale", desc: "Split into pages, add blog, add form service, wire analytics." }
                ].map((x) => (
                  <motion.div
                    key={x.phase}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.45 }}
                    className="grad-border rounded-3xl bg-white/5 p-6 shadow-soft"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-xs font-semibold text-white/60">{x.phase}</div>
                      <div className="text-xs text-white/45">milestone</div>
                    </div>
                    <div className="mt-2 text-lg font-semibold tracking-tight">{x.title}</div>
                    <div className="mt-2 text-sm leading-relaxed text-white/65">{x.desc}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="md:col-span-5">
              <div className="grad-border rounded-3xl bg-white/5 p-7 shadow-soft">
                <h3 className="text-xl font-semibold tracking-tight">Make it yours</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/65">
                  Replace “Axiom Initiative” with your brand, drop in your sections,
                  and tweak gradients in <span className="font-mono text-white/80">src/styles.css</span>.
                </p>
                <div className="mt-6 rounded-3xl border border-white/10 bg-black/30 p-5">
                  <div className="text-xs text-white/55">Palette idea</div>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {[
                      "bg-cyan-400/30",
                      "bg-violet-400/30",
                      "bg-rose-400/30"
                    ].map((c) => (
                      <div key={c} className={cn("h-10 rounded-2xl border border-white/10", c)} />
                    ))}
                  </div>
                </div>
                <div className="mt-6">
                  <Button as="a" href="#contact" className="w-full">
                    Launch checklist
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* FAQ */}
        <Section
          id="faq"
          eyebrow="Questions"
          title="FAQ that doesn’t feel boring."
          desc="Expandable items with smooth height transitions and clean typography."
        >
          <div className="mx-auto max-w-3xl space-y-4">
            <FAQItem
              q="Can I deploy this on GitHub Pages?"
              a="Yes. It’s a static Vite build. Run npm run build and deploy the dist folder using GitHub Actions or a gh-pages branch."
            />
            <FAQItem
              q="How do I change the colors?"
              a="Edit gradients in src/styles.css and the Tailwind classes in components. Search for 'linear-gradient' and 'bg-[radial-gradient'."
            />
            <FAQItem
              q="Is there any backend?"
              a="No backend included. The contact section uses a mailto button. You can add a form service later without changing the UI."
            />
          </div>
        </Section>

        {/* CONTACT */}
        <Section
          id="contact"
          eyebrow="Ship it"
          title="Ready to go live?"
          desc="Replace this copy with your CTA and route the button to your email or a form service."
          className="pb-28"
        >
          <div className="mx-auto max-w-4xl">
            <div className="grad-border overflow-hidden rounded-3xl bg-white/5 shadow-soft">
              <div className="relative p-8 md:p-10">
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-cyan-400/14 blur-3xl" />
                  <div className="absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-fuchsia-400/12 blur-3xl" />
                </div>

                <div className="relative grid gap-6 md:grid-cols-12">
                  <div className="md:col-span-7">
                    <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">
                      Make a jaw-dropping first impression.
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/65 md:text-base">
                      If you want, tell me your brand name, sections, and copy—I'll tailor this into your exact content
                      and add extra “wow” moments (command palette, light/dark toggle, animated diagrams).
                    </p>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <Button
                        as="a"
                        href="mailto:hello@example.com?subject=Axiom%20Initiative%20Website"
                        size="lg"
                        className="w-full sm:w-auto"
                      >
                        Email us
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                      <Button as="a" href="#snippets" size="lg" variant="ghost" className="w-full sm:w-auto">
                        Copy snippets
                        <Braces className="h-4 w-4 opacity-80" />
                      </Button>
                    </div>
                  </div>

                  <div className="md:col-span-5">
                    <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
                      <div className="text-sm font-semibold">Launch checklist</div>
                      <div className="mt-4 space-y-3 text-sm text-white/70">
                        {[
                          "Update text + brand name",
                          "Swap favicon + OG tags",
                          "Run npm run build",
                          "Deploy dist/ anywhere"
                        ].map((t) => (
                          <div key={t} className="flex items-center gap-3">
                            <span className="h-2 w-2 rounded-full bg-[linear-gradient(90deg,#22d3ee,#a78bfa,#fb7185)]" />
                            <span>{t}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/65">
                        Tip: change <span className="font-mono text-white/80">hello@example.com</span> to your email in <span className="font-mono text-white/80">src/App.jsx</span>.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Footer */}
        <footer className="border-t border-white/10 bg-black/40">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-10 md:flex-row">
            <div className="text-sm text-white/60">
              © {new Date().getFullYear()} Axiom Initiative • Built with React + Vite
            </div>
            <div className="flex items-center gap-2 text-sm">
              {NAV.map((n) => (
                <a key={n.id} href={`#${n.id}`} className="rounded-xl px-3 py-2 text-white/60 hover:bg-white/5 hover:text-white">
                  {n.label}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
