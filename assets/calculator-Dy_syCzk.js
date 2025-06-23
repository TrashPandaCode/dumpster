const e=`---
title: Calculator
---

# Level 1: Calculator

## Objective

In this introductory level, the player is tasked with solving the arithmetic expression:

$$
7 + 5 × 2 - 3 ÷ 3
$$

The correct result must be computed using the node-based interface and assigned to the \`solution\` output handle of a designated **Export Node** in the scene. The objective is to familiarize the user with basic node-based composition, arithmetic logic, and operator precedence in the context of visual programming.

## Learning Outcomes

- Understand how arithmetic expressions are decomposed into binary operations.
- Learn the precedence and associativity rules of arithmetic operations and how they are represented in a directed node graph.
- Gain hands-on experience with node-based interfaces: adding, connecting, and evaluating nodes.
- Learn to interact with input/output handles and set node parameters.

## Key Concepts

### Operator Precedence

The mathematical expression must be parsed and executed in accordance with conventional operator precedence:

1. **Multiplication and Division** have higher precedence than Addition and Subtraction.
2. **Left-to-Right Associativity**: operators with the same precedence are evaluated from left to right.

Thus, the expression is evaluated as:

$$
((7 + (5 × 2)) - (3 ÷ 3))
$$

This breakdown must be translated into a corresponding **node graph**, where each binary operation is represented by an individual arithmetic node, and the result is sequentially passed along the directed edges.

### Node Graph Construction

- Each arithmetic operator (\`+\`, \`-\`, \`*\`, \`/\`) is mapped to a dedicated **Math Node**.
- Constants (\`7\`, \`5\`, \`2\`, \`3\`, etc.) are introduced via **Value Nodes**.
- The resulting value must be routed to the \`solution\` input of the **Export Node**.

### Node Interaction

- Players must **drag** connections between output and input ports of nodes.
- Correct evaluation requires respecting **evaluation order**—i.e., intermediate results must be routed before final operations are performed.
- Node outputs dynamically reflect computed values and update upon changes in connected inputs.
`;export{e as default};
