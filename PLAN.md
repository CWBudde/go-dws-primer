# DWScript Primer - Comprehensive Development Plan

## Project Overview

**Goal**: Create an educational programming environment based on go-dws that extends the existing playground with comprehensive learning features inspired by PascalPrimer.

**Core Vision**: An interactive, browser-based learning platform for DWScript/Object Pascal that provides:
- Progressive learning paths with structured lessons
- Immediate visual feedback through Turtle Graphics
- Comprehensive examples and exercises
- Real-time code execution and feedback
- Modern web-based interface with no installation required

---

## Phase 1: Foundation & Core Architecture ✅

**Completed**: Project setup with Vite build system, justfile automation, Monaco Editor integration, WASM runtime with FFI wrapper (`dwscript-api.js`), modular architecture, state management, event system, themes, localStorage persistence, and URL sharing.

**Deliverable**: Functional playground with go-dws execution capabilities ✅

---

## Phase 2: Enhanced Output & Feedback Systems ✅

**Completed**: Enhanced FFI wrapper with program caching, timeout mechanism, and error normalization. Multi-panel output system with resizable panels and tabbed interface. Complete Turtle Graphics engine (`turtle-engine.js`) with Canvas rendering, animation support, FFI bindings via external declarations, and export functionality (PNG/SVG). Interactive execution with Web Worker support for non-blocking execution, stop/timeout mechanisms, and performance metrics.

**Deliverable**: Rich output environment with visual programming support ✅

---

## Phase 3: Educational Content System

### 3.1 Lesson Structure
- [x] Design lesson data format (JSON/YAML)
- [x] Create lesson navigation UI (sidebar, breadcrumbs)
- [x] Implement lesson categories and tags
- [x] Build progress tracking system
- [x] Create lesson completion criteria
- [x] Add "Next Lesson" / "Previous Lesson" navigation
- [x] Implement lesson search and filtering

### 3.2 Content Organization
- [x] **Fundamentals** (Complete - 4/4 lessons) ✅
  - [x] Hello World and basic output
  - [x] Variables and data types
  - [x] Operators and expressions
  - [x] Input and basic I/O

- [x] **Control Flow** (Complete - 6/6 lessons) ✅
  - [x] If statements and conditions
  - [x] Case statements
  - [x] While loops
  - [x] For loops
  - [x] Repeat-until loops
  - [x] Break and Continue

- [x] **Functions & Procedures** (Complete - 6/6 lessons) ✅
  - [x] Procedure basics
  - [x] Function basics
  - [x] Parameters (value, var, const, out)
  - [x] Local vs global scope
  - [x] Recursion
  - [x] Function overloading

- [x] **Data Structures** (Complete - 5/5 lessons) ✅
  - [x] Arrays (static and dynamic)
  - [x] Records
  - [x] Sets
  - [x] Strings and string manipulation
  - [x] Enumerations

- [ ] **Object-Oriented Programming**
  - [ ] Classes and objects
  - [ ] Constructors and destructors
  - [ ] Properties and methods
  - [ ] Inheritance
  - [ ] Interfaces
  - [ ] Polymorphism
  - [ ] Abstract classes
  - [ ] Operator overloading

- [x] **Turtle Graphics** (Partial - 1/6 lessons)
  - [x] Basic movement
  - [ ] Drawing shapes
  - [ ] Loops and patterns
  - [ ] Functions with graphics
  - [ ] Recursive graphics (fractals)
  - [ ] Animation techniques

- [ ] **Advanced Topics**
  - [ ] Exception handling
  - [ ] Design by Contract (preconditions, postconditions)
  - [ ] Generic types
  - [ ] Anonymous methods
  - [ ] Regular expressions
  - [ ] File I/O (if supported in WASM)

### 3.3 Interactive Elements
- [x] Inline code editors in lessons ✅
- [x] "Try it yourself" challenges ✅
- [x] Expected output comparison ✅
- [x] Hints and tips system (progressive disclosure) ✅
- [x] Solution reveal mechanism ✅
- [x] Code snippets library (40+ snippets across 7 categories) ✅
- [ ] Interactive quizzes (multiple choice, code completion) 🚧

**Deliverable**: Comprehensive structured learning content

---

## Phase 4: User Experience Enhancements

### 4.1 Editor Improvements
- [x] Add keyboard shortcuts (run, format, etc.)
- [x] Implement code formatting/prettifier
- [x] Add code snippets and templates
- [x] Create autocomplete for DWScript keywords
- [x] Implement IntelliSense for functions/classes
- [x] Add bracket matching and auto-closing
- [x] Create minimap view for longer code
- [x] Implement multi-cursor editing

### 4.2 Visual Design
- [x] Design modern, clean UI theme
- [x] Implement light/dark theme toggle
- [x] Create custom syntax highlighting themes
- [x] Add smooth transitions and animations
- [x] Design mobile-responsive layout
- [x] Create loading states and progress indicators
- [x] Add tooltips and contextual help
- [x] Design icons and graphics

### 4.3 Accessibility
- [x] Ensure keyboard navigation throughout
- [x] Add ARIA labels and semantic HTML
- [x] Support screen readers
- [x] Implement high-contrast mode
- [x] Add font size controls
- [x] Ensure color-blind friendly palette
- [x] Create keyboard shortcut reference

**Deliverable**: Polished, accessible user interface

---

## Phase 5: Learning Features

### 5.1 Progress Tracking
- [ ] Implement user profile system (localStorage)
- [ ] Track completed lessons
- [ ] Store user code solutions
- [ ] Create achievement system
- [ ] Add statistics dashboard (time spent, lessons completed)
- [ ] Implement streak tracking
- [ ] Create progress export/import

### 5.2 Code Challenges
- [ ] Design challenge format with test cases
- [ ] Implement automated test runner
- [ ] Create visual feedback for passing/failing tests
- [ ] Add difficulty ratings
- [ ] Implement hints system (progressive disclosure)
- [ ] Create challenge categories
- [ ] Add timed challenges (optional)
- [ ] Implement leaderboard (local only)

### 5.3 Example Gallery
- [ ] Create curated example collection
- [ ] Organize by category and difficulty
- [ ] Add search and filter functionality
- [ ] Include visual preview for turtle graphics
- [ ] Implement "Fork" functionality
- [ ] Add "Featured" examples section
- [ ] Create community submission guidelines

**Deliverable**: Engaging learning experience with gamification

---

## Phase 6: Advanced Features

### 6.1 Code Sharing & Collaboration
- [ ] Implement URL-based code sharing (base64 encoding)
- [ ] Create shareable links with metadata
- [ ] Add QR code generation for sharing
- [ ] Implement code embedding (iframe)
- [ ] Create public gallery of shared code
- [ ] Add "Remix" functionality
- [ ] Implement comment system (if backend available)

### 6.2 Performance & Optimization
- [ ] Optimize WASM loading and caching
- [ ] Implement lazy loading for lessons
- [ ] Add service worker for offline capability
- [ ] Optimize asset loading (images, fonts)
- [ ] Implement code splitting for JS bundles
- [ ] Add performance monitoring
- [ ] Optimize rendering for large outputs

### 6.3 Extended Graphics
- [ ] Add multiple turtle support
- [ ] Implement color gradients
- [ ] Create sprite/image loading
- [ ] Add text rendering on canvas
- [ ] Implement layers system
- [ ] Create animation recording/playback
- [ ] Add export to animated GIF
- [ ] Implement 3D graphics (optional, future)

### 6.4 Debugging Tools
- [ ] Implement breakpoint support
- [ ] Create variable inspector
- [ ] Add watch expressions
- [ ] Implement call stack viewer
- [ ] Create step-through debugger UI
- [ ] Add expression evaluator
- [ ] Implement profiler for performance analysis

**Deliverable**: Feature-complete educational platform

---

## Phase 7: Content Development

### 7.1 Lesson Writing
- [ ] Write beginner-friendly introductions
- [ ] Create progressive difficulty curve
- [ ] Add visual diagrams and illustrations
- [ ] Write clear explanations and examples
- [ ] Create practice exercises for each lesson
- [ ] Add challenge problems
- [ ] Write solution explanations

### 7.2 Example Creation
- [ ] Port interesting examples from PascalPrimer
- [ ] Create turtle graphics showcase
- [ ] Develop game examples (simple games in DWScript)
- [ ] Create utility examples (calculators, converters)
- [ ] Add algorithm visualizations
- [ ] Create art/generative graphics examples
- [ ] Develop real-world scenario examples

### 7.3 Documentation
- [ ] Write user guide
- [ ] Create teacher/educator guide
- [ ] Document DWScript language reference
- [ ] Write API documentation for turtle graphics
- [ ] Create contribution guidelines
- [ ] Write troubleshooting guide
- [ ] Add FAQ section

**Deliverable**: Rich educational content library

---

## Phase 8: Testing & Quality Assurance

### 8.1 Testing Infrastructure
- [ ] Set up unit testing framework
- [ ] Create integration tests
- [ ] Implement E2E testing (Playwright/Cypress)
- [ ] Add visual regression testing
- [ ] Create test coverage reporting
- [ ] Implement automated testing in CI/CD

### 8.2 Quality Checks
- [ ] Test all lessons for accuracy
- [ ] Verify all examples execute correctly
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile device testing
- [ ] Performance benchmarking
- [ ] Accessibility audit
- [ ] Security review

### 8.3 User Testing
- [ ] Conduct user testing with beginners
- [ ] Gather feedback from educators
- [ ] Conduct usability testing
- [ ] Test with different age groups
- [ ] Gather analytics on usage patterns
- [ ] Iterate based on feedback

**Deliverable**: Stable, tested application

---

## Phase 9: Deployment & Distribution

### 9.1 Production Setup
- [x] Configure production build process ✅
- [x] Fix Vite base path configuration for GitHub Pages ✅
- [ ] Optimize assets for production
- [ ] Set up CDN for static assets
- [ ] Configure caching strategies
- [ ] Set up monitoring and analytics
- [ ] Create error logging/reporting
- [ ] Implement A/B testing framework (optional)

### 9.2 Deployment
- [x] Deploy to GitHub Pages ✅
- [x] Configure GitHub Actions CI/CD pipeline ✅
- [x] Fix deployment path issues (base path configuration) ✅
- [ ] Set up custom domain (if applicable)
- [x] Configure SSL/HTTPS (via GitHub Pages) ✅
- [ ] Set up backup/restore procedures
- [ ] Create deployment documentation
- [ ] Implement blue-green deployment strategy

### 9.3 Deployment Fixes (Nov 2024)
**Issues Resolved:**
- Fixed Vite configuration where index.html was incorrectly placed in public/ directory
- Added base path configuration for GitHub Pages subdirectory deployment
- Updated GitHub Actions workflow to set VITE_BASE_PATH environment variable
- Resolved issue where unprocessed index.html was being served (missing CSS/JS)
- Moved index.html to project root for proper Vite processing

**Configuration:**
- Base path: `/go-dws-primer/` (for GitHub Pages)
- Build output: `dist/` directory
- Assets correctly referenced with base path prefix

**Next Priority Improvements:**
1. **Content Loading**: Ensure lessons and examples load correctly from content/ directory
2. **WASM Module**: Add dwscript.wasm file to enable full DWScript execution (currently in mock mode)
3. **Asset Optimization**: Implement code splitting to reduce initial bundle size (Monaco editor is 3MB)
4. **Default Content**: Add a compelling default example in the editor on first load
5. **Mobile Responsiveness**: Test and improve mobile/tablet layouts
6. **Loading Performance**: Add skeleton screens and progressive loading
7. **Error Boundaries**: Implement proper error handling for missing content/assets
8. **Favicon & Branding**: Add favicon, social media preview images
9. **Analytics**: Add privacy-respecting analytics to track usage patterns
10. **Progressive Web App**: Add manifest.json and service worker for offline capability

### 9.4 Marketing & Outreach
- [ ] Create project website/landing page
- [ ] Write blog post announcements
- [ ] Share on social media
- [ ] Reach out to Pascal/Delphi communities
- [ ] Contact educational institutions
- [ ] Create demo videos/tutorials
- [ ] Submit to programming resource directories

**Deliverable**: Publicly accessible educational platform

---

## Phase 10: Maintenance & Growth

### 10.1 Community Building
- [ ] Set up discussion forum/Discord
- [ ] Create contribution guidelines
- [ ] Establish code of conduct
- [ ] Set up issue templates
- [ ] Create PR review process
- [ ] Recognize contributors
- [ ] Host online events/challenges

### 10.2 Ongoing Development
- [ ] Regular bug fixes and updates
- [ ] Keep up with go-dws updates
- [ ] Add community-requested features
- [ ] Update lessons based on feedback
- [ ] Refresh examples periodically
- [ ] Monitor and improve performance
- [ ] Security updates

### 10.3 Future Enhancements
- [ ] Backend integration for user accounts
- [ ] Multi-player coding challenges
- [ ] Real-time collaboration features
- [ ] Mobile app (React Native/Flutter)
- [ ] Integration with learning management systems (LMS)
- [ ] Certificate generation for course completion
- [ ] Advanced AI-powered hints and feedback
- [ ] Live coding sessions/webinars

**Deliverable**: Thriving educational community

---

## Technical Stack

### Frontend
- **HTML5/CSS3**: Modern semantic markup and styling
- **JavaScript/TypeScript**: Core application logic
- **Monaco Editor**: VS Code-style code editor
- **Canvas API**: Turtle graphics rendering
- **Web Workers**: Background compilation
- **Service Workers**: Offline support and caching

### Build & Development
- **Go**: For WASM compilation (go-dws)
- **WebAssembly**: Runtime execution engine
- **Vite/Webpack**: Module bundling and development server
- **PostCSS/Sass**: CSS preprocessing
- **ESLint/Prettier**: Code quality and formatting

### Testing
- **Jest**: Unit testing
- **Playwright/Cypress**: E2E testing
- **Testing Library**: Component testing

### Deployment
- **GitHub Actions**: CI/CD pipeline
- **GitHub Pages**: Static site hosting
- **Cloudflare Pages**: Alternative hosting with CDN

---

## FFI Architecture & Integration with go-dws

### Overview

The Foreign Function Interface (FFI) layer bridges JavaScript frontend code with the Go-compiled WebAssembly DWScript runtime. Understanding this integration is critical for implementing all execution, output, and debugging features.

### 1. go-dws WASM API

#### Global Export: `window.DWScript`

After WASM initialization, go-dws exposes a single constructor:

```javascript
const dws = new window.DWScript();
```

Each instance provides an isolated compilation context with independent scope and program cache.

#### API Methods

| Method | Description | Returns | Async |
|--------|-------------|---------|-------|
| `init(options)` | Initialize with callbacks | `Promise<void>` | Yes |
| `compile(source)` | Compile source code | `Program` object | No |
| `run(program)` | Execute compiled program | `Result` object | No |
| `eval(source)` | Compile and execute | `Result` object | No |
| `on(event, callback)` | Register event listeners | `void` | No |
| `version()` | Get version info | `VersionInfo` | No |
| `dispose()` | Release resources | `void` | No |

### 2. Interface Contracts

#### Initialization Options

```javascript
await dws.init({
  onOutput: (text: string) => void,      // Real-time output callback
  onError: (error: DWScriptError) => void, // Error callback
  onInput: () => string,                  // Input request callback (optional)
  fs?: FileSystemObject                   // Custom filesystem (not implemented)
});
```

#### Result Object Structure

```javascript
{
  success: boolean,           // Execution success flag
  output: string,            // Captured program output
  executionTime: number,     // Execution time in milliseconds
  error?: {                  // Present if success = false
    type: string,            // "CompileError" | "RuntimeError" | "ProgramError"
    message: string,         // Human-readable error message
    line?: number,           // Line number where error occurred
    column?: number,         // Column number
    source?: string,         // Source code context
    details?: Object         // Additional error context
  },
  warnings?: string[]        // Optional compilation warnings
}
```

#### Program Object

```javascript
{
  id: number,               // Unique program identifier
  success: boolean          // Compilation success status
}
```

### 3. Data Type Mapping

| Go Type | JavaScript Type | Conversion |
|---------|----------------|------------|
| `string` | `string` | Direct via `js.ValueOf()` |
| `int`, `int64`, `float64` | `number` | Direct via `js.ValueOf()` |
| `bool` | `boolean` | Direct via `js.ValueOf()` |
| `nil` | `null` | `js.Null()` |
| `error` | `Error` object | `WrapError()` utility |
| `struct` | Plain object | Manual property mapping |
| Go callback | Function | `.Invoke()` method |

### 4. Communication Patterns

#### Real-Time Streaming Output

go-dws calls the `onOutput` callback **immediately** during execution:

```javascript
await dws.init({
  onOutput: (text) => {
    // Called in real-time as PrintLn, Print execute
    outputElement.textContent += text;
    outputElement.scrollTop = outputElement.scrollHeight;
  }
});

// This will call onOutput 100 times as loop executes
dws.eval(`
  for var i := 1 to 100 do
    PrintLn('Line ' + IntToStr(i));
`);
```

**Key Points**:
- Output is streamed, not buffered
- Callbacks execute synchronously during program execution
- Enables progress display for long-running code
- Critical for interactive user experience

#### Error Handling Strategies

**Three-tier error handling**:

1. **Exceptions** (initialization, invalid arguments)
```javascript
try {
  const dws = new DWScript();
  await dws.init(options);
} catch (error) {
  // Handle initialization failure
}
```

2. **Result Objects** (compilation/execution failures)
```javascript
const result = dws.eval(code);
if (!result.success) {
  // result.error contains structured error info
  highlightLine(result.error.line);
  showMessage(result.error.message);
}
```

3. **Error Callbacks** (runtime exceptions)
```javascript
await dws.init({
  onError: (error) => {
    if (error.type === 'RuntimeError') {
      displayStackTrace(error);
    }
  }
});
```

#### Separate Compilation and Execution

Optimize repeated execution:

```javascript
// Compile once
const program = dws.compile(sourceCode);

if (program.success) {
  // Execute multiple times with different inputs
  for (let i = 0; i < 10; i++) {
    const result = dws.run(program);
    console.log(result.output);
  }
}
```

### 5. Initialization Sequence

**Critical timing considerations**:

```javascript
// 1. Load Go WASM runtime (before WASM module)
<script src="/wasm/wasm_exec.js"></script>

// 2. Initialize Go runtime
const go = new Go();

// 3. Fetch and instantiate WASM module
const response = await fetch('/wasm/dwscript.wasm');
const buffer = await response.arrayBuffer();
const result = await WebAssembly.instantiate(buffer, go.importObject);

// 4. Run Go program (BLOCKS until exports are registered)
go.run(result.instance);

// 5. IMPORTANT: Wait for API registration (~100ms)
//    The go.run() call above is async but doesn't wait for full init
await new Promise(resolve => setTimeout(resolve, 100));

// 6. Verify global export exists
if (!window.DWScript) {
  throw new Error('DWScript API not available after initialization');
}

// 7. Create instance and initialize
const dws = new DWScript();
await dws.init({
  onOutput: handleOutput,
  onError: handleError
});

// 8. Ready to execute code
const result = dws.eval(code);
```

### 6. FFI Integration Architecture

#### Proposed Layer Structure

```
┌─────────────────────────────────────┐
│   UI Layer (Monaco, Output Panels)  │
└───────────────┬─────────────────────┘
                │
┌───────────────▼─────────────────────┐
│   Executor (executor.js)            │
│   - Manages execution lifecycle     │
│   - Handles UI updates              │
│   - Coordinates output display      │
└───────────────┬─────────────────────┘
                │
┌───────────────▼─────────────────────┐
│   DWScript API Wrapper              │
│   (dwscript-api.js - NEW)           │
│   - Wraps window.DWScript           │
│   - Normalizes result format        │
│   - Provides error mapping          │
│   - Manages instance lifecycle      │
└───────────────┬─────────────────────┘
                │
┌───────────────▼─────────────────────┐
│   WASM Loader (wasm-loader.js)      │
│   - Loads wasm_exec.js              │
│   - Initializes WebAssembly         │
│   - Handles timing and readiness    │
└───────────────┬─────────────────────┘
                │
┌───────────────▼─────────────────────┐
│   go-dws WASM Module                │
│   (dwscript.wasm)                   │
│   - Exports window.DWScript         │
│   - Implements DWScript runtime     │
│   - Compiles and executes code      │
└─────────────────────────────────────┘
```

#### New File: `src/core/dwscript-api.js`

Abstraction layer over raw WASM API:

```javascript
/**
 * DWScript WASM API Wrapper
 * Provides normalized interface to go-dws WebAssembly module
 */
export class DWScriptAPI {
  constructor() {
    this.instance = null;
    this.initialized = false;
    this.programs = new Map(); // Cache compiled programs
  }

  async init(handlers = {}) {
    if (!window.DWScript) {
      throw new Error('DWScript WASM module not loaded');
    }

    this.instance = new window.DWScript();

    await this.instance.init({
      onOutput: handlers.onOutput || console.log,
      onError: handlers.onError || console.error,
      onInput: handlers.onInput || (() => prompt('Input:'))
    });

    this.initialized = true;
    const version = this.instance.version();
    console.log(`DWScript ${version.version} initialized`);

    return version;
  }

  /**
   * Compile source code
   * @param {string} source - DWScript source code
   * @param {string} cacheKey - Optional cache key for program
   * @returns {Object} Normalized result
   */
  compile(source, cacheKey = null) {
    this.assertInitialized();

    try {
      const program = this.instance.compile(source);

      if (program.success && cacheKey) {
        this.programs.set(cacheKey, program);
      }

      return {
        success: program.success,
        programId: program.id
      };
    } catch (error) {
      return this.normalizeError(error);
    }
  }

  /**
   * Execute source code (compile + run)
   * @param {string} source - DWScript source code
   * @returns {Object} Normalized result
   */
  eval(source) {
    this.assertInitialized();

    try {
      const result = this.instance.eval(source);
      return this.normalizeResult(result);
    } catch (error) {
      return this.normalizeError(error);
    }
  }

  /**
   * Run a previously compiled program
   * @param {number|string} programRef - Program ID or cache key
   * @returns {Object} Normalized result
   */
  run(programRef) {
    this.assertInitialized();

    try {
      const program = typeof programRef === 'string'
        ? this.programs.get(programRef)
        : { id: programRef };

      if (!program) {
        throw new Error(`Program not found: ${programRef}`);
      }

      const result = this.instance.run(program);
      return this.normalizeResult(result);
    } catch (error) {
      return this.normalizeError(error);
    }
  }

  /**
   * Normalize result format for consistency
   */
  normalizeResult(result) {
    return {
      success: result.success,
      output: result.output || '',
      errors: result.error ? [this.normalizeErrorObject(result.error)] : [],
      warnings: result.warnings || [],
      executionTime: result.executionTime || 0
    };
  }

  /**
   * Normalize error format
   */
  normalizeError(error) {
    return {
      success: false,
      output: '',
      errors: [this.normalizeErrorObject(error)],
      warnings: [],
      executionTime: 0
    };
  }

  /**
   * Normalize error object structure
   */
  normalizeErrorObject(error) {
    return {
      type: error.type || 'UnknownError',
      message: error.message || String(error),
      line: error.line || 0,
      column: error.column || 0,
      source: error.source || null
    };
  }

  assertInitialized() {
    if (!this.initialized) {
      throw new Error('DWScript API not initialized. Call init() first.');
    }
  }

  dispose() {
    if (this.instance) {
      this.instance.dispose();
      this.instance = null;
      this.initialized = false;
      this.programs.clear();
    }
  }
}

// Singleton instance for application-wide use
export const dwsAPI = new DWScriptAPI();
```

### 7. Turtle Graphics FFI Extension

#### Challenge: go-dws has NO native turtle graphics

**Solution**: Implement turtle graphics entirely in JavaScript, callable from DWScript via FFI.

#### Architecture

```javascript
// DWScript code
var turtle: TTurtle;
turtle := TTurtle.Create;
turtle.Forward(100);
turtle.TurnLeft(90);
turtle.PenColor := clRed;
```

Must map to:

```javascript
// JavaScript implementation
class TurtleGraphics {
  forward(distance) { /* Canvas operations */ }
  turnLeft(degrees) { /* ... */ }
  setPenColor(color) { /* ... */ }
}
```

#### FFI Registration Pattern

Register JavaScript functions as DWScript native functions:

```javascript
// After WASM init, before code execution
dws.registerNativeClass('TTurtle', {
  methods: {
    'Create': () => new TurtleGraphics(),
    'Forward': (instance, distance) => instance.forward(distance),
    'TurnLeft': (instance, degrees) => instance.turnLeft(degrees),
    // ... more methods
  },
  properties: {
    'PenColor': {
      get: (instance) => instance.penColor,
      set: (instance, value) => instance.setPenColor(value)
    }
  }
});
```

**Note**: The exact API for `registerNativeClass` needs to be verified/implemented in go-dws. This may require:
- Extending go-dws with FFI registration support
- OR using a different integration approach (e.g., injecting helper functions)
- OR implementing turtle graphics in Go and exposing via WASM

#### Alternative: Script-Level Integration

If native class registration is not available, use helper functions:

```javascript
// JavaScript side
window.TurtleCommands = {
  forward: (distance) => turtle.forward(distance),
  turnLeft: (degrees) => turtle.turnLeft(degrees),
  // ...
};
```

```pascal
// DWScript side (injected into every program)
procedure TurtleForward(distance: Float); external 'TurtleCommands.forward';
procedure TurtleTurnLeft(degrees: Float); external 'TurtleCommands.turnLeft';

// User code
TurtleForward(100);
TurtleTurnLeft(90);
```

### 8. Known Limitations and Workarounds

#### No Execution Cancellation

**Problem**: go-dws WASM API does not expose execution cancellation.

**Workarounds**:
1. **Web Workers**: Run execution in web worker, terminate worker to stop
2. **Timeouts**: Implement timeout in Go WASM layer
3. **Cooperative**: Inject checkpoint functions in long-running code

#### Blocking Execution

**Problem**: Execution blocks main thread, freezing UI.

**Solution**: Use Web Workers:

```javascript
// worker.js
importScripts('/wasm/wasm_exec.js');

let dws = null;

self.onmessage = async (e) => {
  if (e.data.type === 'init') {
    // Initialize WASM in worker
    const go = new Go();
    const result = await WebAssembly.instantiate(e.data.wasmBuffer, go.importObject);
    go.run(result.instance);
    dws = new DWScript();
    await dws.init({
      onOutput: (text) => self.postMessage({ type: 'output', text })
    });
    self.postMessage({ type: 'ready' });
  } else if (e.data.type === 'eval') {
    const result = dws.eval(e.data.code);
    self.postMessage({ type: 'result', result });
  }
};
```

### 9. Build and Deployment Requirements

#### Building go-dws WASM

```bash
# Clone go-dws
git clone https://github.com/cwbudde/go-dws.git
cd go-dws

# Build WASM module (requires Go 1.21+, just)
just wasm

# Optimize (requires wasm-opt from binaryen)
just wasm-opt

# Output files
# - build/wasm/dist/dwscript.wasm (2.5-3 MB, 1-1.5 MB gzipped)
# - build/wasm/wasm_exec.js (Go WASM runtime)
```

#### Integration into go-dws-primer

```bash
# Copy built files
cp go-dws/build/wasm/dist/dwscript.wasm go-dws-primer/wasm/
cp go-dws/build/wasm/wasm_exec.js go-dws-primer/wasm/

# Serve with proper MIME types
# Vite handles this automatically
npm run dev
```

#### Serving Requirements

- **HTTP/HTTPS required**: WASM won't load from `file://` protocol
- **MIME type**: `application/wasm` for `.wasm` files
- **Compression**: Enable gzip/brotli for 50-60% size reduction
- **Caching**: Set long cache times (1 year) with versioned filenames
- **CORS**: Must be same-origin or properly configured

### 10. Integration Checklist

Phase 1 (Foundation):
- [x] Load `wasm_exec.js` in `public/index.html`
- [x] Implement basic WASM loading in `wasm-loader.js`
- [x] Create mock execution fallback
- [x] Add 100ms delay after `go.run()` for API registration
- [x] Verify `window.DWScript` availability before use

Phase 2 (FFI Integration):
- [x] Create `src/core/dwscript-api.js` wrapper class
- [x] Implement streaming output capture
- [x] Add structured error handling
- [x] Integrate with `executor.js`
- [x] Add execution timing display
- [x] Implement program caching for repeated execution

Phase 3 (Turtle Graphics):
- [x] Research go-dws native function registration
- [x] Implement `src/turtle/turtle-engine.js`
- [x] Create FFI bindings for turtle commands
- [x] Test integration with sample turtle programs

Phase 4 (Advanced):
- [x] Implement Web Worker execution for non-blocking
- [x] Add execution timeout mechanism
- [x] Implement worker-based cancellation
- [ ] Add memory usage monitoring (if exposed by WASM) (deferred - needs WASM support)

### 11. Testing Strategy

#### Unit Tests
```javascript
describe('DWScriptAPI', () => {
  it('should initialize successfully', async () => {
    const api = new DWScriptAPI();
    await api.init();
    expect(api.initialized).toBe(true);
  });

  it('should execute simple code', () => {
    const result = api.eval('PrintLn("Hello");');
    expect(result.success).toBe(true);
    expect(result.output).toContain('Hello');
  });

  it('should handle compilation errors', () => {
    const result = api.eval('invalid syntax');
    expect(result.success).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});
```

#### Integration Tests
- Verify WASM loads correctly
- Test streaming output callback timing
- Verify error line numbers match source
- Test program caching and reuse
- Verify cleanup/dispose releases resources

---

## File Structure

```
go-dws-primer/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── assets/
│       ├── images/
│       └── icons/
├── src/
│   ├── core/
│   │   ├── wasm-loader.js      # WebAssembly initialization
│   │   ├── dwscript-api.js     # DWScript WASM API wrapper (FFI layer)
│   │   ├── executor.js         # Code execution management
│   │   ├── state-manager.js    # Application state
│   │   └── event-bus.js        # Event system
│   ├── editor/
│   │   ├── monaco-setup.js      # Monaco Editor configuration
│   │   ├── dwscript-lang.js     # Language definition
│   │   ├── themes.js            # Editor themes
│   │   └── keybindings.js       # Keyboard shortcuts
│   ├── output/
│   │   ├── console.js           # Console output panel
│   │   ├── compiler-messages.js # Compiler output
│   │   ├── graphics-canvas.js   # Turtle graphics
│   │   └── output-manager.js    # Output coordination
│   ├── turtle/
│   │   ├── turtle-engine.js     # Core turtle logic
│   │   ├── turtle-api.js        # DWScript API bindings
│   │   ├── canvas-renderer.js   # Canvas rendering
│   │   └── animation.js         # Animation system
│   ├── lessons/
│   │   ├── lesson-loader.js     # Lesson data loading
│   │   ├── lesson-ui.js         # Lesson display
│   │   ├── navigation.js        # Lesson navigation
│   │   └── progress.js          # Progress tracking
│   ├── challenges/
│   │   ├── challenge-runner.js  # Test runner
│   │   ├── challenge-ui.js      # Challenge display
│   │   └── validation.js        # Answer validation
│   ├── ui/
│   │   ├── layout.js            # Panel layout
│   │   ├── toolbar.js           # Toolbar component
│   │   ├── settings.js          # Settings panel
│   │   └── modal.js             # Modal dialogs
│   ├── utils/
│   │   ├── storage.js           # localStorage helper
│   │   ├── url-sharing.js       # URL encoding/decoding
│   │   ├── themes.js            # Theme management
│   │   └── helpers.js           # Utility functions
│   ├── workers/
│   │   └── dwscript-worker.js   # Web Worker for non-blocking execution
│   └── main.js                  # Application entry point
├── content/
│   ├── lessons/
│   │   ├── 01-fundamentals/
│   │   ├── 02-control-flow/
│   │   ├── 03-functions/
│   │   ├── 04-data-structures/
│   │   ├── 05-oop/
│   │   ├── 06-turtle-graphics/
│   │   └── 07-advanced/
│   ├── examples/
│   │   ├── beginner/
│   │   ├── intermediate/
│   │   ├── advanced/
│   │   └── turtle-graphics/
│   └── challenges/
│       ├── easy/
│       ├── medium/
│       └── hard/
├── wasm/
│   ├── dwscript.wasm            # Compiled WebAssembly
│   └── wasm_exec.js             # Go WASM runtime
├── styles/
│   ├── main.css
│   ├── editor.css
│   ├── output.css
│   ├── lessons.css
│   └── themes/
│       ├── light.css
│       └── dark.css
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/
│   ├── USER_GUIDE.md
│   ├── TEACHER_GUIDE.md
│   ├── API_REFERENCE.md
│   ├── CONTRIBUTING.md
│   └── ARCHITECTURE.md
├── scripts/
│   ├── build-wasm.sh
│   ├── generate-lesson-index.js
│   └── deploy.sh
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── package.json
├── vite.config.js
├── tsconfig.json
├── justfile
├── README.md
└── PLAN.md
```

---

## Success Metrics

### User Engagement
- Time spent on platform per session
- Lesson completion rates
- Return user percentage
- Code execution frequency

### Educational Effectiveness
- Progression through lessons
- Challenge completion rates
- Error reduction over time
- Concept mastery indicators

### Technical Performance
- Page load time < 3 seconds
- Code execution latency < 100ms
- 99.9% uptime
- Cross-browser compatibility score > 95%

### Community Growth
- Number of active users
- Code sharing frequency
- Community contributions
- Social media engagement

---

## Timeline Estimates

- **Phase 1-2**: 4-6 weeks (Foundation + Output Systems)
- **Phase 3**: 3-4 weeks (Educational Content System)
- **Phase 4**: 2-3 weeks (UX Enhancements)
- **Phase 5**: 3-4 weeks (Learning Features)
- **Phase 6**: 4-6 weeks (Advanced Features)
- **Phase 7**: 6-8 weeks (Content Development)
- **Phase 8**: 2-3 weeks (Testing & QA)
- **Phase 9**: 1-2 weeks (Deployment)
- **Phase 10**: Ongoing

**Total Initial Development**: Approximately 6-9 months for MVP (Phases 1-5)
**Full Feature Set**: 12-18 months including content

---

## Risk Mitigation

### Technical Risks
- **WASM compatibility issues**: Test across browsers early, maintain fallbacks
- **Performance bottlenecks**: Profile regularly, optimize critical paths
- **Monaco Editor integration**: Use official APIs, keep up with updates

### Content Risks
- **Lesson quality**: Peer review process, user testing
- **Content gaps**: Regular content audits, community feedback
- **Accuracy issues**: Technical review by DWScript experts

### User Adoption Risks
- **Complexity**: Focus on progressive disclosure, excellent onboarding
- **Competition**: Emphasize unique features (turtle graphics, DWScript)
- **Accessibility**: Design with accessibility from day one

---

## Conclusion

This plan provides a roadmap for creating a comprehensive educational programming environment that combines the technical foundation of go-dws with the pedagogical approach of PascalPrimer. The result will be a modern, browser-based platform that makes learning DWScript/Object Pascal engaging, interactive, and accessible to learners worldwide.

The modular approach allows for iterative development, with each phase building upon the previous one. Early phases focus on establishing core functionality, while later phases add polish, content, and advanced features. This ensures that a useful product can be delivered incrementally while working toward the full vision.
