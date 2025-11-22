/**
 * Tests for URL Sharing Utilities
 */

import { describe, it, expect } from "vitest";
import {
  encodeCode,
  decodeCode,
  compressCode,
  decompressCode,
} from "./url-sharing.js";

describe("URL Sharing Utilities", () => {
  describe("encodeCode and decodeCode", () => {
    it("should encode and decode simple text", () => {
      const code = "Hello, World!";
      const encoded = encodeCode(code);
      const decoded = decodeCode(encoded);

      expect(encoded).toBeTruthy();
      expect(decoded).toBe(code);
    });

    it("should encode and decode DWScript code", () => {
      const code = `program HelloWorld;
begin
  PrintLn('Hello, World!');
end.`;
      const encoded = encodeCode(code);
      const decoded = decodeCode(encoded);

      expect(decoded).toBe(code);
    });

    it("should handle special characters", () => {
      const code = "Special chars: <>&\"'";
      const encoded = encodeCode(code);
      const decoded = decodeCode(encoded);

      expect(decoded).toBe(code);
    });

    it("should handle unicode characters", () => {
      const code = "Unicode: 你好世界 🌍";
      const encoded = encodeCode(code);
      const decoded = decodeCode(encoded);

      expect(decoded).toBe(code);
    });

    it("should handle empty string", () => {
      const code = "";
      const encoded = encodeCode(code);
      const decoded = decodeCode(encoded);

      expect(decoded).toBe(code);
    });

    it("should produce URL-safe encoded strings", () => {
      const code = "Test code with special chars!";
      const encoded = encodeCode(code);

      // URL-safe base64 should not contain +, /, or =
      expect(encoded).not.toMatch(/[+/=]/);
    });

    it("should handle multiline code", () => {
      const code = `line 1
line 2
line 3`;
      const encoded = encodeCode(code);
      const decoded = decodeCode(encoded);

      expect(decoded).toBe(code);
    });
  });

  describe("compressCode and decompressCode", () => {
    it("should compress and decompress code", () => {
      const code = 'program Test;\nbegin\n  PrintLn("Test");\nend.';
      const compressed = compressCode(code);
      const decompressed = decompressCode(compressed);

      expect(decompressed).toBe(code);
    });

    it("should handle large code blocks", () => {
      // Generate a large code block
      const code = "var x: Integer;\n".repeat(100);
      const compressed = compressCode(code);
      const decompressed = decompressCode(compressed);

      expect(decompressed).toBe(code);
    });
  });
});
