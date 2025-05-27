---
title: Import From Gameobject
---

# Import from Gameobject

The _Import from GameObject_ node provides read access to gameobject specific properties of one or more gameobjects in the scene.

There are read and write specific properties, meaning that not all properties of one gameobject are shared between the _Import From_ and _Export To Gameobject_ nodes.

## Functionality

- A dropdown menu lists all selectable gameobjects.
- You can select a single gameobject or multiple gameobjects.
- When selecting a single gameobject, all of its available outputs (properties) will be displayed.
- When selecting multiple gameobjects, only the common (shared) outputs across all selected gameobjects are shown.
- When multiple gameobjects are selected, an index input appears. Use this input to specify which gameobject's values to access by index.

## Properties

- **Index** (visible only when multiple gameobjects are selected): An integer input used to select which gameobject to read from in the list.

  - when an index not corresponding to a gameobject is used the node will output nothing

- **Outputs**: The available properties of the selected gameobject(s), such as position, rotation, etc. These update dynamically based on the selection.

<DocsNodeEditor type="DocsImportFromGameobject" />
