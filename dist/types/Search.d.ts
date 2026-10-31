import { ReactNode } from "react";
export interface SearchItem {
    label: string;
    hint?: string;
    icon?: ReactNode;
}
export declare function SearchBar({ items, placeholder, onSearch, onSelect, loading, shortcut, autoFocus, inline }: {
    items?: SearchItem[];
    placeholder?: string;
    onSearch?: (q: string) => void;
    onSelect?: (item: SearchItem) => void;
    loading?: boolean;
    /** Single key that focuses the bar from anywhere, e.g. "/". */
    shortcut?: string;
    autoFocus?: boolean;
    /** Results list always shown below (used by CommandPalette). */
    inline?: boolean;
}): import("react").JSX.Element;
/** ⌘K / Ctrl+K palette: a SearchBar in a modal. */
export declare function CommandPalette({ items, open, onOpenChange, onSelect }: {
    items: SearchItem[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect?: (item: SearchItem) => void;
}): import("react").JSX.Element;
