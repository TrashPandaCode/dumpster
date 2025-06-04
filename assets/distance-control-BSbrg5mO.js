const n=`---
title: Distance Control
---

## Distance Control

Often, we don't want to control speed directly, but instead specify fixed time points at which a certain distance along the curve (e.g., keyframes) should be reached.

We specify a new arc length function:

$$
l_{\\text{new}} : [c, d] \\rightarrow [0, L]
$$

To reparameterize $f : [a, b] \\rightarrow \\mathbb{R}^d$, we then use:

$$
\\varphi: [c, d] \\rightarrow [a, b],\\quad \\varphi(t) = l_f^{-1}(l_{\\text{new}}(t))
$$
`;export{n as default};
