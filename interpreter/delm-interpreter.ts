// deno run --allow-read --allow-write delm-interpreter.ts ./ERC20.elm
import { assert } from "https://deno.land/std@0.77.0/testing/asserts.ts";

import { moduleLexer } from "./module-lexer.ts";
import { lexer } from "./source-lexer.ts";

const filename = Deno.args[0];
const source = await Deno.readTextFile(filename);

const lines = source.split("\n");

// MODULES

const moduleSeg: string[] = lines.filter((_, i) => i >= 0 && i < 23);

const moduleTokens = moduleLexer(moduleSeg);

const moduleOut = `
Segment:
${moduleSeg.join("\n")}

Tokens:
${JSON.stringify(moduleTokens, null, 4)}
`;

// console.log(moduleTokens.length)
assert(moduleTokens.length === 50, "Validate module tokens length");

Deno.writeTextFile("module-out.txt", moduleOut);

// SOURCE

const segment: string[] = lines.filter((_, i) => i >= 23);

const tokens = lexer(segment);

const out = `
Source:
${segment.join("\n")}

Tokens:
${JSON.stringify(tokens, null, 4)}
`;

// assert(tokens.length === 40, "Validate module tokens length");

Deno.writeTextFile("source-out.txt", out);
