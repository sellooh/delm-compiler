DECLARATION -> FUNCTION_DELCARATION __ "=" __ S_STATEMENT
	
			{% ([dcl, _, eq, __, stm]) => { return { type: "DECLARATION", left: dcl, right: stm } } %}


FUNCTION_DELCARATION -> ID_UNWRAPPED PARAMS

			{% ([fun, params]) => { return { fun, params: params.reverse() } } %}


PARAMS -> PARAMS __ ID_UNWRAPPED

			{% ([params, _1, id]) => { return [ id, ...params ] } %}

		| null

			{% () => [] %}


EXPRESSIONS -> EXPRESSIONS __ (IDENTIFIER {% ([id]) => id %} | LITERAL {% ([id]) => id[0] %})

				{% ([es, _, v]) => [v, ...es] %}

			| null

				#{% () => null %}



S_STATEMENT -> 	STATEMENT
			
				{% ([n]) => n %}

			| STATEMENT __ "<|" __ RIGHT_STATEMENT
				
				{% ([fun, _1, pipe, _2, param]) => { return { type: 'FUNCTION_CALL', fun, param }} %}

			| LEFT_STATEMENT __ "|>" __ STATEMENT

				{% ([param, _1, pipe, _2, fun]) => { return { type: 'FUNCTION_CALL', fun, param }} %}

			| LET_IN __ S_STATEMENT

				{% ([dcls, _, stm]) => { return { type: 'SCOPE', declarations: dcls, statement: stm }} %}

			| CASE_OF
			
				{% ([n]) => n %}


RIGHT_STATEMENT -> STATEMENT

				{% ([n]) => n %}
			
			| STATEMENT __ "<|" __ RIGHT_STATEMENT

				{% ([fun, _1, pipe, _2, param]) => { return { type: 'FUNCTION_CALL', fun, param }} %}


LEFT_STATEMENT -> STATEMENT

				{% ([n]) => n %}
			
			| LEFT_STATEMENT __ "|>" __ STATEMENT

				{% ([param, _1, pipe, _2, fun]) => { return { type: 'FUNCTION_CALL', fun, param }} %}


STATEMENT ->  CALL

			{% ([n]) => n[0] %}

		| CALL __ COMPARATOR __ CALL

			{% ([c1, _, cmp, __, c2]) => { return { type: 'COMPARATOR', comparator: cmp, left: c1[0], right: c2[0] }} %}


LET_IN -> "let" __ LET_IN_DECLARATIONS __ "in"

			{% ([lt, _1, declarations, _2, _in]) => { return declarations } %}


LET_IN_DECLARATIONS -> (ID_UNWRAPPED | "(" TUPLE ")" {% ([_1, v, _2]) => [v] %}) __ "=" __ S_STATEMENT " <END> ":? LET_IN_DECLARATIONS

			{% ([[dcl], _1, eq, _2, stm, end, declarations]) => { return [{ left: dcl, right: stm }, ...declarations] } %}

		| null

			{% () => [] %}


CASE_OF -> "case" __ ID_UNWRAPPED __ "of" CASE_OF_BRANCH

			{% ([_case, _1, condition, _2, of, branches]) => { return { type: "CASE", condition, branches } } %}


CASE_OF_BRANCH -> __ (CASE_OF_MATCH | "_") __ "->" __ S_STATEMENT _ "[END]":? _ CASE_OF_BRANCH

			{% ([_1, [match], _2, arrow, _3, stm, _4, END, _5, branches]) => { return [{ type: "BRANCH", match, statement: stm }, ...branches] } %}

		| null

			{% () => [] %}

CASE_OF_MATCH -> ID_UNWRAPPED __ CASE_OF_MATCH

		{% ([fun, _1, param]) => { return { fun, param } } %}

	| "(" TUPLE ")"

		{% ([_1, v, _2]) => v %}

	| ID_UNWRAPPED

		{% ([id]) => id %}

	| null


CALL -> LITERAL
			
			{% ([n]) => [...n] %}

	| IDENTIFIER EXPRESSIONS

			{% ([id, params]) => { return params.length > 0 ? [{ type: "FUNCTION_CALL", fun: id, param: params.reverse() }] : [id] } %}


LITERAL -> 	SUM
			
			{% n => n %}

		| "(" TUPLE ")"

			{% ([_, v, __]) => { return [{ type: 'TUPLE', value: v }] } %}

		| "[" ARRAY "]"

			{% ([_, v, __]) => { return [{ type: 'ARRAY', value: v }] } %}

		| "{" RECORD_DEFINITION "}"

			{% ([_, values, __]) => { return [{ type: 'RECORD', values }] } %}

		| "[" "]"

			{% () => { return [{ type: 'ARRAY', value: null }] } %}

		| "(" ")"

			{% () => { return [{ type: 'TUPLE', value: null }] } %}

		| "(" _ S_STATEMENT _ ")"

			{% ([p1, _1, v, _2, p2]) => { return [v] } %}


ARRAY -> __ S_STATEMENT "," ARRAY

			{% ([_, v, comma, c]) => [v, ...c] %}

		| __ S_STATEMENT __

			{% ([_, v, __]) => [v] %}

TUPLE -> __ S_STATEMENT "," __ S_STATEMENT "," __ S_STATEMENT __

			{% ([_, st1, comma1, __, st2, comma2, ___, st3]) => [st1, st2, st3] %}

		|  __ S_STATEMENT "," __ S_STATEMENT __

			{% ([_, st1, __, comma1, st2]) => [st1, st2] %}

RECORD_DEFINITION -> 	__ ID_UNWRAPPED __ "=" __ S_STATEMENT _ "," RECORD_DEFINITION
			
			{% ([_, key, __, eq, ___, value, _e1, comma, values]) => { return [{ key, value }, ...values]} %}

		|  	__ ID_UNWRAPPED __ "=" __ S_STATEMENT __
			
			{% ([_, key, __, eq, ___, value]) => { return [{ key, value }]} %}


SUM -> (SUM|IDENTIFIER) __ ("+" | "-") __ (PRODUCT|IDENTIFIER)

			{% ([l, _, op, __, r]) => { return { type: "SUM", operation: op[0], left: l[0], right: r[0] } } %}

		| (PRODUCT|IDENTIFIER) __ ("+" | "-") __ "-":? "(" _ (SUM|IDENTIFIER) _ ")"

			{% ([l, _, op, __, signal, p1, s1, r, s2, p2 ]) => { return { type: "SUM", rightSignal: signal, operation: op[0], left: l[0], right: r[0] } } %}

		| "-":? "(" _ (SUM|IDENTIFIER) _ ")" __ ("+" | "-") __ (PRODUCT|IDENTIFIER)

			{% ([ signal, , p1, s1, l, s2, p2, _, op, __, r ]) => { return { type: "SUM", rightSignal: signal, operation: op[0], left: l[0], right: r[0] } } %}

		| "-":? "(" _ (SUM|IDENTIFIER) _ ")" _ ("+" | "-") _ "-":? "(" _ (SUM|IDENTIFIER) _ ")"

			{% ([signal1, p1, _1, l, _2, p2, _, op, __, signal2, p3, _3, r]) => { return { type: "SUM", leftSignal: signal1, rightSignal: signal2, left: l[0], right: r[0] } } %}

		| PRODUCT

			{% ([n]) => n %}


PRODUCT -> (PRODUCT|IDENTIFIER) __ ("*" | "/" | "//") __ (EXP|IDENTIFIER)

			{% ([l, _, op, __, r]) => { return { type: "PRODUCT", operation: op[0], left: l[0], right: r[0] } } %}

		| (EXP|IDENTIFIER) __ ("*" | "/" | "//") __ "-":? "(" _ (SUM|IDENTIFIER) _ ")"

			{% ([l, _, op, __, signal, p1, s1, r, s2, p2 ]) => { return { type: "PRODUCT", rightSignal: signal, operation: op[0], left: l[0], right: r[0] } } %}

		| "-":? "(" _ (SUM|IDENTIFIER) _ ")" __ ("*" | "/" | "//") __ (EXP|IDENTIFIER)

			{% ([signal, p1, s1, l, s2, p2, _, op, __, r ]) => { return { type: "PRODUCT", leftSignal: signal, operation: op[0], left: l[0], right: r[0] } } %}

		| "-":? "(" _ (SUM|IDENTIFIER) _ ")" _ ("*" | "/" | "//") _ "-":? "(" _ (SUM|IDENTIFIER) _ ")"

			{% ([signal1, p1, _1, l, _2, p2, _, op, __, signal2, p3, _3, r]) => { return { type: "PRODUCT", leftSignal: signal1, rightSignal: signal2, left: l[0], right: r[0] } } %}

		| EXP

			{% ([n]) => n %}


# TODO test for double sided parenthesis
EXP -> (NUMBER|IDENTIFIER) _ "^" _ (EXP | IDENTIFIER)

			{% ([l, _, op, __, r]) => { return { type: "EXPOENT", left: l[0], right: r[0] } } %}

		| (NUMBER|IDENTIFIER) _ "^" _ "-":? "(" _ (SUM|IDENTIFIER) _ ")"

			{% ([ l, _, op, __, signal, p1, _1, r, _2, p2 ]) => { return { type: "EXPOENT", rightSignal: signal, left: l[0], right: r[0] } } %}

		| "-":? "(" _ (SUM|IDENTIFIER) _ ")" _ "^" _ (NUMBER|IDENTIFIER)

			{% ([signal, p1, _1, l, _2, p2, _, op, __, r]) => { return { type: "EXPOENT", leftSignal: signal, left: l[0], right: r[0] } } %}

		| "-":? "(" _ (SUM|IDENTIFIER) _ ")" _ "^" _ "-":? "(" _ (SUM|IDENTIFIER) _ ")"

			{% ([signal1, p1, _1, l, _2, p2, _, op, __, signal2, p3, _3, r]) => { return { type: "EXPOENT", leftSignal: signal1, rightSignal: signal2, left: l[0], right: r[0] } } %}

		| NUMBER

			{% id %}

		| "-" IDENTIFIER

			{% ([signal, idn]) => signal + idn %}


NUMBER -> 	"-":? [0-9]:+

			{% ([signal, n]) => { return { type: 'LITERAL', value: signal === null ? n.join("") : signal + n }} %}

		| "-":? [0-9]:+ "." [0-9]:+

			{% ([signal, n1, dot, n2]) => { return { type: 'LITERAL', value: signal === null ? n1 + dot + n2 : signal + n1 + dot + n2 }} %}
		 # TODO add HEX


COMPARATOR
		-> ">" {% id %}
		 | "<" {% id %}
		 | ">=" {% id %}
		 | "<=" {% id %}
		 | "&&" {% id %}
		 | "||" {% id %}
		 | "==" {% id %}
		 | "/=" {% id %}


# TODO dot case
IDENTIFIER -> IDENTIFIER "." ID

				{% ([identf, dot, [id]]) => { return { type: 'IDENTIFIER', value: identf.value + dot + id.join("") } } %}

			| ID

				{% ([n]) => { return { type: 'IDENTIFIER', value: n[0].join("") } } %}


ID_UNWRAPPED -> ID

				{% ([n]) => { return { type: 'IDENTIFIER', value: n[0].join("") } } %}


ID -> [a-zA-Z]:+

				{% n => n %}

			| [a-zA-Z]:+ [0-9]:+ (ID {% ([n]) => n %} | null)

				{% ([n1, n2, [n3]]) => { return n3?.[0] ? [[...n1, ...n2, ...n3]] : [[...n1, ...n2]]} %}


_ -> " ":?  {% () => null %}
__ -> " " 	{% () => null %}










