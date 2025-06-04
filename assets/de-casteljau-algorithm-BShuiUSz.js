const t=`---
title: The de Casteljau Algorithm
---

## The de Casteljau Algorithm

The **de Casteljau algorithm** provides an efficient method for computing Bézier curves as polygonal approximations with arbitrary precision.

It works by recursively performing linear interpolation between control points. Superscript = step, subscript = point index.

* Vertical arrows = multiplication with $(1 - t)$
* Diagonal arrows = multiplication with $t$
* When two arrows point to the same location, their values are added.

This algorithm has a theoretical time complexity of $O(n^2)$, slower than Horner's scheme.
`;export{t as default};
