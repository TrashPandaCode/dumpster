const e=`---
title: Scene Graphs
---

## Scene Graphs

A **scene graph** is a data structure commonly used in the development of computer graphics applications. It is an object-oriented data structure that describes the logical and spatial arrangement of the scene to be rendered. However, it is somewhat loosely defined in practice.

An object usually consists of a parent node (**group node**), with its mesh attached as another node (using the identity as the transformation matrix). Meshes/geometries are therefore typically the **leaves of the tree**. The two representations of a scene (transformation hierarchy and scene graph) can be converted into each other.

![Scene Graph](/docs/scene_graph.png)

> The arrows of a scene graph always point *downward*.

**Directed acyclic graphs (DAGs)** are a special implementation of scene graphs that allow ring-like structures, but no cycles. This allows for **object reuse (cloning)** and memory optimization.

### Evaluation

The transformation matrix is recalculated for each geometric object. Starting from the root of the scene graph, the tree is traversed to the corresponding leaf node. The transformation matrices of the nodes passed along the way are multiplied together.

To render the entire scene, the scene graph must be traversed, and the corresponding transformation matrices computed.

Since we repeatedly multiply the same matrices, we can **store partial results in a stack** and reuse them.

The tree is traversed in **pre-order**.

### Extensions

The scene graph can include **state nodes**, which set values during evaluation such as colors or LODs (**switch nodes**). These values remain valid and apply to the corresponding rendering operations until they are changed.

Optimizations such as **frustum culling** can also be applied here (by not traversing certain parts of the tree).

`;export{e as default};
