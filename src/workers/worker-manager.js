/**
 * Web Worker Manager
 * Manages communication with the DWScript Web Worker
 */

let worker = null;
let workerReady = false;
let messageHandlers = new Map();
let messageIdCounter = 0;

/**
 * Initialize the Web Worker
 * @param {Object} config - Configuration options
 * @returns {Promise<boolean>} True if initialization was successful
 */
export async function initWorker(config = {}) {
  return new Promise((resolve, reject) => {
    try {
      // Create the worker
      worker = new Worker(
        new URL('./dwscript-worker.js', import.meta.url),
        { type: 'module' }
      );

      // Set up message handler
      worker.onmessage = handleWorkerMessage;

      // Set up error handler
      worker.onerror = (error) => {
        console.error('Worker error:', error);
        workerReady = false;
        reject(error);
      };

      // Listen for initialization complete
      const initHandler = (message) => {
        if (message.type === 'initialized') {
          workerReady = true;
          console.log('Worker initialized:', message.data);
          resolve(true);
        } else if (message.type === 'error') {
          workerReady = false;
          reject(new Error(message.data.message));
        }
      };

      // Temporarily add init handler
      const tempId = addMessageHandler(initHandler);

      // Initialize the worker
      worker.postMessage({
        type: 'init',
        data: {
          wasmExecURL: config.wasmExecURL || '/wasm/wasm_exec.js',
          wasmURL: config.wasmURL || '/wasm/dwscript.wasm'
        }
      });

      // Timeout after 10 seconds
      setTimeout(() => {
        if (!workerReady) {
          removeMessageHandler(tempId);
          terminateWorker();
          reject(new Error('Worker initialization timeout'));
        }
      }, 10000);

    } catch (error) {
      console.error('Failed to create worker:', error);
      reject(error);
    }
  });
}

/**
 * Execute code in the worker
 * @param {string} code - DWScript code to execute
 * @param {Object} options - Execution options
 * @returns {Promise<Object>} Execution result
 */
export async function executeInWorker(code, options = {}) {
  if (!workerReady) {
    throw new Error('Worker not initialized');
  }

  return new Promise((resolve, reject) => {
    const messageId = messageIdCounter++;
    let outputCallback = options.onOutput;
    let errorCallback = options.onError;

    // Create handler for this execution
    const handler = (message) => {
      switch (message.type) {
        case 'output':
          if (outputCallback) {
            outputCallback(message.data.text);
          }
          break;

        case 'error':
          if (errorCallback) {
            errorCallback(message.data.error);
          }
          break;

        case 'result':
          removeMessageHandler(messageId);
          resolve(message.data);
          break;

        case 'inputRequest':
          // Handle input request - could be extended to show a modal
          const input = options.onInput ? options.onInput() : '';
          worker.postMessage({
            type: 'inputResponse',
            data: { input }
          });
          break;
      }
    };

    addMessageHandler(handler, messageId);

    // Send execution request to worker
    worker.postMessage({
      type: 'execute',
      data: {
        code,
        timeout: options.timeout || 0,
        messageId
      }
    });

    // Set timeout for the promise
    if (options.timeout && options.timeout > 0) {
      setTimeout(() => {
        removeMessageHandler(messageId);
        reject(new Error(`Worker execution timeout after ${options.timeout}ms`));
      }, options.timeout + 1000); // Add buffer to worker timeout
    }
  });
}

/**
 * Compile code in the worker
 * @param {string} code - DWScript code to compile
 * @returns {Promise<Object>} Compilation result
 */
export async function compileInWorker(code) {
  if (!workerReady) {
    throw new Error('Worker not initialized');
  }

  return new Promise((resolve, reject) => {
    const messageId = messageIdCounter++;

    const handler = (message) => {
      if (message.type === 'compileResult') {
        removeMessageHandler(messageId);
        resolve(message.data);
      }
    };

    addMessageHandler(handler, messageId);

    worker.postMessage({
      type: 'compile',
      data: { code, messageId }
    });

    // Timeout after 5 seconds
    setTimeout(() => {
      removeMessageHandler(messageId);
      reject(new Error('Compilation timeout'));
    }, 5000);
  });
}

/**
 * Check if worker is ready
 * @returns {boolean}
 */
export function isWorkerReady() {
  return workerReady;
}

/**
 * Terminate the worker
 */
export function terminateWorker() {
  if (worker) {
    // Notify worker to dispose
    try {
      worker.postMessage({ type: 'dispose' });
    } catch (error) {
      console.error('Error sending dispose message:', error);
    }

    // Terminate after a short delay
    setTimeout(() => {
      if (worker) {
        worker.terminate();
        worker = null;
      }
    }, 100);

    workerReady = false;
    messageHandlers.clear();
  }
}

/**
 * Handle messages from the worker
 */
function handleWorkerMessage(event) {
  const message = event.data;

  // Call all registered handlers
  messageHandlers.forEach((handler) => {
    try {
      handler(message);
    } catch (error) {
      console.error('Error in message handler:', error);
    }
  });
}

/**
 * Add a message handler
 * @param {Function} handler - Handler function
 * @param {number} id - Optional handler ID
 * @returns {number} Handler ID
 */
function addMessageHandler(handler, id = null) {
  const handlerId = id !== null ? id : messageIdCounter++;
  messageHandlers.set(handlerId, handler);
  return handlerId;
}

/**
 * Remove a message handler
 * @param {number} id - Handler ID
 */
function removeMessageHandler(id) {
  messageHandlers.delete(id);
}

/**
 * Get worker status
 * @returns {Object} Worker status
 */
export function getWorkerStatus() {
  return {
    ready: workerReady,
    active: worker !== null,
    handlersCount: messageHandlers.size
  };
}
