import{o as e}from"./chunk-AYJ5UCUI-jyqNdttv.js";const a={title:"Scene Graphs"};function r(t){const n={blockquote:"blockquote",em:"em",h2:"h2",h3:"h3",img:"img",p:"p",strong:"strong",...t.components};return e.jsxs(e.Fragment,{children:[e.jsx(n.h2,{children:"Scene Graphs"}),`
`,e.jsxs(n.p,{children:["A ",e.jsx(n.strong,{children:"scene graph"})," is a data structure commonly used in the development of computer graphics applications. It is an object-oriented data structure that describes the logical and spatial arrangement of the scene to be rendered. However, it is somewhat loosely defined in practice."]}),`
`,e.jsxs(n.p,{children:["An object usually consists of a parent node (",e.jsx(n.strong,{children:"group node"}),"), with its mesh attached as another node (using the identity as the transformation matrix). Meshes/geometries are therefore typically the ",e.jsx(n.strong,{children:"leaves of the tree"}),". The two representations of a scene (transformation hierarchy and scene graph) can be converted into each other."]}),`
`,e.jsx(n.p,{children:e.jsx(n.img,{src:"/docs/scene_graph.png",alt:"Scene Graph"})}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["The arrows of a scene graph always point ",e.jsx(n.em,{children:"downward"}),"."]}),`
`]}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Directed acyclic graphs (DAGs)"})," are a special implementation of scene graphs that allow ring-like structures, but no cycles. This allows for ",e.jsx(n.strong,{children:"object reuse (cloning)"})," and memory optimization."]}),`
`,e.jsx(n.h3,{children:"Evaluation"}),`
`,e.jsx(n.p,{children:"The transformation matrix is recalculated for each geometric object. Starting from the root of the scene graph, the tree is traversed to the corresponding leaf node. The transformation matrices of the nodes passed along the way are multiplied together."}),`
`,e.jsx(n.p,{children:"To render the entire scene, the scene graph must be traversed, and the corresponding transformation matrices computed."}),`
`,e.jsxs(n.p,{children:["Since we repeatedly multiply the same matrices, we can ",e.jsx(n.strong,{children:"store partial results in a stack"})," and reuse them."]}),`
`,e.jsxs(n.p,{children:["The tree is traversed in ",e.jsx(n.strong,{children:"pre-order"}),"."]}),`
`,e.jsx(n.h3,{children:"Extensions"}),`
`,e.jsxs(n.p,{children:["The scene graph can include ",e.jsx(n.strong,{children:"state nodes"}),", which set values during evaluation such as colors or LODs (",e.jsx(n.strong,{children:"switch nodes"}),"). These values remain valid and apply to the corresponding rendering operations until they are changed."]}),`
`,e.jsxs(n.p,{children:["Optimizations such as ",e.jsx(n.strong,{children:"frustum culling"})," can also be applied here (by not traversing certain parts of the tree)."]})]})}function o(t={}){const{wrapper:n}=t.components||{};return n?e.jsx(n,{...t,children:e.jsx(r,{...t})}):r(t)}export{o as default,a as frontmatter};
