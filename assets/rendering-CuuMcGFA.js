import{o as e}from"./chunk-AYJ5UCUI-jyqNdttv.js";const r={title:"Rendering"};function t(s){const n={em:"em",h2:"h2",li:"li",p:"p",strong:"strong",ul:"ul",...s.components};return e.jsxs(e.Fragment,{children:[e.jsx(n.h2,{children:"Rendering"}),`
`,e.jsx(n.p,{children:"As particle systems can consist of thousands of particles, rendering them efficiently is crucial. The choice of rendering method depends on the desired visual effect and performance considerations. Here are some common methods:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Points and Lines"}),": Minimal computational cost; requires radius, color, transparency. Overlapping particles can be additively or subtractively blended."]}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Sprites"}),": Each particle is represented by a small image (usually two triangles). To prevent side views, ",e.jsx(n.em,{children:"billboarding"})," is used, aligning the rectangle normal toward the camera's projection center. If the camera gets too close, sprite rasterization may become visible."]}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"3D Objects"}),": The particle system should also animate rotation. This comes with high computational cost."]}),`
`]}),`
`]})]})}function o(s={}){const{wrapper:n}=s.components||{};return n?e.jsx(n,{...s,children:e.jsx(t,{...s})}):t(s)}export{o as default,r as frontmatter};
