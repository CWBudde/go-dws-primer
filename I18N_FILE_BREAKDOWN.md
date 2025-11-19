# go-dws-primer i18n Structure - Detailed File Breakdown

## 1. HARDCODED UI STRINGS - File Locations

### HTML (index.html)
**Total: ~30 strings spread across 150 lines**

Example hardcoded strings:
```html
<!-- Header -->
<h1 class="logo">DWScript Primer</h1>
<button id="btn-lessons" class="nav-btn active">Lessons</button>
<button id="btn-examples" class="nav-btn">Examples</button>
<button id="btn-challenges" class="nav-btn">Challenges</button>
<button id="btn-playground" class="nav-btn">Playground</button>

<!-- Buttons with titles -->
<button id="btn-share" class="icon-btn" title="Share Code">
<button id="btn-settings" class="icon-btn" title="Settings">
<button id="btn-theme" class="icon-btn" title="Toggle Theme">

<!-- Sidebar -->
<h2>Lessons</h2>
<input type="search" placeholder="Search lessons...">

<!-- Welcome Section -->
<h2>Welcome to DWScript Primer</h2>
<p>Start learning Object Pascal interactively with immediate feedback!</p>

<!-- Code Editor Panel -->
<h3>Code Editor</h3>
<button id="btn-run" title="Run Code (Ctrl+Enter)">▶️ Run</button>
<button id="btn-stop" title="Stop Execution">⏹️ Stop</button>
<button id="btn-clear" title="Clear Output">🗑️ Clear</button>
<button id="btn-format" title="Format Code">✨ Format</button>

<!-- Output Tabs -->
<button class="tab active" data-tab="console">Console</button>
<button class="tab" data-tab="compiler">Compiler</button>
<button class="tab" data-tab="graphics">Graphics</button>

<!-- Graphics controls -->
<button id="btn-clear-canvas" class="btn btn-sm">Clear</button>
<button id="btn-export-canvas" class="btn btn-sm">Export PNG</button>
<label>Speed:<input type="range"></label>

<!-- Status Bar -->
<span id="status-message">Ready</span>
<span id="cursor-position">Ln 1, Col 1</span>

<!-- Loading -->
<p>Loading DWScript Runtime...</p>
```

---

## 2. LESSON UI STRINGS - JavaScript File Analysis

### File: src/lessons/lesson-ui.js (566 lines)

**Location of translatable strings:**

**Line 79:** "Key Concepts" (hardcoded section header)
**Line 98:** "Examples" (hardcoded section header)
**Line 143:** "Practice Exercises" (hardcoded section header)
**Line 233:** "Summary" (hardcoded section header)
**Line 243:** "Next Steps" (hardcoded section header)

**Button labels (various lines):**
```javascript
// Line 111: "Try it"
<button class="btn btn-sm btn-try" data-code="${escapeHtml(example.code)}">
  Try it
</button>

// Line 117: "Show Output" / "Hide Output" (toggled dynamically)
<button class="btn btn-sm btn-show-output">
  Show Output
</button>

// Line 168: "💡 Show Hints"
<button class="btn btn-sm btn-hints">💡 Show Hints</button>

// Line 174: "Hint N:" (dynamic index)
<strong>Hint ${i + 1}:</strong>

// Line 179: "Next Hint"
<button class="btn btn-sm btn-next-hint">Next Hint</button>

// Line 186-206: Exercise action buttons
<button class="btn btn-primary btn-start-exercise">Start Exercise</button>
<button class="btn btn-success btn-check-output">✓ Check Output</button>
<button class="btn btn-sm btn-show-solution">Show Solution</button>

// Line 252-255: Lesson navigation buttons
<button class="btn btn-secondary btn-prev-lesson">← Previous Lesson</button>
<button class="btn btn-primary btn-complete-lesson">Mark as Complete</button>
<button class="btn btn-secondary btn-next-lesson">Next Lesson →</button>

// Line 291, 316: Dynamic text updates
btn.textContent = output.style.display === "none" ? "Show Output" : "Hide Output";
btn.textContent = solution.style.display === "none" ? "Show Solution" : "Hide Solution";

// Line 368, 439: Status messages
btn.textContent = "Checking...";
btn.textContent = "✓ Check Output";

// Line 439, 506: Completion indicator
btn.textContent = "✓ Completed";
```

**Error/validation messages (Lines 377-435):**
```javascript
validationContainer.innerHTML = `
  <div class="output-comparison failure">
    <div class="comparison-header">
      <span class="comparison-icon">✗</span>
      <span class="comparison-title">Execution failed</span>  // TRANSLATABLE
    </div>
    <div class="comparison-details">
      <p>${escapeHtml(result.error?.message || "Unknown error occurred")}</p>
    </div>
  </div>
`;

// Line 429: "Validation error"
<span class="comparison-title">Validation error</span>
```

**Helper function (Line 532-542):**
```javascript
function formatCategory(category) {
  const names = {
    fundamentals: "Fundamentals",              // TRANSLATABLE
    "control-flow": "Control Flow",            // TRANSLATABLE
    functions: "Functions",                    // TRANSLATABLE
    "data-structures": "Data Structures",      // TRANSLATABLE
    oop: "OOP",                                // TRANSLATABLE
    "turtle-graphics": "Turtle Graphics",      // TRANSLATABLE
    advanced: "Advanced",                      // TRANSLATABLE
  };
  return names[category] || category;
}
```

---

### File: src/lessons/navigation.js (370 lines)

**Category display names (Lines 187-196):**
```javascript
function formatCategoryName(category) {
  const names = {
    fundamentals: "Fundamentals",                      // TRANSLATABLE
    "control-flow": "Control Flow",                    // TRANSLATABLE
    functions: "Functions & Procedures",               // TRANSLATABLE
    "data-structures": "Data Structures",              // TRANSLATABLE
    oop: "Object-Oriented Programming",                // TRANSLATABLE
    "turtle-graphics": "Turtle Graphics",              // TRANSLATABLE
    advanced: "Advanced Topics",                       // TRANSLATABLE
  };
  return names[category] || category;
}
```

**Search results message (Line 244-248):**
```javascript
listContainer.innerHTML = `
  <div class="no-results">
    <p>No lessons found for "${query}"</p>  // TRANSLATABLE message
  </div>
`;
```

**Lesson completion (Lines 282-297):**
```javascript
// Line 283: Toast message
showCompletionMessage();

// Inside showCompletionMessage() (Lines 322-341):
message.innerHTML = `
  <div class="toast-content">
    <span class="toast-icon">🎉</span>
    <span>Lesson completed!</span>  // TRANSLATABLE
  </div>
`;

// Line 292: Confirmation dialog
if (confirm(`Great job! Ready for the next lesson: "${nextLesson.title}"?`))
// Both "Great job!" and "Ready for..." are TRANSLATABLE
```

---

### File: src/ui/settings-modal.js (573 lines)

**Modal structure (Lines 43-254):**

```javascript
// Line 45: Modal title
<h2 id="settings-title">Settings</h2>

// Line 46: Close button
<button class="modal-close" aria-label="Close settings" title="Close (Esc)">

// Tab labels (Lines 53-56):
<button class="settings-tab active" data-tab="editor">Editor</button>
<button class="settings-tab" data-tab="accessibility">Accessibility</button>
<button class="settings-tab" data-tab="shortcuts">Keyboard Shortcuts</button>
<button class="settings-tab" data-tab="about">About</button>

// EDITOR SETTINGS (Lines 61-105):
<h3>Editor Appearance</h3>

<label for="setting-font-size">
  Font Size
  <span class="setting-description">Adjust editor text size</span>
</label>

<label for="setting-tab-size">
  Tab Size
  <span class="setting-description">Number of spaces per tab</span>
</label>
<option value="2">2 spaces</option>
<option value="4">4 spaces</option>
<option value="8">8 spaces</option>

<label for="setting-minimap">
  <input type="checkbox">
  Show Minimap
  <span class="setting-description">Display code overview minimap</span>
</label>

<label for="setting-word-wrap">
  <input type="checkbox">
  Word Wrap
  <span class="setting-description">Wrap long lines</span>
</label>

// ACCESSIBILITY SETTINGS (Lines 109-163):
<h3>Visual Accessibility</h3>

<label for="setting-high-contrast">
  <input type="checkbox">
  High Contrast Mode
  <span class="setting-description">Enhanced contrast for better visibility</span>
</label>

<label for="setting-color-blind-mode">
  Color Blind Friendly Palette
  <span class="setting-description">Optimized colors for color vision deficiency</span>
</label>
<option value="none">Default</option>
<option value="protanopia">Protanopia (Red-Blind)</option>
<option value="deuteranopia">Deuteranopia (Green-Blind)</option>
<option value="tritanopia">Tritanopia (Blue-Blind)</option>

<label for="setting-animations">
  <input type="checkbox">
  Enable Animations
  <span class="setting-description">Show UI transitions and animations</span>
</label>

<h3>Screen Reader</h3>

<label for="setting-announce-output">
  <input type="checkbox">
  Announce Program Output
  <span class="setting-description">Read execution results aloud</span>
</label>

<label for="setting-announce-errors">
  <input type="checkbox">
  Announce Errors
  <span class="setting-description">Read compilation and runtime errors</span>
</label>

// KEYBOARD SHORTCUTS (Lines 167-225):
<h3>Keyboard Shortcuts</h3>
<span class="shortcut-action">Run Code</span>
<span class="shortcut-keys"><kbd>Ctrl</kbd> + <kbd>Enter</kbd> or <kbd>F5</kbd></span>

<span class="shortcut-action">Stop Execution</span>
<span class="shortcut-action">Format Code</span>
<span class="shortcut-action">Toggle Comment</span>
<span class="shortcut-action">Find</span>
<span class="shortcut-action">Replace</span>
<span class="shortcut-action">Go to Line</span>
<span class="shortcut-action">Command Palette</span>
<span class="shortcut-action">Toggle Theme</span>
<span class="shortcut-action">Open Settings</span>
<span class="shortcut-action">Increase Font Size</span>
<span class="shortcut-action">Decrease Font Size</span>
<span class="shortcut-action">Reset Font Size</span>

// ABOUT (Lines 227-244):
<h3>About DWScript Primer</h3>
<p>An interactive educational programming environment for learning DWScript/Object Pascal.</p>
<p><strong>Version:</strong> 1.0.0</p>
<p><strong>Runtime:</strong> go-dws WebAssembly</p>
<h4>Links</h4>
<h4>Credits</h4>
<p>Built with Monaco Editor, go-dws, and modern web technologies.</p>

// Footer buttons (Line 250-251):
<button class="btn btn-secondary" id="settings-reset">Reset to Defaults</button>
<button class="btn btn-primary" id="settings-close">Close</button>
```

---

### File: src/ui/snippets-panel.js (429 lines)

**String locations:**

```javascript
// Line 49-50: Button label and title
btnSnippets.innerHTML = '<span class="icon">📋</span> Snippets';
btnSnippets.title = "Browse code snippets";

// Line 99: Modal header
<h2>Code Snippets</h2>

// Line 104: Search input
<input type="text" class="snippets-search" placeholder="Search snippets...">

// Line 163-164: Category card
<span class="category-name">${category.name}</span>
<span class="category-count">${category.snippets.length}</span>

// Line 188-189: Category header
<h3>${category.icon} ${category.name}</h3>
<p>${category.snippets.length} snippets</p>

// Line 220-225: Snippet action buttons
<button class="btn btn-sm btn-insert" data-code="${escapeHtml(snippet.code)}">
  Insert
</button>
<button class="btn btn-sm btn-view" data-code="${escapeHtml(snippet.code)}">
  View
</button>

// Line 269, 291: Notification message
showNotification("Snippet inserted!");

// Line 360-362: No results message
snippetsList.innerHTML = `
  <div class="no-results">
    <p>No snippets found for "${escapeHtml(searchQuery)}"</p>
  </div>
`;

// Line 369-370: Search results header
<h3>Search Results</h3>
<p>${allSnippets.length} snippets found</p>
```

---

## 3. LESSON CONTENT STRUCTURE

### Sample Lesson File: content/lessons/01-fundamentals/01-hello-world.json

**Translatable fields:**

```json
{
  "id": "hello-world",           // Technical ID - NOT translatable
  "title": "Hello World - Your First Program",  // TRANSLATABLE
  "category": "fundamentals",    // Technical identifier - NOT translatable
  "difficulty": "beginner",      // Could be translatable or keep as tag
  "order": 1,                    // Technical - NOT translatable
  "description": "Learn to write your first DWScript program and understand basic output",  // TRANSLATABLE
  "estimatedTime": 10,           // Technical - NOT translatable
  "tags": ["basics", "beginner", "output", "writeln"],  // TRANSLATABLE (user-facing labels)
  
  "content": {
    "introduction": "Welcome to DWScript! In this lesson...",  // TRANSLATABLE - Markdown
    
    "concepts": [
      {
        "title": "Program Structure",   // TRANSLATABLE
        "description": "Every DWScript program has a clear structure..."  // TRANSLATABLE
      },
      {
        "title": "WriteLn Command",     // TRANSLATABLE
        "description": "WriteLn outputs text to the console..."  // TRANSLATABLE
      }
    ],
    
    "examples": [
      {
        "title": "Basic Hello World",   // TRANSLATABLE
        "description": "The simplest DWScript program...",  // TRANSLATABLE
        "code": "program HelloWorld;\nbegin\n  WriteLn('Hello, World!');\nend.",  // NOT translatable
        "expectedOutput": "Hello, World!"  // May be translatable (output description)
      }
    ],
    
    "exercises": [
      {
        "title": "Write Your Own Message",  // TRANSLATABLE
        "description": "Create a program that outputs your name...",  // TRANSLATABLE
        "starterCode": "program MyProgram;\nbegin\n  // Write your code here\nend.",  // NOT translatable
        "solution": "program MyProgram;\nbegin\n  WriteLn('Hello!...');\nend.",  // NOT translatable
        "hints": [
          "Use WriteLn to output text",  // TRANSLATABLE
          "You can use multiple WriteLn statements",  // TRANSLATABLE
          "Remember to use quotes around text",  // TRANSLATABLE
          "Don't forget the semicolon at the end of each statement"  // TRANSLATABLE
        ]
      }
    ],
    
    "summary": "Congratulations! You've learned...",  // TRANSLATABLE - Markdown
    "nextSteps": "Next, you'll learn about **variables**..."  // TRANSLATABLE - Markdown
  },
  
  "prerequisites": [],           // Technical - NOT translatable
  "relatedLessons": ["variables-and-types"],  // Technical IDs
  "estimatedTime": 10           // Technical - NOT translatable
}
```

---

## 4. SNIPPETS STRUCTURE

### File: content/snippets/snippets.json (partial)

```json
{
  "categories": [
    {
      "id": "basics",                    // Technical ID
      "name": "Basics",                  // TRANSLATABLE
      "icon": "📝",                      // Not translatable
      "snippets": [
        {
          "id": "hello-world",           // Technical ID
          "title": "Hello World",        // TRANSLATABLE
          "description": "Basic program structure with output",  // TRANSLATABLE
          "code": "program HelloWorld;\nbegin\n  WriteLn('Hello, World!');\nend.",  // NOT translatable
          "tags": ["beginner", "output"]  // TRANSLATABLE
        },
        {
          "id": "program-template",
          "title": "Program Template",   // TRANSLATABLE
          "description": "Empty program template",  // TRANSLATABLE
          "code": "program MyProgram;\n...",  // NOT translatable
          "tags": ["template"]            // TRANSLATABLE
        }
      ]
    },
    {
      "id": "control-flow",
      "name": "Control Flow",            // TRANSLATABLE
      "icon": "🔀",
      "snippets": [...]
    }
  ]
}
```

---

## Summary Table: What to Translate

| File | Location | Type | Count | Example |
|------|----------|------|-------|---------|
| index.html | Lines 15-147 | HTML strings | ~30 | "Lessons", "Run", "Console" |
| lesson-ui.js | Lines 79-542 | JS strings | ~30+ | "Key Concepts", "Try it", category names |
| navigation.js | Lines 187-296 | JS strings | ~15 | Category names, "Lesson completed!" |
| settings-modal.js | Lines 43-254 | JS strings | ~45 | Settings labels, descriptions, shortcuts |
| snippets-panel.js | Lines 49-377 | JS strings | ~15 | "Code Snippets", "Search snippets..." |
| lesson JSONs | All fields except code | JSON values | ~550 | Titles, descriptions, hints |
| snippets.json | Category/title/desc | JSON values | ~60 | Category names, snippet descriptions |
| **TOTAL** | - | - | **~750+** | - |

---

## Implementation Priority

**Phase 1 (Essential):**
1. index.html (UI framework)
2. lesson-ui.js (main learning content UI)
3. lesson JSON content (primary educational material)

**Phase 2 (Important):**
4. settings-modal.js (user settings)
5. navigation.js (lesson navigation)
6. snippets-panel.js & snippets.json (code snippets)

**Phase 3 (Polish):**
7. Other UI files
8. Error messages
9. Accessibility descriptions

