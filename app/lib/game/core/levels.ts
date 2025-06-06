import type { Edge, Node } from "@xyflow/react";

import alleyOne from "~/assets/alley_one.jpg";
import alleyTwo from "~/assets/alley_two.png";
import bounceCard from "~/assets/home-cards/bounce_card.png";
import calcCard from "~/assets/home-cards/calc_card.png";
import playgroundCard from "~/assets/home-cards/playground_card.png";
import sittingCard from "~/assets/home-cards/sitting_card.png";
import houseImage from "~/assets/house.png";
import type { NodeType } from "~/lib/node-editor/nodes/node-types";
import { type GameObject } from "../gameObjects";
import { initializeBounce } from "../levels/bounce";
import { initializeCalculator } from "../levels/calculator";
import { initializeMove } from "../levels/move";
import { initializeParenting } from "../levels/parenting";
import { initializePlayground } from "../levels/playground";
import { initializeSitting } from "../levels/sitting";
import { initializeTimeTransform } from "../levels/timeTransform";

export type ConnectionAccess = "set" | "get" | "all";

/**
 * The Level type represents a game level.
 */
export type Level = {
  /**
   * Unique identifying part of the web address. Must be identical to the key of the level.
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
  calculator: {
    slug: "calculator",
    name: "Calculator",
    description:
      "This is the first level of the game, introducing basic mechanics.",
    dialog: [
      "Whoa... what's this on that wall? Some kinda ancient scribble? Wait... it looks like an equation!",
      "Hmm... maybe it's a clue - maybe if I solve it, I'll figure out what this place is hiding",
      "Quick, human buddy - help me solve it before my brain melts into raccoon soup!!",
      "You! Yes you - my opposable-thumbed hero!",
      "I bet we can solve it using the math nodes in your toolbox.",
      "Once you've figured it out, plug the result into the 'solution' handle on the Export node",
    ],
    goals: ["Create your first nodes.", "Solve the equation."],
    success: "Yesss! You nailed it! That number was exactly what we needed.",
    category: "Introduction",
    image: calcCard,
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
    availableNodes: ["Display", "Value", "Math", "ExportToGameobject"],
    difficulty: 0,
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
    image: sittingCard,
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
    difficulty: 0,
  },
  bounce: {
    slug: "bounce",
    name: "Bounce",
    description: "This is the third level of the game, introducing switches.",
    dialog: [
      "Okay, this one's a little trickier… There are two cans, but only one has the good stuff.",
      "They swap every few seconds, so I've gotta time it just right and stay in the full one for at least 5 seconds.",
      "Maybe I can use one of those switch nodes to keep track of which can is full...",
      "No pressure - just my whole nap depends on it.",
    ],
    goals: [
      "Try using a switch node to detect which trash can is full.",
      "Sit in the full trash can for at least 5 consecutive seconds.",
    ],
    success:
      "Mhhm...that was delicious, but also exhausting...can't tell me eating isn't hard work!",
    category: "Introduction",
    image: bounceCard,
    nodes: [],
    edges: [],
    initialState: initializeBounce,
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
      "Math",
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
    // feel free to change the dialog
    dialog: [
      "Alright, today's the day — I’m finally gonna learn how to walk! I mean, even tiny humans can do it, so how hard can it be?",
      "Left paw, right paw... wait, which one is my right again?",
      "Imagine: me, strutting around, hunting for snacks all by myself! No more waiting for food to come to me—I'm gonna chase those leftovers down!",
    ],
    goals: ["Move the raccoon to the flag."],
    success:
      "Right foot, left foot, right foot, left foot...I could do this all day!",
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
  parenting: {
    slug: "parenting",
    name: "Parenting",
    description:
      "This is the second level of the main game, introducing parenting mechanics.",
    // feel free to change the dialog
    dialog: [
      "Whoa... this trash can is a real goldmine!",
      "There’s so much food in here, there’s no way I can eat it all right now.",
      "Maybe I should just take the whole can with me... but how?",
      "Would you help me carry it back to my secret little hideout?",
      "Just be careful not to drop it, okay?",
    ],
    goals: [
      "Parent the trashcan to the raccoon.",
      "Bring the trashcan to the flag.",
    ],
    success: "Wow!",
    category: "Main Game",
    image: alleyTwo,
    nodes: [],
    edges: [],
    initialState: initializeParenting,
    hints: [],
    modifiableGameObjects: [
      {
        id: "raccoon",
        connections: [
          { label: "xpos", access: "get" },
          { label: "ypos", access: "get" },
        ],
      },
      {
        id: "trashcanFilled",
        connections: [
          { label: "xpos", access: "all" },
          { label: "ypos", access: "all" },
        ],
      },
    ],
    availableNodes: [
      "Display",
      "Value",
      "Math",
      "ImportFromGameobject",
      "ExportToGameobject",
      "Switch",
      "KeyPress",
    ],
    difficulty: 1,
  },
  timeTransform: {
    slug: "timeTransform",
    name: "Time Transform",
    description:
      "This is a level of the main game, introducing time-based transformations.",
    dialog: [
      "In this level, you will learn how time transformations can affect game objects.",
    ],
    goals: ["Do something!"],
    success: "Wow!",
    category: "Main Game",
    image: alleyOne,
    nodes: [],
    edges: [],
    initialState: initializeTimeTransform,
    hints: [],
    modifiableGameObjects: [
      {
        id: "raccoon",
        connections: [{ label: "speed", access: "set" }],
      },
    ],
    availableNodes: [
      "Display",
      "Value",
      "Math",
      "ImportFromGameobject",
      "Switch",
      "ExportToGameobject",
      "Time",
    ],
    difficulty: 1,
  },
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
    image: playgroundCard,
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
        id: "trashcanEmpty",
        connections: [
          { label: "xpos", access: "all" },
          { label: "ypos", access: "all" },
        ],
      },
      {
        id: "trashcanFilled",
        connections: [
          { label: "xpos", access: "all" },
          { label: "ypos", access: "all" },
        ],
      },
      {
        id: "goalFlag",
        connections: [
          { label: "xpos", access: "all" },
          { label: "ypos", access: "all" },
        ],
      },
    ],
    availableNodes: [
      "Display",
      "Value",
      "Time",
      "KeyPress",
      "Math",
      "ExportToGameobject",
      "ImportFromGameobject",
      "Switch",
      "Group",
      "ForLoop",
      "MousePosition",
    ],
    difficulty: 0,
  },
} satisfies Record<string, Level>;
