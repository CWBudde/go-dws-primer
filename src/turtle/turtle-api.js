/**
 * Turtle Graphics API
 * DWScript bindings for turtle graphics functions
 */

import { TurtleEngine } from './turtle-engine.js';
import { AnimationController } from './animation.js';
import { exportAsPNG, exportAsSVG, drawGrid } from './canvas-renderer.js';

let turtleEngine = null;
let animationController = null;
let gridVisible = false;

/**
 * Initialize turtle graphics system
 * @param {HTMLCanvasElement} canvas
 */
export function initTurtle(canvas) {
  turtleEngine = new TurtleEngine(canvas);
  animationController = new AnimationController(turtleEngine);
  return turtleEngine;
}

/**
 * Get the turtle engine instance
 * @returns {TurtleEngine}
 */
export function getTurtle() {
  return turtleEngine;
}

/**
 * Get the animation controller
 * @returns {AnimationController}
 */
export function getAnimationController() {
  return animationController;
}

/**
 * Create global turtle API for DWScript
 * These functions will be exposed to the DWScript runtime
 */
export const TurtleAPI = {
  // Basic movement
  Forward: (distance) => {
    if (turtleEngine) turtleEngine.forward(Number(distance));
  },

  Backward: (distance) => {
    if (turtleEngine) turtleEngine.backward(Number(distance));
  },

  TurnLeft: (angle) => {
    if (turtleEngine) turtleEngine.turnLeft(Number(angle));
  },

  TurnRight: (angle) => {
    if (turtleEngine) turtleEngine.turnRight(Number(angle));
  },

  SetHeading: (angle) => {
    if (turtleEngine) turtleEngine.setHeading(Number(angle));
  },

  // Pen control
  PenUp: () => {
    if (turtleEngine) turtleEngine.penUp();
  },

  PenDown: () => {
    if (turtleEngine) turtleEngine.penDownCmd();
  },

  SetPenColor: (color) => {
    if (turtleEngine) turtleEngine.setPenColor(String(color));
  },

  SetPenWidth: (width) => {
    if (turtleEngine) turtleEngine.setPenWidth(Number(width));
  },

  SetFillColor: (color) => {
    if (turtleEngine) turtleEngine.setFillColor(String(color));
  },

  // Position and state
  Home: () => {
    if (turtleEngine) turtleEngine.home();
  },

  SetPosition: (x, y) => {
    if (turtleEngine) turtleEngine.setPosition(Number(x), Number(y));
  },

  GetX: () => {
    return turtleEngine ? turtleEngine.getX() : 0;
  },

  GetY: () => {
    return turtleEngine ? turtleEngine.getY() : 0;
  },

  GetHeading: () => {
    return turtleEngine ? turtleEngine.getHeading() : 0;
  },

  // Drawing shapes
  Circle: (radius) => {
    if (turtleEngine) turtleEngine.circle(Number(radius));
  },

  Arc: (radius, extent) => {
    if (turtleEngine) turtleEngine.arc(Number(radius), Number(extent));
  },

  Dot: (size) => {
    if (turtleEngine) turtleEngine.dot(size ? Number(size) : 5);
  },

  // Fill operations
  BeginFill: () => {
    if (turtleEngine) turtleEngine.beginFill();
  },

  EndFill: () => {
    if (turtleEngine) turtleEngine.endFill();
  },

  // Canvas control
  Clear: () => {
    if (turtleEngine) turtleEngine.clear();
  },

  SetBackground: (color) => {
    if (turtleEngine) turtleEngine.setBackgroundColor(String(color));
  },

  // Turtle visibility
  ShowTurtle: () => {
    if (turtleEngine) {
      turtleEngine.showTurtle();
      turtleEngine.redraw();
    }
  },

  HideTurtle: () => {
    if (turtleEngine) turtleEngine.hideTurtle();
  },

  // Animation speed
  SetSpeed: (speed) => {
    if (turtleEngine) turtleEngine.setSpeed(Number(speed));
  },

  // Text
  Write: (text, font) => {
    if (turtleEngine) {
      turtleEngine.write(String(text), font ? String(font) : undefined);
    }
  },

  // Utility functions
  Reset: () => {
    if (turtleEngine) turtleEngine.reset();
  },
};

/**
 * Install turtle API into global scope for DWScript
 */
export function installTurtleAPI() {
  if (typeof window !== 'undefined') {
    // Make turtle functions available globally
    Object.assign(window, TurtleAPI);
  }
}

/**
 * Toggle grid visibility
 */
export function toggleGrid() {
  gridVisible = !gridVisible;
  if (turtleEngine && turtleEngine.canvas) {
    // Store current canvas state
    const ctx = turtleEngine.ctx;
    const imageData = ctx.getImageData(0, 0, turtleEngine.canvas.width, turtleEngine.canvas.height);

    // Clear and redraw with or without grid
    turtleEngine.clear();

    if (gridVisible) {
      drawGrid(ctx, turtleEngine.canvas.width, turtleEngine.canvas.height);
    }

    // Restore previous drawing
    ctx.putImageData(imageData, 0, 0);

    // Redraw turtle if visible
    if (turtleEngine.visible) {
      turtleEngine.drawTurtle();
    }
  }
  return gridVisible;
}

/**
 * Get grid visibility state
 */
export function isGridVisible() {
  return gridVisible;
}

/**
 * Export canvas as PNG
 */
export function exportCanvasPNG() {
  if (turtleEngine && turtleEngine.canvas) {
    exportAsPNG(turtleEngine.canvas);
  }
}

/**
 * Export canvas as SVG
 */
export function exportCanvasSVG() {
  if (turtleEngine && turtleEngine.canvas) {
    exportAsSVG(turtleEngine.canvas);
  }
}

/**
 * Clear turtle canvas
 */
export function clearTurtle() {
  if (turtleEngine) {
    turtleEngine.clear();
  }
}

/**
 * Reset turtle to initial state
 */
export function resetTurtle() {
  if (turtleEngine) {
    turtleEngine.reset();
  }
}

/**
 * Set turtle speed (for animations)
 * @param {number} speed - 1 (slow) to 10 (fast), 0 = instant
 */
export function setTurtleSpeed(speed) {
  if (turtleEngine) {
    turtleEngine.setSpeed(speed);
  }
}

/**
 * Helper: Convert RGB values to hex color
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {string} - Hex color string
 */
export function rgbToHex(r, g, b) {
  const toHex = (n) => {
    const hex = Math.max(0, Math.min(255, Math.round(n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Helper: Generate random color
 * @returns {string} - Random hex color
 */
export function randomColor() {
  return rgbToHex(
    Math.random() * 255,
    Math.random() * 255,
    Math.random() * 255
  );
}

// Also expose helper functions globally if needed
if (typeof window !== 'undefined') {
  window.RGBToHex = rgbToHex;
  window.RandomColor = randomColor;
}
