import{o as e}from"./chunk-AYJ5UCUI-BS9SflA5.js";const o={title:"Sitting"};function s(t){const n={a:"a",code:"code",h1:"h1",h2:"h2",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...t.components};return e.jsxs(e.Fragment,{children:[e.jsx(n.h1,{children:"Level 2: Sitting"}),`
`,e.jsx(n.h2,{children:"Objective"}),`
`,e.jsxs(n.p,{children:["This level introduces the basic concept of ",e.jsx(n.strong,{children:"interacting with game objects via node outputs"}),". The goal is to make the raccoon sit at a specific, static location in the scene by feeding positional data directly into the ",e.jsx(n.code,{children:"x"})," and ",e.jsx(n.code,{children:"y"})," inputs of the ",e.jsx(n.strong,{children:"export node"})," associated with the raccoon."]}),`
`,e.jsx(n.h2,{children:"Concepts to Learn"}),`
`,e.jsxs(n.p,{children:["This level teaches the player how to ",e.jsx(n.strong,{children:"interface with the game world"})," using the node system. Specifically, it demonstrates how ",e.jsx(n.strong,{children:"exporting values"})," modifies the attributes of controllable objects in the game."]}),`
`,e.jsx(n.h2,{children:"Key Principles Introduced"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["Understanding ",e.jsx(n.strong,{children:"export nodes"})," as endpoints for node graphs"]}),`
`,e.jsxs(n.li,{children:["Assigning values to ",e.jsx(n.strong,{children:"object attributes"})]}),`
`,e.jsxs(n.li,{children:["Using ",e.jsx(n.strong,{children:"constant value nodes"})," to define fixed outputs"]}),`
`,e.jsx(n.li,{children:"Introduction to the dataflow from logic to animation"}),`
`]}),`
`,e.jsx(n.h2,{children:"Node Structure Example"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-plaintext",children:`[Const: 1.0] ──▶ [x input of Export: Raccoon]
[Const: 1.0] ──▶ [y input of Export: Raccoon]
`})}),`
`,e.jsx(n.h2,{children:"Relevant Documentation"}),`
`,e.jsxs(n.p,{children:["This level begins building the connection between ",e.jsx(n.strong,{children:"data models"})," and ",e.jsx(n.strong,{children:"visual outcomes"}),". Concepts from the following pages will become more relevant as the player progresses:"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:e.jsx(n.a,{href:"/docs/hierarchies/scene-api",children:"Scene API"})}),`
`,e.jsx(n.li,{children:e.jsx(n.a,{href:"/docs/hierarchies/coordinate-systems",children:"Coordinate Systems"})}),`
`,e.jsx(n.li,{children:e.jsx(n.a,{href:"/docs/hierarchies/transformation-hierarchies",children:"Transformation Hierarchies"})}),`
`]}),`
`,e.jsx(n.h2,{children:"Educational Notes"}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.strong,{children:"export node"})," acts like a sink in the dataflow graph. It does not compute but rather ",e.jsx(n.strong,{children:"writes values into the scene graph"}),", updating the state of game objects. This level helps learners conceptualize how ",e.jsx(n.strong,{children:"data propagation"})," through a node system ultimately produces visible effects in a simulated world."]}),`
`,e.jsx(n.p,{children:"In essence, players are programming by assigning values — a form of declarative animation specification."})]})}function r(t={}){const{wrapper:n}=t.components||{};return n?e.jsx(n,{...t,children:e.jsx(s,{...t})}):s(t)}export{r as default,o as frontmatter};
