export class Grammar {
    set: Set<string>;
    terminals: Array<[string, RegExp]>;
    constructor(grammar: string) {
        this.set = new Set();
        this.terminals = new Array<[string, RegExp]>();
        let input = grammar.split("\n");
        for (let i = 0; i < input.length - 1; i++) {
            if (input[i].split(" -> ").length != 2) {
                throw new Error("Inncorrect length of " + input[i]);
            }
            let input2 = input[i].split(" -> ");
            console.log("Left: " + input2[0] + " Right: " + input2[1]);
            if (this.set.has(input2[0])) {
                throw new Error("Grammar contains multiple variables " + input2[0]);
            }
            this.set.add(input2[0]);
            let rex = new RegExp(input2[1], "gy");
            this.terminals.push([input2[0], rex]);
        }
        this.set.add("WHITESPACE");
        this.terminals.push(["WHITESPACE", RegExp(" +", "gy")]);
    }
}