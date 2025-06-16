const e=`---
title: Math
---

# Math

The _Math_ node offers a number of mathematical calculations and comparisons. The calculation, also called compute type, is selected using the drop down menu. By default _Addition_ is selected.

## Compute Types

| Functions    | Rounding | Trigonometric | Conversion | Compare      | Logical Operators |
| ------------ | -------- | ------------- | ---------- | ------------ | ----------------- |
| Addition     | Round    | Sine          | To Radians | Equals       | AND               |
| Substraction | Floor    | Cosine        | To Degrees | Greater Than | OR                |
| Multiply     | Ceil     | Tangent       |            | Less Than    | XOR               |
| Divide       | Modulo   | Asin          |            |              | NOT               |
| Power        |          | Acos          |            |              | NAND              |
| Logarithm    |          | Atan          |            |              | NOR               |
| Absolute     |          | Atan2         |            |              | XNOR              |

## Properties

- **Result**: The output value determined by both the _x_ and _y_ inputs and the compute type.
- **x**: The first input value for the computation, depending on the compute type this value serves different purposes, such as time or base.
- **y**: The second input value for the computation, depending on the compute type this value serves different purposes, such as decimal places or exponents.

<DocsNodeEditor type="Math" />
`;export{e as default};
