/**
 * Dependency-free SVG charts that share the kit's themes.
 * Series colors come from --s1..--s4 (validated categorical order, see ui.css); assign by the
 * series' position in the full list so hiding one never repaints the rest. Max 4 series per chart.
 */
import { ReactNode } from "react";
export declare const seriesColor: (i: number) => string;
export declare const fmtCompact: (v: number) => string;
export interface Series {
    name: string;
    values: number[];
}
export interface LegendItem {
    name: string;
    color: string;
    active?: boolean;
    onToggle?: () => void;
    shape?: number;
}
export declare function Legend({ items }: {
    items: LegendItem[];
}): import("react").JSX.Element;
/** Shapes double-encode group identity so color is never the only cue. */
export declare function Swatch({ color, shape, size }: {
    color: string;
    shape?: number;
    size?: number;
}): import("react").JSX.Element;
export interface TableData {
    columns: string[];
    rows: (string | number)[][];
}
export declare function ChartCard({ title, subtitle, legend, table, actions, children }: {
    title: ReactNode;
    subtitle?: ReactNode;
    legend?: LegendItem[];
    table?: TableData;
    actions?: ReactNode;
    children: ReactNode;
}): import("react").JSX.Element;
export declare function LineChart({ labels, series, height, area, hidden, format }: {
    labels: string[];
    series: Series[];
    height?: number;
    area?: boolean;
    hidden?: string[];
    format?: (v: number) => string;
}): import("react").JSX.Element;
export declare function BarChart({ labels, series, height, format }: {
    labels: string[];
    series: Series[];
    height?: number;
    format?: (v: number) => string;
}): import("react").JSX.Element;
export declare function DonutChart({ slices, size, format, label }: {
    slices: {
        name: string;
        value: number;
    }[];
    size?: number;
    format?: (v: number) => string;
    label?: string;
}): import("react").JSX.Element;
export interface ScatterGroup {
    name: string;
    points: {
        x: number;
        y: number;
        label?: string;
    }[];
}
/** Up to 3 groups (validated all-pairs); each group also gets its own marker shape. */
export declare function ScatterChart({ groups, height, xLabel, yLabel, trend, formatX, formatY }: {
    groups: ScatterGroup[];
    height?: number;
    xLabel?: string;
    yLabel?: string;
    trend?: boolean;
    formatX?: (v: number) => string;
    formatY?: (v: number) => string;
}): import("react").JSX.Element;
export declare function summarize(values: number[]): {
    n: number;
    mean: number;
    sd: number;
    median: number;
    p95: number;
    min: number;
    max: number;
};
export declare function Histogram({ values, bins, height, unit, format }: {
    values: number[];
    bins?: number;
    height?: number;
    unit?: string;
    format?: (v: number) => string;
}): import("react").JSX.Element;
export declare function Heatmap({ rows, cols, values, cell, format, colEvery }: {
    rows: string[];
    cols: string[];
    values: number[][];
    cell?: number;
    format?: (v: number) => string;
    colEvery?: number;
}): import("react").JSX.Element;
