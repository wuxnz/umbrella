/**
 * Safe JavaScript unpacker utility to replace eval() usage
 * This module provides functions to safely unpack JavaScript without using eval()
 */

/**
 * Attempts to safely extract and parse packed JavaScript code
 * This is a basic implementation that handles common packing patterns
 */
export function safeUnpack(packedCode: string): string {
  try {
    // Remove common script wrappers
    let cleaned = packedCode
      .replace(/<script[^>]*>/gi, '')
      .replace(/<\/script>/gi, '');

    // Handle p,a,c,k,e,d function calls (common packing format)
    const packedMatch = cleaned.match(
      /eval\(function\(p,a,c,k,e,d\)\{.*?\}\('([^']+)',(\d+),(\d+),'([^']+)'\.split\('\|'\)/,
    );

    if (packedMatch) {
      const [, payload, , , dictionary] = packedMatch;
      const dict = dictionary.split('|');

      // Simple substitution unpacking
      let result = payload;
      dict.forEach((word, index) => {
        if (word) {
          const regex = new RegExp(`\\b${index.toString(36)}\\b`, 'g');
          result = result.replace(regex, word);
        }
      });

      return result;
    }

    // If no packed pattern found, return cleaned code
    return cleaned;
  } catch (error) {
    console.warn('Failed to safely unpack JavaScript:', error);
    return packedCode; // Return original if unpacking fails
  }
}

/**
 * Safely extracts variable values from JavaScript code without eval()
 */
export function extractVariableValue(
  code: string,
  variableName: string,
): string | null {
  try {
    const regex = new RegExp(`${variableName}\\s*=\\s*["']([^"']+)["']`, 'i');
    const match = code.match(regex);
    return match ? match[1] : null;
  } catch (error) {
    console.warn(`Failed to extract variable ${variableName}:`, error);
    return null;
  }
}

/**
 * Safely extracts function call results from JavaScript code
 */
export function extractFunctionResult(
  code: string,
  functionPattern: RegExp,
): string | null {
  try {
    const match = code.match(functionPattern);
    return match ? match[1] : null;
  } catch (error) {
    console.warn('Failed to extract function result:', error);
    return null;
  }
}
