/**
 * Pixel / retro-game skin extras: sprite renderer, original sprites, the hero scene, the parallax
 * backdrop, and a small game layer (coins for clicks, levels, achievements, optional 8-bit sound).
 */
import { CSSProperties, ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { cx, useReducedMotion } from "./core";
import { useToast } from "./Feedback";

const PAL: Record<string, string> = {
  K: "#1a1c2c", B: "#41a6f6", L: "#73eff7", D: "#29366f", V: "#1a1c2c", E: "#73eff7", Y: "#ffcd75",
  O: "#ef7d57", W: "#f4f4f4", R: "#b13e53", G: "#38b764", M: "#94b0c2", P: "#5d275d",
};

export const ROBOT = [
  ".....YY.....", ".....KK.....", "..KKKKKKKK..", ".KBBBBBBBBK.", ".KBVVVVVVBK.", ".KBVEVVEVBK.", ".KBVVVVVVBK.",
  ".KBBBBBBBBK.", "..KKKKKKKK..", ".KDBBBBBBDK.", "KDKBLLLLBKDK", "KK.BBBBBB.KK", "...KK..KK...", "...KK..KK...",
];
export const COIN = ["..KKKK..", ".KYYYYK.", "KYYWYYOK", "KYYWYYOK", "KYYWYYOK", "KYYYYYOK", ".KOOOOK.", "..KKKK.."];
export const HEART = [".RR.RR.", "RWRRRRR", "RRRRRRR", ".RRRRR.", "..RRR..", "...R..."];
export const STAR = ["...Y...", "...Y...", "YYYYYYY", ".YYYYY.", "..YYY..", ".YY.YY.", "Y.....Y"];
const CLOUD = [".....WWWW.......", "...WWWWWWWW.....", ".WWWWWWWWWWWWW..", "WWWWWWWWWWWWWWWW", ".MMMMMMMMMMMMMM."];
const MOON = ["..WWWW..", ".WWWWMW.", "WWWWWWWW", "WWMWWWWW", "WWWWWWMW", "WWWWWWWW", ".WWMWWW.", "..WWWW.."];

/** Pixel art from strings: one char per pixel, "." is transparent, letters map to the palette. */
export function Sprite({ art, scale = 4, colors, title, className, style }: {
  art: string[]; scale?: number; colors?: Record<string, string>; title?: string; className?: string; style?: CSSProperties;
}) {
  const pal = { ...PAL, ...colors };
  const rects = useMemo(() => {
    const out: ReactNode[] = [];
    art.forEach((row, y) => {
      for (let x = 0; x < row.length;) {
        const c = row[x];
        if (c === ".") { x++; continue; }
        let x2 = x;
        while (row[x2] === c) x2++;
        out.push(<rect key={`${x}-${y}`} x={x} y={y} width={x2 - x} height={1} fill={pal[c] ?? c} />);
        x = x2;
      }
    });
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [art, colors]);
  const w = Math.max(...art.map((r) => r.length)), h = art.length;
  return (
    <svg className={cx("ui-sprite", className)} style={style} width={w * scale} height={h * scale} viewBox={`0 0 ${w} ${h}`}
      shapeRendering="crispEdges" role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      {rects}
    </svg>
  );
}

/* ---------------- game state ---------------- */

interface Game { score: number; level: number; xp: number; sound: boolean; setSound: (on: boolean) => void; add: (n: number, at?: { x: number; y: number }) => void }
const GameCtx = createContext<Game | null>(null);
export const useGame = () => useContext(GameCtx);

const ACHIEVEMENTS: [number, string][] = [[100, "First 100 coins"], [300, "Button masher"], [600, "Speed runner"], [1000, "Hackathon legend"]];
const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
const LEVEL_XP = 200;

function useBlip(enabled: boolean) {
  const ctx = useRef<AudioContext | null>(null);
  return useCallback((notes: number[]) => {
    if (!enabled) return;
    try {
      ctx.current ??= new AudioContext();
      const ac = ctx.current, t = ac.currentTime;
      notes.forEach((f, i) => {
        const o = ac.createOscillator(), g = ac.createGain();
        o.type = "square"; o.frequency.value = f;
        g.gain.setValueAtTime(0.06, t + i * 0.07); g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.07 + 0.09);
        o.connect(g).connect(ac.destination); o.start(t + i * 0.07); o.stop(t + i * 0.07 + 0.1);
      });
    } catch { /* audio unavailable */ }
  }, [enabled]);
}

const load = (k: string, d: string) => { try { return localStorage.getItem(k) ?? d; } catch { return d; } };
const save = (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* storage blocked */ } };

/** Wrap a page to turn clicks into coins. Off (pass-through) unless `enabled`. */
export function GameLayer({ enabled, children }: { enabled: boolean; children: ReactNode }) {
  const toast = useToast();
  const reduced = useReducedMotion();
  const [score, setScore] = useState(() => Number(load("ui-px-score", "0")) || 0);
  const [sound, setSoundState] = useState(() => load("ui-px-sound", "off") === "on");
  const [pops, setPops] = useState<{ id: number; x: number; y: number; text: string }[]>([]);
  const blip = useBlip(sound);
  const scoreRef = useRef(score);

  const add = useCallback((n: number, at?: { x: number; y: number }) => {
    const before = scoreRef.current, after = before + n;
    scoreRef.current = after;
    setScore(after);
    save("ui-px-score", String(after));
    blip(n >= 50 ? [988, 1319] : [1319]);
    if (at && !reduced) {
      const id = Date.now() + Math.random();
      setPops((p) => [...p.slice(-12), { id, x: at.x, y: at.y, text: `+${n}` }]);
      setTimeout(() => setPops((p) => p.filter((q) => q.id !== id)), 900);
    }
    ACHIEVEMENTS.forEach(([t, name]) => {
      if (before < t && after >= t) { toast({ title: "ACHIEVEMENT UNLOCKED", desc: name, tone: "success" }); blip([659, 784, 1047, 1319]); }
    });
    if (Math.floor(after / LEVEL_XP) > Math.floor(before / LEVEL_XP)) toast({ title: `LEVEL UP! LV ${Math.floor(after / LEVEL_XP) + 1}`, tone: "warn" });
  }, [blip, reduced, toast]);

  useEffect(() => {
    if (!enabled) return;
    const click = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t?.closest || t.closest("[data-coin]")) return;
      if (t.closest(".ui button, .ui a, .ui [role=button], .ui-portal button")) add(10, { x: e.clientX, y: e.clientY });
    };
    let seq: string[] = [];
    const key = (e: KeyboardEvent) => {
      seq = [...seq, e.key].slice(-KONAMI.length);
      if (seq.join() === KONAMI.join()) { seq = []; toast({ title: "CHEAT CODE ACCEPTED", desc: "+999 coins", tone: "warn" }); add(999); }
    };
    document.addEventListener("click", click, true);
    window.addEventListener("keydown", key);
    return () => { document.removeEventListener("click", click, true); window.removeEventListener("keydown", key); };
  }, [enabled, add, toast]);

  const value = useMemo<Game>(() => ({
    score, level: Math.floor(score / LEVEL_XP) + 1, xp: (score % LEVEL_XP) / LEVEL_XP, sound,
    setSound: (on) => { setSoundState(on); save("ui-px-sound", on ? "on" : "off"); }, add,
  }), [score, sound, add]);

  return (
    <GameCtx.Provider value={value}>
      {children}
      {enabled && pops.map((p) => <span key={p.id} className="ui-px-pop" style={{ left: p.x, top: p.y }} aria-hidden>{p.text}</span>)}
    </GameCtx.Provider>
  );
}

/** Score / level / XP readout, plus the sound toggle. */
export function PixelHUD() {
  const g = useGame();
  if (!g) return null;
  return (
    <div className="ui-px-hud" role="status" aria-label={`Score ${g.score}, level ${g.level}`}>
      <span className="ui-px-hud-coin"><Sprite art={COIN} scale={2} /> {String(g.score).padStart(6, "0")}</span>
      <span>LV {g.level}</span>
      <span className="ui-px-xp" aria-hidden><i style={{ width: `${g.xp * 100}%` }} /></span>
      <span className="ui-px-hearts" aria-hidden><Sprite art={HEART} scale={2} /><Sprite art={HEART} scale={2} /><Sprite art={HEART} scale={2} /></span>
      <button type="button" data-coin="self" className="ui-px-sound" aria-pressed={g.sound} onClick={() => g.setSound(!g.sound)}>
        {g.sound ? "♪ ON" : "♪ OFF"}
      </button>
    </div>
  );
}

/* ---------------- hero scene ---------------- */

export function PixelScene() {
  const g = useGame();
  const [jumps, setJumps] = useState(0);
  const [taken, setTaken] = useState<number[]>([]);
  const collect = (i: number, e: React.MouseEvent) => {
    if (taken.includes(i)) return;
    setTaken((t) => [...t, i]);
    g?.add(50, { x: e.clientX, y: e.clientY });
    setTimeout(() => setTaken((t) => t.filter((x) => x !== i)), 2400);
  };
  return (
    <div className="ui-px-scene">
      <div className="ui-px-coins">
        {[0, 1, 2].map((i) => (
          <button key={i} type="button" data-coin="self" className={cx("ui-px-coin", taken.includes(i) && "is-taken")}
            style={{ animationDelay: `${i * 0.25}s` }} aria-label="Collect coin" onClick={(e) => collect(i, e)}>
            <Sprite art={COIN} scale={5} />
          </button>
        ))}
      </div>
      <button key={jumps} type="button" data-coin="self" className={cx("ui-px-hero", jumps > 0 && "is-jump")} aria-label="Make the robot jump"
        onClick={(e) => { setJumps((j) => j + 1); g?.add(10, { x: e.clientX, y: e.clientY }); }}>
        <Sprite art={ROBOT} scale={9} />
      </button>
      <div className="ui-px-platform" />
      <div className="ui-px-press">PRESS START</div>
    </div>
  );
}

/* ---------------- parallax backdrop ---------------- */

/** Periodic stepped skyline so the strip tiles seamlessly. */
function skyline(cols: number, base: number, amp: number, seed: number) {
  return Array.from({ length: cols }, (_, i) => {
    const t = (i / cols) * Math.PI * 2;
    const v = Math.sin(t * 2 + seed) * 0.5 + Math.sin(t * 5 + seed * 2) * 0.3 + Math.sin(t * 11 + seed * 3) * 0.2;
    return Math.round(base + v * amp);
  });
}

function Mountains({ cols, base, amp, seed, color, cap }: { cols: number; base: number; amp: number; seed: number; color: string; cap?: string }) {
  const hs = useMemo(() => skyline(cols, base, amp, seed), [cols, base, amp, seed]);
  const H = base + amp + 4;
  const strip = (
    <svg viewBox={`0 0 ${cols} ${H}`} preserveAspectRatio="none" shapeRendering="crispEdges">
      {hs.map((h, i) => <rect key={i} x={i} y={H - h} width={1.02} height={h} fill={color} />)}
      {cap && hs.map((h, i) => h > base + amp * 0.55 && <rect key={`c${i}`} x={i} y={H - h} width={1.02} height={2} fill={cap} />)}
    </svg>
  );
  return <div className="ui-px-mtn-track">{strip}{strip}</div>;
}

const STARS = Array.from({ length: 90 }, (_, i) => [(i * 137.5) % 100, (i * 61.8 * 1.7) % 62, i % 3]);

export function PixelBackground() {
  const starShadow = (layer: number) => STARS.filter((s) => s[2] === layer).map(([x, y]) => `${x}vw ${y}vh 0 0 #f4f4f4`).join(",");
  return (
    <div className="ui-bg ui-bg-pixel" aria-hidden>
      <div className="ui-px-stars" style={{ boxShadow: starShadow(0) }} />
      <div className="ui-px-stars is-2" style={{ boxShadow: starShadow(1) }} />
      <div className="ui-px-stars is-3" style={{ boxShadow: starShadow(2) }} />
      <Sprite art={MOON} scale={8} className="ui-px-moon" />
      {[0, 1, 2].map((i) => <Sprite key={i} art={CLOUD} scale={6} className={`ui-px-cloud c${i}`} />)}
      <div className="ui-px-mtn far"><Mountains cols={160} base={26} amp={18} seed={1.3} color="#29366f" cap="#566c86" /></div>
      <div className="ui-px-mtn near"><Mountains cols={120} base={14} amp={10} seed={4.1} color="#1f2640" /></div>
      <div className="ui-px-ground" />
    </div>
  );
}
