const t=`---
title: Forward Kinematics
---

## Forward Kinematics

Based on a state vector from the state space, we want to compute the position of the end effector in world coordinates. To achieve this, we can multiply the coordinate transformation matrices.

This results in a function
$f: Z \\rightarrow \\mathbb{R}^d$,
which maps the state vector to a point in space. By composing it with a curve $g$, the kinematic chain can also be animated.
`;export{t as default};
