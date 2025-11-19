# go-dws-primer Internationalization (i18n) Analysis

## Project Overview
**go-dws-primer** is an interactive, browser-based educational programming environment for learning DWScript/Object Pascal. It's built with vanilla JavaScript, Monaco Editor, and runs entirely in the browser with WebAssembly.

## Current Text Organization

### 1. HARDCODED UI STRINGS (in HTML and JavaScript)

#### A. HTML Strings (index.html)
Located in `/home/user/go-dws-primer/index.html`:

**Header Navigation (Lines 15-32)**
- Logo: "DWScript Primer"
- Navigation buttons: "Lessons", "Examples", "Challenges", "Playground"
- Icon buttons: "Share Code", "Settings", "Toggle Theme"

**Sidebar (Lines 40-46)**
- Header: "Lessons"
- Search placeholder: "Search lessons..."

**Welcome Content (Lines 55-60)**
- Title: "Welcome to DWScript Primer"
- Intro text: "Start learning Object Pascal interactively with immediate feedback!"
- Instructions: "Select a lesson from the sidebar to begin, or jump straight to the playground to experiment."

**Editor Panel (Lines 70-84)**
- Header: "Code Editor"
- Buttons: "Run", "Stop", "Clear", "Format"

**Output Panel (Lines 97-118)**
- Tab labels: "Console", "Compiler", "Graphics"
- Graphics buttons: "Clear", "Export PNG"
- Label: "Speed:"

**Status Bar (Lines 129-135)**
- Default status: "Ready"
- Info: "Ln 1, Col 1", "Memory usage", "Execution time"

**Loading Overlay (Lines 144-147)**
- Message: "Loading DWScript Runtime..."

#### B. JavaScript UI Strings

**settings-modal.js (src/ui/settings-modal.js)** - ~40 user-facing strings
- Modal title: "Settings"
- Tab labels: "Editor", "Accessibility", "Shortcuts", "About"
- Settings sections and descriptions:
  - Font Size, Tab Size, Show Minimap, Word Wrap
  - High Contrast Mode, Color Blind Friendly Palette
  - Enable Animations, Announce Program Output, Announce Errors
- Keyboard shortcut labels: Run Code, Stop Execution, Format Code, etc.
- About section: Version info, links, credits

**snippets-panel.js (src/ui/snippets-panel.js)** - ~15 user-facing strings
- "Code Snippets"
- "Search snippets..."
- "Browse code snippets"
- "Search Results" and "snippets found"
- "Snippet inserted!"
- Categories: "Basics", "Control Flow", "Functions & Procedures", "Data Structures", "Object-Oriented"

**navigation.js (src/lessons/navigation.js)** - ~10 user-facing strings
- Category display names:
  - "Fundamentals"
  - "Control Flow"
  - "Functions & Procedures"
  - "Data Structures"
  - "Object-Oriented Programming"
  - "Turtle Graphics"
  - "Advanced Topics"
- Confirmation message: `Great job! Ready for the next lesson: "${nextLesson.title}"?`
- Toast message: "Lesson completed!"
- Error handling: "No lessons found for", "No", "lesson available"

**lesson-ui.js (src/lessons/lesson-ui.js)** - ~30+ user-facing strings
- Section headers:
  - "Key Concepts"
  - "Examples"
  - "Practice Exercises"
  - "Summary"
  - "Next Steps"
  - "Hint N:"
- Button labels:
  - "Try it"
  - "Show Output" / "Hide Output"
  - "Show Hints"
  - "Next Hint"
  - "Start Exercise"
  - "✓ Check Output"
  - "Show Solution" / "Hide Solution"
  - "← Previous Lesson"
  - "Mark as Complete"
  - "Next Lesson →"
  - "✓ Completed"
- Status labels:
  - "Execution failed"
  - "Validation error"
  - "Checking..."
  - Completion indicators

### 2. LESSON CONTENT STRUCTURE

**Directory:** `/home/user/go-dws-primer/content/lessons/`

**Total: 17 lesson JSON files** organized in categories:

#### Categories:
1. **01-fundamentals/** (4 lessons)
   - 01-hello-world.json
   - 02-variables.json
   - 03-operators.json
   - 04-input-output.json

2. **02-control-flow/** (6 lessons)
   - 01-if-statements.json
   - 02-case-statements.json
   - 03-while-loops.json
   - 04-for-loops.json
   - 05-repeat-until.json
   - 06-break-continue.json

3. **03-functions/** (6 lessons)
   - 01-procedure-basics.json
   - 02-function-basics.json
   - 03-parameters.json
   - 04-scope.json
   - 05-recursion.json
   - 06-overloading.json

4. **06-turtle-graphics/** (1 lesson)
   - 01-turtle-basics.json

#### Lesson JSON Schema (lesson-schema.json):

Each lesson contains translatable content:

```json
{
  "id": "lesson-id",
  "title": "Lesson Title",                    // TRANSLATABLE
  "category": "fundamentals",
  "difficulty": "beginner",
  "order": 1,
  "description": "Brief description",        // TRANSLATABLE
  "estimatedTime": 10,
  "tags": ["tag1", "tag2"],                  // TRANSLATABLE
  "content": {
    "introduction": "Markdown text",         // TRANSLATABLE
    "concepts": [
      {
        "title": "Concept Name",              // TRANSLATABLE
        "description": "Description"          // TRANSLATABLE
      }
    ],
    "examples": [
      {
        "title": "Example Title",             // TRANSLATABLE
        "description": "Description",         // TRANSLATABLE
        "code": "DWScript code",              // NOT TRANSLATABLE
        "expectedOutput": "Output text"       // TRANSLATABLE
      }
    ],
    "exercises": [
      {
        "title": "Exercise Title",            // TRANSLATABLE
        "description": "Exercise text",       // TRANSLATABLE
        "starterCode": "Code",                // NOT TRANSLATABLE
        "solution": "Code",                   // NOT TRANSLATABLE
        "hints": [                            // TRANSLATABLE
          "Hint 1",
          "Hint 2"
        ],
        "tests": [...]                        // Test labels TRANSLATABLE
      }
    ],
    "summary": "Markdown text",                // TRANSLATABLE
    "nextSteps": "Markdown text"              // TRANSLATABLE
  },
  "prerequisites": [],
  "relatedLessons": [],
  "estimatedTime": 10
}
```

**Content Volume per Category:**

| Category | Lessons | Title/Desc | Concepts | Examples | Exercises | Hints | Total Strings |
|----------|---------|-----------|----------|----------|-----------|-------|--------------|
| Fundamentals | 4 | 8 | 16 | 12 (36 items) | 8 (32 items) | ~32 | ~120 |
| Control Flow | 6 | 12 | 24 | 18 (54 items) | 12 (48 items) | ~50 | ~200 |
| Functions | 6 | 12 | 24 | 18 (54 items) | 12 (48 items) | ~50 | ~200 |
| Turtle Graphics | 1 | 2 | 4 | 3 (9 items) | 2 (8 items) | ~8 | ~30 |
| **TOTAL** | **17** | **34** | **68** | **51** (153 items) | **34** (136 items) | ~140 | **~550 strings** |

### 3. CODE SNIPPETS

**File:** `/home/user/go-dws-primer/content/snippets/snippets.json`

Contains 6 snippet categories:
- Basics
- Control Flow
- Functions & Procedures
- Data Structures
- Object-Oriented
- Turtle Graphics

**Translatable elements:**
- Category names
- Snippet titles (~30+)
- Snippet descriptions (~30+)
- Tags (many shared)

**NOT translatable:**
- Code content
- Code examples

### 4. ADDITIONAL UI ELEMENTS

**lesson-loader.js** - Fallback/default lesson strings (when index.json fails)

**validator.js** - Exercise validation messages (likely contain user-facing text for test results)

---

## Content Organization Summary

### What Needs Translation:

**Primary Content (Essential for understanding):**
- Lesson titles, descriptions, and metadata
- Lesson introduction, concepts, summary
- Exercise titles, descriptions, hints
- Concept explanations
- Example descriptions and expected output descriptions
- Snippet titles and descriptions
- Category names

**UI Components (Interaction labels):**
- Navigation buttons and labels
- Settings panel text
- Modal headers and labels
- Button text and tooltips
- Error/success messages
- Status indicators

**Secondary Content:**
- Tags and metadata
- Accessibility settings descriptions
- Keyboard shortcut descriptions
- About/credits information

### What Should NOT be Translated:

- DWScript code (program listings, code examples, starter code)
- Solution code
- Expected output (may contain code output)
- Technical identifiers (language keywords, function names)
- Tags (often kept as-is for consistency)

---

## Current Patterns & Architecture

### 1. Content Loading Pattern

```
index.html
  ↓
/content/lessons/index.json (index of lesson paths)
  ↓
Load individual lesson JSON files
  ↓
lesson-loader.js (caches lessons)
  ↓
lesson-ui.js (renders with Markdown support)
```

**Key Functions:**
- `loadAllLessons()` - Loads from `/content/lessons/index.json`
- `getCategories()` - Groups lessons by category
- `searchLessons()` - Filters by title, description, tags
- `displayLesson()` - Renders lesson content

### 2. String Generation Pattern

Most UI strings are:
- **Hardcoded in JavaScript functions** (not in HTML)
- **Template literals** used for dynamic content
- **Markdown rendered** for lesson content (using `marked` library)
- **Escaped for HTML safety** using helper functions

### 3. State Management

- Uses localStorage for persistence (localStorage keys in English)
- State-manager.js handles user preferences
- URL routing uses hash fragments (#lesson/lesson-id)

---

## What Content is Currently Structured for Translation

### Lessons (JSON Structure)
- Already in JSON files → **Easy to translate**
- Metadata fields are clearly separated
- Markdown content is separate from code
- Schema is well-defined

### Snippets (JSON Structure)
- Simple JSON structure → **Easy to translate**
- Categories, titles, descriptions are separate

### UI Strings (JavaScript)
- Scattered throughout JS files → **Requires refactoring**
- No centralized translation system
- No i18n library integrated
- String formatting uses template literals

---

## Recommended i18n Approach

### Option 1: i18next (Recommended for this project)

**Pros:**
- Industry standard for i18n in web apps
- Excellent Markdown support (can preserve formatting)
- Namespace support (separate translation files per module)
- Backend integration support (for future server-side features)
- Great developer experience

**Implementation:**
1. Create translation files in `/locales/{lang}/` structure
2. Add i18next to dependencies
3. Create `src/core/i18n-setup.js` to initialize
4. Extract strings from JavaScript into JSON/YAML
5. Keep lesson JSON structure, add translations
6. Create language switcher in settings

### Option 2: Custom Simple Solution

**Pros:**
- No external dependencies
- Minimal bundle size impact
- Simple to understand

**Cons:**
- More manual work
- Less featured
- Harder to maintain long-term

### Key Implementation Considerations

1. **Lesson Content**: Can keep JSON structure, add translations at top level or in separate files
2. **Code Examples**: Should NOT be translated
3. **URL Routing**: May need to handle language prefix or parameter
4. **LocalStorage**: Language preference stored persistently
5. **Performance**: Lazy load language files only when needed
6. **Namespacing**: Separate translation files for UI, lessons, snippets

---

## File Structure for i18n

If implementing i18n, recommended structure:

```
/locales/
  /en/
    common.json       (UI strings)
    lessons/
      fundamentals.json
      control-flow.json
      functions.json
      turtle-graphics.json
    snippets.json
  /es/
    common.json
    lessons/
      ... (same structure)
    snippets.json
  /fr/
  /de/
  ... (other languages)

/src/
  /core/
    i18n-setup.js     (Initialize i18n system)
  /utils/
    i18n.js           (Helper functions for translations)
```

---

## Summary Statistics

| Metric | Count |
|--------|-------|
| **Lesson files** | 17 |
| **Translatable lesson strings** | ~550 |
| **UI component files** | 8+ |
| **Hardcoded UI strings** | ~100+ |
| **Snippet categories** | 6 |
| **Snippet items** | ~30 |
| **Total translatable content** | ~700+ strings |
| **Current i18n support** | None |
| **Lesson content format** | JSON (structured) |
| **Code examples (should NOT translate)** | ~50+ |

---

## Next Steps for i18n Implementation

1. **Choose i18n library** (i18next recommended)
2. **Extract all UI strings** to translation files
3. **Refactor lesson loading** to support translations
4. **Add language switcher** to settings
5. **Create translation management system** for future languages
6. **Test with multiple languages** (complete translations for at least English + 1 more)
7. **Implement fallback system** for missing translations

