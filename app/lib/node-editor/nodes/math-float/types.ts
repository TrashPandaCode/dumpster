export type NumberInputType = {
  enable: boolean;
  type: undefined | "float" | "int";
  label: string;
};

export const TYPES = {
  Functions: [
    "Addition",
    "Substraction",
    "Multiply",
    "Divide",
    "Power",
    "Logarithm",
    "Absolute",
  ],
  Rounding: ["Round", "Floor", "Ceil", "Modulo"],
  Trigonometric: ["Sine", "Cosine", "Tangent"],
  Conversion: ["To Radians", "To Degrees"],
  Compare: ["Equals", "Greater Than", "Less Than"],
  "Logical Operators": ["AND", "OR", "XOR", "NOT", "NAND", "NOR", "XNOR"],
};

// prettier-ignore
export const INPUTS: { [key: string]: NumberInputType[] } = {
    Addition: [{enable: true, type: "float", label: "x"}, {enable: true, type: "float", label: "y"}],
    Substraction: [{enable: true, type: "float", label: "x"}, {enable: true, type: "float", label: "y"}],
    Multiply: [{enable: true, type: "float", label: "x"}, {enable: true, type: "float", label: "y"}],
    Divide: [{enable: true, type: "float", label: "x"}, {enable: true, type: "float", label: "y"}],
    Power: [{enable: true, type: "float", label: "base"}, {enable: true, type: "float", label: "exponent"}],
    Logarithm: [{enable: true, type: "float", label: "x"}, {enable: true, type: "float", label: "y"}],
    Absolute: [{enable: true, type: "float", label: "x"}, {enable: false, type: undefined, label: ""}],
  
    Round: [{enable: true, type: "float", label: "x"}, {enable: true, type: "int", label: "decimal places"}],
    Floor: [{enable: true, type: "float", label: "x"}, {enable: false, type: undefined, label: ""}],
    Ceil: [{enable: true, type: "float", label: "x"}, {enable: false, type: undefined, label: ""}],
    Modulo: [{enable: true, type: "float", label: "x"}, {enable: true, type: "float", label: "y"}],
  
    Sine: [{enable: true, type: "float", label: "t"}, {enable: false, type: undefined, label: ""}],
    Cosine: [{enable: true, type: "float", label: "t"}, {enable: false, type: undefined, label: ""}],
    Tangent: [{enable: true, type: "float", label: "t"}, {enable: false, type: undefined, label: ""}],
  
    "To Radians": [{enable: true, type: "float", label: "deg"}, {enable: false, type: undefined, label: ""}],
    "To Degrees": [{enable: true, type: "float", label: "rad"}, {enable: false, type: undefined, label: ""}],
  
    Equals: [{enable: true, type: "float", label: "x"}, {enable: true, type: "float", label: "y"}],
    "Greater Than": [{enable: true, type: "float", label: "x"}, {enable: true, type: "float", label: "y"}],
    "Less Than": [{enable: true, type: "float", label: "x"}, {enable: true, type: "float", label: "y"}],

    AND:[{enable: true, type: "float", label: "bool"}, {enable: true, type: "float", label: "bool"}],
    OR:[{enable: true, type: "float", label: "bool"}, {enable: true, type: "float", label: "bool"}],
    XOR:[{enable: true, type: "float", label: "bool"}, {enable: true, type: "float", label: "bool"}],
    NOT:[{enable: true, type: "float", label: "bool"}, {enable: false, type: "float", label: "bool"}],
    NAND:[{enable: true, type: "float", label: "bool"}, {enable: true, type: "float", label: "bool"}],
    NOR:[{enable: true, type: "float", label: "bool"}, {enable: true, type: "float", label: "bool"}],
    XNOR:[{enable: true, type: "float", label: "bool"}, {enable: true, type: "float", label: "bool"}],
  };

export const COMPUTE: { [key: string]: (x: number, y: number) => number } = {
  Addition: (x, y) => x + y,
  Substraction: (x, y) => x - y,
  Multiply: (x, y) => x * y,
  Divide: (x, y) => x / y,
  Power: (x, y) => Math.pow(x, y),
  Logarithm: (x, y) => Math.log(x) / Math.log(y),
  Absolute: (x, _) => Math.abs(x),

  Round: (x, y) =>
    Math.round((x + Number.EPSILON) * Math.pow(10, y)) / Math.pow(10, y),
  Floor: (x, _) => Math.floor(x),
  Ceil: (x, _) => Math.ceil(x),
  Modulo: (x, y) => x % y,

  Sine: (x, _) => Math.sin(x),
  Cosine: (x, _) => Math.cos(x),
  Tangent: (x, _) => Math.tan(x),

  "To Radians": (x, _) => x * (Math.PI / 180),
  "To Degrees": (x, _) => x * (180 / Math.PI),

  Equals: (x, y) => +(x == y),
  "Greater Than": (x, y) => +(x > y),
  "Less Than": (x, y) => +(x < y),

  AND: (x, y) => +(!!x && !!y),
  OR: (x, y) => +(!!x || !!y),
  XOR: (x, y) => +(!!x !== !!y),
  NOT: (x, _) => +!x,
  NAND: (x, y) => +!(!!x && !!y),
  NOR: (x, y) => +!(!!x || !!y),
  XNOR: (x, y) => +(!!x === !!y),
};
