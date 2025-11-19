# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

**go-dws-primer** is an interactive, browser-based educational programming environment for learning DWScript/Object Pascal. It runs entirely in the browser using WebAssembly compiled from [go-dws](https://github.com/cwbudde/go-dws).

**Current Phase**: Educational Content System (Phase 3) - Complete lesson system with interactive content, progress tracking, and structured learning paths.

## Development Commands

### Running the Application

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Testing and Quality

```bash
# Run unit tests
npm run test

# Run end-to-end tests
npm run test:e2e

# Lint code
npm run lint

# Format code
npm run format
```

### Building the WASM Module

The WASM module must be built separately from the go-dws repository:

```bash
# In go-dws repository
just wasm        # Build WASM module
just wasm-opt    # Optimize WASM (requires wasm-opt from binaryen)

# Copy files to go-dws-primer
cp build/wasm/dist/dwscript.wasm ../go-dws-primer/wasm/
cp build/wasm/wasm_exec.js ../go-dws-primer/wasm/
```

**Note**: Without the WASM module, the application runs in "mock mode" for development.

## Architecture

### Core Architecture Pattern

The application follows a modular event-driven architecture with clear separation of concerns:

```
Monaco Editor ←→ Executor ←→ WASM Loader ←→ go-dws (WebAssembly)
     ↓                ↓
  State Manager   Output Manager ←→ Turtle Graphics Engine
```

### Key Components

**Core Layer** (`src/core/`):
- **wasm-loader.js**: Initializes Go WebAssembly runtime, loads dwscript.wasm module
- **executor.js**: Manages code execution lifecycle, coordinates between WASM and UI
- **state-manager.js**: Handles application state and localStorage persistence

**Editor Layer** (`src/editor/`):
- **monaco-setup.js**: Configures Monaco Editor with DWScript language support
- **dwscript-lang.js**: Language definition (syntax highlighting, keywords, operators)

**Output Layer** (`src/output/`):
- **output-manager.js**: Coordinates console, compiler, and graphics output panels
- Tab-based interface with separate views for different output types

**Turtle Graphics** (`src/turtle/`):
- **turtle-engine.js**: Core turtle state management and Canvas-based rendering
- **turtle-api.js**: Exposes turtle commands to DWScript via FFI (Foreign Function Interface)
- **animation.js**: Handles step-by-step execution and speed control
- **canvas-renderer.js**: Canvas rendering utilities

**Lesson System** (`src/lessons/`):
- **lesson-loader.js**: Loads JSON-based lesson content with caching
- **lesson-ui.js**: Renders lesson content with Markdown support
- **navigation.js**: Category-based navigation and URL routing
- **progress.js**: Tracks completion state in localStorage

### Critical Implementation Details

#### WASM Initialization Sequence

The WASM loading has critical timing requirements (see PLAN.md FFI Architecture section):

1. Load `wasm_exec.js` (Go WASM runtime) before WASM module
2. Create Go instance and fetch WASM module
3. Call `go.run(instance)` - this is async but doesn't wait for full initialization
4. **CRITICAL**: Add ~100ms delay after `go.run()` for API registration
5. Verify `window.DWScript` is available before use

**Current Implementation**: `src/core/wasm-loader.js` handles steps 1-3, but may need the 100ms delay added.

#### Turtle Graphics FFI Integration

Turtle graphics are implemented **entirely in JavaScript** (not in go-dws). DWScript code calls turtle commands via FFI:

- JavaScript `TurtleEngine` class handles all drawing on Canvas
- `turtle-api.js` installs global functions (`window.TurtleForward`, etc.)
- DWScript programs can call these via `external` declarations or injected helper code

**Open Question**: The exact FFI registration mechanism for exposing turtle API to DWScript needs verification. See PLAN.md Phase 2.2 for options (external declarations, registerNativeClass, or code injection).

#### Output Streaming

The WASM API supports **real-time streaming output** via callbacks:
- `onOutput`: Called synchronously during execution as `PrintLn`/`Print` execute
- `onError`: Handles runtime errors
- This enables progress display for long-running code

#### Three-Tier Error Handling

1. **Exceptions**: Initialization failures, invalid arguments (try/catch)
2. **Result Objects**: Compilation/execution failures (check `result.success`)
3. **Error Callbacks**: Runtime exceptions (via `onError` callback)

### Content Structure

**Lessons** (`content/lessons/`):
- JSON-based lesson format with full Markdown support
- Organized by category: fundamentals, control-flow, functions, OOP, turtle-graphics, advanced
- Each lesson includes: title, description, content (markdown), examples, exercises
- `lesson-schema.json` defines the structure
- `index.json` provides navigation metadata

**Examples** (`content/examples/`):
- Organized by difficulty and category
- Turtle graphics examples in `turtle-graphics/` subdirectory

## Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+), no framework
- **Editor**: Monaco Editor (VS Code engine)
- **Runtime**: WebAssembly (Go-compiled go-dws)
- **Build**: Vite with Rollup bundler
- **Testing**: Jest (unit), Playwright (E2E)
- **Styling**: Plain CSS with theme support

## Development Workflow

### Adding New Features

1. **Core Features**: Add to appropriate module in `src/core/`, `src/editor/`, `src/output/`, or `src/turtle/`
2. **UI Components**: Add to `src/ui/`
3. **Lessons**: Add JSON files to `content/lessons/` following the schema
4. **Examples**: Add to `content/examples/` with appropriate metadata

### Tracking Progress in PLAN.md

**CRITICAL**: When working on tasks outlined in `PLAN.md`, you **MUST** mark them as done upon completion:

1. **Before Starting**: Check `PLAN.md` to understand what phase/section you're working on
2. **During Development**: Keep track of which specific tasks from PLAN.md you're completing
3. **After Completion**: Update `PLAN.md` immediately by:
   - Changing `- [ ]` to `- [x]` for completed tasks
   - Adding completion counts (e.g., "Complete - 6/6 lessons")
   - Adding checkmarks (✅) to completed sections
4. **Example Format**: See sections 3.1, 3.2 (Fundamentals, Control Flow, Functions & Procedures) for proper completion formatting

**Why This Matters**:
- Provides accurate project status tracking
- Prevents duplicate work
- Helps other contributors understand what's done
- Maintains project momentum visibility

### Module Dependencies

- Modules communicate via custom events (event-driven architecture)
- State is centralized in `state-manager.js`
- Avoid circular dependencies between modules

### Browser Requirements

- Chrome/Edge 90+, Firefox 88+, Safari 14+, Opera 76+
- Requires WebAssembly and ES6 module support
- WASM won't load from `file://` protocol (must use HTTP/HTTPS)

## Roadmap

See `PLAN.md` for comprehensive development roadmap. Key phases:

- **Phase 1-2 (Complete)**: Foundation, Monaco Editor, WASM integration, Turtle Graphics
- **Phase 3 (Complete)**: Educational content system with lessons and progress tracking
- **Phase 4 (Next)**: User experience enhancements
- **Phase 5-10**: Learning features, advanced features, content development

## FFI Architecture Notes

**Critical for Phase 2+**: The Foreign Function Interface (FFI) layer bridges JavaScript and Go/WASM. See PLAN.md "FFI Architecture & Integration" section for:

- Complete API contracts and data type mappings
- `window.DWScript` global API structure
- Proposed `dwscript-api.js` wrapper layer (not yet implemented)
- Web Worker approach for non-blocking execution
- Turtle graphics FFI registration patterns

**Key Files to Create**:
- `src/core/dwscript-api.js`: Wrapper class over raw WASM API
- `src/workers/dwscript-worker.js`: Web Worker for non-blocking execution

## Common Gotchas

1. **WASM Loading**: Always check `isWASMReady()` before executing code. The app gracefully falls back to mock mode if WASM is unavailable.

2. **Coordinate Systems**: Turtle graphics use center-based coordinates, but Canvas uses top-left origin. `turtle-engine.js` handles conversion.

3. **Async Execution**: Code execution appears synchronous but may become async with Web Worker implementation (Phase 2).

4. **Monaco Editor Integration**: Editor is configured in `monaco-setup.js` with custom language definition. Changes to syntax highlighting require updating `dwscript-lang.js`.

5. **State Persistence**: User preferences, lesson progress, and editor content are persisted to localStorage automatically.

6. **Theme Support**: Light/dark themes affect both Monaco Editor and UI. Theme changes trigger editor theme updates.
