const keysDown = new Set<string>();
const keysPressed = new Set<string>();
const keysReleased = new Set<string>();

let initialized = false;
let keydownHandler: (e: KeyboardEvent) => void;
let keyupHandler: (e: KeyboardEvent) => void;

/**
 * Normalizes the key name to a consistent format.
 * @param key The key name to normalize.
 * @returns The normalized key name.
 */
function normalizeKey(key: string): string {
  const lower = key.toLowerCase();
  if (lower === "space") return " ";
  if (lower === "enter") return "Enter";
  return key;
}

function initGlobalKeyTracker() {
  if (initialized) return;
  initialized = true;

  keydownHandler = (e) => {
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
};
