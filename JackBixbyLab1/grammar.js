"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
exports.__esModule = true;
var Grammar = /** @class */ (function () {
    function Grammar(grammar) {
        var e_1, _a;
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
            console.log("Left: " + input2[0] + " Right: " + input2[1]);
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
            if (input[i].split(" -> ").length !== 2) {
                throw new Error("Second:Inncorrect length of " + input[i] + "!");
            }
            var input2 = input[i].split(" -> ");
            console.log("Left: " + input2[0] + " Right: " + input2[1]);
            if (this.set.has(input2[0])) {
                //throw new Error("Grammar contains multiple variables " + input2[0]);
            }
            this.set.add(input2[0]);
        }
        var final_i = back_i;
        for (back_i++; back_i < input.length - 1; back_i++) {
            var input2 = input[back_i].split(" -> ");
            var input3 = input2[1].split(" ");
            console.log("Input3: " + input3);
            for (var j = 0; j < input3.length; j++) {
                if (!this.set.has(input3[j]) && input3[j] != "|" && input3[j] != "") {
                    throw new Error("Undefined Sign " + input3[j]);
                }
            }
            for (var j = 0; j < input3.length; j++) {
                if (input3[j] != "|" && input3[j] != "") {
                    if (this.nonterminals.has(input2[0])) {
                        this.nonterminals.get(input2[0]).push(input3[j]);
                    }
                    else {
                        this.nonterminals.set(input2[0], [input3[j]]);
                    }
                }
            }
        }
        console.log(this.nonterminals);
        console.log(this.terminals);
        var visited = new Set();
        var first_string = this.nonterminals.keys();
        dfs(first_string.next().value, this.nonterminals, visited, this.terminals);
        console.log("Visited Size: " + visited.size);
        if (this.nonterminals.size == 0) {
            return;
        }
        try {
            for (var _b = __values(this.set.keys()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var k = _c.value;
                if (!visited.has(k) && k !== "WHITESPACE") {
                    throw new Error("Useless Production Found " + k);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
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