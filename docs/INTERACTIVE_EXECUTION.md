# Interactive Execution Features

This document describes the interactive execution features implemented in Phase 2.3 of the DWScript Primer development plan.

## Overview

The interactive execution system provides comprehensive code execution capabilities with performance monitoring, timeout management, and optional non-blocking execution via Web Workers.

## Features

### 1. Performance Metrics Display

The executor tracks and displays detailed performance metrics for all code executions:

#### Tracked Metrics

- **Execution Time**: Current, average, and peak execution times
- **Execution Count**: Total executions, successful, and failed
- **Timeout Count**: Number of executions that timed out
- **Memory Usage**: JavaScript heap and WASM memory (when available)

#### API

```javascript
import { getExecutionMetrics, resetExecutionMetrics } from './core/executor.js';

// Get current metrics
const metrics = getExecutionMetrics();
console.log(`Average execution time: ${metrics.averageExecutionTime}ms`);
console.log(`Success rate: ${metrics.successfulExecutions / metrics.totalExecutions * 100}%`);

// Reset metrics
resetExecutionMetrics();
```

#### UI Display

Metrics are displayed in the status bar:
- Execution time: `⏱️ 45.23ms`
- Memory usage: `💾 12.5 MB / WASM: 3.2 MB` (Chrome only)
- Status message: `Completed in 45.23ms (avg: 52.18ms, runs: 15)`

### 2. Web Worker Execution (Non-Blocking)

Code can be executed in a Web Worker to prevent UI freezing during long-running computations.

#### Features

- **Non-blocking**: UI remains responsive during execution
- **Real-time output**: Streaming output via message passing
- **Cancellation**: Worker can be terminated to stop execution
- **Automatic reinitialize**: Worker is recreated after termination

#### Usage

```javascript
import { setWorkerExecutionMode, executeCode } from './core/executor.js';

// Enable worker execution mode
setWorkerExecutionMode(true);

// Execute code in worker
await executeCode(code);

// Or execute with override
await executeCode(code, { useWorker: true });

// Stop execution (terminates worker)
await stopExecution();
```

#### Architecture

```
Main Thread                    Worker Thread
├─ UI Updates                  ├─ WASM Module
├─ Editor                      ├─ DWScript Runtime
├─ Output Display              └─ Code Execution
└─ Worker Manager ←────────────→ Message Passing
```

#### Worker Files

- `src/workers/dwscript-worker.js`: Worker implementation
- `src/workers/worker-manager.js`: Main thread worker management

### 3. Execution Timeout Mechanism

Prevents infinite loops and runaway code execution.

#### Configuration

```javascript
import { configureTimeout, getExecutionConfig } from './core/executor.js';

// Configure timeout
configureTimeout({
  defaultTimeout: 30000,      // 30 seconds default
  enableTimeout: true,         // Enable/disable timeout
  maxExecutionTime: 120000     // 2 minutes maximum
});

// Get current configuration
const config = getExecutionConfig();
```

#### Execution with Custom Timeout

```javascript
// Execute with 10 second timeout
await executeCode(code, { timeout: 10000 });

// Execute without timeout
await executeCode(code, { timeout: 0 });
```

#### Timeout Behavior

When execution times out:
1. Execution is stopped (worker terminated if using workers)
2. Error message displayed: "Execution timed out after Xms"
3. Timeout counter incremented in metrics
4. Status updated to show timeout

### 4. Step Execution & Debugging (Placeholder)

A framework for future debugging capabilities has been created.

#### Current Status

- **Framework implemented**: `src/core/debugger.js`
- **Not yet functional**: Requires go-dws debugging API support
- **Future implementation**: See research notes in debugger.js

#### Planned Features

```javascript
import {
  initDebugger,
  setBreakpoint,
  stepExecute,
  getVariables,
  evaluateExpression
} from './core/debugger.js';

// Initialize debugger (placeholder)
initDebugger();

// Set breakpoint
setBreakpoint(10); // Line 10

// Step execution (not yet implemented)
await stepExecute(code, 'into'); // 'into', 'over', or 'out'

// Get variables (not yet implemented)
const vars = getVariables();

// Evaluate expression (not yet implemented)
const result = await evaluateExpression('myVariable + 10');
```

#### Implementation Options

Three possible approaches for future implementation:

1. **Native API** (ideal): Requires go-dws to expose debugging hooks
2. **Code Injection**: Transform code to inject breakpoint callbacks
3. **AST-based**: Parse and control execution via Abstract Syntax Tree

See `src/core/debugger.js` for detailed research notes.

### 5. Memory Usage Display

Monitors and displays JavaScript heap and WASM memory usage.

#### Availability

- **JavaScript Heap**: Chrome/Chromium only (via `performance.memory`)
- **WASM Memory**: Available if Go WASM instance exports memory
- **Other Browsers**: Memory display hidden if not available

#### API

```javascript
import { getMemoryUsage, formatMemorySize } from './core/executor.js';

// Get current memory usage
const memory = getMemoryUsage();
console.log(`JS Heap: ${formatMemorySize(memory.jsHeapSize)}`);
console.log(`WASM Memory: ${formatMemorySize(memory.wasmMemory)}`);
console.log(`WASM Pages: ${memory.wasmMemoryPages}`);

// Check if memory info is available
if (memory.available) {
  console.log('Memory monitoring available');
}
```

#### UI Display

Memory usage is shown in the status bar (when available):
```
💾 12.5 MB / WASM: 3.2 MB
```

## Events

The execution system dispatches custom events for integration:

### metricsUpdate

Dispatched after each execution with updated metrics.

```javascript
window.addEventListener('metricsUpdate', (event) => {
  const { metrics } = event.detail;
  console.log(`Total executions: ${metrics.totalExecutions}`);
  updateDashboard(metrics);
});
```

### metricsReset

Dispatched when metrics are reset.

```javascript
window.addEventListener('metricsReset', () => {
  console.log('Metrics have been reset');
  clearDashboard();
});
```

### executionstate

Dispatched when execution state changes.

```javascript
window.addEventListener('executionstate', (event) => {
  const { executing } = event.detail;
  updateRunButton(executing);
});
```

### debugger

Dispatched for debugger events (placeholder).

```javascript
window.addEventListener('debugger', (event) => {
  const { type, line } = event.detail;
  if (type === 'breakpoint-set') {
    highlightBreakpoint(line);
  }
});
```

## Configuration

### Default Settings

```javascript
// Execution configuration
{
  defaultTimeout: 30000,        // 30 seconds
  enableTimeout: true,          // Timeout enabled
  maxExecutionTime: 120000      // 2 minute max
}

// Worker execution
useWorkerExecution: false       // Disabled by default
```

### Changing Settings

Settings can be modified programmatically or via UI (settings panel integration needed):

```javascript
import {
  configureTimeout,
  setWorkerExecutionMode
} from './core/executor.js';

// Enable worker execution
setWorkerExecutionMode(true);

// Increase timeout
configureTimeout({
  defaultTimeout: 60000,  // 1 minute
  enableTimeout: true
});
```

## Performance Considerations

### Worker Overhead

- **Initialization**: ~100-200ms to initialize WASM in worker
- **Message Passing**: Minimal overhead for output streaming
- **Termination**: ~50ms to terminate and recreate worker

### When to Use Workers

**Use workers for:**
- Long-running computations
- Code that may hang or run indefinitely
- When UI responsiveness is critical

**Don't use workers for:**
- Quick executions (< 100ms)
- Code with frequent output (overhead from message passing)
- Turtle graphics (requires main thread canvas access)

### Memory Monitoring Impact

Memory monitoring via `performance.memory` has minimal overhead but:
- Only available in Chrome/Chromium
- Updates every 100ms during execution
- May not reflect actual WASM memory (Go manages its own heap)

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Basic Execution | ✓ | ✓ | ✓ | ✓ |
| Web Workers | ✓ | ✓ | ✓ | ✓ |
| Timeout | ✓ | ✓ | ✓ | ✓ |
| JS Memory | ✓ | ✗ | ✗ | ✓ |
| WASM Memory | ✓ | ✓* | ✓* | ✓ |

*Depends on Go WASM implementation

## Testing

### Manual Testing

1. **Performance Metrics**
   - Run code multiple times
   - Check status bar for metrics
   - Verify average calculation
   - Test metric reset

2. **Worker Execution**
   - Enable worker mode
   - Run long-running code
   - Verify UI stays responsive
   - Test stop button (worker termination)

3. **Timeout**
   - Create infinite loop: `while True do;`
   - Verify timeout triggers
   - Check timeout error message
   - Verify timeout counter increments

4. **Memory Display**
   - Open in Chrome
   - Run code and check memory display
   - Verify memory updates during execution
   - Test in Firefox (should hide if unavailable)

### Automated Testing

```javascript
// Example test suite
describe('Interactive Execution', () => {
  it('should track execution metrics', async () => {
    await executeCode('PrintLn("test");');
    const metrics = getExecutionMetrics();
    expect(metrics.totalExecutions).toBe(1);
    expect(metrics.successfulExecutions).toBe(1);
  });

  it('should timeout long-running code', async () => {
    const result = await executeCode('while True do;', { timeout: 1000 });
    expect(result.success).toBe(false);
    expect(result.errors[0].type).toBe('TimeoutError');
  });

  it('should execute in worker', async () => {
    setWorkerExecutionMode(true);
    const result = await executeCode('PrintLn("test");');
    expect(result.success).toBe(true);
  });
});
```

## Future Enhancements

### Short Term (Phase 3-4)

1. **Settings UI**: Add UI controls for timeout and worker mode
2. **Metrics Dashboard**: Visual display of execution statistics
3. **Memory Profiling**: Track memory over time, detect leaks
4. **Performance Graphs**: Visualize execution time trends

### Long Term (Phase 6+)

1. **Full Debugger**: Implement when go-dws adds debugging API
2. **Profiler**: Line-by-line execution time profiling
3. **Resource Limits**: CPU and memory quotas
4. **Execution History**: Record and replay executions
5. **Collaborative Debugging**: Share debugging sessions

## Troubleshooting

### Worker initialization fails

**Problem**: Worker fails to initialize WASM module

**Solutions**:
- Check WASM file path is correct (`/wasm/dwscript.wasm`)
- Verify `wasm_exec.js` is accessible
- Check browser console for errors
- Ensure proper CORS headers if serving from CDN

### Memory display not showing

**Problem**: Memory usage indicator is empty

**Solutions**:
- Only works in Chrome/Chromium browsers
- Check `performance.memory` is available
- WASM memory requires Go instance to be initialized
- Normal behavior in Firefox/Safari (feature not available)

### Timeout not working

**Problem**: Code runs longer than timeout setting

**Solutions**:
- Verify timeout is enabled: `configureTimeout({ enableTimeout: true })`
- Check timeout value is reasonable (> 0)
- Worker execution has more reliable timeout
- Direct execution timeout uses Promise.race (may not stop WASM)

### Metrics not updating

**Problem**: Execution metrics don't update in UI

**Solutions**:
- Check `metricsUpdate` event listener is registered
- Verify status bar elements exist in DOM
- Check for JavaScript errors in console
- Try calling `updateMetrics()` manually

## References

- [PLAN.md](../PLAN.md) - Phase 2.3 details
- [CLAUDE.md](../CLAUDE.md) - Architecture overview
- [src/core/executor.js](../src/core/executor.js) - Main execution logic
- [src/workers/dwscript-worker.js](../src/workers/dwscript-worker.js) - Worker implementation
- [src/core/debugger.js](../src/core/debugger.js) - Debugger framework

## Changelog

### 2025-11-18 - Phase 2.3 Implementation

- ✓ Added performance metrics tracking and display
- ✓ Implemented Web Worker for non-blocking execution
- ✓ Added execution timeout mechanism
- ✓ Created debugger framework (placeholder)
- ✓ Implemented memory usage monitoring and display
- ✓ Added comprehensive documentation
