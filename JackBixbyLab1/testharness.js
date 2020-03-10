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
var fs = require("fs");
var Grammar_1 = require("./Grammar");
function main() {
    var data = fs.readFileSync("tests.txt", "utf8");
    var tests = JSON.parse(data);
    var numPassed = 0;
    var numFailed = 0;
    for (var i = 0; i < tests.length; ++i) {
        var name_1 = tests[i]["name"];
        var expected = tests[i]["first"];
        var input = tests[i]["input"];
        var G = new Grammar_1.Grammar(input);
        var first = G.getFirst();
        if (!dictionariesAreSame(expected, first)) {
            console.log("Test " + name_1 + " failed");
            ++numFailed;
        }
        else
            ++numPassed;
    }
    console.log(numPassed + " tests OK" + "      " + numFailed + " tests failed");
    return numFailed == 0;
}
function dictionariesAreSame(s1, s2) {
    var e_1, _a, e_2, _b, e_3, _c;
    var M1 = toMap(s1);
    var M2 = s2;
    var k1 = [];
    var k2 = [];
    try {
        for (var _d = __values(M1.keys()), _e = _d.next(); !_e.done; _e = _d.next()) {
            var k = _e.value;
            k1.push(k);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_e && !_e.done && (_a = _d["return"])) _a.call(_d);
        }
        finally { if (e_1) throw e_1.error; }
    }
    try {
        for (var _f = __values(M2.keys()), _g = _f.next(); !_g.done; _g = _f.next()) {
            var k = _g.value;
            k2.push(k);
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_g && !_g.done && (_b = _f["return"])) _b.call(_f);
        }
        finally { if (e_2) throw e_2.error; }
    }
    k1.sort();
    k2.sort();
    if (!listsEqual(k1, k2)) {
        console.log("Lists not equal:", k1, k2);
        return false;
    }
    try {
        for (var k1_1 = __values(k1), k1_1_1 = k1_1.next(); !k1_1_1.done; k1_1_1 = k1_1.next()) {
            var k = k1_1_1.value;
            if (!listsEqual(M1.get(k), M2.get(k))) {
                console.log("Lists not equal:", M1.get(k), M2.get(k));
                return false;
            }
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (k1_1_1 && !k1_1_1.done && (_c = k1_1["return"])) _c.call(k1_1);
        }
        finally { if (e_3) throw e_3.error; }
    }
    return true;
}
function toMap(s) {
    var r = new Map();
    var _loop_1 = function (k) {
        r.set(k, new Set());
        s[k].forEach(function (x) {
            r.get(k).add(x);
        });
    };
    for (var k in s) {
        _loop_1(k);
    }
    return r;
}
function listsEqual(L1a, L2a) {
    var L1 = [];
    var L2 = [];
    L1a.forEach(function (x) {
        L1.push(x);
    });
    L2a.forEach(function (x) {
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