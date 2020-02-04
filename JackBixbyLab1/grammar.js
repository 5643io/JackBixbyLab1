"use strict";
exports.__esModule = true;
var Grammar = /** @class */ (function () {
    function Grammar(grammar) {
        this.set = new Set();
        this.terminals = new Array();
        this.nonterminals = new Array();
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
            console.log("Left: " + input2[0] + " Right: " + input2[1]);
            if (this.set.has(input2[0])) {
                throw new Error("Grammar contains multiple variables " + input2[0]);
            }
            this.set.add(input2[0]);
            var rex = new RegExp(input2[1], "gy");
            this.terminals.push([input2[0], rex]);
        }
        this.set.add("WHITESPACE");
        this.terminals.push(["WHITESPACE", RegExp(" +", "gy")]);
        i++;
        var back_i = i;
        for (; i < input.length - 1; i++) {
            if (input[i].split(" -> ").length !== 2) {
                throw new Error("Second:Inncorrect length of " + input[i] + "!");
            }
            var input2 = input[i].split(" -> ");
            console.log("Left: " + input2[0] + " Right: " + input2[1]);
            if (this.set.has(input2[0])) {
                throw new Error("Grammar contains multiple variables " + input2[0]);
            }
            this.set.add(input2[0]);
        }
        for (; back_i < input.length - 1; back_i++) {
            var input2 = input[back_i].split(" -> ");
            var input3 = input2[1].split(" ");
            for (var j = 0; j < input3.length; j++) {
                if (!this.set.has(input3[j]) && input3[j] != "|") {
                    throw new Error("Undefined Sign " + input3[j]);
                }
            }
            var input4 = input2[1].split(" | ");
            var tmp = Array();
            for (var k = 0; k < input4.length; k++) {
                tmp.push(input4[k]);
            }
            this.nonterminals.push([input2[0], tmp]);
        }
    }
    return Grammar;
}());
exports.Grammar = Grammar;
