import{o as e}from"./chunk-AYJ5UCUI-BS9SflA5.js";const t={title:"Linear"};function a(n){const s={a:"a",annotation:"annotation",code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",math:"math",mi:"mi",mo:"mo",mrow:"mrow",msup:"msup",p:"p",semantics:"semantics",span:"span",strong:"strong",ul:"ul",...n.components};return e.jsxs(e.Fragment,{children:[e.jsx(s.h1,{children:"Level 5: Linear"}),`
`,e.jsx(s.h2,{children:"Objective"}),`
`,e.jsxs(s.p,{children:["This level introduces the concept of ",e.jsx(s.strong,{children:"linear time transformation"}),", a foundational mechanism in animation systems where one time domain is mapped into another. The player must manipulate time values to control a ",e.jsx(s.strong,{children:"pocket watch"})," animation so that it corresponds to the behavior of a ",e.jsx(s.strong,{children:"clock tower"}),", with an applied time ",e.jsx(s.strong,{children:"scaling"})," and ",e.jsx(s.strong,{children:"offset"}),"."]}),`
`,e.jsx(s.h2,{children:"Scenario"}),`
`,e.jsx(s.p,{children:"A non-functional watch awaits a time input. The player must construct a time signal that behaves differently from the reference clock tower's timeline. Through the in-game dialogue, it becomes evident that the pocket watch should run significantly faster and with a starting offset:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:["A time offset of ",e.jsx(s.strong,{children:"50 seconds"})]}),`
`,e.jsxs(s.li,{children:["A time scaling factor of ",e.jsx(s.strong,{children:"100"})]}),`
`]}),`
`,e.jsx(s.p,{children:"These adjustments allow the player to create a new timeline that modifies the speed and phase of the animation independently of the base time axis."}),`
`,e.jsx(s.h2,{children:"Learning Outcomes"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:"Understand the principle of linear time transformation in animation."}),`
`,e.jsx(s.li,{children:"Learn to construct time-based expressions via node graphs."}),`
`,e.jsxs(s.li,{children:["Develop intuition for how ",e.jsx(s.strong,{children:"offset"})," and ",e.jsx(s.strong,{children:"scaling"})," affect temporal behavior in animations."]}),`
`,e.jsx(s.li,{children:"Apply mathematical thinking to dynamic system design."}),`
`]}),`
`,e.jsx(s.h2,{children:"Key Concepts"}),`
`,e.jsx(s.h3,{children:"Time Axes"}),`
`,e.jsxs(s.p,{children:["A ",e.jsx(s.strong,{children:"time axis"})," represents a mapping from real-world (or simulation) time to a local time domain used for evaluation. This abstraction allows decoupling different objects or animations from a global timeline, enabling fine-grained control of pacing and synchronization."]}),`
`,e.jsx(s.p,{children:"Relevant reading:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"/docs/time-and-game-loop/time-axes",children:"Time Axes"})}),`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"/docs/time-and-game-loop/global-and-local-time-axes",children:"Global and Local Time Axes"})}),`
`]}),`
`,e.jsx(s.h3,{children:"Linear Time Transformation"}),`
`,e.jsxs(s.p,{children:["A linear time transformation maps time ",e.jsx(s.code,{children:"t"})," from one domain to another using the affine function:"]}),`
`,e.jsx(s.span,{className:"katex-display",children:e.jsxs(s.span,{className:"katex",children:[e.jsx(s.span,{className:"katex-mathml",children:e.jsx(s.math,{xmlns:"http://www.w3.org/1998/Math/MathML",display:"block",children:e.jsxs(s.semantics,{children:[e.jsxs(s.mrow,{children:[e.jsxs(s.msup,{children:[e.jsx(s.mi,{children:"t"}),e.jsx(s.mo,{mathvariant:"normal",lspace:"0em",rspace:"0em",children:"′"})]}),e.jsx(s.mo,{children:"="}),e.jsx(s.mi,{children:"a"}),e.jsx(s.mo,{children:"⋅"}),e.jsx(s.mo,{stretchy:"false",children:"("}),e.jsx(s.mi,{children:"t"}),e.jsx(s.mo,{children:"+"}),e.jsx(s.mi,{children:"b"}),e.jsx(s.mo,{stretchy:"false",children:")"})]}),e.jsx(s.annotation,{encoding:"application/x-tex",children:"t' = a \\cdot (t + b)"})]})})}),e.jsxs(s.span,{className:"katex-html","aria-hidden":"true",children:[e.jsxs(s.span,{className:"base",children:[e.jsx(s.span,{className:"strut",style:{height:"0.8019em"}}),e.jsxs(s.span,{className:"mord",children:[e.jsx(s.span,{className:"mord mathnormal",children:"t"}),e.jsx(s.span,{className:"msupsub",children:e.jsx(s.span,{className:"vlist-t",children:e.jsx(s.span,{className:"vlist-r",children:e.jsx(s.span,{className:"vlist",style:{height:"0.8019em"},children:e.jsxs(s.span,{style:{top:"-3.113em",marginRight:"0.05em"},children:[e.jsx(s.span,{className:"pstrut",style:{height:"2.7em"}}),e.jsx(s.span,{className:"sizing reset-size6 size3 mtight",children:e.jsx(s.span,{className:"mord mtight",children:e.jsx(s.span,{className:"mord mtight",children:"′"})})})]})})})})})]}),e.jsx(s.span,{className:"mspace",style:{marginRight:"0.2778em"}}),e.jsx(s.span,{className:"mrel",children:"="}),e.jsx(s.span,{className:"mspace",style:{marginRight:"0.2778em"}})]}),e.jsxs(s.span,{className:"base",children:[e.jsx(s.span,{className:"strut",style:{height:"0.4445em"}}),e.jsx(s.span,{className:"mord mathnormal",children:"a"}),e.jsx(s.span,{className:"mspace",style:{marginRight:"0.2222em"}}),e.jsx(s.span,{className:"mbin",children:"⋅"}),e.jsx(s.span,{className:"mspace",style:{marginRight:"0.2222em"}})]}),e.jsxs(s.span,{className:"base",children:[e.jsx(s.span,{className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),e.jsx(s.span,{className:"mopen",children:"("}),e.jsx(s.span,{className:"mord mathnormal",children:"t"}),e.jsx(s.span,{className:"mspace",style:{marginRight:"0.2222em"}}),e.jsx(s.span,{className:"mbin",children:"+"}),e.jsx(s.span,{className:"mspace",style:{marginRight:"0.2222em"}})]}),e.jsxs(s.span,{className:"base",children:[e.jsx(s.span,{className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),e.jsx(s.span,{className:"mord mathnormal",children:"b"}),e.jsx(s.span,{className:"mclose",children:")"})]})]})]})}),`
`,e.jsx(s.p,{children:"Where:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"a"})," is the ",e.jsx(s.strong,{children:"scaling factor"})," (controls speed)"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"b"})," is the ",e.jsx(s.strong,{children:"offset"})," (controls phase shift)"]}),`
`]}),`
`,e.jsx(s.p,{children:"In animation, such transformations allow for:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:"Fast-forwarding or slowing down animations"}),`
`,e.jsx(s.li,{children:"Delaying or advancing their onset"}),`
`,e.jsx(s.li,{children:"Creating desynchronized or nested animation loops"}),`
`]}),`
`,e.jsxs(s.p,{children:["This level emphasizes the ",e.jsx(s.strong,{children:"mathematical simplicity"})," and ",e.jsx(s.strong,{children:"expressive power"})," of such mappings, which form the basis of more complex animation behaviors such as non-linear timing and procedural animation control."]}),`
`,e.jsx(s.h2,{children:"Interaction Goals"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:["Introduce a ",e.jsx(s.strong,{children:"Time Node"})," that provides a raw time signal."]}),`
`,e.jsxs(s.li,{children:["Use ",e.jsx(s.strong,{children:"arithmetic nodes"})," to apply a linear transformation to this signal."]}),`
`,e.jsx(s.li,{children:"Connect the transformed time to the appropriate output or object input."}),`
`,e.jsx(s.li,{children:"Observe how visual elements respond in real-time to changes in the time signal."}),`
`]}),`
`,e.jsx(s.h2,{children:"Suggested Reading"}),`
`,e.jsx(s.p,{children:"To fully understand and prepare for deeper animation system topics, the following documentation pages are recommended:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"/docs/time-and-game-loop/global-and-local-time-axes",children:"Global and Local Time Axes"})}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"/docs/time-and-game-loop/frames",children:"Frames"}),": Explains how discrete sampling interacts with continuous time."]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"/docs/time-and-game-loop/game-loop",children:"Game Loop"}),": Outlines how animation systems process time in interactive applications."]}),`
`]})]})}function l(n={}){const{wrapper:s}=n.components||{};return s?e.jsx(s,{...n,children:e.jsx(a,{...n})}):a(n)}export{l as default,t as frontmatter};
