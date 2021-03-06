// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }


const keywords = [
  "port",
  "module",
  "exposing",
  "import",
  "as",
  "(..)",
  "type",
  "alias",
  "case",
  "of",
  "_",
  "->",
  "let",
  "in",
];


interface NearleyToken {
  value: any;
  [key: string]: any;
};

interface NearleyLexer {
  reset: (chunk: string, info: any) => void;
  next: () => NearleyToken | undefined;
  save: () => any;
  formatError: (token: never) => string;
  has: (tokenType: string) => boolean;
};

interface NearleyRule {
  name: string;
  symbols: NearleySymbol[];
  postprocess?: (d: any[], loc?: number, reject?: {}) => any;
};

type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean };

interface Grammar {
  Lexer: NearleyLexer | undefined;
  ParserRules: NearleyRule[];
  ParserStart: string;
};

const grammar: Grammar = {
  Lexer: undefined,
  ParserRules: [
    {"name": "DECLARATION$string$1", "symbols": [{"literal":"t"}, {"literal":"y"}, {"literal":"p"}, {"literal":"e"}], "postprocess": (d) => d.join('')},
    {"name": "DECLARATION", "symbols": ["DECLARATION$string$1", "__", "ID_UNWRAPPED", "__", {"literal":"="}, "__", "S_STATEMENT"], "postprocess": ([type, , dcl, , eq, , stm]) => { return { type: "TYPE_DECLARATION", left: dcl, right: stm } }},
    {"name": "EXPRESSIONS$subexpression$1", "symbols": ["IDENTIFIER"], "postprocess": ([id]) => id},
    {"name": "EXPRESSIONS$subexpression$1", "symbols": ["LITERAL"], "postprocess": ([id]) => id[0]},
    {"name": "EXPRESSIONS", "symbols": ["EXPRESSIONS", "__", "EXPRESSIONS$subexpression$1"], "postprocess": ([es, _, v]) => [v, ...es]},
    {"name": "EXPRESSIONS", "symbols": []},
    {"name": "S_STATEMENT$subexpression$1", "symbols": ["__", "STATEMENT"]},
    {"name": "S_STATEMENT$subexpression$1", "symbols": []},
    {"name": "S_STATEMENT", "symbols": ["S_STATEMENT", "__", {"literal":"|"}, "__", "ID_UNWRAPPED", "S_STATEMENT$subexpression$1"], "postprocess": ([stms, ,,, id, [, stm]]) => { return [...stms, { id, statements: stm }] }},
    {"name": "S_STATEMENT$subexpression$2", "symbols": ["__", "STATEMENT"]},
    {"name": "S_STATEMENT$subexpression$2", "symbols": []},
    {"name": "S_STATEMENT", "symbols": ["ID_UNWRAPPED", "S_STATEMENT$subexpression$2"], "postprocess": ([id, [, stm]]) => { return [{ id, statements: stm }] }},
    {"name": "STATEMENT", "symbols": ["LITERAL"]},
    {"name": "STATEMENT", "symbols": [{"literal":"("}, "_", "STATEMENT", "_", {"literal":")"}], "postprocess": ([p1, , v, , p2]) => { return v }},
    {"name": "STATEMENT", "symbols": ["IDENTIFIER", "EXPRESSIONS"], "postprocess": ([id, params]) => { return params.length > 0 ? [{ id, statements: params.reverse() }] : [id] }},
    {"name": "LITERAL", "symbols": [{"literal":"("}, "TUPLE", {"literal":")"}], "postprocess": ([, v, ]) => { return [{ type: 'TUPLE', value: v }] }},
    {"name": "LITERAL", "symbols": [{"literal":"("}, {"literal":")"}], "postprocess": () => { return [{ type: 'TUPLE', value: null }] }},
    {"name": "TUPLE", "symbols": ["__", "STATEMENT", "_", {"literal":","}, "__", "S_STATEMENT", "_", {"literal":","}, "__", "S_STATEMENT", "__"], "postprocess": ([_, [st1], , comma1, __, [st2], , comma2, ___, [st3]]) => [st1, st2, st3]},
    {"name": "TUPLE", "symbols": ["__", "S_STATEMENT", "_", {"literal":","}, "__", "S_STATEMENT", "__"], "postprocess": ([_, [st1], __, comma1, , [st2]]) => [st1, st2]},
    {"name": "IDENTIFIER", "symbols": ["IDENTIFIER", {"literal":"."}, "ID"], "postprocess": ([identf, dot, [id]]) => { return { type: 'IDENTIFIER', value: identf.value + dot + id.join("") } }},
    {"name": "IDENTIFIER", "symbols": ["ID"], "postprocess": ([n]) => { return { type: 'IDENTIFIER', value: n[0].join("") } }},
    {"name": "ID_UNWRAPPED", "symbols": ["ID"], "postprocess": ([n]) => { return { type: 'IDENTIFIER', value: n[0].join("") } }},
    {"name": "ID$ebnf$1", "symbols": [/[a-zA-Z]/]},
    {"name": "ID$ebnf$1", "symbols": ["ID$ebnf$1", /[a-zA-Z]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "ID", "symbols": ["ID$ebnf$1"], "postprocess": (n, _, reject) => { if ( keywords.includes(n[0].join("")) ) { return reject } else { return n } }},
    {"name": "ID$ebnf$2", "symbols": [/[a-zA-Z]/]},
    {"name": "ID$ebnf$2", "symbols": ["ID$ebnf$2", /[a-zA-Z]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "ID$ebnf$3", "symbols": [/[0-9]/]},
    {"name": "ID$ebnf$3", "symbols": ["ID$ebnf$3", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "ID$subexpression$1", "symbols": ["ID"], "postprocess": ([n]) => n},
    {"name": "ID$subexpression$1", "symbols": []},
    {"name": "ID", "symbols": ["ID$ebnf$2", "ID$ebnf$3", "ID$subexpression$1"], "postprocess": ([n1, n2, [n3]]) => { return n3?.[0] ? [[...n1, ...n2, ...n3]] : [[...n1, ...n2]]}},
    {"name": "_$ebnf$1", "symbols": [{"literal":" "}], "postprocess": id},
    {"name": "_$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": () => null},
    {"name": "__", "symbols": [{"literal":" "}], "postprocess": () => null}
  ],
  ParserStart: "DECLARATION",
};

export default grammar;
