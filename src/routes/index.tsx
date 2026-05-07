import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  component: Index,
});

const C = {
  bg: "#050A14",
  bg2: "#0A1224",
  text: "#E2E8F0",
  text2: "#8B9CB8",
  text3: "#4A5568",
  gold: "#C9A55C",
  goldHover: "#D4B56A",
  amber: "#D97706",
  border: "#1A2744",
  green: "#065F46",
  greenCheck: "#10B981",
  err: "#EF4444",
};

const serif = { fontFamily: "'Instrument Serif', serif" };
const sans = { fontFamily: "'Inter', sans-serif" };

function Fade({ delay = 0, children, duration = 600 }: { delay?: number; children: React.ReactNode; duration?: number }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div style={{ opacity: show ? 1 : 0, transition: `opacity ${duration}ms ease-out` }}>
      {children}
    </div>
  );
}

function Section1({ onScrollDown }: { onScrollDown: () => void }) {
  return (
    <section
      style={{ backgroundColor: C.bg, minHeight: "100vh", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 24px" }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          width: 600, height: 600, borderRadius: "50%",
          background: `radial-gradient(circle, ${C.gold} 0%, transparent 70%)`,
          opacity: 0.03, pointerEvents: "none",
        }}
      />
      <div style={{ maxWidth: 640, textAlign: "center", position: "relative", zIndex: 1 }}>
        <Fade delay={100}>
          <h1 style={{ ...serif, color: C.text, fontSize: "clamp(2.2rem, 6vw, 3.5rem)", lineHeight: 1.15, margin: 0 }}>
            You sit on a board.
          </h1>
        </Fade>
        <Fade delay={400}>
          <p style={{ ...sans, color: C.text2, fontSize: "1.15rem", lineHeight: 1.8, marginTop: "2rem" }}>
            You're now personally liable for cybersecurity under NIS2. For digital resilience under DORA. Next: AI governance under the EU AI Act.
          </p>
        </Fade>
        <Fade delay={700}>
          <p style={{ ...sans, color: C.text2, fontSize: "1.15rem", lineHeight: 1.8, marginTop: "1.5rem" }}>
            European regulation doesn't just demand oversight. It demands competence. You are required to train, to understand, and to evidence that understanding.{" "}
            <span style={{ color: C.text }}>Not your CISO. Not your DPO. You.</span>
          </p>
        </Fade>
      </div>
      <button
        onClick={onScrollDown}
        aria-label="Scroll down"
        style={{
          position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
          background: "transparent", border: "none", cursor: "pointer", color: C.text2,
          animation: "bgPulse 2s ease-in-out infinite",
        }}
      >
        <ChevronDown size={28} />
      </button>
      <style>{`@keyframes bgPulse { 0%,100% { transform: translate(-50%, 0); opacity: 0.6 } 50% { transform: translate(-50%, 8px); opacity: 1 } }`}</style>
    </section>
  );
}

type Choice = "next_slide" | "stay" | null;

function Section2({ choice, setChoice }: { choice: Choice; setChoice: (c: Choice) => void }) {
  const items = [
    "99.2% system uptime across all critical infrastructure",
    "Zero critical incidents reported this quarter",
    "All regulatory requirements met",
    "Annual penetration test completed — no critical findings",
    "Staff cybersecurity training completion: 94%",
  ];

  const flags = [
    { t: "'All regulatory requirements met'", b: "Which requirements? Which regulation? Who verified this? NIS2 alone has 18 categories of security measures under Article 21. 'Met' is not evidence." },
    { t: "'Staff training completion: 94%'", b: "6% untrained means potentially hundreds of employees. Who are they? Are any of them in critical roles? Under NIS2, the management body itself must undergo training. Has it?" },
    { t: "'Zero critical incidents'", b: "What is classified as critical? Who decides the threshold? A near-miss reclassified as 'major' instead of 'critical' disappears from this slide entirely." },
  ];

  const intro = choice === "next_slide"
    ? "You moved on. So does every board. Here's what was in that slide."
    : "Good. Here's what's worth staying for.";

  return (
    <section id="sim" style={{ backgroundColor: C.bg2, padding: "120px 24px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <p style={{ ...serif, color: C.text, fontSize: "1.3rem", textAlign: "center", margin: 0 }}>
          Your next board meeting. The pack just arrived.
        </p>
        <p style={{ ...sans, color: C.text3, fontSize: "0.72rem", letterSpacing: "0.18em", textTransform: "uppercase", textAlign: "center", marginTop: "2rem" }}>
          Slide 14 of 22
        </p>
        <div
          style={{
            backgroundColor: C.border,
            border: `1px solid ${C.border}`,
            borderTop: `1px solid ${C.gold}`,
            maxWidth: 680,
            margin: "1.5rem auto 0",
            padding: "2rem",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            ...sans,
          }}
        >
          <div style={{ color: C.text, fontWeight: 700, fontSize: "1.1rem" }}>
            Cybersecurity Status Update — Q2 2026
          </div>
          <hr style={{ border: 0, borderTop: `1px solid ${C.bg2}`, margin: "1rem 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: C.text2 }}>Overall Status</span>
            <span style={{ backgroundColor: C.green, color: "#fff", padding: "0.25rem 0.75rem", borderRadius: 4, fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.05em" }}>
              GREEN
            </span>
          </div>
          <div style={{ marginTop: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {items.map((it, i) => (
              <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", color: C.text2 }}>
                <Check size={18} color={C.greenCheck} style={{ flexShrink: 0, marginTop: 2 }} />
                <span>{it}</span>
              </div>
            ))}
          </div>
          <hr style={{ border: 0, borderTop: `1px solid ${C.bg2}`, margin: "1.25rem 0 0.75rem" }} />
          <div style={{ color: C.text3, fontStyle: "italic", fontSize: "0.85rem" }}>
            Prepared by the Information Security team. For board information.
          </div>
        </div>

        {choice === null ? (
          <div className="sim-buttons" style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "2rem", flexWrap: "wrap" }}>
            <SimButton onClick={() => setChoice("next_slide")}>Next slide</SimButton>
            <SimButton onClick={() => setChoice("stay")}>Can we stay on this one?</SimButton>
          </div>
        ) : (
          <div style={{ marginTop: "2rem" }}>
            <Fade delay={300}>
              <p style={{ ...sans, color: C.text2, fontStyle: "italic", textAlign: "center" }}>{intro}</p>
            </Fade>
            {flags.map((f, i) => (
              <Fade key={i} delay={700 + i * 300}>
                <div style={{
                  backgroundColor: C.bg, borderLeft: `3px solid ${C.amber}`,
                  padding: "1.25rem 1.5rem", maxWidth: 680, margin: "1rem auto 0",
                }}>
                  <div style={{ ...sans, color: C.text, fontWeight: 700 }}>{f.t}</div>
                  <div style={{ ...sans, color: C.text2, marginTop: "0.5rem", lineHeight: 1.7 }}>{f.b}</div>
                </div>
              </Fade>
            ))}
            <Fade delay={700 + flags.length * 300 + 600}>
              <p style={{ ...sans, color: C.text2, textAlign: "center", marginTop: "2.5rem", maxWidth: 640, marginLeft: "auto", marginRight: "auto", lineHeight: 1.8 }}>
                Every board pack has slides like this. Knowing which questions to ask is the difference between governance and rubber-stamping.
              </p>
            </Fade>
          </div>
        )}
      </div>
      <style>{`
        .sim-btn { background: transparent; border: 1px solid ${C.border}; color: ${C.text2}; padding: 0.75rem 2rem; font-family: 'Inter', sans-serif; cursor: pointer; transition: border-color 200ms, color 200ms; }
        .sim-btn:hover { border-color: ${C.gold}; color: ${C.text}; }
        @media (max-width: 480px) {
          .sim-buttons { flex-direction: column; }
          .sim-btn { width: 100%; }
        }
      `}</style>
    </section>
  );
}

function SimButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return <button className="sim-btn" onClick={onClick}>{children}</button>;
}

function Section3() {
  return (
    <section style={{ backgroundColor: C.bg, padding: "120px 24px" }}>
      <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
        <p style={{ ...serif, color: C.text, fontSize: "1.5rem", lineHeight: 1.4, margin: 0 }}>
          We're building the tools that prepare you for slide 14 — and the other 21.
        </p>
        <p style={{ ...sans, color: C.text2, fontSize: "1.15rem", lineHeight: 1.8, marginTop: "2rem", textAlign: "left" }}>
          Built on the regulations that hold you accountable. Shaped by practitioners in cybersecurity, AI, and digital resilience. Not a generalist chatbot — a specialist, grounded in the legislation, frameworks, and obligations that apply to you.
        </p>
        <p style={{ ...serif, color: C.text, fontSize: "1.3rem", lineHeight: 1.5, marginTop: "2rem" }}>
          For board members who know what they don't know — and refuse to leave it that way.
        </p>
        <hr style={{ border: 0, borderTop: `1px solid ${C.border}`, maxWidth: 200, margin: "2rem auto 0" }} />
      </div>
    </section>
  );
}

function Section4({ choice }: { choice: Choice }) {
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

    setSubmitting(true);
    setSubmitErr(null);
    const { error } = await supabase.from("early_access").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role || null,
      organisation: form.organisation.trim() || null,
      board_sim_choice: choice,
    });
    setSubmitting(false);
    if (error) {
      setSubmitErr("Something went wrong. Please try again.");
    } else {
      setDone(true);
    }
  }

  const labelStyle: React.CSSProperties = { ...sans, color: C.text2, fontSize: "0.85rem", display: "block", marginBottom: "0.4rem" };
  const inputStyle: React.CSSProperties = {
    ...sans,
    width: "100%",
    backgroundColor: C.bg,
    border: `1px solid ${C.border}`,
    color: C.text,
    borderRadius: 4,
    padding: "0.75rem 1rem",
    fontSize: "1rem",
    outline: "none",
    transition: "border-color 200ms",
  };

  return (
    <section style={{ backgroundColor: C.bg2, padding: "120px 24px" }}>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        {done ? (
          <p style={{ ...serif, color: C.text, fontSize: "1.5rem", textAlign: "center" }}>
            Thank you. We'll be in touch.
          </p>
        ) : (
          <>
            <h2 style={{ ...serif, color: C.text, fontSize: "2rem", textAlign: "center", margin: 0 }}>
              Request early access
            </h2>
            <p style={{ ...sans, color: C.text2, textAlign: "center", marginTop: "1rem", lineHeight: 1.7 }}>
              We'll reach out when the next tools are ready for early testing.
            </p>
            <form onSubmit={onSubmit} style={{ marginTop: "2.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }} noValidate>
              <div>
                <label style={labelStyle} htmlFor="name">Name</label>
                <input id="name" style={inputStyle} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  onFocus={(e) => (e.currentTarget.style.borderColor = C.gold)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = C.border)} />
                {errors.name && <div style={{ ...sans, color: C.err, fontSize: "0.85rem", marginTop: "0.4rem" }}>{errors.name}</div>}
              </div>
              <div>
                <label style={labelStyle} htmlFor="email">Email</label>
                <input id="email" type="email" style={inputStyle} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  onFocus={(e) => (e.currentTarget.style.borderColor = C.gold)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = C.border)} />
                {errors.email && <div style={{ ...sans, color: C.err, fontSize: "0.85rem", marginTop: "0.4rem" }}>{errors.email}</div>}
              </div>
              <div>
                <label style={labelStyle} htmlFor="role">Role</label>
                <select id="role" style={inputStyle} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                  onFocus={(e) => (e.currentTarget.style.borderColor = C.gold)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = C.border)}>
                  <option value="">Select your role</option>
                  <option>Board Member</option>
                  <option>Board Chair</option>
                  <option>Audit Committee Member</option>
                  <option>Risk Committee Member</option>
                  <option>C-Suite Executive</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label style={labelStyle} htmlFor="organisation">Organisation</label>
                <input id="organisation" style={inputStyle} value={form.organisation} onChange={(e) => setForm({ ...form, organisation: e.target.value })}
                  onFocus={(e) => (e.currentTarget.style.borderColor = C.gold)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = C.border)} />
              </div>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  ...sans,
                  backgroundColor: C.gold,
                  color: C.bg,
                  border: "none",
                  fontWeight: 700,
                  width: "100%",
                  padding: "0.875rem",
                  borderRadius: 4,
                  cursor: submitting ? "wait" : "pointer",
                  fontSize: "1rem",
                  transition: "background-color 200ms",
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = C.goldHover)}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = C.gold)}
              >
                {submitting ? "Submitting…" : "Request Access"}
              </button>
              {submitErr && <div style={{ ...sans, color: C.err, fontSize: "0.9rem", textAlign: "center" }}>{submitErr}</div>}
            </form>
          </>
        )}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ backgroundColor: C.bg, padding: "32px 24px", textAlign: "center" }}>
      <p style={{ ...sans, color: C.text3, fontSize: "0.85rem", margin: 0 }}>© 2025 FracTEx</p>
    </footer>
  );
}

function Index() {
  const [choice, setChoice] = useState<Choice>(null);
  const simRef = useRef<HTMLDivElement>(null);

  const scrollToSim = () => {
    document.getElementById("sim")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main style={{ backgroundColor: C.bg, minHeight: "100vh" }} ref={simRef}>
      <Section1 onScrollDown={scrollToSim} />
      <Section2 choice={choice} setChoice={setChoice} />
      <Section3 />
      <Section4 choice={choice} />
      <Footer />
    </main>
  );
}
