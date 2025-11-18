/**
 * DWScript WASM API Wrapper
 * Provides normalized interface to go-dws WebAssembly module
 *
 * This abstraction layer provides:
 * - Consistent error handling
 * - Result normalization
 * - Program caching for performance
 * - Simplified API surface
 */

/**
 * DWScript API wrapper class
 */
export class DWScriptAPI {
  constructor() {
    this.instance = null;
    this.initialized = false;
    this.programs = new Map(); // Cache compiled programs
    this.executionTimeout = 30000; // Default 30 seconds
    this.performanceMetrics = {
      totalExecutions: 0,
      totalCompilations: 0,
      totalExecutionTime: 0,
      averageExecutionTime: 0,
      errorCount: 0,
    };
  }

  /**
   * Initialize the DWScript instance with handlers
   * @param {Object} handlers - Event handlers
   * @param {Function} handlers.onOutput - Called when program outputs text
   * @param {Function} handlers.onError - Called when errors occur
   * @param {Function} handlers.onInput - Called when input is requested
   * @returns {Promise<Object>} Version info
   */
  async init(handlers = {}) {
    if (!window.DWScript) {
      throw new Error("DWScript WASM module not loaded");
    }

    this.instance = new window.DWScript();

    await this.instance.init({
      onOutput: handlers.onOutput || console.log,
      onError: handlers.onError || console.error,
      onInput: handlers.onInput || (() => prompt("Input:")),
    });

    this.initialized = true;
    const version = this.instance.version();
    console.log(`DWScript ${version.version} initialized`);

    return version;
  }

  /**
   * Compile source code
   * @param {string} source - DWScript source code
   * @param {string} cacheKey - Optional cache key for program
   * @returns {Object} Normalized result
   */
  compile(source, cacheKey = null) {
    this.assertInitialized();

    try {
      const program = this.instance.compile(source);

      // Update metrics
      this.performanceMetrics.totalCompilations++;

      if (program.success && cacheKey) {
        this.programs.set(cacheKey, program);
      }

      return {
        success: program.success,
        programId: program.id,
      };
    } catch (error) {
      return this.normalizeError(error);
    }
  }

  /**
   * Execute source code (compile + run)
   * @param {string} source - DWScript source code
   * @param {Object} options - Execution options
   * @param {number} options.timeout - Timeout in milliseconds (optional)
   * @returns {Promise<Object>} Normalized result
   */
  async eval(source, options = {}) {
    this.assertInitialized();

    const timeout = options.timeout || this.executionTimeout;
    const startTime = performance.now();

    try {
      let result;

      if (timeout > 0) {
        // Execute with timeout
        result = await this.executeWithTimeout(
          () => this.instance.eval(source),
          timeout,
        );
      } else {
        // Execute without timeout
        result = this.instance.eval(source);
      }

      const executionTime = performance.now() - startTime;

      // Update performance metrics
      this.updateMetrics(executionTime, result.success);

      return this.normalizeResult(result);
    } catch (error) {
      const executionTime = performance.now() - startTime;
      this.updateMetrics(executionTime, false);
      return this.normalizeError(error);
    }
  }

  /**
   * Run a previously compiled program
   * @param {number|string} programRef - Program ID or cache key
   * @returns {Object} Normalized result
   */
  run(programRef) {
    this.assertInitialized();

    try {
      const program =
        typeof programRef === "string"
          ? this.programs.get(programRef)
          : { id: programRef };

      if (!program) {
        throw new Error(`Program not found: ${programRef}`);
      }

      const result = this.instance.run(program);
      return this.normalizeResult(result);
    } catch (error) {
      return this.normalizeError(error);
    }
  }

  /**
   * Normalize result format for consistency
   * @param {Object} result - Raw result from WASM
   * @returns {Object} Normalized result
   */
  normalizeResult(result) {
    return {
      success: result.success,
      output: result.output || "",
      errors: result.error ? [this.normalizeErrorObject(result.error)] : [],
      warnings: result.warnings || [],
      executionTime: result.executionTime || 0,
    };
  }

  /**
   * Normalize error format
   * @param {Error} error - Error object or string
   * @returns {Object} Normalized error result
   */
  normalizeError(error) {
    return {
      success: false,
      output: "",
      errors: [this.normalizeErrorObject(error)],
      warnings: [],
      executionTime: 0,
    };
  }

  /**
   * Normalize error object structure
   * @param {Object|Error|string} error - Error in various formats
   * @returns {Object} Normalized error object
   */
  normalizeErrorObject(error) {
    if (typeof error === "string") {
      return {
        type: "Error",
        message: error,
        line: 0,
        column: 0,
        source: null,
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

  /**
   * Assert that the API is initialized
   * @throws {Error} If not initialized
   */
  assertInitialized() {
    if (!this.initialized) {
      throw new Error("DWScript API not initialized. Call init() first.");
    }
  }

  /**
   * Clear cached programs
   * @param {string} cacheKey - Optional specific key to clear
   */
  clearCache(cacheKey = null) {
    if (cacheKey) {
      this.programs.delete(cacheKey);
    } else {
      this.programs.clear();
    }
  }

  /**
   * Get version information
   * @returns {Object} Version info
   */
  getVersion() {
    this.assertInitialized();
    return this.instance.version();
  }

  /**
   * Dispose of the instance and release resources
   */
  dispose() {
    if (this.instance) {
      this.instance.dispose();
      this.instance = null;
      this.initialized = false;
      this.programs.clear();
    }
  }

  /**
   * Check if API is ready
   * @returns {boolean}
   */
  isReady() {
    return this.initialized && this.instance !== null;
  }

  /**
   * Set execution timeout
   * @param {number} timeout - Timeout in milliseconds (0 = no timeout)
   */
  setTimeout(timeout) {
    this.executionTimeout = Math.max(0, timeout);
  }

  /**
   * Execute with timeout using Promise.race
   * @param {Function} fn - Function to execute
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Promise<any>}
   */
  async executeWithTimeout(fn, timeout) {
    return Promise.race([
      Promise.resolve(fn()),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error(`Execution timeout after ${timeout}ms`)),
          timeout,
        ),
      ),
    ]);
  }

  /**
   * Update performance metrics
   * @param {number} executionTime - Execution time in ms
   * @param {boolean} success - Whether execution was successful
   */
  updateMetrics(executionTime, success) {
    this.performanceMetrics.totalExecutions++;
    this.performanceMetrics.totalExecutionTime += executionTime;
    this.performanceMetrics.averageExecutionTime =
      this.performanceMetrics.totalExecutionTime /
      this.performanceMetrics.totalExecutions;

    if (!success) {
      this.performanceMetrics.errorCount++;
    }
  }

  /**
   * Get performance metrics
   * @returns {Object} Performance metrics
   */
  getMetrics() {
    return { ...this.performanceMetrics };
  }

  /**
   * Reset performance metrics
   */
  resetMetrics() {
    this.performanceMetrics = {
      totalExecutions: 0,
      totalCompilations: 0,
      totalExecutionTime: 0,
      averageExecutionTime: 0,
      errorCount: 0,
    };
  }
}

/**
 * Singleton instance for application-wide use
 * This can be imported and used throughout the application
 */
export const dwsAPI = new DWScriptAPI();

/**
 * Helper function to create a new isolated instance
 * @returns {DWScriptAPI}
 */
export function createDWScriptAPI() {
  return new DWScriptAPI();
}
