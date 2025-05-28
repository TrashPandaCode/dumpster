import type { Edge, Node } from "@xyflow/react";

import alleyOne from "~/assets/alley_one.jpg";
import alleyTwo from "~/assets/alley_two.png";
import houseImage from "~/assets/house.png";
import type { NodeType } from "~/lib/node-editor/nodes/node-types";
import { type GameObject } from "../constants";
import { initialize1_1 } from "../levels/1.1";
import { initialize2_1 } from "../levels/2.1";
import { initializePlayground } from "../levels/playground";

export type ConnectionAccess = "set" | "get" | "all";

/**
 * The Level type represents a game level.
 */
export type Level = {
  /**
   * Unique identifier for the level.
   */
  id: string;
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
  solution: {
    nodes: Node[];
    edges: Edge[];
  };
  hints: string[];
  /**
   * Modifiable game objects in the level.
   * Each object has an ID and a list of connections with access levels.
   */
  modifiableGameObjects: ModifiableGameObject[];
  availableNodes: NodeType[];
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
    id: "playground",
    name: "Playground",
    description:
      "This is a sandbox level where you can freely test game mechanics.",
    dialog: [
      "This is a playground level where you can test your game mechanics.",
      "Use of all nodes is permitted.",
    ],
    goals: [
      "Test all features freely.",
      "Experiment with different setups.",
      "No restrictions in this mode.",
    ],
    category: "Sandbox",
    image: alleyOne,
    nodes: [],
    edges: [],
    initialState: initializePlayground,
    solution: {
      nodes: [],
      edges: [],
    },
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
        id: "trashcan",
        connections: [
          { label: "xpos", access: "set" },
          { label: "ypos", access: "set" },
        ],
      },
    ],
    availableNodes: [
      "Value",
      "Display",
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
  },
  "1.1": {
    id: "1.1",
    name: "Level 1.1",
    description:
      "This is the first level of the game, introducing basic mechanics.",
    dialog: [
      "This is the first level of the game. It introduces the basic mechanics and objectives.",
      "You will learn how to create nodes and solve simple equations.",
    ],
    goals: [
      "Create your first nodes.",
      "Solve the equation.",
    ],
    category: "Introduction",
    image: alleyTwo,
    nodes: [],
    edges: [],
    initialState: initialize1_1,
    solution: {
      nodes: [],
      edges: [],
    },
    hints: [],
    modifiableGameObjects: [
      {
        id: "raccoon",
        connections: [{ label: "xpos", access: "get" }],
      },
      {
        id: "trashcan",
        connections: [
          { label: "value", access: "set" },
        ],
      },
    ],
    availableNodes: ["Value", "Display", "MathFloat", "ExportToGameobject"],
  },
  "2.1": {
    id: "2.1",
    name: "Level 2.1",
    description:
      "This is the second level of the game, building upon Level 1.1.",
    dialog: [
      "This is the second level of the game. It builds upon the mechanics introduced in Level 1.1.",
    ],
    goals: ["No goals defined yet."],
    category: "Introduction",
    image: houseImage,
    nodes: [],
    edges: [],
    initialState: initialize2_1,
    solution: {
      nodes: [],
      edges: [],
    },
    hints: [],
    modifiableGameObjects: [
      {
        id: "raccoon",
        connections: [
          {label: "value", access: "set"},
          
          { label: "xpos", access: "get" },

          { label: "xpos", access: "set" },
        ],
      },
      {
        id: "trashCan",
        connections: [
          { label: "xpos", access: "set" },
          { label: "ypos", access: "set" },
        ],
      },],
    availableNodes: ["Display"],
  },
} satisfies Record<string, Level>;
