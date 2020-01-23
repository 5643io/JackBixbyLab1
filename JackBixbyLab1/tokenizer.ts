import { Token } from "./Token"
import { Grammar } from "./Grammar"

export class Tokenizer {
    grammar: Grammar;
    inputData: string;
    currentLine: number;
    idx: number;    //index of next unparsed char in inputData

    constructor(grammar: Grammar) {
        this.grammar = grammar;
        this.currentLine = 1; 
        this.idx = 0;
    }
    setInput(inputData: string) {
        this.inputData = inputData;
        this.idx = 0;
        this.currentLine = 1;
    }
    next(): Token {
        while (this.inputData[this.idx] === "\n") {
            this.idx++;
            this.currentLine++;
        }
        if (this.idx >= this.inputData.length) {
            //special "end of file" metatoken
            return new Token("$", undefined, this.currentLine);
        }

        for (let i = 0; i < this.grammar.terminals.length; ++i) {
            let terminal = this.grammar.terminals[i];
            let sym = terminal[0];
            let rex = terminal[1];     //RegExp
            rex.lastIndex = this.idx;   //tell where to start searching
            let m = rex.exec(this.inputData);   //do the search
            if (m) {
                //m[0] contains matched text as string
                let lexeme = m[0];
                /*let str = lexeme.split("\n");
                this.currentLine += str.length - 1;*/
                this.idx += lexeme.length;
                if (sym !== "WHITESPACE" && sym !== "COMMENT") {
                    //return new Token using sym, lexeme, and line number
                    return new Token(sym, lexeme, this.currentLine);
                } else {
                    //skip whitespace and get next real token
                    return this.next();
                }
            }
        }
        //no match; syntax error
        throw new Error("No match Syntax Error");
    }
}