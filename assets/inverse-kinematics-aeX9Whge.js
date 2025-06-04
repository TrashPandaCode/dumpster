const e=`---
title: Inverse Kinematics
---

## Inverse Kinematics

Here, we want to solve the reverse problem: For which state vector $z \\in Z$ is $f(z) = p^{\\text{world}}$? In other words, we want to determine a state such that the end effector reaches a given position.

This task may not be solvable if $p$ is not reachable—i.e., it lies outside the *reachable set* or *workspace*.

$$
\\text{Image}(f) = { f(z) : z \\in Z }
$$

There may also be multiple or infinitely many solutions. This is a relatively difficult problem because we need to solve a nonlinear equation. In the following, we look at how to approximate a solution using numerical methods.
`;export{e as default};
