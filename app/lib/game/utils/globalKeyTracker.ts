const keysDown = new Set<string>();
const keysPressed = new Set<string>();
const keysReleased = new Set<string>();

const defaultCombos = new Set<string>(["Control+d", "Control+n"]);
const comboListeners = new Map<string, Set<(e: KeyboardEvent) => void>>();

let initialized = false;
let keydownHandler: (e: KeyboardEvent) => void;
let keyupHandler: (e: KeyboardEvent) => void;

function normalizeKey(key: string): string {
  const lower = key.toLowerCase();
  if (lower === "space") return " ";
  if (lower === "enter") return "Enter";
  return key;
}

function getComboString(e: KeyboardEvent): string {
  const parts: string[] = [];
  if (e.ctrlKey) parts.push("Control");
  if (e.altKey) parts.push("Alt");
  if (e.metaKey) parts.push("Meta");
  if (e.shiftKey) parts.push("Shift");
  parts.push(e.key.toLowerCase());
  return parts.join("+");
}
function shortcutListener(combo: string, callback: (e: KeyboardEvent) => void) {
  if (!comboListeners.has(combo)) {
    comboListeners.set(combo, new Set());
  }
  comboListeners.get(combo)!.add(callback);
  return () => comboListeners.get(combo)?.delete(callback);
}

function initGlobalKeyTracker() {
  if (initialized) return;
  initialized = true;

  keydownHandler = (e) => {
    const combo = getComboString(e);
    if (defaultCombos.has(combo)) {
      e.preventDefault();
    }

    const key = e.key;
    if (!keysDown.has(key)) {
      keysPressed.add(key);
    }
    keysDown.add(key);

    comboListeners.get(combo)?.forEach((cb) => cb(e));
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
