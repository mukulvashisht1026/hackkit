/**
 * Pixel / retro-game skin extras: sprite renderer, original sprites, the hero scene, the parallax
 * backdrop, and a small game layer (coins for clicks, levels, achievements, optional 8-bit sound).
 */
import { CSSProperties, ReactNode } from "react";
export declare const ROBOT: string[];
export declare const COIN: string[];
export declare const HEART: string[];
export declare const STAR: string[];
/** Pixel art from strings: one char per pixel, "." is transparent, letters map to the palette. */
export declare function Sprite({ art, scale, colors, title, className, style }: {
    art: string[];
    scale?: number;
    colors?: Record<string, string>;
    title?: string;
    className?: string;
    style?: CSSProperties;
}): import("react").JSX.Element;
interface Game {
    score: number;
    level: number;
    xp: number;
    sound: boolean;
    setSound: (on: boolean) => void;
    add: (n: number, at?: {
        x: number;
        y: number;
    }) => void;
}
export declare const useGame: () => Game | null;
/** Wrap a page to turn clicks into coins. Off (pass-through) unless `enabled`. */
export declare function GameLayer({ enabled, children }: {
    enabled: boolean;
    children: ReactNode;
}): import("react").JSX.Element;
/** Score / level / XP readout, plus the sound toggle. */
export declare function PixelHUD(): import("react").JSX.Element | null;
export declare function PixelScene(): import("react").JSX.Element;
export declare function PixelBackground(): import("react").JSX.Element;
export {};
