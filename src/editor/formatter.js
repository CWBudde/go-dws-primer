/**
 * DWScript Code Formatter
 * Provides basic code formatting and beautification
 */

/**
 * Format DWScript code
 * @param {string} code - The code to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted code
 */
export function formatDWScript(code, options = {}) {
  const {
    indentSize = 2,
    useTabs = false,
    insertSpaces = true,
    maxLineLength = 120,
  } = options;

  const indent = useTabs ? "\t" : " ".repeat(indentSize);
  let formatted = "";
  let indentLevel = 0;
  let lines = code.split("\n");

  // Keywords that increase indentation
  const increaseIndent = [
    "begin",
    "class",
    "record",
    "try",
    "case",
    "repeat",
    "private",
    "protected",
    "public",
    "published",
  ];

  // Keywords that decrease indentation
  const decreaseIndent = ["end", "until"];

  // Keywords that both decrease and increase (for else, except, finally)
  const decreaseIncreaseIndent = ["else", "except", "finally"];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    // Skip empty lines
    if (line.length === 0) {
      formatted += "\n";
      continue;
    }

    // Check for keywords that decrease indentation before the line
    let shouldDecreaseBeforeLine = false;
    let shouldDecreaseIncreaseBeforeLine = false;

    decreaseIndent.forEach((keyword) => {
      const regex = new RegExp(`^${keyword}\\b`, "i");
      if (regex.test(line)) {
        shouldDecreaseBeforeLine = true;
      }
    });

    decreaseIncreaseIndent.forEach((keyword) => {
      const regex = new RegExp(`^${keyword}\\b`, "i");
      if (regex.test(line)) {
        shouldDecreaseIncreaseBeforeLine = true;
      }
    });

    // Decrease indentation if needed
    if (shouldDecreaseBeforeLine) {
      indentLevel = Math.max(0, indentLevel - 1);
    } else if (shouldDecreaseIncreaseBeforeLine) {
      indentLevel = Math.max(0, indentLevel - 1);
    }

    // Add indentation
    formatted += indent.repeat(indentLevel) + line + "\n";

    // Check for keywords that increase indentation after the line
    let shouldIncreaseAfterLine = false;

    increaseIndent.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "i");
      if (regex.test(line) && !line.endsWith(";")) {
        shouldIncreaseAfterLine = true;
      }
    });

    // Special handling for 'then' without 'begin'
    if (/\bthen\b(?!.*\bbegin\b)/i.test(line)) {
      shouldIncreaseAfterLine = true;
    }

    // Special handling for 'do' without 'begin'
    if (/\bdo\b(?!.*\bbegin\b)/i.test(line)) {
      shouldIncreaseAfterLine = true;
    }

    // Increase indentation if needed
    if (shouldIncreaseAfterLine) {
      indentLevel++;
    }

    if (shouldDecreaseIncreaseBeforeLine) {
      indentLevel++;
    }

    // Decrease indentation after single-line if/then/do without begin
    if (/\b(then|do)\b(?!.*\bbegin\b)/i.test(line) && i < lines.length - 1) {
      const nextLine = lines[i + 1].trim();
      if (!/^(begin|end|else|until)/i.test(nextLine)) {
        // This is a single-line statement after then/do
        // Indent will be decreased after next line
      }
    }
  }

  return formatted.trimEnd();
}

/**
 * Register code formatter as document formatting provider
 * @param {monaco.languages} languages - Monaco languages API
 */
export function registerFormatter(languages) {
  languages.registerDocumentFormattingEditProvider("dwscript", {
    provideDocumentFormattingEdits: (model, options) => {
      const code = model.getValue();
      const formatted = formatDWScript(code, {
        indentSize: options.tabSize,
        useTabs: !options.insertSpaces,
        insertSpaces: options.insertSpaces,
      });

      return [
        {
          range: model.getFullModelRange(),
          text: formatted,
        },
      ];
    },
  });

  // Also register range formatting
  languages.registerDocumentRangeFormattingEditProvider("dwscript", {
    provideDocumentRangeFormattingEdits: (model, range, options) => {
      // For simplicity, format the entire document
      // A more sophisticated implementation would format only the selected range
      const code = model.getValue();
      const formatted = formatDWScript(code, {
        indentSize: options.tabSize,
        useTabs: !options.insertSpaces,
        insertSpaces: options.insertSpaces,
      });

      return [
        {
          range: model.getFullModelRange(),
          text: formatted,
        },
      ];
    },
  });
}

/**
 * Format code on type (auto-formatting as you type)
 * @param {monaco.languages} languages - Monaco languages API
 */
export function registerOnTypeFormatter(languages) {
  languages.registerOnTypeFormattingEditProvider("dwscript", {
    autoFormatTriggerCharacters: [";", "\n"],
    provideOnTypeFormattingEdits: (model, position, ch, options) => {
      // Auto-format the current line when ; is typed
      const lineNumber = position.lineNumber;
      const line = model.getLineContent(lineNumber);

      // Simple formatting: trim and ensure proper spacing
      const trimmed = line.trim();
      if (trimmed !== line) {
        return [
          {
            range: new monaco.Range(lineNumber, 1, lineNumber, line.length + 1),
            text: trimmed,
          },
        ];
      }

      return [];
    },
  });
}
