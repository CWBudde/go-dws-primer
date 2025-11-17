/**
 * Animation System
 * Handles step-by-step animation of turtle commands
 */

export class AnimationController {
  constructor(turtleEngine) {
    this.turtle = turtleEngine;
    this.commands = [];
    this.currentIndex = 0;
    this.isPlaying = false;
    this.isPaused = false;
    this.animationId = null;
    this.onComplete = null;
    this.onStep = null;
  }

  /**
   * Add a command to the animation queue
   * @param {Function} command - Command function to execute
   * @param {Array} args - Command arguments
   */
  addCommand(command, args = []) {
    this.commands.push({ command, args });
  }

  /**
   * Clear all commands
   */
  clear() {
    this.commands = [];
    this.currentIndex = 0;
    this.stop();
  }

  /**
   * Start playing the animation
   */
  play() {
    if (this.isPlaying) return;

    this.isPlaying = true;
    this.isPaused = false;
    this.animate();
  }

  /**
   * Pause the animation
   */
  pause() {
    this.isPaused = true;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * Resume the animation
   */
  resume() {
    if (!this.isPaused) return;
    this.isPaused = false;
    this.animate();
  }

  /**
   * Stop the animation
   */
  stop() {
    this.isPlaying = false;
    this.isPaused = false;
    this.currentIndex = 0;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * Execute next command in queue
   */
  step() {
    if (this.currentIndex >= this.commands.length) {
      this.isPlaying = false;
      if (this.onComplete) {
        this.onComplete();
      }
      return false;
    }

    const { command, args } = this.commands[this.currentIndex];
    command.apply(this.turtle, args);

    if (this.onStep) {
      this.onStep(this.currentIndex, this.commands.length);
    }

    this.currentIndex++;
    return true;
  }

  /**
   * Animate commands based on speed
   */
  animate() {
    if (!this.isPlaying || this.isPaused) return;

    const hasMore = this.step();

    if (hasMore) {
      // Calculate delay based on speed (0 = instant, 10 = fast, 1 = slow)
      const speed = this.turtle.speed;
      let delay = 0;

      if (speed === 0) {
        // Instant execution
        this.animate();
      } else {
        // Map speed 1-10 to delay 500ms-10ms
        delay = 510 - (speed * 50);
        this.animationId = setTimeout(() => {
          this.turtle.redraw();
          this.animate();
        }, delay);
      }
    } else {
      this.stop();
    }
  }

  /**
   * Execute all commands instantly
   */
  executeAll() {
    this.stop();
    while (this.currentIndex < this.commands.length) {
      const { command, args } = this.commands[this.currentIndex];
      command.apply(this.turtle, args);
      this.currentIndex++;
    }
    this.turtle.redraw();
    if (this.onComplete) {
      this.onComplete();
    }
  }

  /**
   * Reset animation to beginning
   */
  reset() {
    this.stop();
    this.currentIndex = 0;
  }

  /**
   * Get animation progress
   * @returns {number} - Progress from 0 to 1
   */
  getProgress() {
    if (this.commands.length === 0) return 0;
    return this.currentIndex / this.commands.length;
  }

  /**
   * Check if animation is complete
   * @returns {boolean}
   */
  isComplete() {
    return this.currentIndex >= this.commands.length;
  }
}

/**
 * Command recorder for tracking drawing operations
 */
export class CommandRecorder {
  constructor() {
    this.recording = false;
    this.commands = [];
  }

  /**
   * Start recording commands
   */
  startRecording() {
    this.recording = true;
    this.commands = [];
  }

  /**
   * Stop recording commands
   */
  stopRecording() {
    this.recording = false;
  }

  /**
   * Record a command
   * @param {string} name - Command name
   * @param {Array} args - Command arguments
   */
  record(name, args) {
    if (!this.recording) return;
    this.commands.push({ name, args, timestamp: Date.now() });
  }

  /**
   * Get recorded commands
   * @returns {Array}
   */
  getCommands() {
    return this.commands;
  }

  /**
   * Clear recorded commands
   */
  clear() {
    this.commands = [];
  }

  /**
   * Export commands as JSON
   * @returns {string}
   */
  exportJSON() {
    return JSON.stringify(this.commands, null, 2);
  }

  /**
   * Import commands from JSON
   * @param {string} json
   */
  importJSON(json) {
    try {
      this.commands = JSON.parse(json);
      return true;
    } catch (e) {
      console.error('Failed to import commands:', e);
      return false;
    }
  }
}
