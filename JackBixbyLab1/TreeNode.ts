import { Token } from "./Token"

export class TreeNode {
    sym: string;
    token: Token;
    children: TreeNode[];
    constructor(sym: string, token: Token) {
        this.sym = sym;
        this.token = token;
        this.children = [];
    }

    addChild(node : TreeNode) {
        this.children.push(node);
    }


}