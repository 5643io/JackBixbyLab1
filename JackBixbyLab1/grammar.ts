import { NodeType } from "./NodeType"

export class Grammar {
    set: Set<string>;
    terminals: Array<[string, RegExp]>;
    nonterminals: Array<[string, Array<string>]>;
    constructor(grammar: string) {
        this.set = new Set();
        this.terminals = new Array<[string, RegExp]>();
        this.nonterminals = new Array<[string, Array<string>]>();
        let input = grammar.split("\n");
        let i = 0;
        for (; i < input.length - 1; i++) {
            if (input[i] == "") {
                break;
            }
            if (input[i].split(" -> ").length !== 2) {
                throw new Error("First:Inncorrect length of " + input[i]);
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
        let back_i = i++;
        for (i++; i < input.length - 1; i++) {
            if (input[i].split(" -> ").length !== 2) {
                throw new Error("Second:Inncorrect length of " + input[i] + "!");
            }
            let input2 = input[i].split(" -> ");
            console.log("Left: " + input2[0] + " Right: " + input2[1]);
            if (this.set.has(input2[0])) {
                throw new Error("Grammar contains multiple variables " + input2[0]);
            }
            this.set.add(input2[0]);
        }
        let final_i = back_i;
        for (; back_i < input.length - 1; back_i++) {
            let input2 = input[back_i].split(" -> ");
            let input3 = input2[1].split(" ");
            for (let j = 0; j < input3.length; j++) {
                if (!this.set.has(input3[j]) && input3[j] != "|") {
                    throw new Error("Undefined Sign " + input3[j]);
                }
            }
            let input4 = input2[1].split(" | ");
            let tmp = Array<string>();
            for (let k = 0; k < input4.length; k++) {
                tmp.push(input4[k]);
            }
            this.nonterminals.push([input2[0], tmp]);
        }

    }
}