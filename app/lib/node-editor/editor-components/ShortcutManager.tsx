import {
  useDuplicateHotkey,
  useEscapeHotkey,
  useNewNodeHotkey,
} from "../hooks/useShortcuts";

// Component to manage keyboard shortcuts in the node editor
export function ShortcutManager() {
  useDuplicateHotkey();
  useNewNodeHotkey();
  useEscapeHotkey();
  return null;
}
