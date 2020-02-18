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
    return TreeNode;
}());
exports.TreeNode = TreeNode;
//# sourceMappingURL=TreeNode.js.map