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
var VarType;
(function (VarType) {
    VarType[VarType["STRING"] = 0] = "STRING";
    VarType[VarType["INTEGER"] = 1] = "INTEGER";
    VarType[VarType["FLOAT"] = 2] = "FLOAT";
})(VarType = exports.VarType || (exports.VarType = {}));
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
    emit("pop rax");
    emit("ret");
}
/*function exprNodeCode(n: TreeNode) {
    //expr -> NUM
    let d = parseInt(n.children[0].token.lexeme, 10);
    emit(`push qword ${d}`);
}*/
function exprNodeCode(n) {
    return orexpNodeCode(n.children[0]);
}
function orexpNodeCode(n) {
    //orexp -> orexp OR andexp | andexp
    if (n.children.length === 1) {
        return andexpNodeCode(n.children[0]);
    }
    else {
        var orexpType = orexpNodeCode(n.children[0]);
        convertStackTopToZeroOrOneInteger(orexpType);
        var lbl = label();
        emit("cmp qword [rsp], 0");
        emit("jne " + lbl);
        emit("add rsp,8"); //discard left result (0)
        var andexpType = andexpNodeCode(n.children[2]);
        convertStackTopToZeroOrOneInteger(andexpType);
        emit(lbl + ":");
        return VarType.INTEGER; //always integer, even if float operands
    }
}
function andexpNodeCode(n) {
    //orexp -> orexp OR andexp | andexp
    if (n.children.length === 1) {
        return notexpNodeCode(n.children[0]);
    }
    else {
        var andexpType = andexpNodeCode(n.children[0]);
        convertStackTopToZeroOrOneInteger(andexpType);
        var lbl = label();
        emit("cmp qword [rsp], 0");
        emit("je " + lbl);
        emit("add rsp,8"); //discard left result (0)
        var notexpType = notexpNodeCode(n.children[2]);
        convertStackTopToZeroOrOneInteger(notexpType);
        emit(lbl + ":");
        return VarType.INTEGER; //always integer, even if float operands
    }
}
function notexpNodeCode(n) {
    if (n.children.length === 1) {
        return relexpNodeCode(n.children[0]);
    }
    else {
        var notexpType = notexpNodeCode(n.children[1]);
        convertStackTopToZeroOrOneInteger(notexpType);
        var lbl = label();
        var lbl2 = label();
        emit("cmp qword [rsp], 1");
        emit("je " + lbl);
        emit("add rsp,8"); //discard left result (0)
        emit("push 1");
        //convertStackTopToZeroOrOneInteger(notexpType);
        emit("jmp " + lbl2);
        emit(lbl + ":");
        emit("add rsp,8"); //discard left result (0)
        emit("push 0");
        //convertStackTopToZeroOrOneInteger(notexpType);
        emit(lbl2 + ":");
        return VarType.INTEGER; //always integer, even if float operands
    }
}
function relexpNodeCode(n) {
    //rel |rarr| sum RELOP sum | sum
    if (n.children.length === 1)
        return sumNodeCode(n.children[0]);
    else {
        var sum1Type = sumNodeCode(n.children[0]);
        var sum2Type = sumNodeCode(n.children[2]);
        if (sum1Type !== VarType.INTEGER || sum2Type != VarType.INTEGER)
            throw new Error;
        emit("pop rax"); //second operand
        //first operand is on stack
        emit("cmp [rsp],rax"); //do the compare
        switch (n.children[1].token.lexeme) {
            case ">=":
                emit("setge al");
                break;
            case "<=":
                emit("setle al");
                break;
            case ">":
                emit("setg  al");
                break;
            case "<":
                emit("setl  al");
                break;
            case "==":
                emit("sete  al");
                break;
            case "!=":
                emit("setne al");
                break;
            default: ICE();
        }
        emit("movzx qword rax, al"); //move with zero extend
        emit("mov [rsp], rax");
        return VarType.INTEGER;
    }
}
function sumNodeCode(n) {
    //sum -> sum PLUS term | sum MINUS term | term
    if (n.children.length === 1)
        return termNodeCode(n.children[0]);
    else {
        var sumType = sumNodeCode(n.children[0]);
        var termType = termNodeCode(n.children[2]);
        if (sumType !== VarType.INTEGER || termType != VarType.INTEGER)
            throw new Error;
        emit("pop rbx"); //second operand
        emit("pop rax"); //first operand
        switch (n.children[1].sym) {
            case "PLUS":
                emit("add rax, rbx");
                break;
            case "MINUS":
                emit("sub rax, rbx");
                break;
            default:
                ICE;
        }
        emit("push rax");
        return VarType.INTEGER;
    }
}
function termNodeCode(n) {
    //sum -> sum PLUS term | sum MINUS term | term
    if (n.children.length === 1)
        return negNodeCode(n.children[0]);
    else {
        var termType = termNodeCode(n.children[0]);
        var negType = negNodeCode(n.children[2]);
        if (termType !== VarType.INTEGER || negType != VarType.INTEGER)
            throw new Error;
        emit("pop rbx"); //second operand
        emit("pop rax"); //first operand
        emit("mov rdx, 0");
        switch (n.children[1].token.lexeme) {
            case "*":
                emit("imul rax, rbx");
                break;
            case "/":
                emit("idiv rbx");
                break;
            case "%":
                emit("idiv rbx");
                emit("mov rax, rdx");
                break;
            default:
                ICE();
        }
        emit("push rax");
        return VarType.INTEGER;
    }
}
function negNodeCode(n) {
    if (n.children.length === 1)
        return factorNodeCode(n.children[0]);
    else {
        var negType = negNodeCode(n.children[1]);
        if (negType != VarType.INTEGER)
            throw new Error;
        emit("pop rax"); //first operand
        emit("neg rax");
        emit("push rax");
        return VarType.INTEGER;
    }
}
function factorNodeCode(n) {
    //factor -> NUM | LP expr RP
    var child = n.children[0];
    console.log(n);
    switch (child.sym) {
        case "NUM":
            var v = parseInt(child.token.lexeme, 10);
            emit("push qword " + v);
            return VarType.INTEGER;
        case "LP":
            return exprNodeCode(n.children[1]);
        default:
            ICE();
    }
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
        exprNodeCode(n.children[2]); //leaves result on stack
        emit("pop rax");
        emit("cmp rax, 0");
        var endifLabel = label();
        emit("je " + endifLabel);
        braceblockNodeCode(n.children[4]);
        emit(endifLabel + ":");
    }
    else {
        exprNodeCode(n.children[2]); //leaves result in rax
        emit("pop rax"); // probably same as up above line
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
    emit("pop rax");
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
function convertStackTopToZeroOrOneInteger(type) {
    if (type == VarType.INTEGER) {
        emit("cmp qword [rsp], 0");
        emit("setne al");
        emit("movzx rax, al");
        emit("mov [rsp], rax");
    }
    else {
        throw new Error;
    }
}
//# sourceMappingURL=parser.js.map