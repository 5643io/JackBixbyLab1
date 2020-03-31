"use strict";
exports.__esModule = true;
var TreeNode_1 = require("./TreeNode");
var Token_1 = require("./Token");
var asmCode = "";
var antlr4 = require('./antlr4');
var Lexer = require('./gramLexer.js').gramLexer;
var Parser = require('./gramParser.js').gramParser;
var ErrorHandler = /** @class */ (function () {
    function ErrorHandler() {
    }
    ErrorHandler.prototype.syntaxError = function (rec, sym, line, column, msg, e) {
        console.log("Syntax error:", msg, "on line", line, "at column", column);
        throw new Error("Syntax error in ANTLR parse");
    };
    return ErrorHandler;
}());
function parse(txt) {
    var stream = new antlr4.InputStream(txt);
    var lexer = new Lexer(stream);
    var tokens = new antlr4.CommonTokenStream(lexer);
    var parser = new Parser(tokens);
    parser.buildParseTrees = true;
    //this assumes your start symbol is 'start'
    var handler = new ErrorHandler();
    lexer.removeErrorListeners();
    lexer.addErrorListener(handler);
    parser.removeErrorListeners();
    parser.addErrorListener(handler);
    var antlrroot = parser.program();
    var root = walk(parser, antlrroot);
    console.log(root.toString());
    return makeAsm(root);
}
exports.parse = parse;
function walk(parser, node) {
    var p = node.getPayload();
    if (p.ruleIndex === undefined) {
        var line = p.line;
        var lexeme = p.text;
        var ty = p.type;
        var sym = parser.symbolicNames[ty];
        if (sym === null)
            sym = lexeme.toUpperCase();
        var T = new Token_1.Token(sym, lexeme, line);
        return new TreeNode_1.TreeNode(sym, T);
    }
    else {
        var idx = p.ruleIndex;
        var sym = parser.ruleNames[idx];
        var N = new TreeNode_1.TreeNode(sym, undefined);
        for (var i = 0; i < node.getChildCount(); ++i) {
            var child = node.getChild(i);
            N.children.push(walk(parser, child));
        }
        return N;
    }
}
function ICE() {
    throw new Error("ICE ICE baby");
}
function emit(instr) {
    asmCode += instr;
    asmCode += "\n";
    console.log("emitting " + instr);
}
function braceblockNodeCode(n) {
    //braceblock -> LBR stmts RBR
    stmtsNodeCode(n.children[1]);
}
function stmtsNodeCode(n) {
    //stmts -> stmt stmts | lambda
    if (n.children.length == 0)
        return;
    stmtNodeCode(n.children[0]);
    stmtsNodeCode(n.children[1]);
}
function stmtNodeCode(n) {
    //stmt -> cond | loop | return-stmt SEMI
    var c = n.children[0];
    switch (c.sym) {
        case "cond":
            condNodeCode(c);
            break;
        case "loop":
            loopNodeCode(c);
            break;
        case "return_stmt":
            returnstmtNodeCode(c);
            break;
        default:
            ICE();
    }
}
function returnstmtNodeCode(n) {
    //return-stmt -> RETURN expr
    exprNodeCode(n.children[1]);
    //...move result from expr to rax...
    emit("ret");
}
function exprNodeCode(n) {
    //expr -> NUM
    var d = parseInt(n.children[0].token.lexeme, 10);
    emit("mov rax, " + d);
}
var labelCounter = 0;
function label() {
    var s = "label" + labelCounter;
    labelCounter++;
    return s;
}
function condNodeCode(n) {
    //cond -> IF LP expr RP braceblock |
    //  IF LP expr RP braceblock ELSE braceblock
    if (n.children.length === 5) {
        //no 'else'
        exprNodeCode(n.children[2]); //leaves result in rax
        emit("cmp rax, 0");
        var endifLabel = label();
        emit("je " + endifLabel);
        braceblockNodeCode(n.children[4]);
        emit(endifLabel + ":");
    }
    else {
        exprNodeCode(n.children[2]); //leaves result in rax
        emit("cmp rax, 0");
        var elseLabel = label();
        emit("je " + elseLabel);
        braceblockNodeCode(n.children[4]);
        var endifLabel = label();
        emit("je " + endifLabel);
        emit(elseLabel + ":");
        braceblockNodeCode(n.children[6]);
        emit(endifLabel + ":");
    }
}
function loopNodeCode(n) {
    var startLabel = label();
    emit(startLabel + ":");
    exprNodeCode(n.children[2]); //leaves result in rax
    emit("cmp rax, 0");
    var endLabel = label();
    emit("je " + endLabel);
    braceblockNodeCode(n.children[4]);
    emit("jmp " + startLabel);
    emit(endLabel + ":");
}
function programNodeCode(n) {
    //program -> braceblock
    if (n.sym != "program")
        ICE();
    braceblockNodeCode(n.children[1]);
}
function makeAsm(root) {
    asmCode = "";
    labelCounter = 0;
    emit("default rel");
    emit("section .text");
    emit("global main");
    emit("main:");
    programNodeCode(root);
    emit("ret");
    emit("section .data");
    return asmCode + "\n";
}
//# sourceMappingURL=parser.js.map