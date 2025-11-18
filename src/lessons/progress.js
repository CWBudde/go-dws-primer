/**
 * Progress Tracking
 * Manages user progress through lessons
 */

const STORAGE_KEY = "dwscript-primer-progress";

/**
 * Progress data structure
 * @typedef {Object} Progress
 * @property {Object<string, LessonProgress>} lessons - Map of lesson IDs to progress
 * @property {string} currentLesson - Current lesson ID
 * @property {number} totalTime - Total time spent (minutes)
 * @property {Date} lastAccessed - Last access timestamp
 */

/**
 * Lesson progress structure
 * @typedef {Object} LessonProgress
 * @property {boolean} completed - Whether lesson is completed
 * @property {number} timeSpent - Time spent on lesson (minutes)
 * @property {Date} completedAt - Completion timestamp
 * @property {Date} lastVisited - Last visit timestamp
 * @property {Array<boolean>} exercisesCompleted - Exercise completion status
 * @property {number} score - Optional score (0-100)
 */

/**
 * Get user progress from localStorage
 * @returns {Progress} Progress object
 */
export function getProgress() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const progress = JSON.parse(stored);
      // Convert date strings back to Date objects
      if (progress.lastAccessed) {
        progress.lastAccessed = new Date(progress.lastAccessed);
      }
      Object.values(progress.lessons || {}).forEach((lesson) => {
        if (lesson.completedAt)
          lesson.completedAt = new Date(lesson.completedAt);
        if (lesson.lastVisited)
          lesson.lastVisited = new Date(lesson.lastVisited);
      });
      return progress;
    }
  } catch (error) {
    console.error("Failed to load progress:", error);
  }

  return {
    lessons: {},
    currentLesson: null,
    totalTime: 0,
    lastAccessed: new Date(),
  };
}

/**
 * Save progress to localStorage
 * @param {Progress} progress - Progress object to save
 */
export function saveProgress(progress) {
  try {
    progress.lastAccessed = new Date();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));

    // Dispatch event for UI updates
    window.dispatchEvent(
      new CustomEvent("progressUpdated", {
        detail: progress,
      }),
    );
  } catch (error) {
    console.error("Failed to save progress:", error);
  }
}

/**
 * Mark a lesson as visited
 * @param {string} lessonId - Lesson ID
 */
export function markLessonVisited(lessonId) {
  const progress = getProgress();

  if (!progress.lessons[lessonId]) {
    progress.lessons[lessonId] = {
      completed: false,
      timeSpent: 0,
      exercisesCompleted: [],
    };
  }

  progress.lessons[lessonId].lastVisited = new Date();
  progress.currentLesson = lessonId;

  saveProgress(progress);
}

/**
 * Mark a lesson as completed
 * @param {string} lessonId - Lesson ID
 * @param {number} score - Optional score (0-100)
 */
export function markLessonCompleted(lessonId, score = null) {
  const progress = getProgress();

  if (!progress.lessons[lessonId]) {
    progress.lessons[lessonId] = {
      timeSpent: 0,
      exercisesCompleted: [],
    };
  }

  progress.lessons[lessonId].completed = true;
  progress.lessons[lessonId].completedAt = new Date();

  if (score !== null) {
    progress.lessons[lessonId].score = score;
  }

  saveProgress(progress);
}

/**
 * Mark an exercise as completed
 * @param {string} lessonId - Lesson ID
 * @param {number} exerciseIndex - Exercise index
 */
export function markExerciseCompleted(lessonId, exerciseIndex) {
  const progress = getProgress();

  if (!progress.lessons[lessonId]) {
    progress.lessons[lessonId] = {
      completed: false,
      timeSpent: 0,
      exercisesCompleted: [],
    };
  }

  progress.lessons[lessonId].exercisesCompleted[exerciseIndex] = true;

  saveProgress(progress);
}

/**
 * Add time to a lesson
 * @param {string} lessonId - Lesson ID
 * @param {number} minutes - Minutes to add
 */
export function addLessonTime(lessonId, minutes) {
  const progress = getProgress();

  if (!progress.lessons[lessonId]) {
    progress.lessons[lessonId] = {
      completed: false,
      timeSpent: 0,
      exercisesCompleted: [],
    };
  }

  progress.lessons[lessonId].timeSpent += minutes;
  progress.totalTime += minutes;

  saveProgress(progress);
}

/**
 * Get lesson progress
 * @param {string} lessonId - Lesson ID
 * @returns {LessonProgress|null} Lesson progress or null
 */
export function getLessonProgress(lessonId) {
  const progress = getProgress();
  return progress.lessons[lessonId] || null;
}

/**
 * Check if a lesson is completed
 * @param {string} lessonId - Lesson ID
 * @returns {boolean} True if completed
 */
export function isLessonCompleted(lessonId) {
  const lessonProgress = getLessonProgress(lessonId);
  return lessonProgress ? lessonProgress.completed : false;
}

/**
 * Get completion percentage
 * @param {number} totalLessons - Total number of lessons
 * @returns {number} Completion percentage (0-100)
 */
export function getCompletionPercentage(totalLessons) {
  if (totalLessons === 0) return 0;

  const progress = getProgress();
  const completed = Object.values(progress.lessons).filter(
    (l) => l.completed,
  ).length;

  return Math.round((completed / totalLessons) * 100);
}

/**
 * Get statistics
 * @returns {Object} Progress statistics
 */
export function getStatistics() {
  const progress = getProgress();
  const lessons = Object.values(progress.lessons);

  return {
    totalLessons: lessons.length,
    completedLessons: lessons.filter((l) => l.completed).length,
    totalTime: progress.totalTime,
    lastAccessed: progress.lastAccessed,
    currentLesson: progress.currentLesson,
    averageScore: calculateAverageScore(lessons),
  };
}

/**
 * Calculate average score
 * @param {Array<LessonProgress>} lessons - Lesson progress array
 * @returns {number|null} Average score or null
 */
function calculateAverageScore(lessons) {
  const scored = lessons.filter(
    (l) => l.score !== undefined && l.score !== null,
  );
  if (scored.length === 0) return null;

  const sum = scored.reduce((acc, l) => acc + l.score, 0);
  return Math.round(sum / scored.length);
}

/**
 * Reset all progress
 */
export function resetProgress() {
  if (
    confirm(
      "Are you sure you want to reset all progress? This cannot be undone.",
    )
  ) {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("progressReset"));
  }
}

/**
 * Export progress as JSON
 * @returns {string} JSON string of progress
 */
export function exportProgress() {
  const progress = getProgress();
  return JSON.stringify(progress, null, 2);
}

/**
 * Import progress from JSON
 * @param {string} json - JSON string of progress
 * @returns {boolean} Success status
 */
export function importProgress(json) {
  try {
    const progress = JSON.parse(json);
    saveProgress(progress);
    return true;
  } catch (error) {
    console.error("Failed to import progress:", error);
    return false;
  }
}
