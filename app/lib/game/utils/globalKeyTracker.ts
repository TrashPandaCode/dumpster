const keysDown = new Set<string>();
const keysPressed = new Set<string>();
const keysReleased = new Set<string>();

//Set of default shortcuts that we want to prevent default behavior for
const defaultShortcuts = new Set<string>(["Control+d", "Control+ "]);
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

// Generates a string representation of the keyboard shortcut
function getShortcutString(e: KeyboardEvent): string {
  const parts: string[] = [];
  if (e.ctrlKey) parts.push("Control");
  if (e.altKey) parts.push("Alt");
  if (e.metaKey) parts.push("Meta");
  if (e.shiftKey) parts.push("Shift");
  parts.push(e.key.toLowerCase());
  return parts.join("+");
}

// Registers a listener for a specific keyboard shortcut
function shortcutListener(
  shortcut: string,
  callback: (e: KeyboardEvent) => void
) {
  if (!shortcutListeners.has(shortcut)) {
    shortcutListeners.set(shortcut, new Set());
  }
  shortcutListeners.get(shortcut)!.add(callback);
  return () => shortcutListeners.get(shortcut)?.delete(callback);
}

function initGlobalKeyTracker() {
  if (initialized) return;
  initialized = true;

  keydownHandler = (e) => {
    //Check if the pressed key is a default shortcut and prevent default behavior
    const shortcut = getShortcutString(e);
    if (defaultShortcuts.has(shortcut)) {
      e.preventDefault();
    }

    const key = e.key;
    if (!keysDown.has(key)) {
      keysPressed.add(key);
    }
    keysDown.add(key);

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
};
