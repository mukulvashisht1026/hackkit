import { HTMLAttributes, ReactNode } from "react";
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    /** true = strong tilt, number = max degrees, false = off. Default: subtle in 3D theme, off in dreamy. */
    tilt?: boolean | number;
}
export declare function Card({ tilt, className, children, ...rest }: CardProps): import("react").JSX.Element;
export type Tone = "accent" | "ok" | "bad" | "warn" | "neutral";
export declare const Badge: ({ tone, dot, children }: {
    tone?: Tone;
    dot?: boolean;
    children: ReactNode;
}) => import("react").JSX.Element;
export declare function Avatar({ name, src, size, status }: {
    name: string;
    src?: string;
    size?: number;
    status?: "online" | "away" | "off";
}): import("react").JSX.Element;
export declare function AvatarGroup({ names, max, size }: {
    names: string[];
    max?: number;
    size?: number;
}): import("react").JSX.Element;
export declare const Tooltip: ({ tip, children }: {
    tip: string;
    children: ReactNode;
}) => import("react").JSX.Element;
export declare function Sparkline({ data, height }: {
    data: number[];
    height?: number;
}): import("react").JSX.Element;
export declare function StatCard({ label, value, prefix, suffix, decimals, delta, spark, icon }: {
    label: string;
    value: number;
    prefix?: string;
    suffix?: string;
    decimals?: number;
    delta?: number;
    spark?: number[];
    icon?: ReactNode;
}): import("react").JSX.Element;
export interface TabDef {
    id: string;
    label: ReactNode;
}
/** Segmented tabs with a springy sliding indicator. */
export declare function Tabs({ tabs, value, onChange, variant }: {
    tabs: TabDef[];
    value: string;
    onChange: (id: string) => void;
    variant?: "pill" | "line";
}): import("react").JSX.Element;
export declare function Accordion({ items, defaultOpen }: {
    items: {
        title: ReactNode;
        content: ReactNode;
    }[];
    defaultOpen?: number;
}): import("react").JSX.Element;
export declare function Stepper({ steps, current }: {
    steps: string[];
    current: number;
}): import("react").JSX.Element;
