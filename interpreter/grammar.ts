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
    {"name": "DECLARATION", "symbols": ["FUNCTION_DELCARATION", "__", {"literal":"="}, "__", "S_STATEMENT"], "postprocess": ([dcl, _, eq, __, stm]) => { return { type: "DECLARATION", left: dcl, right: stm } }},
    {"name": "FUNCTION_DELCARATION", "symbols": ["ID_UNWRAPPED", "PARAMS"], "postprocess": ([fun, params]) => { return { fun, params: params.reverse() } }},
    {"name": "PARAMS", "symbols": ["PARAMS", "__", "ID_UNWRAPPED"], "postprocess": ([params, _1, id]) => { return [ id, ...params ] }},
    {"name": "PARAMS", "symbols": [], "postprocess": () => []},
    {"name": "EXPRESSIONS$subexpression$1", "symbols": ["IDENTIFIER"], "postprocess": ([id]) => id},
    {"name": "EXPRESSIONS$subexpression$1", "symbols": ["LITERAL"], "postprocess": ([id]) => id[0]},
    {"name": "EXPRESSIONS", "symbols": ["EXPRESSIONS", "__", "EXPRESSIONS$subexpression$1"], "postprocess": ([es, _, v]) => [v, ...es]},
    {"name": "EXPRESSIONS", "symbols": []},
    {"name": "S_STATEMENT", "symbols": ["STATEMENT"], "postprocess": ([n]) => n},
    {"name": "S_STATEMENT$string$1", "symbols": [{"literal":"<"}, {"literal":"|"}], "postprocess": (d) => d.join('')},
    {"name": "S_STATEMENT", "symbols": ["STATEMENT", "__", "S_STATEMENT$string$1", "__", "RIGHT_STATEMENT"], "postprocess": ([fun, _1, pipe, _2, param]) => { return { type: 'FUNCTION_CALL', fun, param }}},
    {"name": "S_STATEMENT$string$2", "symbols": [{"literal":"|"}, {"literal":">"}], "postprocess": (d) => d.join('')},
    {"name": "S_STATEMENT", "symbols": ["LEFT_STATEMENT", "__", "S_STATEMENT$string$2", "__", "STATEMENT"], "postprocess": ([param, _1, pipe, _2, fun]) => { return { type: 'FUNCTION_CALL', fun, param }}},
    {"name": "S_STATEMENT", "symbols": ["LET_IN", "__", "S_STATEMENT"], "postprocess": ([dcls, _, stm]) => { return { type: 'SCOPE', declarations: dcls, statement: stm }}},
    {"name": "S_STATEMENT", "symbols": ["CASE_OF"], "postprocess": ([n]) => n},
    {"name": "S_STATEMENT", "symbols": ["IF_ELSE"], "postprocess": ([n]) => n},
    {"name": "RIGHT_STATEMENT", "symbols": ["STATEMENT"], "postprocess": ([n]) => n},
    {"name": "RIGHT_STATEMENT$string$1", "symbols": [{"literal":"<"}, {"literal":"|"}], "postprocess": (d) => d.join('')},
    {"name": "RIGHT_STATEMENT", "symbols": ["STATEMENT", "__", "RIGHT_STATEMENT$string$1", "__", "RIGHT_STATEMENT"], "postprocess": ([fun, _1, pipe, _2, param]) => { return { type: 'FUNCTION_CALL', fun, param }}},
    {"name": "LEFT_STATEMENT", "symbols": ["STATEMENT"], "postprocess": ([n]) => n},
    {"name": "LEFT_STATEMENT$string$1", "symbols": [{"literal":"|"}, {"literal":">"}], "postprocess": (d) => d.join('')},
    {"name": "LEFT_STATEMENT", "symbols": ["LEFT_STATEMENT", "__", "LEFT_STATEMENT$string$1", "__", "STATEMENT"], "postprocess": ([param, _1, pipe, _2, fun]) => { return { type: 'FUNCTION_CALL', fun, param }}},
    {"name": "STATEMENT", "symbols": ["CALL"], "postprocess": ([n]) => n[0]},
    {"name": "STATEMENT", "symbols": ["CALL", "__", "COMPARATOR", "__", "CALL"], "postprocess": ([c1, _, cmp, __, c2]) => { return { type: 'COMPARATOR', comparator: cmp, left: c1[0], right: c2[0] }}},
    {"name": "STATEMENT$string$1", "symbols": [{"literal":"+"}, {"literal":"+"}], "postprocess": (d) => d.join('')},
    {"name": "STATEMENT", "symbols": ["CALL", "__", "STATEMENT$string$1", "__", "CALL"], "postprocess": ([c1, _, cmp, __, c2]) => { return { type: 'APPEND', left: c1[0], right: c2[0] }}},
    {"name": "LET_IN$string$1", "symbols": [{"literal":"l"}, {"literal":"e"}, {"literal":"t"}], "postprocess": (d) => d.join('')},
    {"name": "LET_IN$string$2", "symbols": [{"literal":"i"}, {"literal":"n"}], "postprocess": (d) => d.join('')},
    {"name": "LET_IN", "symbols": ["LET_IN$string$1", "__", "LET_IN_DECLARATIONS", "__", "LET_IN$string$2"], "postprocess": ([lt, _1, declarations, _2, _in]) => { return declarations }},
    {"name": "LET_IN_DECLARATIONS$subexpression$1", "symbols": ["ID_UNWRAPPED"]},
    {"name": "LET_IN_DECLARATIONS$subexpression$1", "symbols": [{"literal":"("}, "TUPLE", {"literal":")"}], "postprocess": ([_1, v, _2]) => [v]},
    {"name": "LET_IN_DECLARATIONS$subexpression$2$string$1", "symbols": [{"literal":"\\"}, {"literal":"n"}], "postprocess": (d) => d.join('')},
    {"name": "LET_IN_DECLARATIONS$subexpression$2", "symbols": ["__", "LET_IN_DECLARATIONS$subexpression$2$string$1", "__"]},
    {"name": "LET_IN_DECLARATIONS$subexpression$2", "symbols": []},
    {"name": "LET_IN_DECLARATIONS", "symbols": ["LET_IN_DECLARATIONS$subexpression$1", "__", {"literal":"="}, "__", "S_STATEMENT", "LET_IN_DECLARATIONS$subexpression$2", "LET_IN_DECLARATIONS"], "postprocess": ([[dcl], _1, eq, _2, stm, end, declarations]) => { return [{ left: dcl, right: stm }, ...declarations] }},
    {"name": "LET_IN_DECLARATIONS", "symbols": [], "postprocess": () => []},
    {"name": "IF_ELSE$string$1", "symbols": [{"literal":"i"}, {"literal":"f"}], "postprocess": (d) => d.join('')},
    {"name": "IF_ELSE$string$2", "symbols": [{"literal":"t"}, {"literal":"h"}, {"literal":"e"}, {"literal":"n"}], "postprocess": (d) => d.join('')},
    {"name": "IF_ELSE$subexpression$1", "symbols": ["__", "ELSE_IF"]},
    {"name": "IF_ELSE$subexpression$1", "symbols": []},
    {"name": "IF_ELSE$string$3", "symbols": [{"literal":"e"}, {"literal":"l"}, {"literal":"s"}, {"literal":"e"}], "postprocess": (d) => d.join('')},
    {"name": "IF_ELSE", "symbols": ["IF_ELSE$string$1", "__", "STATEMENT", "__", "IF_ELSE$string$2", "__", "STATEMENT", "IF_ELSE$subexpression$1", "__", "IF_ELSE$string$3", "__", "STATEMENT"], "postprocess": ([_if, _1, condition, _2, then, _3, stm, [, branches], _4, _else, _5, elseStm]) => { return { type: "IF", condition, statement: stm, branches, elseStm } }},
    {"name": "ELSE_IF$string$1", "symbols": [{"literal":"e"}, {"literal":"l"}, {"literal":"s"}, {"literal":"e"}], "postprocess": (d) => d.join('')},
    {"name": "ELSE_IF$string$2", "symbols": [{"literal":"i"}, {"literal":"f"}], "postprocess": (d) => d.join('')},
    {"name": "ELSE_IF$string$3", "symbols": [{"literal":"t"}, {"literal":"h"}, {"literal":"e"}, {"literal":"n"}], "postprocess": (d) => d.join('')},
    {"name": "ELSE_IF$subexpression$1", "symbols": ["__", "ELSE_IF"]},
    {"name": "ELSE_IF$subexpression$1", "symbols": []},
    {"name": "ELSE_IF", "symbols": ["ELSE_IF$string$1", "__", "ELSE_IF$string$2", "__", "STATEMENT", "__", "ELSE_IF$string$3", "__", "STATEMENT", "ELSE_IF$subexpression$1"], "postprocess": ([_else, _1, _if, _2, condition, _3, then, _4, stm, [, branches]]) => { return [{ type: "ELSE IF", condition, statement: stm }] }},
    {"name": "ELSE_IF", "symbols": [], "postprocess": () => []},
    {"name": "CASE_OF$string$1", "symbols": [{"literal":"c"}, {"literal":"a"}, {"literal":"s"}, {"literal":"e"}], "postprocess": (d) => d.join('')},
    {"name": "CASE_OF$string$2", "symbols": [{"literal":"o"}, {"literal":"f"}], "postprocess": (d) => d.join('')},
    {"name": "CASE_OF", "symbols": ["CASE_OF$string$1", "__", "ID_UNWRAPPED", "__", "CASE_OF$string$2", "CASE_OF_BRANCH"], "postprocess": ([_case, _1, condition, _2, of, branches]) => { return { type: "CASE", condition, branches } }},
    {"name": "CASE_OF_BRANCH$subexpression$1", "symbols": ["CASE_OF_MATCH"]},
    {"name": "CASE_OF_BRANCH$subexpression$1", "symbols": [{"literal":"_"}]},
    {"name": "CASE_OF_BRANCH$string$1", "symbols": [{"literal":"-"}, {"literal":">"}], "postprocess": (d) => d.join('')},
    {"name": "CASE_OF_BRANCH$subexpression$2$string$1", "symbols": [{"literal":"\\"}, {"literal":"n"}], "postprocess": (d) => d.join('')},
    {"name": "CASE_OF_BRANCH$subexpression$2", "symbols": ["__", "CASE_OF_BRANCH$subexpression$2$string$1"]},
    {"name": "CASE_OF_BRANCH$subexpression$2", "symbols": []},
    {"name": "CASE_OF_BRANCH", "symbols": ["__", "CASE_OF_BRANCH$subexpression$1", "__", "CASE_OF_BRANCH$string$1", "__", "S_STATEMENT", "CASE_OF_BRANCH$subexpression$2", "CASE_OF_BRANCH"], "postprocess": ([_1, [match], _2, arrow, _3, stm, END, branches]) => { return [{ type: "BRANCH", match, statement: stm }, ...branches] }},
    {"name": "CASE_OF_BRANCH", "symbols": [], "postprocess": () => []},
    {"name": "CASE_OF_MATCH", "symbols": ["ID_UNWRAPPED", "__", "CASE_OF_MATCH"], "postprocess": ([fun, _1, param]) => { return { fun, param } }},
    {"name": "CASE_OF_MATCH", "symbols": [{"literal":"("}, "TUPLE", {"literal":")"}], "postprocess": ([_1, v, _2]) => v},
    {"name": "CASE_OF_MATCH", "symbols": ["ID_UNWRAPPED"], "postprocess": ([id]) => id},
    {"name": "CASE_OF_MATCH", "symbols": []},
    {"name": "CALL", "symbols": ["LITERAL"], "postprocess": ([n]) => [...n]},
    {"name": "CALL", "symbols": ["IDENTIFIER", "EXPRESSIONS"], "postprocess": ([id, params]) => { return params.length > 0 ? [{ type: "FUNCTION_CALL", fun: id, param: params.reverse() }] : [id] }},
    {"name": "LITERAL", "symbols": ["SUM"], "postprocess": n => n},
    {"name": "LITERAL$string$1", "symbols": [{"literal":"$"}, {"literal":"S"}, {"literal":"T"}, {"literal":"R"}, {"literal":"I"}, {"literal":"N"}, {"literal":"G"}, {"literal":"_"}, {"literal":"L"}, {"literal":"I"}, {"literal":"T"}, {"literal":"E"}, {"literal":"R"}, {"literal":"A"}, {"literal":"L"}, {"literal":"$"}], "postprocess": (d) => d.join('')},
    {"name": "LITERAL$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "LITERAL$ebnf$1", "symbols": ["LITERAL$ebnf$1", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "LITERAL", "symbols": [{"literal":"\""}, "_", "LITERAL$string$1", "_", "LITERAL$ebnf$1", "_", {"literal":"\""}], "postprocess": ([_, , v, , i, , __]) => { return [{ type: 'STRING', value: v, position: i.join("") }] }},
    {"name": "LITERAL", "symbols": [{"literal":"("}, "TUPLE", {"literal":")"}], "postprocess": ([_, v, __]) => { return [{ type: 'TUPLE', value: v }] }},
    {"name": "LITERAL", "symbols": [{"literal":"["}, "ARRAY", {"literal":"]"}], "postprocess": ([_, v, __]) => { return [{ type: 'ARRAY', value: v }] }},
    {"name": "LITERAL", "symbols": [{"literal":"{"}, "RECORD_DEFINITION_UPDATE", "RECORD_DEFINITION", {"literal":"}"}], "postprocess": ([_1, update, values, _2]) => { return [{ type: 'RECORD', update, values }] }},
    {"name": "LITERAL", "symbols": [{"literal":"["}, {"literal":"]"}], "postprocess": () => { return [{ type: 'ARRAY', value: null }] }},
    {"name": "LITERAL", "symbols": [{"literal":"("}, {"literal":")"}], "postprocess": () => { return [{ type: 'TUPLE', value: null }] }},
    {"name": "LITERAL", "symbols": [{"literal":"("}, "_", "S_STATEMENT", "_", {"literal":")"}], "postprocess": ([p1, _1, v, _2, p2]) => { return [v] }},
    {"name": "ARRAY", "symbols": ["__", "S_STATEMENT", {"literal":","}, "ARRAY"], "postprocess": ([_, v, comma, c]) => [v, ...c]},
    {"name": "ARRAY", "symbols": ["__", "S_STATEMENT", "__"], "postprocess": ([_, v, __]) => [v]},
    {"name": "TUPLE", "symbols": ["__", "S_STATEMENT", "_", {"literal":","}, "__", "S_STATEMENT", "_", {"literal":","}, "__", "S_STATEMENT", "__"], "postprocess": ([_, st1, , comma1, __, st2, , comma2, ___, st3]) => [st1, st2, st3]},
    {"name": "TUPLE", "symbols": ["__", "S_STATEMENT", "_", {"literal":","}, "__", "S_STATEMENT", "__"], "postprocess": ([_, st1, __, comma1, , st2]) => [st1, st2]},
    {"name": "RECORD_DEFINITION", "symbols": ["__", "ID_UNWRAPPED", "__", {"literal":"="}, "__", "S_STATEMENT", "_", {"literal":","}, "RECORD_DEFINITION"], "postprocess": ([_, key, __, eq, ___, value, _e1, comma, values]) => { return [{ key, value }, ...values]}},
    {"name": "RECORD_DEFINITION", "symbols": ["__", "ID_UNWRAPPED", "__", {"literal":"="}, "__", "S_STATEMENT", "__"], "postprocess": ([_, key, __, eq, ___, value]) => { return [{ key, value }]}},
    {"name": "RECORD_DEFINITION_UPDATE", "symbols": ["__", "ID_UNWRAPPED", "__", {"literal":"|"}], "postprocess": ([_1, id]) => id},
    {"name": "RECORD_DEFINITION_UPDATE", "symbols": [], "postprocess": () => null},
    {"name": "SUM$subexpression$1", "symbols": ["SUM"]},
    {"name": "SUM$subexpression$1", "symbols": ["IDENTIFIER"]},
    {"name": "SUM$subexpression$2", "symbols": [{"literal":"+"}]},
    {"name": "SUM$subexpression$2", "symbols": [{"literal":"-"}]},
    {"name": "SUM$subexpression$3", "symbols": ["PRODUCT"]},
    {"name": "SUM$subexpression$3", "symbols": ["IDENTIFIER"]},
    {"name": "SUM", "symbols": ["SUM$subexpression$1", "__", "SUM$subexpression$2", "__", "SUM$subexpression$3"], "postprocess": ([l, _, op, __, r]) => { return { type: "SUM", operation: op[0], left: l[0], right: r[0] } }},
    {"name": "SUM$subexpression$4", "symbols": ["PRODUCT"]},
    {"name": "SUM$subexpression$4", "symbols": ["IDENTIFIER"]},
    {"name": "SUM$subexpression$5", "symbols": [{"literal":"+"}]},
    {"name": "SUM$subexpression$5", "symbols": [{"literal":"-"}]},
    {"name": "SUM$ebnf$1", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "SUM$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "SUM$subexpression$6", "symbols": ["SUM"]},
    {"name": "SUM$subexpression$6", "symbols": ["IDENTIFIER"]},
    {"name": "SUM", "symbols": ["SUM$subexpression$4", "__", "SUM$subexpression$5", "__", "SUM$ebnf$1", {"literal":"("}, "_", "SUM$subexpression$6", "_", {"literal":")"}], "postprocess": ([l, _, op, __, signal, p1, s1, r, s2, p2 ]) => { return { type: "SUM", rightSignal: signal, operation: op[0], left: l[0], right: r[0] } }},
    {"name": "SUM$ebnf$2", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "SUM$ebnf$2", "symbols": [], "postprocess": () => null},
    {"name": "SUM$subexpression$7", "symbols": ["SUM"]},
    {"name": "SUM$subexpression$7", "symbols": ["IDENTIFIER"]},
    {"name": "SUM$subexpression$8", "symbols": [{"literal":"+"}]},
    {"name": "SUM$subexpression$8", "symbols": [{"literal":"-"}]},
    {"name": "SUM$subexpression$9", "symbols": ["PRODUCT"]},
    {"name": "SUM$subexpression$9", "symbols": ["IDENTIFIER"]},
    {"name": "SUM", "symbols": ["SUM$ebnf$2", {"literal":"("}, "_", "SUM$subexpression$7", "_", {"literal":")"}, "__", "SUM$subexpression$8", "__", "SUM$subexpression$9"], "postprocess": ([ signal, , p1, s1, l, s2, p2, _, op, __, r ]) => { return { type: "SUM", rightSignal: signal, operation: op[0], left: l[0], right: r[0] } }},
    {"name": "SUM$ebnf$3", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "SUM$ebnf$3", "symbols": [], "postprocess": () => null},
    {"name": "SUM$subexpression$10", "symbols": ["SUM"]},
    {"name": "SUM$subexpression$10", "symbols": ["IDENTIFIER"]},
    {"name": "SUM$subexpression$11", "symbols": [{"literal":"+"}]},
    {"name": "SUM$subexpression$11", "symbols": [{"literal":"-"}]},
    {"name": "SUM$ebnf$4", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "SUM$ebnf$4", "symbols": [], "postprocess": () => null},
    {"name": "SUM$subexpression$12", "symbols": ["SUM"]},
    {"name": "SUM$subexpression$12", "symbols": ["IDENTIFIER"]},
    {"name": "SUM", "symbols": ["SUM$ebnf$3", {"literal":"("}, "_", "SUM$subexpression$10", "_", {"literal":")"}, "_", "SUM$subexpression$11", "_", "SUM$ebnf$4", {"literal":"("}, "_", "SUM$subexpression$12", "_", {"literal":")"}], "postprocess": ([signal1, p1, _1, l, _2, p2, _, op, __, signal2, p3, _3, r]) => { return { type: "SUM", leftSignal: signal1, rightSignal: signal2, left: l[0], right: r[0] } }},
    {"name": "SUM", "symbols": ["PRODUCT"], "postprocess": ([n]) => n},
    {"name": "PRODUCT$subexpression$1", "symbols": ["PRODUCT"]},
    {"name": "PRODUCT$subexpression$1", "symbols": ["IDENTIFIER"]},
    {"name": "PRODUCT$subexpression$2", "symbols": [{"literal":"*"}]},
    {"name": "PRODUCT$subexpression$2", "symbols": [{"literal":"/"}]},
    {"name": "PRODUCT$subexpression$2$string$1", "symbols": [{"literal":"/"}, {"literal":"/"}], "postprocess": (d) => d.join('')},
    {"name": "PRODUCT$subexpression$2", "symbols": ["PRODUCT$subexpression$2$string$1"]},
    {"name": "PRODUCT$subexpression$3", "symbols": ["EXP"]},
    {"name": "PRODUCT$subexpression$3", "symbols": ["IDENTIFIER"]},
    {"name": "PRODUCT", "symbols": ["PRODUCT$subexpression$1", "__", "PRODUCT$subexpression$2", "__", "PRODUCT$subexpression$3"], "postprocess": ([l, _, op, __, r]) => { return { type: "PRODUCT", operation: op[0], left: l[0], right: r[0] } }},
    {"name": "PRODUCT$subexpression$4", "symbols": ["EXP"]},
    {"name": "PRODUCT$subexpression$4", "symbols": ["IDENTIFIER"]},
    {"name": "PRODUCT$subexpression$5", "symbols": [{"literal":"*"}]},
    {"name": "PRODUCT$subexpression$5", "symbols": [{"literal":"/"}]},
    {"name": "PRODUCT$subexpression$5$string$1", "symbols": [{"literal":"/"}, {"literal":"/"}], "postprocess": (d) => d.join('')},
    {"name": "PRODUCT$subexpression$5", "symbols": ["PRODUCT$subexpression$5$string$1"]},
    {"name": "PRODUCT$ebnf$1", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "PRODUCT$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "PRODUCT$subexpression$6", "symbols": ["SUM"]},
    {"name": "PRODUCT$subexpression$6", "symbols": ["IDENTIFIER"]},
    {"name": "PRODUCT", "symbols": ["PRODUCT$subexpression$4", "__", "PRODUCT$subexpression$5", "__", "PRODUCT$ebnf$1", {"literal":"("}, "_", "PRODUCT$subexpression$6", "_", {"literal":")"}], "postprocess": ([l, _, op, __, signal, p1, s1, r, s2, p2 ]) => { return { type: "PRODUCT", rightSignal: signal, operation: op[0], left: l[0], right: r[0] } }},
    {"name": "PRODUCT$ebnf$2", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "PRODUCT$ebnf$2", "symbols": [], "postprocess": () => null},
    {"name": "PRODUCT$subexpression$7", "symbols": ["SUM"]},
    {"name": "PRODUCT$subexpression$7", "symbols": ["IDENTIFIER"]},
    {"name": "PRODUCT$subexpression$8", "symbols": [{"literal":"*"}]},
    {"name": "PRODUCT$subexpression$8", "symbols": [{"literal":"/"}]},
    {"name": "PRODUCT$subexpression$8$string$1", "symbols": [{"literal":"/"}, {"literal":"/"}], "postprocess": (d) => d.join('')},
    {"name": "PRODUCT$subexpression$8", "symbols": ["PRODUCT$subexpression$8$string$1"]},
    {"name": "PRODUCT$subexpression$9", "symbols": ["EXP"]},
    {"name": "PRODUCT$subexpression$9", "symbols": ["IDENTIFIER"]},
    {"name": "PRODUCT", "symbols": ["PRODUCT$ebnf$2", {"literal":"("}, "_", "PRODUCT$subexpression$7", "_", {"literal":")"}, "__", "PRODUCT$subexpression$8", "__", "PRODUCT$subexpression$9"], "postprocess": ([signal, p1, s1, l, s2, p2, _, op, __, r ]) => { return { type: "PRODUCT", leftSignal: signal, operation: op[0], left: l[0], right: r[0] } }},
    {"name": "PRODUCT$ebnf$3", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "PRODUCT$ebnf$3", "symbols": [], "postprocess": () => null},
    {"name": "PRODUCT$subexpression$10", "symbols": ["SUM"]},
    {"name": "PRODUCT$subexpression$10", "symbols": ["IDENTIFIER"]},
    {"name": "PRODUCT$subexpression$11", "symbols": [{"literal":"*"}]},
    {"name": "PRODUCT$subexpression$11", "symbols": [{"literal":"/"}]},
    {"name": "PRODUCT$subexpression$11$string$1", "symbols": [{"literal":"/"}, {"literal":"/"}], "postprocess": (d) => d.join('')},
    {"name": "PRODUCT$subexpression$11", "symbols": ["PRODUCT$subexpression$11$string$1"]},
    {"name": "PRODUCT$ebnf$4", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "PRODUCT$ebnf$4", "symbols": [], "postprocess": () => null},
    {"name": "PRODUCT$subexpression$12", "symbols": ["SUM"]},
    {"name": "PRODUCT$subexpression$12", "symbols": ["IDENTIFIER"]},
    {"name": "PRODUCT", "symbols": ["PRODUCT$ebnf$3", {"literal":"("}, "_", "PRODUCT$subexpression$10", "_", {"literal":")"}, "_", "PRODUCT$subexpression$11", "_", "PRODUCT$ebnf$4", {"literal":"("}, "_", "PRODUCT$subexpression$12", "_", {"literal":")"}], "postprocess": ([signal1, p1, _1, l, _2, p2, _, op, __, signal2, p3, _3, r]) => { return { type: "PRODUCT", leftSignal: signal1, rightSignal: signal2, left: l[0], right: r[0] } }},
    {"name": "PRODUCT", "symbols": ["EXP"], "postprocess": ([n]) => n},
    {"name": "EXP$subexpression$1", "symbols": ["NUMBER"]},
    {"name": "EXP$subexpression$1", "symbols": ["IDENTIFIER"]},
    {"name": "EXP$subexpression$2", "symbols": ["EXP"]},
    {"name": "EXP$subexpression$2", "symbols": ["IDENTIFIER"]},
    {"name": "EXP", "symbols": ["EXP$subexpression$1", "_", {"literal":"^"}, "_", "EXP$subexpression$2"], "postprocess": ([l, _, op, __, r]) => { return { type: "EXPOENT", left: l[0], right: r[0] } }},
    {"name": "EXP$subexpression$3", "symbols": ["NUMBER"]},
    {"name": "EXP$subexpression$3", "symbols": ["IDENTIFIER"]},
    {"name": "EXP$ebnf$1", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "EXP$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "EXP$subexpression$4", "symbols": ["SUM"]},
    {"name": "EXP$subexpression$4", "symbols": ["IDENTIFIER"]},
    {"name": "EXP", "symbols": ["EXP$subexpression$3", "_", {"literal":"^"}, "_", "EXP$ebnf$1", {"literal":"("}, "_", "EXP$subexpression$4", "_", {"literal":")"}], "postprocess": ([ l, _, op, __, signal, p1, _1, r, _2, p2 ]) => { return { type: "EXPOENT", rightSignal: signal, left: l[0], right: r[0] } }},
    {"name": "EXP$ebnf$2", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "EXP$ebnf$2", "symbols": [], "postprocess": () => null},
    {"name": "EXP$subexpression$5", "symbols": ["SUM"]},
    {"name": "EXP$subexpression$5", "symbols": ["IDENTIFIER"]},
    {"name": "EXP$subexpression$6", "symbols": ["NUMBER"]},
    {"name": "EXP$subexpression$6", "symbols": ["IDENTIFIER"]},
    {"name": "EXP", "symbols": ["EXP$ebnf$2", {"literal":"("}, "_", "EXP$subexpression$5", "_", {"literal":")"}, "_", {"literal":"^"}, "_", "EXP$subexpression$6"], "postprocess": ([signal, p1, _1, l, _2, p2, _, op, __, r]) => { return { type: "EXPOENT", leftSignal: signal, left: l[0], right: r[0] } }},
    {"name": "EXP$ebnf$3", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "EXP$ebnf$3", "symbols": [], "postprocess": () => null},
    {"name": "EXP$subexpression$7", "symbols": ["SUM"]},
    {"name": "EXP$subexpression$7", "symbols": ["IDENTIFIER"]},
    {"name": "EXP$ebnf$4", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "EXP$ebnf$4", "symbols": [], "postprocess": () => null},
    {"name": "EXP$subexpression$8", "symbols": ["SUM"]},
    {"name": "EXP$subexpression$8", "symbols": ["IDENTIFIER"]},
    {"name": "EXP", "symbols": ["EXP$ebnf$3", {"literal":"("}, "_", "EXP$subexpression$7", "_", {"literal":")"}, "_", {"literal":"^"}, "_", "EXP$ebnf$4", {"literal":"("}, "_", "EXP$subexpression$8", "_", {"literal":")"}], "postprocess": ([signal1, p1, _1, l, _2, p2, _, op, __, signal2, p3, _3, r]) => { return { type: "EXPOENT", leftSignal: signal1, rightSignal: signal2, left: l[0], right: r[0] } }},
    {"name": "EXP", "symbols": ["NUMBER"], "postprocess": id},
    {"name": "EXP", "symbols": [{"literal":"-"}, "IDENTIFIER"], "postprocess": ([signal, idn]) => signal + idn},
    {"name": "NUMBER$ebnf$1", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "NUMBER$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "NUMBER$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "NUMBER$ebnf$2", "symbols": ["NUMBER$ebnf$2", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "NUMBER", "symbols": ["NUMBER$ebnf$1", "NUMBER$ebnf$2"], "postprocess": ([signal, n]) => { return { type: 'LITERAL', value: signal === null ? n.join("") : signal + n.join("") }}},
    {"name": "NUMBER$ebnf$3", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "NUMBER$ebnf$3", "symbols": [], "postprocess": () => null},
    {"name": "NUMBER$ebnf$4", "symbols": [/[0-9]/]},
    {"name": "NUMBER$ebnf$4", "symbols": ["NUMBER$ebnf$4", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "NUMBER$ebnf$5", "symbols": [/[0-9]/]},
    {"name": "NUMBER$ebnf$5", "symbols": ["NUMBER$ebnf$5", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "NUMBER", "symbols": ["NUMBER$ebnf$3", "NUMBER$ebnf$4", {"literal":"."}, "NUMBER$ebnf$5"], "postprocess": ([signal, n1, dot, n2]) => { return { type: 'LITERAL', value: signal === null ? n1.join("") + dot + n2.join("") : signal + n1.join("") + dot + n2.join("") }}},
    {"name": "COMPARATOR", "symbols": [{"literal":">"}], "postprocess": id},
    {"name": "COMPARATOR", "symbols": [{"literal":"<"}], "postprocess": id},
    {"name": "COMPARATOR$string$1", "symbols": [{"literal":">"}, {"literal":"="}], "postprocess": (d) => d.join('')},
    {"name": "COMPARATOR", "symbols": ["COMPARATOR$string$1"], "postprocess": id},
    {"name": "COMPARATOR$string$2", "symbols": [{"literal":"<"}, {"literal":"="}], "postprocess": (d) => d.join('')},
    {"name": "COMPARATOR", "symbols": ["COMPARATOR$string$2"], "postprocess": id},
    {"name": "COMPARATOR$string$3", "symbols": [{"literal":"&"}, {"literal":"&"}], "postprocess": (d) => d.join('')},
    {"name": "COMPARATOR", "symbols": ["COMPARATOR$string$3"], "postprocess": id},
    {"name": "COMPARATOR$string$4", "symbols": [{"literal":"|"}, {"literal":"|"}], "postprocess": (d) => d.join('')},
    {"name": "COMPARATOR", "symbols": ["COMPARATOR$string$4"], "postprocess": id},
    {"name": "COMPARATOR$string$5", "symbols": [{"literal":"="}, {"literal":"="}], "postprocess": (d) => d.join('')},
    {"name": "COMPARATOR", "symbols": ["COMPARATOR$string$5"], "postprocess": id},
    {"name": "COMPARATOR$string$6", "symbols": [{"literal":"/"}, {"literal":"="}], "postprocess": (d) => d.join('')},
    {"name": "COMPARATOR", "symbols": ["COMPARATOR$string$6"], "postprocess": id},
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
