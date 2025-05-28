import { use } from "react";

import { useDuplicateHotkey, useNewNodeHotkey } from "../hooks/useShortcuts";

export function ShortcutManager() {
  useDuplicateHotkey();
  useNewNodeHotkey();
  return null;
}
