"use strict";
exports.__esModule = true;
var TreeNode = /** @class */ (function () {
    function TreeNode(sym, token) {
        this.sym = sym;
        this.token = token;
        this.children = [];
    }
    TreeNode.prototype.addChild = function (node) {
        this.children.push(node);
    };
    TreeNode.prototype.toString = function () {
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
        walk(this, function (n) {
            n.NUMBER = n.sym + (counter++);
            var tmp = n.sym;
            if (n.token) {
                tmp += "\n";
                tmp += n.token.lexeme;
            }
            tmp = tmp.replace(/&/g, "&amp;");
            tmp = tmp.replace(/</g, "&lt;");
            tmp = tmp.replace(/>/g, "&gt;");
            tmp = tmp.replace(/\n/g, "<br/>");
            L.push(n.NUMBER + " [label=<" + tmp + ">];");
        });
        walk(this, function (n) {
            n.children.forEach(function (x) {
                L.push(n.NUMBER + " -> " + x.NUMBER + ";");
            });
        });
        L.push("}");
        return L.join("\n");
    };
    return TreeNode;
}());
exports.TreeNode = TreeNode;
//# sourceMappingURL=TreeNode.js.map