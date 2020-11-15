// deno run delm-interpreter.ts ../examples/src/ERC20/ERC20.elm
const filename = Deno.args[0];
const source = await Deno.readTextFile(filename);

console.log(source.split("\n").length);

// check elm.json -> source-directories
// validate path uppercase and stuff.

//
