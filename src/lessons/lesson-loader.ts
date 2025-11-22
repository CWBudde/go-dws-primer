/**
 * Lesson Loader
 * Handles loading and managing lesson content
 */

let lessonsCache: any[] | null = null;
let lessonIndex: Map<string, number> | null = null;

/**
 * Load all lessons from the content directory
 * @returns {Promise<Array>} Array of lesson objects
 */
export async function loadAllLessons() {
  if (lessonsCache) {
    return lessonsCache;
  }

  try {
    // In a real implementation, this would load from actual files
    // For now, we'll use a hardcoded lesson index
    const response = await fetch("/content/lessons/index.json");

    if (!response.ok) {
      // Fallback to default lessons if index.json doesn't exist
      console.warn("Lesson index not found, using defaults");
      lessonsCache = getDefaultLessons();
      buildLessonIndex();
      return lessonsCache;
    }

    const index: any = await response.json();
    const lessonPaths: string[] = Array.isArray(index?.lessons)
      ? index.lessons
      : [];

    // Load each lesson file
    const lessonPromises = lessonPaths.map(async (lessonPath) => {
      try {
        const lessonResponse = await fetch(lessonPath);
        if (lessonResponse.ok) {
          return await lessonResponse.json();
        }
        return null;
      } catch (error) {
        console.error(`Failed to load lesson: ${lessonPath}`, error);
        return null;
      }
    });

    const lessons = (await Promise.all(lessonPromises)).filter(
      (l) => l !== null,
    );
    lessonsCache = lessons;
    buildLessonIndex();

    return lessons;
  } catch (error) {
    console.error("Failed to load lessons:", error);
    lessonsCache = getDefaultLessons();
    buildLessonIndex();
    return lessonsCache;
  }
}

/**
 * Get a specific lesson by ID
 * @param {string} lessonId - Lesson ID
 * @returns {Promise<Object|null>} Lesson object or null
 */
export async function getLessonById(lessonId) {
  const lessons = await loadAllLessons();
  return lessons.find((lesson) => lesson.id === lessonId) || null;
}

/**
 * Get lessons by category
 * @param {string} category - Category name
 * @returns {Promise<Array>} Array of lessons in category
 */
export async function getLessonsByCategory(category) {
  const lessons = await loadAllLessons();
  return lessons
    .filter((lesson) => lesson.category === category)
    .sort((a, b) => (a.order || 0) - (b.order || 0));
}

/**
 * Get all categories with lesson counts
 * @returns {Promise<Object>} Object mapping categories to lesson counts
 */
export async function getCategories() {
  const lessons = await loadAllLessons();
  const categories = {};

  lessons.forEach((lesson) => {
    if (!categories[lesson.category]) {
      categories[lesson.category] = {
        name: lesson.category,
        displayName: formatCategoryName(lesson.category),
        count: 0,
        lessons: [],
      };
    }
    categories[lesson.category].count++;
    categories[lesson.category].lessons.push(lesson);
  });

  // Sort lessons within each category
  Object.values(categories).forEach((cat: any) => {
    cat.lessons.sort((a, b) => (a.order || 0) - (b.order || 0));
  });

  return categories;
}

/**
 * Search lessons by query
 * @param {string} query - Search query
 * @returns {Promise<Array>} Matching lessons
 */
export async function searchLessons(query) {
  const lessons = await loadAllLessons();
  const lowerQuery = query.toLowerCase();

  return lessons.filter((lesson) => {
    return (
      lesson.title.toLowerCase().includes(lowerQuery) ||
      lesson.description?.toLowerCase().includes(lowerQuery) ||
      lesson.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  });
}

/**
 * Get next lesson in sequence
 * @param {string} currentLessonId - Current lesson ID
 * @returns {Promise<Object|null>} Next lesson or null
 */
export async function getNextLesson(currentLessonId) {
  if (!lessonIndex) {
    await loadAllLessons();
  }

  const currentIndex = lessonIndex.get(currentLessonId);
  if (currentIndex === undefined) return null;

  const lessons = lessonsCache;
  if (currentIndex + 1 < lessons.length) {
    return lessons[currentIndex + 1];
  }

  return null;
}

/**
 * Get previous lesson in sequence
 * @param {string} currentLessonId - Current lesson ID
 * @returns {Promise<Object|null>} Previous lesson or null
 */
export async function getPreviousLesson(currentLessonId) {
  if (!lessonIndex) {
    await loadAllLessons();
  }

  const currentIndex = lessonIndex.get(currentLessonId);
  if (currentIndex === undefined) return null;

  if (currentIndex > 0) {
    return lessonsCache[currentIndex - 1];
  }

  return null;
}

/**
 * Build internal lesson index for quick lookups
 */
function buildLessonIndex() {
  lessonIndex = new Map();
  lessonsCache.forEach((lesson, index) => {
    lessonIndex.set(lesson.id, index);
  });
}

/**
 * Format category name for display
 * @param {string} category - Category slug
 * @returns {string} Formatted name
 */
function formatCategoryName(category) {
  const names = {
    fundamentals: "Fundamentals",
    "control-flow": "Control Flow",
    functions: "Functions & Procedures",
    "data-structures": "Data Structures",
    oop: "Object-Oriented Programming",
    "turtle-graphics": "Turtle Graphics",
    advanced: "Advanced Topics",
  };
  return names[category] || category;
}

/**
 * Get default lessons (fallback)
 * @returns {Array} Default lesson set
 */
function getDefaultLessons() {
  return [
    {
      id: "hello-world",
      title: "Hello World - Your First Program",
      category: "fundamentals",
      difficulty: "beginner",
      order: 1,
      description: "Learn to write your first DWScript program",
      estimatedTime: 10,
      tags: ["basics", "beginner", "output"],
      content: {
        introduction: `Welcome to DWScript! In this lesson, you'll write your first program and learn about basic output.

Every program starts somewhere, and the traditional first program is "Hello World!" - a simple program that displays text on the screen.`,
        concepts: [
          {
            title: "Program Structure",
            description:
              "DWScript programs have a clear structure with BEGIN and END blocks",
          },
          {
            title: "WriteLn Command",
            description:
              "WriteLn outputs text to the console followed by a new line",
          },
        ],
        examples: [
          {
            title: "Basic Hello World",
            description: "The simplest DWScript program",
            code: `program HelloWorld;

begin
  WriteLn('Hello, World!');
end.`,
            expectedOutput: "Hello, World!",
          },
          {
            title: "Multiple Lines",
            description: "Output multiple lines of text",
            code: `program MultipleLines;

begin
  WriteLn('Welcome to DWScript!');
  WriteLn('This is line 2');
  WriteLn('This is line 3');
end.`,
            expectedOutput:
              "Welcome to DWScript!\nThis is line 2\nThis is line 3",
          },
        ],
        exercises: [
          {
            title: "Write Your Own Message",
            description:
              "Modify the program to output your name and a greeting message",
            starterCode: `program MyProgram;

begin
  // Write your code here
end.`,
            hints: [
              "Use WriteLn to output text",
              "You can use multiple WriteLn statements",
              "Remember to use quotes around text",
            ],
          },
        ],
        summary:
          "You learned how to create a basic DWScript program and use WriteLn to display output.",
        nextSteps:
          "Next, you'll learn about variables and how to store data in your programs.",
      },
    },
  ];
}

/**
 * Clear the lesson cache (useful for development)
 */
export function clearLessonCache() {
  lessonsCache = null;
  lessonIndex = null;
}
