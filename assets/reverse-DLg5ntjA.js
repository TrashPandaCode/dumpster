const e=`---
title: Reverse
---


# Level 6: Reverse

## Objective

In this level, the user must construct a time transformation that causes a **pocket watch** to run **in reverse**, while maintaining the **same speed** as the reference **clock tower**. The problem builds directly upon the linear time transformation introduced in the previous level but introduces **negative scaling** to model reversal.

## Scenario

After a previous attempt to modify the watch's time behavior, the result now appears erratic. The in-game character expresses a desire for the pocket watch to behave exactly like the big clock—but in reverse. The player is tasked with implementing a time mapping that yields a reversed timeline.

## Learning Outcomes

- Understand the mathematical meaning and visual implications of **negative time scaling**.
- Apply knowledge of linear transformations to achieve **time inversion**.
- Strengthen understanding of local vs. global time axes by observing the reversed temporal effect.

## Key Concepts

### Negative Time Scaling

In a linear transformation of the form:

$$
t' = a \\cdot (t + b)
$$

using a **negative value** for the scaling factor \`a\` effectively reverses the direction of time. The result is a mirror of the original animation with respect to a vertical axis. This is a **core technique** in animation and simulation when:

- Reversing playback is needed (e.g. rewinding a motion).
- Time-symmetric behaviors are desired.
- Procedural effects depend on mirrored dynamics.

To ensure the reversed clock **ticks at the same rate** as the reference, the magnitude of \`a\` must remain \`1\`, with only the sign being inverted.

### Inverting Time and Synchronization

It's essential that the reversed clock remains synchronized in speed but **desynchronized in direction**. This often means controlling the **origin** (through the offset \`b\`) to ensure alignment of meaningful visual states, such as when both clocks should display the same time at a specific instant.

Relevant concepts:
- [Time Axes](/docs/time-and-game-loop/time-axes)
- [Global and Local Time Axes](/docs/time-and-game-loop/global-and-local-time-axes)

### Practical Node Graph Construction

To achieve the reversal:

- Use a **Time Node** to access the base time.
- Apply a **multiplication node** with a factor of \`-1\` to invert the direction.
- Optionally apply an **offset** to align the phase (though not required in this level).

By visually connecting these transformations in the node graph, players build a **pipeline of time manipulation**, which becomes foundational for non-linear animation systems later.

## Suggested Reading

To deepen understanding, players are encouraged to review:

- [Global and Local Time Axes](/docs/time-and-game-loop/global-and-local-time-axes)
- [Game Loop](/docs/time-and-game-loop/game-loop): Reinforces how continuous time input flows through update cycles.
`;export{e as default};
