import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowDown, AlertTriangle, Check, Palette } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  component: Index,
});

/* ---------- Themes ---------- */

type ThemeKey = "noir" | "emerald" | "indigo" | "paper";

type Theme = {
  name: string;
  bg: string;
  bg2: string;
  surface: string;
  text: string;
  text2: string;
  text3: string;
  accent: string;
  accentSoft: string;
  warn: string;
  border: string;
  ok: string;
  okBadge: string;
  err: string;
  isLight: boolean;
};

const THEMES: Record<ThemeKey, Theme> = {
  noir: {
    name: "Noir & Gold",
    bg: "#0A0A0A", bg2: "#121212", surface: "#1A1A1A",
    text: "#F4EFE6", text2: "#A89F8E", text3: "#5A5447",
    accent: "#C9A84C", accentSoft: "rgba(201,168,76,0.12)",
    warn: "#E0A53A", border: "rgba(201,168,76,0.18)",
    ok: "#3F8A6B", okBadge: "#3F8A6B", err: "#E06363", isLight: false,
  },
  emerald: {
    name: "Emerald Prestige",
    bg: "#04231A", bg2: "#06302A", surface: "#0A3A33",
    text: "#F5F0E0", text2: "#9CB5A8", text3: "#4A6B60",
    accent: "#C9A84C", accentSoft: "rgba(201,168,76,0.14)",
    warn: "#E0A53A", border: "rgba(201,168,76,0.22)",
    ok: "#0D7A5F", okBadge: "#0D7A5F", err: "#E06363", isLight: false,
  },
  indigo: {
    name: "Midnight Indigo",
    bg: "#0A0A1A", bg2: "#10102A", surface: "#16183C",
    text: "#E6E8FF", text2: "#9095C4", text3: "#4A4F7A",
    accent: "#7C7CFF", accentSoft: "rgba(124,124,255,0.14)",
    warn: "#F0A858", border: "rgba(124,124,255,0.22)",
    ok: "#3D7A8F", okBadge: "#3D7A8F", err: "#FF6B7A", isLight: false,
  },
  paper: {
    name: "Paper & Ink",
    bg: "#F5F3EE", bg2: "#EDEAE2", surface: "#FFFFFF",
    text: "#0D0D0D", text2: "#5C564A", text3: "#9C9588",
    accent: "#8B1E1E", accentSoft: "rgba(139,30,30,0.08)",
    warn: "#B8651A", border: "rgba(13,13,13,0.14)",
    ok: "#2F6B4F", okBadge: "#2F6B4F", err: "#A12020", isLight: true,
  },
};

const THEME_ORDER: ThemeKey[] = ["noir", "emerald", "indigo", "paper"];

/* ---------- Fonts ---------- */

const serif: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif" };
const sans: React.CSSProperties = { fontFamily: "'Karla', sans-serif" };

/* ---------- Grain SVG (data URI, low opacity) ---------- */

const GRAIN_URL =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

/* ---------- Reveal on scroll ---------- */

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.setAttribute("data-revealed", "true");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ---------- Decorative numeral ---------- */

function Numeral({ n, t }: { n: string; t: Theme }) {
  return (
    <div
      aria-hidden
      style={{
        ...serif,
        fontSize: "clamp(7rem, 18vw, 14rem)",
        lineHeight: 0.8,
        fontStyle: "italic",
        fontWeight: 400,
        color: t.accent,
        opacity: 0.16,
        letterSpacing: "-0.04em",
        userSelect: "none",
        pointerEvents: "none",
      }}
    >
      {n}
    </div>
  );
}

/* ---------- Theme switcher ---------- */

function ThemeSwitcher({
  themeKey, setTheme, t,
}: { themeKey: ThemeKey; setTheme: (k: ThemeKey) => void; t: Theme }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "fixed", top: 20, right: 20, zIndex: 50 }}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Change colour scheme"
        style={{
          ...sans,
          display: "flex", alignItems: "center", gap: 8,
          background: t.surface, color: t.text,
          border: `1px solid ${t.border}`,
          padding: "8px 14px", borderRadius: 999,
          cursor: "pointer", fontSize: "0.8rem", letterSpacing: "0.04em",
          backdropFilter: "blur(8px)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
        }}
      >
        <Palette size={14} color={t.accent} />
        {t.name}
      </button>
      {open && (
        <div
          style={{
            marginTop: 8, background: t.surface, border: `1px solid ${t.border}`,
            borderRadius: 12, padding: 6, display: "flex", flexDirection: "column",
            minWidth: 200, boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
          }}
        >
          {THEME_ORDER.map((k) => {
            const th = THEMES[k];
            const active = k === themeKey;
            return (
              <button
                key={k}
                onClick={() => { setTheme(k); setOpen(false); }}
                style={{
                  ...sans,
                  display: "flex", alignItems: "center", gap: 10,
                  background: active ? t.accentSoft : "transparent",
                  color: t.text, border: "none", textAlign: "left",
                  padding: "8px 10px", borderRadius: 8, cursor: "pointer",
                  fontSize: "0.85rem",
                }}
              >
                <span style={{
                  width: 14, height: 14, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${th.bg} 0 50%, ${th.accent} 50% 100%)`,
                  border: `1px solid ${th.border}`,
                }} />
                {th.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ---------- Grain overlay ---------- */

function Grain({ light }: { light: boolean }) {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        backgroundImage: GRAIN_URL,
        opacity: light ? 0.18 : 0.10,
        mixBlendMode: light ? "multiply" : "overlay",
        zIndex: 1,
      }}
    />
  );
}

/* ---------- Sections ---------- */

function Hero({ t, onScroll }: { t: Theme; onScroll: () => void }) {
  return (
    <section
      style={{
        position: "relative", minHeight: "100vh", padding: "80px 24px",
        display: "flex", alignItems: "center", overflow: "hidden",
      }}
    >
      {/* gold glow */}
      <div aria-hidden style={{
        position: "absolute", top: "30%", left: "60%",
        width: 900, height: 900, borderRadius: "50%",
        background: `radial-gradient(circle, ${t.accent} 0%, transparent 65%)`,
        opacity: t.isLight ? 0.10 : 0.07,
        filter: "blur(40px)", pointerEvents: "none",
        animation: "drift 18s ease-in-out infinite",
      }} />
      {/* hairline grid */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `linear-gradient(${t.border} 1px, transparent 1px), linear-gradient(90deg, ${t.border} 1px, transparent 1px)`,
        backgroundSize: "120px 120px",
        opacity: 0.35,
        maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
      }} />

      <div style={{
        position: "relative", zIndex: 2,
        maxWidth: 1200, margin: "0 auto", width: "100%",
        display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.5rem",
      }}>
        <div style={{ gridColumn: "1 / span 1", display: "flex", alignItems: "flex-start" }}>
          <span style={{
            ...sans, fontSize: "0.7rem", letterSpacing: "0.3em",
            textTransform: "uppercase", color: t.text3,
            writingMode: "vertical-rl", transform: "rotate(180deg)",
          }}>Early Access · MMXXVI</span>
        </div>

        <div style={{ gridColumn: "2 / span 9" }}>
          <div data-reveal className="rv">
            <span style={{
              ...sans, fontSize: "0.75rem", letterSpacing: "0.32em",
              textTransform: "uppercase", color: t.accent,
            }}>For board members · NIS2 · DORA · EU AI Act</span>
          </div>

          <h1 data-reveal className="rv" style={{
            ...serif, color: t.text, margin: "1.5rem 0 0",
            fontSize: "clamp(3rem, 8.5vw, 7.5rem)", lineHeight: 0.95,
            fontWeight: 400, letterSpacing: "-0.02em",
          }}>
            You sit on<br />
            <span style={{ fontStyle: "italic", color: t.accent }}>a board.</span>
          </h1>

          <div style={{
            marginTop: "3rem",
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem",
          }} className="hero-paras">
            <p data-reveal className="rv" style={{
              ...sans, color: t.text2, fontSize: "1.05rem",
              lineHeight: 1.75, margin: 0,
              borderLeft: `2px solid ${t.accent}`, paddingLeft: "1.25rem",
            }}>
              You're now personally liable for cybersecurity under NIS2.
              For digital resilience under DORA. Next: AI governance under
              the EU AI Act.
            </p>
            <p data-reveal className="rv" style={{
              ...sans, color: t.text2, fontSize: "1.05rem",
              lineHeight: 1.75, margin: 0,
            }}>
              European regulation doesn't just demand oversight. It demands
              competence. You are required to train, to understand, and to
              evidence that understanding.{" "}
              <em style={{ ...serif, color: t.text, fontStyle: "italic", fontSize: "1.2rem" }}>
                Not your CISO. Not your DPO. You.
              </em>
            </p>
          </div>
        </div>

        <div style={{ gridColumn: "12 / span 1" }} />
      </div>

      <button
        onClick={onScroll} aria-label="Continue"
        style={{
          position: "absolute", bottom: 40, left: "50%",
          transform: "translateX(-50%)", background: "transparent",
          border: `1px solid ${t.border}`, color: t.text2,
          width: 48, height: 48, borderRadius: "50%",
          cursor: "pointer", display: "flex", alignItems: "center",
          justifyContent: "center", zIndex: 3,
          animation: "bob 2.4s ease-in-out infinite",
        }}
      >
        <ArrowDown size={18} />
      </button>

      <style>{`
        @keyframes drift { 0%,100% { transform: translate(0,0) } 50% { transform: translate(-40px, 30px) } }
        @keyframes bob { 0%,100% { transform: translate(-50%, 0) } 50% { transform: translate(-50%, 6px) } }
        .rv { opacity: 0; transform: translateY(24px); transition: opacity 900ms ease, transform 900ms cubic-bezier(.2,.7,.2,1); }
        .rv[data-revealed="true"] { opacity: 1; transform: none; }
        [data-reveal]:nth-child(2) { transition-delay: 120ms; }
        [data-reveal]:nth-child(3) { transition-delay: 240ms; }
        @media (max-width: 720px) {
          .hero-paras { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

type Choice = "next_slide" | "stay" | null;

function BoardSim({ t, choice, setChoice }: { t: Theme; choice: Choice; setChoice: (c: Choice) => void }) {
  const items = [
    "99.2% system uptime across all critical infrastructure",
    "Zero critical incidents reported this quarter",
    "All regulatory requirements met",
    "Annual penetration test completed — no critical findings",
    "Staff cybersecurity training completion: 94%",
  ];
  const flags = [
    { t: "All regulatory requirements met", b: "Which requirements? Which regulation? Who verified this? NIS2 alone has 18 categories of security measures under Article 21. \"Met\" is not evidence." },
    { t: "Staff training completion: 94%", b: "6% untrained means potentially hundreds of employees. Who are they? Are any of them in critical roles? Under NIS2, the management body itself must undergo training. Has it?" },
    { t: "Zero critical incidents", b: "What is classified as critical? Who decides the threshold? A near-miss reclassified as \"major\" instead of \"critical\" disappears from this slide entirely." },
  ];
  const intro = choice === "next_slide"
    ? "You moved on. So does every board. Here's what was in that slide."
    : "Good. Here's what's worth staying for.";

  return (
    <section id="sim" style={{
      position: "relative", background: t.bg2, padding: "140px 24px",
      borderTop: `1px solid ${t.border}`, overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 60, left: 24, zIndex: 1,
      }}>
        <Numeral n="01" t={t} />
      </div>

      <div style={{
        position: "relative", zIndex: 2,
        maxWidth: 1200, margin: "0 auto",
        display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "2rem",
      }}>
        <div style={{ gridColumn: "1 / span 12" }} data-reveal className="rv">
          <p style={{
            ...sans, color: t.accent, fontSize: "0.7rem",
            letterSpacing: "0.3em", textTransform: "uppercase", margin: 0,
          }}>The simulation</p>
          <h2 style={{
            ...serif, color: t.text, fontSize: "clamp(2rem, 5vw, 3.5rem)",
            lineHeight: 1.05, fontWeight: 400, margin: "1rem 0 0",
            maxWidth: 780, letterSpacing: "-0.01em",
          }}>
            Your next board meeting. <em style={{ color: t.accent }}>The pack just arrived.</em>
          </h2>
        </div>

        {/* The slide card — offset, magazine layout */}
        <div style={{ gridColumn: "2 / span 8" }} data-reveal className="rv">
          <div style={{
            ...sans, position: "relative",
            background: t.surface,
            border: `1px solid ${t.border}`,
            borderRadius: 4,
            boxShadow: t.isLight
              ? "0 30px 60px -20px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.05)"
              : "0 30px 80px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.02) inset",
            overflow: "hidden",
          }}>
            <div style={{ height: 4, background: `linear-gradient(90deg, ${t.accent}, transparent)` }} />
            <div style={{ padding: "2rem 2.25rem" }}>
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "baseline",
                paddingBottom: "0.85rem", borderBottom: `1px solid ${t.border}`,
              }}>
                <div style={{ color: t.text, fontWeight: 600, fontSize: "1.05rem" }}>
                  Cybersecurity Status Update — Q2 2026
                </div>
                <div style={{ ...sans, color: t.text3, fontSize: "0.7rem", letterSpacing: "0.18em", textTransform: "uppercase" }}>
                  Slide 14 / 22
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.25rem" }}>
                <span style={{ color: t.text2, fontSize: "0.95rem" }}>Overall Status</span>
                <span style={{
                  background: t.okBadge, color: "#fff",
                  padding: "0.3rem 0.85rem", borderRadius: 2,
                  fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em",
                }}>GREEN</span>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: "1.5rem 0 0", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                {items.map((it, i) => (
                  <li key={i} style={{ display: "flex", gap: "0.85rem", alignItems: "flex-start", color: t.text2, fontSize: "0.95rem" }}>
                    <Check size={16} color={t.ok} style={{ flexShrink: 0, marginTop: 4 }} />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
              <div style={{
                marginTop: "1.5rem", paddingTop: "1rem",
                borderTop: `1px solid ${t.border}`,
                color: t.text3, fontStyle: "italic", fontSize: "0.82rem",
              }}>
                Prepared by the Information Security team. For board information.
              </div>
            </div>
          </div>
        </div>

        {/* Question + buttons, offset right */}
        <div style={{ gridColumn: "9 / span 4", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {choice === null ? (
            <div data-reveal className="rv">
              <p style={{ ...serif, fontStyle: "italic", color: t.text, fontSize: "1.6rem", lineHeight: 1.3, margin: 0 }}>
                What do you do?
              </p>
              <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <SimButton t={t} primary onClick={() => setChoice("next_slide")}>Next slide →</SimButton>
                <SimButton t={t} onClick={() => setChoice("stay")}>Can we stay on this one?</SimButton>
              </div>
            </div>
          ) : (
            <div data-reveal className="rv">
              <p style={{ ...serif, fontStyle: "italic", color: t.accent, fontSize: "1.4rem", lineHeight: 1.4, margin: 0 }}>
                {intro}
              </p>
            </div>
          )}
        </div>

        {/* Flags */}
        {choice !== null && (
          <div style={{ gridColumn: "2 / span 10", marginTop: "2rem", display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.25rem" }}>
            {flags.map((f, i) => (
              <div
                key={i}
                data-reveal
                className="rv"
                style={{
                  gridColumn: i === 0 ? "1 / span 7" : i === 1 ? "6 / span 7" : "3 / span 8",
                  position: "relative",
                  background: t.surface,
                  border: `1px solid ${t.border}`,
                  borderRadius: 4,
                  padding: "1.5rem 1.75rem 1.5rem 3.5rem",
                  boxShadow: t.isLight ? "0 8px 30px -10px rgba(0,0,0,0.12)" : "0 8px 40px -10px rgba(0,0,0,0.6)",
                }}
              >
                <div style={{
                  position: "absolute", top: 18, left: 18,
                  width: 28, height: 28, borderRadius: "50%",
                  background: t.accentSoft, color: t.warn,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: `1px solid ${t.border}`,
                }}>
                  <AlertTriangle size={14} />
                </div>
                <div style={{ ...sans, color: t.text3, fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                  Red flag · 0{i + 1}
                </div>
                <div style={{ ...serif, color: t.text, fontSize: "1.35rem", fontStyle: "italic", margin: "0.4rem 0 0.75rem", lineHeight: 1.3 }}>
                  "{f.t}"
                </div>
                <div style={{ ...sans, color: t.text2, fontSize: "0.95rem", lineHeight: 1.7 }}>{f.b}</div>
              </div>
            ))}

            <p data-reveal className="rv" style={{
              gridColumn: "2 / span 10", ...serif, color: t.text,
              fontSize: "clamp(1.4rem, 2.6vw, 2rem)", fontStyle: "italic", lineHeight: 1.4,
              textAlign: "center", margin: "3rem auto 0", maxWidth: 760, fontWeight: 400,
            }}>
              Every board pack has slides like this. Knowing which questions to ask is
              the difference between <span style={{ color: t.accent }}>governance</span> and{" "}
              <span style={{ textDecoration: "line-through", color: t.text3 }}>rubber-stamping</span>.
            </p>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          #sim .rv[style*="gridColumn: \\"2 / span 8\\""] { grid-column: 1 / -1 !important; }
        }
      `}</style>
    </section>
  );
}

function SimButton({ children, onClick, t, primary }: { children: React.ReactNode; onClick: () => void; t: Theme; primary?: boolean }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...sans, cursor: "pointer", textAlign: "left",
        padding: "0.85rem 1.25rem", borderRadius: 2,
        fontSize: "0.95rem", letterSpacing: "0.02em",
        background: primary ? (hover ? t.accent : t.accentSoft) : "transparent",
        color: primary ? (hover ? t.bg : t.text) : (hover ? t.accent : t.text2),
        border: `1px solid ${primary ? t.accent : t.border}`,
        transition: "all 200ms ease",
      }}
    >
      {children}
    </button>
  );
}

function Manifesto({ t }: { t: Theme }) {
  return (
    <section style={{ position: "relative", padding: "160px 24px", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 60, right: "8%", zIndex: 1 }}>
        <Numeral n="02" t={t} />
      </div>
      <div style={{
        position: "relative", zIndex: 2,
        maxWidth: 1200, margin: "0 auto",
        display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "2rem",
      }}>
        <div style={{ gridColumn: "1 / span 5" }} data-reveal className="rv">
          <p style={{ ...sans, color: t.accent, fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase", margin: 0 }}>
            What we're building
          </p>
          <h2 style={{
            ...serif, color: t.text, fontSize: "clamp(2rem, 4.5vw, 3.4rem)",
            lineHeight: 1.05, fontWeight: 400, margin: "1.25rem 0 0",
            letterSpacing: "-0.01em",
          }}>
            Tools for <em style={{ color: t.accent }}>slide 14</em> —<br />and the other 21.
          </h2>
        </div>

        <div style={{ gridColumn: "7 / span 6", display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          <p data-reveal className="rv" style={{
            ...sans, color: t.text2, fontSize: "1.1rem", lineHeight: 1.8, margin: 0,
          }}>
            Built on the regulations that hold you accountable. Shaped by practitioners
            in cybersecurity, AI, and digital resilience.
          </p>
          <p data-reveal className="rv" style={{
            ...sans, color: t.text2, fontSize: "1.1rem", lineHeight: 1.8, margin: 0,
          }}>
            Not a generalist chatbot — a <span style={{ color: t.text, fontWeight: 600 }}>specialist</span>,
            grounded in the legislation, frameworks, and obligations that apply to you.
          </p>
          <div data-reveal className="rv" style={{
            ...serif, color: t.text, fontSize: "clamp(1.4rem, 2.4vw, 1.9rem)",
            fontStyle: "italic", lineHeight: 1.35, fontWeight: 400,
            paddingTop: "1.5rem", borderTop: `1px solid ${t.border}`,
          }}>
            For board members who know what they don't know
            — <span style={{ color: t.accent }}>and refuse to leave it that way.</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function AccessForm({ t, choice }: { t: Theme; choice: Choice }) {
  const [form, setForm] = useState({ name: "", email: "", role: "", organisation: "" });
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [submitErr, setSubmitErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!form.name.trim()) errs.name = "Please enter your name.";
    if (!form.email.trim()) errs.email = "Please enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Please enter a valid email.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSubmitting(true); setSubmitErr(null);
    const { error } = await supabase.from("early_access").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role || null,
      organisation: form.organisation.trim() || null,
      board_sim_choice: choice,
    });
    setSubmitting(false);
    if (error) setSubmitErr("Something went wrong. Please try again.");
    else setDone(true);
  }

  const inputBase: React.CSSProperties = {
    ...sans, width: "100%",
    background: "transparent",
    border: "none",
    borderBottom: `1px solid ${t.border}`,
    color: t.text,
    padding: "0.75rem 0",
    fontSize: "1rem", outline: "none",
    transition: "border-color 250ms",
  };
  const labelStyle: React.CSSProperties = {
    ...sans, color: t.text3, fontSize: "0.7rem",
    letterSpacing: "0.22em", textTransform: "uppercase",
    display: "block", marginBottom: "0.4rem",
  };

  return (
    <section style={{
      position: "relative", background: t.bg2, padding: "160px 24px",
      borderTop: `1px solid ${t.border}`, overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 60, left: "8%", zIndex: 1 }}>
        <Numeral n="03" t={t} />
      </div>
      <div style={{
        position: "relative", zIndex: 2,
        maxWidth: 1100, margin: "0 auto",
        display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "3rem",
      }}>
        <div style={{ gridColumn: "1 / span 5" }} data-reveal className="rv">
          <p style={{ ...sans, color: t.accent, fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase", margin: 0 }}>
            The invitation
          </p>
          <h2 style={{
            ...serif, color: t.text, fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
            lineHeight: 1.02, fontWeight: 400, margin: "1.25rem 0 1.5rem",
            letterSpacing: "-0.01em",
          }}>
            Request <em style={{ color: t.accent }}>early access.</em>
          </h2>
          <p style={{ ...sans, color: t.text2, fontSize: "1rem", lineHeight: 1.8, margin: 0 }}>
            We'll reach out when the next tools are ready for early testing.
            No marketing list. No noise.
          </p>
        </div>

        <div style={{ gridColumn: "7 / span 6" }} data-reveal className="rv">
          {done ? (
            <div style={{
              border: `1px solid ${t.border}`, padding: "3rem 2rem",
              textAlign: "center", borderRadius: 4, background: t.surface,
            }}>
              <p style={{ ...serif, color: t.text, fontSize: "1.8rem", fontStyle: "italic", margin: 0 }}>
                Thank you.
              </p>
              <p style={{ ...sans, color: t.text2, marginTop: "0.75rem" }}>
                We'll be in touch.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
              <div>
                <label htmlFor="name" style={labelStyle}>Name</label>
                <input id="name" style={inputBase} value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  onFocus={(e) => (e.currentTarget.style.borderBottomColor = t.accent)}
                  onBlur={(e) => (e.currentTarget.style.borderBottomColor = t.border)} />
                {errors.name && <div style={{ ...sans, color: t.err, fontSize: "0.8rem", marginTop: "0.4rem" }}>{errors.name}</div>}
              </div>
              <div>
                <label htmlFor="email" style={labelStyle}>Email</label>
                <input id="email" type="email" style={inputBase} value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  onFocus={(e) => (e.currentTarget.style.borderBottomColor = t.accent)}
                  onBlur={(e) => (e.currentTarget.style.borderBottomColor = t.border)} />
                {errors.email && <div style={{ ...sans, color: t.err, fontSize: "0.8rem", marginTop: "0.4rem" }}>{errors.email}</div>}
              </div>
              <div>
                <label htmlFor="role" style={labelStyle}>Role</label>
                <select id="role" style={{ ...inputBase, appearance: "none" }} value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  onFocus={(e) => (e.currentTarget.style.borderBottomColor = t.accent)}
                  onBlur={(e) => (e.currentTarget.style.borderBottomColor = t.border)}>
                  <option value="" style={{ background: t.surface, color: t.text }}>Select your role</option>
                  {["Board Member", "Board Chair", "Audit Committee Member", "Risk Committee Member", "C-Suite Executive", "Other"].map(r => (
                    <option key={r} style={{ background: t.surface, color: t.text }}>{r}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="organisation" style={labelStyle}>Organisation</label>
                <input id="organisation" style={inputBase} value={form.organisation}
                  onChange={(e) => setForm({ ...form, organisation: e.target.value })}
                  onFocus={(e) => (e.currentTarget.style.borderBottomColor = t.accent)}
                  onBlur={(e) => (e.currentTarget.style.borderBottomColor = t.border)} />
              </div>
              <button
                type="submit" disabled={submitting}
                style={{
                  ...sans, marginTop: "0.5rem",
                  background: t.accent, color: t.isLight ? "#fff" : t.bg,
                  border: "none", padding: "1.1rem 1.5rem",
                  fontSize: "0.85rem", letterSpacing: "0.22em",
                  textTransform: "uppercase", fontWeight: 700,
                  borderRadius: 2, cursor: submitting ? "wait" : "pointer",
                  transition: "transform 200ms, opacity 200ms",
                }}
                onMouseOver={(e) => (e.currentTarget.style.opacity = "0.9")}
                onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
              >
                {submitting ? "Submitting…" : "Request access →"}
              </button>
              {submitErr && <div style={{ ...sans, color: t.err, fontSize: "0.9rem" }}>{submitErr}</div>}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Footer({ t }: { t: Theme }) {
  return (
    <footer style={{ background: t.bg, padding: "40px 24px", textAlign: "center", borderTop: `1px solid ${t.border}` }}>
      <p style={{ ...sans, color: t.text3, fontSize: "0.8rem", margin: 0, letterSpacing: "0.15em" }}>
        © 2025 FRACTEX
      </p>
    </footer>
  );
}

/* ---------- Page ---------- */

function Index() {
  const [themeKey, setThemeKey] = useState<ThemeKey>("noir");
  const [choice, setChoice] = useState<Choice>(null);
  useReveal();

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("theme") as ThemeKey | null : null;
    if (saved && THEMES[saved]) setThemeKey(saved);
  }, []);

  const setTheme = (k: ThemeKey) => {
    setThemeKey(k);
    try { window.localStorage.setItem("theme", k); } catch {}
  };

  const t = THEMES[themeKey];
  const scrollToSim = () => document.getElementById("sim")?.scrollIntoView({ behavior: "smooth" });

  return (
    <main style={{ background: t.bg, color: t.text, minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <Grain light={t.isLight} />
      <ThemeSwitcher themeKey={themeKey} setTheme={setTheme} t={t} />
      <div style={{ position: "relative", zIndex: 2 }}>
        <Hero t={t} onScroll={scrollToSim} />
        <BoardSim t={t} choice={choice} setChoice={setChoice} />
        <Manifesto t={t} />
        <AccessForm t={t} choice={choice} />
        <Footer t={t} />
      </div>
    </main>
  );
}