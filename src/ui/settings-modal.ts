/**
 * Settings Modal
 * Provides UI for user preferences and accessibility settings
 */

import { getState, setValue, updateState } from "../core/state-manager.ts";
import { getEditor } from "../editor/monaco-setup.ts";
import * as monaco from "monaco-editor";

let modal: HTMLElement | null = null;

/**
 * Show settings modal
 */
export function showSettingsModal() {
  if (modal) {
    modal.remove();
  }

  const state = getState();

  modal = createModal();
  document.body.appendChild(modal);

  // Populate current values
  populateSettings(state);

  // Setup event listeners
  setupSettingsListeners();
}

/**
 * Create modal HTML structure
 */
function createModal() {
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.id = "settings-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-labelledby", "settings-title");
  modal.setAttribute("aria-modal", "true");

  modal.innerHTML = `
    <div class="modal-content settings-modal">
      <div class="modal-header">
        <h2 id="settings-title">Settings</h2>
        <button class="modal-close" aria-label="Close settings" title="Close (Esc)">
          <span aria-hidden="true">×</span>
        </button>
      </div>

      <div class="modal-body">
        <div class="settings-tabs">
          <button class="settings-tab active" data-tab="editor">Editor</button>
          <button class="settings-tab" data-tab="accessibility">Accessibility</button>
          <button class="settings-tab" data-tab="shortcuts">Keyboard Shortcuts</button>
          <button class="settings-tab" data-tab="about">About</button>
        </div>

        <div class="settings-content">
          <!-- Editor Settings -->
          <div class="settings-panel active" data-panel="editor">
            <div class="settings-section">
              <h3>Editor Appearance</h3>

              <div class="settings-group">
                <label for="setting-font-size">
                  Font Size
                  <span class="setting-description">Adjust editor text size</span>
                </label>
                <div class="setting-control">
                  <input type="range" id="setting-font-size" min="10" max="24" step="1" value="14">
                  <span class="setting-value" id="font-size-value">14px</span>
                </div>
              </div>

              <div class="settings-group">
                <label for="setting-tab-size">
                  Tab Size
                  <span class="setting-description">Number of spaces per tab</span>
                </label>
                <div class="setting-control">
                  <select id="setting-tab-size">
                    <option value="2">2 spaces</option>
                    <option value="4">4 spaces</option>
                    <option value="8">8 spaces</option>
                  </select>
                </div>
              </div>

              <div class="settings-group">
                <label for="setting-minimap">
                  <input type="checkbox" id="setting-minimap" checked>
                  Show Minimap
                  <span class="setting-description">Display code overview minimap</span>
                </label>
              </div>

              <div class="settings-group">
                <label for="setting-word-wrap">
                  <input type="checkbox" id="setting-word-wrap">
                  Word Wrap
                  <span class="setting-description">Wrap long lines</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Accessibility Settings -->
          <div class="settings-panel" data-panel="accessibility">
            <div class="settings-section">
              <h3>Visual Accessibility</h3>

              <div class="settings-group">
                <label for="setting-high-contrast">
                  <input type="checkbox" id="setting-high-contrast">
                  High Contrast Mode
                  <span class="setting-description">Enhanced contrast for better visibility</span>
                </label>
              </div>

              <div class="settings-group">
                <label for="setting-color-blind-mode">
                  Color Blind Friendly Palette
                  <span class="setting-description">Optimized colors for color vision deficiency</span>
                </label>
                <div class="setting-control">
                  <select id="setting-color-blind-mode">
                    <option value="none">Default</option>
                    <option value="protanopia">Protanopia (Red-Blind)</option>
                    <option value="deuteranopia">Deuteranopia (Green-Blind)</option>
                    <option value="tritanopia">Tritanopia (Blue-Blind)</option>
                  </select>
                </div>
              </div>

              <div class="settings-group">
                <label for="setting-animations">
                  <input type="checkbox" id="setting-animations" checked>
                  Enable Animations
                  <span class="setting-description">Show UI transitions and animations</span>
                </label>
              </div>
            </div>

            <div class="settings-section">
              <h3>Screen Reader</h3>

              <div class="settings-group">
                <label for="setting-announce-output">
                  <input type="checkbox" id="setting-announce-output" checked>
                  Announce Program Output
                  <span class="setting-description">Read execution results aloud</span>
                </label>
              </div>

              <div class="settings-group">
                <label for="setting-announce-errors">
                  <input type="checkbox" id="setting-announce-errors" checked>
                  Announce Errors
                  <span class="setting-description">Read compilation and runtime errors</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Keyboard Shortcuts -->
          <div class="settings-panel" data-panel="shortcuts">
            <div class="settings-section">
              <h3>Keyboard Shortcuts</h3>
              <div class="shortcuts-list">
                <div class="shortcut-item">
                  <span class="shortcut-action">Run Code</span>
                  <span class="shortcut-keys"><kbd>Ctrl</kbd> + <kbd>Enter</kbd> or <kbd>F5</kbd></span>
                </div>
                <div class="shortcut-item">
                  <span class="shortcut-action">Stop Execution</span>
                  <span class="shortcut-keys"><kbd>Shift</kbd> + <kbd>F5</kbd></span>
                </div>
                <div class="shortcut-item">
                  <span class="shortcut-action">Format Code</span>
                  <span class="shortcut-keys"><kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>F</kbd></span>
                </div>
                <div class="shortcut-item">
                  <span class="shortcut-action">Toggle Comment</span>
                  <span class="shortcut-keys"><kbd>Ctrl</kbd> + <kbd>/</kbd></span>
                </div>
                <div class="shortcut-item">
                  <span class="shortcut-action">Find</span>
                  <span class="shortcut-keys"><kbd>Ctrl</kbd> + <kbd>F</kbd></span>
                </div>
                <div class="shortcut-item">
                  <span class="shortcut-action">Replace</span>
                  <span class="shortcut-keys"><kbd>Ctrl</kbd> + <kbd>H</kbd></span>
                </div>
                <div class="shortcut-item">
                  <span class="shortcut-action">Go to Line</span>
                  <span class="shortcut-keys"><kbd>Ctrl</kbd> + <kbd>G</kbd></span>
                </div>
                <div class="shortcut-item">
                  <span class="shortcut-action">Command Palette</span>
                  <span class="shortcut-keys"><kbd>F1</kbd> or <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd></span>
                </div>
                <div class="shortcut-item">
                  <span class="shortcut-action">Toggle Theme</span>
                  <span class="shortcut-keys"><kbd>Ctrl</kbd> + <kbd>K</kbd> <kbd>T</kbd></span>
                </div>
                <div class="shortcut-item">
                  <span class="shortcut-action">Open Settings</span>
                  <span class="shortcut-keys"><kbd>Ctrl</kbd> + <kbd>,</kbd></span>
                </div>
                <div class="shortcut-item">
                  <span class="shortcut-action">Increase Font Size</span>
                  <span class="shortcut-keys"><kbd>Ctrl</kbd> + <kbd>+</kbd></span>
                </div>
                <div class="shortcut-item">
                  <span class="shortcut-action">Decrease Font Size</span>
                  <span class="shortcut-keys"><kbd>Ctrl</kbd> + <kbd>-</kbd></span>
                </div>
                <div class="shortcut-item">
                  <span class="shortcut-action">Reset Font Size</span>
                  <span class="shortcut-keys"><kbd>Ctrl</kbd> + <kbd>0</kbd></span>
                </div>
              </div>
            </div>
          </div>

          <!-- About -->
          <div class="settings-panel" data-panel="about">
            <div class="settings-section">
              <h3>About DWScript Primer</h3>
              <p>An interactive educational programming environment for learning DWScript/Object Pascal.</p>
              <p><strong>Version:</strong> 1.0.0</p>
              <p><strong>Runtime:</strong> go-dws WebAssembly</p>

              <h4>Links</h4>
              <ul class="about-links">
                <li><a href="https://github.com/cwbudde/go-dws-primer" target="_blank" rel="noopener">GitHub Repository</a></li>
                <li><a href="https://github.com/cwbudde/go-dws" target="_blank" rel="noopener">go-dws Project</a></li>
                <li><a href="https://delphitools.info/dwscript" target="_blank" rel="noopener">DWScript Documentation</a></li>
              </ul>

              <h4>Credits</h4>
              <p>Built with Monaco Editor, go-dws, and modern web technologies.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" id="settings-reset">Reset to Defaults</button>
        <button class="btn btn-primary" id="settings-close">Close</button>
      </div>
    </div>
  `;

  return modal;
}

/**
 * Populate settings with current values
 */
function populateSettings(state) {
  // Editor settings
  const fontSizeInput = document.getElementById(
    "setting-font-size",
  ) as HTMLInputElement | null;
  if (fontSizeInput) {
    fontSizeInput.value = String(state.fontSize || 14);
  }
  const fontSizeValue = document.getElementById("font-size-value");
  if (fontSizeValue) {
    fontSizeValue.textContent = `${state.fontSize || 14}px`;
  }
  const tabSizeSelect = document.getElementById(
    "setting-tab-size",
  ) as HTMLSelectElement | null;
  if (tabSizeSelect) {
    tabSizeSelect.value = String(state.preferences?.tabSize || 2);
  }
  const minimapInput = document.getElementById(
    "setting-minimap",
  ) as HTMLInputElement | null;
  if (minimapInput) {
    minimapInput.checked = state.showMinimap !== false;
  }
  const wordWrapInput = document.getElementById(
    "setting-word-wrap",
  ) as HTMLInputElement | null;
  if (wordWrapInput) {
    wordWrapInput.checked = state.preferences?.wordWrap || false;
  }

  // Accessibility settings
  const highContrastInput = document.getElementById(
    "setting-high-contrast",
  ) as HTMLInputElement | null;
  if (highContrastInput) {
    highContrastInput.checked = state.highContrast || false;
  }
  const colorBlindSelect = document.getElementById(
    "setting-color-blind-mode",
  ) as HTMLSelectElement | null;
  if (colorBlindSelect) {
    colorBlindSelect.value = state.colorBlindMode || "none";
  }
  const animationsInput = document.getElementById(
    "setting-animations",
  ) as HTMLInputElement | null;
  if (animationsInput) {
    animationsInput.checked = state.enableAnimations !== false;
  }
  const announceOutputInput = document.getElementById(
    "setting-announce-output",
  ) as HTMLInputElement | null;
  if (announceOutputInput) {
    announceOutputInput.checked = state.announceOutput !== false;
  }
  const announceErrorsInput = document.getElementById(
    "setting-announce-errors",
  ) as HTMLInputElement | null;
  if (announceErrorsInput) {
    announceErrorsInput.checked = state.announceErrors !== false;
  }
}

/**
 * Setup event listeners for settings controls
 */
function setupSettingsListeners() {
  if (!modal) return;

  // Close button
  const closeButtons = modal.querySelectorAll(".modal-close, #settings-close");
  closeButtons.forEach((btn) => {
    btn.addEventListener("click", hideSettingsModal);
  });

  // Close on overlay click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      hideSettingsModal();
    }
  });

  // Close on Escape key
  document.addEventListener("keydown", handleEscapeKey);

  // Tab switching
  const tabs = modal.querySelectorAll<HTMLElement>(".settings-tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const tabName = tab.dataset.tab;
      switchTab(tabName);
    });
  });

  // Font size
  const fontSizeInput = document.getElementById(
    "setting-font-size",
  ) as HTMLInputElement | null;
  if (fontSizeInput) {
    fontSizeInput.addEventListener("input", (e) => {
      const target = e.target as HTMLInputElement | null;
      const size = parseInt(target?.value || "0", 10);
      const fontValue = document.getElementById("font-size-value");
      if (fontValue) {
        fontValue.textContent = `${size}px`;
      }
      applyFontSize(size);
    });
  }

  // Tab size
  const tabSizeInput = document.getElementById(
    "setting-tab-size",
  ) as HTMLSelectElement | null;
  tabSizeInput?.addEventListener("change", (e) => {
    const target = e.target as HTMLSelectElement | null;
    const tabSize = parseInt(target?.value || "0", 10);
    applyTabSize(tabSize);
  });

  // Minimap
  const minimapInput = document.getElementById(
    "setting-minimap",
  ) as HTMLInputElement | null;
  minimapInput?.addEventListener("change", (e) => {
    const target = e.target as HTMLInputElement | null;
    applyMinimap(!!target?.checked);
  });

  // Word wrap
  const wordWrapInput = document.getElementById(
    "setting-word-wrap",
  ) as HTMLInputElement | null;
  wordWrapInput?.addEventListener("change", (e) => {
    const target = e.target as HTMLInputElement | null;
    applyWordWrap(!!target?.checked);
  });

  // High contrast
  const highContrastInput = document.getElementById(
    "setting-high-contrast",
  ) as HTMLInputElement | null;
  highContrastInput?.addEventListener("change", (e) => {
    const target = e.target as HTMLInputElement | null;
    applyHighContrast(!!target?.checked);
  });

  // Color blind mode
  const colorBlindInput = document.getElementById(
    "setting-color-blind-mode",
  ) as HTMLSelectElement | null;
  colorBlindInput?.addEventListener("change", (e) => {
    const target = e.target as HTMLSelectElement | null;
    applyColorBlindMode(target?.value || "none");
  });

  // Animations
  const animationsInput = document.getElementById(
    "setting-animations",
  ) as HTMLInputElement | null;
  animationsInput?.addEventListener("change", (e) => {
    const target = e.target as HTMLInputElement | null;
    applyAnimations(!!target?.checked);
  });

  // Announce settings
  const announceOutputInput = document.getElementById(
    "setting-announce-output",
  ) as HTMLInputElement | null;
  announceOutputInput?.addEventListener("change", (e) => {
    const target = e.target as HTMLInputElement | null;
    setValue("announceOutput", !!target?.checked);
  });

  const announceErrorsInput = document.getElementById(
    "setting-announce-errors",
  ) as HTMLInputElement | null;
  announceErrorsInput?.addEventListener("change", (e) => {
    const target = e.target as HTMLInputElement | null;
    setValue("announceErrors", !!target?.checked);
  });

  // Reset button
  const resetButton = document.getElementById(
    "settings-reset",
  ) as HTMLButtonElement | null;
  resetButton?.addEventListener("click", resetSettings);
}

/**
 * Hide settings modal
 */
function hideSettingsModal() {
  if (modal) {
    modal.remove();
    modal = null;
  }
  document.removeEventListener("keydown", handleEscapeKey);
}

/**
 * Handle Escape key press
 */
function handleEscapeKey(e: KeyboardEvent) {
  if (e.key === "Escape") {
    hideSettingsModal();
  }
}

/**
 * Switch settings tab
 */
function switchTab(tabName) {
  if (!modal) return;
  // Update tab buttons
  modal.querySelectorAll<HTMLElement>(".settings-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.tab === tabName);
  });

  // Update panels
  modal.querySelectorAll<HTMLElement>(".settings-panel").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.panel === tabName);
  });
}

/**
 * Apply font size setting
 */
function applyFontSize(size) {
  const editor = getEditor();
  if (editor) {
    editor.updateOptions({ fontSize: size });
  }
  setValue("fontSize", size);
}

/**
 * Apply tab size setting
 */
function applyTabSize(tabSize) {
  const editor = getEditor();
  if (editor) {
    editor.updateOptions({ tabSize: tabSize });
  }
  updateState({
    preferences: {
      ...getState().preferences,
      tabSize: tabSize,
    },
  });
}

/**
 * Apply minimap setting
 */
function applyMinimap(enabled) {
  const editor = getEditor();
  if (editor) {
    editor.updateOptions({
      minimap: { enabled: enabled },
    });
  }
  setValue("showMinimap", enabled);
}

/**
 * Apply word wrap setting
 */
function applyWordWrap(enabled) {
  const editor = getEditor();
  if (editor) {
    editor.updateOptions({
      wordWrap: enabled ? "on" : "off",
    });
  }
  updateState({
    preferences: {
      ...getState().preferences,
      wordWrap: enabled,
    },
  });
}

/**
 * Apply high contrast mode
 */
function applyHighContrast(enabled) {
  document.documentElement.classList.toggle("high-contrast", enabled);
  setValue("highContrast", enabled);

  // Optionally switch Monaco theme
  const editor = getEditor();
  if (editor) {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    if (enabled) {
      monaco.editor.setTheme("hc-black");
    } else {
      monaco.editor.setTheme(currentTheme === "dark" ? "vs-dark" : "vs");
    }
  }
}

/**
 * Apply color blind mode
 */
function applyColorBlindMode(mode) {
  // Remove existing color blind classes
  document.documentElement.classList.remove(
    "cb-protanopia",
    "cb-deuteranopia",
    "cb-tritanopia",
  );

  // Apply new mode
  if (mode !== "none") {
    document.documentElement.classList.add(`cb-${mode}`);
  }

  setValue("colorBlindMode", mode);
}

/**
 * Apply animations setting
 */
function applyAnimations(enabled) {
  document.documentElement.classList.toggle("reduce-motion", !enabled);
  setValue("enableAnimations", enabled);
}

/**
 * Reset all settings to defaults
 */
function resetSettings() {
  if (!confirm("Reset all settings to defaults?")) {
    return;
  }

  // Reset to defaults
  applyFontSize(14);
  applyTabSize(2);
  applyMinimap(true);
  applyWordWrap(false);
  applyHighContrast(false);
  applyColorBlindMode("none");
  applyAnimations(true);
  setValue("announceOutput", true);
  setValue("announceErrors", true);

  // Update UI
  const state = getState();
  populateSettings(state);
}

/**
 * Initialize settings module
 */
export function initSettings() {
  // Add global keyboard shortcut for settings
  document.addEventListener("keydown", (e) => {
    // Ctrl/Cmd + ,
    if ((e.ctrlKey || e.metaKey) && e.key === ",") {
      e.preventDefault();
      showSettingsModal();
    }
  });

  // Apply saved accessibility settings on init
  const state = getState();
  if (state.highContrast) {
    applyHighContrast(true);
  }
  if (state.colorBlindMode && state.colorBlindMode !== "none") {
    applyColorBlindMode(state.colorBlindMode);
  }
  if (state.enableAnimations === false) {
    applyAnimations(false);
  }
}
