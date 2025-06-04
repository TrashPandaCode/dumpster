const e=`---
title: Marker Position Reconstruction
---

## Marker Position Reconstruction

To determine marker positions in space, the **camera parameters** must first be calibrated.

* **Extrinsic Parameters**: Position and orientation of the camera in world space.
* **Intrinsic Parameters**: Properties like focal length and aspect ratio of the camera image.

Calibration tools such as the *wand* are used for this purpose. A simplified **pinhole camera model** is commonly used.

The **camera projection matrix** $P_f$ maps a point from camera coordinates onto the image plane. The camera thus performs the following transformation:

$$
p_{\\text{proj}}^{\\text{cam}} := P_f \\cdot W^{\\text{cam} \\rightarrow \\text{world}} \\cdot p^{\\text{world}}
$$

However, we're typically interested in the reverse: given the image coordinates $p_{\\text{image}}^{\\text{cam}} \\in \\mathbb{R}^2$, we want to find the corresponding world coordinates. Since the equation above is not invertible (the matrices are not injective), we use **two cameras**.

We trace **rays** from each camera using their inverted transformation matrices $W^{\\text{world} \\rightarrow \\text{camera}}$, and then find the intersection point of the two rays. To do this, we:

1. Set up two line equations.
2. Reformulate them into a **linear system**:

$$
A t = c
$$

3. Solve for $t$. However, due to measurement errors, the system may not have an exact solution. We turn this into a **least squares problem**.

We aim to find $t^\\ast$ such that:

$$
\\| A t^\\ast - c \\| \\leq \\| A t - c \\| \\quad \\text{for all } t \\in \\mathbb{R}^2
$$

This is solved via the **normal equation**:

$$
A^T A t = A^T c
$$

The normal equation always has at least one solution, and it's unique if $\\text{rank}(A) = 2$.

We then take the **midpoint** between the two closest points on the rays as the estimated marker position.
`;export{e as default};
