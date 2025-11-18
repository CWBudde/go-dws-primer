# go-dws-primer Justfile
# Development automation for DWScript Primer educational environment

# Display available recipes
default:
    @just --list

# ============================================================================
# Development
# ============================================================================

# Install dependencies
install:
    npm install

# Start development server (http://localhost:3000)
dev:
    npm run dev

# Build for production
build:
    npm run build

# Preview production build
preview: build
    npm run preview

# Clean build artifacts
clean:
    rm -rf dist node_modules/.vite

# Clean everything including node_modules
clean-all:
    rm -rf dist node_modules

# Reinstall dependencies
reinstall: clean-all install

# ============================================================================
# Code Quality
# ============================================================================

# Run linter
lint:
    npm run lint

# Fix linter issues automatically
lint-fix:
    npm run lint -- --fix

# Format code with Prettier
format:
    npm run format

# Check code formatting without making changes
format-check:
    npx prettier --check "src/**/*.{js,jsx,ts,tsx,css,md}"

# Run all quality checks (lint + format-check)
check: lint format-check

# Fix all quality issues (lint-fix + format)
fix: lint-fix format

# ============================================================================
# Testing
# ============================================================================

# Run unit tests
test:
    npm run test

# Run unit tests in watch mode
test-watch:
    npm run test -- --watch

# Run unit tests with coverage
test-coverage:
    npm run test -- --coverage

# Run end-to-end tests
test-e2e:
    npm run test:e2e

# Run E2E tests in headed mode (visible browser)
test-e2e-headed:
    npm run test:e2e -- --headed

# Run E2E tests in debug mode
test-e2e-debug:
    npm run test:e2e -- --debug

# Run all tests (unit + e2e)
test-all: test test-e2e

# ============================================================================
# WASM Management
# ============================================================================

# Check if WASM files exist
wasm-check:
    @echo "Checking for WASM files..."
    @if [ -f wasm/dwscript.wasm ]; then \
        echo "✓ dwscript.wasm found ($(du -h wasm/dwscript.wasm | cut -f1))"; \
    else \
        echo "✗ dwscript.wasm not found"; \
    fi
    @if [ -f wasm/wasm_exec.js ]; then \
        echo "✓ wasm_exec.js found ($(du -h wasm/wasm_exec.js | cut -f1))"; \
    else \
        echo "✗ wasm_exec.js not found"; \
    fi

# Build WASM module (requires go-dws repository in ../go-dws)
wasm-build:
    #!/usr/bin/env bash
    set -euo pipefail
    if [ ! -d "../go-dws" ]; then
        echo "Error: go-dws repository not found at ../go-dws"
        echo "Clone it with: git clone https://github.com/cwbudde/go-dws.git ../go-dws"
        exit 1
    fi
    echo "Building WASM module from go-dws..."
    cd ../go-dws
    just wasm
    echo "✓ WASM build complete"

# Optimize WASM module (requires binaryen's wasm-opt)
wasm-optimize:
    #!/usr/bin/env bash
    set -euo pipefail
    if [ ! -d "../go-dws" ]; then
        echo "Error: go-dws repository not found at ../go-dws"
        exit 1
    fi
    if ! command -v wasm-opt &> /dev/null; then
        echo "Error: wasm-opt not found. Install binaryen:"
        echo "  macOS: brew install binaryen"
        echo "  Ubuntu: apt install binaryen"
        echo "  Other: https://github.com/WebAssembly/binaryen"
        exit 1
    fi
    echo "Optimizing WASM module..."
    cd ../go-dws
    just wasm-opt
    echo "✓ WASM optimization complete"

# Copy WASM files from go-dws to this project
wasm-copy:
    #!/usr/bin/env bash
    set -euo pipefail
    if [ ! -d "../go-dws" ]; then
        echo "Error: go-dws repository not found at ../go-dws"
        exit 1
    fi
    if [ ! -f "../go-dws/build/wasm/dist/dwscript.wasm" ]; then
        echo "Error: WASM module not built. Run 'just wasm-build' first."
        exit 1
    fi
    echo "Copying WASM files..."
    cp ../go-dws/build/wasm/dist/dwscript.wasm wasm/
    cp ../go-dws/build/wasm/wasm_exec.js wasm/
    echo "✓ WASM files copied successfully"
    just wasm-check

# Build and copy WASM module (full workflow)
wasm: wasm-build wasm-copy

# Build, optimize, and copy WASM module
wasm-all: wasm-build wasm-optimize wasm-copy

# ============================================================================
# Content Management
# ============================================================================

# Validate lesson JSON files
validate-lessons:
    #!/usr/bin/env bash
    set -euo pipefail
    echo "Validating lesson files..."
    for file in content/lessons/**/*.json; do
        if [ -f "$file" ]; then
            if jq empty "$file" 2>/dev/null; then
                echo "✓ $file"
            else
                echo "✗ $file - Invalid JSON"
                exit 1
            fi
        fi
    done
    echo "✓ All lesson files valid"

# Count lessons and examples
count-content:
    #!/usr/bin/env bash
    echo "Content Statistics:"
    echo "==================="
    echo "Lessons: $(find content/lessons -name '*.json' -not -name 'index.json' | wc -l)"
    echo "Examples: $(find content/examples -name '*.json' | wc -l)"
    echo "Categories: $(find content/lessons -type d -mindepth 1 -maxdepth 1 | wc -l)"

# ============================================================================
# Deployment
# ============================================================================

# Build and prepare for deployment
deploy-prep: clean build
    @echo "✓ Production build ready in dist/"
    @echo "Deploy with: gh-pages -d dist (or your deployment method)"

# Check deployment readiness
deploy-check:
    #!/usr/bin/env bash
    set -euo pipefail
    echo "Checking deployment readiness..."
    checks=0

    # Check WASM files
    if [ ! -f "wasm/dwscript.wasm" ]; then
        echo "✗ Missing wasm/dwscript.wasm"
        checks=$((checks + 1))
    else
        echo "✓ WASM module present"
    fi

    # Check if tests pass
    if npm run test -- --passWithNoTests 2>&1 | grep -q "PASS\|Tests:.*0 total"; then
        echo "✓ Tests passing"
    else
        echo "✗ Tests failing"
        checks=$((checks + 1))
    fi

    # Check for linter errors
    if npm run lint 2>&1 | grep -q "error"; then
        echo "✗ Linter errors present"
        checks=$((checks + 1))
    else
        echo "✓ No linter errors"
    fi

    if [ $checks -eq 0 ]; then
        echo "✓ Ready to deploy!"
    else
        echo "✗ Fix $checks issue(s) before deploying"
        exit 1
    fi

# ============================================================================
# Information
# ============================================================================

# Show project information
info:
    @echo "Project: go-dws-primer"
    @echo "Description: Interactive educational environment for DWScript/Object Pascal"
    @echo ""
    @echo "Repository: $(git remote get-url origin 2>/dev/null || echo 'N/A')"
    @echo "Branch: $(git branch --show-current 2>/dev/null || echo 'N/A')"
    @echo "Node: $(node --version 2>/dev/null || echo 'Not installed')"
    @echo "NPM: $(npm --version 2>/dev/null || echo 'Not installed')"
    @echo ""
    @just wasm-check

# Show file statistics
stats:
    @echo "Code Statistics:"
    @echo "================"
    @echo "JavaScript files: $(find src -name '*.js' | wc -l)"
    @echo "CSS files: $(find styles -name '*.css' | wc -l)"
    @echo "Total lines of JS: $(find src -name '*.js' -exec wc -l {} + | tail -1 | awk '{print $1}')"
    @echo "Total lines of CSS: $(find styles -name '*.css' -exec wc -l {} + | tail -1 | awk '{print $1}')"

# Show dependency tree
deps:
    npm list --depth=0

# Check for outdated dependencies
deps-check:
    npm outdated

# Update dependencies (interactive)
deps-update:
    npm update

# ============================================================================
# Git Helpers
# ============================================================================

# Show git status
status:
    git status

# Create a commit with a conventional commit message
commit message:
    git add .
    git commit -m "{{message}}"

# Push to current branch
push:
    git push -u origin $(git branch --show-current)

# ============================================================================
# Quick Workflows
# ============================================================================

# Quick start: install dependencies and start dev server
start: install dev

# Full check: run all quality checks and tests
ci: check test

# Complete WASM workflow with dev server restart
refresh: wasm
    @echo "✓ WASM updated. Restart dev server to see changes."

# Pre-commit: format, lint-fix, and test
pre-commit: fix test
    @echo "✓ Ready to commit!"
