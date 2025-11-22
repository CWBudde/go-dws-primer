import { useEffect, useState } from "react";
import { switchTab } from "./output/output-manager.ts";
import {
  clearCanvas,
  clearOutputs,
  exportCanvasImage,
  formatEditor,
  initApp,
  openSettings,
  runCode,
  shareCurrentCode,
  stopCode,
  toggleThemeMode,
  updateTurtleSpeed,
  updateStatus,
} from "./bootstrap.ts";

function App() {
  const [navSelection, setNavSelection] = useState("lessons");
  const [shareIcon, setShareIcon] = useState("🔗");
  const [activeTab, setActiveTab] = useState("console");

  useEffect(() => {
    initApp();
    switchTab("console");
  }, []);

  const handleShare = async () => {
    const result = await shareCurrentCode();
    if (result.success) {
      setShareIcon("✓");
      setTimeout(() => setShareIcon("🔗"), 2000);
      updateStatus("✓ " + result.message);
    } else {
      updateStatus("✗ " + result.message);
    }
  };

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
    switchTab(tabName);
  };

  return (
    <>
      <div id="app">
        <header className="app-header">
          <div className="header-left">
            <h1 className="logo">DWScript Primer</h1>
            <nav className="main-nav">
              <button
                id="btn-lessons"
                className={`nav-btn ${navSelection === "lessons" ? "active" : ""}`}
                onClick={() => setNavSelection("lessons")}
              >
                Lessons
              </button>
              <button
                id="btn-examples"
                className={`nav-btn ${navSelection === "examples" ? "active" : ""}`}
                onClick={() => setNavSelection("examples")}
              >
                Examples
              </button>
              <button
                id="btn-challenges"
                className={`nav-btn ${navSelection === "challenges" ? "active" : ""}`}
                onClick={() => setNavSelection("challenges")}
              >
                Challenges
              </button>
              <button
                id="btn-playground"
                className={`nav-btn ${navSelection === "playground" ? "active" : ""}`}
                onClick={() => setNavSelection("playground")}
              >
                Playground
              </button>
            </nav>
          </div>
          <div className="header-right">
            <button
              id="btn-share"
              className="icon-btn"
              title="Share Code"
              onClick={handleShare}
            >
              <span className="icon">{shareIcon}</span>
            </button>
            <button
              id="btn-settings"
              className="icon-btn"
              title="Settings"
              onClick={openSettings}
            >
              <span className="icon">⚙️</span>
            </button>
            <button
              id="btn-theme"
              className="icon-btn"
              title="Toggle Theme"
              onClick={toggleThemeMode}
            >
              <span className="icon">🌓</span>
            </button>
          </div>
        </header>

        <main className="app-main">
          <aside id="sidebar" className="sidebar">
            <div className="sidebar-header">
              <h2>Lessons</h2>
              <input
                type="search"
                id="lesson-search"
                placeholder="Search lessons..."
                className="search-input"
              />
            </div>
            <div id="lesson-list" className="lesson-list" />
          </aside>

          <div className="resizer" id="sidebar-resizer" />

          <div className="content-area">
            <section id="lesson-panel" className="lesson-panel">
              <div className="lesson-content">
                <h2>Welcome to DWScript Primer</h2>
                <p>
                  Start learning Object Pascal interactively with immediate
                  feedback!
                </p>
                <p>
                  Select a lesson from the sidebar to begin, or jump straight to
                  the playground to experiment.
                </p>
              </div>
            </section>

            <div className="resizer horizontal" id="lesson-resizer" />

            <div className="workspace">
              <section className="editor-section">
                <div className="panel-header">
                  <h3>Code Editor</h3>
                  <div className="toolbar">
                    <button
                      id="btn-run"
                      className="btn btn-primary"
                      title="Run Code (Ctrl+Enter)"
                      onClick={runCode}
                    >
                      <span className="icon">▶️</span> Run
                    </button>
                    <button
                      id="btn-stop"
                      className="btn btn-secondary"
                      title="Stop Execution"
                      disabled
                      onClick={stopCode}
                    >
                      <span className="icon">⏹️</span> Stop
                    </button>
                    <button
                      id="btn-clear"
                      className="btn btn-secondary"
                      title="Clear Output"
                      onClick={clearOutputs}
                    >
                      <span className="icon">🗑️</span> Clear
                    </button>
                    <button
                      id="btn-format"
                      className="btn btn-secondary"
                      title="Format Code"
                      onClick={formatEditor}
                    >
                      <span className="icon">✨</span> Format
                    </button>
                  </div>
                </div>
                <div id="editor-container" className="editor-container" />
              </section>

              <div className="resizer vertical" id="editor-resizer" />

              <section className="output-section">
                <div className="panel-header">
                  <div className="tabs">
                    <button
                      className={`tab ${activeTab === "console" ? "active" : ""}`}
                      data-tab="console"
                      onClick={() => handleTabClick("console")}
                    >
                      Console
                    </button>
                    <button
                      className={`tab ${activeTab === "compiler" ? "active" : ""}`}
                      data-tab="compiler"
                      onClick={() => handleTabClick("compiler")}
                    >
                      Compiler
                    </button>
                    <button
                      className={`tab ${activeTab === "graphics" ? "active" : ""}`}
                      data-tab="graphics"
                      onClick={() => handleTabClick("graphics")}
                    >
                      Graphics
                    </button>
                  </div>
                </div>
                <div className="output-container">
                  <div
                    id="output-console"
                    className={`output-panel ${activeTab === "console" ? "active" : ""}`}
                  >
                    <div className="output-content" />
                  </div>
                  <div
                    id="output-compiler"
                    className={`output-panel ${activeTab === "compiler" ? "active" : ""}`}
                  >
                    <div className="output-content" />
                  </div>
                  <div
                    id="output-graphics"
                    className={`output-panel ${activeTab === "graphics" ? "active" : ""}`}
                  >
                    <canvas id="turtle-canvas" width={600} height={600} />
                    <div className="graphics-controls">
                      <button
                        id="btn-clear-canvas"
                        className="btn btn-sm"
                        onClick={clearCanvas}
                      >
                        Clear
                      </button>
                      <button
                        id="btn-export-canvas"
                        className="btn btn-sm"
                        onClick={exportCanvasImage}
                      >
                        Export PNG
                      </button>
                      <label>
                        Speed:
                        <input
                          type="range"
                          id="turtle-speed"
                          min="1"
                          max="10"
                          defaultValue={5}
                          onChange={(e) => updateTurtleSpeed(Number(e.target.value))}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>

        <footer className="status-bar">
          <div className="status-left">
            <span id="status-message">Ready</span>
          </div>
          <div className="status-right">
            <span id="memory-usage" title="Memory usage" />
            <span id="execution-time" />
            <span
              id="performance-metrics"
              title="Click for detailed metrics"
              style={{ cursor: "pointer" }}
            />
            <span id="cursor-position">Ln 1, Col 1</span>
          </div>
        </footer>
      </div>

      <div id="modal-container" />

      <div id="loading" className="loading-overlay">
        <div className="spinner" />
        <p>Loading DWScript Runtime...</p>
      </div>
    </>
  );
}

export default App;
