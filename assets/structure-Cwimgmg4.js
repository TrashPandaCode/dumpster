import{o as e}from"./chunk-AYJ5UCUI-DfzbB4N7.js";const r={title:"Structure of a Particle System"};function i(n){const t={h2:"h2",li:"li",p:"p",ul:"ul",...n.components};return e.jsxs(e.Fragment,{children:[e.jsx(t.h2,{children:"Structure of a Particle System"}),`
`,e.jsx(t.p,{children:"Particle systems consist of — particles... These have a position, velocity, etc."}),`
`,e.jsx(t.p,{children:'They can "die" or be "born," and in the time between, they "live" — participating in the simulation. Each simulation frame involves the following steps:'}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsx(t.li,{children:"Generate new particles"}),`
`,e.jsx(t.li,{children:"Assign initial state to new particles"}),`
`,e.jsx(t.li,{children:"Remove dying particles"}),`
`,e.jsx(t.li,{children:"Update the remaining particles"}),`
`]})]})}function l(n={}){const{wrapper:t}=n.components||{};return t?e.jsx(t,{...n,children:e.jsx(i,{...n})}):i(n)}export{l as default,r as frontmatter};
