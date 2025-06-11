import{o as e}from"./chunk-AYJ5UCUI-BS9SflA5.js";const a={title:"Data Cleanup and Post-Processing"};function s(r){const n={h2:"h2",li:"li",strong:"strong",ul:"ul",...r.components};return e.jsxs(e.Fragment,{children:[e.jsx(n.h2,{children:"Data Cleanup and Post-Processing"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Occlusion Problem"}),": Markers are often obscured by props or body parts, leading to gaps in data that must be interpolated."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Marker Swapping"}),": If two markers overlap exactly, the system may confuse them when they separate again (as markers are internally numbered)."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Interference Signals"}),": Sensors may receive interference (e.g., light reflections), causing outliers."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Noise"}),": Small inaccuracies over many frames lead to background noise or signal spikes—data may need filtering."]}),`
`]})]})}function o(r={}){const{wrapper:n}=r.components||{};return n?e.jsx(n,{...r,children:e.jsx(s,{...r})}):s(r)}export{o as default,a as frontmatter};
