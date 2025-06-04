const n=`---
title: Bézier Curves
---

## Bézier Curves

Bézier curves are polynomial curves that solve the following basic problem:

Given $n + 1$ points $p_0, \\dots, p_n$, find a curve that interpolates the first and last points $p_0$ and $p_n$. The other control points $p_1, \\dots, p_{n-1}$ "pull" the curve in their direction, similar to magnets.

Connecting all the control points in order forms the **control polygon**.


## Bézier Curves of Degree 1, 2, and 3

All Bézier curves have the form:

$$
B: [0, 1] \\to \\mathbb{R}^d
$$

The weighting functions of Bézier curves are polynomials. A Bézier curve of degree $n$ requires $n + 1$ control points.

* **Degree 1**: Linear segment between two control points:

  $$
  B(t) = (1 - t)p_0 + t p_1,\\quad B(0) = p_0,\\ B(1) = p_1
  $$

* **Degree 2** (Quadratic Bézier curve):

  $$
  B(t) = (1 - t)^2 p_0 + 2(1 - t)t p_1 + t^2 p_2
  $$

* **Degree 3** (Cubic Bézier curve):

  $$
  B(t) = (1 - t)^3 p_0 + 3(1 - t)^2 t p_1 + 3(1 - t)t^2 p_2 + t^3 p_3
  $$


## Bézier Curves of Arbitrary Degree

Given $n + 1$ control points $p_0, \\dots, p_n$, the **Bézier curve of degree $n$** is defined as:

$$
B(t) = \\sum_{i=0}^n B_i^n(t) p_i
$$

where the **weighting functions** $B_i^n(t)$ are called **Bernstein polynomials** and defined as:

$$
B_i^n(t) = \\binom{n}{i} t^i (1 - t)^{n - i},\\quad \\text{with } \\binom{n}{i} = \\frac{n!}{i!(n - i)!}
$$


## Properties of Bernstein Polynomials

* **Partition of unity**: For all $t \\in [0, 1]$,

  $$
  \\sum_{i=0}^n B_i^n(t) = 1
  $$

* **Positivity**: All Bernstein polynomials are non-negative on $[0, 1]$

* **Symmetry**: The graph of $B_{n-i}^n(t)$ is the reflection of the graph of $B_i^n(t)$ about $t = \\frac{1}{2}$

* **Recursion**: Bernstein polynomials of degree $n$ can be computed from two of degree $n - 1$:

  $$
  B_i^n(t) = (1 - t) B_i^{n - 1}(t) + t B_{i - 1}^{n - 1}(t)
  $$

## Properties of Bézier Curves

* **Interpolation property**: $B(0) = p_0$, $B(1) = p_n$. The Bézier curve interpolates the first and last control points.

* **Tangent property**: The derivatives at the endpoints are:

  $$
  B'(0) = n(p_1 - p_0),\\quad B'(1) = n(p_n - p_{n - 1})
  $$

  So the tangents at the ends point toward the next/previous control point.

* **Convex hull property**: The curve lies entirely within the **convex hull** of its control points:

  $$
  B(t) \\in \\text{conv}\\{p_0, \\dots, p_n\\}
  $$

* **Affine invariance**: Applying an affine transformation $A \\in \\mathbb{R}^{d \\times d}$ to the Bézier curve is equivalent to applying it to the control points:

  $$
  A \\cdot B(t) = \\sum_{i=0}^n B_i^n(t) (A p_i)
  $$

## Evaluation of Bézier Curves

To compute Bernstein polynomials efficiently:

* Precompute binomial coefficients using **Pascal’s triangle** to avoid factorials and divisions.
* Rewrite polynomials using **Horner’s scheme** to reduce multiplications and improve runtime from $O(n^2)$ to $O(n)$.
`;export{n as default};
