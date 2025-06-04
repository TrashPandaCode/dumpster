const n=`---
title: Rigid Binding
---

## Rigid Binding

In **rigid binding**, a vertex is "bound" to exactly one joint of the skeleton and moves with it.

We define an assignment function:

$$
g: \\mathcal{V} \\rightarrow \\mathcal{G}
$$

which, for each vertex $i$, gives the index $g(i)$ of the joint it's bound to.

If vertex $i$ is bound to joint $k$, then the coordinates of vertex $i$ in the coordinate system of joint $k$ in the bind pose are:

$$
b_i^{[k]} = B^{[k]} b_i^{\\text{world}}
$$

Now we have all vertices represented in the local coordinates of their associated joints.

Each joint has a function:

$$
M^{[k]} : I \\rightarrow \\mathbb{R}^{4 \\times 4}, \\quad t \\mapsto \\bar{M}^{[k]}(t)
$$

which gives a transformation matrix for each $t$ that maps local joint coordinates to world coordinates.

Using $M^{[k]}$, the trajectory of the vertex in world coordinates becomes:

$$
v_i(t) = M^{[k]}(t) \\cdot b_i^{[k]}
$$

or, using the mapping $g$:

$$
v_i(t) = M^{[g(i)]}(t) \\cdot b_i^{[g(i)]} \\quad \\text{for } i = 1, \\dots, n
$$

**Rigid binding** may produce visual artifacts such as mesh self-intersections. To reduce such problems, **smooth binding** can be used.
`;export{n as default};
