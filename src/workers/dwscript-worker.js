/**
 * DWScript Web Worker
 * Handles code execution in a separate thread to prevent UI blocking
 *
 * This worker:
 * - Loads and initializes the WASM module
 * - Executes DWScript code without blocking the main thread
 * - Streams output back to the main thread
 * - Can be terminated to stop long-running code
 */

let dwsAPI = null;
let isInitialized = false;
let executionTimeoutId = null;

/**
 * Message handler for communication with main thread
 */
self.onmessage = async function (event) {
  const { type, data } = event.data;

  try {
    switch (type) {
      case "init":
        await initializeWASM(data);
        break;

      case "execute":
        await executeCode(data);
        break;

      case "compile":
        await compileCode(data);
        break;

      case "run":
        await runProgram(data);
        break;

      case "dispose":
        disposeAPI();
        break;

      default:
        self.postMessage({
          type: "error",
          error: `Unknown message type: ${type}`,
        });
    }
  } catch (error) {
    self.postMessage({
      type: "error",
      error: {
        message: error.message,
        stack: error.stack,
      },
    });
  }
};

/**
 * Initialize WASM module in worker context
 * @param {Object} config - Configuration including WASM path and timeout
 */
async function initializeWASM(config) {
  try {
    const { wasmPath, timeout: _timeout } = config;

    // Import the WASM loader (need to handle paths correctly)
    // For now, we'll load the WASM directly

    // Load wasm_exec.js
    importScripts("/wasm/wasm_exec.js");

    // Fetch and initialize WASM module
    const response = await fetch(wasmPath || "/wasm/dwscript.wasm");
    const wasmBuffer = await response.arrayBuffer();

    // Initialize Go runtime
    const go = new Go();
    const result = await WebAssembly.instantiate(wasmBuffer, go.importObject);

    // Run Go program
    go.run(result.instance);

    // Wait for API registration (critical timing!)
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Verify DWScript is available
    if (!self.DWScript) {
      throw new Error("DWScript API not available after initialization");
    }

    // Create DWScript instance with callbacks
    dwsAPI = new self.DWScript();

    await dwsAPI.init({
      onOutput: (text) => {
        self.postMessage({
          type: "output",
          output: text,
        });
      },
      onError: (error) => {
        self.postMessage({
          type: "runtime-error",
          error: {
            type: error.type || "RuntimeError",
            message: error.message || String(error),
            line: error.line || 0,
            column: error.column || 0,
          },
        });
      },
      onInput: () => {
        // Input not supported in worker context
        return "";
      },
    });

    isInitialized = true;

    self.postMessage({
      type: "ready",
      version: dwsAPI.version ? dwsAPI.version() : { version: "unknown" },
    });
  } catch (error) {
    self.postMessage({
      type: "init-error",
      error: {
        message: error.message,
        stack: error.stack,
      },
    });
  }
}

/**
 * Execute DWScript code (compile + run)
 * @param {Object} params - Execution parameters
 */
async function executeCode(params) {
  if (!isInitialized || !dwsAPI) {
    throw new Error("DWScript not initialized");
  }

  const { code, timeout } = params;
  const startTime = performance.now();

  // Set up timeout if specified
  if (timeout && timeout > 0) {
    executionTimeoutId = setTimeout(() => {
      self.postMessage({
        type: "timeout",
        message: "Execution timed out",
      });
      // In a real scenario, we'd need to terminate execution
      // For now, we just notify
    }, timeout);
  }

  try {
    const result = dwsAPI.eval(code);
    const executionTime = performance.now() - startTime;

    // Clear timeout
    if (executionTimeoutId) {
      clearTimeout(executionTimeoutId);
      executionTimeoutId = null;
    }

    // Normalize and send result
    self.postMessage({
      type: "result",
      result: {
        success: result.success,
        output: result.output || "",
        errors: result.error ? [normalizeError(result.error)] : [],
        warnings: result.warnings || [],
        executionTime: executionTime,
        wasmExecutionTime: result.executionTime || 0,
      },
    });
  } catch (error) {
    // Clear timeout
    if (executionTimeoutId) {
      clearTimeout(executionTimeoutId);
      executionTimeoutId = null;
    }

    self.postMessage({
      type: "result",
      result: {
        success: false,
        output: "",
        errors: [
          {
            type: "ExecutionError",
            message: error.message,
            line: 0,
            column: 0,
          },
        ],
        warnings: [],
        executionTime: performance.now() - startTime,
        wasmExecutionTime: 0,
      },
    });
  }
}

/**
 * Compile code without executing
 * @param {Object} params - Compilation parameters
 */
async function compileCode(params) {
  if (!isInitialized || !dwsAPI) {
    throw new Error("DWScript not initialized");
  }

  const { code, cacheKey } = params;
  const startTime = performance.now();

  try {
    const program = dwsAPI.compile(code, cacheKey);
    const compilationTime = performance.now() - startTime;

    self.postMessage({
      type: "compile-result",
      result: {
        success: program.success,
        programId: program.programId,
        compilationTime: compilationTime,
      },
    });
  } catch (error) {
    self.postMessage({
      type: "compile-result",
      result: {
        success: false,
        error: normalizeError(error),
        compilationTime: performance.now() - startTime,
      },
    });
  }
}

/**
 * Run a previously compiled program
 * @param {Object} params - Run parameters
 */
async function runProgram(params) {
  if (!isInitialized || !dwsAPI) {
    throw new Error("DWScript not initialized");
  }

  const { programRef, timeout } = params;
  const startTime = performance.now();

  // Set up timeout if specified
  if (timeout && timeout > 0) {
    executionTimeoutId = setTimeout(() => {
      self.postMessage({
        type: "timeout",
        message: "Execution timed out",
      });
    }, timeout);
  }

  try {
    const result = dwsAPI.run(programRef);
    const executionTime = performance.now() - startTime;

    // Clear timeout
    if (executionTimeoutId) {
      clearTimeout(executionTimeoutId);
      executionTimeoutId = null;
    }

    self.postMessage({
      type: "result",
      result: {
        success: result.success,
        output: result.output || "",
        errors: result.error ? [normalizeError(result.error)] : [],
        warnings: result.warnings || [],
        executionTime: executionTime,
        wasmExecutionTime: result.executionTime || 0,
      },
    });
  } catch (error) {
    // Clear timeout
    if (executionTimeoutId) {
      clearTimeout(executionTimeoutId);
      executionTimeoutId = null;
    }

    self.postMessage({
      type: "result",
      result: {
        success: false,
        output: "",
        errors: [
          {
            type: "ExecutionError",
            message: error.message,
            line: 0,
            column: 0,
          },
        ],
        warnings: [],
        executionTime: performance.now() - startTime,
        wasmExecutionTime: 0,
      },
    });
  }
}

/**
 * Dispose of API resources
 */
function disposeAPI() {
  if (dwsAPI) {
    if (dwsAPI.dispose) {
      dwsAPI.dispose();
    }
    dwsAPI = null;
  }
  isInitialized = false;

  self.postMessage({
    type: "disposed",
  });
}

/**
 * Normalize error object
 * @param {Object|Error|string} error
 * @returns {Object} Normalized error
 */
function normalizeError(error) {
  if (typeof error === "string") {
    return {
      type: "Error",
      message: error,
      line: 0,
      column: 0,
    };
  }

  return {
    type: error.type || "UnknownError",
    message: error.message || String(error),
    line: error.line || 0,
    column: error.column || 0,
    source: error.source || null,
    details: error.details || null,
  };
}

// Handle unhandled errors
self.onerror = function (message, source, lineno, colno, error) {
  self.postMessage({
    type: "worker-error",
    error: {
      message: message,
      source: source,
      lineno: lineno,
      colno: colno,
      stack: error ? error.stack : null,
    },
  });
};
