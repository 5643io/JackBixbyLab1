"use strict";
exports.__esModule = true;
var fs = require("fs");
var Grammar_1 = require("./Grammar");
function main() {
    var data = fs.readFileSync("tests.txt", "utf8");
    var tests = JSON.parse(data);
    var numPassed = 0;
    var numFailed = 0;
    for (var i = 0; i < tests.length; ++i) {
        var name_1 = tests[i]["name"];
        var expected = tests[i]["nullable"];
        var input = tests[i]["input"];
        var G = new Grammar_1.Grammar(input);
        var nullable = G.getNullable();
        if (!setsAreSame(nullable, expected)) {
            console.log("Test " + name_1 + " failed");
            ++numFailed;
        }
        else
            ++numPassed;
    }
    console.log(numPassed + " tests OK" + "      " + numFailed + " tests failed");
    return numFailed == 0;
}
function setsAreSame(s1, s2) {
    var L1 = [];
    var L2 = [];
    s1.forEach(function (x) {
        L1.push(x);
    });
    s2.forEach(function (x) {
        L2.push(x);
    });
    L1.sort();
    L2.sort();
    if (L1.length !== L2.length)
        return false;
    for (var i = 0; i < L1.length; ++i) {
        if (L1[i] !== L2[i])
            return false;
    }
    return true;
}
main();
//# sourceMappingURL=testharness.js.map