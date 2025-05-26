import Display from "../../node-editor/nodes/debug/Display";
import Time from "../../node-editor/nodes/game-get/Time";
import Group from "../../node-editor/nodes/groups/Group";
import KeyPress from "../../node-editor/nodes/input/KeyPress";
import Switch from "../../node-editor/nodes/logic/Switch";
import ForEnd from "../../node-editor/nodes/loops/ForEnd";
import ForStart from "../../node-editor/nodes/loops/ForStart";
import MathFloat from "../../node-editor/nodes/math-float/MathFloat";
import Value from "../../node-editor/nodes/math-float/Value";
import DocsExportToGameobject from "./DocsExportToGameobject";
import DocsImportFromGameobject from "./DocsImportFromGameobject";

export const docsNodeTypes = {
  Value,
  Display,
  Time,
  KeyPress,
  MathFloat,
  DocsExportToGameobject,
  DocsImportFromGameobject,
  Switch,
  Group,
  ForStart,
  ForEnd,
};
