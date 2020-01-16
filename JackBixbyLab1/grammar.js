"use strict";
exports.__esModule = true;
var Grammar = /** @class */ (function () {
    function Grammar(grammar) {
        this.set = new Set();
        var input = grammar.split("\n");
        for (var st in input) {
            var input2 = st.split(" -> ");
            console.log("Left: " + input2[0] + " Right: " + input2[0]);
        }
    }
    return Grammar;
}());
exports.Grammar = Grammar;
