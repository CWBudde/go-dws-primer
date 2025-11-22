/**
 * DWScript Primer - Bootstrap
 * Initializes the application and sets up event handlers for the DOM-rendered UI
 */
import {
  initMonacoEditor,
  getCode,
  setupKeyboardShortcuts,
  formatCode,
} from "./editor/monaco-setup.ts";
import { initWASM, getWASMError } from "./core/wasm-loader.ts";
import { initState, toggleTheme, getValue } from "./core/state-manager.ts";
import { executeCode, stopExecution } from "./core/executor.ts";
import {
  appendConsoleOutput,
  appendCompilerOutput,
  switchTab,
} from "./output/output-manager.ts";
import { setupUI } from "./ui/layout.ts";
import {
  initTurtle,
  installTurtleAPI,
  exportCanvasPNG,
  clearTurtle,
  setTurtleSpeed,
} from "./turtle/turtle-api.ts";
import {
  initLessonNavigation,
  loadLessonFromURL,
} from "./lessons/navigation.ts";
import { shareCode, loadFromURL } from "./utils/url-sharing.ts";
import { showSettingsModal, initSettings } from "./ui/settings-modal.ts";
import { initAccessibility, enhanceARIA } from "./utils/accessibility.ts";
import { initSnippetsPanel } from "./ui/snippets-panel.ts";

let initialized = false;

/**
 * Initialize the application. Safe to call multiple times; subsequent calls are ignored.
 */
export async function initApp() {
  if (initialized) return;
  initialized = true;

  console.log("Initializing DWScript Primer...");

  // Show loading overlay
  const loading = document.getElementById("loading");

  try {
    // Initialize state
    initState();

    // Initialize accessibility features
    initAccessibility();

    // Initialize Turtle Graphics
    const canvas = document.getElementById("turtle-canvas");
    if (canvas instanceof HTMLCanvasElement) {
      initTurtle(canvas);
      installTurtleAPI();
      console.log("Turtle Graphics initialized");
    }

    // Initialize Lesson System
    await initLessonNavigation();
    console.log("Lesson system initialized");

    // Initialize Monaco Editor
    const editorContainer = document.getElementById("editor-container");
    if (editorContainer) {
      const editor = await initMonacoEditor(editorContainer);
      setupKeyboardShortcuts();
      console.log("Monaco Editor initialized");

      // Setup cursor position tracking
      editor.onDidChangeCursorPosition((e) => {
        updateCursorPosition(e.position.lineNumber, e.position.column);
      });
    }

    // Initialize UI components
    setupUI();

    // Initialize settings
    initSettings();

    // Initialize snippets panel
    await initSnippetsPanel();
    console.log("Snippets panel initialized");

    // Enhance ARIA labels
    enhanceARIA();
    switchTab("console");

    // Load WASM runtime (async, non-blocking)
    console.log("Loading DWScript WASM runtime...");
    const wasmSuccess = await initWASM({
      onOutput: (text) => {
        // Stream output to console in real-time
        appendConsoleOutput(text);
      },
      onError: (error) => {
        // Handle runtime errors
        const errorMsg =
          error.line > 0
            ? `Runtime error at line ${error.line}: ${error.message}`
            : `Runtime error: ${error.message}`;
        appendCompilerOutput(errorMsg, "error");
      },
      onInput: () => {
        // Handle input requests
        return prompt("Input requested:") || "";
      },
    });

    if (wasmSuccess) {
      console.log("WASM loaded successfully");
      updateStatus("Ready");
    } else {
      const error = getWASMError();
      console.error("WASM failed to load:", error);
      updateStatus("WASM runtime not available (using mock mode)");

      // Show warning in compiler output
      const compilerOutput = document.querySelector(
        "#output-compiler .output-content",
      );
      if (compilerOutput) {
        compilerOutput.innerHTML = `
          <div class="compiler-message compiler-warning">
            ⚠️ DWScript WASM runtime could not be loaded.<br>
            Running in mock mode for development.<br>
            <br>
            To enable full functionality:<br>
            1. Build the WASM module from go-dws<br>
            2. Place dwscript.wasm and wasm_exec.js in the /wasm directory<br>
            <br>
            Error: ${error ? error.message : "Unknown error"}
          </div>
        `;
      }
    }

    // Check for shared code in URL
    const sharedCode = loadFromURL();
    if (sharedCode && sharedCode.code) {
      // Load shared code into editor
      const monaco = await import("monaco-editor");
      const editor = monaco.editor.getModels()[0];
      if (editor) {
        editor.setValue(sharedCode.code);
      }
      console.log("Loaded shared code from URL");
    }

    // Load lesson from URL or default
    await loadLessonFromURL();

    console.log("DWScript Primer initialized successfully");
  } catch (error) {
    console.error("Initialization error:", error);
    updateStatus("Initialization failed");

    // Show error
    alert(`Failed to initialize DWScript Primer:\n${error.message}`);
  } finally {
    // Hide loading overlay
    if (loading) {
      setTimeout(() => {
        loading.classList.add("hidden");
      }, 500);
    }
  }
}

export async function runCode() {
  const code = getCode();
  if (!code.trim()) {
    updateStatus("No code to execute");
    return;
  }

  updateStatus("Executing...");
  await executeCode(code);
}

export function stopCode() {
  stopExecution();
}

export function clearOutputs() {
  const consoleOutput = document.querySelector(
    "#output-console .output-content",
  );
  const compilerOutput = document.querySelector(
    "#output-compiler .output-content",
  );

  if (consoleOutput) consoleOutput.innerHTML = "";
  if (compilerOutput) compilerOutput.innerHTML = "";

  updateStatus("Output cleared");
}

export function formatEditor() {
  formatCode();
  updateStatus("Code formatted");
}

export function toggleThemeMode() {
  toggleTheme();
}

export function openSettings() {
  showSettingsModal();
}

export async function shareCurrentCode() {
  const code = getCode();
  const currentLesson = getValue("currentLesson");

  return shareCode(code, {
    lessonId: currentLesson,
    title:
      document.querySelector(".lesson-content h2")?.textContent ||
      "DWScript Code",
  });
}

export function clearCanvas() {
  clearTurtle();
  updateStatus("Canvas cleared");
}

export function exportCanvasImage() {
  exportCanvasPNG();
  updateStatus("Canvas exported");
}

export function updateTurtleSpeed(speed: number) {
  setTurtleSpeed(speed);
}

/**
 * Update status bar message
 * @param {string} message
 */
export function updateStatus(message) {
  const statusEl = document.getElementById("status-message");
  if (statusEl) {
    statusEl.textContent = message;
  }
}

/**
 * Update cursor position display
 * @param {number} line
 * @param {number} column
 */
function updateCursorPosition(line, column) {
  const cursorPos = document.getElementById("cursor-position");
  if (cursorPos) {
    cursorPos.textContent = `Ln ${line}, Col ${column}`;
  }
}
