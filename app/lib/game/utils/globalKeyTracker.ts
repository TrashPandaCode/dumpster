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

// Cross-platform modifier key - using Shift on Mac to avoid conflicts
const primaryModifier = isMac ? "Shift" : "Control";

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
 * Generates a string representation of the keyboard shortcut
 * Uses Shift on Mac, Ctrl on others to avoid system conflicts
 */
function getShortcutString(e: KeyboardEvent): string {
  const parts: string[] = [];

  // Use Shift on Mac (Option key), Ctrl on others
  if ((isMac && e.shiftKey) || (!isMac && e.ctrlKey)) {
    parts.push(primaryModifier);
  }

  // Handle special keys
  const specialKeys = ["Escape", "Enter", "Tab", "Backspace", "Delete"];
  if (specialKeys.includes(e.key)) {
    parts.push(e.key);
  } else {
    parts.push(e.key.toLowerCase());
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

    const key = e.key;
    if (!keysDown.has(key)) {
      keysPressed.add(key);
    }
    keysDown.add(key);
  };

  keyupHandler = (e) => {
    const key = e.key;
    keysDown.delete(key);
    keysReleased.add(key);
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
