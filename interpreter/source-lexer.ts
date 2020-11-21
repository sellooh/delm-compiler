enum TokenType {
  keyword = "KEYWORD",
  assign = "ASSING",
  reference = "REFERENCE",
  anonymous = "ANONYMOUS",
  blockEnd = "BLOCK_END",
  scopeEnd = "SCOPE_END",
  identifier = "IDENTIFIER",
  numberLiteral = "NUMBER_LITERAL",
  separator = "SEPARATOR",
  operator = "OPERATOR",
  lparen = "LPAREN",
  rparen = "RPAREN",
  lbrace = "LBRACE",
  rbrace = "RBRACE",
  lbracket = "LBRACKET",
  rbracket = "RBRACKET",
  dQuote = "D_QUOTE",
  sQuote = "S_QUOTE",
  tripleDQuotes = "TRIPLE_D_QUOTES", // TODO handle these
  contents = "CONTENTS",
}

interface Token {
  type: TokenType;
  symbol: string;
}

const keywords = [
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

const ignore = [
  " ",
  "",
];

export function lexer(lines: string[]): Token[] {
  const tokens: Token[] = [];
  let inMultilineComment = 0,
    inMultilineString = false,
    multilineStringContent = "";

  for (const line of lines) {
    let lexedLine = line.trim();
    if (inMultilineComment) {
      const commentOpen = (lexedLine.match(/{-/g) || []).length;
      inMultilineComment += commentOpen;
      const commentClose = (lexedLine.match(/-}/g) || []).length;
      inMultilineComment -= commentClose;
      continue;
    } else {
      const commentOpen = (lexedLine.match(/{-/g) || []).length;
      if (commentOpen > 0 && !inMultilineString) {
        inMultilineComment += commentOpen;
        const commentClose = (lexedLine.match(/-}/g) || []).length;
        inMultilineComment -= commentClose;
        if (inMultilineComment) {
          continue;
        }
      }
    }

    if (inMultilineString) {
      const commentEnd = line.indexOf('"""');
      if (commentEnd !== -1) {
        multilineStringContent += line.slice(0, commentEnd);
        tokens.push({
          type: TokenType.contents,
          symbol: multilineStringContent,
        });
        inMultilineString = false;
        multilineStringContent = "";
        tokens.push({
          type: TokenType.tripleDQuotes,
          symbol: '"""',
        });
        const lineContinuation = line.slice(commentEnd + 3);
        if (lineContinuation) {
          throw "unhandled multiline string";
        }
        continue;
      }
      multilineStringContent += `${line}\n`;
      continue;
    } else if (lexedLine.slice(0, 3) === '"""') {
      console.log(
        "Warning: Proper multiline strings have not been implemented yet.",
      );

      inMultilineString = true;
      tokens.push({
        type: TokenType.tripleDQuotes,
        symbol: '"""',
      });
      const content = lexedLine.slice(3);
      if (content) multilineStringContent += `${lexedLine.slice(3)}\n`;
      continue;
    }

    if (lexedLine.slice(0, 2) == "--") continue;

    if (
      lexedLine.includes(":") &&
      (!lexedLine.match(/^,/g) && !lexedLine.match(/^{/g))
    ) {
      continue;
    }

    if (line == "" && tokens.length) {
      if (tokens[tokens.length - 1].type === TokenType.blockEnd) {
        tokens[tokens.length - 1] = ({
          type: TokenType.scopeEnd,
          symbol: "\n\n",
        });
      } else {
        tokens.push({
          type: TokenType.blockEnd,
          symbol: "\n",
        });
      }
      continue;
    }

    let contents: string[] = [""],
      replaceLineIndexes = [[0, 0]],
      iContent = 0,
      insideContent = "",
      skipNext = false;
    if (lexedLine.includes('"') || lexedLine.includes("'")) {
      // generate contents
      for (let i = 0; i < lexedLine.length; i++) {
        const char = lexedLine[i];
        if (skipNext) {
          skipNext = false;
        } else if (char === '"' && !insideContent) {
          insideContent = '"';
          contents[iContent] = "";
          replaceLineIndexes[iContent] = [i, 0];
        } else if (char === "'" && !insideContent) {
          insideContent = "'";
          contents[iContent] = "";
          replaceLineIndexes[iContent] = [i, 0];
        } else if (insideContent && char === insideContent) {
          const [a] = replaceLineIndexes[iContent];
          replaceLineIndexes[iContent] = [a, i];
          insideContent = "";
          iContent++;
        } else if (insideContent && char === "\\") {
          skipNext = true;
          contents[iContent] += `\\${lexedLine[i + 1]}`;
        } else if (insideContent) {
          contents[iContent] += char;
        }
      }
    }
    let metaContentLine = "", begin = 0, currentContent = 0;
    if (replaceLineIndexes[0][0]) {
      for (let i = 0; i < replaceLineIndexes.length; i++) {
        const [start, end] = replaceLineIndexes[i];
        metaContentLine += lexedLine.slice(begin, start);
        metaContentLine += lexedLine[start];
        metaContentLine += "$CONTENT$";

        const [next] = replaceLineIndexes[i + 1] || [lexedLine.length + 1];

        metaContentLine += lexedLine.slice(end, next);
        begin = next;
      }
      // console.log(lexedLine);
      // console.log(contents);
      // console.log(metaContentLine);
    }

    lexedLine = metaContentLine || lexedLine;
    lexedLine = lexedLine.replace(/\((.)/g, "( $1");
    lexedLine = lexedLine.replace(/(.)\)/g, "$1 )");
    lexedLine = lexedLine.replace(/\[(.)/g, "[ $1");
    lexedLine = lexedLine.replace(/(.)\]/g, "$1 ]");
    lexedLine = lexedLine.replace(/(.),/g, "$1 ,");
    lexedLine = lexedLine.replace(/\)/g, " ) ");
    lexedLine = lexedLine.replace(/\\([a-zA-Z])/g, "\\ $1");
    lexedLine = lexedLine.replace(/"/g, ' " ');
    lexedLine = lexedLine.replace(/'/g, " ' ");

    const words = lexedLine.split(" ");

    for (const word of words) {
      if (keywords.includes(word)) {
        tokens.push({
          type: TokenType.keyword,
          symbol: word,
        });
      } else {
        switch (word) {
          case "(":
            tokens.push({
              type: TokenType.lparen,
              symbol: "(",
            });
            break;
          case ")":
            tokens.push({
              type: TokenType.rparen,
              symbol: ")",
            });
            break;
          case "[":
            tokens.push({
              type: TokenType.lbracket,
              symbol: "[",
            });
            break;
          case "]":
            tokens.push({
              type: TokenType.rbracket,
              symbol: "]",
            });
            break;
          case "{":
            tokens.push({
              type: TokenType.lbrace,
              symbol: "{",
            });
            break;
          case "}":
            tokens.push({
              type: TokenType.rbrace,
              symbol: "}",
            });
            break;
          case "|":
          case ",":
            tokens.push({
              type: TokenType.separator,
              symbol: word,
            });
            break;
          case "=":
            tokens.push({
              type: TokenType.assign,
              symbol: "=",
            });
            break;
          case ":":
            tokens.push({
              type: TokenType.reference,
              symbol: ":",
            });
            break;
          case "\\":
            tokens.push({
              type: TokenType.anonymous,
              symbol: "\\",
            });
            break;
          case '"':
            tokens.push({
              type: TokenType.dQuote,
              symbol: '"',
            });
            break;
          case "'":
            tokens.push({
              type: TokenType.sQuote,
              symbol: "'",
            });
            break;
          case "$CONTENT$":
            tokens.push({
              type: TokenType.contents,
              symbol: contents[currentContent++],
            });
            break;
          case ">":
          case "<":
          case ">=":
          case "<=":
          case "&&":
          case "||":
          case "<|":
          case "|>":
          case ">>":
          case "<<":
          case "++":
          case "==":
          case "/=":
          case "+":
          case "-":
          case "*":
          case "/":
          case "//":
          case "^":
            tokens.push({
              type: TokenType.operator,
              symbol: word,
            });
            break;

          default:
            if (!ignore.includes(word)) {
              if (
                word.match(/^[-]?[\d+]/g) ||
                word.match(/^[-]?0x[0-9|A|a|B|b|C|c|D|d|E|e|F|f]+/g)
              ) {
                tokens.push({
                  type: TokenType.numberLiteral,
                  symbol: word,
                });
              } else {
                tokens.push({
                  type: TokenType.identifier,
                  symbol: word,
                });
              }
            }
            break;
        }
      }
    }
  }

  return tokens;
}
