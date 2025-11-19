# DWScript WASM Setup Guide

This document explains how to build and set up the DWScript WebAssembly runtime for local development.

## Quick Setup

The WASM files (`dwscript.wasm` and `wasm_exec.js`) are **not committed to git** because they are large build artifacts (~14MB). You need to build them locally.

### Prerequisites

- **Go 1.21+** with WebAssembly support
- **Git** for cloning repositories
- **Optional**: `wasm-opt` from binaryen for optimization (not currently working with Go WASM)

### Build Steps

> **Directory Structure Note**: These instructions assume you clone `go-dws` and `go-dws-primer` as sibling directories (both in the same parent folder). If you prefer a different structure, adjust the paths in step 3 accordingly.

1. **Clone the go-dws repository** (if not already done):
   ```bash
   cd ~/projects  # or your preferred location
   git clone https://github.com/CWBudde/go-dws.git
   ```

2. **Build the WASM module**:
   ```bash
   cd go-dws
   ./build/wasm/build.sh monolithic
   ```

   This will create:
   - `build/wasm/dist/dwscript.wasm` (~14MB)
   - `build/wasm/dist/wasm_exec.js` (~17KB)

3. **Copy files to go-dws-primer**:

   If using sibling directories (recommended):
   ```bash
   cp build/wasm/dist/dwscript.wasm ../go-dws-primer/wasm/
   cp build/wasm/dist/wasm_exec.js ../go-dws-primer/wasm/
   ```

   If using a different directory structure, adjust the destination path:
   ```bash
   # Example for custom location:
   cp build/wasm/dist/dwscript.wasm /path/to/your/go-dws-primer/wasm/
   cp build/wasm/dist/wasm_exec.js /path/to/your/go-dws-primer/wasm/
   ```

4. **Restart the development server** (if running):
   ```bash
   cd ../go-dws-primer
   yarn dev
   ```

5. **Hard refresh your browser** to clear cache:
   - **Chrome/Edge**: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
   - **Firefox**: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
   - **Safari**: Cmd+Option+R

## Verification

After setup, you should see:

1. **On page load**: No warning message about "WASM runtime could not be loaded"
2. **In browser console**: `"DWScript WASM module initialized"` and `"DWScript <version> initialized"`
3. **When running code**: Actual DWScript execution instead of mock output

## Troubleshooting

### "WASM runtime not ready" error

**Cause**: WASM files are missing or not loaded.

**Solution**:
1. Verify files exist: `ls -lh wasm/` should show `dwscript.wasm` (~14MB) and `wasm_exec.js` (~17KB)
2. Hard refresh browser (Ctrl+Shift+R)
3. Check browser console for errors

### WASM files not found

**Cause**: Files weren't built or copied.

**Solution**: Follow the build steps above.

### Page crashes or hangs

**Cause**: Large WASM file (14MB) may cause issues in some browsers.

**Solution**:
- Ensure you have enough memory
- Try a different browser (Chrome recommended)
- Close other tabs to free memory

### Build fails with "just: command not found"

**Cause**: The `just` command runner is not installed.

**Solution**: Use the build script directly:
```bash
./build/wasm/build.sh monolithic
```

## File Locations

Assuming sibling directory structure (e.g., `~/projects/go-dws` and `~/projects/go-dws-primer`):

- **WASM source**: `<workspace>/go-dws` (wherever you cloned it)
- **WASM build output**: `<workspace>/go-dws/build/wasm/dist/`
- **go-dws-primer wasm directory**: `<workspace>/go-dws-primer/wasm/`

Replace `<workspace>` with your actual parent directory (e.g., `~/projects`, `~/dev`, `/opt/projects`, etc.).

## Why are WASM files gitignored?

The WASM files are ~14MB, which is too large to commit to git efficiently. Additionally:

1. They're binary build artifacts that can be regenerated
2. They change with every build
3. Different developers may need different build configurations
4. It keeps the repository lightweight

## CI/CD Note

For production deployment, the WASM files should be built as part of the CI/CD pipeline and included in the deployment artifacts.
