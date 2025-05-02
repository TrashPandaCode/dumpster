import type { Edge, Node } from "@xyflow/react";
import { initializePlayground } from "../levels/playground";

/**
 * The Level type represents a game level.
 */
type Level = {
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
    // TODO
    // allowedNodes
    // modifiableGameObjects: { name: string, connections: string[] }[];
};

/**
 * The LEVELS object contains all the levels of the game.
 * Each level has a name, description, category, image, nodes, edges,
 * initial state function, solution, and hints.
 */
export const LEVELS: Record<string, Level> = {
    "playground": {
        name: "Playground",
        description: "This is a playground level where you can test your game mechanics.",
        category: "Sandbox",
        image: "",
        nodes: [],
        edges: [],
        initialState: initializePlayground,
        solution: {
            nodes: [],
            edges: [],
        },
        hints: [],
    },
    "1.1": {
        name: "Level 1.1",
        description: "This is the first level of the game. It introduces the basic mechanics and objectives.",
        category: "Introduction",
        image: "",
        nodes: [],
        edges: [],
        initialState: () => { },
        solution: {
            nodes: [],
            edges: [],
        },
        hints: [],
    },
}