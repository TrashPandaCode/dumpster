import{o as n}from"./chunk-AYJ5UCUI-BS9SflA5.js";const a={title:"Parenting"};function r(s){const e={a:"a",annotation:"annotation",code:"code",h1:"h1",h2:"h2",li:"li",math:"math",mn:"mn",mo:"mo",mrow:"mrow",p:"p",pre:"pre",semantics:"semantics",span:"span",strong:"strong",ul:"ul",...s.components};return n.jsxs(n.Fragment,{children:[n.jsx(e.h1,{children:"Level 4: Parenting"}),`
`,n.jsx(e.h2,{children:"Objective"}),`
`,n.jsxs(e.p,{children:["In this level, the player must ",n.jsx(e.strong,{children:"parent a trashcan to the raccoon"})," so that the trashcan moves together with the raccoon as it runs back and forth. For this the node graph exposes:"]}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Import nodes"}),": provide the current ",n.jsx(e.code,{children:"x"})," and ",n.jsx(e.code,{children:"y"})," position of the raccoon"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Export nodes"}),": allow writing to the ",n.jsx(e.code,{children:"x"})," and ",n.jsx(e.code,{children:"y"})," position of the trashcan"]}),`
`]}),`
`,n.jsxs(e.p,{children:["By wiring the raccoon's positions directly into the trashcan's inputs, the user effectively ",n.jsx(e.strong,{children:"binds"})," the trashcan's transformation to the raccoon — a form of functional parenting."]}),`
`,n.jsx(e.p,{children:"The raccoon will then carry the trashcan toward a goal flag."}),`
`,n.jsx(e.h2,{children:"Concepts to Learn"}),`
`,n.jsxs(e.p,{children:["This level introduces the core principles of ",n.jsx(e.strong,{children:"transformation hierarchies"})," and ",n.jsx(e.strong,{children:"parenting"})," in animation systems."]}),`
`,n.jsx(e.h2,{children:"Key Principles Introduced"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Parent-child relationships"})," between scene objects"]}),`
`,n.jsx(e.li,{children:n.jsx(e.strong,{children:"Local vs. global coordinate systems"})}),`
`,n.jsxs(e.li,{children:["Reusing transformation data via ",n.jsx(e.strong,{children:"node-based bindings"})]}),`
`,n.jsx(e.li,{children:"Introduction to inheritance of position"}),`
`]}),`
`,n.jsx(e.h2,{children:"Node Structure Example"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-plaintext",children:`[Import: Raccoon x] ──▶ [Export: Trashcan x]
[Import: Raccoon y] ──▶ [Export: Trashcan y]
`})}),`
`,n.jsxs(e.p,{children:["This simple binding reproduces the effect of parenting: the trashcan now ",n.jsx(e.strong,{children:"inherits"})," the transformation of the raccoon, remaining at a constant offset (zero, in this case)."]}),`
`,n.jsxs(e.p,{children:["The trashcan's position is now ",n.jsxs(e.span,{className:"katex",children:[n.jsx(e.span,{className:"katex-mathml",children:n.jsx(e.math,{xmlns:"http://www.w3.org/1998/Math/MathML",children:n.jsxs(e.semantics,{children:[n.jsxs(e.mrow,{children:[n.jsx(e.mo,{stretchy:"false",children:"("}),n.jsx(e.mn,{children:"0"}),n.jsx(e.mo,{separator:"true",children:","}),n.jsx(e.mn,{children:"0"}),n.jsx(e.mo,{stretchy:"false",children:")"})]}),n.jsx(e.annotation,{encoding:"application/x-tex",children:"(0, 0)"})]})})}),n.jsx(e.span,{className:"katex-html","aria-hidden":"true",children:n.jsxs(e.span,{className:"base",children:[n.jsx(e.span,{className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),n.jsx(e.span,{className:"mopen",children:"("}),n.jsx(e.span,{className:"mord",children:"0"}),n.jsx(e.span,{className:"mpunct",children:","}),n.jsx(e.span,{className:"mspace",style:{marginRight:"0.1667em"}}),n.jsx(e.span,{className:"mord",children:"0"}),n.jsx(e.span,{className:"mclose",children:")"})]})})]})," in the raccoon's local coordinate system."]}),`
`,n.jsx(e.h2,{children:"Relevant Documentation"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"/docs/hierarchies/coordinate-systems",children:"Coordinate Systems"})}),`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"/docs/hierarchies/transformation-hierarchies",children:"Transformation Hierarchies"})}),`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"/docs/hierarchies/scene-graphs",children:"Scene Graphs"})}),`
`]}),`
`,n.jsx(e.h2,{children:"Educational Notes"}),`
`,n.jsxs(e.p,{children:["In many animation systems, parenting implies that a child object's ",n.jsx(e.strong,{children:"local transformation"})," is applied ",n.jsx(e.strong,{children:"relative to the parent's global transformation"}),". This level simulates this idea explicitly: the user must wire one object's transformation into another, creating a dependency in the node graph."]}),`
`,n.jsxs(e.p,{children:["The same concept may allow offsets or rotations — but here, the goal is to understand ",n.jsx(e.strong,{children:"the fundamental mechanics"})," of transformation composition through node bindings."]}),`
`,n.jsx(e.p,{children:"This level also foreshadows advanced systems like:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Forward kinematics"}),", where transformations propagate down a hierarchy"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Scene graph traversal"}),", where updates follow parent-child chains"]}),`
`]})]})}function i(s={}){const{wrapper:e}=s.components||{};return e?n.jsx(e,{...s,children:n.jsx(r,{...s})}):r(s)}export{i as default,a as frontmatter};
