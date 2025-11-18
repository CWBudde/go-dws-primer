/**
 * DWScript Worker Manager
 * Manages Web Worker lifecycle and communication for non-blocking code execution
 */

let worker = null;
let isWorkerReady = false;
let workerInitPromise = null;
let messageHandlers = new Map();
let messageIdCounter = 0;

// Configuration
const WORKER_CONFIG = {
  wasmPath: '/wasm/dwscript.wasm',
  defaultTimeout: 30000 // 30 seconds default timeout
};

/**
 * Initialize the Web Worker
 * @returns {Promise<Object>} Version information when ready
 */
export async function initWorker() {
  // Return existing promise if initialization is in progress
  if (workerInitPromise) {
    return workerInitPromise;
  }

  // Return immediately if already initialized
  if (isWorkerReady && worker) {
    return Promise.resolve({ status: 'already-ready' });
  }

  workerInitPromise = new Promise((resolve, reject) => {
    try {
      // Create worker
      worker = new Worker(
        new URL('./dwscript-worker.js', import.meta.url),
        { type: 'module' }
      );

      // Set up message handler
      worker.onmessage = handleWorkerMessage;

      // Set up error handler
      worker.onerror = (error) => {
        console.error('Worker error:', error);
        reject(new Error(`Worker error: ${error.message}`));
      };

      // Set up one-time ready handler
      const readyHandler = (event) => {
        if (event.data.type === 'ready') {
          isWorkerReady = true;
          resolve(event.data.version);
        } else if (event.data.type === 'init-error') {
          reject(new Error(event.data.error.message));
        }
      };

      // Temporarily add ready handler
      const originalHandler = worker.onmessage;
      worker.onmessage = (event) => {
        readyHandler(event);
        originalHandler(event);
      };

      // Initialize worker
      worker.postMessage({
        type: 'init',
        data: WORKER_CONFIG
      });

    } catch (error) {
      reject(error);
    }
  });

  return workerInitPromise;
}

/**
 * Execute code in the worker
 * @param {string} code - DWScript code to execute
 * @param {Object} options - Execution options
 * @returns {Promise<Object>} Execution result
 */
export async function executeInWorker(code, options = {}) {
  if (!isWorkerReady) {
    await initWorker();
  }

  return new Promise((resolve, reject) => {
    const messageId = messageIdCounter++;
    let outputBuffer = '';

    // Create handler for this execution
    const handler = {
      onOutput: options.onOutput || null,
      onError: options.onError || null,
      resolve,
      reject
    };

    messageHandlers.set(messageId, handler);

    // Set up result handler
    const resultHandler = (event) => {
      const { type, result, output, error } = event.data;

      if (type === 'output' && handler.onOutput) {
        handler.onOutput(output);
        outputBuffer += output;
      } else if (type === 'runtime-error' && handler.onError) {
        handler.onError(error);
      } else if (type === 'result') {
        messageHandlers.delete(messageId);
        resolve({
          ...result,
          output: outputBuffer || result.output
        });
      } else if (type === 'timeout') {
        messageHandlers.delete(messageId);
        reject(new Error('Execution timeout'));
      } else if (type === 'error') {
        messageHandlers.delete(messageId);
        reject(new Error(error.message || error));
      }
    };

    // Store original handler and set up temporary one
    const originalOnMessage = worker.onmessage;
    worker.onmessage = (event) => {
      resultHandler(event);
      if (originalOnMessage) {
        originalOnMessage(event);
      }
    };

    // Send execution request
    worker.postMessage({
      type: 'execute',
      data: {
        code,
        timeout: options.timeout || WORKER_CONFIG.defaultTimeout
      },
      messageId
    });
  });
}

/**
 * Compile code in the worker
 * @param {string} code - DWScript code to compile
 * @param {string} cacheKey - Optional cache key
 * @returns {Promise<Object>} Compilation result
 */
export async function compileInWorker(code, cacheKey = null) {
  if (!isWorkerReady) {
    await initWorker();
  }

  return new Promise((resolve, reject) => {
    const messageId = messageIdCounter++;

    const handler = {
      resolve,
      reject
    };

    messageHandlers.set(messageId, handler);

    // Set up result handler
    const resultHandler = (event) => {
      const { type, result, error } = event.data;

      if (type === 'compile-result') {
        messageHandlers.delete(messageId);
        resolve(result);
      } else if (type === 'error') {
        messageHandlers.delete(messageId);
        reject(new Error(error.message || error));
      }
    };

    // Store original handler and set up temporary one
    const originalOnMessage = worker.onmessage;
    worker.onmessage = (event) => {
      resultHandler(event);
      if (originalOnMessage) {
        originalOnMessage(event);
      }
    };

    // Send compilation request
    worker.postMessage({
      type: 'compile',
      data: { code, cacheKey },
      messageId
    });
  });
}

/**
 * Stop the current execution by terminating and recreating the worker
 * This is the only reliable way to stop execution in a worker
 */
export async function stopWorkerExecution() {
  if (!worker) {
    return;
  }

  // Terminate the worker
  worker.terminate();
  worker = null;
  isWorkerReady = false;
  workerInitPromise = null;

  // Reject all pending handlers
  for (const [id, handler] of messageHandlers.entries()) {
    handler.reject(new Error('Execution stopped by user'));
  }
  messageHandlers.clear();

  // Reinitialize the worker for next execution
  try {
    await initWorker();
  } catch (error) {
    console.error('Failed to reinitialize worker:', error);
  }
}

/**
 * Handle messages from the worker
 * @param {MessageEvent} event
 */
function handleWorkerMessage(event) {
  const { type, messageId } = event.data;

  // Handle messages with specific IDs
  if (messageId !== undefined && messageHandlers.has(messageId)) {
    const handler = messageHandlers.get(messageId);

    switch (type) {
      case 'output':
        if (handler.onOutput) {
          handler.onOutput(event.data.output);
        }
        break;

      case 'runtime-error':
        if (handler.onError) {
          handler.onError(event.data.error);
        }
        break;

      case 'result':
      case 'compile-result':
        handler.resolve(event.data.result);
        messageHandlers.delete(messageId);
        break;

      case 'error':
      case 'timeout':
        handler.reject(new Error(event.data.error?.message || event.data.message));
        messageHandlers.delete(messageId);
        break;
    }
  }

  // Handle global messages
  switch (type) {
    case 'ready':
      console.log('Worker ready:', event.data.version);
      break;

    case 'worker-error':
      console.error('Worker internal error:', event.data.error);
      break;
  }
}

/**
 * Check if worker is ready
 * @returns {boolean}
 */
export function isWorkerInitialized() {
  return isWorkerReady;
}

/**
 * Dispose of the worker
 */
export function disposeWorker() {
  if (worker) {
    worker.postMessage({ type: 'dispose' });
    worker.terminate();
    worker = null;
    isWorkerReady = false;
    workerInitPromise = null;
    messageHandlers.clear();
  }
}

/**
 * Get worker configuration
 * @returns {Object}
 */
export function getWorkerConfig() {
  return { ...WORKER_CONFIG };
}

/**
 * Update worker configuration
 * @param {Object} config - Configuration updates
 */
export function updateWorkerConfig(config) {
  Object.assign(WORKER_CONFIG, config);
}
