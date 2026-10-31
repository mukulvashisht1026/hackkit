/** Shared plumbing for the UI kit: theme context, class helper, motion hooks, portal. */
import { ReactNode } from "react";
export type UITheme = "dreamy" | "depth" | "pixel";
export declare const ThemeCtx: import("react").Context<UITheme>;
export declare const useUITheme: () => UITheme;
/** undefined = follow the OS reduced-motion setting; true/false = user forced animations on/off. */
export declare const MotionCtx: import("react").Context<boolean | undefined>;
export declare const motionClass: (m: boolean | undefined) => "is-motion" | "is-still" | undefined;
export declare const cx: (...c: (string | false | null | undefined | 0)[]) => string;
export declare const uid: () => string;
export declare const prefersReducedMotion: () => boolean;
export declare const useReducedMotion: () => boolean;
/** Pointer-follow tilt. Always sets --mx/--my (for glow); rotates only when max > 0. */
export declare function useTilt<T extends HTMLElement>(max?: number): import("react").RefObject<T>;
export declare function useInView<T extends Element>(once?: boolean): readonly [import("react").RefObject<T>, boolean];
/** Eased count from 0 to target once `run` turns true. */
export declare function useCountUp(target: number, run: boolean, ms?: number): number;
/** Renders into <body> but re-applies the theme class so tokens still resolve. */
export declare function Portal({ children }: {
    children: ReactNode;
}): import("react").ReactPortal | null;
export declare function Reveal({ children, delay, className }: {
    children: ReactNode;
    delay?: number;
    className?: string;
}): import("react").JSX.Element;
