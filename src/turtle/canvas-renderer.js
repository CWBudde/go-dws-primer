/**
 * Canvas Renderer
 * Handles canvas setup, grid overlay, and export functionality
 */

/**
 * Initialize canvas with proper scaling
 * @param {HTMLCanvasElement} canvas
 */
export function initCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  // Set display size (css pixels)
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';

  // Set actual size in memory (scaled to account for extra pixel density)
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  // Normalize coordinate system to use css pixels
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  return ctx;
}

/**
 * Draw coordinate grid on canvas
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {number} spacing - Grid spacing in pixels
 */
export function drawGrid(ctx, width, height, spacing = 50) {
  ctx.save();
  ctx.strokeStyle = '#e0e0e0';
  ctx.lineWidth = 0.5;

  // Vertical lines
  for (let x = 0; x <= width; x += spacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // Horizontal lines
  for (let y = 0; y <= height; y += spacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Center axes (thicker)
  ctx.strokeStyle = '#c0c0c0';
  ctx.lineWidth = 1;

  // Vertical center
  ctx.beginPath();
  ctx.moveTo(width / 2, 0);
  ctx.lineTo(width / 2, height);
  ctx.stroke();

  // Horizontal center
  ctx.beginPath();
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2);
  ctx.stroke();

  ctx.restore();
}

/**
 * Export canvas as PNG
 * @param {HTMLCanvasElement} canvas
 * @param {string} filename - Output filename
 */
export function exportAsPNG(canvas, filename = 'turtle-drawing.png') {
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  });
}

/**
 * Export canvas as SVG
 * @param {HTMLCanvasElement} canvas
 * @param {string} filename - Output filename
 */
export function exportAsSVG(canvas, filename = 'turtle-drawing.svg') {
  // For SVG export, we'd need to track all drawing commands
  // This is a simplified version that converts the canvas to an image in SVG
  const dataURL = canvas.toDataURL('image/png');
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg"
         xmlns:xlink="http://www.w3.org/1999/xlink"
         width="${canvas.width}"
         height="${canvas.height}">
      <image width="${canvas.width}"
             height="${canvas.height}"
             xlink:href="${dataURL}"/>
    </svg>
  `;

  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Create an off-screen canvas copy
 * @param {HTMLCanvasElement} canvas
 * @returns {HTMLCanvasElement}
 */
export function cloneCanvas(canvas) {
  const clone = document.createElement('canvas');
  clone.width = canvas.width;
  clone.height = canvas.height;
  const ctx = clone.getContext('2d');
  ctx.drawImage(canvas, 0, 0);
  return clone;
}

/**
 * Get canvas as data URL
 * @param {HTMLCanvasElement} canvas
 * @param {string} type - MIME type (default: image/png)
 * @returns {string}
 */
export function getDataURL(canvas, type = 'image/png') {
  return canvas.toDataURL(type);
}

/**
 * Clear canvas with background color
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} width
 * @param {number} height
 * @param {string} color - Background color
 */
export function clearCanvas(ctx, width, height, color = '#FFFFFF') {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
}

/**
 * Fit canvas to container
 * @param {HTMLCanvasElement} canvas
 */
export function fitToContainer(canvas) {
  const container = canvas.parentElement;
  if (!container) return;

  const rect = container.getBoundingClientRect();
  canvas.style.width = '100%';
  canvas.style.height = '100%';

  const dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
}
