import{o as e}from"./chunk-AYJ5UCUI-BS9SflA5.js";const t={title:"Reverse"};function a(n){const s={a:"a",annotation:"annotation",code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",math:"math",mi:"mi",mo:"mo",mrow:"mrow",msup:"msup",p:"p",semantics:"semantics",span:"span",strong:"strong",ul:"ul",...n.components};return e.jsxs(e.Fragment,{children:[e.jsx(s.h1,{children:"Level 6: Reverse"}),`
`,e.jsx(s.h2,{children:"Objective"}),`
`,e.jsxs(s.p,{children:["In this level, the user must construct a time transformation that causes a ",e.jsx(s.strong,{children:"pocket watch"})," to run ",e.jsx(s.strong,{children:"in reverse"}),", while maintaining the ",e.jsx(s.strong,{children:"same speed"})," as the reference ",e.jsx(s.strong,{children:"clock tower"}),". The problem builds directly upon the linear time transformation introduced in the previous level but introduces ",e.jsx(s.strong,{children:"negative scaling"})," to model reversal."]}),`
`,e.jsx(s.h2,{children:"Scenario"}),`
`,e.jsx(s.p,{children:"After a previous attempt to modify the watch's time behavior, the result now appears erratic. The in-game character expresses a desire for the pocket watch to behave exactly like the big clock—but in reverse. The player is tasked with implementing a time mapping that yields a reversed timeline."}),`
`,e.jsx(s.h2,{children:"Learning Outcomes"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:["Understand the mathematical meaning and visual implications of ",e.jsx(s.strong,{children:"negative time scaling"}),"."]}),`
`,e.jsxs(s.li,{children:["Apply knowledge of linear transformations to achieve ",e.jsx(s.strong,{children:"time inversion"}),"."]}),`
`,e.jsx(s.li,{children:"Strengthen understanding of local vs. global time axes by observing the reversed temporal effect."}),`
`]}),`
`,e.jsx(s.h2,{children:"Key Concepts"}),`
`,e.jsx(s.h3,{children:"Negative Time Scaling"}),`
`,e.jsx(s.p,{children:"In a linear transformation of the form:"}),`
`,e.jsx(s.span,{className:"katex-display",children:e.jsxs(s.span,{className:"katex",children:[e.jsx(s.span,{className:"katex-mathml",children:e.jsx(s.math,{xmlns:"http://www.w3.org/1998/Math/MathML",display:"block",children:e.jsxs(s.semantics,{children:[e.jsxs(s.mrow,{children:[e.jsxs(s.msup,{children:[e.jsx(s.mi,{children:"t"}),e.jsx(s.mo,{mathvariant:"normal",lspace:"0em",rspace:"0em",children:"′"})]}),e.jsx(s.mo,{children:"="}),e.jsx(s.mi,{children:"a"}),e.jsx(s.mo,{children:"⋅"}),e.jsx(s.mo,{stretchy:"false",children:"("}),e.jsx(s.mi,{children:"t"}),e.jsx(s.mo,{children:"+"}),e.jsx(s.mi,{children:"b"}),e.jsx(s.mo,{stretchy:"false",children:")"})]}),e.jsx(s.annotation,{encoding:"application/x-tex",children:"t' = a \\cdot (t + b)"})]})})}),e.jsxs(s.span,{className:"katex-html","aria-hidden":"true",children:[e.jsxs(s.span,{className:"base",children:[e.jsx(s.span,{className:"strut",style:{height:"0.8019em"}}),e.jsxs(s.span,{className:"mord",children:[e.jsx(s.span,{className:"mord mathnormal",children:"t"}),e.jsx(s.span,{className:"msupsub",children:e.jsx(s.span,{className:"vlist-t",children:e.jsx(s.span,{className:"vlist-r",children:e.jsx(s.span,{className:"vlist",style:{height:"0.8019em"},children:e.jsxs(s.span,{style:{top:"-3.113em",marginRight:"0.05em"},children:[e.jsx(s.span,{className:"pstrut",style:{height:"2.7em"}}),e.jsx(s.span,{className:"sizing reset-size6 size3 mtight",children:e.jsx(s.span,{className:"mord mtight",children:e.jsx(s.span,{className:"mord mtight",children:"′"})})})]})})})})})]}),e.jsx(s.span,{className:"mspace",style:{marginRight:"0.2778em"}}),e.jsx(s.span,{className:"mrel",children:"="}),e.jsx(s.span,{className:"mspace",style:{marginRight:"0.2778em"}})]}),e.jsxs(s.span,{className:"base",children:[e.jsx(s.span,{className:"strut",style:{height:"0.4445em"}}),e.jsx(s.span,{className:"mord mathnormal",children:"a"}),e.jsx(s.span,{className:"mspace",style:{marginRight:"0.2222em"}}),e.jsx(s.span,{className:"mbin",children:"⋅"}),e.jsx(s.span,{className:"mspace",style:{marginRight:"0.2222em"}})]}),e.jsxs(s.span,{className:"base",children:[e.jsx(s.span,{className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),e.jsx(s.span,{className:"mopen",children:"("}),e.jsx(s.span,{className:"mord mathnormal",children:"t"}),e.jsx(s.span,{className:"mspace",style:{marginRight:"0.2222em"}}),e.jsx(s.span,{className:"mbin",children:"+"}),e.jsx(s.span,{className:"mspace",style:{marginRight:"0.2222em"}})]}),e.jsxs(s.span,{className:"base",children:[e.jsx(s.span,{className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),e.jsx(s.span,{className:"mord mathnormal",children:"b"}),e.jsx(s.span,{className:"mclose",children:")"})]})]})]})}),`
`,e.jsxs(s.p,{children:["using a ",e.jsx(s.strong,{children:"negative value"})," for the scaling factor ",e.jsx(s.code,{children:"a"})," effectively reverses the direction of time. The result is a mirror of the original animation with respect to a vertical axis. This is a ",e.jsx(s.strong,{children:"core technique"})," in animation and simulation when:"]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:"Reversing playback is needed (e.g. rewinding a motion)."}),`
`,e.jsx(s.li,{children:"Time-symmetric behaviors are desired."}),`
`,e.jsx(s.li,{children:"Procedural effects depend on mirrored dynamics."}),`
`]}),`
`,e.jsxs(s.p,{children:["To ensure the reversed clock ",e.jsx(s.strong,{children:"ticks at the same rate"})," as the reference, the magnitude of ",e.jsx(s.code,{children:"a"})," must remain ",e.jsx(s.code,{children:"1"}),", with only the sign being inverted."]}),`
`,e.jsx(s.h3,{children:"Inverting Time and Synchronization"}),`
`,e.jsxs(s.p,{children:["It's essential that the reversed clock remains synchronized in speed but ",e.jsx(s.strong,{children:"desynchronized in direction"}),". This often means controlling the ",e.jsx(s.strong,{children:"origin"})," (through the offset ",e.jsx(s.code,{children:"b"}),") to ensure alignment of meaningful visual states, such as when both clocks should display the same time at a specific instant."]}),`
`,e.jsx(s.p,{children:"Relevant concepts:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"/docs/time-and-game-loop/time-axes",children:"Time Axes"})}),`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"/docs/time-and-game-loop/global-and-local-time-axes",children:"Global and Local Time Axes"})}),`
`]}),`
`,e.jsx(s.h3,{children:"Practical Node Graph Construction"}),`
`,e.jsx(s.p,{children:"To achieve the reversal:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:["Use a ",e.jsx(s.strong,{children:"Time Node"})," to access the base time."]}),`
`,e.jsxs(s.li,{children:["Apply a ",e.jsx(s.strong,{children:"multiplication node"})," with a factor of ",e.jsx(s.code,{children:"-1"})," to invert the direction."]}),`
`,e.jsxs(s.li,{children:["Optionally apply an ",e.jsx(s.strong,{children:"offset"})," to align the phase (though not required in this level)."]}),`
`]}),`
`,e.jsxs(s.p,{children:["By visually connecting these transformations in the node graph, players build a ",e.jsx(s.strong,{children:"pipeline of time manipulation"}),", which becomes foundational for non-linear animation systems later."]}),`
`,e.jsx(s.h2,{children:"Suggested Reading"}),`
`,e.jsx(s.p,{children:"To deepen understanding, players are encouraged to review:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"/docs/time-and-game-loop/global-and-local-time-axes",children:"Global and Local Time Axes"})}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"/docs/time-and-game-loop/game-loop",children:"Game Loop"}),": Reinforces how continuous time input flows through update cycles."]}),`
`]})]})}function l(n={}){const{wrapper:s}=n.components||{};return s?e.jsx(s,{...n,children:e.jsx(a,{...n})}):a(n)}export{l as default,t as frontmatter};
