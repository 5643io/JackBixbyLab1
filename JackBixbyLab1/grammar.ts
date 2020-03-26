export class Grammar {
    set: Set<string>;
    terminals: Array<[string, RegExp]>;
    nonterminals: Map<string, string[][]>;
    nullable: Set<string>;
    first: Map<string, Set<string>>;
    constructor(grammar: string) {
        this.nullable = new Set<string>();
        this.first = new Map<string, Set<string>>();
        this.set = new Set();
        this.terminals = new Array<[string, RegExp]>();
        this.nonterminals = new Map<string, string[][]>();
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
            //console.log("Left: " + input2[0] + " Right: " + input2[1]);
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
            let input2 = input[i].split("->");
            input2.forEach((val) => {
                val.trim();
            });
            if (input2.length !== 2) {
                continue;
                //throw new Error("Second:Inncorrect length of " + input[i] + "!");
            }
            
            //console.log("Left: " + input2[0] + " Right: " + input2[1]);
            if (this.set.has(input2[0])) {
                //throw new Error("Grammar contains multiple variables " + input2[0]);
            }
            this.set.add(input2[0].trim());
        }
        let final_i = back_i;
        for (back_i++; back_i < input.length - 1; back_i++) {
            let input2 = input[back_i].split("->");
            input2.forEach((val) => {
                val.trim();
            });
            if (input2.length !== 2) {
                continue;
            }
            /*let input3 = input2[1].split("|");
            input3.forEach((val) => {
                val.trim();
            });
            if (input3.length !== 2) {
                continue;
            }
            //console.log("Input3: " + input3);
            for (let j = 0; j < input3.length; j++) {
                if (!this.set.has(input3[j]) && input3[j] != "|" && input3[j] != "" && input3[j] != "lambda") {
                    throw new Error("Undefined Sign " + input3[j]);
                }
            }*/
            let input3 = input2[1].split("|");
            input3.forEach((val) => {
                val.trim();
            });
            /*if (input3.length !== 2) {
                continue;
            }*/
            let input4 = new Array<Array<string>>();
            let input5;
            for (let j = 0; j < input3.length; j++) {
                input5 = input3[j].split(" ");
                input5.forEach((val) => {
                    val.trim();
                });
                input4.push(input5.filter((element, index) => {
                    return element !== "";
                }));

            }
            if (this.nonterminals.has(input2[0].trim())) {
                this.nonterminals.get(input2[0].trim()).concat(input4);
            } else {
                input4.forEach((horse) => {
                    if (horse[0] == "lambda") {
                    }
                });
                this.nonterminals.set(input2[0].trim(), input4);
            }
        }
        this.getNullable();
        //console.log(this.nonterminals);
        //console.log(this.terminals);
        /*let visited = new Set<string>();
        const first_string = this.nonterminals.keys();
        dfs(first_string.next().value, this.nonterminals, visited, this.terminals);
        console.log("Visited Size: " + visited.size);
        if (this.nonterminals.size == 0) {
            return;
        }
        for(let k of this.set.keys() ) {
            if (!visited.has(k) && k !== "WHITESPACE") {
                throw new Error("Useless Production Found " + k);
            }
        }*/
    }

    getNullable() {
        while (true) {
            let flag = true;
            this.nonterminals.forEach((v, k) => {
                v.forEach((P: string[]) => {
                    if (P.length == 1 && P[0] == "lambda") {
                        P = new Array<string>();
                    }
                    if (!this.nullable.has(k)) {
                        let cur = P.every((x: string) => {
                            return this.nullable.has(x);
                        });
                        if (cur) {
                            this.nullable.add(k);
                            flag = false;
                        }
                    }
                });
            });
            if (flag) {
                break;
            }
        }
        return this.nullable;
    }

    getFirst(): Map<string, Set<string>>{
        this.terminals.forEach((v, k) => {
            let set = new Set<string>();
            set.add(v[0]);
            this.first.set(v[0], set);
        });
        this.nonterminals.forEach((v, k) => {
            let set = new Set<string>();
            this.first.set(k, set);
        });
        while (true) {
            let flag = true;
            this.nonterminals.forEach((v, k) => {
                v.forEach((P: string[]) => {
                    if (P.length == 1 && P[0] == "lambda") {
                        P = new Array<string>();
                    }
                    P.every((x: string) => {
                        this.first.get(x).forEach((s: string) => {
                            if (!this.first.get(k).has(s)) {
                                flag = false;
                                this.first.get(k).add(s);
                                
                            }
                        });
                            //this.first.get(k).add(x); //is this line needed?
                        if (this.nullable.has(x)) {
                                return true;
                            }
                        });
                });
            });
            this.first.delete("WHITESPACE");
            if (flag) {
                break;
            }
        }
        //console.log(this.first);
        return this.first;
    }
}

function dfs(start: string, nonterminals: Map<string, string[]>, visited: Set<string>, terminals: Array<[string, RegExp]>) {
    for (let j = 0; j < terminals.length; j++) {
        if (terminals[j][0] == start) {
            visited.add(start);
            return;
        }
    }
    if (start == "" || start == undefined) {
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