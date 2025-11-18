/**
 * Settings Modal
 * Provides UI for user preferences and accessibility settings
 */

import { getState, setValue, updateState } from '../core/state-manager.js';
import { getEditor } from '../editor/monaco-setup.js';

let modal = null;

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
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.id = 'settings-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-labelledby', 'settings-title');
  modal.setAttribute('aria-modal', 'true');

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
  document.getElementById('setting-font-size').value = state.fontSize || 14;
  document.getElementById('font-size-value').textContent = `${state.fontSize || 14}px`;
  document.getElementById('setting-tab-size').value = state.preferences?.tabSize || 2;
  document.getElementById('setting-minimap').checked = state.showMinimap !== false;
  document.getElementById('setting-word-wrap').checked = state.preferences?.wordWrap || false;

  // Accessibility settings
  document.getElementById('setting-high-contrast').checked = state.highContrast || false;
  document.getElementById('setting-color-blind-mode').value = state.colorBlindMode || 'none';
  document.getElementById('setting-animations').checked = state.enableAnimations !== false;
  document.getElementById('setting-announce-output').checked = state.announceOutput !== false;
  document.getElementById('setting-announce-errors').checked = state.announceErrors !== false;
}

/**
 * Setup event listeners for settings controls
 */
function setupSettingsListeners() {
  // Close button
  const closeButtons = modal.querySelectorAll('.modal-close, #settings-close');
  closeButtons.forEach(btn => {
    btn.addEventListener('click', hideSettingsModal);
  });

  // Close on overlay click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      hideSettingsModal();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', handleEscapeKey);

  // Tab switching
  const tabs = modal.querySelectorAll('.settings-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.dataset.tab;
      switchTab(tabName);
    });
  });

  // Font size
  const fontSizeInput = document.getElementById('setting-font-size');
  fontSizeInput.addEventListener('input', (e) => {
    const size = parseInt(e.target.value);
    document.getElementById('font-size-value').textContent = `${size}px`;
    applyFontSize(size);
  });

  // Tab size
  document.getElementById('setting-tab-size').addEventListener('change', (e) => {
    const tabSize = parseInt(e.target.value);
    applyTabSize(tabSize);
  });

  // Minimap
  document.getElementById('setting-minimap').addEventListener('change', (e) => {
    applyMinimap(e.target.checked);
  });

  // Word wrap
  document.getElementById('setting-word-wrap').addEventListener('change', (e) => {
    applyWordWrap(e.target.checked);
  });

  // High contrast
  document.getElementById('setting-high-contrast').addEventListener('change', (e) => {
    applyHighContrast(e.target.checked);
  });

  // Color blind mode
  document.getElementById('setting-color-blind-mode').addEventListener('change', (e) => {
    applyColorBlindMode(e.target.value);
  });

  // Animations
  document.getElementById('setting-animations').addEventListener('change', (e) => {
    applyAnimations(e.target.checked);
  });

  // Announce settings
  document.getElementById('setting-announce-output').addEventListener('change', (e) => {
    setValue('announceOutput', e.target.checked);
  });

  document.getElementById('setting-announce-errors').addEventListener('change', (e) => {
    setValue('announceErrors', e.target.checked);
  });

  // Reset button
  document.getElementById('settings-reset').addEventListener('click', resetSettings);
}

/**
 * Hide settings modal
 */
function hideSettingsModal() {
  if (modal) {
    modal.remove();
    modal = null;
  }
  document.removeEventListener('keydown', handleEscapeKey);
}

/**
 * Handle Escape key press
 */
function handleEscapeKey(e) {
  if (e.key === 'Escape') {
    hideSettingsModal();
  }
}

/**
 * Switch settings tab
 */
function switchTab(tabName) {
  // Update tab buttons
  modal.querySelectorAll('.settings-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.tab === tabName);
  });

  // Update panels
  modal.querySelectorAll('.settings-panel').forEach(panel => {
    panel.classList.toggle('active', panel.dataset.panel === tabName);
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
  setValue('fontSize', size);
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
      tabSize: tabSize
    }
  });
}

/**
 * Apply minimap setting
 */
function applyMinimap(enabled) {
  const editor = getEditor();
  if (editor) {
    editor.updateOptions({
      minimap: { enabled: enabled }
    });
  }
  setValue('showMinimap', enabled);
}

/**
 * Apply word wrap setting
 */
function applyWordWrap(enabled) {
  const editor = getEditor();
  if (editor) {
    editor.updateOptions({
      wordWrap: enabled ? 'on' : 'off'
    });
  }
  updateState({
    preferences: {
      ...getState().preferences,
      wordWrap: enabled
    }
  });
}

/**
 * Apply high contrast mode
 */
function applyHighContrast(enabled) {
  document.documentElement.classList.toggle('high-contrast', enabled);
  setValue('highContrast', enabled);

  // Optionally switch Monaco theme
  const editor = getEditor();
  if (editor) {
    const monaco = window.monaco;
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (enabled) {
      monaco.editor.setTheme('hc-black');
    } else {
      monaco.editor.setTheme(currentTheme === 'dark' ? 'vs-dark' : 'vs');
    }
  }
}

/**
 * Apply color blind mode
 */
function applyColorBlindMode(mode) {
  // Remove existing color blind classes
  document.documentElement.classList.remove('cb-protanopia', 'cb-deuteranopia', 'cb-tritanopia');

  // Apply new mode
  if (mode !== 'none') {
    document.documentElement.classList.add(`cb-${mode}`);
  }

  setValue('colorBlindMode', mode);
}

/**
 * Apply animations setting
 */
function applyAnimations(enabled) {
  document.documentElement.classList.toggle('reduce-motion', !enabled);
  setValue('enableAnimations', enabled);
}

/**
 * Reset all settings to defaults
 */
function resetSettings() {
  if (!confirm('Reset all settings to defaults?')) {
    return;
  }

  // Reset to defaults
  applyFontSize(14);
  applyTabSize(2);
  applyMinimap(true);
  applyWordWrap(false);
  applyHighContrast(false);
  applyColorBlindMode('none');
  applyAnimations(true);
  setValue('announceOutput', true);
  setValue('announceErrors', true);

  // Update UI
  const state = getState();
  populateSettings(state);
}

/**
 * Initialize settings module
 */
export function initSettings() {
  // Add global keyboard shortcut for settings
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + ,
    if ((e.ctrlKey || e.metaKey) && e.key === ',') {
      e.preventDefault();
      showSettingsModal();
    }
  });

  // Apply saved accessibility settings on init
  const state = getState();
  if (state.highContrast) {
    applyHighContrast(true);
  }
  if (state.colorBlindMode && state.colorBlindMode !== 'none') {
    applyColorBlindMode(state.colorBlindMode);
  }
  if (state.enableAnimations === false) {
    applyAnimations(false);
  }
}
