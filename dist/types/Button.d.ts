import { ButtonHTMLAttributes, ReactNode } from "react";
export type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "glow" | "gradient" | "danger" | "success";
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: "sm" | "md" | "lg";
    loading?: boolean;
    icon?: ReactNode;
    iconRight?: ReactNode;
    pill?: boolean;
    /** Equal width/height, for icon-only buttons (pass aria-label). */
    square?: boolean;
    block?: boolean;
    /** Button drifts toward the pointer. */
    magnetic?: boolean;
    ripple?: boolean;
}
export declare function Button({ variant, size, loading, icon, iconRight, pill, square, block, magnetic, ripple, className, children, disabled, onClick, onPointerMove, onPointerLeave, ...rest }: ButtonProps): import("react").JSX.Element;
