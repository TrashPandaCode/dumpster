import Display from "~/lib/node-editor/nodes/debug/Display";
import Time from "~/lib/node-editor/nodes/game-get/Time";
import Group from "~/lib/node-editor/nodes/groups/Group";
import KeyPress from "~/lib/node-editor/nodes/input/KeyPress";
import MousePosition from "~/lib/node-editor/nodes/input/MousePosition";
import Switch from "~/lib/node-editor/nodes/logic/Switch";
import ForEnd from "~/lib/node-editor/nodes/loops/ForEnd";
import ForStart from "~/lib/node-editor/nodes/loops/ForStart";
import Math from "~/lib/node-editor/nodes/math-float/Math";
import Value from "~/lib/node-editor/nodes/math-float/Value";
import WorldToLocal from "~/lib/node-editor/nodes/math-float/WorldToLocal";
import DocsExportToGameobject from "./DocsExportToGameobject";
import DocsImportFromGameobject from "./DocsImportFromGameobject";

export const docsNodeTypes = {
  Value,
  Display,
  Time,
  KeyPress,
  Math,
  WorldToLocal,
  DocsExportToGameobject,
  DocsImportFromGameobject,
  Switch,
  Group,
  ForStart,
  ForEnd,
  MousePosition,
};
