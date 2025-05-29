import{o as e}from"./chunk-AYJ5UCUI-DfzbB4N7.js";const i={title:"Hierarchies in Scenes"};function t(r){const n={a:"a",blockquote:"blockquote",em:"em",h2:"h2",h3:"h3",img:"img",p:"p",strong:"strong",...r.components};return e.jsxs(e.Fragment,{children:[e.jsx(n.h2,{children:"Transformation Hierarchies"}),`
`,e.jsxs(n.p,{children:["For modeling and animation purposes, objects are often divided into multiple sub-objects. To avoid having to move each element individually during translation, the sub-objects are positioned ",e.jsx(n.strong,{children:"relative to each other"}),"."]}),`
`,e.jsx(n.h3,{children:"Coordinate Transformation"}),`
`,e.jsxs(n.p,{children:["The objects in a transformation hierarchy are connected via the coordinate transformation matrices mentioned in ",e.jsx(n.a,{href:"/docs/hierarchies/coordinate-systems",children:"Coordinate Systems"}),"."]}),`
`,e.jsx(n.p,{children:e.jsx(n.img,{src:"/docs/transform_hier.png",alt:"Transformation Hierarchy"})}),`
`,e.jsx(n.p,{children:"When rendering, all transformation matrices must be traversed for each object to determine its world coordinates."}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Transformation hierarchy tree:"})," A labeled tree graph. Each edge represents the coordinate transformation matrix from child to parent node. The arrows of the edges always point ",e.jsx(n.em,{children:"upward"}),"."]}),`
`]})]})}function s(r={}){const{wrapper:n}=r.components||{};return n?e.jsx(n,{...r,children:e.jsx(t,{...r})}):t(r)}export{s as default,i as frontmatter};
