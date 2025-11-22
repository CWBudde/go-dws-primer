/**
 * IntelliSense for DWScript
 * Provides auto-completion, hover documentation, and signature help
 */

import * as monaco from "monaco-editor";

/**
 * Built-in DWScript functions and procedures with documentation
 */
export const builtInFunctions = [
  // String functions
  {
    label: "Length",
    kind: "function",
    detail: "function Length(s: String): Integer",
    documentation: "Returns the length of a string",
    insertText: "Length(${1:str})",
  },
  {
    label: "Copy",
    kind: "function",
    detail: "function Copy(s: String; index, count: Integer): String",
    documentation: "Returns a substring of a string",
    insertText: "Copy(${1:str}, ${2:index}, ${3:count})",
  },
  {
    label: "Pos",
    kind: "function",
    detail: "function Pos(substr, str: String): Integer",
    documentation: "Returns the position of a substring within a string",
    insertText: "Pos(${1:substr}, ${2:str})",
  },
  {
    label: "UpperCase",
    kind: "function",
    detail: "function UpperCase(s: String): String",
    documentation: "Converts a string to uppercase",
    insertText: "UpperCase(${1:str})",
  },
  {
    label: "LowerCase",
    kind: "function",
    detail: "function LowerCase(s: String): String",
    documentation: "Converts a string to lowercase",
    insertText: "LowerCase(${1:str})",
  },
  {
    label: "Trim",
    kind: "function",
    detail: "function Trim(s: String): String",
    documentation: "Removes leading and trailing whitespace from a string",
    insertText: "Trim(${1:str})",
  },

  // Conversion functions
  {
    label: "IntToStr",
    kind: "function",
    detail: "function IntToStr(value: Integer): String",
    documentation: "Converts an integer to a string",
    insertText: "IntToStr(${1:value})",
  },
  {
    label: "StrToInt",
    kind: "function",
    detail: "function StrToInt(s: String): Integer",
    documentation: "Converts a string to an integer",
    insertText: "StrToInt(${1:str})",
  },
  {
    label: "FloatToStr",
    kind: "function",
    detail: "function FloatToStr(value: Float): String",
    documentation: "Converts a float to a string",
    insertText: "FloatToStr(${1:value})",
  },
  {
    label: "StrToFloat",
    kind: "function",
    detail: "function StrToFloat(s: String): Float",
    documentation: "Converts a string to a float",
    insertText: "StrToFloat(${1:str})",
  },

  // Math functions
  {
    label: "Abs",
    kind: "function",
    detail: "function Abs(value: Float): Float",
    documentation: "Returns the absolute value",
    insertText: "Abs(${1:value})",
  },
  {
    label: "Sqrt",
    kind: "function",
    detail: "function Sqrt(value: Float): Float",
    documentation: "Returns the square root",
    insertText: "Sqrt(${1:value})",
  },
  {
    label: "Sin",
    kind: "function",
    detail: "function Sin(angle: Float): Float",
    documentation: "Returns the sine of an angle (in radians)",
    insertText: "Sin(${1:angle})",
  },
  {
    label: "Cos",
    kind: "function",
    detail: "function Cos(angle: Float): Float",
    documentation: "Returns the cosine of an angle (in radians)",
    insertText: "Cos(${1:angle})",
  },
  {
    label: "Tan",
    kind: "function",
    detail: "function Tan(angle: Float): Float",
    documentation: "Returns the tangent of an angle (in radians)",
    insertText: "Tan(${1:angle})",
  },
  {
    label: "Round",
    kind: "function",
    detail: "function Round(value: Float): Integer",
    documentation: "Rounds a floating-point number to the nearest integer",
    insertText: "Round(${1:value})",
  },
  {
    label: "Trunc",
    kind: "function",
    detail: "function Trunc(value: Float): Integer",
    documentation: "Truncates a floating-point number to an integer",
    insertText: "Trunc(${1:value})",
  },
  {
    label: "Random",
    kind: "function",
    detail: "function Random: Float",
    documentation: "Returns a random number between 0 and 1",
    insertText: "Random",
  },
  {
    label: "RandomInt",
    kind: "function",
    detail: "function RandomInt(max: Integer): Integer",
    documentation: "Returns a random integer between 0 and max-1",
    insertText: "RandomInt(${1:max})",
  },

  // I/O procedures
  {
    label: "WriteLn",
    kind: "method",
    detail: "procedure WriteLn(value)",
    documentation: "Writes a value to the output followed by a newline",
    insertText: "WriteLn(${1:value})",
  },
  {
    label: "Write",
    kind: "method",
    detail: "procedure Write(value)",
    documentation: "Writes a value to the output",
    insertText: "Write(${1:value})",
  },
  {
    label: "PrintLn",
    kind: "method",
    detail: "procedure PrintLn(value)",
    documentation: "Prints a value to the output followed by a newline",
    insertText: "PrintLn(${1:value})",
  },
  {
    label: "Print",
    kind: "method",
    detail: "procedure Print(value)",
    documentation: "Prints a value to the output",
    insertText: "Print(${1:value})",
  },

  // Turtle Graphics functions
  {
    label: "TurtleForward",
    kind: "method",
    detail: "procedure TurtleForward(distance: Float)",
    documentation: "Moves the turtle forward by the specified distance",
    insertText: "TurtleForward(${1:distance})",
  },
  {
    label: "TurtleBackward",
    kind: "method",
    detail: "procedure TurtleBackward(distance: Float)",
    documentation: "Moves the turtle backward by the specified distance",
    insertText: "TurtleBackward(${1:distance})",
  },
  {
    label: "TurtleTurnLeft",
    kind: "method",
    detail: "procedure TurtleTurnLeft(angle: Float)",
    documentation: "Turns the turtle left by the specified angle in degrees",
    insertText: "TurtleTurnLeft(${1:angle})",
  },
  {
    label: "TurtleTurnRight",
    kind: "method",
    detail: "procedure TurtleTurnRight(angle: Float)",
    documentation: "Turns the turtle right by the specified angle in degrees",
    insertText: "TurtleTurnRight(${1:angle})",
  },
  {
    label: "TurtlePenUp",
    kind: "method",
    detail: "procedure TurtlePenUp",
    documentation: "Lifts the turtle pen (stops drawing)",
    insertText: "TurtlePenUp",
  },
  {
    label: "TurtlePenDown",
    kind: "method",
    detail: "procedure TurtlePenDown",
    documentation: "Lowers the turtle pen (starts drawing)",
    insertText: "TurtlePenDown",
  },
  {
    label: "TurtleSetPenColor",
    kind: "method",
    detail: "procedure TurtleSetPenColor(color: String)",
    documentation: 'Sets the turtle pen color (e.g., "red", "#FF0000")',
    insertText: 'TurtleSetPenColor(${1:"black"})',
  },
  {
    label: "TurtleSetPenWidth",
    kind: "method",
    detail: "procedure TurtleSetPenWidth(width: Float)",
    documentation: "Sets the turtle pen width",
    insertText: "TurtleSetPenWidth(${1:2})",
  },
  {
    label: "TurtleHome",
    kind: "method",
    detail: "procedure TurtleHome",
    documentation: "Moves the turtle to the center (0, 0) and points north",
    insertText: "TurtleHome",
  },
  {
    label: "TurtleClear",
    kind: "method",
    detail: "procedure TurtleClear",
    documentation: "Clears the turtle canvas",
    insertText: "TurtleClear",
  },
  {
    label: "TurtleCircle",
    kind: "method",
    detail: "procedure TurtleCircle(radius: Float)",
    documentation: "Draws a circle with the specified radius",
    insertText: "TurtleCircle(${1:radius})",
  },
];

/**
 * DWScript keywords with documentation
 */
export const keywords = [
  {
    label: "var",
    kind: "keyword",
    detail: "var",
    documentation: "Declares a variable",
    insertText: "var",
  },
  {
    label: "const",
    kind: "keyword",
    detail: "const",
    documentation: "Declares a constant",
    insertText: "const",
  },
  {
    label: "begin",
    kind: "keyword",
    detail: "begin",
    documentation: "Starts a block of statements",
    insertText: "begin",
  },
  {
    label: "end",
    kind: "keyword",
    detail: "end",
    documentation: "Ends a block of statements",
    insertText: "end",
  },
  {
    label: "if",
    kind: "keyword",
    detail: "if",
    documentation: "Conditional statement",
    insertText: "if",
  },
  {
    label: "then",
    kind: "keyword",
    detail: "then",
    documentation: "Part of if statement",
    insertText: "then",
  },
  {
    label: "else",
    kind: "keyword",
    detail: "else",
    documentation: "Alternative branch of if statement",
    insertText: "else",
  },
  {
    label: "for",
    kind: "keyword",
    detail: "for",
    documentation: "For loop",
    insertText: "for",
  },
  {
    label: "while",
    kind: "keyword",
    detail: "while",
    documentation: "While loop",
    insertText: "while",
  },
  {
    label: "repeat",
    kind: "keyword",
    detail: "repeat",
    documentation: "Repeat-until loop",
    insertText: "repeat",
  },
  {
    label: "until",
    kind: "keyword",
    detail: "until",
    documentation: "End condition for repeat loop",
    insertText: "until",
  },
  {
    label: "class",
    kind: "keyword",
    detail: "class",
    documentation: "Class declaration",
    insertText: "class",
  },
  {
    label: "procedure",
    kind: "keyword",
    detail: "procedure",
    documentation: "Declares a procedure",
    insertText: "procedure",
  },
  {
    label: "function",
    kind: "keyword",
    detail: "function",
    documentation: "Declares a function",
    insertText: "function",
  },
];

/**
 * Register IntelliSense providers
 * @param {monaco.languages} languages - Monaco languages API
 */
export function registerIntelliSense(languages) {
  // Completion provider
  languages.registerCompletionItemProvider("dwscript", {
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const suggestions = [
        ...builtInFunctions.map((func) => ({
          label: func.label,
          kind:
            func.kind === "function"
              ? languages.CompletionItemKind.Function
              : languages.CompletionItemKind.Method,
          detail: func.detail,
          documentation: func.documentation,
          insertText: func.insertText,
          insertTextRules:
            languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range: range,
        })),
        ...keywords.map((kw) => ({
          label: kw.label,
          kind: languages.CompletionItemKind.Keyword,
          detail: kw.detail,
          documentation: kw.documentation,
          insertText: kw.insertText,
          range: range,
        })),
      ];

      return { suggestions };
    },
  });

  // Hover provider
  languages.registerHoverProvider("dwscript", {
    provideHover: (model, position) => {
      const word = model.getWordAtPosition(position);
      if (!word) return null;

      const item = [...builtInFunctions, ...keywords].find(
        (item) => item.label.toLowerCase() === word.word.toLowerCase(),
      );

      if (item) {
        return {
          range: new monaco.Range(
            position.lineNumber,
            word.startColumn,
            position.lineNumber,
            word.endColumn,
          ),
          contents: [
            { value: `**${item.detail}**` },
            { value: item.documentation },
          ],
        };
      }

      return null;
    },
  });

  // Signature help provider
  languages.registerSignatureHelpProvider("dwscript", {
    signatureHelpTriggerCharacters: ["(", ","],
    provideSignatureHelp: (model, position) => {
      const textUntilPosition = model.getValueInRange({
        startLineNumber: position.lineNumber,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      });

      // Find function name
      const match = textUntilPosition.match(/(\w+)\s*\([^)]*$/);
      if (!match) return null;

      const funcName = match[1];
      const func = builtInFunctions.find(
        (f) => f.label.toLowerCase() === funcName.toLowerCase(),
      );

      if (!func) return null;

      return {
        value: {
          signatures: [
            {
              label: func.detail,
              documentation: func.documentation,
              parameters: [],
            },
          ],
          activeSignature: 0,
          activeParameter: 0,
        },
        dispose: () => {},
      };
    },
  });
}
