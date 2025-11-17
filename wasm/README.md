# WebAssembly Module

This directory should contain the compiled DWScript WebAssembly module.

## Required Files

- `dwscript.wasm` - The compiled WebAssembly module
- `wasm_exec.js` - Go WebAssembly runtime

## Building the WASM Module

To build these files:

1. Clone the go-dws repository:
   ```bash
   git clone https://github.com/cwbudde/go-dws.git
   cd go-dws
   ```

2. Build the WASM module:
   ```bash
   just wasm
   ```

3. Copy the files to this directory:
   ```bash
   cp build/wasm/dist/dwscript.wasm ../go-dws-primer/wasm/
   cp build/wasm/wasm_exec.js ../go-dws-primer/wasm/
   ```

## Development Mode

Without these files, the application will run in "mock mode" where code execution is simulated. This is useful for UI development but doesn't provide actual DWScript execution.
