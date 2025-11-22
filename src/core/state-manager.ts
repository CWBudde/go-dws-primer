/**
 * Application State Manager
 * Manages global application state and persistence
 */

const DEFAULT_STATE = {
  theme: "light",
  currentView: "lessons",
  currentLesson: null,
  fontSize: 14,
  showMinimap: true,
  autoSave: true,
  turtleSpeed: 5,
  completedLessons: [],
  userCode: {},
  preferences: {
    tabSize: 2,
    insertSpaces: true,
    wordWrap: false,
  },
  highContrast: false,
  colorBlindMode: "none",
  enableAnimations: true,
  announceOutput: true,
  announceErrors: true,
};

let state = { ...DEFAULT_STATE };

/**
 * Initialize state from localStorage
 */
export function initState() {
  try {
    const saved = localStorage.getItem("dwscript-primer-state");
    if (saved) {
      const parsed = JSON.parse(saved);
      state = { ...DEFAULT_STATE, ...parsed };
    }

    // Apply theme immediately
    applyTheme(state.theme);

    console.log("State initialized:", state);
  } catch (error) {
    console.error("Failed to load state:", error);
    state = { ...DEFAULT_STATE };
  }
}

/**
 * Save state to localStorage
 */
export function saveState() {
  try {
    localStorage.setItem("dwscript-primer-state", JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save state:", error);
  }
}

/**
 * Get the current state
 * @returns {Object}
 */
export function getState() {
  return { ...state };
}

/**
 * Update state
 * @param {Object} updates - Partial state to merge
 */
export function updateState(updates) {
  state = { ...state, ...updates };
  saveState();

  // Dispatch state change event
  window.dispatchEvent(new CustomEvent("statechange", { detail: state }));
}

/**
 * Get a specific state value
 * @param {string} key
 * @returns {any}
 */
export function getValue(key) {
  return state[key];
}

/**
 * Set a specific state value
 * @param {string} key
 * @param {any} value
 */
export function setValue(key, value) {
  state[key] = value;
  saveState();

  window.dispatchEvent(
    new CustomEvent("statechange", {
      detail: { key, value, state },
    }),
  );
}

/**
 * Toggle theme between light and dark
 */
export function toggleTheme() {
  const newTheme = state.theme === "light" ? "dark" : "light";
  setValue("theme", newTheme);
  applyTheme(newTheme);
}

/**
 * Apply theme to the document
 * @param {string} theme
 */
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  document.dispatchEvent(new CustomEvent("themechange", { detail: { theme } }));
}

/**
 * Mark a lesson as completed
 * @param {string} lessonId
 */
export function markLessonCompleted(lessonId) {
  if (!state.completedLessons.includes(lessonId)) {
    state.completedLessons.push(lessonId);
    saveState();

    window.dispatchEvent(
      new CustomEvent("lessoncompleted", {
        detail: { lessonId },
      }),
    );
  }
}

/**
 * Check if a lesson is completed
 * @param {string} lessonId
 * @returns {boolean}
 */
export function isLessonCompleted(lessonId) {
  return state.completedLessons.includes(lessonId);
}

/**
 * Save user code for a lesson
 * @param {string} lessonId
 * @param {string} code
 */
export function saveUserCode(lessonId, code) {
  state.userCode[lessonId] = code;
  saveState();
}

/**
 * Get saved user code for a lesson
 * @param {string} lessonId
 * @returns {string|null}
 */
export function getUserCode(lessonId) {
  return state.userCode[lessonId] || null;
}

/**
 * Reset all state to defaults
 */
export function resetState() {
  state = { ...DEFAULT_STATE };
  saveState();
  applyTheme(state.theme);

  window.dispatchEvent(new CustomEvent("statereset"));
}

/**
 * Export state as JSON
 * @returns {string}
 */
export function exportState() {
  return JSON.stringify(state, null, 2);
}

/**
 * Import state from JSON
 * @param {string} json
 * @returns {boolean} Success status
 */
export function importState(json) {
  try {
    const imported = JSON.parse(json);
    state = { ...DEFAULT_STATE, ...imported };
    saveState();
    applyTheme(state.theme);
    return true;
  } catch (error) {
    console.error("Failed to import state:", error);
    return false;
  }
}
