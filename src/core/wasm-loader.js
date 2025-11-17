/**
 * WebAssembly Loader for DWScript Runtime
 * Handles loading and initializing the Go-compiled WASM module
 */

let wasmInstance = null;
let wasmReady = false;
let wasmError = null;

/**
 * Initialize the WebAssembly module
 * @returns {Promise<boolean>} True if initialization was successful
 */
export async function initWASM() {
  try {
    // Check if Go WASM support is available
    if (!window.Go) {
      throw new Error('Go WASM runtime (wasm_exec.js) not loaded');
    }

    // Create a new Go instance
    const go = new window.Go();

    // Fetch and instantiate the WASM module
    const response = await fetch('/wasm/dwscript.wasm');
    if (!response.ok) {
      throw new Error(`Failed to fetch WASM module: ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();
    const result = await WebAssembly.instantiate(buffer, go.importObject);

    wasmInstance = result.instance;

    // Run the Go program (this is async but doesn't wait for full initialization)
    go.run(wasmInstance);

    // IMPORTANT: Wait for API registration (~100ms)
    // The go.run() call above is async but doesn't wait for full init
    await new Promise(resolve => setTimeout(resolve, 100));

    // Verify global export exists
    if (!window.DWScript) {
      throw new Error('DWScript API not available after initialization');
    }

    wasmReady = true;
    console.log('DWScript WASM runtime initialized successfully');

    return true;
  } catch (error) {
    console.error('Failed to initialize WASM:', error);
    wasmError = error;
    wasmReady = false;
    return false;
  }
}

/**
 * Check if WASM is ready
 * @returns {boolean}
 */
export function isWASMReady() {
  return wasmReady;
}

/**
 * Get any WASM initialization error
 * @returns {Error|null}
 */
export function getWASMError() {
  return wasmError;
}

/**
 * Execute DWScript code
 * This function will call the Go-exported function once WASM is ready
 * @param {string} code - The DWScript code to execute
 * @returns {Promise<Object>} Result object with output, errors, etc.
 */
export async function executeDWScript(code) {
  if (!wasmReady) {
    throw new Error('WASM runtime not initialized');
  }

  try {
    // Check if the global execute function is available
    // This should be exported from the Go WASM module
    if (typeof window.executeDWScript === 'function') {
      const result = await window.executeDWScript(code);
      return result;
    } else {
      // Fallback: simulate execution for development
      console.warn('WASM execute function not available, using mock execution');
      return mockExecution(code);
    }
  } catch (error) {
    console.error('Execution error:', error);
    return {
      success: false,
      output: '',
      errors: [{ line: 0, column: 0, message: error.message }],
      executionTime: 0
    };
  }
}

/**
 * Mock execution for development/testing when WASM is not available
 * @param {string} code
 * @returns {Object}
 */
function mockExecution(code) {
  // Simple mock that just returns a success message
  return {
    success: true,
    output: 'Mock execution: WASM module not yet integrated.\nYour code would run here.',
    errors: [],
    executionTime: 0,
    warnings: ['This is a mock execution. The actual DWScript WASM runtime is not yet connected.']
  };
}

/**
 * Get WASM module information
 * @returns {Object}
 */
export function getWASMInfo() {
  return {
    ready: wasmReady,
    error: wasmError,
    instance: wasmInstance
  };
}
