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

export const categorizedNodeTypes = new Map<string, { nodes: { name: string; type: string; description: string }[] }>();
categorizedNodeTypes.set("Game Get", {
  nodes: [
    {
      name: "Key Press",
      type: "KeyPress",
      description: "Get key press events.",
    },
    {
      name: "Time",
      type: "Time",
      description: "Get time-related information.",
    },
    {
      name: "Get From Gameobject",
      type: "GetFromGameobject",
      description: "Get data from a game object.",
    },
  ],
});
categorizedNodeTypes.set("Game Set", {
  nodes: [
    {
      name: "Export To Gameobject",
      type: "ExportToGameobject",
      description: "Export data to a game object.",
    },
  ],
});
categorizedNodeTypes.set("Math Float", {
  nodes: [
    {
      name: "Math Float Node",
      type: "MathFloatNode",
      description: "Perform mathematical operations on float values.",
    },
    {
      name: "Value",
      type: "Value",
      description: "Store a float value.",
    },
  ],
});
categorizedNodeTypes.set("Logic", {
  nodes: [
    {
      name: "If Node",
      type: "IfNode",
      description: "Conditional logic node.",
    },
  ],
});
categorizedNodeTypes.set("Debug", {
  nodes: [
    {
      name: "Display",
      type: "Display",
      description: "Display a value on the screen.",
    },
  ],
});