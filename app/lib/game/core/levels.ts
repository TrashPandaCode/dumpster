import type { Edge, Node } from "@xyflow/react";

import alleyOne from "~/assets/alley_one.jpg";
import alleyTwo from "~/assets/alley_two.png";
import houseImage from "~/assets/house.png";
import type { NodeType } from "~/lib/node-editor/nodes/node-types";
import { type GameObject } from "../constants";
import { initializeCalculator } from "../levels/calculator";
import { initializeIffies } from "../levels/iffies";
import { initializeMove } from "../levels/move";
import { initializePlayground } from "../levels/playground";
import { initializeSitting } from "../levels/sitting";

export type ConnectionAccess = "set" | "get" | "all";

/**
 * The Level type represents a game level.
 */
export type Level = {
  /**
   * Unique identifying part of the web address.
   */
  slug: string;
  /**
   * (Human Readable) Name of the level.
   */
  name: string;
  /**
   * Description of the level.
   */
  description: string;
  /**
   * Dialog for the level, providing context or instructions.
   */
  dialog: string[];
  /**
   * Goals for the level, outlining objectives to be achieved.
   */
  goals: string[];
  /**
   * Message displayed on level completion.
   */
  success: string;
  /**
   * Category of the level, used for grouping or filtering levels.
   */
  category: string;
  /**
   * Image representing the level, used for visual identification.
   */
  image: string;
  nodes: Node[];
  edges: Edge[];
  /**
   * Function to initialize the state of the level.
   * This function is called when the level is loaded (after initGame).
   */
  initialState: () => void;
  hints: string[];
  /**
   * Modifiable game objects in the level.
   * Each object has an ID and a list of connections with access levels.
   */
  modifiableGameObjects: ModifiableGameObject[];
  availableNodes: NodeType[];
  difficulty: 0 | 1 | 2;
};

export type ModifiableGameObject = {
  id: GameObject;
  connections: { label: string; access: ConnectionAccess }[];
};

/**
 * The LEVELS object contains all the levels of the game.
 */
export const LEVELS = {
  playground: {
    slug: "playground",
    name: "Playground",
    description:
      "This is a sandbox level where you can freely test game mechanics.",
    dialog: [
      "This is a playground level where you can freely implement game mechanics.",
      "You are allowed to use all available nodes.",
    ],
    goals: [
      "No goals, this level is designed for experimentation and testing.",
    ],
    success: "How did you complete a sandbox level?",
    category: "Sandbox",
    image: alleyOne,
    nodes: [],
    edges: [],
    initialState: initializePlayground,
    hints: [
      "This is a playground level",
      "You don't need hints here",
      "stop clicking there is nothing coming",
      "42",
    ],
    modifiableGameObjects: [
      {
        id: "raccoon",
        connections: [
          { label: "xpos", access: "all" },
          { label: "ypos", access: "all" },
        ],
      },
      {
        id: "trashcanFilled",
        connections: [
          { label: "xpos", access: "set" },
          { label: "ypos", access: "set" },
        ],
      },
    ],
    availableNodes: [
      "Display",
      "Value",
      "Time",
      "KeyPress",
      "MathFloat",
      "ExportToGameobject",
      "ImportFromGameobject",
      "Switch",
      "Group",
      "ForLoop",
      "MousePosition",
    ],
    difficulty: 0,
  },
  calculator: {
    slug: "calculator",
    name: "Calculator",
    description:
      "This is the first level of the game, introducing basic mechanics.",
    dialog: [
      "Whoa... what's this? Some kinda ancient scribble? Wait… it looks like an equation!",
      "Hmm… maybe it's a clue - maybe if I solve it, I'll figure out what this place is hiding",
      "Quick, human buddy - help me solve it before my brain melts into raccoon soup!!",
      "You! Yes you - my opposable-thumbed hero!",
      "I bet we can solve it using the math nodes in your toolbox.",
      "Once you've figured it out, plug the result into the 'solution' handle on the Export node",
    ],
    goals: ["Create your first nodes.", "Solve the equation."],
    success: "Yesss! You nailed it! That number was exactly what we needed.",
    category: "Introduction",
    image: alleyTwo,
    nodes: [],
    edges: [],
    initialState: initializeCalculator,
    hints: [
      "Start by placing Value nodes to represent the numbers in the equation.",
      "Use Math nodes like Add, Subtract, Multiply, or Divide to build the equation step by step.",
      "Connect the result of your math operation to the 'solution' input on the Export node.",
      "Check that each node has the correct inputs - missing values will result in an incorrect or empty output.",
      "Double-check your order of operation.",
    ],
    modifiableGameObjects: [
      {
        id: "raccoon",
        connections: [{ label: "solution", access: "set" }],
      },
    ],
    availableNodes: ["Display", "Value", "MathFloat", "ExportToGameobject"],
    difficulty: 1,
  },
  sitting: {
    slug: "sitting",
    name: "Sitting",
    description:
      "This is the second level of the game, introducing position of game objects.",
    dialog: [
      "Okay okay okay listen - I've had a long day solving equations and being adorable.",
      "Now all I want... is to plop into that cozy, slightly smelly trash can over there.",
      "Can you move me into it? Please? I promise not to knock it over. (Maybe.)",
    ],
    goals: ["Move the raccoon into the trashcan by changing his position."],
    success:
      "Aaaahhh... perfect! Crunchy banana peels, the scent of mystery leftovers... this is luxury.",
    category: "Introduction",
    image: alleyTwo,
    nodes: [],
    edges: [],
    initialState: initializeSitting,
    hints: [],
    modifiableGameObjects: [
      {
        id: "raccoon",
        connections: [
          { label: "xpos", access: "set" },
          { label: "ypos", access: "set" },
        ],
      },
    ],
    availableNodes: ["Display", "Value", "ExportToGameobject"],
    difficulty: 1,
  },
  iffies: {
    slug: "iffies",
    name: "Iffies",
    description:
      "This is the third level of the game, introducing if statements.",
    dialog: [
      'This is the third level of the game. Complete the "sitting" level first, if you haven\'t done so yet.',
      "You will learn how to use if statements to control game object behavior.",
    ],
    goals: [
      "Use an if statement to make the raccoon move into the filled trashcan.",
    ],
    success:
      "Luckily the raccoon doesn't have to search for food in an empty trashcan!",
    category: "Introduction",
    image: alleyTwo,
    nodes: [],
    edges: [],
    initialState: initializeIffies,
    hints: [],
    modifiableGameObjects: [
      {
        id: "raccoon",
        connections: [
          { label: "xpos", access: "set" },
          { label: "ypos", access: "set" },
        ],
      },
      {
        id: "trashcan1",
        connections: [
          { label: "filled", access: "get" },
          { label: "xpos", access: "get" },
          { label: "ypos", access: "get" },
        ],
      },
      {
        id: "trashcan2",
        connections: [
          { label: "filled", access: "get" },
          { label: "xpos", access: "get" },
          { label: "ypos", access: "get" },
        ],
      },
    ],
    availableNodes: [
      "Display",
      "Value",
      "MathFloat",
      "ImportFromGameobject",
      "Switch",
      "ExportToGameobject",
    ],
    difficulty: 1,
  },
  move: {
    slug: "move",
    name: "Move",
    description:
      "This is the first level of the main game, introducing movement mechanics.",
    dialog: [
      "This is the first level of the main game. It introduces movement mechanics.",
      "You will learn how to move a game object using key inputs.",
    ],
    goals: ["Move the raccoon to the flag."],
    success: "Look, he just learned how to use his feet!",
    category: "Main Game",
    image: houseImage,
    nodes: [],
    edges: [],
    initialState: initializeMove,
    hints: [],
    modifiableGameObjects: [
      {
        id: "raccoon",
        connections: [
          { label: "xpos", access: "set" },
          { label: "ypos", access: "set" },
        ],
      },
    ],
    availableNodes: ["Display", "ExportToGameobject"],
    difficulty: 2,
  },
} satisfies Record<string, Level>;
