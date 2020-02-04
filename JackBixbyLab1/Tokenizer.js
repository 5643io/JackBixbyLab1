"use strict";
exports.__esModule = true;
var Token_1 = require("./Token");
var Tokenizer = /** @class */ (function () {
    function Tokenizer(grammar) {
        this.grammar = grammar;
        this.currentLine = 1;
        this.idx = 0;
    }
    Tokenizer.prototype.setInput = function (inputData) {
        this.inputData = inputData;
        this.idx = 0;
        this.currentLine = 1;
    };
    Tokenizer.prototype.next = function () {
        /*while (this.inputData[this.idx] === "\n") {
            
            //this.currentLine++;
        }*/
        if (this.idx >= this.inputData.length) {
            //special "end of file" metatoken
            return new Token_1.Token("$", undefined, this.currentLine);
        }
        for (var i = 0; i < this.grammar.terminals.length; ++i) {
            var terminal = this.grammar.terminals[i];
            var sym = terminal[0];
            var rex = terminal[1]; //RegExp
            rex.lastIndex = this.idx; //tell where to start searching
            var m = rex.exec(this.inputData); //do the search
            if (m) {
                //m[0] contains matched text as string
                var lexeme = m[0];
                var token = new Token_1.Token(sym, lexeme, this.currentLine);
                this.currentLine += (lexeme.match(/\n/g) || []).length;
                this.idx += lexeme.length;
                if (sym !== "WHITESPACE" && sym !== "COMMENT") {
                    //return new Token using sym, lexeme, and line number
                    return token;
                }
                else {
                    //skip whitespace and get next real token
                    return this.next();
                }
            }
        }
        //no match; syntax error
        throw new Error("No match Syntax Error");
    };
    return Tokenizer;
}());
exports.Tokenizer = Tokenizer;
