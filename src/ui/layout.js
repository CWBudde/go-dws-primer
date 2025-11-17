/**
 * UI Layout Manager
 * Handles resizable panels and layout adjustments
 */

/**
 * Setup UI components and interactions
 */
export function setupUI() {
  setupResizers();
  addCompilerStyles();
}

/**
 * Setup resizable panel functionality
 */
function setupResizers() {
  const resizers = document.querySelectorAll('.resizer');

  resizers.forEach(resizer => {
    let isResizing = false;
    let startPos = 0;
    let startSize = 0;
    let targetElement = null;

    resizer.addEventListener('mousedown', (e) => {
      isResizing = true;
      startPos = resizer.classList.contains('vertical') ? e.clientX : e.clientY;

      // Determine which element to resize
      if (resizer.id === 'sidebar-resizer') {
        targetElement = document.querySelector('.sidebar');
        startSize = targetElement.offsetWidth;
      } else if (resizer.id === 'editor-resizer') {
        targetElement = document.querySelector('.editor-section');
        startSize = targetElement.offsetWidth;
      } else if (resizer.id === 'lesson-resizer') {
        targetElement = document.querySelector('.lesson-panel');
        startSize = targetElement.offsetHeight;
      }

      document.body.style.cursor = resizer.classList.contains('vertical') ? 'col-resize' : 'row-resize';
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isResizing || !targetElement) return;

      if (resizer.classList.contains('vertical')) {
        // Horizontal resize
        const delta = e.clientX - startPos;
        const newWidth = startSize + delta;
        if (newWidth > 200 && newWidth < window.innerWidth - 200) {
          targetElement.style.width = `${newWidth}px`;
        }
      } else {
        // Vertical resize
        const delta = e.clientY - startPos;
        const newHeight = startSize + delta;
        if (newHeight > 100 && newHeight < window.innerHeight - 300) {
          targetElement.style.height = `${newHeight}px`;
        }
      }
    });

    document.addEventListener('mouseup', () => {
      if (isResizing) {
        isResizing = false;
        targetElement = null;
        document.body.style.cursor = '';
      }
    });
  });
}

/**
 * Add styles for compiler output messages
 */
function addCompilerStyles() {
  // Add dynamic styles for compiler messages
  const style = document.createElement('style');
  style.textContent = `
    .compiler-message {
      padding: 4px 0;
      font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
      font-size: 13px;
    }

    .compiler-info {
      color: var(--text-secondary);
    }

    .compiler-success {
      color: var(--success);
      font-weight: 500;
    }

    .compiler-warning {
      color: var(--warning);
    }

    .compiler-error {
      color: var(--error);
      font-weight: 500;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Toggle sidebar visibility
 */
export function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  if (sidebar) {
    sidebar.style.display = sidebar.style.display === 'none' ? 'flex' : 'none';
  }
}

/**
 * Toggle lesson panel visibility
 */
export function toggleLessonPanel() {
  const panel = document.querySelector('.lesson-panel');
  if (panel) {
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
  }
}
