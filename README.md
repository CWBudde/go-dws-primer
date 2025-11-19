# DWScript Primer

An interactive, browser-based educational programming environment for learning DWScript/Object Pascal. Built on [go-dws](https://github.com/cwbudde/go-dws) and inspired by [PascalPrimer](https://github.com/cwbudde/PascalPrimer).

## Features

- **Interactive Code Editor**: Monaco Editor with syntax highlighting for DWScript
- **Instant Feedback**: Real-time code execution via WebAssembly
- **Multi-Panel Output**: Separate views for console, compiler messages, and graphics
- **Turtle Graphics**: Full-featured visual programming with Logo-style drawing ✨
  - Complete turtle API (Forward, Backward, TurnLeft/Right, Circle, Arc, etc.)
  - Animation support with speed control
  - Canvas export to PNG/SVG
  - 6+ example programs included
- **Enhanced Error Handling**: Clickable error messages that jump to source line
- **Performance Metrics**: Real-time execution time tracking
- **Structured Lessons**: Progressive learning path with organized categories ✨
  - JSON-based lesson format with full Markdown support
  - Interactive examples and practice exercises
  - Progress tracking and completion statistics
  - Category-based navigation with search
  - 3 initial lessons (Hello World, Variables, Turtle Basics)
- **Code Challenges**: Interactive exercises with hints and solutions
- **Code Sharing**: Share code via URL encoding (coming soon)
- **Theme Support**: Light and dark themes
- **No Installation**: Runs entirely in the browser

## Quick Start

### Prerequisites

- Node.js 18 or higher
- Yarn Berry (v4.x) - included via Corepack

**Note**: This project uses Yarn Berry, not npm. Using npm commands will cause lockfile conflicts.

### Installation

```bash
# Clone the repository
git clone https://github.com/cwbudde/go-dws-primer.git
cd go-dws-primer

# Install dependencies
yarn install

# Start development server
yarn dev
```

The application will open at `http://localhost:3000`

### Building the WASM Module

To enable full DWScript execution, you need to build the WebAssembly module from go-dws:

```bash
# Clone go-dws repository
git clone https://github.com/cwbudde/go-dws.git
cd go-dws

# Build WASM module
just wasm

# Copy to go-dws-primer
cp build/wasm/dist/dwscript.wasm ../go-dws-primer/wasm/
cp build/wasm/wasm_exec.js ../go-dws-primer/wasm/
```

**Note**: Without the WASM module, the application runs in "mock mode" for development purposes.

## Development

### Project Structure

```
go-dws-primer/
├── public/              # Static assets and index.html
├── src/
│   ├── core/           # Core functionality (WASM, state, execution)
│   ├── editor/         # Monaco Editor setup and language definition
│   ├── output/         # Output panel management
│   ├── turtle/         # Turtle graphics engine
│   ├── lessons/        # Lesson system (loader, UI, navigation, progress)
│   ├── ui/             # UI components and layout
│   ├── utils/          # Utility functions
│   └── main.js         # Application entry point
├── styles/             # CSS stylesheets
├── content/            # Lesson content, examples, challenges
├── wasm/               # WebAssembly module
└── tests/              # Test suites
```

### Available Scripts

```bash
yarn dev       # Start development server
yarn build     # Build for production
yarn preview   # Preview production build
yarn test      # Run unit tests
yarn lint      # Lint code
yarn format    # Format code
```

### Building for Production

```bash
yarn build
```

The production-ready files will be in the `dist/` directory.

### Deployment

The application is a static site and can be deployed to:

- **GitHub Pages**: Use the included GitHub Actions workflow
- **Netlify**: Connect your repository and deploy
- **Vercel**: Import the project and deploy
- **Any static hosting**: Upload the `dist/` folder

## Architecture

### Core Components

- **WASM Loader**: Initializes and manages the Go WebAssembly runtime
- **State Manager**: Handles application state and localStorage persistence
- **Executor**: Manages code execution and result handling
- **Monaco Editor**: Provides the code editing experience
- **Output Manager**: Coordinates console, compiler, and graphics output

### Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Editor**: Monaco Editor (VS Code engine)
- **Runtime**: WebAssembly (Go-compiled)
- **Build Tool**: Vite
- **Module Bundler**: Rollup (via Vite)

## Roadmap

See [PLAN.md](PLAN.md) for the comprehensive development roadmap.

### Phase 1: Foundation ✅
- [x] Project structure
- [x] Monaco Editor integration
- [x] Basic UI layout
- [x] WASM loader
- [x] Code execution pipeline
- [x] Build configuration

### Phase 2: Enhanced Output ✅
- [x] Multi-panel output system with tabs
- [x] Turtle graphics engine with full API
- [x] Animation support and speed control
- [x] Canvas export functionality (PNG/SVG)
- [x] Enhanced compiler message parsing
- [x] Clickable error messages with line highlighting
- [x] Execution time tracking and performance metrics
- [x] Example turtle graphics programs

### Phase 3: Educational Content System ✅ (Current)
- [x] Lesson data structure (JSON schema)
- [x] Lesson loader and caching system
- [x] Navigation system with category browsing
- [x] Progress tracking with localStorage
- [x] Lesson content display with Markdown support
- [x] Interactive examples and exercises
- [x] Search and filtering
- [x] Next/Previous lesson navigation
- [x] Initial lesson content (3 lessons)
- [x] Completion tracking and statistics

### Phase 4-10: See PLAN.md

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit with clear messages (`git commit -m 'Add amazing feature'`)
6. Push to your fork (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

WebAssembly and ES6 module support required.

## License

MIT License - see [LICENSE](LICENSE) file for details

## Acknowledgments

- [go-dws](https://github.com/cwbudde/go-dws) - DWScript implementation in Go
- [PascalPrimer](https://github.com/cwbudde/PascalPrimer) - Educational inspiration
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Code editor component
- DWScript community and contributors

## Support

- 📖 [Documentation](docs/)
- 🐛 [Issue Tracker](https://github.com/cwbudde/go-dws-primer/issues)
- 💬 [Discussions](https://github.com/cwbudde/go-dws-primer/discussions)

## Status

**Current Phase**: Educational Content System (Phase 3) ✅

This is an active development project. The platform now includes a complete lesson system with interactive content, progress tracking, and structured learning paths. Next up: User Experience Enhancements (Phase 4).

---

Made with ❤️ for the DWScript and Pascal community
