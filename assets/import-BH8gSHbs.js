import{o as n}from"./chunk-AYJ5UCUI-DfzbB4N7.js";const c={title:"Import From Gameobject"};function s(t){const e={em:"em",h1:"h1",h2:"h2",li:"li",p:"p",strong:"strong",ul:"ul",...t.components},{DocsNodeEditor:o}=e;return o||i("DocsNodeEditor"),n.jsxs(n.Fragment,{children:[n.jsx(e.h1,{children:"Import from Gameobject"}),`
`,n.jsxs(e.p,{children:["The ",n.jsx(e.em,{children:"Import from GameObject"})," node provides read access to gameobject specific properties of one or more gameobjects in the scene."]}),`
`,n.jsxs(e.p,{children:["There are read and write specific properties, meaning that not all properties of one gameobject are shared between the ",n.jsx(e.em,{children:"Import From"})," and ",n.jsx(e.em,{children:"Export To Gameobject"})," nodes."]}),`
`,n.jsx(e.h2,{children:"Functionality"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"A dropdown menu lists all selectable gameobjects."}),`
`,n.jsx(e.li,{children:"You can select a single gameobject or multiple gameobjects."}),`
`,n.jsx(e.li,{children:"When selecting a single gameobject, all of its available outputs (properties) will be displayed."}),`
`,n.jsx(e.li,{children:"When selecting multiple gameobjects, only the common (shared) outputs across all selected gameobjects are shown."}),`
`,n.jsx(e.li,{children:"When multiple gameobjects are selected, an index input appears. Use this input to specify which gameobject's values to access by index."}),`
`]}),`
`,n.jsx(e.h2,{children:"Properties"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"Index"})," (visible only when multiple gameobjects are selected): An integer input used to select which gameobject to read from in the list."]}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"when an index not corresponding to a gameobject is used the node will output nothing"}),`
`]}),`
`]}),`
`,n.jsxs(e.li,{children:[`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"Outputs"}),": The available properties of the selected gameobject(s), such as position, rotation, etc. These update dynamically based on the selection."]}),`
`]}),`
`]}),`
`,n.jsx(o,{type:"DocsImportFromGameobject"})]})}function l(t={}){const{wrapper:e}=t.components||{};return e?n.jsx(e,{...t,children:n.jsx(s,{...t})}):s(t)}function i(t,e){throw new Error("Expected component `"+t+"` to be defined: you likely forgot to import, pass, or provide it.")}export{l as default,c as frontmatter};
