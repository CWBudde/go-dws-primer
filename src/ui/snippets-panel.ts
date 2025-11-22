/**
 * Code Snippets Panel
 * Manages and displays reusable code snippets
 */

import { setCode, getCode } from "../editor/monaco-setup.ts";

let snippetsData = null;
let currentCategory = null;
let searchQuery = "";

/**
 * Initialize snippets panel
 */
export async function initSnippetsPanel() {
  // Load snippets data
  await loadSnippets();

  // Create snippets button in toolbar
  addSnippetsButton();

  // Set up event listeners
  setupEventListeners();
}

/**
 * Load snippets from JSON file
 */
async function loadSnippets() {
  try {
    const response = await fetch("/content/snippets/snippets.json");
    snippetsData = await response.json();
  } catch (error) {
    console.error("Failed to load snippets:", error);
    snippetsData = { categories: [] };
  }
}

/**
 * Add snippets button to toolbar
 */
function addSnippetsButton() {
  const toolbar = document.querySelector(".editor-section .toolbar");
  if (!toolbar) return;

  const btnSnippets = document.createElement("button");
  btnSnippets.id = "btn-snippets";
  btnSnippets.className = "btn btn-secondary";
  btnSnippets.innerHTML = '<span class="icon">📋</span> Snippets';
  btnSnippets.title = "Browse code snippets";

  // Append to toolbar
  toolbar.appendChild(btnSnippets);
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
  const btnSnippets = document.getElementById("btn-snippets");
  if (btnSnippets) {
    btnSnippets.addEventListener("click", () => openSnippetsModal());
  }
}

/**
 * Open snippets modal
 */
function openSnippetsModal() {
  // Create modal
  const modal = createSnippetsModal();
  document.body.appendChild(modal);

  // Show modal
  setTimeout(() => modal.classList.add("show"), 10);

  // Focus search input
  const searchInput = modal.querySelector<HTMLInputElement>(".snippets-search");
  searchInput?.focus();

  // Display first category by default
  if (snippetsData.categories.length > 0) {
    displayCategory(snippetsData.categories[0].id);
  }
}

/**
 * Create snippets modal
 */
function createSnippetsModal() {
  const modal = document.createElement("div");
  modal.className = "modal snippets-modal";
  modal.innerHTML = `
    <div class="modal-overlay"></div>
    <div class="modal-content snippets-content">
      <div class="modal-header">
        <h2>Code Snippets</h2>
        <button class="btn-close">×</button>
      </div>
      <div class="modal-body">
        <div class="snippets-search-bar">
          <input type="text" class="snippets-search" placeholder="Search snippets...">
        </div>
        <div class="snippets-layout">
          <div class="snippets-sidebar">
            ${renderCategories()}
          </div>
          <div class="snippets-main">
            <div class="snippets-list"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Event listeners
  const closeBtn = modal.querySelector(".btn-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => closeModal(modal));
  }
  const overlay = modal.querySelector(".modal-overlay");
  if (overlay) {
    overlay.addEventListener("click", () => closeModal(modal));
  }

  // Search functionality
  const searchInput = modal.querySelector<HTMLInputElement>(".snippets-search");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const target = e.target as HTMLInputElement | null;
      searchQuery = target?.value || "";
      filterSnippets();
    });
  }

  // Category buttons
  modal.querySelectorAll<HTMLElement>(".category-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const target = e.target as HTMLElement | null;
      const categoryId = target?.getAttribute("data-category");
      if (!categoryId) return;
      displayCategory(categoryId);

      // Update active state
      modal
        .querySelectorAll(".category-btn")
        .forEach((b) => b.classList.remove("active"));
      target.classList.add("active");
    });
  });

  return modal;
}

/**
 * Render categories sidebar
 */
function renderCategories() {
  if (!snippetsData || !snippetsData.categories) return "";

  return `
    <div class="categories-list">
      ${snippetsData.categories
        .map(
          (category) => `
        <button class="category-btn" data-category="${category.id}">
          <span class="category-icon">${category.icon}</span>
          <span class="category-name">${category.name}</span>
          <span class="category-count">${category.snippets.length}</span>
        </button>
      `,
        )
        .join("")}
    </div>
  `;
}

/**
 * Display snippets for a category
 */
function displayCategory(categoryId) {
  currentCategory = categoryId;
  searchQuery = "";

  const category = snippetsData.categories.find((c) => c.id === categoryId);
  if (!category) return;

  const snippetsList = document.querySelector(".snippets-list");
  if (!snippetsList) return;

  snippetsList.innerHTML = `
    <div class="category-header">
      <h3>${category.icon} ${category.name}</h3>
      <p>${category.snippets.length} snippets</p>
    </div>
    <div class="snippets-grid">
      ${category.snippets.map((snippet) => renderSnippet(snippet)).join("")}
    </div>
  `;

  // Add event listeners to snippet cards
  attachSnippetEventListeners();
}

/**
 * Render a snippet card
 */
function renderSnippet(snippet) {
  return `
    <div class="snippet-card" data-snippet-id="${snippet.id}">
      <div class="snippet-header">
        <h4>${snippet.title}</h4>
        <div class="snippet-tags">
          ${snippet.tags
            .slice(0, 2)
            .map((tag) => `<span class="tag">${tag}</span>`)
            .join("")}
        </div>
      </div>
      <p class="snippet-description">${snippet.description}</p>
      <div class="snippet-preview">
        <pre><code>${escapeHtml(snippet.code.split("\n").slice(0, 4).join("\n"))}${snippet.code.split("\n").length > 4 ? "\n..." : ""}</code></pre>
      </div>
      <div class="snippet-actions">
        <button class="btn btn-sm btn-insert" data-code="${escapeHtml(snippet.code)}">
          Insert
        </button>
        <button class="btn btn-sm btn-view" data-code="${escapeHtml(snippet.code)}" data-title="${escapeHtml(snippet.title)}">
          View
        </button>
      </div>
    </div>
  `;
}

/**
 * Attach event listeners to snippet cards
 */
function attachSnippetEventListeners() {
  // Insert buttons
  document.querySelectorAll<HTMLElement>(".snippet-card .btn-insert").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const target = e.target as HTMLElement | null;
      const code = decodeHtml(target?.getAttribute("data-code"));
      insertSnippet(code);
    });
  });

  // View buttons
  document.querySelectorAll<HTMLElement>(".snippet-card .btn-view").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const target = e.target as HTMLElement | null;
      const code = decodeHtml(target?.getAttribute("data-code"));
      const title = decodeHtml(target?.getAttribute("data-title"));
      viewSnippet(code, title);
    });
  });
}

/**
 * Insert snippet into editor
 * @param {string} code - Snippet code
 */
function insertSnippet(code) {
  const currentCode = getCode();
  const newCode = currentCode ? currentCode + "\n\n" + code : code;
  setCode(newCode);

  // Close modal
  const modal = document.querySelector(".snippets-modal");
  if (modal) {
    closeModal(modal);
  }

  // Show confirmation
  showNotification("Snippet inserted!");
}

/**
 * View full snippet in a preview modal
 * @param {string} code - Snippet code
 * @param {string} title - Snippet title
 */
function viewSnippet(code, title) {
  const preview = document.createElement("div");
  preview.className = "modal snippet-preview-modal";
  preview.innerHTML = `
    <div class="modal-overlay"></div>
    <div class="modal-content">
      <div class="modal-header">
        <h2>${title}</h2>
        <button class="btn-close">×</button>
      </div>
      <div class="modal-body">
        <pre><code class="language-pascal">${escapeHtml(code)}</code></pre>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary btn-cancel">Close</button>
        <button class="btn btn-primary btn-insert-preview" data-code="${escapeHtml(code)}">Insert</button>
      </div>
    </div>
  `;

  document.body.appendChild(preview);
  setTimeout(() => preview.classList.add("show"), 10);

  // Event listeners
  const closeBtn = preview.querySelector(".btn-close");
  closeBtn?.addEventListener("click", () => closeModal(preview));
  const overlay = preview.querySelector(".modal-overlay");
  overlay?.addEventListener("click", () => closeModal(preview));
  const cancelBtn = preview.querySelector(".btn-cancel");
  cancelBtn?.addEventListener("click", () => closeModal(preview));
  const insertBtn = preview.querySelector(".btn-insert-preview");
  insertBtn?.addEventListener("click", (e) => {
    const target = e.target as HTMLElement | null;
    const codeValue = decodeHtml(target?.getAttribute("data-code"));
    insertSnippet(codeValue);
    closeModal(preview);
  });
}

/**
 * Filter snippets by search query
 */
function filterSnippets() {
  if (!searchQuery) {
    if (currentCategory) {
      displayCategory(currentCategory);
    }
    return;
  }

  const query = searchQuery.toLowerCase();
  const allSnippets = [];

  // Search across all categories
  snippetsData.categories.forEach((category) => {
    category.snippets.forEach((snippet) => {
      const matchesTitle = snippet.title.toLowerCase().includes(query);
      const matchesDescription = snippet.description
        .toLowerCase()
        .includes(query);
      const matchesTags = snippet.tags.some((tag) =>
        tag.toLowerCase().includes(query),
      );
      const matchesCode = snippet.code.toLowerCase().includes(query);

      if (matchesTitle || matchesDescription || matchesTags || matchesCode) {
        allSnippets.push({
          ...snippet,
          categoryName: category.name,
          categoryIcon: category.icon,
        });
      }
    });
  });

  const snippetsList = document.querySelector(".snippets-list");
  if (!snippetsList) return;

  if (allSnippets.length === 0) {
    snippetsList.innerHTML = `
      <div class="no-results">
        <p>No snippets found for "${escapeHtml(searchQuery)}"</p>
      </div>
    `;
    return;
  }

  snippetsList.innerHTML = `
    <div class="category-header">
      <h3>Search Results</h3>
      <p>${allSnippets.length} snippets found</p>
    </div>
    <div class="snippets-grid">
      ${allSnippets.map((snippet) => renderSnippet(snippet)).join("")}
    </div>
  `;

  attachSnippetEventListeners();
}

/**
 * Close modal
 * @param {HTMLElement} modal - Modal element
 */
function closeModal(modal) {
  modal.classList.remove("show");
  setTimeout(() => modal.remove(), 300);
}

/**
 * Show notification toast
 * @param {string} message - Notification message
 */
function showNotification(message) {
  const notification = document.createElement("div");
  notification.className = "snippet-notification";
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => notification.classList.add("show"), 10);
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  if (!text) return "";
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
  if (!html) return "";
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}
