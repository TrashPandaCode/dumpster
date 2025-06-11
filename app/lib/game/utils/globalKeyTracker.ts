const keysDown = new Set<string>();
const keysPressed = new Set<string>();
const keysReleased = new Set<string>();

// Detect if we're on macOS using multiple detection methods
const detectMac = (): boolean => {
  if (typeof navigator === "undefined") return false;

  // Method 1: Modern userAgentData API (Chrome 90+, Edge 91+)
  if ("userAgentData" in navigator && (navigator as any).userAgentData) {
    const uaData = (navigator as any).userAgentData;
    return uaData.platform === "macOS";
  }

  // Method 2: Check for Mac-specific properties
  if ("maxTouchPoints" in navigator && navigator.maxTouchPoints > 0) {
    // Could be iOS/iPadOS, check userAgent
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }

  // Method 3: Fallback to userAgent parsing
  return /Mac/.test(navigator.userAgent);
};

const isMac = detectMac();

// Cross-platform modifier key - using Alt/Option on Mac, Ctrl on others
const primaryModifier = isMac ? "Alt" : "Control";

// Mapping for Mac Alt+Key combinations to get the original key
const macAltKeyMap: Record<string, string> = {
  // Letters
  å: "a",
  ç: "c",
  "∂": "d",
  "´": "e",
  ƒ: "f",
  "©": "g",
  "˙": "h",
  ˆ: "i",
  "∆": "j",
  "˚": "k",
  "¬": "l",
  µ: "m",
  "˜": "n",
  ø: "o",
  π: "p",
  œ: "q",
  "®": "r",
  ß: "s",
  "†": "t",
  "¨": "u",
  "√": "v",
  "∑": "w",
  "≈": "x",
  "¥": "y",
  Ω: "z",

  // Special characters
  " ": " ", // Non-breaking space to regular space

  // Function and modifier keys remain the same
  Escape: "Escape",
  Enter: "Enter",
  Tab: "Tab",
  Backspace: "Backspace",
  Delete: "Delete",
  ArrowUp: "ArrowUp",
  ArrowDown: "ArrowDown",
  ArrowLeft: "ArrowLeft",
  ArrowRight: "ArrowRight",
};

// Set of default shortcuts that we want to prevent default behavior for
const keyboardShortcuts = new Set<string>([
  `${primaryModifier}+d`,
  `${primaryModifier}+ `,
  "Escape",
]);

const registeredShortcuts = new Map<string, (e: KeyboardEvent) => void>();
let initialized = false;
let keydownHandler: (e: KeyboardEvent) => void;
let keyupHandler: (e: KeyboardEvent) => void;

/**
 * Converts our key names to React/DOM key names.
 * @param key The key name to normalize.
 * @returns The normalized key name.
 */
function normalizeKey(key: string): string {
  const lower = key.toLowerCase();
  if (lower === "space") return " ";
  if (lower === "enter") return "Enter";
  return key;
}

/**
 * Gets the original key from a potentially modified Alt+Key combination on Mac
 */
function getOriginalKey(e: KeyboardEvent): string {
  // On Mac with Alt key pressed, use the code property to get original key
  if (isMac && e.altKey && e.code) {
    // Extract key from code (e.g., "KeyD" -> "d", "Space" -> " ")
    if (e.code.startsWith("Key")) {
      return e.code.replace("Key", "").toLowerCase();
    }
    if (e.code === "Space") {
      return " ";
    }
  }

  // Fallback: try to map the modified key back to original
  if (isMac && e.altKey && macAltKeyMap[e.key]) {
    return macAltKeyMap[e.key];
  }

  // For non-Mac or non-Alt combinations, return the key as-is
  return e.key;
}

/**
 * Generates a string representation of the keyboard shortcut
 * Uses Alt on Mac, Ctrl on others to avoid system conflicts
 */
function getShortcutString(e: KeyboardEvent): string {
  const parts: string[] = [];

  // Use Alt on Mac, Ctrl on others
  if ((isMac && e.altKey) || (!isMac && e.ctrlKey)) {
    parts.push(primaryModifier);
  }

  // Get the original key (handles Mac Alt+Key modifications)
  const originalKey = getOriginalKey(e);

  // Handle special keys
  const specialKeys = ["Escape", "Enter", "Tab", "Backspace", "Delete"];
  if (specialKeys.includes(originalKey)) {
    parts.push(originalKey);
  } else {
    parts.push(originalKey.toLowerCase());
  }

  return parts.join("+");
}

// Register a keyboard shortcut with a callback
function registerShortcut(
  shortcut: string,
  callback: (e: KeyboardEvent) => void
) {
  registeredShortcuts.set(shortcut, callback);

  return () => {
    registeredShortcuts.delete(shortcut);
  };
}

/**
 * Helper function to create cross-platform shortcuts
 */
function appendPlatformModifier(key: string): string {
  return `${primaryModifier}+${key}`;
}

function initGlobalKeyTracker() {
  if (initialized) return;
  initialized = true;

  keydownHandler = (e) => {
    const shortcut = getShortcutString(e);

    // Check if the pressed key is a default shortcut and prevent default behavior
    if (keyboardShortcuts.has(shortcut)) {
      e.preventDefault();
      registeredShortcuts.get(shortcut)?.(e);
      return;
    }

    // For regular key tracking, use the original key
    const originalKey = getOriginalKey(e);
    if (!keysDown.has(originalKey)) {
      keysPressed.add(originalKey);
    }
    keysDown.add(originalKey);
  };

  keyupHandler = (e) => {
    const originalKey = getOriginalKey(e);
    keysDown.delete(originalKey);
    keysReleased.add(originalKey);
  };

  window.addEventListener("keydown", keydownHandler);
  window.addEventListener("keyup", keyupHandler);

  // Clear pressed and released keys on focus loss
  window.addEventListener("blur", () => {
    keysPressed.clear();
    keysReleased.clear();
    keysDown.clear();
  });
}

function cleanupGlobalKeyTracker() {
  if (!initialized) return;
  window.removeEventListener("keydown", keydownHandler);
  window.removeEventListener("keyup", keyupHandler);
  window.removeEventListener("blur", () => {
    keysPressed.clear();
    keysReleased.clear();
    keysDown.clear();
  });
  initialized = false;
  keysDown.clear();
  keysPressed.clear();
  keysReleased.clear();
}

function isKeyDown(key: string) {
  return keysDown.has(normalizeKey(key));
}

function isKeyPressed(key: string) {
  return keysPressed.has(normalizeKey(key));
}

function isKeyReleased(key: string) {
  return keysReleased.has(normalizeKey(key));
}

function clearPressedAndReleased() {
  keysPressed.clear();
  keysReleased.clear();
}

export const globalKeyTracker = {
  init: initGlobalKeyTracker,
  cleanup: cleanupGlobalKeyTracker,
  isKeyDown,
  isKeyPressed,
  isKeyReleased,
  clearPressedAndReleased,
  registerShortcut,
  appendPlatformModifier,
  isMac,
};
