import{o as e}from"./chunk-AYJ5UCUI-BS9SflA5.js";const i={title:"Gravity"};function a(s){const n={a:"a",annotation:"annotation",code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",math:"math",mi:"mi",mo:"mo",mrow:"mrow",p:"p",semantics:"semantics",span:"span",strong:"strong",ul:"ul",...s.components};return e.jsxs(e.Fragment,{children:[e.jsx(n.h1,{children:"Level 8: Gravity"}),`
`,e.jsx(n.h2,{children:"Objective"}),`
`,e.jsx(n.p,{children:"In this level the player is tasked with creating a simple physics system to move two gameobjects:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["The trashcan needs to be assigned a ",e.jsx(n.strong,{children:"downward velocity"}),"."]}),`
`,e.jsxs(n.li,{children:["The raccoon needs to be given a ",e.jsx(n.strong,{children:"custom velocity handle"})," to handle gravity and a jump input."]}),`
`,e.jsx(n.li,{children:`The raccoons Y axis position needs to be calculated for every frame.
When all these mechanics are implemented the player has to make the raccoon jump intro the trashcan.`}),`
`]}),`
`,e.jsx(n.h2,{children:"Scenario"}),`
`,e.jsx(n.p,{children:`The player encounters a floating trashcan.
The raccoon wants to be able to jump into the trashcan, but it has no ability to jump yet and is unable to reach the trashcan.
With the help of the player the raccoon wants to make the trashcan fall from the sky and jump into it.`}),`
`,e.jsx(n.h2,{children:"Key Concepts Introduced"}),`
`,e.jsx(n.h3,{children:"Velocity-based movement"}),`
`,e.jsxs(n.p,{children:["In this level we are using velocity-based movement to further expand on the movement we already added in the ",e.jsx(n.a,{href:"/docs/level-guides/move",children:"Move"}),` level.
Velocity describes how fast an object is moving and in what direction.
So instead of the movement keys directly affeting the raccoons position, they will only affect the velocity of the raccoon.
This means that each frame the raccoons position needs to be calculated using its last position and it's current velocity.`]}),`
`,e.jsx(n.p,{children:"For simplicity we are only applying this concept to the Y axis in this level."}),`
`,e.jsx(n.h3,{children:"Custom handles"}),`
`,e.jsxs(n.p,{children:["Custom handles can be added using the ",e.jsx(n.code,{children:"ExportToGameobject"})," node. They help in carrying over additional data from the previous frame."]}),`
`,e.jsx(n.p,{children:`In this level the player only has the raccoons Y axis position available as import and export.
A custom velocity handle needs to be added to keep track of the raccoons momentum in each frame.`}),`
`,e.jsx(n.h2,{children:"Strategic Goals"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Assign a value to the trashcans Y axis velocity"}),`
`,e.jsx(n.li,{children:"Create a custom velocity handle for the raccoon and calculate the raccoons Y axis position for each frame using the velocity"}),`
`]}),`
`,e.jsx(n.p,{children:"The formula with which to calculate the displacement of the raccoon per frame is:"}),`
`,e.jsx(n.span,{className:"katex-display",children:e.jsxs(n.span,{className:"katex",children:[e.jsx(n.span,{className:"katex-mathml",children:e.jsx(n.math,{xmlns:"http://www.w3.org/1998/Math/MathML",display:"block",children:e.jsxs(n.semantics,{children:[e.jsxs(n.mrow,{children:[e.jsx(n.mi,{children:"v"}),e.jsx(n.mo,{children:"⋅"}),e.jsx(n.mi,{mathvariant:"normal",children:"Δ"}),e.jsx(n.mi,{children:"t"}),e.jsx(n.mo,{children:"="}),e.jsx(n.mi,{children:"d"})]}),e.jsx(n.annotation,{encoding:"application/x-tex",children:"v \\cdot \\Delta t = d"})]})})}),e.jsxs(n.span,{className:"katex-html","aria-hidden":"true",children:[e.jsxs(n.span,{className:"base",children:[e.jsx(n.span,{className:"strut",style:{height:"0.4445em"}}),e.jsx(n.span,{className:"mord mathnormal",style:{marginRight:"0.03588em"},children:"v"}),e.jsx(n.span,{className:"mspace",style:{marginRight:"0.2222em"}}),e.jsx(n.span,{className:"mbin",children:"⋅"}),e.jsx(n.span,{className:"mspace",style:{marginRight:"0.2222em"}})]}),e.jsxs(n.span,{className:"base",children:[e.jsx(n.span,{className:"strut",style:{height:"0.6833em"}}),e.jsx(n.span,{className:"mord",children:"Δ"}),e.jsx(n.span,{className:"mord mathnormal",children:"t"}),e.jsx(n.span,{className:"mspace",style:{marginRight:"0.2778em"}}),e.jsx(n.span,{className:"mrel",children:"="}),e.jsx(n.span,{className:"mspace",style:{marginRight:"0.2778em"}})]}),e.jsxs(n.span,{className:"base",children:[e.jsx(n.span,{className:"strut",style:{height:"0.6944em"}}),e.jsx(n.span,{className:"mord mathnormal",children:"d"})]})]})]})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["Create a constant gravity force using ",e.jsx(n.code,{children:"deltaTime"})," and add it to the velocity each frame",`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Make sure the velocity doesn't scale infinitely while the raccoon is standing on the ground"}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:["Add a ",e.jsx(n.code,{children:"KeyPress"})," node, which triggers a jump force being added to the velocity"]}),`
`]}),`
`,e.jsx(n.h2,{children:"Relevant Documentation"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:e.jsx(n.a,{href:"/docs/physically-based-animation/dynamics-of-a-point-mass",children:"Physically Based Animation"})}),`
`,e.jsx(n.li,{children:e.jsx(n.a,{href:"/docs/nodes/export",children:"Export Node"})}),`
`]})]})}function c(s={}){const{wrapper:n}=s.components||{};return n?e.jsx(n,{...s,children:e.jsx(a,{...s})}):a(s)}export{c as default,i as frontmatter};
