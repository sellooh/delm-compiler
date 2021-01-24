// clear && nearleyc grammar.ne -o grammar.ts && nearleyc type_grammar.ne -o type_grammar.ts && nearleyc type_alias_grammar.ne -o type_alias_grammar.ts && deno run --allow-read --allow-write delm-interpreter.ts ./Test.elm

import { lexer, Token } from "./source-lexer.ts";
import { parser as semiParser } from "./source-parser.ts";

import { assertEquals } from "https://deno.land/std@0.84.0/testing/asserts.ts";

import {
  Grammar,
  Parser,
} from "https://deno.land/x/nearley@2.19.7-deno/mod.ts";

import compiledSrcGrammar from "./grammar.ts";
import compiledTypeGrammar from "./type_grammar.ts";
import compiledTypeAliasGrammar from "./type_alias_grammar.ts";

const srcGrammar = Grammar.fromCompiled(compiledSrcGrammar);
const typeGrammar = Grammar.fromCompiled(compiledTypeGrammar);
const typeAliasGrammar = Grammar.fromCompiled(compiledTypeAliasGrammar);

const filename = Deno.args[0];
const source = await Deno.readTextFile(filename);

const lines = source.split("\n");

const segment: string[] = lines;

const [stringTable, tokens] = lexer(segment);

const semiTree = semiParser(tokens);

console.log("string table: ", "|" + stringTable.join("|") + "|");

let out = "";
function runParser(parser: Parser, tokens: string): string {
  // console.log("====>", tokens);

  const { results } = parser.feed(tokens);

  out += '\n';
  out += JSON.stringify(results[0], null, 4);

  assertEquals(results.length, 1);
  const [ tree ] = results;

  return tree;
}

const treeList = [];
for (let i = 0; i < semiTree.length; i++) {
  const nodes = semiTree[i];

  const tokenz: string[] = nodes.map((node: Token) => node.symbol);

  if (tokenz[0] === "type") {
    if (tokenz[2] === "alias") {
      console.log("type alias");

      const parser = new Parser(typeAliasGrammar);

      const t = tokenz.join("");

      treeList.push(runParser(parser, t));
    } else {
      console.log("type");

      const parser = new Parser(typeGrammar);

      const t = tokenz.join("");

      treeList.push(runParser(parser, t));
    }
  } else {
    console.log("source");

    const parser = new Parser(srcGrammar);

    const t = tokenz.join("");

    treeList.push(runParser(parser, t));
  }
}

// console.log(treeList)
Deno.writeTextFile("out.txt", out);
