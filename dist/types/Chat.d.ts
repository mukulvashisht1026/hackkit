export interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    text: string;
}
export interface ChatProps {
    /** Return the assistant reply. Throwing shows the error as a message. */
    onSend: (text: string, history: ChatMessage[]) => Promise<string>;
    title?: string;
    subtitle?: string;
    suggestions?: string[];
    initial?: ChatMessage[];
    placeholder?: string;
    /** Reveal replies character by character. */
    typewriter?: boolean;
}
export declare function Chat({ onSend, title, subtitle, suggestions, initial, placeholder, typewriter }: ChatProps): import("react").JSX.Element;
