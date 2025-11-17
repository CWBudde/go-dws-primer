/**
 * Output Manager
 * Handles displaying output in console, compiler, and graphics panels
 */

let currentTab = 'console';

/**
 * Initialize output panel functionality
 */
export function initOutputPanels() {
  // Setup tab switching
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.getAttribute('data-tab');
      switchTab(tabName);
    });
  });

  // Set initial tab
  switchTab('console');
}

/**
 * Switch to a specific output tab
 * @param {string} tabName - The tab to switch to (console, compiler, graphics)
 */
export function switchTab(tabName) {
  currentTab = tabName;

  // Update tab buttons
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    if (tab.getAttribute('data-tab') === tabName) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  // Update panels
  const panels = document.querySelectorAll('.output-panel');
  panels.forEach(panel => {
    if (panel.id === `output-${tabName}`) {
      panel.classList.add('active');
    } else {
      panel.classList.remove('active');
    }
  });
}

/**
 * Clear all output
 */
export function clearOutput() {
  clearConsoleOutput();
  clearCompilerOutput();
}

/**
 * Append text to console output
 * @param {string} text
 */
export function appendConsoleOutput(text) {
  const console = document.querySelector('#output-console .output-content');
  if (console) {
    const line = document.createElement('div');
    line.textContent = text;
    console.appendChild(line);

    // Auto-scroll to bottom
    console.scrollTop = console.scrollHeight;
  }

  // Ensure console tab is visible
  showOutput('console');
}

/**
 * Clear console output
 */
export function clearConsoleOutput() {
  const console = document.querySelector('#output-console .output-content');
  if (console) {
    console.innerHTML = '';
  }
}

/**
 * Append message to compiler output
 * @param {string} message
 * @param {string} type - Type of message: info, success, warning, error
 */
export function appendCompilerOutput(message, type = 'info') {
  const compiler = document.querySelector('#output-compiler .output-content');
  if (compiler) {
    const line = document.createElement('div');
    line.textContent = message;
    line.className = `compiler-message compiler-${type}`;
    compiler.appendChild(line);

    // Auto-scroll to bottom
    compiler.scrollTop = compiler.scrollHeight;
  }

  // Show compiler tab if there are errors
  if (type === 'error') {
    showOutput('compiler');
  }
}

/**
 * Clear compiler output
 */
export function clearCompilerOutput() {
  const compiler = document.querySelector('#output-compiler .output-content');
  if (compiler) {
    compiler.innerHTML = '';
  }
}

/**
 * Show a specific output tab
 * @param {string} tabName
 */
export function showOutput(tabName) {
  if (currentTab !== tabName) {
    switchTab(tabName);
  }
}

/**
 * Get the current active tab
 * @returns {string}
 */
export function getCurrentTab() {
  return currentTab;
}
