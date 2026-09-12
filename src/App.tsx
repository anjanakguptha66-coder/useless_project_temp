import { useState, useEffect, useRef, useCallback } from "react";

// ── Screen types ──────────────────────────────────────────────────────────────
type Screen =
  | "intro" | "ready" | "number" | "sure"
  | "catchgame" | "donotpress" | "circle"
  | "memorygame" | "trust" | "loading" | "final" | "escaped";

// ── Malayalam speech bubble ───────────────────────────────────────────────────
function MalBubble({ text, right = false, delay = 0 }: { text: string; right?: boolean; delay?: number }) {
  const [vis, setVis] = useState(delay === 0);
  useEffect(() => {
    if (delay > 0) { const t = setTimeout(() => setVis(true), delay); return () => clearTimeout(t); }
  }, [delay]);
  if (!vis) return null;
  return (
    <div className={`mal-bubble${right ? " right" : ""}`} style={{ opacity: 0, animationFillMode: "forwards" }}>
      {text}
    </div>
  );
}

// ── Floating emoji burst ──────────────────────────────────────────────────────
function FloatEmoji({ emojis, trigger }: { emojis: string[]; trigger: boolean }) {
  if (!trigger) return null;
  return (
    <div style={{ position: "relative", height: 0, overflow: "visible" }}>
      {emojis.map((e, i) => (
        <span
          key={i}
          className="float-emoji"
          style={{ left: `${20 + i * 28}%`, animationDelay: `${i * 0.12}s` }}
        >
          {e}
        </span>
      ))}
    </div>
  );
}

// ── Confetti ──────────────────────────────────────────────────────────────────
const COLORS = ["#8b5cf6", "#3b82f6", "#a78bfa", "#f472b6", "#facc15", "#34d399"];
function Confetti() {
  const pieces = Array.from({ length: 90 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 3 + Math.random() * 4,
    color: COLORS[i % COLORS.length],
    size: 6 + Math.random() * 10,
  }));
  return (
    <>
      {pieces.map((p) => (
        <div key={p.id} className="confetti-piece" style={{
          left: `${p.left}%`,
          animationDelay: `${p.delay}s`,
          animationDuration: `${p.duration}s`,
          backgroundColor: p.color,
          width: p.size,
          height: p.size,
        }} />
      ))}
    </>
  );
}

// ── Hypnotic spiral ───────────────────────────────────────────────────────────
function HypnoticSpiral({ size = 260 }: { size?: number }) {
  return (
    <div className="relative flex items-center justify-center animate-spiral-pulse" style={{ width: size, height: size }}>
      {Array.from({ length: 7 }, (_, i) => {
        const s = size - i * (size / 7 / 1.1);
        const op = 0.15 + (i / 7) * 0.7;
        const color = i % 2 === 0 ? "rgba(139,92,246," : "rgba(59,130,246,";
        return (
          <div key={i} className={i % 2 === 0 ? "animate-spin-slow" : "animate-spin-reverse"} style={{
            position: "absolute", width: s, height: s, borderRadius: "50%",
            border: `${i === 0 ? 3 : 2}px solid ${color}${op})`,
            boxShadow: `0 0 ${8 + i * 4}px ${color}${op * 0.6})`,
          }} />
        );
      })}
      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "radial-gradient(circle,#8b5cf6,#3b82f6)", boxShadow: "0 0 24px rgba(139,92,246,0.8)" }} />
    </div>
  );
}

// ── Rotating circle ────────────────────────────────────────────────────────────
function RotatingCircle() {
  return (
    <div className="flex items-center justify-center my-4">
      <div className="relative" style={{ width: 120, height: 120 }}>
        <div className="animate-spin-slow" style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "3px solid transparent", borderTopColor: "#8b5cf6", borderRightColor: "#3b82f6" }} />
        <div className="animate-spin-reverse" style={{ position: "absolute", inset: 12, borderRadius: "50%", border: "2px solid transparent", borderBottomColor: "#a78bfa", borderLeftColor: "#60a5fa" }} />
        <div style={{ position: "absolute", inset: 28, borderRadius: "50%", background: "radial-gradient(circle,rgba(139,92,246,0.3),transparent)", animation: "pulse-glow 2s ease-in-out infinite" }} />
      </div>
    </div>
  );
}

// ── Loading screen with Malayalam messages ─────────────────────────────────────
const LOADING_MSGS = [
  { en: "Scanning neural pathways...", mal: "നിന്റെ choices ഒക്കെ പരിശോധിച്ചുകൊണ്ടിരിക്കുകയാണ്..." },
  { en: "Processing your responses...", mal: "ഇത്രയും strange decisions ഞങ്ങൾ ആദ്യമായിട്ടാണ് കാണുന്നത് 😭" },
  { en: "Calibrating experiment data...", mal: "നിന്റെ തലയിൽ ഒന്നും ഇല്ലേ? 🤣" },
  { en: "System analysis: 99%... 😶", mal: "ഏതോ ഒരു result വരാൻ പോകുന്നു 👀" },
  { en: "404 — Preparing final output...", mal: "ശരി... ഇനി തിരിച്ചുപോകാൻ വൈകി 👀" },
];

function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [idx, setIdx] = useState(0);
  const [vis, setVis] = useState(true);
  const [showMal, setShowMal] = useState(false);

  useEffect(() => {
    if (idx >= LOADING_MSGS.length) { const t = setTimeout(onDone, 600); return () => clearTimeout(t); }
    const t = setTimeout(() => {
      setVis(false);
      setShowMal(false);
      setTimeout(() => { setIdx((i) => i + 1); setVis(true); setShowMal(true); }, 350);
    }, 1100);
    return () => clearTimeout(t);
  }, [idx, onDone]);

  const msg = LOADING_MSGS[Math.min(idx, LOADING_MSGS.length - 1)];

  return (
    <div className="screen-enter flex flex-col items-center justify-center gap-6 px-6">
      <HypnoticSpiral size={160} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%" }}>
        {idx < LOADING_MSGS.length && (
          <>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(0.85rem,2.5vw,1rem)", color: "#a78bfa", letterSpacing: "0.05em", transition: "opacity 0.35s", opacity: vis ? 1 : 0, margin: 0, textAlign: "center" }}>
              {msg.en}
            </p>
            {showMal && msg.mal !== msg.en && (
              <p style={{ fontFamily: "'Noto Sans Malayalam', 'Noto Sans', sans-serif", fontSize: "clamp(1rem,3.5vw,1.1rem)", lineHeight: 1.9, color: "#c4b5fd", opacity: vis ? 1 : 0, transition: "opacity 0.35s", margin: 0, animation: "slide-left 0.4s ease-out", textAlign: "center", whiteSpace: "normal", overflowWrap: "break-word", overflow: "visible", height: "auto" }}>
                {msg.mal}
              </p>
            )}
          </>
        )}
      </div>
      <div><span className="dot" /><span className="dot" /><span className="dot" /></div>
      <p style={{ fontFamily: "'Noto Sans Malayalam', 'Noto Sans', sans-serif", color: "rgba(100,116,139,0.5)", fontSize: "clamp(0.9rem,3vw,1rem)", lineHeight: 1.9, overflow: "visible", height: "auto" }}>
        404 — Analysis in progress...
      </p>
    </div>
  );
}

// ── Mini-game 1: Catch the Button ──────────────────────────────────────────────
function CatchGame({ onDone, onClick }: { onDone: () => void; onClick: () => void }) {
  const [attempts, setAttempts] = useState(0);
  const [caught, setCaught] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [showMsg, setShowMsg] = useState(false);
  const MAX = 5;

  useEffect(() => {
    if (caught) onClick();
  }, [caught]);

  const runAway = () => {
    const nx = 10 + Math.random() * 70;
    const ny = 10 + Math.random() * 70;
    setPos({ x: nx, y: ny });
    setAttempts((a) => {
      const next = a + 1;
      if (next >= MAX) { setCaught(true); setShowMsg(true); }
      return next;
    });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div style={{ fontSize: "2rem" }}>🏃</div>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(0.95rem,3.5vw,1.2rem)", color: "#e2e8f0", margin: 0, textAlign: "center" }}>
        Click the button to continue!
      </h2>
      <div className="mal-bubble" style={{ animationFillMode: "forwards" }}>
        ഇത് ഒരു simple button... click ചെയ്യ്! 😏
      </div>

      <div style={{ position: "relative", width: "100%", height: 180, background: "rgba(139,92,246,0.05)", borderRadius: 16, border: "1px solid rgba(139,92,246,0.2)", overflow: "hidden" }}>
        {!caught ? (
          <button
            className="btn-primary"
            onMouseEnter={runAway}
            onClick={runAway}
            style={{
              position: "absolute",
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: "translate(-50%,-50%)",
              padding: "10px 20px",
              fontSize: "0.85rem",
              transition: "left 0.25s cubic-bezier(.34,1.56,.64,1), top 0.25s cubic-bezier(.34,1.56,.64,1)",
              whiteSpace: "nowrap",
            }}
          >
            CLICK ME →
          </button>
        ) : (
          <div className="animate-pop-in" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: "2rem" }}>😤</div>
            <p style={{ fontFamily: "'Noto Sans Malayalam','Noto Sans',sans-serif", color: "#34d399", fontSize: "clamp(1rem,3.5vw,1.1rem)", lineHeight: 1.9, margin: 0, textAlign: "center", overflowWrap: "break-word", overflow: "visible", height: "auto" }}>
              ശരി ശരി... ഇതാ button. Happy now? 😂
            </p>
          </div>
        )}
      </div>

      {attempts > 0 && !caught && (
        <p style={{ fontFamily: "'Noto Sans Malayalam','Noto Sans',sans-serif", color: "#f472b6", fontSize: "clamp(1rem,3.5vw,1.1rem)", lineHeight: 1.9, animation: "pop-in 0.4s ease", overflowWrap: "break-word", overflow: "visible", height: "auto", margin: 0 }}>
          {attempts === 1 ? "Ayyo... missed! Try again 😂" :
           attempts === 2 ? "ഇത്ര കഷ്ടമോ? 🤣" :
           attempts === 3 ? "നിന്റെ reflexes... hmm 😬" :
           "ഒന്നുകൂടി try ചെയ്യ്!"}
        </p>
      )}

      {caught && (
        <button className="btn-primary animate-pop-in" style={{ padding: "13px 40px", fontSize: "0.9rem" }} onClick={() => { onClick(); onDone(); }}>
          CONTINUE →
        </button>
      )}
    </div>
  );
}

// ── Mini-game 2: Emoji Memory ──────────────────────────────────────────────────
const EMOJI_SETS = [
  { show: ["🍕", "🚀", "👻", "🦄"], odd: "🐔" },
  { show: ["⚡", "🎸", "🌮", "🦊"], odd: "🍦" },
  { show: ["🎃", "🤖", "🌈", "🔥"], odd: "🦋" },
];

function MemoryGame({ onDone, onClick }: { onDone: () => void; onClick: () => void }) {
  const set = EMOJI_SETS[Math.floor(Math.random() * EMOJI_SETS.length)];
  const [phase, setPhase] = useState<"show" | "countdown" | "pick" | "result">("show");
  const [countdown, setCountdown] = useState(3);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [countKey, setCountKey] = useState(0);

  // shuffled options for picking phase
  const options = useRef([...set.show, set.odd].sort(() => Math.random() - 0.5));

  useEffect(() => {
    if (phase !== "show") return;
    const t = setTimeout(() => setPhase("countdown"), 2200);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "countdown") return;
    if (countdown === 0) { setPhase("pick"); return; }
    const t = setTimeout(() => { setCountdown((c) => c - 1); setCountKey((k) => k + 1); }, 700);
    return () => clearTimeout(t);
  }, [phase, countdown]);

  const pick = (emoji: string) => {
    if (phase !== "pick") return;
    const correct = emoji === set.odd;
    setResult(correct ? "correct" : "wrong");
    setPhase("result");
    onClick();
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <div style={{ fontSize: "1.8rem" }}>🧠</div>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(0.95rem,3.5vw,1.2rem)", color: "#e2e8f0", margin: 0, textAlign: "center" }}>
        Memory Check!
      </h2>

      {phase === "show" && (
        <div className="flex flex-col items-center gap-3">
          <div className="mal-bubble" style={{ animationFillMode: "forwards" }}>
            ഈ 4 emojis ഓർത്തുവെക്കൂ... 2 seconds മാത്രം! 😤
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
            {set.show.map((e, i) => (
              <div key={e} className="game-card memory-reveal" style={{ animationDelay: `${i * 0.1}s`, fontSize: "2rem", textAlign: "center" }}>
                {e}
              </div>
            ))}
          </div>
          <p style={{ color: "rgba(148,163,184,0.5)", fontSize: "0.75rem" }}>Memorize these 4 emojis!</p>
        </div>
      )}

      {phase === "countdown" && (
        <div className="flex flex-col items-center gap-3">
          <p style={{ fontFamily: "'Noto Sans Malayalam','Noto Sans',sans-serif", color: "#f472b6", fontSize: "clamp(1rem,3.5vw,1.1rem)", lineHeight: 1.9, margin: 0, overflowWrap: "break-word", overflow: "visible", height: "auto" }}>
            ഇനി pick ചെയ്യേണ്ടത് ഏതാണ്...
          </p>
          <div key={countKey} className="animate-countdown" style={{ fontFamily: "var(--font-display)", fontSize: "4rem", color: "#a78bfa" }}>
            {countdown}
          </div>
        </div>
      )}

      {phase === "pick" && (
        <div className="flex flex-col items-center gap-4 screen-enter">
          <p style={{ color: "#e2e8f0", fontSize: "0.9rem", margin: 0 }}>Which one was <strong style={{ color: "#f472b6" }}>NOT</strong> in the list?</p>
          <div className="mal-bubble" style={{ animationFillMode: "forwards" }}>
            ഏത് emoji ഇല്ലായിരുന്നു? 🤔 Carefully...
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, width: "100%" }}>
            {options.current.map((e) => (
              <button key={e} className="game-card" onClick={() => pick(e)} style={{ fontSize: "2rem", textAlign: "center", padding: "16px 8px" }}>
                {e}
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === "result" && (
        <div className="flex flex-col items-center gap-4 screen-enter">
          <div style={{ fontSize: "3rem" }}>{result === "correct" ? "🎉" : "😂"}</div>
          <div style={{
            background: result === "correct" ? "rgba(52,211,153,0.1)" : "rgba(220,38,38,0.1)",
            border: `1px solid ${result === "correct" ? "rgba(52,211,153,0.3)" : "rgba(220,38,38,0.3)"}`,
            borderRadius: 14, padding: "14px 20px", textAlign: "center",
          }}>
            {result === "correct" ? (
              <p style={{ fontFamily: "'Noto Sans Malayalam','Noto Sans',sans-serif", color: "#6ee7b7", fontSize: "clamp(1rem,3.5vw,1.1rem)", lineHeight: 1.9, margin: 0, overflowWrap: "break-word", overflow: "visible", height: "auto" }}>
                ശരി! 🎉 Memory ഉള്ള ആളാണ്! (ഇത്തവണ മാത്രം)
              </p>
            ) : (
              <p style={{ fontFamily: "'Noto Sans Malayalam','Noto Sans',sans-serif", color: "#fca5a5", fontSize: "clamp(1rem,3.5vw,1.1rem)", lineHeight: 1.9, margin: 0, overflowWrap: "break-word", overflow: "visible", height: "auto" }}>
                Wrong! 😂 {set.odd} was the odd one. ഓർമ്മ ഇല്ലേ? 🤣
              </p>
            )}
          </div>
          <button className="btn-primary animate-pop-in" style={{ padding: "13px 40px", fontSize: "0.9rem" }} onClick={onDone}>
            CONTINUE →
          </button>
        </div>
      )}
    </div>
  );
}

// ── Dramatic final reveal sequence ───────────────────────────────────────────
const REVEAL_STEPS = [
  { type: "title",   content: "404",                           delay: 0 },
  { type: "system",  content: "SYSTEM ANALYSIS COMPLETE ✓",   delay: 1400 },
  { type: "error",   content: "PURPOSE NOT FOUND...",          delay: 2700 },
  { type: "punch",   content: "A COMPLETELY USELESS EXPERIMENT 😂", delay: 4200 },
  { type: "mal1",    content: "അങ്ങനെ സത്യം പുറത്തുവന്നു. 😂",   delay: 5600 },
  { type: "mal2",    content: "ഇത്രയും നേരം നിങ്ങൾ ഒരു വലിയ experiment ആണെന്ന് കരുതി.",  delay: 6600 },
  { type: "mal3",    content: "പക്ഷേ...",                        delay: 7600 },
  { type: "mal4",    content: "ഇതിനൊന്നും ഒരു പ്രത്യേക പ്രയോജനവും ഉണ്ടായിരുന്നില്ല. 😂", delay: 8400 },
  { type: "rest",    content: "",                               delay: 9600 },
];

function FinalReveal({ clicks, questions, onEscape }: { clicks: number; questions: number; onEscape: () => void }) {
  const [visibleUntil, setVisibleUntil] = useState(-1);

  useEffect(() => {
    const timers = REVEAL_STEPS.map((s, i) =>
      setTimeout(() => setVisibleUntil(i), s.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const visible = (i: number) => visibleUntil >= i;
  const malFont = "'Noto Sans Malayalam', 'Noto Sans', sans-serif";

  return (
    <div className="flex flex-col items-center gap-4" style={{ width: "100%" }}>
      <HypnoticSpiral size={150} />

      {/* Step 0: 404 */}
      {visible(0) && (
        <h1 className="animate-fade-in-up" style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(3rem, 12vw, 5.5rem)",
          fontWeight: 900,
          background: "linear-gradient(135deg, #a78bfa, #60a5fa)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "0.15em",
          lineHeight: 1,
          margin: 0,
        }}>404</h1>
      )}

      {/* Step 1: SYSTEM ANALYSIS COMPLETE */}
      {visible(1) && (
        <p className="animate-fade-in-up" style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(0.7rem, 2.5vw, 0.85rem)",
          color: "#34d399",
          letterSpacing: "0.2em",
          margin: 0,
        }}>
          {REVEAL_STEPS[1].content}
        </p>
      )}

      {/* Step 2: PURPOSE NOT FOUND */}
      {visible(2) && (
        <p className="animate-fade-in-up animate-wobble" style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(0.75rem, 2.8vw, 0.95rem)",
          color: "#f472b6",
          letterSpacing: "0.15em",
          margin: 0,
        }}>
          {REVEAL_STEPS[2].content}
        </p>
      )}

      {/* Step 3: A COMPLETELY USELESS EXPERIMENT */}
      {visible(3) && (
        <div className="animate-pop-in animate-pulse-glow" style={{
          background: "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(59,130,246,0.15))",
          border: "2px solid rgba(139,92,246,0.5)",
          borderRadius: 16,
          padding: "16px 20px",
          width: "100%",
          textAlign: "center",
        }}>
          <p style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1rem, 4vw, 1.4rem)",
            fontWeight: 900,
            background: "linear-gradient(135deg, #f472b6, #facc15, #a78bfa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "0.06em",
            lineHeight: 1.3,
            margin: 0,
          }}>
            {REVEAL_STEPS[3].content}
          </p>
        </div>
      )}

      {/* Steps 4-7: Malayalam reveal paragraphs */}
      {visible(4) && (
        <div className="animate-fade-in-up" style={{
          background: "rgba(139,92,246,0.08)",
          border: "1px solid rgba(139,92,246,0.2)",
          borderRadius: 14,
          padding: "16px 20px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}>
          <p style={{ fontFamily: malFont, fontSize: "clamp(1rem,3.5vw,1.1rem)", lineHeight: 1.9, color: "#c4b5fd", margin: 0, overflowWrap: "break-word", overflow: "visible" }}>
            {REVEAL_STEPS[4].content}
          </p>
          {visible(5) && (
            <p className="animate-fade-in-up" style={{ fontFamily: malFont, fontSize: "clamp(1rem,3.5vw,1.1rem)", lineHeight: 1.9, color: "#a78bfa", margin: 0, overflowWrap: "break-word", overflow: "visible" }}>
              {REVEAL_STEPS[5].content}
            </p>
          )}
          {visible(6) && (
            <p className="animate-fade-in-up" style={{ fontFamily: malFont, fontSize: "clamp(1.1rem,4vw,1.3rem)", lineHeight: 1.9, color: "#f472b6", fontWeight: 600, margin: 0, overflowWrap: "break-word", overflow: "visible" }}>
              {REVEAL_STEPS[6].content}
            </p>
          )}
          {visible(7) && (
            <p className="animate-fade-in-up" style={{ fontFamily: malFont, fontSize: "clamp(1rem,3.5vw,1.1rem)", lineHeight: 1.9, color: "#c4b5fd", margin: 0, overflowWrap: "break-word", overflow: "visible" }}>
              {REVEAL_STEPS[7].content}
            </p>
          )}
          {visible(7) && (
            <p className="animate-pop-in" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(0.85rem,3vw,1rem)", color: "#facc15", letterSpacing: "0.1em", marginTop: 4, margin: 0 }}>
              ഇത്... A COMPLETELY USELESS EXPERIMENT! 😂
            </p>
          )}
        </div>
      )}

      {/* Step 8: rest of the screen — stats, rotating msg, escape */}
      {visible(8) && (
        <div className="animate-fade-in-up flex flex-col items-center gap-4" style={{ width: "100%" }}>
          <RotatingMalMsg />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, width: "100%" }}>
            {[
              { label: "Buttons Clicked", value: clicks },
              { label: "Questions Survived", value: questions },
              { label: "Common Sense", value: "0%" },
            ].map((s) => (
              <div key={s.label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 12, padding: "12px 6px", textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.2rem,4vw,1.8rem)", color: "#a78bfa", fontWeight: 700 }}>{s.value}</div>
                <div style={{ color: "rgba(148,163,184,0.55)", fontSize: "0.62rem", letterSpacing: "0.05em", marginTop: 3, lineHeight: 1.3 }}>{s.label.toUpperCase()}</div>
              </div>
            ))}
          </div>

          <div style={{ width: "100%" }}>
            <button
              className="btn-primary animate-pulse-glow"
              style={{ padding: "15px 36px", fontSize: "0.95rem", width: "100%" }}
              onClick={onEscape}
            >
              ESCAPE THE HYPNOSIS
            </button>
            <p style={{ fontFamily: malFont, color: "rgba(100,116,139,0.6)", fontSize: "clamp(0.9rem,3vw,1rem)", lineHeight: 1.9, overflow: "visible", height: "auto", marginTop: 8, textAlign: "center" }}>
              ഇവിടെ click ചെയ്താൽ രക്ഷപ്പെടാം... probably. 🤞
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Rotating Malayalam messages (final screen) ────────────────────────────────
const FINAL_MAL_MSGS = [
  "നിങ്ങളുടെ common sense ഇപ്പോൾ vacation-ലാണ് 😂",
  "ഇത്രയും നേരം ഇത് കളിച്ചതിന് അഭിനന്ദനങ്ങൾ 😭",
  "Congratulations! നിങ്ങൾ officially hypnotized ആണ് 🫣",
  "ഇത് എന്തിനാണെന്ന് ഞങ്ങൾക്കും അറിയില്ല 😂",
  "നീ ഇതുവരെ പോയില്ലേ? 🤪",
  "ഇനി പേടിക്കണ്ട 😂 സത്യത്തിൽ ഒന്നും സംഭവിച്ചിട്ടില്ല.",
];

function RotatingMalMsg() {
  const [idx, setIdx] = useState(0);
  const [vis, setVis] = useState(true);
  useEffect(() => {
    const t = setInterval(() => {
      setVis(false);
      setTimeout(() => { setIdx((i) => (i + 1) % FINAL_MAL_MSGS.length); setVis(true); }, 400);
    }, 3000);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{
      fontFamily: "'Noto Sans Malayalam', 'Noto Sans', sans-serif",
      background: "rgba(139,92,246,0.1)",
      border: "1px solid rgba(139,92,246,0.25)",
      borderRadius: 14,
      padding: "14px 20px",
      color: "#c4b5fd",
      fontSize: "clamp(1rem, 3.5vw, 1.1rem)",
      lineHeight: 1.9,
      letterSpacing: "normal",
      wordSpacing: "normal",
      whiteSpace: "normal",
      wordBreak: "normal",
      overflowWrap: "break-word",
      overflow: "visible",
      height: "auto",
      transition: "opacity 0.4s, transform 0.4s",
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(6px)",
      textAlign: "center",
      width: "100%",
    }}>
      {FINAL_MAL_MSGS[idx]}
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [clicks, setClicks] = useState(0);
  const [questions, setQuestions] = useState(0);
  const [readyMsg, setReadyMsg] = useState<string | null>(null);
  const [sureMsg, setSureMsg] = useState<string | null>(null);
  const [dnpPressed, setDnpPressed] = useState(false);
  const [circlePhase, setCirclePhase] = useState<"watching" | "asked">("watching");
  const [trustMsg, setTrustMsg] = useState<string | null>(null);
  const [floatTrigger, setFloatTrigger] = useState(false);

  const go = useCallback((s: Screen) => setScreen(s), []);

  const click = (next: () => void) => {
    setClicks((c) => c + 1);
    next();
  };

  const advanceQuestion = (next: Screen) => {
    setQuestions((q) => q + 1);
    go(next);
  };

  useEffect(() => {
    if (screen !== "circle") return;
    const t = setTimeout(() => setCirclePhase("asked"), 5000);
    return () => clearTimeout(t);
  }, [screen]);

  useEffect(() => {
    if (screen !== "circle") setCirclePhase("watching");
  }, [screen]);

  const resetGame = () => {
    setScreen("intro");
    setClicks(0);
    setQuestions(0);
    setReadyMsg(null);
    setSureMsg(null);
    setDnpPressed(false);
    setTrustMsg(null);
    setFloatTrigger(false);
  };

  const malStyle: React.CSSProperties = {
    fontFamily: "'Noto Sans Malayalam', 'Noto Sans', sans-serif",
    fontSize: "clamp(1rem, 3.5vw, 1.1rem)",
    color: "#c4b5fd",
    lineHeight: 1.9,
    letterSpacing: "normal",
    wordSpacing: "normal",
    whiteSpace: "normal",
    wordBreak: "normal",
    overflowWrap: "break-word",
    overflow: "visible",
    height: "auto",
  };

  const cardStyle: React.CSSProperties = {
    maxWidth: 540,
    width: "100%",
    padding: "clamp(24px, 6vw, 44px)",
    textAlign: "center",
  };

  return (
    <div className="bg-mesh" style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      {screen === "final" && <Confetti />}

      <div className="glass-card screen-enter" style={cardStyle} key={screen}>

        {/* ════════════════════════════════ SCREEN 1: INTRO ══════════════════════ */}
        {screen === "intro" && (
          <div className="flex flex-col items-center gap-5">
            <div className="animate-float">
              <HypnoticSpiral size={130} />
            </div>
            <div>
              <h1 style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(3.5rem, 14vw, 6rem)",
                fontWeight: 900,
                background: "linear-gradient(135deg, #a78bfa, #60a5fa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "0.1em",
                lineHeight: 1,
                margin: 0,
              }}>
                404
              </h1>
              <p style={{ color: "rgba(148,163,184,0.7)", fontSize: "clamp(0.78rem, 2.5vw, 0.9rem)", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 10, fontWeight: 300 }}>
                Something is about to happen.
              </p>
            </div>

            <MalBubble text="അപ്പോ തുടങ്ങാം... ഇനി എന്ത് സംഭവിച്ചാലും ഞങ്ങളെ കുറ്റം പറയരുത് 😂" />

            <button
              className="btn-primary animate-pulse-glow"
              style={{ padding: "16px 64px", fontSize: "1.1rem" }}
              onClick={() => click(() => advanceQuestion("ready"))}
            >
              START
            </button>
            <p style={{ color: "rgba(100,116,139,0.55)", fontSize: "0.7rem", letterSpacing: "0.1em" }}>
              Are you ready? 👀
            </p>
          </div>
        )}

        {/* ════════════════════════════════ SCREEN 2: READY ════════════════════ */}
        {screen === "ready" && (
          <div className="flex flex-col items-center gap-5">
            <div style={{ fontSize: "2.5rem" }} className="animate-wobble">🧠</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.05rem,4vw,1.45rem)", color: "#e2e8f0", margin: 0, lineHeight: 1.4 }}>
              Are you ready to discover something about yourself?
            </h2>
            <MalBubble text="ഓഹോ... ഇത്ര ധൈര്യമോ? 🤨 Ready ആണെന്ന് ഉറപ്പാണോ?" />

            {!readyMsg ? (
              <div className="flex gap-4 flex-wrap justify-center" style={{ marginTop: 4 }}>
                <button
                  className="btn-primary"
                  style={{ padding: "14px 36px", fontSize: "0.95rem" }}
                  onClick={() => click(() => advanceQuestion("number"))}
                >
                  YES, LET'S GO
                </button>
                <button
                  className="btn-ghost"
                  style={{ padding: "14px 36px", fontSize: "0.95rem" }}
                  onClick={() => {
                    setClicks((c) => c + 1);
                    setReadyMsg("Too late. You are already curious. 👀");
                  }}
                >
                  NO
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 animate-pop-in">
                <div style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 14, padding: "14px 20px", color: "#a78bfa", fontSize: "clamp(0.88rem,3vw,1rem)" }}>
                  {readyMsg}
                </div>
                <MalBubble text="Too late. You are already curious. 👀 ഇനി NO ഒരു option-അല്ല 😂" />
                <button className="btn-primary" style={{ padding: "14px 40px", fontSize: "0.95rem" }} onClick={() => click(() => advanceQuestion("number"))}>
                  CONTINUE
                </button>
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════ SCREEN 3: NUMBER ════════════════════ */}
        {screen === "number" && (
          <div className="flex flex-col items-center gap-5">
            <div style={{ fontSize: "2.5rem" }}>🔢</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.05rem,4vw,1.4rem)", color: "#e2e8f0", margin: 0, lineHeight: 1.5 }}>
              Think of any number between 1 and 10.
            </h2>
            <MalBubble text="ഒരു number ആലോചിക്ക്... ഞങ്ങൾക്ക് ഒരിക്കലും അറിയേണ്ട 😂" />
            <p style={{ color: "rgba(148,163,184,0.55)", fontSize: "0.82rem", margin: 0 }}>
              (We definitely cannot read your mind. Definitely.)
            </p>
            <div className="flex gap-3 flex-wrap justify-center">
              {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                <button
                  key={n}
                  className="btn-ghost animate-pop-in"
                  style={{ padding: "10px 14px", fontSize: "1rem", animationDelay: `${n * 0.04}s`, minWidth: 44 }}
                  onClick={() => click(() => advanceQuestion("sure"))}
                >
                  {n}
                </button>
              ))}
            </div>
            <p style={{ ...malStyle, opacity: 0.6 }}>
              ഏത് number-ഉം ആകാം... ഞങ്ങൾക്ക് care-ഇല്ല 🤷
            </p>
          </div>
        )}

        {/* ════════════════════════════════ SCREEN 4: SURE ══════════════════════ */}
        {screen === "sure" && (
          <div className="flex flex-col items-center gap-5">
            <div style={{ fontSize: "2.5rem" }}>🤔</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.05rem,4vw,1.4rem)", color: "#e2e8f0", margin: 0, lineHeight: 1.5 }}>
              Are you <em style={{ color: "#a78bfa", fontStyle: "italic" }}>sure</em> that's the number you chose?
            </h2>
            <MalBubble text="ഒരു 100% ഉറപ്പുണ്ടോ? 🧐 Maybe നമ്പർ മാറ്റണോ?" />

            {!sureMsg ? (
              <div className="flex gap-4 flex-wrap justify-center" style={{ marginTop: 4 }}>
                <button
                  className="btn-primary"
                  style={{ padding: "14px 40px", fontSize: "0.95rem" }}
                  onClick={() => { setClicks((c) => c + 1); setSureMsg("നല്ല തീരുമാനം... പക്ഷേ ശരിക്കും നല്ലതാണോ എന്ന് ഞങ്ങൾക്കറിയില്ല 😂"); }}
                >
                  YES
                </button>
                <button
                  className="btn-ghost"
                  style={{ padding: "14px 40px", fontSize: "0.95rem" }}
                  onClick={() => { setClicks((c) => c + 1); setSureMsg("Subconscious-ൽ ഒരു mystery ഉണ്ട്... അല്ലെങ്കിൽ നിങ്ങൾ confuse ആണ് 🤷"); }}
                >
                  MAYBE
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 animate-pop-in">
                <div style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)", borderRadius: 14, padding: "16px 20px" }}>
                  <p style={{ ...malStyle, margin: 0, color: "#93c5fd", whiteSpace: "normal" }}>{sureMsg}</p>
                </div>
                <MalBubble text="ഇനി ഒരു ചെറിയ ചോദ്യം... പേടിക്കണ്ട 👀 (ആകെ പേടിക്കണം)" right />
                <button className="btn-primary" style={{ padding: "14px 40px", fontSize: "0.95rem" }} onClick={() => click(() => advanceQuestion("catchgame"))}>
                  CONTINUE
                </button>
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════ MINI-GAME 1: CATCH ══════════════════ */}
        {screen === "catchgame" && (
          <CatchGame
            onDone={() => { setQuestions((q) => q + 1); go("donotpress"); }}
            onClick={() => setClicks((c) => c + 1)}
          />
        )}

        {/* ════════════════════════════════ SCREEN 5: DO NOT PRESS ════════════ */}
        {screen === "donotpress" && (
          <div className="flex flex-col items-center gap-5">
            <div style={{ fontSize: "2.5rem" }}>🚫</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.05rem,4vw,1.4rem)", color: "#e2e8f0", margin: 0, lineHeight: 1.5 }}>
              Don't press the button below.
            </h2>
            <MalBubble text="ഇത് PRESS ചെയ്യരുത് എന്ന് പറഞ്ഞതല്ലേ! 😭 Please..." />
            <p style={{ color: "rgba(148,163,184,0.45)", fontSize: "0.78rem", margin: 0 }}>
              Seriously. We beg you. Don't.
            </p>

            {!dnpPressed ? (
              <div className="flex flex-col items-center gap-3">
                <button
                  className="btn-danger"
                  style={{ padding: "20px 52px", fontSize: "1.1rem" }}
                  onClick={() => { setClicks((c) => c + 1); setDnpPressed(true); setFloatTrigger(true); }}
                >
                  DO NOT PRESS
                </button>
                <FloatEmoji emojis={["😱", "🙈", "😱"]} trigger={false} />
                <p style={{ ...malStyle, color: "rgba(167,139,250,0.5)" }}>
                  ↑ ഇത് press ചെയ്തില്ലെങ്കിൽ നിനക്ക് ഒരു star ഉണ്ടായിരുന്നു...
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 animate-shake">
                <FloatEmoji emojis={["😱", "🙈", "😭", "😂", "💀"]} trigger={floatTrigger} />
                <div style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)", borderRadius: 14, padding: "14px 20px" }}>
                  <p style={{ color: "#fca5a5", fontSize: "clamp(0.88rem,3vw,1rem)", margin: 0 }}>
                    You pressed it. Exactly as expected. 😂
                  </p>
                  <p style={{ ...malStyle, color: "#fca5a5", marginTop: 8 }}>
                    എന്തിനാ അമർത്തിയത്? Curiosity അടക്കാൻ പറ്റുന്നില്ല leyy? 😂
                  </p>
                </div>
                <button className="btn-primary" style={{ padding: "14px 40px", fontSize: "0.95rem" }} onClick={() => click(() => advanceQuestion("circle"))}>
                  CONTINUE
                </button>
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════ SCREEN 6: CIRCLE ══════════════════ */}
        {screen === "circle" && (
          <div className="flex flex-col items-center gap-4">
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1rem,4vw,1.3rem)", color: "#e2e8f0", margin: 0, lineHeight: 1.5 }}>
              Look at the circle for 5 seconds...
            </h2>
            <MalBubble text="ഈ circle-ഇൽ നോക്ക്... ഇത് actually ഒന്നും ചെയ്യില്ല. But stare ചെയ്ത് 👁️" />
            <RotatingCircle />
            {circlePhase === "watching" && (
              <p style={{ ...malStyle, color: "rgba(139,92,246,0.6)" }}>
                Focus... breathe... ഒന്നും ഇല്ല ഇവിടെ...
              </p>
            )}
            {circlePhase === "asked" && (
              <div className="flex flex-col items-center gap-4 screen-enter">
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(0.9rem,3vw,1.1rem)", color: "#a78bfa", margin: 0 }}>
                  Are you still looking?
                </h3>
                <MalBubble text="നീ ഇനിയും ഇവിടെ തന്നെയാണല്ലേ? 😂 Unbelievable." right />
                <button className="btn-primary" style={{ padding: "14px 48px", fontSize: "0.95rem" }} onClick={() => click(() => advanceQuestion("memorygame"))}>
                  YES
                </button>
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════ MINI-GAME 2: MEMORY ════════════════ */}
        {screen === "memorygame" && (
          <MemoryGame
            onDone={() => { setQuestions((q) => q + 1); go("trust"); }}
            onClick={() => setClicks((c) => c + 1)}
          />
        )}

        {/* ════════════════════════════════ SCREEN 7: TRUST ════════════════════ */}
        {screen === "trust" && (
          <div className="flex flex-col items-center gap-5">
            <div style={{ fontSize: "2.2rem" }}>🌀</div>
            <p style={{ color: "rgba(148,163,184,0.6)", fontSize: "0.78rem", letterSpacing: "0.2em", textTransform: "uppercase", margin: 0 }}>
              One final question...
            </p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.1rem,4vw,1.45rem)", color: "#e2e8f0", margin: 0 }}>
              Do you trust this app?
            </h2>
            <MalBubble text="ഇതൊരു serious ചോദ്യമാണ്... അതായത് serious ആണ് 😐 (അല്ല)" />

            {!trustMsg ? (
              <div className="flex gap-4 flex-wrap justify-center" style={{ marginTop: 4 }}>
                <button
                  className="btn-primary"
                  style={{ padding: "14px 36px", fontSize: "0.95rem" }}
                  onClick={() => { setClicks((c) => c + 1); setTrustMsg("Wise choice. Definitely trust the spinning circles. 🌀\nഈ circles ഒക്കെ 100% reliable ആണ് 😂"); }}
                >
                  I TRUST IT
                </button>
                <button
                  className="btn-ghost"
                  style={{ padding: "14px 36px", fontSize: "0.95rem" }}
                  onClick={() => { setClicks((c) => c + 1); setTrustMsg("Smart. Yet here you are, still clicking. 🙃\nVery smart. VERY."); }}
                >
                  I DON'T
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 animate-pop-in">
                <div style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 14, padding: "14px 20px" }}>
                  <p style={{ fontFamily: "'Noto Sans Malayalam','Noto Sans',sans-serif", color: "#a78bfa", fontSize: "clamp(1rem,3.5vw,1.1rem)", whiteSpace: "pre-line", lineHeight: 1.9, margin: 0, overflowWrap: "break-word", overflow: "visible", height: "auto" }}>{trustMsg}</p>
                </div>
                <MalBubble text="നിങ്ങൾ click ചെയ്തതൊക്കെ ഞങ്ങൾ കണ്ടു... Final stage-ലേക്ക് സ്വാഗതം 😂" right />
                <button className="btn-primary" style={{ padding: "14px 40px", fontSize: "0.95rem" }} onClick={() => click(() => go("loading"))}>
                  PROCEED
                </button>
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════ LOADING ════════════════════════════ */}
        {screen === "loading" && <LoadingScreen onDone={() => go("final")} />}

        {/* ════════════════════════════════ FINAL ══════════════════════════════ */}
        {screen === "final" && (
          <FinalReveal
            clicks={clicks}
            questions={questions}
            onEscape={() => click(() => go("escaped"))}
          />
        )}

        {/* ════════════════════════════════ ESCAPED ════════════════════════════ */}
        {screen === "escaped" && (
          <div className="flex flex-col items-center gap-5">
            <div style={{ fontSize: "3rem" }} className="animate-wobble">🎉</div>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.1rem,4.5vw,1.7rem)",
              background: "linear-gradient(135deg, #34d399, #60a5fa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              margin: 0,
              lineHeight: 1.3,
            }}>
              Congratulations!
            </h2>

            <div className="animate-pop-in" style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.25)", borderRadius: 16, padding: "18px 22px", lineHeight: 1.8 }}>
              <p style={{ color: "#6ee7b7", fontSize: "clamp(0.9rem,3vw,1rem)", margin: 0 }}>
                🎉 രക്ഷപ്പെട്ടു!
              </p>
              <p style={{ ...malStyle, color: "#6ee7b7", marginTop: 8 }}>
                നിങ്ങൾ Hypnosis-ൽ നിന്ന് successfully പുറത്തുവന്നു 😂
              </p>
              <p style={{ ...malStyle, color: "rgba(148,163,184,0.7)", marginTop: 8 }}>
                പക്ഷേ ഇത്രയും സമയം ഇവിടെ എന്തിനായിരുന്നു? 🤔
              </p>
            </div>

            <MalBubble text="നന്ദിയുണ്ടേയ്യ്! 🙏😁 You may now return to your completely normal life." />

            <div style={{ color: "rgba(100,116,139,0.5)", fontSize: "0.75rem" }}>
              Total buttons clicked: <strong style={{ color: "#a78bfa" }}>{clicks}</strong>
            </div>

            <button
              className="btn-primary animate-pulse-glow"
              style={{ padding: "14px 44px", fontSize: "0.95rem" }}
              onClick={resetGame}
            >
              PLAY AGAIN 🔄
            </button>
            <p style={{ ...malStyle, color: "rgba(100,116,139,0.5)" }}>
              (ഇനിയും കളിക്കാൻ ഉദ്ദേശമുണ്ടോ? 🤦)
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
