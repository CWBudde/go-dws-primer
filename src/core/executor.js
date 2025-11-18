/**
 * Code Execution Manager
 * Handles running DWScript code and managing execution state
 */

import { executeDWScript, isWASMReady, getDWScriptAPI } from './wasm-loader.js';
import { clearOutput, appendConsoleOutput, appendCompilerOutput, showOutput } from '../output/output-manager.js';
import { clearTurtle } from '../turtle/turtle-api.js';
import { announceOutput, announceError, announceStatus } from '../utils/accessibility.js';
import { addErrorMarkers, clearErrorMarkers } from '../editor/monaco-setup.js';

let isExecuting = false;
let executionStartTime = 0;
let executionTimer = null;
let currentExecutionAbortController = null;

/**
 * Execute the current code
 * @param {string} code - The DWScript code to execute
 * @returns {Promise<Object>} Execution result
 */
export async function executeCode(code) {
  if (isExecuting) {
    console.warn('Code is already executing');
    return { success: false, message: 'Already executing' };
  }

  if (!isWASMReady()) {
    appendCompilerOutput('Error: DWScript runtime not ready', 'error');
    return { success: false, message: 'WASM not ready' };
  }

  try {
    isExecuting = true;
    executionStartTime = performance.now();
    currentExecutionAbortController = new AbortController();

    // Update UI
    updateExecutionUI(true);
    clearOutput();
    clearErrorMarkers();

    // Clear turtle canvas if graphics tab is visible
    const graphicsTab = document.getElementById('output-graphics');
    if (graphicsTab) {
      clearTurtle();
    }

    appendCompilerOutput('Compiling and executing...', 'info');

    // Start execution timer
    startExecutionTimer();

    // Execute the code
    const result = await executeDWScript(code);

    const executionTime = performance.now() - executionStartTime;

    // Display results
    if (result.success) {
      // Show compiler messages if any
      if (result.warnings && result.warnings.length > 0) {
        result.warnings.forEach(warning => {
          appendCompilerOutput(`Warning: ${warning}`, 'warning');
        });
      } else {
        appendCompilerOutput('Compilation successful', 'success');
      }

      // Show output
      if (result.output) {
        appendConsoleOutput(result.output);
        announceOutput(result.output);
      }

      // Show execution stats
      updateExecutionTime(executionTime);
      const statusMsg = `Execution completed in ${executionTime.toFixed(2)}ms`;
      updateStatus(statusMsg);
      announceStatus(statusMsg);
    } else {
      // Show errors
      appendCompilerOutput('Compilation failed:', 'error');
      if (result.errors && result.errors.length > 0) {
        // Add error markers to the editor
        addErrorMarkers(result.errors);

        // Display errors in compiler output
        result.errors.forEach(error => {
          const errorMsg = error.line > 0
            ? `Line ${error.line}: ${error.message}`
            : error.message;
          appendCompilerOutput(errorMsg, 'error');
          announceError(error.message, error.line);
        });
      }

      updateStatus('Compilation failed');
      announceStatus('Compilation failed');
    }

    return result;
  } catch (error) {
    console.error('Execution error:', error);
    appendCompilerOutput(`Runtime error: ${error.message}`, 'error');
    updateStatus('Execution failed');

    return { success: false, error: error.message };
  } finally {
    isExecuting = false;
    currentExecutionAbortController = null;
    stopExecutionTimer();
    updateExecutionUI(false);
  }
}

/**
 * Stop the current execution (if possible)
 */
export function stopExecution() {
  if (isExecuting) {
    console.log('Stop requested');

    // Abort execution if possible
    if (currentExecutionAbortController) {
      currentExecutionAbortController.abort();
    }

    appendCompilerOutput('Execution stopped by user', 'warning');
    updateStatus('Execution stopped');
    isExecuting = false;
    stopExecutionTimer();
    updateExecutionUI(false);
  }
}

/**
 * Check if code is currently executing
 * @returns {boolean}
 */
export function isCodeExecuting() {
  return isExecuting;
}

/**
 * Update UI elements during execution
 * @param {boolean} executing
 */
function updateExecutionUI(executing) {
  const runBtn = document.getElementById('btn-run');
  const stopBtn = document.getElementById('btn-stop');

  if (runBtn) {
    runBtn.disabled = executing;
  }

  if (stopBtn) {
    stopBtn.disabled = !executing;
  }

  // Dispatch event
  window.dispatchEvent(new CustomEvent('executionstate', {
    detail: { executing }
  }));
}

/**
 * Update the status bar message
 * @param {string} message
 */
function updateStatus(message) {
  const statusEl = document.getElementById('status-message');
  if (statusEl) {
    statusEl.textContent = message;
  }
}

/**
 * Update execution time display
 * @param {number} timeMs
 */
function updateExecutionTime(timeMs) {
  const timeEl = document.getElementById('execution-time');
  if (timeEl) {
    if (timeMs < 1000) {
      timeEl.textContent = `⏱️ ${timeMs.toFixed(2)}ms`;
    } else {
      timeEl.textContent = `⏱️ ${(timeMs / 1000).toFixed(2)}s`;
    }
  }

  // Update performance metrics
  updatePerformanceMetrics();
}

/**
 * Update performance metrics display
 */
function updatePerformanceMetrics() {
  const metricsEl = document.getElementById('performance-metrics');
  if (!metricsEl) return;

  const api = getDWScriptAPI();
  if (!api || !api.isReady()) return;

  const metrics = api.getMetrics();

  // Display summary in status bar
  const avgTime = metrics.averageExecutionTime.toFixed(1);
  const errorRate = metrics.totalExecutions > 0
    ? ((metrics.errorCount / metrics.totalExecutions) * 100).toFixed(0)
    : 0;

  metricsEl.textContent = `📊 ${metrics.totalExecutions} runs | avg ${avgTime}ms | ${errorRate}% errors`;

  // Add click handler to show detailed metrics
  metricsEl.onclick = () => showDetailedMetrics(metrics);
}

/**
 * Show detailed performance metrics in a modal/alert
 * @param {Object} metrics
 */
function showDetailedMetrics(metrics) {
  const message = `
Performance Metrics
═══════════════════

Total Executions: ${metrics.totalExecutions}
Total Compilations: ${metrics.totalCompilations}
Total Execution Time: ${metrics.totalExecutionTime.toFixed(2)}ms
Average Execution Time: ${metrics.averageExecutionTime.toFixed(2)}ms
Error Count: ${metrics.errorCount}
Success Rate: ${(((metrics.totalExecutions - metrics.errorCount) / metrics.totalExecutions) * 100).toFixed(1)}%
  `.trim();

  alert(message);
}

/**
 * Start the execution timer (updates live during execution)
 */
function startExecutionTimer() {
  stopExecutionTimer();
  executionTimer = setInterval(() => {
    const elapsed = performance.now() - executionStartTime;
    updateExecutionTime(elapsed);
  }, 100);
}

/**
 * Stop the execution timer
 */
function stopExecutionTimer() {
  if (executionTimer) {
    clearInterval(executionTimer);
    executionTimer = null;
  }
}

/**
 * Parse compiler error/warning messages and extract line numbers
 * @param {string} message - Error message
 * @returns {Object} - Parsed error with line, column, and message
 */
export function parseCompilerMessage(message) {
  // Common patterns:
  // "Line 5: Error message"
  // "[5:10] Error message"
  // "file.pas(5,10) Error message"

  const patterns = [
    /Line\s+(\d+)(?::|\s+Col(?:umn)?\s+(\d+))?:\s*(.+)/i,
    /\[(\d+)(?::(\d+))?\]\s*(.+)/,
    /\((\d+)(?:,(\d+))?\)\s*(.+)/,
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match) {
      return {
        line: parseInt(match[1]),
        column: match[2] ? parseInt(match[2]) : null,
        message: match[3] || message,
      };
    }
  }

  return {
    line: null,
    column: null,
    message: message,
  };
}

/**
 * Highlight error in editor
 * @param {number} line - Line number
 * @param {number} column - Column number (optional)
 */
export function highlightErrorInEditor(line, column = null) {
  // This will be called from output-manager when error messages are clicked
  const event = new CustomEvent('highlightError', {
    detail: { line, column }
  });
  window.dispatchEvent(event);
}
