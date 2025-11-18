/**
 * Code Snippets for DWScript
 * Provides code templates and completions
 */

/**
 * DWScript code snippets
 */
export const dwscriptSnippets = [
  {
    label: 'program',
    kind: 'snippet',
    insertText: [
      'program ${1:ProgramName};',
      '',
      'begin',
      '  ${0}',
      'end.'
    ].join('\n'),
    insertTextRules: 4, // InsertAsSnippet
    documentation: 'Basic program structure'
  },
  {
    label: 'procedure',
    kind: 'snippet',
    insertText: [
      'procedure ${1:ProcedureName}(${2:params});',
      'begin',
      '  ${0}',
      'end;'
    ].join('\n'),
    insertTextRules: 4,
    documentation: 'Procedure declaration'
  },
  {
    label: 'function',
    kind: 'snippet',
    insertText: [
      'function ${1:FunctionName}(${2:params}): ${3:ReturnType};',
      'begin',
      '  Result := ${0};',
      'end;'
    ].join('\n'),
    insertTextRules: 4,
    documentation: 'Function declaration'
  },
  {
    label: 'if',
    kind: 'snippet',
    insertText: [
      'if ${1:condition} then',
      'begin',
      '  ${0}',
      'end;'
    ].join('\n'),
    insertTextRules: 4,
    documentation: 'If statement'
  },
  {
    label: 'ifelse',
    kind: 'snippet',
    insertText: [
      'if ${1:condition} then',
      'begin',
      '  ${2}',
      'end',
      'else',
      'begin',
      '  ${0}',
      'end;'
    ].join('\n'),
    insertTextRules: 4,
    documentation: 'If-else statement'
  },
  {
    label: 'for',
    kind: 'snippet',
    insertText: [
      'for ${1:i} := ${2:1} to ${3:10} do',
      'begin',
      '  ${0}',
      'end;'
    ].join('\n'),
    insertTextRules: 4,
    documentation: 'For loop'
  },
  {
    label: 'forvar',
    kind: 'snippet',
    insertText: [
      'for var ${1:i} := ${2:1} to ${3:10} do',
      'begin',
      '  ${0}',
      'end;'
    ].join('\n'),
    insertTextRules: 4,
    documentation: 'For loop with inline variable declaration'
  },
  {
    label: 'while',
    kind: 'snippet',
    insertText: [
      'while ${1:condition} do',
      'begin',
      '  ${0}',
      'end;'
    ].join('\n'),
    insertTextRules: 4,
    documentation: 'While loop'
  },
  {
    label: 'repeat',
    kind: 'snippet',
    insertText: [
      'repeat',
      '  ${0}',
      'until ${1:condition};'
    ].join('\n'),
    insertTextRules: 4,
    documentation: 'Repeat-until loop'
  },
  {
    label: 'case',
    kind: 'snippet',
    insertText: [
      'case ${1:value} of',
      '  ${2:1}: ${3:statement};',
      '  ${4:2}: ${5:statement};',
      'else',
      '  ${0}',
      'end;'
    ].join('\n'),
    insertTextRules: 4,
    documentation: 'Case statement'
  },
  {
    label: 'class',
    kind: 'snippet',
    insertText: [
      '${1:TMyClass} = class',
      'private',
      '  ${2:FField}: ${3:Integer};',
      'public',
      '  constructor Create;',
      '  destructor Destroy; override;',
      '  ${0}',
      'end;'
    ].join('\n'),
    insertTextRules: 4,
    documentation: 'Class declaration'
  },
  {
    label: 'constructor',
    kind: 'snippet',
    insertText: [
      'constructor ${1:TClassName}.Create;',
      'begin',
      '  inherited;',
      '  ${0}',
      'end;'
    ].join('\n'),
    insertTextRules: 4,
    documentation: 'Constructor implementation'
  },
  {
    label: 'destructor',
    kind: 'snippet',
    insertText: [
      'destructor ${1:TClassName}.Destroy;',
      'begin',
      '  ${0}',
      '  inherited;',
      'end;'
    ].join('\n'),
    insertTextRules: 4,
    documentation: 'Destructor implementation'
  },
  {
    label: 'try',
    kind: 'snippet',
    insertText: [
      'try',
      '  ${1}',
      'except',
      '  on E: Exception do',
      '  begin',
      '    ${0}',
      '  end;',
      'end;'
    ].join('\n'),
    insertTextRules: 4,
    documentation: 'Try-except block'
  },
  {
    label: 'tryfinally',
    kind: 'snippet',
    insertText: [
      'try',
      '  ${1}',
      'finally',
      '  ${0}',
      'end;'
    ].join('\n'),
    insertTextRules: 4,
    documentation: 'Try-finally block'
  },
  {
    label: 'writeln',
    kind: 'snippet',
    insertText: 'WriteLn(${1:text});',
    insertTextRules: 4,
    documentation: 'Write line to output'
  },
  {
    label: 'print',
    kind: 'snippet',
    insertText: 'PrintLn(${1:text});',
    insertTextRules: 4,
    documentation: 'Print line to output'
  },
  // Turtle Graphics snippets
  {
    label: 'turtle-square',
    kind: 'snippet',
    insertText: [
      'for var i := 1 to 4 do',
      'begin',
      '  TurtleForward(${1:100});',
      '  TurtleTurnRight(90);',
      'end;'
    ].join('\n'),
    insertTextRules: 4,
    documentation: 'Draw a square with turtle graphics'
  },
  {
    label: 'turtle-polygon',
    kind: 'snippet',
    insertText: [
      'var sides := ${1:6};',
      'var length := ${2:100};',
      'var angle := 360 / sides;',
      '',
      'for var i := 1 to sides do',
      'begin',
      '  TurtleForward(length);',
      '  TurtleTurnRight(angle);',
      'end;'
    ].join('\n'),
    insertTextRules: 4,
    documentation: 'Draw a regular polygon with turtle graphics'
  },
  {
    label: 'turtle-spiral',
    kind: 'snippet',
    insertText: [
      'var distance := ${1:5};',
      '',
      'for var i := 1 to ${2:100} do',
      'begin',
      '  TurtleForward(distance);',
      '  TurtleTurnRight(${3:90});',
      '  distance := distance + ${4:2};',
      'end;'
    ].join('\n'),
    insertTextRules: 4,
    documentation: 'Draw a spiral with turtle graphics'
  }
];

/**
 * Register snippets as completion provider
 * @param {monaco.languages} languages - Monaco languages API
 */
export function registerSnippets(languages) {
  languages.registerCompletionItemProvider('dwscript', {
    provideCompletionItems: (model, position) => {
      const suggestions = dwscriptSnippets.map(snippet => ({
        label: snippet.label,
        kind: languages.CompletionItemKind.Snippet,
        insertText: snippet.insertText,
        insertTextRules: snippet.insertTextRules,
        documentation: snippet.documentation,
        range: {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: model.getWordUntilPosition(position).startColumn,
          endColumn: position.column
        }
      }));

      return { suggestions };
    }
  });
}
