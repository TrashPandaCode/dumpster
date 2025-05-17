import type { Edge, Node } from "@xyflow/react";

import alleyOne from "~/assets/alley_one.jpg";
import alleyTwo from "~/assets/alley_two.png";
import houseImage from "~/assets/house.png";
import { initialize1_1 } from "../levels/1.1";
import { initializePlayground } from "../levels/playground";

export type ConnectionAccess = "set" | "get" | "all";

/**
 * The Level type represents a game level.
 */
export type Level = {
  id: string;
  name: string;
  description: string;
  goals: string[];
  category: string;
  image: string;
  nodes: Node[];
  edges: Edge[];
  initialState: () => void;
  solution: {
    nodes: Node[];
    edges: Edge[];
  };
  hints: string[];
  modifiableGameObjects: {
    id: string;
    connections: { label: string; access: ConnectionAccess }[];
  }[];
  // TODO
  // allowedNodes
};

/**
 * The LEVELS object contains all the levels of the game.
 * Each level has a name, description, category, image, nodes, edges,
 * initial state function, solution, and hints.
 */
export const LEVELS = {
  playground: {
    id: "playground",
    name: "Playground",
    description:
      "This is a playground level where you can test your game mechanics.",
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
    hints: [],
    modifiableGameObjects: [
      {
        id: "bean",
        connections: [
          { label: "xpos", access: "all" },
          { label: "ypos", access: "all" },
        ],
      },
      {
        id: "bean2",
        connections: [
          { label: "xpos", access: "set" },
          { label: "ypos", access: "set" },
        ],
      },
    ],
  },
  "1.1": {
    id: "1.1",
    name: "Level 1.1",
    description:
      "This is the first level of the game. It introduces the basic mechanics and objectives.",
    goals: [
      "Create a character controller for the raccoon.",
      "Navigate the raccoon to the goal flag.",
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
        id: "racoon",
        connections: [{ label: "xpos", access: "get" }],
      },
      {
        id: "trashCan",
        connections: [
          { label: "xpos", access: "set" },
          { label: "ypos", access: "set" },
        ],
      },
    ],
  },
  "1.2": {
    id: "1.2",
    name: "Level 1.2",
    description:
      "This is the second level of the game. It builds upon the mechanics introduced in Level 1.1.",
    goals: [
      "No goals defined yet.",
    ],
    category: "Introduction",
    image: houseImage,
    nodes: [],
    edges: [],
    initialState: initialize1_1,
    solution: {
      nodes: [],
      edges: [],
    },
    hints: [],
    modifiableGameObjects: [],
  },
} satisfies Record<string, Level>;
