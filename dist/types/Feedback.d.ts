import { ReactNode } from "react";
export declare const Spinner: ({ size }: {
    size?: number;
}) => import("react").JSX.Element;
export declare const Dots: () => import("react").JSX.Element;
export declare const Skeleton: ({ w, h, circle }: {
    w?: number | string;
    h?: number;
    circle?: boolean;
}) => import("react").JSX.Element;
export declare function Progress({ value, indeterminate }: {
    value?: number;
    indeterminate?: boolean;
}): import("react").JSX.Element;
export declare function ProgressRing({ value, size, stroke }: {
    value: number;
    size?: number;
    stroke?: number;
}): import("react").JSX.Element;
export declare function Modal({ open, onClose, title, children, footer, bare }: {
    open: boolean;
    onClose: () => void;
    title?: ReactNode;
    children: ReactNode;
    footer?: ReactNode;
    bare?: boolean;
}): import("react").JSX.Element | null;
export type ToastTone = "info" | "success" | "error" | "warn";
type PushToast = (t: {
    title: string;
    desc?: string;
    tone?: ToastTone;
}) => void;
export declare const useToast: () => PushToast;
export declare function ToastProvider({ children, duration }: {
    children: ReactNode;
    duration?: number;
}): import("react").JSX.Element;
export {};
