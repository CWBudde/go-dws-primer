/**
 * Lesson Navigation
 * Handles the lesson sidebar navigation
 */

import {
  getCategories,
  searchLessons,
  getLessonById,
} from "./lesson-loader.ts";
import { displayLesson } from "./lesson-ui.ts";
import {
  markLessonVisited,
  isLessonCompleted,
  getProgress,
} from "./progress.ts";

let currentCategories: any = null;

/**
 * Initialize lesson navigation
 */
export async function initLessonNavigation() {
  try {
    currentCategories = await getCategories();
    renderLessonList(currentCategories);
    setupNavigationListeners();
  } catch (error) {
    console.error("Failed to initialize lesson navigation:", error);
  }
}

/**
 * Render the lesson list in the sidebar
 * @param {Object} categories - Categories object
 */
function renderLessonList(categories: any) {
  const listContainer = document.getElementById("lesson-list");
  if (!listContainer) {
    console.error("Lesson list container not found");
    return;
  }

  let html = "";

  // Render each category
  const categoriesList: any[] = Object.values(categories || {});
  categoriesList.forEach((category: any) => {
    html += `
      <div class="lesson-category" data-category="${category.name}">
        <div class="category-header">
          <h3>
            <span class="category-icon">▼</span>
            ${category.displayName}
          </h3>
          <span class="category-count">${category.count}</span>
        </div>
        <ul class="lesson-list">
          ${category.lessons.map((lesson) => renderLessonItem(lesson)).join("")}
        </ul>
      </div>
    `;
  });

  listContainer.innerHTML = html;

  // Update completion indicators
  updateCompletionIndicators();
}

/**
 * Render a single lesson item
 * @param {Object} lesson - Lesson object
 * @returns {string} HTML string
 */
function renderLessonItem(lesson: any) {
  const completed = isLessonCompleted(lesson.id);
  const icon = completed ? "✓" : "○";

  return `
    <li class="lesson-item ${completed ? "completed" : ""}" data-lesson-id="${lesson.id}">
      <a href="#lesson/${lesson.id}" class="lesson-link">
        <span class="lesson-icon">${icon}</span>
        <span class="lesson-title">${lesson.title}</span>
        <span class="lesson-badge ${lesson.difficulty}">${lesson.difficulty[0].toUpperCase()}</span>
      </a>
    </li>
  `;
}

/**
 * Setup navigation event listeners
 */
function setupNavigationListeners() {
  const listContainer = document.getElementById("lesson-list");
  if (!listContainer) return;

  // Category toggle
  listContainer.addEventListener("click", (e) => {
    const target = e.target as HTMLElement | null;
    const header = target?.closest(".category-header");
    if (header) {
      const category = header.closest(".lesson-category");
      const list = category?.querySelector(".lesson-list") as
        | HTMLElement
        | null;
      const icon = category?.querySelector(".category-icon");

      if (list) {
        if (list.style.display === "none") {
          list.style.display = "block";
          if (icon) icon.textContent = "▼";
        } else {
          list.style.display = "none";
          if (icon) icon.textContent = "▶";
        }
      }
    }
  });

  // Lesson click
  listContainer.addEventListener("click", async (e) => {
    const target = e.target as HTMLElement | null;
    const link = target?.closest(".lesson-link");
    if (link) {
      e.preventDefault();
      const lessonId = link
        .closest(".lesson-item")
        .getAttribute("data-lesson-id");
      await loadLesson(lessonId);
    }
  });

  // Search input
  const searchInput = document.getElementById("lesson-search");
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener("input", (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(async () => {
        const input = e.target as HTMLInputElement | null;
        await handleSearch(input?.value || "");
      }, 300);
    });
  }

  // Listen for navigation events
  window.addEventListener("navigateLesson", async (e) => {
    const event = e as CustomEvent<{ direction: string }>;
    const { direction } = event.detail;
    await navigateLesson(direction);
  });

  // Listen for complete lesson events
  window.addEventListener("completeLesson", async (e) => {
    const event = e as CustomEvent<{ lessonId: string }>;
    const { lessonId } = event.detail;
    await handleCompleteLesson(lessonId);
  });

  // Listen for progress updates
  window.addEventListener("progressUpdated", () => {
    updateCompletionIndicators();
  });
}

/**
 * Load and display a lesson
 * @param {string} lessonId - Lesson ID
 */
async function loadLesson(lessonId) {
  try {
    const lesson = await getLessonById(lessonId);
    if (!lesson) {
      console.error("Lesson not found:", lessonId);
      return;
    }

    // Mark as visited
    markLessonVisited(lessonId);

    // Display the lesson
    displayLesson(lesson);

    // Update active state in sidebar
    document.querySelectorAll(".lesson-item").forEach((item) => {
      item.classList.remove("active");
    });
    const activeItem = document.querySelector(
      `.lesson-item[data-lesson-id="${lessonId}"]`,
    );
    if (activeItem) {
      activeItem.classList.add("active");
      activeItem.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    // Update URL (without page reload)
    history.pushState({ lessonId }, lesson.title, `#lesson/${lessonId}`);
  } catch (error) {
    console.error("Failed to load lesson:", error);
  }
}

/**
 * Navigate to next/previous lesson
 * @param {string} direction - 'next' or 'prev'
 */
async function navigateLesson(direction) {
  const progress = getProgress();
  const currentLessonId = progress.currentLesson;

  if (!currentLessonId) {
    console.warn("No current lesson");
    return;
  }

  try {
    const { getNextLesson, getPreviousLesson } = await import(
      "./lesson-loader.ts"
    );
    const lesson =
      direction === "next"
        ? await getNextLesson(currentLessonId)
        : await getPreviousLesson(currentLessonId);

    if (lesson) {
      await loadLesson(lesson.id);
    } else {
      console.log("No", direction, "lesson available");
    }
  } catch (error) {
    console.error("Failed to navigate lesson:", error);
  }
}

/**
 * Handle search
 * @param {string} query - Search query
 */
async function handleSearch(query) {
  const listContainer = document.getElementById("lesson-list");
  if (!listContainer) return;

  if (!query.trim()) {
    // Show all categories
    renderLessonList(currentCategories);
    return;
  }

  try {
    const results = await searchLessons(query);

    if (results.length === 0) {
      listContainer.innerHTML = `
        <div class="no-results">
          <p>No lessons found for "${query}"</p>
        </div>
      `;
      return;
    }

    // Group results by category
    const groupedResults = {};
    results.forEach((lesson) => {
      if (!groupedResults[lesson.category]) {
        groupedResults[lesson.category] = {
          name: lesson.category,
          displayName: currentCategories[lesson.category].displayName,
          lessons: [],
        };
      }
      groupedResults[lesson.category].lessons.push(lesson);
    });

    renderLessonList(groupedResults);
  } catch (error) {
    console.error("Search failed:", error);
  }
}

/**
 * Handle lesson completion
 * @param {string} lessonId - Lesson ID
 */
async function handleCompleteLesson(lessonId) {
  const { markLessonCompleted } = await import("./progress.ts");
  markLessonCompleted(lessonId);

  // Update UI
  updateCompletionIndicators();

  // Show success message
  showCompletionMessage();

  // Suggest next lesson
  const { getNextLesson } = await import("./lesson-loader.ts");
  const nextLesson = await getNextLesson(lessonId);

  if (nextLesson) {
    setTimeout(() => {
      if (
        confirm(`Great job! Ready for the next lesson: "${nextLesson.title}"?`)
      ) {
        loadLesson(nextLesson.id);
      }
    }, 1000);
  }
}

/**
 * Update completion indicators in the sidebar
 */
function updateCompletionIndicators() {
  document.querySelectorAll(".lesson-item").forEach((item) => {
    const lessonId = item.getAttribute("data-lesson-id");
    const completed = isLessonCompleted(lessonId);
    const icon = item.querySelector(".lesson-icon");

    if (completed) {
      item.classList.add("completed");
      if (icon) icon.textContent = "✓";
    } else {
      item.classList.remove("completed");
      if (icon) icon.textContent = "○";
    }
  });
}

/**
 * Show completion message
 */
function showCompletionMessage() {
  const message = document.createElement("div");
  message.className = "completion-toast";
  message.innerHTML = `
    <div class="toast-content">
      <span class="toast-icon">🎉</span>
      <span>Lesson completed!</span>
    </div>
  `;
  document.body.appendChild(message);

  setTimeout(() => {
    message.classList.add("show");
  }, 10);

  setTimeout(() => {
    message.classList.remove("show");
    setTimeout(() => message.remove(), 300);
  }, 3000);
}

/**
 * Load lesson from URL hash
 */
export async function loadLessonFromURL() {
  const hash = window.location.hash;
  if (hash.startsWith("#lesson/")) {
    const lessonId = hash.substring(8);
    await loadLesson(lessonId);
  } else {
    // Load first lesson by default
    if (currentCategories) {
      const categoriesList = Object.values(currentCategories || {}) as any[];
      const firstCategory = categoriesList[0] as any;
      if (firstCategory && firstCategory.lessons.length > 0) {
        await loadLesson(firstCategory.lessons[0].id);
      }
    }
  }
}

/**
 * Handle browser back/forward
 */
window.addEventListener("popstate", (e) => {
  if (e.state && e.state.lessonId) {
    loadLesson(e.state.lessonId);
  }
});
