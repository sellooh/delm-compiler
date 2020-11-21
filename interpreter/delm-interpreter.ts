// deno run --allow-read --allow-write delm-interpreter.ts ./ERC20.elm

import { lexer } from "./source-lexer.ts";

const filename = Deno.args[0];
const source = await Deno.readTextFile(filename);

const lines = source.split("\n");

const segment: string[] = lines;

const tokens = lexer(segment);

const out = JSON.stringify(tokens, null, 4);

Deno.writeTextFile("source-out.txt", out);
