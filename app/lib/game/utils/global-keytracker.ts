/*
 * Authors: Leo Kling
 *
 * Purpose: This module provides a global key tracker that allows the application to track
 * which keys are currently pressed, which were pressed since the last frame, and which were released since the last frame.
 */
const keysDown = new Set<string>();
const keysPressed = new Set<string>();
const keysReleased = new Set<string>();

let initialized = false;

/**
 * Handler for keydown events.
 * It tracks keys that are pressed down and adds them to the `keysDown` set.
 */
let keydownHandler: (e: KeyboardEvent) => void;
/**
 * Handler for keyup events.
 * It tracks keys that are released and adds them to the `keysReleased` set.
 */
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
 * Initializes the global key tracker.
 * It sets up event listeners for keydown and keyup events to track pressed, released, and currently down keys.
 */
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

/**
 * Cleans up the global key tracker by removing event listeners and clearing the sets.
 * It should be called when the application is no longer using the key tracker.
 */
function cleanupGlobalKeyTracker() {
  if (!initialized) return;
  window.removeEventListener("keydown", keydownHandler);
  window.removeEventListener("keyup", keyupHandler);
  initialized = false;

  keysDown.clear();
  keysPressed.clear();
  keysReleased.clear();
}

/**
 * Checks if a key is currently pressed down.
 * @param key The key to check.
 * @returns True if the key is down, false otherwise.
 */
function isKeyDown(key: string) {
  return keysDown.has(normalizeKey(key));
}

/**
 * Checks if a key was pressed since the last frame.
 * @param key The key to check.
 * @returns True if the key was pressed, false otherwise.
 */
function isKeyPressed(key: string) {
  return keysPressed.has(normalizeKey(key));
}

/**
 * Checks if a key was released since the last frame.
 * @param key The key to check.
 * @returns True if the key was released, false otherwise.
 */
function isKeyReleased(key: string) {
  return keysReleased.has(normalizeKey(key));
}

/**
 * Clears the sets of pressed and released keys.
 * This should be called at the end of each frame to reset the state.
 */
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
