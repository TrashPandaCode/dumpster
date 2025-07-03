/*
 * Authors: Jonathan Kron
 *
 * Purpose:
 * This code offers helper functions to convert a UUID to a color. It is used for for loop edges.
 */

/**
 * Converts a UUID string to a CSS color optimized for visibility against a dark blue background
 * @param {string} uuid - The UUID to convert (e.g. "123e4567-e89b-12d3-a456-426614174000")
 * @param {string} format - The output format: "hex" (default), "rgb", or "hsl"
 * @returns {string} - A CSS color string in the specified format
 */
export function uuidToColor(uuid: string, format = "hex") {
  // Remove dashes and non-hex characters from UUID
  const cleanUuid = uuid.replace(/[^a-f0-9]/gi, "");

  // Handle invalid UUID input
  if (cleanUuid.length < 6) {
    throw new Error("Invalid UUID format");
  }

  // Generate a hue value from the first 4 chars (0-360)
  const hueValue = parseInt(cleanUuid.substring(0, 4), 16) % 360;

  // For dark blue backgrounds, avoid blue hues (200-250),
  // increase lightness and saturation for better contrast
  let adjustedHue = hueValue;
  const saturation = 85; // Higher saturation for more vibrant colors
  let lightness = 65; // Brighter for better visibility on dark background

  // Adjust colors in the blue range to avoid blending with the dark blue background
  if (adjustedHue >= 200 && adjustedHue <= 250) {
    // Shift blues to either cyan or purple
    adjustedHue =
      adjustedHue < 225
        ? adjustedHue - 40 // Shift toward cyan
        : adjustedHue + 40; // Shift toward purple
  }

  // For colors similar to blue, boost lightness even more
  if (
    (adjustedHue >= 170 && adjustedHue <= 270) ||
    adjustedHue >= 330 ||
    adjustedHue <= 30
  ) {
    lightness = 70; // Increase lightness for colors that might get lost on dark blue
  }

  // Generate the color in HSL first
  const r = hslToRgb(adjustedHue / 360, saturation / 100, lightness / 100);

  // Format based on preference
  if (format === "hsl") {
    return `hsl(${adjustedHue}, ${saturation}%, ${lightness}%)`;
  } else if (format === "rgb") {
    return `rgb(${r[0]}, ${r[1]}, ${r[2]})`;
  } else {
    // Default: hex
    return rgbToHex(r[0], r[1], r[2]);
  }
}

/**
 * Convert HSL color values to RGB
 * @param {number} h - Hue (0 to 1)
 * @param {number} s - Saturation (0 to 1)
 * @param {number} l - Lightness (0 to 1)
 * @returns {array} - RGB values as [r, g, b] (0-255)
 */
function hslToRgb(h: number, s: number, l: number) {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

/**
 * Convert RGB values to a hex color string
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {string} - Hex color string (e.g., "#ff9900")
 */
function rgbToHex(r: number, g: number, b: number) {
  return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}
