export class Grammar {
    set: Set<string>;
    constructor(grammar: string) {
        this.set = new Set();
        let input = grammar.split("\n");
        for (let st in input) {
            let input2 = st.split(" -> ");
            console.log("Left: " + input2[0] + " Right: " + input2[0]);
        }
    }
}