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

// Cross-platform modifier key - using Alt/Option on Mac to avoid conflicts
const primaryModifier = isMac ? "Shift" : "Control";

// Set of default shortcuts that we want to prevent default behavior for
const defaultShortcuts = new Set<string>([
  `${primaryModifier}+d`,
  `${primaryModifier}+ `,
  "Escape",
]);

const shortcutListeners = new Map<string, Set<(e: KeyboardEvent) => void>>();
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
 * Uses Alt on Mac, Ctrl on others to avoid system conflicts
 */
function getShortcutString(e: KeyboardEvent): string {
  const parts: string[] = [];

  // Use Alt on Mac (Option key), Ctrl on others
  if ((isMac && e.altKey) || (!isMac && e.ctrlKey)) {
    parts.push(primaryModifier);
  }

  // Add other modifiers
  if (e.metaKey) parts.push("Meta");
  if (e.shiftKey) parts.push("Shift");

  // Handle secondary modifiers
  if (isMac && e.ctrlKey) parts.push("Control");
  if (!isMac && e.altKey) parts.push("Alt");

  // Handle special keys
  const specialKeys = ["Escape", "Enter", "Tab", "Backspace", "Delete"];
  if (specialKeys.includes(e.key)) {
    parts.push(e.key);
  } else {
    parts.push(e.key.toLowerCase());
  }

  return parts.join("+");
}

/**
 * Cross-platform shortcut registration
 * Automatically handles both Alt and Ctrl variants
 */
function shortcutListener(
  shortcut: string,
  callback: (e: KeyboardEvent) => void
) {
  const shortcuts = [shortcut];

  // If shortcut uses Control/Alt, add both variants for compatibility
  if (shortcut.includes("Control+")) {
    shortcuts.push(shortcut.replace("Control+", "Shift+"));
  } else if (shortcut.includes("Shift+")) {
    shortcuts.push(shortcut.replace("Shift+", "Control+"));
  }

  // Register all variants
  shortcuts.forEach((sc) => {
    if (!shortcutListeners.has(sc)) {
      shortcutListeners.set(sc, new Set());
    }
    shortcutListeners.get(sc)!.add(callback);
  });

  // Return cleanup function for all variants
  return () => {
    shortcuts.forEach((sc) => {
      shortcutListeners.get(sc)?.delete(callback);
    });
  };
}

/**
 * Helper function to create cross-platform shortcuts
 */
function createPlatformShortcut(key: string): string {
  return `${primaryModifier}+${key}`;
}

function initGlobalKeyTracker() {
  if (initialized) return;
  initialized = true;

  keydownHandler = (e) => {
    const shortcut = getShortcutString(e);
    // Check if the pressed key is a default shortcut and prevent default behavior
    if (defaultShortcuts.has(shortcut)) {
      e.preventDefault();
    }

    const key = e.key;
    if (!keysDown.has(key)) {
      keysPressed.add(key);
    }
    keysDown.add(key);

    // Trigger all registered shortcuts
    shortcutListeners.get(shortcut)?.forEach((sc) => sc(e));
  };

  keyupHandler = (e) => {
    const key = e.key;
    keysDown.delete(key);
    keysReleased.add(key);
  };

  window.addEventListener("keydown", keydownHandler);
  window.addEventListener("keyup", keyupHandler);
}

function cleanupGlobalKeyTracker() {
  if (!initialized) return;
  window.removeEventListener("keydown", keydownHandler);
  window.removeEventListener("keyup", keyupHandler);
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
  shortcutListener,
  createPlatformShortcut,
  isMac,
  primaryModifier,
};
