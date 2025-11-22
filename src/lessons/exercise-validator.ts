/**
 * Exercise Validator
 * Validates user code output against expected results
 */

/**
 * Normalize output for comparison
 * @param {string} output - Output string to normalize
 * @returns {string} Normalized output
 */
function normalizeOutput(output) {
  if (!output) return "";

  return output
    .trim()
    .replace(/\r\n/g, "\n") // Normalize line endings
    .replace(/\s+$/gm, "") // Remove trailing whitespace from each line
    .toLowerCase(); // Case-insensitive comparison
}

/**
 * Compare actual output with expected output
 * @param {string} actual - Actual program output
 * @param {string} expected - Expected output
 * @param {Object} options - Comparison options
 * @returns {Object} Comparison result
 */
export function compareOutput(actual, expected, options: any = {}) {
  const {
    caseSensitive = false,
    ignoreWhitespace = true,
    exactMatch: _exactMatch = false,
  } = options;

  let actualNorm = actual || "";
  let expectedNorm = expected || "";

  // Apply normalization based on options
  if (!caseSensitive) {
    actualNorm = actualNorm.toLowerCase();
    expectedNorm = expectedNorm.toLowerCase();
  }

  if (ignoreWhitespace) {
    actualNorm = normalizeOutput(actualNorm);
    expectedNorm = normalizeOutput(expectedNorm);
  }

  const matches = actualNorm === expectedNorm;

  return {
    success: matches,
    actual: actual,
    expected: expected,
    actualNormalized: actualNorm,
    expectedNormalized: expectedNorm,
    differences: matches ? [] : findDifferences(actualNorm, expectedNorm),
  };
}

/**
 * Find differences between two strings (line by line)
 * @param {string} actual - Actual output
 * @param {string} expected - Expected output
 * @returns {Array} Array of difference objects
 */
function findDifferences(actual, expected) {
  const actualLines = actual.split("\n");
  const expectedLines = expected.split("\n");
  const maxLines = Math.max(actualLines.length, expectedLines.length);
  const differences = [];

  for (let i = 0; i < maxLines; i++) {
    const actualLine = actualLines[i] || "";
    const expectedLine = expectedLines[i] || "";

    if (actualLine !== expectedLine) {
      differences.push({
        line: i + 1,
        actual: actualLine,
        expected: expectedLine,
        type: !actualLine ? "missing" : !expectedLine ? "extra" : "different",
      });
    }
  }

  return differences;
}

/**
 * Run tests for an exercise
 * @param {Function} executeFunc - Function that executes code and returns output
 * @param {string} code - User's code
 * @param {Array} tests - Array of test cases
 * @returns {Promise<Object>} Test results
 */
export async function runExerciseTests(executeFunc, code, tests) {
  if (!tests || tests.length === 0) {
    return {
      success: true,
      message: "No tests defined",
      results: [],
    };
  }

  const results = [];
  let allPassed = true;

  for (let i = 0; i < tests.length; i++) {
    const test = tests[i];

    try {
      // Execute the code (with input if provided)
      const result = await executeFunc(code, test.input);

      if (!result.success) {
        results.push({
          testNumber: i + 1,
          passed: false,
          error: result.error?.message || "Execution failed",
          input: test.input,
          expectedOutput: test.expectedOutput,
        });
        allPassed = false;
        continue;
      }

      // Compare output
      const comparison = compareOutput(result.output, test.expectedOutput, {
        caseSensitive: test.caseSensitive || false,
        ignoreWhitespace: test.ignoreWhitespace !== false,
      });

      results.push({
        testNumber: i + 1,
        passed: comparison.success,
        input: test.input,
        actualOutput: result.output,
        expectedOutput: test.expectedOutput,
        differences: comparison.differences,
      });

      if (!comparison.success) {
        allPassed = false;
      }
    } catch (error) {
      results.push({
        testNumber: i + 1,
        passed: false,
        error: error.message,
        input: test.input,
        expectedOutput: test.expectedOutput,
      });
      allPassed = false;
    }
  }

  return {
    success: allPassed,
    totalTests: tests.length,
    passedTests: results.filter((r) => r.passed).length,
    results: results,
  };
}

/**
 * Validate exercise completion criteria
 * @param {Object} exercise - Exercise object
 * @param {string} userCode - User's code
 * @param {string} output - Program output
 * @returns {Object} Validation result
 */
export function validateExercise(exercise, userCode, output) {
  // Check if exercise has expected output defined
  if (exercise.expectedOutput) {
    const comparison = compareOutput(output, exercise.expectedOutput);
    return {
      type: "output",
      ...comparison,
    };
  }

  // Check if exercise has tests defined
  if (exercise.tests && exercise.tests.length > 0) {
    return {
      type: "tests",
      message: "Run tests to validate your solution",
    };
  }

  // If no validation criteria, consider it complete if it runs
  return {
    type: "completion",
    success: true,
    message:
      "Exercise completed! Make sure your code produces the expected behavior.",
  };
}

/**
 * Format test results for display
 * @param {Object} testResults - Results from runExerciseTests
 * @returns {string} Formatted HTML
 */
export function formatTestResults(testResults) {
  if (!testResults || !testResults.results) {
    return "<p>No test results available</p>";
  }

  const { success, totalTests, passedTests, results } = testResults;

  let html = `
    <div class="test-results ${success ? "success" : "failure"}">
      <div class="test-summary">
        <h4>${success ? "✓ All tests passed!" : "✗ Some tests failed"}</h4>
        <p>Passed: ${passedTests}/${totalTests}</p>
      </div>
      <div class="test-details">
  `;

  results.forEach((result) => {
    html += `
      <div class="test-result ${result.passed ? "passed" : "failed"}">
        <div class="test-header">
          <span class="test-icon">${result.passed ? "✓" : "✗"}</span>
          <span class="test-title">Test ${result.testNumber}</span>
        </div>
    `;

    if (result.input) {
      html += `<div class="test-input"><strong>Input:</strong> ${escapeHtml(result.input)}</div>`;
    }

    if (result.error) {
      html += `<div class="test-error"><strong>Error:</strong> ${escapeHtml(result.error)}</div>`;
    } else if (!result.passed) {
      html += `
        <div class="test-output">
          <div><strong>Expected:</strong> <pre>${escapeHtml(result.expectedOutput)}</pre></div>
          <div><strong>Got:</strong> <pre>${escapeHtml(result.actualOutput)}</pre></div>
        </div>
      `;

      if (result.differences && result.differences.length > 0) {
        html += `<div class="test-differences"><strong>Differences:</strong>`;
        result.differences.forEach((diff) => {
          html += `<div>Line ${diff.line}: Expected "${escapeHtml(diff.expected)}", got "${escapeHtml(diff.actual)}"</div>`;
        });
        html += `</div>`;
      }
    }

    html += `</div>`;
  });

  html += `</div></div>`;
  return html;
}

/**
 * Format output comparison for display
 * @param {Object} comparison - Comparison result
 * @returns {string} Formatted HTML
 */
export function formatOutputComparison(comparison) {
  if (comparison.success) {
    return `
      <div class="output-comparison success">
        <div class="comparison-header">
          <span class="comparison-icon">✓</span>
          <span class="comparison-title">Output matches expected!</span>
        </div>
      </div>
    `;
  }

  let html = `
    <div class="output-comparison failure">
      <div class="comparison-header">
        <span class="comparison-icon">✗</span>
        <span class="comparison-title">Output doesn't match expected</span>
      </div>
      <div class="comparison-details">
        <div class="expected-output">
          <strong>Expected:</strong>
          <pre>${escapeHtml(comparison.expected)}</pre>
        </div>
        <div class="actual-output">
          <strong>Your Output:</strong>
          <pre>${escapeHtml(comparison.actual)}</pre>
        </div>
  `;

  if (comparison.differences && comparison.differences.length > 0) {
    html += `
      <div class="differences">
        <strong>Differences:</strong>
        <ul>
    `;

    comparison.differences.forEach((diff) => {
      const icon =
        diff.type === "missing" ? "−" : diff.type === "extra" ? "+" : "≠";
      html += `
        <li class="diff-${diff.type}">
          <span class="diff-icon">${icon}</span>
          Line ${diff.line}:
          ${diff.type === "missing" ? "Missing: " : diff.type === "extra" ? "Extra: " : ""}
          Expected "<code>${escapeHtml(diff.expected)}</code>",
          got "<code>${escapeHtml(diff.actual)}</code>"
        </li>
      `;
    });

    html += `</ul></div>`;
  }

  html += `</div></div>`;
  return html;
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
