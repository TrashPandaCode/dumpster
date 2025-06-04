const e=`---
title: Animation Systems
---

# Animation Systems

In this context, *animation* means that we can change the state of scene objects depending on time. On its own, a **scene graph** can only be used for static scenes. There is no unified standard for animation systems — in practice, many different implementations exist.

## Simulation Objects

All objects to be animated are referred to as **simulation objects** (*game objects*). The state of such an object can be considered an element $z$ of a set $\\mathcal{Z}$.
$\\mathcal{Z}$ is the set of all possible states and is called the **state space**.

Our task in animation is to repeatedly execute a **state transition function**:

$$
f : \\mathbb{R} \\times \\mathcal{Z} \\times \\mathcal{I} \\rightarrow \\mathcal{Z}
$$

This function calculates a new state based on the current state and input/control values ($\\mathcal{I}$).

The call to the state transition function is also provided with a time variable $t \\in \\mathbb{R}$ (see [Time and Game Loop](/docs/time-and-game-loop)), which acts as an ordering dimension, defining a *before* and *after*.

The inputs and outputs of the objects can be connected to each other more or less arbitrarily. However, it is not allowed to connect multiple outputs to a single input. Cyclic connections are typically not permitted.


**Figure:**
Block diagram with multiple inputs (left) and with vector inputs.

![Block diagram](/docs/anim1.png)
![Screenshot](/docs/anim2.png)

Before we render our scene graph, we must first call the state transition functions of all our objects. An evaluation **order must be agreed upon**, otherwise the results may vary.
`;export{e as default};
