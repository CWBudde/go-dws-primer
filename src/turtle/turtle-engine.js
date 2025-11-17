/**
 * Turtle Graphics Engine
 * Core turtle state management and command processing
 */

export class TurtleEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    // Turtle state
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.heading = 0; // degrees, 0 = north (up)
    this.penDown = true;
    this.penColor = '#000000';
    this.penWidth = 1;
    this.fillColor = '#000000';
    this.visible = true;
    this.speed = 5; // 1-10, affects animation speed

    // Animation state
    this.commandQueue = [];
    this.isAnimating = false;
    this.animationId = null;

    // Background
    this.backgroundColor = '#FFFFFF';

    // History for undo/redo
    this.history = [];

    this.reset();
  }

  /**
   * Reset turtle to initial state
   */
  reset() {
    this.x = this.canvas.width / 2;
    this.y = this.canvas.height / 2;
    this.heading = 0;
    this.penDown = true;
    this.penColor = '#000000';
    this.penWidth = 1;
    this.fillColor = '#000000';
    this.visible = true;
    this.commandQueue = [];
    this.history = [];
    this.clear();
  }

  /**
   * Clear the canvas
   */
  clear() {
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.visible) {
      this.drawTurtle();
    }
  }

  /**
   * Move turtle forward by distance
   * @param {number} distance - Distance to move
   */
  forward(distance) {
    const radians = (this.heading - 90) * Math.PI / 180;
    const newX = this.x + distance * Math.cos(radians);
    const newY = this.y + distance * Math.sin(radians);

    if (this.penDown) {
      this.ctx.strokeStyle = this.penColor;
      this.ctx.lineWidth = this.penWidth;
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
      this.ctx.beginPath();
      this.ctx.moveTo(this.x, this.y);
      this.ctx.lineTo(newX, newY);
      this.ctx.stroke();
    }

    this.x = newX;
    this.y = newY;
  }

  /**
   * Move turtle backward by distance
   * @param {number} distance - Distance to move
   */
  backward(distance) {
    this.forward(-distance);
  }

  /**
   * Turn turtle left (counter-clockwise)
   * @param {number} angle - Angle in degrees
   */
  turnLeft(angle) {
    this.heading = (this.heading - angle) % 360;
    if (this.heading < 0) this.heading += 360;
  }

  /**
   * Turn turtle right (clockwise)
   * @param {number} angle - Angle in degrees
   */
  turnRight(angle) {
    this.heading = (this.heading + angle) % 360;
  }

  /**
   * Set turtle heading to specific angle
   * @param {number} angle - Angle in degrees (0 = north/up)
   */
  setHeading(angle) {
    this.heading = angle % 360;
    if (this.heading < 0) this.heading += 360;
  }

  /**
   * Lift pen up (stop drawing)
   */
  penUp() {
    this.penDown = false;
  }

  /**
   * Put pen down (start drawing)
   */
  penDownCmd() {
    this.penDown = true;
  }

  /**
   * Set pen color
   * @param {string} color - CSS color string
   */
  setPenColor(color) {
    this.penColor = color;
  }

  /**
   * Set pen width
   * @param {number} width - Pen width in pixels
   */
  setPenWidth(width) {
    this.penWidth = Math.max(1, width);
  }

  /**
   * Set fill color
   * @param {string} color - CSS color string
   */
  setFillColor(color) {
    this.fillColor = color;
  }

  /**
   * Set background color
   * @param {string} color - CSS color string
   */
  setBackgroundColor(color) {
    this.backgroundColor = color;
    this.clear();
  }

  /**
   * Go to home position (center, heading north)
   */
  home() {
    this.x = this.canvas.width / 2;
    this.y = this.canvas.height / 2;
    this.heading = 0;
  }

  /**
   * Set turtle position
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   */
  setPosition(x, y) {
    // Convert from center-based coordinates to canvas coordinates
    this.x = this.canvas.width / 2 + x;
    this.y = this.canvas.height / 2 - y;
  }

  /**
   * Get turtle X position (center-based)
   * @returns {number}
   */
  getX() {
    return this.x - this.canvas.width / 2;
  }

  /**
   * Get turtle Y position (center-based)
   * @returns {number}
   */
  getY() {
    return this.canvas.height / 2 - this.y;
  }

  /**
   * Get turtle heading
   * @returns {number}
   */
  getHeading() {
    return this.heading;
  }

  /**
   * Draw a circle
   * @param {number} radius - Circle radius
   */
  circle(radius) {
    const centerX = this.x;
    const centerY = this.y;

    this.ctx.strokeStyle = this.penColor;
    this.ctx.lineWidth = this.penWidth;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, Math.abs(radius), 0, 2 * Math.PI);

    if (this.penDown) {
      this.ctx.stroke();
    }
  }

  /**
   * Draw an arc
   * @param {number} radius - Arc radius
   * @param {number} extent - Arc angle in degrees
   */
  arc(radius, extent) {
    const radians = extent * Math.PI / 180;
    const startAngle = (this.heading - 90) * Math.PI / 180;
    const endAngle = startAngle + radians;

    this.ctx.strokeStyle = this.penColor;
    this.ctx.lineWidth = this.penWidth;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, Math.abs(radius), startAngle, endAngle);

    if (this.penDown) {
      this.ctx.stroke();
    }

    // Update position and heading
    const newHeading = (this.heading + extent) % 360;
    this.heading = newHeading < 0 ? newHeading + 360 : newHeading;
  }

  /**
   * Draw a dot (filled circle)
   * @param {number} size - Dot diameter
   */
  dot(size = 5) {
    this.ctx.fillStyle = this.penColor;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, size / 2, 0, 2 * Math.PI);
    this.ctx.fill();
  }

  /**
   * Begin fill mode
   */
  beginFill() {
    this.ctx.beginPath();
    this.ctx.moveTo(this.x, this.y);
  }

  /**
   * End fill mode and fill the shape
   */
  endFill() {
    this.ctx.fillStyle = this.fillColor;
    this.ctx.closePath();
    this.ctx.fill();
  }

  /**
   * Show the turtle
   */
  showTurtle() {
    this.visible = true;
  }

  /**
   * Hide the turtle
   */
  hideTurtle() {
    this.visible = false;
  }

  /**
   * Set animation speed
   * @param {number} speed - Speed from 1 (slowest) to 10 (fastest), 0 = instant
   */
  setSpeed(speed) {
    this.speed = Math.max(0, Math.min(10, speed));
  }

  /**
   * Draw the turtle on canvas
   */
  drawTurtle() {
    if (!this.visible) return;

    const ctx = this.ctx;
    const size = 15;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.heading - 90) * Math.PI / 180);

    // Draw turtle as a triangle
    ctx.fillStyle = '#00AA00';
    ctx.strokeStyle = '#006600';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(size, 0);
    ctx.lineTo(-size * 0.6, -size * 0.8);
    ctx.lineTo(-size * 0.6, size * 0.8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  /**
   * Redraw everything including turtle
   */
  redraw() {
    if (this.visible) {
      this.drawTurtle();
    }
  }

  /**
   * Write text at turtle position
   * @param {string} text - Text to write
   * @param {string} font - CSS font string (optional)
   */
  write(text, font = '14px sans-serif') {
    this.ctx.font = font;
    this.ctx.fillStyle = this.penColor;
    this.ctx.fillText(text, this.x, this.y);
  }
}
