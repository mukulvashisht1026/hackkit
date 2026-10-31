export interface GraphNode {
    id: string;
    label: string;
    group: number;
    meta?: Record<string, string | number>;
}
export interface GraphEdge {
    source: string;
    target: string;
    weight?: number;
}
export interface GraphEvent {
    id: string | number;
    source: string;
    target: string;
}
export declare function EntityGraph({ nodes, edges, groups, height, events, selected, onSelect }: {
    nodes: GraphNode[];
    edges: GraphEdge[];
    groups: string[];
    height?: number;
    events?: GraphEvent[];
    selected?: string | null;
    onSelect?: (n: GraphNode | null) => void;
}): import("react").JSX.Element;
