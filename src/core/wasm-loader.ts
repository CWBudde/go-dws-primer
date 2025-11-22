/**
 * WebAssembly Loader for DWScript Runtime
 * Handles loading and initializing the Go-compiled WASM module
 */

import { dwsAPI } from "./dwscript-api.ts";

let wasmInstance = null;
let wasmReady = false;
let wasmError = null;
let dwsAPIInstance = null;

/**
 * Dynamically load the Go WASM runtime (wasm_exec.js)
 * @returns {Promise<boolean>} True if loaded successfully
 */
async function loadGoWASMRuntime() {
  if ((window as any).Go) {
    return true; // Already loaded
  }

  try {
    // Check if wasm_exec.js exists
    const checkResponse = await fetch("/wasm/wasm_exec.js", { method: "HEAD" });
    if (!checkResponse.ok) {
      return false; // File doesn't exist, gracefully continue in mock mode
    }

    // Load the script dynamically
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "/wasm/wasm_exec.js";
      script.onload = () => {
        const goRuntime = (window as any).Go;
        if (goRuntime) {
          resolve(true);
        } else {
          reject(new Error("wasm_exec.js loaded but Go is not defined"));
        }
      };
      script.onerror = () => reject(new Error("Failed to load wasm_exec.js"));
      document.head.appendChild(script);
    });
  } catch (error) {
    console.log("Go WASM runtime not available:", error.message);
    return false;
  }
}

/**
 * Initialize the WebAssembly module
 * @param {Object} handlers - Event handlers for output, errors, etc.
 * @returns {Promise<boolean>} True if initialization was successful
 */
export async function initWASM(handlers = {}) {
  try {
    // Try to load the Go WASM runtime
    const goLoaded = await loadGoWASMRuntime();
    if (!goLoaded) {
      // Gracefully handle missing WASM files (expected for development)
      console.log(
        "WASM files not available. Running in mock mode for development.",
      );
      wasmError = new Error(
        "WASM files not found. Build and copy dwscript.wasm and wasm_exec.js to /wasm directory.",
      );
      return false;
    }

    // Create a new Go instance
    const go = new (window as any).Go();

    // Fetch and instantiate the WASM module
    const response = await fetch("/wasm/dwscript.wasm");
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
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Verify global export exists
    if (!(window as any).DWScript) {
      throw new Error("DWScript API not available after initialization");
    }

    // Initialize the DWScript API wrapper
    await dwsAPI.init(handlers);
    dwsAPIInstance = dwsAPI;

    wasmReady = true;
    console.log("DWScript WASM runtime initialized successfully");

    return true;
  } catch (error) {
    console.error("Failed to initialize WASM:", error);
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
 * @param {Object} options - Execution options
 * @returns {Promise<Object>} Result object with output, errors, etc.
 */
export async function executeDWScript(code, options = {}) {
  if (!wasmReady) {
    throw new Error("WASM runtime not initialized");
  }

  try {
    // Use the DWScript API wrapper if available
    if (dwsAPIInstance && dwsAPIInstance.isReady()) {
      const result = await dwsAPIInstance.eval(code, options);
      return result;
    } else if (typeof (window as any).executeDWScript === "function") {
      // Direct call to WASM function
      const result = await (window as any).executeDWScript(code);
      return result;
    } else {
      // Fallback: simulate execution for development
      console.warn("WASM execute function not available, using mock execution");
      return mockExecution(code);
    }
  } catch (error) {
    console.error("Execution error:", error);
    return {
      success: false,
      output: "",
      errors: [{ line: 0, column: 0, message: error.message }],
      executionTime: 0,
    };
  }
}

/**
 * Mock execution for development/testing when WASM is not available
 * @param {string} _code
 * @returns {Object}
 */
function mockExecution(_code) {
  // Simple mock that just returns a success message
  return {
    success: true,
    output:
      "Mock execution: WASM module not yet integrated.\nYour code would run here.",
    errors: [],
    executionTime: 0,
    warnings: [
      "This is a mock execution. The actual DWScript WASM runtime is not yet connected.",
    ],
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
    instance: wasmInstance,
    api: dwsAPIInstance,
  };
}

/**
 * Get the DWScript API instance
 * @returns {DWScriptAPI}
 */
export function getDWScriptAPI() {
  return dwsAPIInstance;
}
