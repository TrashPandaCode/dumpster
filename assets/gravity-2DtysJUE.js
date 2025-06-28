import{o as e}from"./chunk-AYJ5UCUI-BS9SflA5.js";const o={title:"Gravity"};function a(t){const n={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",p:"p",strong:"strong",ul:"ul",...t.components};return e.jsxs(e.Fragment,{children:[e.jsx(n.h1,{children:"Level 8: Gravity"}),`
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
`,e.jsx(n.p,{children:`In this level we are using velocity-based movement to further expand on the movement we already added in the "Move" level.
Velocity describes how fast an object is moving and in what direction.
So instead of the movement keys directly affeting the raccoons position, they will only affect the velocity of the raccoon.
This means that each frame the raccoons position needs to be calculated using its last position and it's current velocity.`}),`
`,e.jsx(n.p,{children:"For simplicity we are only applying this concept to the Y axis in this level."}),`
`,e.jsx(n.h3,{children:"Custom handles"}),`
`,e.jsxs(n.p,{children:["Custom handles can be added using the ",e.jsx(n.code,{children:"exportToGameobject"})," node. They help in tracking more data over from the last frame."]}),`
`,e.jsx(n.p,{children:`In this level the player only has the raccoons Y axis position available as import and export.
A custom velocity handle needs to be added to keep track of the raccoons momentum in each frame.`}),`
`,e.jsx(n.h2,{children:"Strategic Goals"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Assign a value to the trashcans Y axis velocity"}),`
`,e.jsx(n.li,{children:"Create a custom velocity handle and calculate the raccoons Y axis position for each frame using the velocity"}),`
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
`,e.jsx(n.li,{children:e.jsx(n.a,{href:"docs/nodes/export",children:"Export Node"})}),`
`]})]})}function s(t={}){const{wrapper:n}=t.components||{};return n?e.jsx(n,{...t,children:e.jsx(a,{...t})}):a(t)}export{s as default,o as frontmatter};
