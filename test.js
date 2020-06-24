"use strict";

const Command = require("./Command");

const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.on("line", async (line) => {
    let output = await new Command(line.toLowerCase()).apply();
    console.log(output);
});
