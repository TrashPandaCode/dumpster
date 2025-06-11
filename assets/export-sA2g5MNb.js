import{o as n}from"./chunk-AYJ5UCUI-BS9SflA5.js";const l={title:"Export To Gameobject"};function s(t){const e={em:"em",h1:"h1",h2:"h2",li:"li",p:"p",strong:"strong",ul:"ul",...t.components},{DocsNodeEditor:o}=e;return o||i("DocsNodeEditor"),n.jsxs(n.Fragment,{children:[n.jsx(e.h1,{children:"Export To Gameobject"}),`
`,n.jsxs(e.p,{children:["The ",n.jsx(e.em,{children:"Export To Gameobject"})," node provides write access to gameobject specific properties of one or more gameobjects in the scene. Additionally it allows the user to add and remove properties to gameobjects."]}),`
`,n.jsxs(e.p,{children:["There are read and write specific properties, meaning that not all properties of one gameobject are shared between the ",n.jsx(e.em,{children:"Import From"})," and ",n.jsx(e.em,{children:"Export To Gameobject"})," nodes."]}),`
`,n.jsx(e.h2,{children:"Functionality"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"A dropdown menu lists all selectable gameobjects."}),`
`,n.jsx(e.li,{children:"You can select a single gameobject or multiple gameobjects."}),`
`,n.jsx(e.li,{children:"When selecting a single gameobject, all of its available inputs (properties) will be displayed."}),`
`,n.jsx(e.li,{children:"When selecting multiple gameobjects, only the common (shared) inputs across all selected gameobjects are shown."}),`
`,n.jsx(e.li,{children:"When multiple gameobjects are selected, an index input appears. Use this input to specify which gameobject's values to access by index."}),`
`]}),`
`,n.jsxs(e.p,{children:["Properties can be added by using the ",n.jsx(e.em,{children:"Handle"})," input field. Only the manually added properties can be deleted. All added properties have read and write access and are therefore shared between the ",n.jsx(e.em,{children:"Import From"})," and ",n.jsx(e.em,{children:"Export To Gameobject"})," nodes. Each property must have a unique name."]}),`
`,n.jsx(e.h2,{children:"Properties"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"Index"})," (visible only when multiple gameobjects are selected): An integer input used to select which gameobject to read from in the list."]}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"an index not corresponding to a gameobject will be ignored"}),`
`]}),`
`]}),`
`,n.jsxs(e.li,{children:[`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"Outputs"}),": The available properties of the selected gameobject(s), such as position, rotation, etc. They can be written to by the user."]}),`
`]}),`
`]}),`
`,n.jsx(o,{type:"DocsExportToGameobject"})]})}function c(t={}){const{wrapper:e}=t.components||{};return e?n.jsx(e,{...t,children:n.jsx(s,{...t})}):s(t)}function i(t,e){throw new Error("Expected component `"+t+"` to be defined: you likely forgot to import, pass, or provide it.")}export{c as default,l as frontmatter};
