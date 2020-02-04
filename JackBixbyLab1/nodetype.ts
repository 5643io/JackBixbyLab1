export class NodeType {
    label: string;
    n: NodeType[];
    constructor(L: string) {
        this.label = L;
        this.n = [];
    }
}

function dfs(N: NodeType, v: Set<string>) {
    v.add(N.label);
    N.n.forEach((w: NodeType) => {
        if (!v.has(w.label))
            dfs(w, v);
    });
}