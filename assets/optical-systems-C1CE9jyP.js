import{o as e}from"./chunk-AYJ5UCUI-BS9SflA5.js";const a={title:"Optical Systems"};function n(s){const t={h2:"h2",h3:"h3",li:"li",p:"p",strong:"strong",ul:"ul",...s.components};return e.jsxs(e.Fragment,{children:[e.jsx(t.h2,{children:"Optical Systems"}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsxs(t.li,{children:[e.jsx(t.strong,{children:"Capture Volume"}),": The area within which the actor can move and motion can be recorded."]}),`
`]}),`
`,e.jsx(t.p,{children:"Optical systems are divided into two main types. All systems perform calculations at a fixed frame rate (typically 60–250 fps) to create the impression of smooth motion."}),`
`,e.jsx(t.h3,{children:"Marker-Based Methods"}),`
`,e.jsx(t.p,{children:"The actor is fitted with reflective markers that reflect infrared light. The cameras are equipped with infrared light sources. Basic image processing isolates the markers in the images. If a marker appears in more than one camera, its 3D coordinates can be triangulated."}),`
`,e.jsx(t.p,{children:"Since marker positions are predefined, a skeletal model can be derived."}),`
`,e.jsx(t.h3,{children:"Markerless Methods"}),`
`,e.jsxs(t.p,{children:["Markerless systems calculate the ",e.jsx(t.strong,{children:"visual hull"})," of the actor from camera footage. This hull can then be translated into a skeleton. Some systems (e.g., Kinect) also include depth data."]})]})}function i(s={}){const{wrapper:t}=s.components||{};return t?e.jsx(t,{...s,children:e.jsx(n,{...s})}):n(s)}export{i as default,a as frontmatter};
