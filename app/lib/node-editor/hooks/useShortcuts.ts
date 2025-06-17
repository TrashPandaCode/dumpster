import { useReactFlow } from "@xyflow/react";
import { useHotkeys } from "react-hotkeys-hook";

import { useNodeAddMenuStore } from "../../zustand/node-add-menu-store";
import { duplicateNodes } from "../utils/duplicate";
import useMacOS from "../utils/ismac";
import { redo, undo } from "../utils/undo";

// Hook to handle duplicating nodes with a hotkey
export function useDuplicateHotkey() {
  const { getNodes, getEdges, setEdges, setNodes } = useReactFlow();
  const shortcuts = ["ctrl+d", "alt+d"];

  useHotkeys(
    shortcuts,
    (e) => {
      e.preventDefault();
      const selectedNodes = getNodes().filter((n) => n.selected);
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
  const shortcuts = ["ctrl+space", "alt+space"];

  useHotkeys(
    shortcuts,
    (e) => {
      e.preventDefault();
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
  const isMacOS = useMacOS();
  const shortcuts = isMacOS ? "alt+y" : "ctrl+z";

  useHotkeys(
    shortcuts,
    (e) => {
      e.preventDefault();
      undo();
    },
    { preventDefault: true, enableOnFormTags: true, useKey: true },
    [isMacOS]
  );
}

// Hook to handle redo
export function useRedoHotkey() {
  const isMacOS = useMacOS();
  const shortcuts = isMacOS
    ? ["alt+shift+y", "alt+z"]
    : ["ctrl+y", "ctrl+shift+z"];

  useHotkeys(
    shortcuts,
    (e) => {
      e.preventDefault();
      redo();
    },
    { preventDefault: true, enableOnFormTags: true, useKey: true },
    [isMacOS]
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
      if (condition && callback) callback();
    },
    {
      enableOnFormTags: true,
      preventDefault: true,
    },
    [callback, condition]
  );
}
