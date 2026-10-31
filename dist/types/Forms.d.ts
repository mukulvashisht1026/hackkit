import { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
/** Input with a floating label. */
export declare function Field({ label, icon, hint, error, className, ...rest }: InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    icon?: ReactNode;
    hint?: string;
    error?: string;
}): import("react").JSX.Element;
export declare function TextArea({ label, hint, className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label: string;
    hint?: string;
}): import("react").JSX.Element;
export declare function Select({ children, className, ...rest }: SelectHTMLAttributes<HTMLSelectElement>): import("react").JSX.Element;
export declare function Toggle({ label, checked, onChange }: {
    label?: ReactNode;
    checked: boolean;
    onChange: (v: boolean) => void;
}): import("react").JSX.Element;
export declare function Checkbox({ label, checked, onChange }: {
    label: ReactNode;
    checked: boolean;
    onChange: (v: boolean) => void;
}): import("react").JSX.Element;
export declare function Slider({ value, onChange, min, max, step, label }: {
    value: number;
    onChange: (v: number) => void;
    min?: number;
    max?: number;
    step?: number;
    label?: string;
}): import("react").JSX.Element;
export declare function FileDrop({ onFiles, accept, multiple, label, hint }: {
    onFiles?: (files: File[]) => void;
    accept?: string;
    multiple?: boolean;
    label?: string;
    hint?: string;
}): import("react").JSX.Element;
