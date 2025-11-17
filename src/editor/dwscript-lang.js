/**
 * DWScript Language Definition for Monaco Editor
 * Based on Object Pascal syntax with DWScript extensions
 */

export const dwscriptLanguage = {
  defaultToken: '',
  tokenPostfix: '.dwscript',
  ignoreCase: true,

  keywords: [
    'and', 'array', 'as', 'asm', 'begin', 'case', 'class', 'const', 'constructor',
    'destructor', 'div', 'do', 'downto', 'else', 'end', 'except', 'exports',
    'file', 'finalization', 'finally', 'for', 'function', 'goto', 'if',
    'implementation', 'in', 'inherited', 'initialization', 'inline', 'interface',
    'is', 'label', 'library', 'mod', 'nil', 'not', 'object', 'of', 'operator',
    'or', 'out', 'packed', 'procedure', 'program', 'property', 'raise', 'record',
    'repeat', 'resourcestring', 'set', 'shl', 'shr', 'string', 'then', 'threadvar',
    'to', 'try', 'type', 'unit', 'until', 'uses', 'var', 'while', 'with', 'xor',
    'absolute', 'abstract', 'assembler', 'automated', 'cdecl', 'contains', 'default',
    'deprecated', 'dispid', 'dynamic', 'export', 'external', 'far', 'forward',
    'helper', 'implements', 'index', 'message', 'name', 'near', 'nodefault',
    'overload', 'override', 'package', 'pascal', 'platform', 'private', 'protected',
    'public', 'published', 'read', 'register', 'reintroduce', 'requires', 'resident',
    'safecall', 'sealed', 'static', 'stdcall', 'stored', 'strict', 'virtual',
    'write', 'partial', 'lambda', 'ensure', 'require', 'old', 'new', 'on',
    'exit', 'break', 'continue'
  ],

  typeKeywords: [
    'Boolean', 'Integer', 'Float', 'String', 'Char', 'Variant', 'Double',
    'Extended', 'Currency', 'Real', 'Single', 'Int64', 'Byte', 'Word',
    'Cardinal', 'LongInt', 'LongWord', 'ShortInt', 'SmallInt'
  ],

  operators: [
    '=', '>', '<', '<=', '>=', '<>', ':=', '+', '-', '*', '/', 'div', 'mod',
    'and', 'or', 'xor', 'not', 'shl', 'shr', '@', '^', '..', '.'
  ],

  // Common symbols
  symbols: /[=><!~?:&|+\-*\/\^%]+/,

  // Tokenizer
  tokenizer: {
    root: [
      // Identifiers and keywords
      [/[a-z_$][\w$]*/, {
        cases: {
          '@typeKeywords': 'keyword.type',
          '@keywords': 'keyword',
          '@default': 'identifier'
        }
      }],

      // Whitespace
      { include: '@whitespace' },

      // Delimiters and operators
      [/[{}()\[\]]/, '@brackets'],
      [/[<>](?!@symbols)/, '@brackets'],
      [/@symbols/, {
        cases: {
          '@operators': 'operator',
          '@default': ''
        }
      }],

      // Numbers
      [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
      [/\$[0-9a-fA-F]+/, 'number.hex'],
      [/\d+/, 'number'],

      // Delimiter
      [/[;,.]/, 'delimiter'],

      // Strings
      [/'([^'\\]|\\.)*$/, 'string.invalid'], // non-terminated string
      [/'/, { token: 'string.quote', bracket: '@open', next: '@string' }],

      // Characters
      [/#\d+/, 'string.char'],
      [/#\$[0-9a-fA-F]+/, 'string.char']
    ],

    comment: [
      [/[^\{\}]+/, 'comment'],
      [/\{/, 'comment', '@push'],
      [/\}/, 'comment', '@pop'],
      [/[\{\}]/, 'comment']
    ],

    string: [
      [/[^\\']+/, 'string'],
      [/\\./, 'string.escape.invalid'],
      [/'/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
    ],

    whitespace: [
      [/[ \t\r\n]+/, 'white'],
      [/\{/, 'comment', '@comment'],
      [/\/\/.*$/, 'comment'],
      [/\(\*/, 'comment', '@comment2']
    ],

    comment2: [
      [/[^\*\)]+/, 'comment'],
      [/\*\)/, 'comment', '@pop'],
      [/[\*\)]/, 'comment']
    ]
  }
};
