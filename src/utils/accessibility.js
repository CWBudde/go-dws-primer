/**
 * Accessibility Utilities
 * Screen reader announcements and ARIA live regions
 */

import { getValue } from "../core/state-manager.js";

let liveRegion = null;

/**
 * Initialize accessibility features
 */
export function initAccessibility() {
  // Create ARIA live region for screen reader announcements
  liveRegion = document.createElement("div");
  liveRegion.id = "aria-live-region";
  liveRegion.setAttribute("role", "status");
  liveRegion.setAttribute("aria-live", "polite");
  liveRegion.setAttribute("aria-atomic", "true");
  liveRegion.className = "sr-only";
  document.body.appendChild(liveRegion);

  console.log("Accessibility features initialized");
}

/**
 * Announce a message to screen readers
 * @param {string} message - The message to announce
 * @param {string} priority - 'polite' (default) or 'assertive'
 */
export function announce(message, priority = "polite") {
  if (!liveRegion) {
    initAccessibility();
  }

  // Update aria-live attribute based on priority
  liveRegion.setAttribute("aria-live", priority);

  // Clear and set new message
  liveRegion.textContent = "";
  setTimeout(() => {
    liveRegion.textContent = message;
  }, 100);
}

/**
 * Announce program output to screen readers
 * @param {string} output - The program output
 */
export function announceOutput(output) {
  const shouldAnnounce = getValue("announceOutput");
  if (shouldAnnounce !== false && output) {
    // Limit announcement length to avoid overwhelming
    const trimmed =
      output.length > 200
        ? `${output.substring(0, 200)}... (output truncated for screen reader)`
        : output;

    announce(`Program output: ${trimmed}`, "polite");
  }
}

/**
 * Announce compilation/runtime errors to screen readers
 * @param {string} error - The error message
 * @param {number} line - Line number (optional)
 */
export function announceError(error, line = null) {
  const shouldAnnounce = getValue("announceErrors");
  if (shouldAnnounce !== false && error) {
    const message = line
      ? `Error on line ${line}: ${error}`
      : `Error: ${error}`;

    announce(message, "assertive");
  }
}

/**
 * Announce execution status
 * @param {string} status - The status message
 */
export function announceStatus(status) {
  announce(status, "polite");
}

/**
 * Announce lesson change
 * @param {string} lessonTitle - The lesson title
 */
export function announceLesson(lessonTitle) {
  announce(`Lesson loaded: ${lessonTitle}`, "polite");
}

/**
 * Add ARIA labels to interactive elements
 */
export function enhanceARIA() {
  // Add ARIA labels to buttons that only have icons
  const buttons = [
    {
      id: "btn-run",
      label: "Run code (Keyboard shortcut: Control+Enter or F5)",
    },
    { id: "btn-stop", label: "Stop execution (Keyboard shortcut: Shift+F5)" },
    { id: "btn-clear", label: "Clear output" },
    { id: "btn-format", label: "Format code (Keyboard shortcut: Shift+Alt+F)" },
    { id: "btn-share", label: "Share code via URL" },
    {
      id: "btn-settings",
      label: "Open settings (Keyboard shortcut: Control+comma)",
    },
    { id: "btn-theme", label: "Toggle light/dark theme" },
  ];

  buttons.forEach(({ id, label }) => {
    const btn = document.getElementById(id);
    if (btn && !btn.getAttribute("aria-label")) {
      btn.setAttribute("aria-label", label);
    }
  });

  // Add role and labels to output panels
  const panels = document.querySelectorAll(".output-panel");
  panels.forEach((panel) => {
    panel.setAttribute("role", "region");
    const title = panel.id.replace("output-", "");
    panel.setAttribute("aria-label", `${title} output`);
  });

  // Add role to editor container
  const editor = document.getElementById("editor-container");
  if (editor) {
    editor.setAttribute("role", "textbox");
    editor.setAttribute("aria-label", "Code editor");
    editor.setAttribute("aria-multiline", "true");
  }

  // Add aria-current to active navigation items
  const navButtons = document.querySelectorAll(".nav-btn");
  navButtons.forEach((btn) => {
    if (btn.classList.contains("active")) {
      btn.setAttribute("aria-current", "page");
    } else {
      btn.removeAttribute("aria-current");
    }
  });

  // Add aria-selected to active tabs
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab) => {
    tab.setAttribute("role", "tab");
    tab.setAttribute(
      "aria-selected",
      tab.classList.contains("active") ? "true" : "false",
    );
  });

  console.log("ARIA enhancements applied");
}

/**
 * Set focus to an element with screen reader announcement
 * @param {string} elementId - The element ID to focus
 * @param {string} announcement - Optional announcement message
 */
export function focusWithAnnouncement(elementId, announcement = null) {
  const element = document.getElementById(elementId);
  if (element) {
    element.focus();
    if (announcement) {
      announce(announcement);
    }
  }
}

/**
 * Make table keyboard navigable
 * Adds arrow key navigation to tables
 * @param {HTMLElement} table - The table element
 */
export function makeTableNavigable(table) {
  if (!table) return;

  const cells = table.querySelectorAll("td, th");
  cells.forEach((cell) => {
    cell.setAttribute("tabindex", "0");

    cell.addEventListener("keydown", (e) => {
      const currentRow = cell.parentElement;
      const currentIndex = Array.from(currentRow.children).indexOf(cell);
      const rows = table.querySelectorAll("tr");
      const currentRowIndex = Array.from(rows).indexOf(currentRow);

      let targetCell = null;

      switch (e.key) {
        case "ArrowUp":
          if (currentRowIndex > 0) {
            targetCell = rows[currentRowIndex - 1].children[currentIndex];
          }
          break;
        case "ArrowDown":
          if (currentRowIndex < rows.length - 1) {
            targetCell = rows[currentRowIndex + 1].children[currentIndex];
          }
          break;
        case "ArrowLeft":
          if (currentIndex > 0) {
            targetCell = currentRow.children[currentIndex - 1];
          }
          break;
        case "ArrowRight":
          if (currentIndex < currentRow.children.length - 1) {
            targetCell = currentRow.children[currentIndex + 1];
          }
          break;
        case "Home":
          targetCell = currentRow.children[0];
          break;
        case "End":
          targetCell = currentRow.children[currentRow.children.length - 1];
          break;
      }

      if (targetCell) {
        e.preventDefault();
        targetCell.focus();
      }
    });
  });
}
