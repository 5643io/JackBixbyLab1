"use strict";

declare var require: any;
let fs = require("fs");
import { parse } from "./parse";

function main() {
    let inp = fs.readFileSync("input1.txt", "utf8");
    let root = parse(inp);
    fs.writeFileSync("tree.dot", root);
    console.log("Wrote tree.dot");
    try {
        inp = fs.readFileSync("input2.txt", "utf8");
        root = parse(inp);
        console.log("Accepted invalid input");
    } catch (e) {
        console.log("Rejected invalid input. Good.");
    }
}


main()
