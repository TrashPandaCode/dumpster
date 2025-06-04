const e=`---
title: Particle Properties
---

## Particle Properties

To describe a particle, we need to define its properties. The most common properties of a particle are:

- Position $x \\in \\mathbb{R}^3$
- Velocity $v \\in \\mathbb{R}^3$
- Birth time $T_\\text{birth} \\in \\mathbb{R}$
- Lifetime $\\Delta_\\text{life} \\in \\mathbb{R} \\cup \\{\\infty\\}, \\Delta_\\text{life} > 0$
- Additional attributes (shape, color, size, ...)

Usually, lifetime is specified as remaining lifetime in frames, which eliminates the need to store the birth time.

`;export{e as default};
