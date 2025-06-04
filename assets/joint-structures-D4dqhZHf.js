import{o as e}from"./chunk-AYJ5UCUI-jyqNdttv.js";const o={title:"Joint Structures"};function i(t){const n={em:"em",h2:"h2",li:"li",p:"p",strong:"strong",ul:"ul",...t.components};return e.jsxs(e.Fragment,{children:[e.jsx(n.h2,{children:"Joint Structures"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Character"}),': A general term for all "living things" with "personality".']}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Skeleton"}),": Actually the passive part of the musculoskeletal system, but in computer animation it is usually interchanged with the active part. The bones determine the movement, and the body/muscles follow. It consists of ",e.jsx(n.em,{children:"bones/segments/limbs (links/bones)"}),", which are connected by ",e.jsx(n.em,{children:"joints"}),"."]}),`
`]}),`
`]}),`
`,e.jsxs(n.p,{children:["A joint structure (also called a ",e.jsx(n.em,{children:"kinematic chain"}),") consists of ",e.jsx(n.em,{children:"links"})," and ",e.jsx(n.em,{children:"segments"}),". The ends of kinematic chains are called ",e.jsx(n.em,{children:"end effectors"}),". The end effector is used to exert an effect on the environment."]}),`
`,e.jsx(n.p,{children:"Kinematic chains do not have to be sequentially built; they can also branch hierarchically."}),`
`,e.jsxs(n.p,{children:["The topology of a kinematic chain can be represented by a ",e.jsx(n.em,{children:"linkage graph"}),". We assume that each segment has at least two joints. The root joint is called the ",e.jsx(n.em,{children:"root joint"}),". Each joint is assigned a coordinate system. The orientation/position of this coordinate system is described via a coordinate transformation matrix based on the parent joint."]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Revolute joint"}),": Rotation of two segments connected by the joint around an axis."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Prismatic joint"}),": Can change the position of two segments along a straight line."]}),`
`]}),`
`,e.jsx(n.p,{children:"Both joint types can be represented by a coordinate transformation matrix (rotation/translation), each parameterized by a single degree of freedom (angle/translation)."}),`
`,e.jsxs(n.p,{children:["All parameters of a kinematic chain together are called the ",e.jsx(n.em,{children:"configuration"})," or ",e.jsx(n.em,{children:"state"})," and can be collected in a ",e.jsx(n.em,{children:"state vector"}),". We can also define a ",e.jsx(n.em,{children:"state space"})," or ",e.jsx(n.em,{children:"configuration space"})," for this vector to restrict movement. The dimension of the state space corresponds to the number of degrees of freedom in the kinematic chain."]}),`
`,e.jsxs(n.p,{children:["To construct more joint types, we can combine the basic ones. For example, a ",e.jsx(n.em,{children:"ball-and-socket joint"})," is a combination of three revolute joints, and a ",e.jsx(n.em,{children:"planar joint"})," is a combination of two prismatic joints."]})]})}function a(t={}){const{wrapper:n}=t.components||{};return n?e.jsx(n,{...t,children:e.jsx(i,{...t})}):i(t)}export{a as default,o as frontmatter};
