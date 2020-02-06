"use strict";
exports.__esModule = true;
var NodeType = /** @class */ (function () {
    function NodeType(L) {
        this.label = L;
        this.n = [];
    }
    return NodeType;
}());
exports.NodeType = NodeType;
function dfs(N, v) {
    v.add(N.label);
    N.n.forEach(function (w) {
        if (!v.has(w.label))
            dfs(w, v);
    });
}
//# sourceMappingURL=nodetype.js.map