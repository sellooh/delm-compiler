
// deno run --allow-read --allow-write atest.ts ./Test.elm

import { lexer } from "./source-lexer.ts";
import { parser as semiParser } from "./source-parser.ts";

import { Parser, Grammar } from "https://deno.land/x/nearley@2.19.7-deno/mod.ts";

import myCompiledGrammar from './grammar.ts';

const grammar = Grammar.fromCompiled(myCompiledGrammar);
const parser = new Parser(grammar);


const filename = Deno.args[0];
const source = await Deno.readTextFile(filename);

const lines = source.split("\n");

const segment: string[] = lines;

const tokens = lexer(segment);

const semiTree = semiParser(tokens);

console.log(tokens.map(n => n.symbol).join("") + '|');

// @ts-ignore
let tokenz = semiTree[0].map(node => node.symbol);

// @ts-ignore
tokenz = tokenz.join("");

// @ts-ignore
console.log('====>', tokenz);

// @ts-ignore
const { results } = parser.feed(tokenz);

const out = JSON.stringify(results[0], null, 4);

console.log(results.length, out);

