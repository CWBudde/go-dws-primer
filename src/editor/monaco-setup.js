import * as monaco from 'monaco-editor';
import { dwscriptLanguage } from './dwscript-lang.js';

let editor = null;

/**
 * Initialize Monaco Editor
 * @param {HTMLElement} container - The container element for the editor
 * @param {Object} options - Additional Monaco editor options
 * @returns {monaco.editor.IStandaloneCodeEditor} The editor instance
 */
export function initMonacoEditor(container, options = {}) {
  // Register DWScript language
  monaco.languages.register({ id: 'dwscript' });

  // Set language configuration
  monaco.languages.setMonarchTokensProvider('dwscript', dwscriptLanguage);

  // Set language configuration for auto-closing brackets, etc.
  monaco.languages.setLanguageConfiguration('dwscript', {
    comments: {
      lineComment: '//',
      blockComment: ['{', '}']
    },
    brackets: [
      ['{', '}'],
      ['[', ']'],
      ['(', ')']
    ],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" }
    ],
    surroundingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" }
    ]
  });

  // Default editor options
  const defaultOptions = {
    value: getDefaultCode(),
    language: 'dwscript',
    theme: getTheme(),
    automaticLayout: true,
    fontSize: 14,
    lineNumbers: 'on',
    minimap: {
      enabled: true
    },
    scrollBeyondLastLine: false,
    wordWrap: 'off',
    tabSize: 2,
    insertSpaces: true,
    renderWhitespace: 'selection',
    folding: true,
    bracketPairColorization: {
      enabled: true
    }
  };

  // Create editor
  editor = monaco.editor.create(container, {
    ...defaultOptions,
    ...options
  });

  // Listen for theme changes
  document.addEventListener('themechange', (e) => {
    const theme = e.detail.theme === 'dark' ? 'vs-dark' : 'vs';
    monaco.editor.setTheme(theme);
  });

  return editor;
}

/**
 * Get the editor instance
 * @returns {monaco.editor.IStandaloneCodeEditor|null}
 */
export function getEditor() {
  return editor;
}

/**
 * Get the current code from the editor
 * @returns {string}
 */
export function getCode() {
  return editor ? editor.getValue() : '';
}

/**
 * Set code in the editor
 * @param {string} code
 */
export function setCode(code) {
  if (editor) {
    editor.setValue(code);
  }
}

/**
 * Get the current theme based on the data-theme attribute
 * @returns {string}
 */
function getTheme() {
  const theme = document.documentElement.getAttribute('data-theme');
  return theme === 'dark' ? 'vs-dark' : 'vs';
}

/**
 * Get default code to display in the editor
 * @returns {string}
 */
function getDefaultCode() {
  return `// Welcome to DWScript Primer!
// Write your DWScript code here and press Run to execute it.

program HelloWorld;

begin
  WriteLn('Hello, World!');
  WriteLn('Welcome to DWScript!');
end.
`;
}

/**
 * Format the code in the editor
 */
export function formatCode() {
  if (editor) {
    editor.getAction('editor.action.formatDocument').run();
  }
}

/**
 * Add markers for compile errors
 * @param {Array} errors - Array of error objects with line, column, and message
 */
export function addErrorMarkers(errors) {
  if (!editor) return;

  const model = editor.getModel();
  const markers = errors.map(error => ({
    severity: monaco.MarkerSeverity.Error,
    startLineNumber: error.line,
    startColumn: error.column || 1,
    endLineNumber: error.line,
    endColumn: error.endColumn || 1000,
    message: error.message
  }));

  monaco.editor.setModelMarkers(model, 'dwscript', markers);
}

/**
 * Clear all error markers
 */
export function clearErrorMarkers() {
  if (!editor) return;
  const model = editor.getModel();
  monaco.editor.setModelMarkers(model, 'dwscript', []);
}

/**
 * Setup keyboard shortcuts
 */
export function setupKeyboardShortcuts() {
  if (!editor) return;

  // Ctrl+Enter / Cmd+Enter to run code
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
    document.getElementById('btn-run')?.click();
  });
}
