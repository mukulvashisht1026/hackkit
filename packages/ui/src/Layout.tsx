import { CSSProperties, ReactNode } from "react";
import { Reveal, useTilt, useUITheme } from "./core";
import { Icon } from "./icons";
import { PixelBackground, PixelScene, ROBOT, Sprite } from "./Pixel";

/** CSS-only 3D cube. */
export const Cube = ({ size = 160 }: { size?: number }) => (
  <div className="ui-cube" style={{ "--s": `${size}px` } as CSSProperties}><i /><i /><i /><i /><i /><i /></div>
);

/** Iridescent floating orb (dreamy hero visual). */
export const Orb = () => (
  <div className="ui-orb" aria-hidden>
    <div className="ui-orb-ring" />
    <div className="ui-orb-orbit" />
    <div className="ui-orb-orbit is-2" />
    <div className="ui-orb-core" />
  </div>
);

/** Cube + orbit rings that tilt toward the pointer (3D hero visual). */
export function HeroScene() {
  const ref = useTilt<HTMLDivElement>(22);
  return (
    <div className="ui-hero3d" ref={ref} aria-hidden>
      <div className="ui-hero3d-tilt">
        <div className="ui-hero3d-float">
          <div className="ui-ring" />
          <div className="ui-ring is-2" />
          <Cube size={150} />
        </div>
      </div>
      <div className="ui-hero3d-shadow" />
    </div>
  );
}

export const Logo = () => {
  const theme = useUITheme();
  if (theme === "pixel") return <span className="ui-logo is-pixel"><Sprite art={ROBOT} scale={2} /></span>;
  return theme === "depth"
    ? <span className="ui-logo is-3d"><Cube size={20} /></span>
    : <span className="ui-logo"><Icon.sparkle /></span>;
};

const SPARKS: [number, number, number, number][] = [
  [8, 18, 0, 14], [22, 62, 1.2, 10], [38, 12, 2.1, 12], [55, 78, 0.6, 16], [70, 28, 1.8, 11],
  [86, 54, 0.3, 14], [92, 14, 2.6, 9], [14, 88, 1.5, 12], [64, 46, 3.1, 8], [46, 34, 2.4, 10],
];
const FLOATERS = [
  { x: "6%", y: "22%", s: 46 }, { x: "88%", y: "16%", s: 34 }, { x: "78%", y: "68%", s: 54 },
  { x: "14%", y: "74%", s: 30 }, { x: "50%", y: "88%", s: 24 },
];

/** Fixed, animated page backdrop for the current theme. */
export function Background() {
  const theme = useUITheme();
  if (theme === "pixel") return <PixelBackground />;
  if (theme === "depth") {
    return (
      <div className="ui-bg ui-bg-depth" aria-hidden>
        <div className="ui-stars" />
        <div className="ui-floor-wrap"><div className="ui-floor" /></div>
        {FLOATERS.map((f, i) => (
          <div key={i} className="ui-floater" style={{ left: f.x, top: f.y, animationDelay: `${-i * 1.7}s` }}>
            <Cube size={f.s} />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="ui-bg ui-bg-dreamy" aria-hidden>
      <i className="ui-blob b1" /><i className="ui-blob b2" /><i className="ui-blob b3" /><i className="ui-blob b4" />
      <div className="ui-sparkles">
        {SPARKS.map(([x, y, d, s], i) => (
          <span key={i} style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${d}s`, fontSize: s }}>✦</span>
        ))}
      </div>
      <div className="ui-grain" />
    </div>
  );
}

export function Hero({ eyebrow, title, subtitle, actions, visual }: {
  eyebrow?: ReactNode; title: ReactNode; subtitle?: ReactNode; actions?: ReactNode; visual?: ReactNode;
}) {
  const theme = useUITheme();
  return (
    <section className="ui-hero">
      <div className="ui-hero-copy">
        {eyebrow && <div>{eyebrow}</div>}
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
        {actions && <div className="ui-hero-actions">{actions}</div>}
      </div>
      <div className="ui-hero-visual">{visual ?? (theme === "depth" ? <HeroScene /> : theme === "pixel" ? <PixelScene /> : <Orb />)}</div>
    </section>
  );
}

export function Section({ id, kicker, title, desc, code, children }: {
  id?: string; kicker?: string; title: ReactNode; desc?: ReactNode; code?: string; children: ReactNode;
}) {
  return (
    <section id={id} className="ui-section">
      <Reveal>
        <div className="ui-section-head">
          {kicker && <div className="ui-kicker">{kicker}</div>}
          <h2>{title}</h2>
          {desc && <p>{desc}</p>}
          {code && <code className="ui-code">{code}</code>}
        </div>
      </Reveal>
      <Reveal delay={120}>{children}</Reveal>
    </section>
  );
}

export function Marquee({ items, speed = 28 }: { items: ReactNode[]; speed?: number }) {
  return (
    <div className="ui-marquee">
      <div className="ui-marquee-track" style={{ animationDuration: `${speed}s` }}>
        {[...items, ...items].map((it, i) => <span key={i} className="ui-marquee-item" aria-hidden={i >= items.length}>{it}</span>)}
      </div>
    </div>
  );
}

export const Footer = ({ children }: { children: ReactNode }) => <footer className="ui-footer">{children}</footer>;
