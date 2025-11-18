/**
 * DWScript Web Worker
 * Runs DWScript code execution in a separate thread to avoid blocking the main UI
 */

// Import the Go WASM runtime
// Note: This path may need to be adjusted based on build configuration
let go = null;
let wasmInstance = null;
let dwsInstance = null;
let initialized = false;

/**
 * Handle messages from the main thread
 */
self.onmessage = async function(e) {
  const { type, data } = e.data;

  try {
    switch (type) {
      case 'init':
        await initializeWASM(data);
        break;

      case 'execute':
        await executeCode(data);
        break;

      case 'compile':
        await compileCode(data);
        break;

      case 'dispose':
        disposeInstance();
        break;

      default:
        postError(`Unknown message type: ${type}`);
    }
  } catch (error) {
    postError(error.message, error);
  }
};

/**
 * Initialize the WASM module in the worker
 */
async function initializeWASM(config = {}) {
  try {
    // Load the Go WASM runtime script
    if (config.wasmExecURL) {
      importScripts(config.wasmExecURL);
    } else {
      importScripts('/wasm/wasm_exec.js');
    }

    // Check if Go is available
    if (typeof Go === 'undefined') {
      throw new Error('Go WASM runtime not loaded');
    }

    // Create Go instance
    go = new Go();

    // Fetch and instantiate WASM module
    const wasmURL = config.wasmURL || '/wasm/dwscript.wasm';
    const response = await fetch(wasmURL);
    if (!response.ok) {
      throw new Error(`Failed to fetch WASM module: ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();
    const result = await WebAssembly.instantiate(buffer, go.importObject);

    wasmInstance = result.instance;

    // Run the Go program
    go.run(wasmInstance);

    // Wait for API registration
    await new Promise(resolve => setTimeout(resolve, 150));

    // Verify DWScript is available
    if (typeof self.DWScript === 'undefined') {
      throw new Error('DWScript API not available after initialization');
    }

    // Create DWScript instance
    dwsInstance = new self.DWScript();

    // Initialize with handlers
    await dwsInstance.init({
      onOutput: (text) => {
        postMessage({ type: 'output', data: { text } });
      },
      onError: (error) => {
        postMessage({ type: 'error', data: { error } });
      },
      onInput: () => {
        // For workers, we can't directly prompt the user
        // We need to request input from the main thread
        postMessage({ type: 'inputRequest' });
        return ''; // Return empty for now
      }
    });

    initialized = true;

    // Notify main thread that initialization is complete
    postMessage({
      type: 'initialized',
      data: {
        version: dwsInstance.version()
      }
    });

  } catch (error) {
    postError('Initialization failed', error);
  }
}

/**
 * Execute DWScript code
 */
async function executeCode(data) {
  if (!initialized || !dwsInstance) {
    throw new Error('Worker not initialized');
  }

  const { code, timeout } = data;
  const startTime = performance.now();

  try {
    let result;

    if (timeout && timeout > 0) {
      // Execute with timeout
      result = await executeWithTimeout(
        () => dwsInstance.eval(code),
        timeout
      );
    } else {
      // Execute without timeout
      result = dwsInstance.eval(code);
    }

    const executionTime = performance.now() - startTime;

    postMessage({
      type: 'result',
      data: {
        success: result.success,
        output: result.output || '',
        errors: result.error ? [normalizeError(result.error)] : [],
        warnings: result.warnings || [],
        executionTime: result.executionTime || executionTime
      }
    });

  } catch (error) {
    const executionTime = performance.now() - startTime;

    postMessage({
      type: 'result',
      data: {
        success: false,
        output: '',
        errors: [normalizeError(error)],
        warnings: [],
        executionTime
      }
    });
  }
}

/**
 * Compile DWScript code
 */
async function compileCode(data) {
  if (!initialized || !dwsInstance) {
    throw new Error('Worker not initialized');
  }

  const { code } = data;

  try {
    const program = dwsInstance.compile(code);

    postMessage({
      type: 'compileResult',
      data: {
        success: program.success,
        programId: program.id
      }
    });

  } catch (error) {
    postMessage({
      type: 'compileResult',
      data: {
        success: false,
        error: normalizeError(error)
      }
    });
  }
}

/**
 * Execute with timeout
 */
function executeWithTimeout(fn, timeout) {
  return Promise.race([
    Promise.resolve(fn()),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Execution timeout after ${timeout}ms`)), timeout)
    )
  ]);
}

/**
 * Normalize error object
 */
function normalizeError(error) {
  if (typeof error === 'string') {
    return {
      type: 'Error',
      message: error,
      line: 0,
      column: 0,
      source: null
    };
  }

  return {
    type: error.type || 'UnknownError',
    message: error.message || String(error),
    line: error.line || 0,
    column: error.column || 0,
    source: error.source || null,
    details: error.details || null
  };
}

/**
 * Dispose of the DWScript instance
 */
function disposeInstance() {
  if (dwsInstance) {
    try {
      dwsInstance.dispose();
    } catch (error) {
      console.error('Error disposing instance:', error);
    }
    dwsInstance = null;
  }

  initialized = false;

  postMessage({ type: 'disposed' });
}

/**
 * Post error message to main thread
 */
function postError(message, error = null) {
  postMessage({
    type: 'error',
    data: {
      message,
      error: error ? normalizeError(error) : null
    }
  });
}
