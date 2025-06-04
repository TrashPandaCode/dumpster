const t=`---
title: Rotation Matrices
---

## Rotation Matrices

Rotation matrices are **orthogonal matrices** with determinant 1. The set of all rotation matrices is denoted as ("S O three"):

$$
\\mathrm{SO}(3) := \\{ A \\in \\mathbb{R}^{3 \\times 3} : A^T A = I \\ \\text{and} \\ \\det A = 1 \\}
$$

So, $A$ is an **orthonormal matrix** (its column vectors are orthogonal to each other and have unit length).

Given two rotation matrices $A, B$, both $AB$ and $BA$ are also rotation matrices — but they are generally **not equal**. Rotations do **not** commute.

**Problems of rotation matrices:**

* Many/non-intuitive components (9 in total)
* Hard to interpret
* Interpolation often gives poor or incorrect results
`;export{t as default};
