import{o as n}from"./chunk-AYJ5UCUI-BS9SflA5.js";const o={title:"Bounce"};function i(s){const e={a:"a",code:"code",h1:"h1",h2:"h2",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...s.components};return n.jsxs(n.Fragment,{children:[n.jsx(e.h1,{children:"Level 3: Bounce"}),`
`,n.jsx(e.h2,{children:"Objective"}),`
`,n.jsxs(e.p,{children:["In this introductory level, the player must set the ",n.jsx(e.strong,{children:"x"})," and ",n.jsx(e.strong,{children:"y"})," position of the raccoon character so that it aligns with the position of a ",n.jsx(e.strong,{children:"filled trashcan"}),". Each trashcan provides a ",n.jsx(e.code,{children:"filled"})," output — a boolean indicating whether it contains trash. The ",n.jsx(e.code,{children:"filled"})," state of the trashcans change over time."]}),`
`,n.jsxs(e.p,{children:["The player is tasked with selecting the correct trashcan coordinates based on this condition, using ",n.jsx(e.strong,{children:"switch"})," nodes to route positional data conditionally."]}),`
`,n.jsx(e.h2,{children:"Concepts to Learn"}),`
`,n.jsxs(e.p,{children:["This level introduces the fundamental idea of ",n.jsx(e.strong,{children:"conditional logic"})," in a node-based system, which corresponds to ",n.jsx(e.code,{children:"if"})," statements in traditional programming. In node-based systems, conditional execution is ",n.jsx(e.strong,{children:"decomposed"})," into:"]}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Evaluation of a boolean condition"})," (e.g., using comparators like ",n.jsx(e.code,{children:"=="}),", ",n.jsx(e.code,{children:">"}),", ",n.jsx(e.code,{children:"<"}),")",`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:["Evaluating the ",n.jsx(e.code,{children:"filled"})," state is not needed as it is already provided as a truth value"]}),`
`]}),`
`]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Selection logic"})," (e.g., using a switch node to choose between values based on the condition)"]}),`
`]}),`
`,n.jsx(e.h2,{children:"Key Principles Introduced"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Boolean values and conditional logic"}),`
`,n.jsxs(e.li,{children:["Separation of ",n.jsx(e.strong,{children:"evaluation"})," and ",n.jsx(e.strong,{children:"control"})]}),`
`,n.jsxs(e.li,{children:["Use of ",n.jsx(e.strong,{children:"switch nodes"})," to branch behavior based on truth values"]}),`
`]}),`
`,n.jsx(e.h2,{children:"Suggested Node Pattern"}),`
`,n.jsxs(e.p,{children:["The user might, for example, connect each trashcan's ",n.jsx(e.code,{children:"filled"})," output to a switch node that selects the associated x/y coordinates."]}),`
`,n.jsx(e.h2,{children:"Relevant Documentation"}),`
`,n.jsx(e.p,{children:"While this level is mainly logical in nature, it lays groundwork for spatial reasoning. The following topics will be relevant later:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"/docs/hierarchies/coordinate-systems",children:"Coordinate Systems"})}),`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"/docs/hierarchies/scene-api",children:"Scene API"})}),`
`]}),`
`,n.jsx(e.h2,{children:"Educational Notes"}),`
`,n.jsx(e.p,{children:"In traditional code, you might write:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-plaintext",children:`IF trashcan1 is filled THEN
    raccoon's x-position <- trashcan1's x-position
ELSE
    raccoon's x-position <- trashcan2's x-position
END IF
`})}),`
`,n.jsxs(e.p,{children:["In a node-based system, this becomes a ",n.jsx(e.strong,{children:"value-based graph"}),":"]}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:["One node evaluates ",n.jsx(e.code,{children:"trashcan1.filled"})]}),`
`,n.jsxs(e.li,{children:["A switch node uses this boolean to select between ",n.jsx(e.code,{children:"trashcan1.x"})," and ",n.jsx(e.code,{children:"trashcan2.x"})]}),`
`]}),`
`,n.jsxs(e.p,{children:["This architecture highlights a ",n.jsx(e.strong,{children:"dataflow model"})," of computation — the foundation of many animation and visual scripting environments."]})]})}function c(s={}){const{wrapper:e}=s.components||{};return e?n.jsx(e,{...s,children:n.jsx(i,{...s})}):i(s)}export{c as default,o as frontmatter};
