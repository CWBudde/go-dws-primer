/**
 * Code Execution Manager
 * Handles running DWScript code and managing execution state
 */

import { executeDWScript, isWASMReady, getDWScriptAPI } from './wasm-loader.js';
import { clearOutput, appendConsoleOutput, appendCompilerOutput, showOutput } from '../output/output-manager.js';
import { clearTurtle } from '../turtle/turtle-api.js';
import { executeInWorker, stopWorkerExecution, isWorkerInitialized, initWorker } from '../workers/worker-manager.js';
import { announceOutput, announceError, announceStatus } from '../utils/accessibility.js';
import { addErrorMarkers, clearErrorMarkers } from '../editor/monaco-setup.js';

let isExecuting = false;
let executionStartTime = 0;
let executionTimer = null;
let currentExecutionAbortController = null;

// Worker execution mode (can be toggled)
let useWorkerExecution = false; // Disabled by default, can be enabled in settings

// Execution configuration
const executionConfig = {
  defaultTimeout: 30000, // 30 seconds
  enableTimeout: true,
  maxExecutionTime: 120000 // 2 minutes max
};

// Performance metrics
let executionMetrics = {
  totalExecutions: 0,
  successfulExecutions: 0,
  failedExecutions: 0,
  totalExecutionTime: 0,
  averageExecutionTime: 0,
  lastExecutionTime: 0,
  peakExecutionTime: 0,
  timeouts: 0,
  memoryUsage: {
    current: 0,
    peak: 0,
    wasmMemory: 0
  }
};

/**
 * Execute the current code
 * @param {string} code - The DWScript code to execute
 * @param {Object} options - Execution options
 * @returns {Promise<Object>} Execution result
 */
export async function executeCode(code, options = {}) {
  if (isExecuting) {
    console.warn('Code is already executing');
    return { success: false, message: 'Already executing' };
  }

  // Check if we should use worker execution
  const useWorker = options.useWorker !== undefined ? options.useWorker : useWorkerExecution;

  if (!useWorker && !isWASMReady()) {
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

    // Determine timeout
    const timeout = options.timeout ||
                   (executionConfig.enableTimeout ? executionConfig.defaultTimeout : 0);

    // Execute the code (using worker or direct)
    let result;
    let timedOut = false;

    if (useWorker) {
      try {
        result = await executeInWorker(code, {
          onOutput: (text) => {
            appendConsoleOutput(text);
          },
          timeout: timeout
        });
      } catch (error) {
        if (error.message === 'Execution timeout') {
          timedOut = true;
          result = {
            success: false,
            output: '',
            errors: [{
              type: 'TimeoutError',
              message: `Execution timed out after ${timeout}ms`,
              line: 0,
              column: 0
            }],
            warnings: [],
            executionTime: timeout
          };
        } else {
          throw error;
        }
      }
    } else {
      // For non-worker execution, implement timeout using Promise.race
      if (timeout > 0) {
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Execution timeout')), timeout);
        });

        try {
          result = await Promise.race([executeDWScript(code), timeoutPromise]);
        } catch (error) {
          if (error.message === 'Execution timeout') {
            timedOut = true;
            result = {
              success: false,
              output: '',
              errors: [{
                type: 'TimeoutError',
                message: `Execution timed out after ${timeout}ms`,
                line: 0,
                column: 0
              }],
              warnings: [],
              executionTime: timeout
            };
          } else {
            throw error;
          }
        }
      } else {
        result = await executeDWScript(code);
      }
    }

    const executionTime = performance.now() - executionStartTime;

    // Track timeout in metrics
    if (timedOut) {
      executionMetrics.timeouts++;
    }

    // Update metrics including memory usage
    const memoryInfo = getMemoryUsage();
    updateMetrics(result.success, executionTime, memoryInfo);

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

      // Show execution stats with enhanced metrics
      updateExecutionTime(executionTime);

      const metricsText = formatExecutionMetrics(executionTime);
      updateStatus(`${metricsText}`);

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
export async function stopExecution() {
  if (isExecuting) {
    console.log('Stop requested');

    // If using worker execution, terminate the worker
    if (useWorkerExecution && isWorkerInitialized()) {
      try {
        await stopWorkerExecution();
        appendCompilerOutput('Execution stopped (worker terminated)', 'warning');
      } catch (error) {
        console.error('Error stopping worker:', error);
        appendCompilerOutput('Error stopping execution', 'error');
      }
    } else {
      // Abort execution if possible (for non-worker execution)
      if (currentExecutionAbortController) {
        currentExecutionAbortController.abort();
      }
      appendCompilerOutput('Execution stopped by user', 'warning');
    }

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
 * Update memory usage display
 */
function updateMemoryDisplay() {
  const memoryEl = document.getElementById('memory-usage');
  if (!memoryEl) return;

  const memoryInfo = getMemoryUsage();

  if (!memoryInfo.available) {
    memoryEl.textContent = '';
    return;
  }

  let displayText = '';

  if (memoryInfo.jsHeapSize > 0) {
    displayText = `💾 ${formatMemorySize(memoryInfo.jsHeapSize)}`;
  }

  if (memoryInfo.wasmMemory > 0) {
    displayText += displayText ? ` / WASM: ${formatMemorySize(memoryInfo.wasmMemory)}` : `💾 WASM: ${formatMemorySize(memoryInfo.wasmMemory)}`;
  }

  memoryEl.textContent = displayText;
}

/**
 * Start the execution timer (updates live during execution)
 */
function startExecutionTimer() {
  stopExecutionTimer();
  executionTimer = setInterval(() => {
    const elapsed = performance.now() - executionStartTime;
    updateExecutionTime(elapsed);
    updateMemoryDisplay();
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
 * Update execution metrics
 * @param {boolean} success - Whether execution was successful
 * @param {number} executionTime - Execution time in ms
 * @param {Object} memoryInfo - Memory usage information
 */
function updateMetrics(success, executionTime, memoryInfo = null) {
  executionMetrics.totalExecutions++;
  executionMetrics.lastExecutionTime = executionTime;
  executionMetrics.totalExecutionTime += executionTime;
  executionMetrics.averageExecutionTime = executionMetrics.totalExecutionTime / executionMetrics.totalExecutions;

  if (executionTime > executionMetrics.peakExecutionTime) {
    executionMetrics.peakExecutionTime = executionTime;
  }

  if (success) {
    executionMetrics.successfulExecutions++;
  } else {
    executionMetrics.failedExecutions++;
  }

  // Update memory metrics
  if (memoryInfo) {
    executionMetrics.memoryUsage.current = memoryInfo.jsHeapSize;
    executionMetrics.memoryUsage.wasmMemory = memoryInfo.wasmMemory;

    if (memoryInfo.jsHeapSize > executionMetrics.memoryUsage.peak) {
      executionMetrics.memoryUsage.peak = memoryInfo.jsHeapSize;
    }
  }

  // Dispatch metrics update event
  window.dispatchEvent(new CustomEvent('metricsUpdate', {
    detail: { metrics: executionMetrics }
  }));
}

/**
 * Format execution metrics for status display
 * @param {number} currentTime - Current execution time
 * @returns {string} Formatted metrics string
 */
function formatExecutionMetrics(currentTime) {
  const timeStr = currentTime < 1000
    ? `${currentTime.toFixed(2)}ms`
    : `${(currentTime / 1000).toFixed(2)}s`;

  const avgStr = executionMetrics.averageExecutionTime < 1000
    ? `${executionMetrics.averageExecutionTime.toFixed(2)}ms`
    : `${(executionMetrics.averageExecutionTime / 1000).toFixed(2)}s`;

  return `Completed in ${timeStr} (avg: ${avgStr}, runs: ${executionMetrics.totalExecutions})`;
}

/**
 * Get current execution metrics
 * @returns {Object} Current metrics
 */
export function getExecutionMetrics() {
  return { ...executionMetrics };
}

/**
 * Reset execution metrics
 */
export function resetExecutionMetrics() {
  executionMetrics = {
    totalExecutions: 0,
    successfulExecutions: 0,
    failedExecutions: 0,
    totalExecutionTime: 0,
    averageExecutionTime: 0,
    lastExecutionTime: 0,
    peakExecutionTime: 0,
    timeouts: 0,
    memoryUsage: {
      current: 0,
      peak: 0,
      wasmMemory: 0
    }
  };

  window.dispatchEvent(new CustomEvent('metricsReset'));
}

/**
 * Get current memory usage information
 * @returns {Object} Memory usage stats
 */
export function getMemoryUsage() {
  const memoryInfo = {
    jsHeapSize: 0,
    jsHeapLimit: 0,
    wasmMemory: 0,
    wasmMemoryPages: 0,
    available: false
  };

  // Try to get JavaScript heap information (Chrome only)
  if (performance.memory) {
    memoryInfo.jsHeapSize = performance.memory.usedJSHeapSize;
    memoryInfo.jsHeapLimit = performance.memory.jsHeapSizeLimit;
    memoryInfo.available = true;
  }

  // Try to get WASM memory information
  try {
    if (window.DWScript && window.Go && window.Go._inst) {
      // Access Go WASM instance memory
      const wasmMemory = window.Go._inst.exports.mem;
      if (wasmMemory && wasmMemory.buffer) {
        memoryInfo.wasmMemory = wasmMemory.buffer.byteLength;
        memoryInfo.wasmMemoryPages = wasmMemory.buffer.byteLength / 65536; // WASM page size
        memoryInfo.available = true;
      }
    }
  } catch (error) {
    // WASM memory not accessible
    console.debug('WASM memory not accessible:', error.message);
  }

  return memoryInfo;
}

/**
 * Format memory size for display
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted string
 */
export function formatMemorySize(bytes) {
  if (bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${units[i]}`;
}

/**
 * Configure execution timeout
 * @param {Object} config - Timeout configuration
 */
export function configureTimeout(config) {
  if (config.defaultTimeout !== undefined) {
    executionConfig.defaultTimeout = Math.min(config.defaultTimeout, executionConfig.maxExecutionTime);
  }
  if (config.enableTimeout !== undefined) {
    executionConfig.enableTimeout = config.enableTimeout;
  }
  if (config.maxExecutionTime !== undefined) {
    executionConfig.maxExecutionTime = config.maxExecutionTime;
  }
}

/**
 * Get current execution configuration
 * @returns {Object}
 */
export function getExecutionConfig() {
  return { ...executionConfig };
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

/**
 * Enable or disable worker execution mode
 * @param {boolean} enabled - Whether to use worker execution
 */
export function setWorkerExecutionMode(enabled) {
  useWorkerExecution = enabled;
  console.log(`Worker execution mode ${enabled ? 'enabled' : 'disabled'}`);

  // Pre-initialize worker if enabling
  if (enabled && !isWorkerInitialized()) {
    initWorker().catch(error => {
      console.error('Failed to initialize worker:', error);
      useWorkerExecution = false;
    });
  }
}

/**
 * Check if worker execution mode is enabled
 * @returns {boolean}
 */
export function isWorkerExecutionMode() {
  return useWorkerExecution;
}

/**
 * Initialize worker for execution
 * @returns {Promise<void>}
 */
export async function initializeWorker() {
  try {
    await initWorker();
    console.log('Worker initialized successfully');
  } catch (error) {
    console.error('Worker initialization failed:', error);
    throw error;
  }
}
