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
import MathFloat from "./math-float/MathFloat";
import Value from "./math-float/Value";

export const nodeTypes = {
  Value,
  Display,
  Time,
  KeyPress,
  MathFloat,
  ExportToGameobject,
  ImportFromGameobject,
  Switch,
  Group,
  ForStart,
  ForEnd,
  MousePosition,
};
