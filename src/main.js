/**
 * DWScript Primer - Main Entry Point
 * Initializes the application and sets up event handlers
 */

import '../styles/main.css';
import { initMonacoEditor, getCode, setupKeyboardShortcuts, formatCode } from './editor/monaco-setup.js';
import { initWASM, isWASMReady, getWASMError } from './core/wasm-loader.js';
import { initState, toggleTheme, getValue } from './core/state-manager.js';
import { executeCode, stopExecution } from './core/executor.js';
import { initOutputPanels } from './output/output-manager.js';
import { setupUI } from './ui/layout.js';
import { initTurtle, installTurtleAPI, exportCanvasPNG, clearTurtle, toggleGrid, setTurtleSpeed } from './turtle/turtle-api.js';
import { initLessonNavigation, loadLessonFromURL } from './lessons/navigation.js';
import { shareCode, loadFromURL } from './utils/url-sharing.js';
import { showSettingsModal, initSettings } from './ui/settings-modal.js';
import { initAccessibility, enhanceARIA, announce } from './utils/accessibility.js';

/**
 * Initialize the application
 */
async function init() {
  console.log('Initializing DWScript Primer...');

  // Show loading overlay
  const loading = document.getElementById('loading');

  try {
    // Initialize state
    initState();

    // Initialize accessibility features
    initAccessibility();

    // Initialize output panels
    initOutputPanels();

    // Initialize Turtle Graphics
    const canvas = document.getElementById('turtle-canvas');
    if (canvas) {
      initTurtle(canvas);
      installTurtleAPI();
      console.log('Turtle Graphics initialized');
    }

    // Initialize Lesson System
    await initLessonNavigation();
    console.log('Lesson system initialized');

    // Initialize Monaco Editor
    const editorContainer = document.getElementById('editor-container');
    if (editorContainer) {
      const editor = initMonacoEditor(editorContainer);
      setupKeyboardShortcuts();
      console.log('Monaco Editor initialized');

      // Setup cursor position tracking
      editor.onDidChangeCursorPosition((e) => {
        updateCursorPosition(e.position.lineNumber, e.position.column);
      });
    }

    // Initialize UI components
    setupUI();

    // Initialize settings
    initSettings();

    // Enhance ARIA labels
    enhanceARIA();

    // Load WASM runtime (async, non-blocking)
    console.log('Loading DWScript WASM runtime...');
    const wasmSuccess = await initWASM();

    if (wasmSuccess) {
      console.log('WASM loaded successfully');
      updateStatus('Ready');
    } else {
      const error = getWASMError();
      console.error('WASM failed to load:', error);
      updateStatus('WASM runtime not available (using mock mode)');

      // Show warning in compiler output
      const compilerOutput = document.querySelector('#output-compiler .output-content');
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
            Error: ${error ? error.message : 'Unknown error'}
          </div>
        `;
      }
    }

    // Setup event listeners
    setupEventListeners();

    // Check for shared code in URL
    const sharedCode = loadFromURL();
    if (sharedCode && sharedCode.code) {
      // Load shared code into editor
      const monaco = await import('monaco-editor');
      const editor = monaco.editor.getModels()[0];
      if (editor) {
        editor.setValue(sharedCode.code);
      }
      console.log('Loaded shared code from URL');
    }

    // Load lesson from URL or default
    await loadLessonFromURL();

    console.log('DWScript Primer initialized successfully');
  } catch (error) {
    console.error('Initialization error:', error);
    updateStatus('Initialization failed');

    // Show error
    alert(`Failed to initialize DWScript Primer:\n${error.message}`);
  } finally {
    // Hide loading overlay
    if (loading) {
      setTimeout(() => {
        loading.classList.add('hidden');
      }, 500);
    }
  }
}

/**
 * Setup event listeners for UI interactions
 */
function setupEventListeners() {
  // Run button
  const runBtn = document.getElementById('btn-run');
  if (runBtn) {
    runBtn.addEventListener('click', handleRun);
  }

  // Stop button
  const stopBtn = document.getElementById('btn-stop');
  if (stopBtn) {
    stopBtn.addEventListener('click', handleStop);
  }

  // Clear button
  const clearBtn = document.getElementById('btn-clear');
  if (clearBtn) {
    clearBtn.addEventListener('click', handleClear);
  }

  // Format button
  const formatBtn = document.getElementById('btn-format');
  if (formatBtn) {
    formatBtn.addEventListener('click', () => {
      formatCode();
      updateStatus('Code formatted');
    });
  }

  // Theme toggle
  const themeBtn = document.getElementById('btn-theme');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      toggleTheme();
    });
  }

  // Settings button
  const settingsBtn = document.getElementById('btn-settings');
  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      showSettingsModal();
    });
  }

  // Share button
  const shareBtn = document.getElementById('btn-share');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const code = getCode();
      const currentLesson = getValue('currentLesson');

      const result = await shareCode(code, {
        lessonId: currentLesson,
        title: document.querySelector('.lesson-content h2')?.textContent || 'DWScript Code'
      });

      if (result.success) {
        updateStatus('✓ ' + result.message);
        // Show a temporary success message
        const originalIcon = shareBtn.querySelector('.icon').textContent;
        shareBtn.querySelector('.icon').textContent = '✓';
        setTimeout(() => {
          shareBtn.querySelector('.icon').textContent = originalIcon;
        }, 2000);
      } else {
        updateStatus('✗ Failed to share code');
      }
    });
  }

  // Navigation buttons
  const navButtons = document.querySelectorAll('.nav-btn');
  navButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Remove active class from all
      navButtons.forEach(b => b.classList.remove('active'));
      // Add to clicked
      e.target.classList.add('active');

      // TODO: Implement view switching
      console.log('Navigate to:', e.target.textContent);
    });
  });

  // Canvas controls
  const clearCanvas = document.getElementById('btn-clear-canvas');
  if (clearCanvas) {
    clearCanvas.addEventListener('click', () => {
      clearTurtle();
      updateStatus('Canvas cleared');
    });
  }

  const exportCanvas = document.getElementById('btn-export-canvas');
  if (exportCanvas) {
    exportCanvas.addEventListener('click', () => {
      exportCanvasPNG();
      updateStatus('Canvas exported');
    });
  }

  // Turtle speed control
  const speedControl = document.getElementById('turtle-speed');
  if (speedControl) {
    speedControl.addEventListener('input', (e) => {
      const speed = parseInt(e.target.value);
      setTurtleSpeed(speed);
    });
  }
}

/**
 * Handle Run button click
 */
async function handleRun() {
  const code = getCode();
  if (!code.trim()) {
    updateStatus('No code to execute');
    return;
  }

  updateStatus('Executing...');
  await executeCode(code);
}

/**
 * Handle Stop button click
 */
function handleStop() {
  stopExecution();
}

/**
 * Handle Clear button click
 */
function handleClear() {
  const consoleOutput = document.querySelector('#output-console .output-content');
  const compilerOutput = document.querySelector('#output-compiler .output-content');

  if (consoleOutput) consoleOutput.innerHTML = '';
  if (compilerOutput) compilerOutput.innerHTML = '';

  updateStatus('Output cleared');
}

/**
 * Update status bar message
 * @param {string} message
 */
function updateStatus(message) {
  const statusEl = document.getElementById('status-message');
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
  const cursorPos = document.getElementById('cursor-position');
  if (cursorPos) {
    cursorPos.textContent = `Ln ${line}, Col ${column}`;
  }
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
