const e=`---
title: Dynamics
---

## Dynamics

To compute particle positions, we again use the Euler method. To reduce computation, the following simplifications are assumed:

- No interaction forces; external force $F(t,x,\\dot{x})$ depends only on the particle itself.
- No collisions between particles.
- No collisions with other objects.

### Autonomous and General Vector Fields

Forces in space that are independent of time and velocity are called **autonomous vector fields**. These can be represented as vector fields with the form $F: \\mathbb{R}^3 \\to \\mathbb{R}^3$, assigning a vector (force) to each point in space. A particle at a point experiences the corresponding force.

If the vector fields depend on time and velocity, they are called **general vector fields**. We can also define _non-deterministic_ vector fields.

### Alternative Methods

Instead of arbitrary vector fields, we can use geometric objects as **attractors** and **repellers** for easier handling. In this case, the vector field depends on the surface normal of the object.

A simple definition of the force might be:

$$
F(x) = \\text{sgn}(d) \\cdot \\frac{1}{(1 + |d|)^n}
$$

with $d = \\langle n, x \\rangle$. Particles are repelled in front of and behind the plane.

`;export{e as default};
