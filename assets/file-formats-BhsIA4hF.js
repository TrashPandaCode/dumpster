import{o as n}from"./chunk-AYJ5UCUI-jyqNdttv.js";const r={title:"File Formats"};function s(i){const e={code:"code",h2:"h2",h3:"h3",li:"li",p:"p",strong:"strong",ul:"ul",...i.components};return n.jsxs(n.Fragment,{children:[n.jsx(e.h2,{children:"File Formats"}),`
`,n.jsxs(e.p,{children:["Common formats include ",n.jsx(e.strong,{children:"C3D, ASF/ACM, and BVA"}),`.
The most widely used format is `,n.jsx(e.strong,{children:"BVH"})," (BioVision Hierarchical file format), which stores data in ASCII format."]}),`
`,n.jsx(e.p,{children:"Keywords in a BVH file include:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:n.jsx(e.code,{children:"HIERARCHY"})}),`
`,n.jsx(e.li,{children:n.jsx(e.code,{children:"ROOT"})}),`
`,n.jsx(e.li,{children:n.jsx(e.code,{children:"OFFSET"})}),`
`,n.jsx(e.li,{children:n.jsx(e.code,{children:"CHANNELS"})}),`
`,n.jsx(e.li,{children:n.jsx(e.code,{children:"JOINT"})}),`
`]}),`
`,n.jsx(e.p,{children:"These are used to represent the skeleton's topology hierarchically."}),`
`,n.jsxs(e.p,{children:["The second part of the file (",n.jsx(e.code,{children:"MOTION"}),") stores the animation data, which are linked to joints via the ",n.jsx(e.code,{children:"CHANNELS"})," keyword."]}),`
`,n.jsxs(e.p,{children:["A common challenge in BVH is the ",n.jsx(e.strong,{children:"order of rotation multiplications"})," (extrinsic vs. intrinsic)."]}),`
`,n.jsx(e.h3,{children:"Advantages of BVH:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Easy to read and edit due to plain text format"}),`
`]}),`
`,n.jsx(e.h3,{children:"Disadvantages:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Skeletal geometry only defines relative joint positions"}),`
`,n.jsx(e.li,{children:"No default pose with parallel joints"}),`
`,n.jsx(e.li,{children:"No formal standardization"}),`
`]})]})}function l(i={}){const{wrapper:e}=i.components||{};return e?n.jsx(e,{...i,children:n.jsx(s,{...i})}):s(i)}export{l as default,r as frontmatter};
