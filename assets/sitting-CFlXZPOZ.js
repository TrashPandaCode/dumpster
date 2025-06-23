const e=`---
title: Sitting
---

# Level 2: Sitting

## Objective

This level introduces the basic concept of **interacting with game objects via node outputs**. The goal is to make the raccoon sit at a specific, static location in the scene by feeding positional data directly into the \`x\` and \`y\` inputs of the **export node** associated with the raccoon.

## Concepts to Learn

This level teaches the player how to **interface with the game world** using the node system. Specifically, it demonstrates how **exporting values** modifies the attributes of controllable objects in the game.

## Key Principles Introduced

- Understanding **export nodes** as endpoints for node graphs
- Assigning values to **object attributes**
- Using **constant value nodes** to define fixed outputs
- Introduction to the dataflow from logic to animation

## Node Structure Example

\`\`\`plaintext
[Const: 1.0] ──▶ [x input of Export: Raccoon]
[Const: 1.0] ──▶ [y input of Export: Raccoon]
\`\`\`

## Relevant Documentation

This level begins building the connection between **data models** and **visual outcomes**. Concepts from the following pages will become more relevant as the player progresses:

- [Scene API](/docs/hierarchies/scene-api)
- [Coordinate Systems](/docs/hierarchies/coordinate-systems)
- [Transformation Hierarchies](/docs/hierarchies/transformation-hierarchies)

## Educational Notes

The **export node** acts like a sink in the dataflow graph. It does not compute but rather **writes values into the scene graph**, updating the state of game objects. This level helps learners conceptualize how **data propagation** through a node system ultimately produces visible effects in a simulated world.

In essence, players are programming by assigning values — a form of declarative animation specification.
`;export{e as default};
