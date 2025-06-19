import { useReactFlow } from "@xyflow/react";
import { useHotkeys } from "react-hotkeys-hook";

import { useClipboardStore } from "~/lib/zustand/clipboard";
import { useNodeAddMenuStore } from "../../zustand/node-add-menu-store";
import { duplicateNodes } from "../utils/duplicate";
import { redo, undo } from "../utils/undo";
import useIsMac from "./useMac";

// Hook to handle copying nodes with a hotkey
export function useCopyHotkey() {
  const { getNodes } = useReactFlow();
  const { setCopiedNodes } = useClipboardStore();
  const isMacOS = useIsMac();
  const shortcuts = isMacOS ? "cmd+c" : "ctrl+c";

  useHotkeys(
    shortcuts,
    (e) => {
      const selectedNodes = getNodes().filter((n) => n.selected);
      if (selectedNodes.length > 0) {
        setCopiedNodes(selectedNodes);
        console.log(`${selectedNodes.length} node(s) copied to clipboard`);
      }
    },
    {
      enableOnFormTags: false,
      preventDefault: true,
    },
    [getNodes, setCopiedNodes, isMacOS]
  );
}

// Hook to handle pasting nodes with a hotkey
export function usePasteHotkey() {
  const { getNodes, getEdges, setEdges, setNodes } = useReactFlow();
  const { copiedNodes, hasCopiedNodes } = useClipboardStore();
  const isMacOS = useIsMac();
  const shortcuts = isMacOS ? "cmd+v" : "ctrl+v";

  useHotkeys(
    shortcuts,
    (e) => {
      if (hasCopiedNodes()) {
        duplicateNodes(copiedNodes, getEdges, getNodes, setEdges, setNodes);
        console.log(`${copiedNodes.length} node(s) pasted`);
      }
    },
    {
      enableOnFormTags: false,
      preventDefault: true,
    },
    [
      copiedNodes,
      hasCopiedNodes,
      getNodes,
      getEdges,
      setEdges,
      setNodes,
      isMacOS,
    ]
  );
}

// Hook to handle duplicating nodes with a hotkey
export function useDuplicateHotkey() {
  const { getNodes, getEdges, setEdges, setNodes } = useReactFlow();
  const shortcuts = ["ctrl+d", "alt+d"];

  useHotkeys(
    shortcuts,
    (e) => {
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
  const isMacOS = useIsMac();
  const shortcuts = isMacOS ? "alt+y" : "ctrl+z";

  useHotkeys(
    shortcuts,
    (e) => {
      undo();
    },
    { preventDefault: true, enableOnFormTags: true, useKey: true },
    [isMacOS]
  );
}

// Hook to handle redo
export function useRedoHotkey() {
  const isMacOS = useIsMac();
  const shortcuts = isMacOS
    ? ["alt+shift+y", "alt+z"]
    : ["ctrl+y", "ctrl+shift+z"];

  useHotkeys(
    shortcuts,
    (e) => {
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
      if (condition && callback) callback();
    },
    {
      enableOnFormTags: true,
      preventDefault: true,
    },
    [callback, condition]
  );
}
