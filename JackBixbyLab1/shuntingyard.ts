import { Tokenizer } from "./Tokenizer"
import { TreeNode } from "./TreeNode"
import { Grammar } from "./Grammar"

let operandStack: Array<TreeNode> = new Array<TreeNode>();
let operatorStack: Array<TreeNode> = new Array<TreeNode>();
let operators: { [key: string]: number } = {
    "func-call": 6,
    "BITNOT": 3,
    "NEGATE": 4,
    "POWOP": 5,
    "MULOP": 2,
    "ADDOP": 1,
    "COMMA": 0
    
}

let associtive: { [key: string]: string } = {
    "func-call": "left",
    "BITNOT": "right",
    "NEGATE": "right",
    "POWOP": "right",
    "MULOP": "left",
    "ADDOP": "left",
    "COMMA": "left"
}

let unary: { [key: string]: string } = {
    "func-call": "binary",
    "BITNOT": "unary",
    "NEGATE": "unary",
    "POWOP": "binary",
    "MULOP": "binary",
    "ADDOP": "binary",
    "COMMA": "binary"
}

export function parse(robert: string) {
    let G = new Grammar("NUM -> \\d+\nID -> \\w+\nPOWOP -> \\*\\*\nMULOP -> [*/]\nADDOP -> [-+]\nNEGATE -> [-]\nLP -> [(]\nRP -> [)]\nBITNOT -> [~]\nCOMMA -> [,]\nfunc-call -> [.]\n\n");
    let tokenizer = new Tokenizer(G);
    tokenizer.setInput(robert);
    while (true) {
        let t = tokenizer.next();
        let sym = t.sym;
        if (sym === "$") {
            break;
        }
        if (t.lexeme === "-") {
            let p = tokenizer.previous;
            if (p === undefined || p.sym === "LP" || p.sym === "ADDOP" || p.sym === "MULOP" || p.sym == "POWOP" || p.sym == "NEGATE" || p.sym == "func-call") {//(p.sym != "NUM" && p.sym != "ID")) {
                t.sym = "NEGATE";
                sym = t.sym;
            }
        }
        console.log(sym);
        if (sym === "NUM" || sym === "ID") {
            operandStack.push(new TreeNode(t.sym, t));
            if (sym === "ID") {
                if (tokenizer.peek().sym === "LP") {
                    operatorStack.push(new TreeNode("func-call", null))
                    console.log("horse");
                }
            }
        } else if (sym === "LP") {
            operatorStack.push(new TreeNode(t.sym, t));
        } else if (sym == "RP") {
            while (operatorStack[operatorStack.length - 1].sym !== "LP") {
                doOperation();
            }
            operatorStack.pop();
        } else {
            let assoc = associtive[sym];
            while (true) {
                if (assoc === "right" && unary[sym] == "unary") {
                    break;
                }
                if (operatorStack.length === 0) {
                    break;
                }
                let A = operatorStack[operatorStack.length - 1].sym;
                if (assoc === "left" && operators[A] >= operators[sym]) {
                    doOperation();
                } else if (assoc === "right" && operators[A] > operators[sym]) {
                    doOperation();
                } else {
                    break;
                }
            }
            operatorStack.push(new TreeNode(t.sym, t))
        }
    }
    while (operatorStack.length !== 0) {
        doOperation();
    }
    console.log(operandStack.length);
    return operandStack.pop();
}

function doOperation() {
    let c1 = operandStack.pop()
    //console.log(c1);
    let opNode = operatorStack.pop()
    if (unary[opNode.sym] === "binary") {
        let c2 = operandStack.pop()
        opNode.addChild(c2)
        //console.log(c1.sym + " " + c2.sym + " " + opNode.sym);
    }
    //console.log(c1.sym + " " + opNode.sym);
    opNode.addChild(c1)
    operandStack.push(opNode)
    console.log(operatorStack);
}