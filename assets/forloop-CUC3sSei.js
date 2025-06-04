import{o as n}from"./chunk-AYJ5UCUI-BEyWwyKY.js";const l={title:"For Loop"};function s(t){const e={em:"em",h1:"h1",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",strong:"strong",ul:"ul",...t.components},{DocsNodeEditor:o}=e;return o||i("DocsNodeEditor"),n.jsxs(n.Fragment,{children:[n.jsx(e.h1,{children:"For Loop"}),`
`,n.jsxs(e.p,{children:["The ",n.jsx(e.em,{children:"For Loop"})," consists of two connected nodes — ",n.jsx(e.em,{children:"For Start"})," and ",n.jsx(e.em,{children:"For End"})," — which together define a custom loop structure within the graph."]}),`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"Note"}),": All loop iterations are computed every frame. This means the entire loop is evaluated in full during each frame update, rather than being spread out over time."]}),`
`,n.jsx(e.h2,{children:"Overview"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"For Start"}),": Defines the loop inputs, number of iterations, and initial values."]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"For End"}),": Handles value updates at the end of each iteration and allows the loop to exit early via a break input."]}),`
`]}),`
`,n.jsxs(e.p,{children:["The loop maintains a state between iterations, passing values from the ",n.jsx(e.em,{children:"For End"})," back to the ",n.jsx(e.em,{children:"For Start"})," node. On the final iteration, the final values from the ",n.jsx(e.em,{children:"For End"})," node are made available for use outside the loop."]}),`
`,n.jsx(e.p,{children:"Loops are color-coded with a dedicated edge style for easy visual identification."}),`
`,n.jsx(e.h2,{children:"How It Works"}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsxs(e.li,{children:["Initial Setup:",`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:["In the ",n.jsx(e.em,{children:"For Start"})," node, use the input field to define loop variables (handles)."]}),`
`,n.jsxs(e.li,{children:["Each handle becomes an input and output on both the ",n.jsx(e.em,{children:"For Start"})," and ",n.jsx(e.em,{children:"For End"})," nodes."]}),`
`]}),`
`]}),`
`,n.jsxs(e.li,{children:["First Iteration:",`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:["The values connected to the inputs of ",n.jsx(e.em,{children:"For Start"})," node are forwarded to its outputs and can be used within the loop body."]}),`
`]}),`
`]}),`
`,n.jsxs(e.li,{children:["Subsequent Iterations:",`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:["At the end of each iteration, the ",n.jsx(e.em,{children:"For End"})," node inputs are passed back to the ",n.jsx(e.em,{children:"For Start"})," node outputs for the next iteration."]}),`
`]}),`
`]}),`
`,n.jsxs(e.li,{children:["Final Output:",`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:["On the last iteration, the ",n.jsx(e.em,{children:"For End"})," node passes its input values to its outputs, making them available outside the loop."]}),`
`]}),`
`]}),`
`]}),`
`,n.jsx(e.h2,{children:"Properties"}),`
`,n.jsx(e.h3,{children:"For Start"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Iterations"}),": Defines how many times the loop will run."]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Handles"}),": Add input/output variables shared across loop iterations."]}),`
`]}),`
`,n.jsx(e.h3,{children:"For End"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Break"}),": A boolean input. When true, the loop exits early."]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Handles"}),": Inputs and outputs for each defined handle, used to update values between iterations and expose final results."]}),`
`]}),`
`,n.jsx(e.h2,{children:"Using nodes in loops"}),`
`,n.jsxs(e.p,{children:["To add nodes inside the loop body right-click on either the ",n.jsx(e.em,{children:"For Start"})," or ",n.jsx(e.em,{children:"For End"})," node and use the context menu to insert new nodes. These will be included in the loop’s execution. This will not work in the example below."]}),`
`,n.jsx(o,{type:"ForLoop"})]})}function d(t={}){const{wrapper:e}=t.components||{};return e?n.jsx(e,{...t,children:n.jsx(s,{...t})}):s(t)}function i(t,e){throw new Error("Expected component `"+t+"` to be defined: you likely forgot to import, pass, or provide it.")}export{d as default,l as frontmatter};
