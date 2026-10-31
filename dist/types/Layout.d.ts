import { ReactNode } from "react";
/** CSS-only 3D cube. */
export declare const Cube: ({ size }: {
    size?: number;
}) => import("react").JSX.Element;
/** Iridescent floating orb (dreamy hero visual). */
export declare const Orb: () => import("react").JSX.Element;
/** Cube + orbit rings that tilt toward the pointer (3D hero visual). */
export declare function HeroScene(): import("react").JSX.Element;
export declare const Logo: () => import("react").JSX.Element;
/** Fixed, animated page backdrop for the current theme. */
export declare function Background(): import("react").JSX.Element;
export declare function Hero({ eyebrow, title, subtitle, actions, visual }: {
    eyebrow?: ReactNode;
    title: ReactNode;
    subtitle?: ReactNode;
    actions?: ReactNode;
    visual?: ReactNode;
}): import("react").JSX.Element;
export declare function Section({ id, kicker, title, desc, code, children }: {
    id?: string;
    kicker?: string;
    title: ReactNode;
    desc?: ReactNode;
    code?: string;
    children: ReactNode;
}): import("react").JSX.Element;
export declare function Marquee({ items, speed }: {
    items: ReactNode[];
    speed?: number;
}): import("react").JSX.Element;
export declare const Footer: ({ children }: {
    children: ReactNode;
}) => import("react").JSX.Element;
