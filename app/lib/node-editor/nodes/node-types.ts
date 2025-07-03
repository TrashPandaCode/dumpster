/*
 * Authors: Jonathan Kron, Leo Kling, Milan Jezovsek
 *
 * Purpose:
 * This file exports all node types for use in the ReactFlow component.
 */
import Display from "./debug/Display";
import ImportFromGameobject from "./game-get/ImportFromGameobject";
import Time from "./game-get/Time";
import ExportToGameobject from "./game-set/ExportToGameobject";
import Group from "./groups/Group";
import KeyPress from "./input/KeyPress";
import MousePosition from "./input/MousePosition";
import Switch from "./logic/Switch";
import ForEnd from "./loops/ForEnd";
import ForStart from "./loops/ForStart";
import Math from "./math-float/Math";
import Value from "./math-float/Value";
import WorldToLocal from "./math-float/WorldToLocal";

export const nodeTypes = {
  Value,
  Display,
  Time,
  KeyPress,
  Math,
  WorldToLocal,
  ExportToGameobject,
  ImportFromGameobject,
  Switch,
  Group,
  ForStart,
  ForEnd,
  MousePosition,
};

// ForLoop is a special case that combines ForStart and ForEnd
export type NodeType =
  | Exclude<keyof typeof nodeTypes, "ForEnd" | "ForStart">
  | "ForLoop";
