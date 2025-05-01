import Display from "./--debug/Display";
import GetFromGameobject from "./game-get/GetFromGameobject";
import KeyPress from "./game-get/KeyPress";
import Time from "./game-get/Time";
import ExportToGameobject from "./game-set/ExportToGameobject";
import IfNode from "./logic/IfNode";
import MathFloatNode from "./math-float/MathFloatNode";
import Value from "./math-float/Value";

export const nodeTypes = {
  Value,
  Display,
  Time,
  KeyPress,
  MathFloatNode,
  ExportToGameobject,
  GetFromGameobject,
  IfNode,
};
