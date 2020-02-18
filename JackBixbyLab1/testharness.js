"use strict";
exports.__esModule = true;
var fs = require("fs");
var shuntingyard_1 = require("./shuntingyard");
var testCount = 0;
function main() {
    var ok = testWithFile("basictests.txt");
    if (ok)
        console.log("=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-Basic tests OK-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");
    else
        return;
    ok = testWithFile("bonus1tests.txt");
    if (ok)
        console.log("-=-=-=-=-=-=-=-=-=-=-Bonus 1 tests (1+ argument functions) OK-=-=-=-=-=-=-=-=-=-=-");
    else
        return;
    ok = testWithFile("bonus2tests.txt");
    if (ok)
        console.log("-=-=-=-=-=-=-=-=-=-=-Bonus 2 tests (0+ argument functions) OK-=-=-=-=-=-=-=-=-=-=-");
    else
        return;
    console.log(testCount + " tests OK");
}
function testWithFile(fname) {
    var data = fs.readFileSync(fname, "utf8");
    var lst = data.split(/\n/g);
    for (var i = 0; i < lst.length; ++i) {
        var line = lst[i].trim();
        if (line.length === 0)
            continue;
        var idx = line.indexOf("\t");
        var inp = line.substring(0, idx);
        var expectedStr = line.substring(idx);
        console.log("Testing " + inp + " ...");
        ++testCount;
        var expected = JSON.parse(expectedStr);
        var actual = shuntingyard_1.parse(inp);
        if (!treesAreSame(actual, expected)) {
            console.log("BAD!");
            console.log(inp);
            dumpTree("actual.dot", actual);
            dumpTree("expected.dot", expected);
            return false;
        }
        else {
        }
    }
    return true;
}
function treesAreSame(n1, n2) {
    if (n1 === undefined && n2 !== undefined)
        return false;
    if (n2 === undefined && n1 !== undefined)
        return false;
    if (n1["sym"] != n2["sym"])
        return false;
    if (n1["children"].length != n2["children"].length)
        return false;
    for (var i = 0; i < n1["children"].length; ++i) {
        if (!treesAreSame(n1["children"][i], n2["children"][i]))
            return false;
    }
    return true;
}
function dumpTree(fname, root) {
    function walk(n, callback) {
        callback(n);
        n.children.forEach(function (x) {
            walk(x, callback);
        });
    }
    var L = [];
    L.push("digraph d{");
    L.push("node [fontname=\"Helvetica\",shape=box];");
    var counter = 0;
    walk(root, function (n) {
        n.NUMBER = "n" + (counter++);
        var tmp = n.sym;
        tmp = tmp.replace(/&/g, "&amp;");
        tmp = tmp.replace(/</g, "&lt;");
        tmp = tmp.replace(/>/g, "&gt;");
        tmp = tmp.replace(/\n/g, "<br/>");
        L.push(n.NUMBER + " [label=<" + tmp + ">];");
    });
    walk(root, function (n) {
        n.children.forEach(function (x) {
            L.push(n.NUMBER + " -> " + x.NUMBER + ";");
        });
    });
    L.push("}");
    fs.writeFileSync(fname, L.join("\n"));
}
main();
//# sourceMappingURL=testharness.js.map