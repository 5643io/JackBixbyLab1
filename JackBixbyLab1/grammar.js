"use strict";
exports.__esModule = true;
var Grammar = /** @class */ (function () {
    function Grammar(grammar) {
        this.set = new Set();
        var input = grammar.split("\n");
        for (var i = 0; i < input.length - 1; i++) {
            if (input[i].split(" -> ").length != 2) {
                throw new Error("Inncorrect length of " + input[i]);
            }
            var input2 = input[i].split(" -> ");
            console.log("Left: " + input2[0] + " Right: " + input2[1]);
            if (this.set.has(input2[0])) {
                throw new Error("Grammar contains multiple variables " + input2[0]);
            }
            this.set.add(input2[0]);
            var rex = new RegExp(input2[1], "gy");
        }
    }
    return Grammar;
}());
exports.Grammar = Grammar;
