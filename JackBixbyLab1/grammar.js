"use strict";
exports.__esModule = true;
var Grammar = /** @class */ (function () {
    function Grammar(grammar) {
        this.set = new Set();
        this.terminals = new Array();
        this.nonterminals = new Map();
        var input = grammar.split("\n");
        var i = 0;
        for (; i < input.length - 1; i++) {
            if (input[i] == "") {
                break;
            }
            if (input[i].split(" -> ").length !== 2) {
                throw new Error("First:Inncorrect length of " + input[i]);
            }
            var input2 = input[i].split(" -> ");
            //console.log("Left: " + input2[0] + " Right: " + input2[1]);
            if (this.set.has(input2[0])) {
                throw new Error("Grammar contains multiple variables " + input2[0]);
            }
            this.set.add(input2[0]);
            var rex = new RegExp(input2[1], "gy");
            this.terminals.push([input2[0], rex]);
        }
        this.set.add("WHITESPACE");
        this.terminals.push(["WHITESPACE", RegExp(/\s/gy)]);
        var back_i = i;
        for (i++; i < input.length - 1; i++) {
            var input2 = input[i].split("->");
            input2.forEach(function (val) {
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
        var final_i = back_i;
        for (back_i++; back_i < input.length - 1; back_i++) {
            var input2 = input[back_i].split("->");
            input2.forEach(function (val) {
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
            var input3 = input2[1].split("|");
            input3.forEach(function (val) {
                val.trim();
            });
            /*if (input3.length !== 2) {
                continue;
            }*/
            var input4 = new Array();
            var input5 = void 0;
            for (var j = 0; j < input3.length; j++) {
                input5 = input3[j].split(" ");
                input5.forEach(function (val) {
                    val.trim();
                });
                input4.push(input5.filter(function (element, index) {
                    return element !== "";
                }));
            }
            if (this.nonterminals.has(input2[0].trim())) {
                this.nonterminals.get(input2[0].trim()).concat(input4);
            }
            else {
                this.nonterminals.set(input2[0].trim(), input4);
            }
        }
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
    Grammar.prototype.getNullable = function () {
        var nullable = new Set();
        var _loop_1 = function () {
            var flag = true;
            this_1.nonterminals.forEach(function (v, k) {
                v.forEach(function (P) {
                    if (P.length == 1 && P[0] == "lambda") {
                        P = new Array();
                    }
                    if (!nullable.has(k)) {
                        var horse = P.every(function (x) {
                            return nullable.has(x);
                        });
                        if (horse) {
                            nullable.add(k);
                            flag = false;
                        }
                    }
                });
            });
            if (flag) {
                return "break";
            }
        };
        var this_1 = this;
        while (true) {
            var state_1 = _loop_1();
            if (state_1 === "break")
                break;
        }
        return nullable;
    };
    return Grammar;
}());
exports.Grammar = Grammar;
function dfs(start, nonterminals, visited, terminals) {
    for (var j = 0; j < terminals.length; j++) {
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
        for (var k = 0; k < nonterminals.get(start).length; k++) {
            console.log(nonterminals.get(start));
            dfs(nonterminals.get(start)[k], nonterminals, visited, terminals);
        }
    }
}
//# sourceMappingURL=grammar.js.map