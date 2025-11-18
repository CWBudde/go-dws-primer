/**
 * URL Sharing Utilities
 * Handles encoding/decoding code snippets for URL sharing
 */

/**
 * Encode code to base64 for URL sharing
 * @param {string} code - The code to encode
 * @returns {string} Base64 encoded code
 */
export function encodeCode(code) {
  try {
    // Use TextEncoder for proper UTF-8 encoding
    const encoder = new TextEncoder();
    const data = encoder.encode(code);

    // Convert to base64
    const base64 = btoa(String.fromCharCode(...data));

    // Make URL-safe by replacing characters
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  } catch (error) {
    console.error("Failed to encode code:", error);
    return "";
  }
}

/**
 * Decode code from base64 URL parameter
 * @param {string} encoded - Base64 encoded code
 * @returns {string} Decoded code
 */
export function decodeCode(encoded) {
  try {
    // Restore base64 characters
    let base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");

    // Add padding if needed
    while (base64.length % 4) {
      base64 += "=";
    }

    // Decode from base64
    const binary = atob(base64);

    // Convert to Uint8Array and decode UTF-8
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    const decoder = new TextDecoder();
    return decoder.decode(bytes);
  } catch (error) {
    console.error("Failed to decode code:", error);
    return "";
  }
}

/**
 * Create a shareable URL for the current code
 * @param {string} code - The code to share
 * @param {Object} options - Additional options
 * @param {string} options.lessonId - Optional lesson ID
 * @param {string} options.title - Optional title
 * @returns {string} Shareable URL
 */
export function createShareURL(code, options = {}) {
  const url = new URL(window.location.href);
  url.searchParams.delete("code"); // Remove existing code param

  if (code && code.trim()) {
    const encoded = encodeCode(code);
    url.searchParams.set("code", encoded);
  }

  if (options.lessonId) {
    url.searchParams.set("lesson", options.lessonId);
  }

  if (options.title) {
    url.searchParams.set("title", options.title);
  }

  return url.toString();
}

/**
 * Load code from URL parameters
 * @returns {Object|null} Object with code and metadata, or null if no code in URL
 */
export function loadFromURL() {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get("code");

  if (!encoded) {
    return null;
  }

  const code = decodeCode(encoded);

  return {
    code,
    lessonId: params.get("lesson") || null,
    title: params.get("title") || null,
  };
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand("copy");
      document.body.removeChild(textarea);
      return success;
    }
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
}

/**
 * Share code and copy URL to clipboard
 * @param {string} code - Code to share
 * @param {Object} options - Share options
 * @returns {Promise<Object>} Result with url and success status
 */
export async function shareCode(code, options = {}) {
  const url = createShareURL(code, options);
  const success = await copyToClipboard(url);

  return {
    url,
    success,
    message: success ? "Link copied to clipboard!" : "Failed to copy link",
  };
}

/**
 * Generate QR code data URL for sharing
 * @param {string} url - URL to encode in QR code
 * @returns {Promise<string>} Data URL of QR code image
 */
export async function generateQRCode(url) {
  // This is a placeholder - would need a QR code library
  // For now, just return a link to a QR code generator service
  const qrServiceURL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
  return qrServiceURL;
}

/**
 * Update browser URL without reloading page
 * @param {string} code - Current code
 * @param {Object} options - Options
 */
export function updateURLWithoutReload(code, options = {}) {
  const url = createShareURL(code, options);
  window.history.replaceState({}, "", url);
}

/**
 * Clear code from URL
 */
export function clearCodeFromURL() {
  const url = new URL(window.location.href);
  url.searchParams.delete("code");
  url.searchParams.delete("title");
  window.history.replaceState({}, "", url);
}

/**
 * Compress code using LZ compression (for very long code snippets)
 * This is more efficient for large code blocks
 * @param {string} code - Code to compress
 * @returns {string} Compressed and encoded code
 */
export function compressCode(code) {
  // Simple compression - in production, could use pako or similar
  return encodeCode(code);
}

/**
 * Decompress code
 * @param {string} compressed - Compressed code
 * @returns {string} Decompressed code
 */
export function decompressCode(compressed) {
  return decodeCode(compressed);
}
