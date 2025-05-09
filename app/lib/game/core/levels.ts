import type { Edge, Node } from "@xyflow/react";

import { initialize1_1 } from "../levels/1.1";
import { initializePlayground } from "../levels/playground";

import alleyOne from "~/assets/alley_one.jpg";
import alleyTwo from "~/assets/alley_two.png";
import houseImage from "~/assets/house.png";

/**
 * The Level type represents a game level.
 */
export type Level = {
  id: string;
  name: string;
  description: string;
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
  modifiableGameObjects: { id: string; connections: string[] }[];
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
    modifiableGameObjects: [{ id: "bean", connections: ["xpos", "ypos"] }],
  },
  "1.1": {
    id: "1.1",
    name: "Level 1.1",
    description:
      "This is the first level of the game. It introduces the basic mechanics and objectives.",
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
    modifiableGameObjects: [{ id: "bean", connections: ["xpos", "ypos"] }],
  },
  "1.2": {
    id: "1.2",
    name: "Level 1.2",
    description:
      "This is the second level of the game. It builds upon the mechanics introduced in Level 1.1.",
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
    modifiableGameObjects: [{ id: "bean", connections: ["xpos", "ypos"] }],
  },
} satisfies Record<string, Level>;
