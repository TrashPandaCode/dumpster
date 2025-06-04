const e=`---
title: Joint Structures
---

## Joint Structures

* **Character**: A general term for all "living things" with "personality".

* **Skeleton**: Actually the passive part of the musculoskeletal system, but in computer animation it is usually interchanged with the active part. The bones determine the movement, and the body/muscles follow. It consists of *bones/segments/limbs (links/bones)*, which are connected by *joints*.

A joint structure (also called a *kinematic chain*) consists of *links* and *segments*. The ends of kinematic chains are called *end effectors*. The end effector is used to exert an effect on the environment.

Kinematic chains do not have to be sequentially built; they can also branch hierarchically.

The topology of a kinematic chain can be represented by a *linkage graph*. We assume that each segment has at least two joints. The root joint is called the *root joint*. Each joint is assigned a coordinate system. The orientation/position of this coordinate system is described via a coordinate transformation matrix based on the parent joint.

* **Revolute joint**: Rotation of two segments connected by the joint around an axis.
* **Prismatic joint**: Can change the position of two segments along a straight line.

Both joint types can be represented by a coordinate transformation matrix (rotation/translation), each parameterized by a single degree of freedom (angle/translation).

All parameters of a kinematic chain together are called the *configuration* or *state* and can be collected in a *state vector*. We can also define a *state space* or *configuration space* for this vector to restrict movement. The dimension of the state space corresponds to the number of degrees of freedom in the kinematic chain.

To construct more joint types, we can combine the basic ones. For example, a *ball-and-socket joint* is a combination of three revolute joints, and a *planar joint* is a combination of two prismatic joints.
`;export{e as default};
