/**
 * Code Execution Manager
 * Handles running DWScript code and managing execution state
 */

import { executeDWScript, isWASMReady } from './wasm-loader.js';
import { clearOutput, appendConsoleOutput, appendCompilerOutput, showOutput } from '../output/output-manager.js';

let isExecuting = false;
let executionStartTime = 0;

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

    // Update UI
    updateExecutionUI(true);
    clearOutput();

    appendCompilerOutput('Compiling and executing...', 'info');

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
      }

      // Show execution stats
      updateExecutionTime(executionTime);
      updateStatus(`Execution completed in ${executionTime.toFixed(2)}ms`);
    } else {
      // Show errors
      appendCompilerOutput('Compilation failed:', 'error');
      if (result.errors && result.errors.length > 0) {
        result.errors.forEach(error => {
          const errorMsg = error.line > 0
            ? `Line ${error.line}: ${error.message}`
            : error.message;
          appendCompilerOutput(errorMsg, 'error');
        });
      }

      updateStatus('Compilation failed');
    }

    return result;
  } catch (error) {
    console.error('Execution error:', error);
    appendCompilerOutput(`Runtime error: ${error.message}`, 'error');
    updateStatus('Execution failed');

    return { success: false, error: error.message };
  } finally {
    isExecuting = false;
    updateExecutionUI(false);
  }
}

/**
 * Stop the current execution (if possible)
 */
export function stopExecution() {
  if (isExecuting) {
    // TODO: Implement actual execution stopping when WASM supports it
    console.log('Stop requested');
    updateStatus('Execution stopped');
    isExecuting = false;
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
    timeEl.textContent = `⏱️ ${timeMs.toFixed(2)}ms`;
  }
}
