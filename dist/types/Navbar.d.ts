import { ReactNode } from "react";
export interface NavItem {
    label: string;
    href?: string;
    onClick?: () => void;
    active?: boolean;
}
export declare function Navbar({ brand, items, actions, sticky }: {
    brand: ReactNode;
    items: NavItem[];
    actions?: ReactNode;
    sticky?: boolean;
}): import("react").JSX.Element;
