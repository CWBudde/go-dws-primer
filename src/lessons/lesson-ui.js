/**
 * Lesson UI
 * Handles rendering and displaying lesson content
 */

import { marked } from "marked";
import { setCode } from "../editor/monaco-setup.js";
import { executeCode } from "../core/executor.js";
import { markExerciseCompleted, getLessonProgress } from "./progress.js";

let currentLesson = null;

/**
 * Display a lesson in the lesson panel
 * @param {Object} lesson - Lesson object
 */
export function displayLesson(lesson) {
  currentLesson = lesson;
  const panel = document.querySelector(".lesson-content");

  if (!panel) {
    console.error("Lesson content panel not found");
    return;
  }

  // Build lesson HTML
  const html = buildLessonHTML(lesson);
  panel.innerHTML = html;

  // Attach event listeners
  attachLessonEventListeners(lesson);

  // Update progress
  const progress = getLessonProgress(lesson.id);
  updateProgressIndicators(lesson, progress);
}

/**
 * Build HTML for lesson content
 * @param {Object} lesson - Lesson object
 * @returns {string} HTML string
 */
function buildLessonHTML(lesson) {
  const { content } = lesson;
  let html = "";

  // Header
  html += `
    <div class="lesson-header">
      <div class="lesson-meta">
        <span class="lesson-category">${formatCategory(lesson.category)}</span>
        <span class="lesson-difficulty ${lesson.difficulty}">${lesson.difficulty}</span>
        ${lesson.estimatedTime ? `<span class="lesson-time">⏱️ ${lesson.estimatedTime} min</span>` : ""}
      </div>
      <h1>${lesson.title}</h1>
      ${lesson.description ? `<p class="lesson-description">${lesson.description}</p>` : ""}
    </div>
  `;

  // Introduction
  if (content.introduction) {
    html += `
      <section class="lesson-section">
        <div class="lesson-text">${marked.parse(content.introduction)}</div>
      </section>
    `;
  }

  // Key Concepts
  if (content.concepts && content.concepts.length > 0) {
    html += `
      <section class="lesson-section">
        <h2>Key Concepts</h2>
        <div class="concept-grid">
          ${content.concepts
            .map(
              (concept) => `
            <div class="concept-card">
              <h3>${concept.title}</h3>
              <p>${concept.description}</p>
            </div>
          `,
            )
            .join("")}
        </div>
      </section>
    `;
  }

  // Examples
  if (content.examples && content.examples.length > 0) {
    html += `<section class="lesson-section"><h2>Examples</h2>`;

    content.examples.forEach((example, index) => {
      html += `
        <div class="example-block" data-example-index="${index}">
          <div class="example-header">
            <h3>${example.title || `Example ${index + 1}`}</h3>
            ${example.description ? `<p>${example.description}</p>` : ""}
          </div>
          <div class="code-block">
            <pre><code class="language-pascal">${escapeHtml(example.code)}</code></pre>
            <div class="code-actions">
              <button class="btn btn-sm btn-try" data-code="${escapeHtml(example.code)}">
                Try it
              </button>
              ${
                example.expectedOutput
                  ? `
                <button class="btn btn-sm btn-show-output">
                  Show Output
                </button>
              `
                  : ""
              }
            </div>
          </div>
          ${
            example.expectedOutput
              ? `
            <div class="expected-output" style="display: none;">
              <strong>Expected Output:</strong>
              <pre>${escapeHtml(example.expectedOutput)}</pre>
            </div>
          `
              : ""
          }
        </div>
      `;
    });

    html += `</section>`;
  }

  // Exercises
  if (content.exercises && content.exercises.length > 0) {
    html += `<section class="lesson-section"><h2>Practice Exercises</h2>`;

    content.exercises.forEach((exercise, index) => {
      html += `
        <div class="exercise-block" data-exercise-index="${index}">
          <div class="exercise-header">
            <h3>${exercise.title}</h3>
            <div class="exercise-status" data-exercise="${index}">
              <span class="status-icon">○</span>
            </div>
          </div>
          <div class="exercise-description">
            ${marked.parse(exercise.description)}
          </div>
          ${
            exercise.hints && exercise.hints.length > 0
              ? `
            <div class="exercise-hints">
              <button class="btn btn-sm btn-hints">💡 Show Hints</button>
              <div class="hints-list" style="display: none;">
                ${exercise.hints
                  .map(
                    (hint, i) => `
                  <div class="hint" data-hint="${i}" style="display: none;">
                    <strong>Hint ${i + 1}:</strong> ${hint}
                  </div>
                `,
                  )
                  .join("")}
                <button class="btn btn-sm btn-next-hint">Next Hint</button>
              </div>
            </div>
          `
              : ""
          }
          <div class="exercise-actions">
            <button class="btn btn-primary btn-start-exercise" data-code="${escapeHtml(exercise.starterCode || "")}">
              Start Exercise
            </button>
            ${
              exercise.solution
                ? `
              <button class="btn btn-sm btn-show-solution">
                Show Solution
              </button>
            `
                : ""
            }
          </div>
          ${
            exercise.solution
              ? `
            <div class="solution" style="display: none;">
              <h4>Solution:</h4>
              <pre><code class="language-pascal">${escapeHtml(exercise.solution)}</code></pre>
              <button class="btn btn-sm btn-try" data-code="${escapeHtml(exercise.solution)}">
                Try Solution
              </button>
            </div>
          `
              : ""
          }
        </div>
      `;
    });

    html += `</section>`;
  }

  // Summary
  if (content.summary) {
    html += `
      <section class="lesson-section lesson-summary">
        <h2>Summary</h2>
        <div class="lesson-text">${marked.parse(content.summary)}</div>
      </section>
    `;
  }

  // Next Steps
  if (content.nextSteps) {
    html += `
      <section class="lesson-section lesson-next-steps">
        <h2>Next Steps</h2>
        <div class="lesson-text">${marked.parse(content.nextSteps)}</div>
      </section>
    `;
  }

  // Lesson Actions
  html += `
    <div class="lesson-actions">
      <button class="btn btn-secondary btn-prev-lesson">← Previous Lesson</button>
      <button class="btn btn-primary btn-complete-lesson">Mark as Complete</button>
      <button class="btn btn-secondary btn-next-lesson">Next Lesson →</button>
    </div>
  `;

  return html;
}

/**
 * Attach event listeners to lesson elements
 * @param {Object} lesson - Lesson object
 */
function attachLessonEventListeners(lesson) {
  const panel = document.querySelector(".lesson-content");

  // Try it buttons
  panel.querySelectorAll(".btn-try").forEach((btn) => {
    btn.addEventListener("click", () => {
      const code = btn.getAttribute("data-code");
      if (code) {
        setCode(decodeHtml(code));
        // Switch to playground view or scroll to editor
        document
          .getElementById("btn-run")
          ?.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Show output buttons
  panel.querySelectorAll(".btn-show-output").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const block = e.target.closest(".example-block");
      const output = block.querySelector(".expected-output");
      if (output) {
        output.style.display =
          output.style.display === "none" ? "block" : "none";
        btn.textContent =
          output.style.display === "none" ? "Show Output" : "Hide Output";
      }
    });
  });

  // Start exercise buttons
  panel.querySelectorAll(".btn-start-exercise").forEach((btn) => {
    btn.addEventListener("click", () => {
      const code = btn.getAttribute("data-code");
      setCode(decodeHtml(code));
      document
        .getElementById("btn-run")
        ?.scrollIntoView({ behavior: "smooth" });
    });
  });

  // Show solution buttons
  panel.querySelectorAll(".btn-show-solution").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const block = e.target.closest(".exercise-block");
      const solution = block.querySelector(".solution");
      if (solution) {
        solution.style.display =
          solution.style.display === "none" ? "block" : "none";
        btn.textContent =
          solution.style.display === "none" ? "Show Solution" : "Hide Solution";
      }
    });
  });

  // Hints buttons
  panel.querySelectorAll(".btn-hints").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const hintsList = e.target.nextElementSibling;
      hintsList.style.display =
        hintsList.style.display === "none" ? "block" : "none";
      if (hintsList.style.display !== "none") {
        // Show first hint
        hintsList.querySelector(".hint").style.display = "block";
      }
    });
  });

  // Next hint buttons
  panel.querySelectorAll(".btn-next-hint").forEach((btn) => {
    let currentHint = 0;
    btn.addEventListener("click", (e) => {
      const hintsList = e.target.closest(".hints-list");
      const hints = hintsList.querySelectorAll(".hint");

      if (currentHint < hints.length - 1) {
        currentHint++;
        hints[currentHint].style.display = "block";
      }

      if (currentHint >= hints.length - 1) {
        btn.style.display = "none";
      }
    });
  });

  // Lesson navigation buttons
  const prevBtn = panel.querySelector(".btn-prev-lesson");
  const nextBtn = panel.querySelector(".btn-next-lesson");
  const completeBtn = panel.querySelector(".btn-complete-lesson");

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      window.dispatchEvent(
        new CustomEvent("navigateLesson", {
          detail: { direction: "prev" },
        }),
      );
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      window.dispatchEvent(
        new CustomEvent("navigateLesson", {
          detail: { direction: "next" },
        }),
      );
    });
  }

  if (completeBtn) {
    completeBtn.addEventListener("click", () => {
      window.dispatchEvent(
        new CustomEvent("completeLesson", {
          detail: { lessonId: lesson.id },
        }),
      );
    });
  }
}

/**
 * Update progress indicators for a lesson
 * @param {Object} lesson - Lesson object
 * @param {Object} progress - Progress data
 */
function updateProgressIndicators(lesson, progress) {
  if (!progress) return;

  const panel = document.querySelector(".lesson-content");

  // Update exercise completion status
  progress.exercisesCompleted?.forEach((completed, index) => {
    if (completed) {
      const status = panel.querySelector(
        `.exercise-status[data-exercise="${index}"] .status-icon`,
      );
      if (status) {
        status.textContent = "✓";
        status.style.color = "var(--success)";
      }
    }
  });

  // Update complete button
  const completeBtn = panel.querySelector(".btn-complete-lesson");
  if (completeBtn && progress.completed) {
    completeBtn.textContent = "✓ Completed";
    completeBtn.classList.add("completed");
  }
}

/**
 * Format category name
 * @param {string} category - Category slug
 * @returns {string} Formatted name
 */
function formatCategory(category) {
  const names = {
    fundamentals: "Fundamentals",
    "control-flow": "Control Flow",
    functions: "Functions",
    "data-structures": "Data Structures",
    oop: "OOP",
    "turtle-graphics": "Turtle Graphics",
    advanced: "Advanced",
  };
  return names[category] || category;
}

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Decode HTML entities
 * @param {string} html - HTML to decode
 * @returns {string} Decoded text
 */
function decodeHtml(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

/**
 * Get current lesson
 * @returns {Object|null} Current lesson or null
 */
export function getCurrentLesson() {
  return currentLesson;
}
