import{o as n}from"./chunk-AYJ5UCUI-BS9SflA5.js";const t={title:"Inverse"};function i(s){const e={a:"a",annotation:"annotation",code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",math:"math",mi:"mi",mn:"mn",mrow:"mrow",p:"p",pre:"pre",semantics:"semantics",span:"span",strong:"strong",ul:"ul",...s.components};return n.jsxs(n.Fragment,{children:[n.jsx(e.h1,{children:"Level 11: Inverse"}),`
`,n.jsx(e.h2,{children:"Objective"}),`
`,n.jsxs(e.p,{children:["This level introduces the foundational concept of ",n.jsx(e.strong,{children:"inverse kinematics (IK)"})," by requiring the player to control a robotic arm to position a soap block directly above the raccoon. The raccoon moves side-to-side across the scene, and the soap must ",n.jsx(e.strong,{children:"stay in contact with the raccoon for at least 5 seconds"}),"."]}),`
`,n.jsxs(e.p,{children:["To solve this, the player must implement a ",n.jsx(e.strong,{children:"2D version of the Cyclic Coordinate Descent (CCD) algorithm"})," using a ",n.jsx(e.code,{children:"for-loop"}),", manipulating the rotations of a kinematic chain consisting of three rotational joints."]}),`
`,n.jsx(e.h2,{children:"Scene Setup"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:["A ",n.jsx(e.strong,{children:"robotic arm"})," with ",n.jsx(e.strong,{children:"3 joints"}),", each capable of full ",n.jsxs(e.span,{className:"katex",children:[n.jsx(e.span,{className:"katex-mathml",children:n.jsx(e.math,{xmlns:"http://www.w3.org/1998/Math/MathML",children:n.jsxs(e.semantics,{children:[n.jsxs(e.mrow,{children:[n.jsx(e.mn,{children:"360"}),n.jsx(e.mi,{mathvariant:"normal",children:"°"})]}),n.jsx(e.annotation,{encoding:"application/x-tex",children:"360\\degree"})]})})}),n.jsx(e.span,{className:"katex-html","aria-hidden":"true",children:n.jsxs(e.span,{className:"base",children:[n.jsx(e.span,{className:"strut",style:{height:"0.6944em"}}),n.jsx(e.span,{className:"mord",children:"360°"})]})})]})," rotation"]}),`
`,n.jsxs(e.li,{children:["The joints are ",n.jsx(e.strong,{children:"positionally parented"}),", but their rotations remain independent"]}),`
`,n.jsxs(e.li,{children:["The ",n.jsx(e.strong,{children:"soap block"})," is considered the ",n.jsx(e.strong,{children:"end effector"})," of the arm"]}),`
`,n.jsxs(e.li,{children:["The ",n.jsx(e.strong,{children:"raccoon"})," runs from left to right beneath the arm"]}),`
`]}),`
`,n.jsx(e.p,{children:"The user's task is to adjust the joint angles such that the end effector (the soap) follows the raccoon's position."}),`
`,n.jsx(e.h2,{children:"Key Concepts Introduced"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:n.jsx(e.strong,{children:"Inverse Kinematics (IK)"})}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Cyclic Coordinate Descent (CCD)"})," in 2D"]}),`
`,n.jsx(e.li,{children:n.jsx(e.strong,{children:"World-to-local coordinate transformations"})}),`
`,n.jsx(e.li,{children:n.jsx(e.strong,{children:"Iterative refinement using for-loops"})}),`
`]}),`
`,n.jsx(e.h2,{children:"CCD Algorithm in 2D"}),`
`,n.jsxs(e.p,{children:["In CCD, each joint in the kinematic chain is adjusted iteratively to reduce the distance between the ",n.jsx(e.strong,{children:"end effector"})," and the ",n.jsx(e.strong,{children:"target"}),". In this 2D variant:"]}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"No need to compute 3D rotation axes or quaternions"}),`
`,n.jsxs(e.li,{children:["The required joint rotation is computed using the ",n.jsx(e.a,{href:"https://en.wikipedia.org/wiki/Atan2",children:n.jsx(e.code,{children:"atan2"})})," function"]}),`
`]}),`
`,n.jsx(e.h3,{children:"Pseudo Code for CCD Iteration (per joint)"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-plaintext",children:`for each joint from last to first:
    endLocal = worldToLocal(joint, endEffector)
    targetLocal = worldToLocal(joint, target)

    angleEnd = atan2(endLocal.y, endLocal.x)
    angleTarget = atan2(targetLocal.y, targetLocal.x)

    deltaAngle = angleTarget - angleEnd

    joint.rotation += deltaAngle
`})}),`
`,n.jsxs(e.p,{children:["This pseudocode can be implemented using basic ",n.jsx(e.a,{href:"/docs/nodes/math",children:n.jsx(e.code,{children:"Math"})})," nodes and the ",n.jsx(e.a,{href:"/docs/nodes/worldtolocal",children:n.jsx(e.code,{children:"WorldToLocal"})})," node."]}),`
`,n.jsxs(e.h3,{children:["Using the ",n.jsx(e.code,{children:"WorldToLocal"})," Helper Node"]}),`
`,n.jsxs(e.p,{children:["To simplify the coordinate conversion, use the ",n.jsx(e.a,{href:"/docs/nodes/worldtolocal",children:n.jsx(e.code,{children:"WorldToLocal"})})," utility node."]}),`
`,n.jsx(e.p,{children:"This utility node avoids manual matrix operations. For advanced users this can be implemented manually."}),`
`,n.jsx(e.h2,{children:"Game Object Control"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[`
`,n.jsx(e.p,{children:"Use nodes to obtain:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:["The ",n.jsx(e.strong,{children:"position of the raccoon"})," (via ",n.jsx(e.code,{children:"Import"})," node) or"]}),`
`,n.jsxs(e.li,{children:["The ",n.jsx(e.strong,{children:"mouse position"})," (via ",n.jsx(e.code,{children:"MousePos"})," node)"]}),`
`]}),`
`]}),`
`,n.jsxs(e.li,{children:[`
`,n.jsxs(e.p,{children:["Use the ",n.jsx(e.code,{children:"Import"})," node to get all joint positions and rotations"]}),`
`]}),`
`,n.jsxs(e.li,{children:[`
`,n.jsxs(e.p,{children:["Use the ",n.jsx(e.code,{children:"Export"})," node to apply ",n.jsx(e.strong,{children:"new rotation values"})," to each joint of the robotic arm"]}),`
`]}),`
`]}),`
`,n.jsx(e.h2,{children:"Relevant Documentation"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"/docs/kinematics/inverse-kinematics",children:"Inverse Kinematics"})}),`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"/docs/kinematics/ccd",children:"CCD Algorithm"})}),`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"/docs/kinematics/forward-kinematics",children:"Forward Kinematics"})}),`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"/docs/kinematics/joint-structures",children:"Joint Structures"})}),`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"/docs/hierarchies/transformation-hierarchies",children:"Transformation Hierarchies"})}),`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"/docs/nodes/worldtolocal",children:"WorldToLocal Node"})}),`
`]}),`
`,n.jsx(e.h2,{children:"Educational Notes"}),`
`,n.jsxs(e.p,{children:["This level bridges ",n.jsx(e.strong,{children:"mathematical modeling"})," and ",n.jsx(e.strong,{children:"animation logic"}),", requiring learners to:"]}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:["Understand ",n.jsx(e.strong,{children:"kinematic chains"})," and their articulation"]}),`
`,n.jsxs(e.li,{children:["Apply ",n.jsx(e.strong,{children:"rotational geometry"})," in local vs. world space"]}),`
`,n.jsxs(e.li,{children:["Implement ",n.jsx(e.strong,{children:"iterative convergence algorithms"})," in a dataflow environment"]}),`
`]})]})}function r(s={}){const{wrapper:e}=s.components||{};return e?n.jsx(e,{...s,children:n.jsx(i,{...s})}):i(s)}export{r as default,t as frontmatter};
