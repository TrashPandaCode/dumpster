import { useReactFlow } from "@xyflow/react";
import { useHotkeys } from "react-hotkeys-hook";

import { useNodeAddMenuStore } from "../../zustand/node-add-menu-store";
import { duplicateNodes } from "../utils/duplicate";
import { redo, undo } from "../utils/undo";

// Hook to handle duplicating nodes with a hotkey
export function useDuplicateHotkey() {
  const { getNodes, getEdges, setEdges, setNodes } = useReactFlow();

  useHotkeys(
    ["ctrl+d", "alt+d"],
    (e) => {
      e.preventDefault();
      const selectedNodes = getNodes().filter((n) => n.selected);
      // If nodes are selected, duplicate them
      if (selectedNodes.length > 0) {
        duplicateNodes(selectedNodes, getEdges, getNodes, setEdges, setNodes);
      }
    },
    {
      enableOnFormTags: false,
      preventDefault: true,
    },
    [getNodes, getEdges, setEdges, setNodes]
  );
}

// Hook to handle adding a new node with a hotkey
export function useNewNodeHotkey() {
  const { visible, openAddMenu, closeAddMenu } = useNodeAddMenuStore();

  useHotkeys(
    ["ctrl+space", "alt+space"],
    (e) => {
      e.preventDefault();
      // Toggle the visibility of the add menu
      visible ? closeAddMenu() : openAddMenu();
    },
    {
      enableOnFormTags: true,
      preventDefault: true,
    },
    [visible]
  );
}

// Hook to handle undo
export function useUndoHotkey() {
  useHotkeys(
    ["ctrl+z", "alt+z"],
    (e) => {
      e.preventDefault();
      undo();
    },
    { preventDefault: true, enableOnFormTags: true, useKey: true }
  );
}

// Hook to handle redo
export function useRedoHotkey() {
  useHotkeys(
    ["ctrl+y", "alt+y"],
    (e) => {
      e.preventDefault();
      redo();
    },
    { preventDefault: true, enableOnFormTags: true, useKey: true }
  );
}

// Hook to handle the Escape key for closing menus
export function useEscapeHotkey(
  callback?: () => void,
  condition: boolean = true
) {
  useHotkeys(
    "esc",
    (e) => {
      e.preventDefault();
      // If any menu is open, close it
      if (condition && callback) callback();
    },
    {
      enableOnFormTags: true,
      preventDefault: true,
    },
    [callback, condition]
  );
}
