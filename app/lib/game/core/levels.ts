import type { Node } from "@xyflow/react";
import { v4 as uuidv4 } from "uuid";

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
import { initializeInverse } from "../levels/inverse";
import { initializeKinematics } from "../levels/kinematic";
import { initializeMove } from "../levels/move";
import { initializeParenting } from "../levels/parenting";
import { initializePlayground } from "../levels/playground";
import { initializeSitting } from "../levels/sitting";
import { initializeTimeTransform } from "../levels/timeTransform";

export type ConnectionAccess = "export" | "import" | "all";

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
  /**
   * Initial nodes to be spawned on level init.
   * TODO: move inital node declarations to separate file
   */
  initialNodes: Node[];
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
    initialNodes: [
      {
        id: uuidv4(),
        type: "ExportToGameobject",
        position: { x: 0, y: 0 },
        data: { selectedGameObjects: ["raccoon"] as GameObject[] },
        selected: false,
        dragging: false,
        measured: { width: 222, height: 166 },
      },
    ],
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
        connections: [{ label: "solution", access: "export" }],
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
    initialNodes: [],
    initialState: initializeSitting,
    hints: [],
    modifiableGameObjects: [
      {
        id: "raccoon",
        connections: [
          { label: "xpos", access: "export" },
          { label: "ypos", access: "export" },
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
    initialNodes: [],
    initialState: initializeBounce,
    hints: [],
    modifiableGameObjects: [
      {
        id: "raccoon",
        connections: [
          { label: "xpos", access: "export" },
          { label: "ypos", access: "export" },
        ],
      },
      {
        id: "trashcan1",
        connections: [
          { label: "filled", access: "import" },
          { label: "xpos", access: "import" },
          { label: "ypos", access: "import" },
        ],
      },
      {
        id: "trashcan2",
        connections: [
          { label: "filled", access: "import" },
          { label: "xpos", access: "import" },
          { label: "ypos", access: "import" },
        ],
      },
    ],
    availableNodes: [
      "Display",
      "Switch",
      "ImportFromGameobject",
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
    initialNodes: [],
    initialState: initializeMove,
    hints: [],
    modifiableGameObjects: [
      {
        id: "raccoon",
        connections: [
          { label: "xpos", access: "export" },
          { label: "ypos", access: "export" },
        ],
      },
    ],
    availableNodes: [
      "Display",
      "Value",
      "Math",
      "Switch",
      "KeyPress",
      "ImportFromGameobject",
      "ExportToGameobject",
    ],
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
      `Bring trashcans to the flag (3 total).`,
    ],
    success: "That should be enough food for a while... or at least two days.",
    category: "Main Game",
    image: alleyTwo,
    initialNodes: [],
    initialState: initializeParenting,
    hints: [],
    modifiableGameObjects: [
      {
        id: "raccoon",
        connections: [
          { label: "xpos", access: "import" },
          { label: "ypos", access: "import" },
        ],
      },
      {
        id: "trashcanP",
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
      "Switch",
      "KeyPress",
      "ImportFromGameobject",
      "ExportToGameobject",
    ],
    difficulty: 1,
  },
  timeTransform: {
    slug: "timeTransform",
    name: "Time Transform",
    description:
      "This is a level of the main game, introducing time-based transformations.",
    // feel free to change the dialog
    dialog: [
      "Well... we just found, what ever this is, with all those numbers on it.",
      "And there’s this thing spinning around in the middle really fast!",
      "I’ve seen people use this, especially when they’re in a hurry. But it was never going that fast.",
      "It might be broken... maybe I can fix it?",
      "There might be a ladder we could use to get onto the roof — maybe we can spot something that helps us fixing our new little treasure.",
    ],
    goals: [
      "Climb the ladder to the roof.",
      "Find something that helps you fix the clock.",
      "Make the clock spin in the proper speed and direction.",
    ],
    success:
      "My brothers always said humans are stupid, but how can someone inventing such a masterpiece be stupid? I'm so happy we were able to save this!",
    category: "Main Game",
    image: alleyOne,
    initialNodes: [],
    initialState: initializeTimeTransform,
    hints: [],
    modifiableGameObjects: [
      {
        id: "raccoon",
        connections: [
          { label: "xpos", access: "import" },
          { label: "ypos", access: "import" },
          { label: "xpos", access: "export" },
          { label: "ypos", access: "export" },
        ],
      },
    ],
    availableNodes: [
      "Display",
      "Value",
      "Math",
      "Switch",
      "ImportFromGameobject",
      "ExportToGameobject",
      "Time",
    ],
    difficulty: 1,
  },
  kinematics: {
    slug: "kinematics",
    name: "Kinematics",
    description: "PlaceHolder",
    dialog: ["PlaceHolder"],
    goals: ["Do something!"],
    success: "Wow!",
    category: "Main Game",
    image: alleyOne,
    initialNodes: [],
    initialState: initializeKinematics,
    hints: [],
    modifiableGameObjects: [
      {
        id: "arm",
        connections: [
          { label: "joint1x", access: "import" },
          { label: "joint1y", access: "import" },
          { label: "joint1rot", access: "all" },
          { label: "joint2x", access: "import" },
          { label: "joint2y", access: "import" },
          { label: "joint2rot", access: "all" },
          { label: "joint3x", access: "import" },
          { label: "joint3y", access: "import" },
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
    difficulty: 1,
  },
  inverse: {
    slug: "inverse",
    name: "Inverse",
    description: "PlaceHolder",
    dialog: ["PlaceHolder"],
    goals: ["Do something!"],
    success: "Wow!",
    category: "Kinematics",
    image: alleyOne,
    initialNodes: [],
    initialState: initializeInverse,
    hints: [],
    modifiableGameObjects: [
      {
        id: "joint1",
        connections: [
          { label: "rot", access: "all" },
          { label: "x", access: "import" },
          { label: "y", access: "import" },
        ],
      },
      {
        id: "joint2",
        connections: [
          { label: "rot", access: "all" },
          { label: "x", access: "import" },
          { label: "y", access: "import" },
        ],
      },
      {
        id: "joint3",
        connections: [
          { label: "rot", access: "all" },
          { label: "x", access: "import" },
          { label: "y", access: "import" },
        ],
      },
      {
        id: "endeffector",
        connections: [
          { label: "x", access: "import" },
          { label: "y", access: "import" },
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
    initialNodes: [],
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
      "Math",
      "Switch",
      "KeyPress",
      "ImportFromGameobject",
      "ExportToGameobject",
      "Time",
      "ForLoop",
      "Group",
      "MousePosition",
    ],
    difficulty: 0,
  },
} satisfies Record<string, Level>;

export type LevelId = keyof typeof LEVELS;
