export class Grammar {
    set: Set<string>;
    terminals: Array<[string, RegExp]>;
    nonterminals: Map<string, string[]>;
    constructor(grammar: string) {
        this.set = new Set();
        this.terminals = new Array<[string, RegExp]>();
        this.nonterminals = new Map<string, string[]>();
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
        this.terminals.push(["WHITESPACE", RegExp(/\s/gy)]);
        let back_i = i;
        for (i++; i < input.length - 1; i++) {
            if (input[i].split(" -> ").length !== 2) {
                throw new Error("Second:Inncorrect length of " + input[i] + "!");
            }
            let input2 = input[i].split(" -> ");
            console.log("Left: " + input2[0] + " Right: " + input2[1]);
            if (this.set.has(input2[0])) {
                //throw new Error("Grammar contains multiple variables " + input2[0]);
            }
            this.set.add(input2[0]);
        }
        let final_i = back_i;
        for (back_i++; back_i < input.length - 1; back_i++) {
            let input2 = input[back_i].split(" -> ");
            let input3 = input2[1].split(" ");
            console.log("Input3: " + input3);
            for (let j = 0; j < input3.length; j++) {
                if (!this.set.has(input3[j]) && input3[j] != "|" && input3[j] != "") {
                    throw new Error("Undefined Sign " + input3[j]);
                }
            }
            for (let j = 0; j < input3.length; j++) {
                if (input3[j] != "|" && input3[j] != "") {
                    if (this.nonterminals.has(input2[0])) {
                        this.nonterminals.get(input2[0]).push(input3[j]);
                    } else {
                        this.nonterminals.set(input2[0], [input3[j]]);
                    }
                }
            }
        }
        console.log(this.nonterminals);
        console.log(this.terminals);
        let visited = new Set<string>();
        const first_string = this.nonterminals.keys();
        dfs(first_string.next().value, this.nonterminals, visited, this.terminals);
        console.log("Visited Size: " + visited.size);
        for(let k of this.set.keys() ) {
            if (!visited.has(k) && k !== "WHITESPACE") {
                throw new Error("Useless Production Found " + k);
            }
        }
    }
}

function dfs(start: string, nonterminals: Map<string, string[]>, visited: Set<string>, terminals: Array<[string, RegExp]>) {
    console.log("Start is: " + start);
    for (let j = 0; j < terminals.length; j++) {
        if (terminals[j][0] == start) {
            visited.add(start);
            return;
        }
    }
    if (start == "") {
        return;
    }
    if (!visited.has(start)) {
        visited.add(start);
        for (let k = 0; k < nonterminals.get(start).length; k++) {
            console.log(nonterminals.get(start));
            dfs(nonterminals.get(start)[k], nonterminals, visited, terminals);
        }
    }
}