const n=`---
title: Parametic vs. Geometric Continuity
---

## Parametric vs. Geometric Continuity

Let $f: I \\to \\mathbb{R}^d$ be a curve:

* $C^0$-continuous: the curve is continuous.
* $C^1$-continuous: the curve is differentiable and the derivative is continuous.
* $C^n$-continuous: $n$-times continuously differentiable.
* $C^\\infty$: *smooth*, infinitely differentiable.

These are called **parametric continuities** of order $n$.

Even if a curve is differentiable, its trace might still have corners. Conversely, a smooth-looking trace does not imply differentiability.

Let $f$ be continuous at $t_0 \\in I$:

* If left and right derivatives exist and

  $$
  f'_-(t_0) = a \\cdot f'_+(t_0) \\text{ for some } a \\in \\mathbb{R}
  $$

  then $f$ is **geometrically continuous of order 1** at $t_0$ (denoted $G^1$).

* If both first and second left/right derivatives exist and

  $$
  f'_-(t_0) = a f'_+(t_0), \\quad f''_-(t_0) = b f''_+(t_0)
  $$

  then $f$ is **geometrically continuous of order 2** (denoted $G^2$).

* If this holds for all $t \\in I$, the curve is globally $G^1$ or $G^2$-continuous.

Note:

$$
C^1 \\Rightarrow G^1, \\quad C^2 \\Leftrightarrow G^2
$$

**Definition Summary**

* Parametric continuity: $C^n$
* Geometric continuity: $G^n$
`;export{n as default};
