/*
 * Authors:
 *
 * Purpose:
 */
import type { Node } from "@xyflow/react";
import { v4 as uuidv4 } from "uuid";

import bounceCard from "~/assets/home-cards/bounce_card.png";
import calcCard from "~/assets/home-cards/calc_card.png";
import forwardCard from "~/assets/home-cards/forward_card.png";
import gravityCard from "~/assets/home-cards/gravity_card.png";
import inverseCard from "~/assets/home-cards/inverse_card.png";
import linearCard from "~/assets/home-cards/linear_card.png";
import loopingCard from "~/assets/home-cards/looping_card.png";
import moveCard from "~/assets/home-cards/move_card.png";
import parentingCard from "~/assets/home-cards/parenting_card.png";
import playgroundCard from "~/assets/home-cards/playground_card.png";
import sittingCard from "~/assets/home-cards/sitting_card.png";
import type { NodeType } from "~/lib/node-editor/nodes/node-types";
import { type GameObject } from "../game-objects";
import { initializeBounce } from "../levels/bounce";
import { initializeCalculator } from "../levels/calculator";
import { initializeForward } from "../levels/forward";
import { initializeGravity } from "../levels/gravity";
import { initializeInverse } from "../levels/inverse";
import { initializeLinear } from "../levels/linear";
import { initializeLooping } from "../levels/looping";
import { initializeMove } from "../levels/move";
import { initializeParenting } from "../levels/parenting";
import { initializePlayground } from "../levels/playground";
import { initializeReverse } from "../levels/reverse";
import { initializeSitting } from "../levels/sitting";

/**
 * The ConnectionAccess type defines the access level for GameObject handles.
 * - "export" allows exporting data from node to the GameObject.
 * - "import" allows importing data into the node from the GameObject.
 * - "all" allows both importing and exporting data.
 */
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
   * Initial nodes to be spawned on level init or path to nodes JSON file.
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
  difficulty: 0 | 1 | 2 | 3;
};

/**
 * The ModifiableGameObject type represents a game object that can be modified using nodes in the level.
 * It includes an ID, optional display name, and a list of connections with access levels.
 */
export type ModifiableGameObject = {
  id: GameObject;
  displayName?: string;
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
    hints: [
      "Use constant value nodes to define the raccoon's x and y position.",
      "Connect the constants to the corresponding inputs of the raccoon's export node.",
      "The export node updates the raccoon's position in the game world.",
      "Changing the values will instantly move the raccoon to the new location.",
    ],
    modifiableGameObjects: [
      {
        id: "raccoon",
        connections: [
          { label: "x", access: "export" },
          { label: "y", access: "export" },
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
    hints: [
      "Use a switch node to choose between two positions based on the trashcan's filled state.",
      "The 'filled' output of a trashcan is already a boolean — you can connect it directly to a switch node.",
      "Use two switch nodes: one for the x-position, one for the y-position.",
      "Only one trashcan is filled at a time — route the correct position based on that.",
      "Connect the outputs of the switch nodes to the raccoon's export node.",
    ],
    modifiableGameObjects: [
      {
        id: "raccoon",
        connections: [
          { label: "x", access: "export" },
          { label: "y", access: "export" },
        ],
      },
      {
        id: "trashcanFilled",
        displayName: "trashcan1",
        connections: [
          { label: "filled", access: "import" },
          { label: "x", access: "import" },
          { label: "y", access: "import" },
        ],
      },
      {
        id: "trashcanEmpty",
        displayName: "trashcan2",
        connections: [
          { label: "filled", access: "import" },
          { label: "x", access: "import" },
          { label: "y", access: "import" },
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
  parenting: {
    slug: "parenting",
    name: "Parenting",
    description: "This level introduces parenting mechanics.",
    dialog: [
      "Whoa... this trash can is a real goldmine!",
      "There's so much food in here, there's no way I can eat it all right now.",
      "Maybe I should just take the whole can with me... but how?",
      "Would you help me carry it back to my secret little hideout?",
      "Just be careful not to drop it, okay?",
    ],
    goals: [
      "Parent the trashcan to the raccoon.",
      "Bring trashcans to the flag (3 total).",
    ],
    success: "That should be enough food for a while... or at least two days.",
    category: "Hierarchies",
    image: parentingCard,
    initialNodes: [],
    initialState: initializeParenting,
    hints: [
      "Use an import node to read the raccoon's position.",
      "Use an export node to write to the trashcan's position.",
      "Connect the raccoon's x and y position to the trashcan's export node.",
    ],
    modifiableGameObjects: [
      {
        id: "raccoon",
        connections: [
          { label: "x", access: "import" },
          { label: "y", access: "import" },
        ],
      },
      {
        id: "trashcanFilled",
        displayName: "trashcan",
        connections: [
          { label: "x", access: "all" },
          { label: "y", access: "all" },
        ],
      },
    ],
    availableNodes: [
      "Display",
      "Value",
      "Math",
      "ImportFromGameobject",
      "ExportToGameobject",
    ],
    difficulty: 1,
  },
  linear: {
    slug: "linear",
    name: "Linear",
    description:
      "This level introduces linear time-based signal transformations.",
    dialog: [
      "This watch isn't doing anything… maybe it needs a time signal?",
      "Now I want this clock to move faster than that big clock over there!",
      "The clock tower is soooo slow. Also could you offset my time?",
      "Try adding an offset of 50 seconds and maybe make my time 100 times faster?",
      "If this works for like... 5 seconds, I'll call it good enough.",
    ],
    goals: ["Make the pocketwatch match the clock tower."],
    success:
      "Nice! The watch finally works like I want it to — it looks great now.",
    category: "Time Transformation",
    image: linearCard,
    initialNodes: [],
    initialState: initializeLinear,
    hints: [
      "Use the Time node to get the current simulation time.",
      "Add 50 to the time value to apply the time offset.",
      "Multiply the result by 100 to apply the time scaling.",
      "Connect the final time value to the pocket watch's input.",
    ],
    modifiableGameObjects: [
      {
        id: "pocketwatch",
        connections: [{ label: "time", access: "export" }],
      },
    ],
    availableNodes: ["Display", "Value", "Math", "ExportToGameobject", "Time"],
    difficulty: 2,
  },
  reverse: {
    slug: "reverse",
    name: "Reverse",
    description:
      "This level furthers understanding of linear time-based signal transformations.",
    dialog: [
      "Okay... I think I messed it up even more.",
      "Now the clock tower is ticking way faster than my watch.",
      "Can you make it catch up?",
      "I think my watch is now 100 times slower. And behind by 50 clock-tower-seconds.",
      "All I want is for it to run at the same speed as the big clock... just in reverse.",
      "Please, if you can get it working for at least 5 seconds, I promise I'll stop bugging you about it.",
    ],
    goals: [
      "Make the small watch run in reverse at the same speed as the big clock.",
    ],
    success:
      "Whoa! It's actually working! Backwards brilliance! I knew bothering you would pay off!",
    category: "Time Transformation",
    image: linearCard,
    initialNodes: [],
    initialState: initializeReverse,
    hints: [
      "Use the Time node to access the global time.",
      "Bring the time to the same scale as the clock tower.",
      "Now add the offset to the time.",
      "A negative scale flips the animation direction.",
      "Multiply the time value by -1 to reverse it.",
    ],
    modifiableGameObjects: [
      {
        id: "pocketwatch",
        connections: [{ label: "time", access: "export" }],
      },
    ],
    availableNodes: ["Display", "Value", "Math", "ExportToGameobject", "Time"],
    difficulty: 2,
  },
  move: {
    slug: "move",
    name: "Move",
    description: "This level introduces movement mechanics.",
    dialog: [
      "Alright, today's the day — I'm finally gonna learn how to walk! I mean, even tiny humans can do it, so how hard can it be?",
      "Left paw, right paw... wait, which one is my right again?",
      "Imagine: me, strutting around, hunting for snacks all by myself! No more waiting for food to come to me—I'm gonna chase those leftovers down!",
    ],
    goals: ["Move the raccoon to the flag."],
    success:
      "Right foot, left foot, right foot, left foot...I could do this all day!",
    category: "Motion",
    image: moveCard,
    initialNodes: [],
    initialState: initializeMove,
    hints: [
      "Use an Import nodes to get the raccoon's current x-position.",
      "Use KeyPress nodes to detect if A or D is pressed.",
      "Pressing A should move the raccoon left (negative x), D moves it right (positive x).",
      "Use a constant for movement speed, e.g. 100.",
      "Get delta time from the Time node to ensure frame rate independence.",
      "Multiply speed times deltaTime times keyPress for movement distance.",
      "Add the result to the current position for D, subtract for A.",
      "Export the new x-position back to the raccoon.",
    ],
    modifiableGameObjects: [
      {
        id: "raccoon",
        connections: [
          { label: "x", access: "all" },
          { label: "y", access: "all" },
        ],
      },
    ],
    availableNodes: [
      "Display",
      "Value",
      "Math",
      "Switch",
      "KeyPress",
      "Time",
      "ImportFromGameobject",
      "ExportToGameobject",
    ],
    difficulty: 2,
  },
  gravity: {
    slug: "gravity",
    name: "Gravity",
    description: "This level introduces gravity.",
    dialog: [
      "Oh! I was just... uh... inspecting this totally-not-impossibly-floating trashcan!",
      "See, I may have dropped my midnight snack up there. Or maybe it floated away? Or maybe I threw it too hard. Who can say, really!",
      "BUT! I have a cunning plan! Could you please make that beautiful trashcan fall from the sky?",
      "And, uh, also... if you could help me jump... that would be AMAZING. My legs are... more wiggly than springy.",
    ],
    goals: [
      "Make the trashcan drop from the sky",
      "Give the raccoon the ability to jump",
      "Jump into the trashcan!",
    ],
    success: "Wheee! Into the bin I go. Smells like victory... and old fries!",
    category: "Motion",
    image: gravityCard,
    initialNodes: [],
    initialState: initializeGravity,
    hints: [
      "The inputs of the trashcan and the raccoon are different. They both require you to do different things",
      "Make sure to check wether the raccoon is hitting the ground or not. Otherwise your velocity might just keep adding up while you're standing still.",
    ],
    modifiableGameObjects: [
      {
        id: "trashcanFilled",
        connections: [{ label: "y vel", access: "export" }],
      },
      {
        id: "raccoon",
        connections: [{ label: "y pos", access: "all" }],
      },
    ],
    availableNodes: [
      "Display",
      "Value",
      "Time",
      "Math",
      "Switch",
      "KeyPress",
      "ImportFromGameobject",
      "ExportToGameobject",
      "Group",
    ],
    difficulty: 2,
  },
  forward: {
    slug: "forward",
    name: "Forward",
    description: "This level introduces the concept of forward kinematics.",
    dialog: [
      "Hey! Quick, I could use some help here!",
      "I was fighting this cat for some left over rotissery chicken and I thought I scared it away..",
      "But it came back with a bunch of its friends and now I'm stuck on this roof.",
      "Can you move these platforms for me so I can make a quick escape?",
    ],
    goals: [
      "Find a way to move the platforms.",
      "Jump over to the other roof.",
    ],
    success: "Oh, just in time.",
    category: "Kinematics",
    image: forwardCard,
    initialNodes: [],
    initialState: initializeForward,
    hints: [
      "Use Export nodes to control the angles of each robotic joint (in degrees).",
      "Experiment with small angle adjustments to see how platform position changes.",
    ],
    modifiableGameObjects: [
      {
        id: "arm",
        connections: [
          { label: "Red Rotation", access: "all" },
          { label: "Green Rotation", access: "all" },
          { label: "Orange Rotation", access: "all" },
          { label: "Blue Rotation", access: "all" },
        ],
      },
    ],
    availableNodes: [
      "Display",
      "Value",
      "Math",
      "ExportToGameobject",
      "ImportFromGameobject",
      "Group",
    ],
    difficulty: 1,
  },
  looping: {
    slug: "looping",
    name: "Looping",
    description: "This level introduces the concept of for loops.",
    dialog: [
      "Alright, here's the deal: I've got five raccoons and five pillars of boxes.",
      "They each want to sit on top of their own tower, obviously. Dignity and all that.",
      "I could do it manually... but I heard you know how to use a for loop?",
      "Think you can loop through them and get each raccoon in place?",
    ],
    goals: [
      "Use a for loop to move the 5 raccoons.",
      "Ensure the placement adapts to the height of each pillar.",
    ],
    success:
      "Perfectly perched! Efficient and elegant - just like a well-written loop",
    category: "Introduction",
    image: loopingCard,
    initialNodes: [],
    initialState: initializeLooping,
    hints: [
      "Use a For Loop node to iterate over the 5 raccoons using an index from 0 to 4.",
      "In the Export node, select all five raccoons and make sure their order matches the crate stack height.",
      "The last two raccoons in the export node list must be flipped.",
      "Each raccoon's target position is based on its crate stack height and index.",
      "Add 1 to the loop index `i` and multiply with -1 to get the height of the raccoon.",
      "Pass the computed position into the Export node inside the loop body.",
    ],
    modifiableGameObjects: [
      {
        id: "raccoon1",
        connections: [{ label: "y", access: "export" }],
      },
      {
        id: "raccoon2",
        connections: [{ label: "y", access: "export" }],
      },
      {
        id: "raccoon3",
        connections: [{ label: "y", access: "export" }],
      },
      {
        id: "raccoon4",
        connections: [{ label: "y", access: "export" }],
      },
      {
        id: "raccoon5",
        connections: [{ label: "y", access: "export" }],
      },
    ],
    availableNodes: [
      "Display",
      "Value",
      "Math",
      "ExportToGameobject",
      "ForLoop",
    ],
    difficulty: 1,
  },
  inverse: {
    slug: "inverse",
    name: "Inverse",
    description: "This level introduces the concept of inverse kinematics.",
    dialog: [
      "Okay, don't freak out, but I haven't had a proper wash in... a while.",
      "There's a robot arm over there and a nice slippery piece of soap - can you get it to reach me?",
      "You'll probably need to use that fancy CCD algorithm to make the arm bend the right way.",
      "Just don't poke me in the eye or anything, alright?",
    ],
    goals: [
      "Use inverse kinematics (CCD) to control the robot arm.",
      "Position the soap so it reaches the raccoon's body.",
      "The soap must stay in contact with the raccoon for at least 5 seconds.",
    ],
    success:
      "Ahhh... finally! I feel like a brand-new raccoon. Thanks for the scrub, robot whisperer!",
    category: "Kinematics",
    image: inverseCard,
    initialNodes: [],
    initialState: initializeInverse,
    hints: [
      "Use a for-loop to iterate from the last joint to the first.",
      "Either use the mouse position or raccoon position as target coordinates",
      "Convert both the end-effector and the target to joint-local space using the WorldToLocal node.",
      "Use atan2 to get angles from vectors pointing to the target and end-effector.",
      "The difference between these angles gives you the rotation adjustment.",
      "Add the delta angle to the current joint's rotation.",
    ],
    modifiableGameObjects: [
      {
        id: "raccoon",
        connections: [
          { label: "x", access: "import" },
          { label: "y", access: "import" },
        ],
      },
      {
        id: "joint1",
        displayName: "redJoint",
        connections: [
          { label: "rotation", access: "all" },
          { label: "x", access: "import" },
          { label: "y", access: "import" },
        ],
      },
      {
        id: "joint2",
        displayName: "greenJoint",
        connections: [
          { label: "rotation", access: "all" },
          { label: "x", access: "import" },
          { label: "y", access: "import" },
        ],
      },
      {
        id: "joint3",
        displayName: "blueJoint",
        connections: [
          { label: "rotation", access: "all" },
          { label: "x", access: "import" },
          { label: "y", access: "import" },
        ],
      },
      {
        id: "endeffector",
        displayName: "soap",
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
      "WorldToLocal",
      "ExportToGameobject",
      "ImportFromGameobject",
      "Switch",
      "Group",
      "ForLoop",
      "MousePosition",
    ],
    difficulty: 3,
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
          { label: "x", access: "all" },
          { label: "y", access: "all" },
        ],
      },
      {
        id: "trashcanEmpty",
        connections: [
          { label: "x", access: "all" },
          { label: "y", access: "all" },
        ],
      },
      {
        id: "trashcanFilled",
        connections: [
          { label: "x", access: "all" },
          { label: "y", access: "all" },
        ],
      },
      {
        id: "goalFlag",
        connections: [
          { label: "x", access: "all" },
          { label: "y", access: "all" },
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
} as const satisfies Record<string, Level>;

export type LevelId = keyof typeof LEVELS;
