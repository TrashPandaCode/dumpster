import{o as e}from"./chunk-AYJ5UCUI-BS9SflA5.js";const o={title:"Move"};function t(s){const n={a:"a",h1:"h1",h2:"h2",h3:"h3",li:"li",p:"p",strong:"strong",ul:"ul",...s.components};return e.jsxs(e.Fragment,{children:[e.jsx(n.h1,{children:"Level 7: Move"}),`
`,e.jsx(n.h2,{children:"Objective"}),`
`,e.jsx(n.p,{children:"Implement a basic left/right movement controller for the raccoon character using keyboard input. The goal is to move the raccoon to the left and reach the flag."}),`
`,e.jsx(n.h2,{children:"Scenario"}),`
`,e.jsxs(n.p,{children:["The raccoon needs to move across the scene to reach a flag. You'll enable movement by connecting keyboard inputs to the raccoon's position. The character should move left when e.g. the ",e.jsx(n.strong,{children:"A"})," key is held and right when the ",e.jsx(n.strong,{children:"D"})," key is held."]}),`
`,e.jsx(n.h2,{children:"Learning Outcomes"}),`
`,e.jsx(n.p,{children:"By completing this level, learners will:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Understand how to build a simple input-driven movement controller."}),`
`,e.jsxs(n.li,{children:["Learn how to make movement frame rate independent using ",e.jsx(n.strong,{children:"delta time"}),"."]}),`
`,e.jsx(n.li,{children:"Explore different approaches to movement and why direct position control is sometimes the best choice."}),`
`,e.jsx(n.li,{children:"Gain experience connecting multiple node types in a meaningful system."}),`
`]}),`
`,e.jsx(n.h2,{children:"Key Concepts"}),`
`,e.jsx(n.h3,{children:"Movement Techniques"}),`
`,e.jsx(n.p,{children:"There are several common techniques for character movement in games:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Position-based movement"}),`
The character's position is updated directly each frame. This is the most straightforward method.`]}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Velocity-based movement"}),`
Input changes a velocity value that is added to the position every frame. More flexible, but requires tracking velocity separately.`]}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Physics-based movement"}),`
Forces are applied to a rigid body, allowing natural responses like friction and bouncing, but adds significant complexity.`]}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Animation-driven movement"}),`
The character's motion is controlled through animation playback rather than direct position manipulation.`]}),`
`]}),`
`]}),`
`,e.jsxs(n.p,{children:["For this level, we use ",e.jsx(n.strong,{children:"position-based movement"}),", which is the simplest and most appropriate for beginner logic and deterministic control."]}),`
`,e.jsx(n.h3,{children:"Why Multiply by Delta Time?"}),`
`,e.jsx(n.p,{children:"Games typically run in a loop that updates many times per second — but the exact number of updates per second can vary depending on the computer’s performance, background processes, or the complexity of the scene."}),`
`,e.jsx(n.p,{children:"If we just added a fixed amount to the raccoon's x-position each frame, the speed would vary depending on how fast the game is running."}),`
`,e.jsx(n.p,{children:"To make movement frame rate independent, we multiply the movement amount by delta time — the time since the last frame. This ensures the raccoon moves the same distance per second, regardless of how many frames the game is running at."}),`
`,e.jsx(n.p,{children:"Example:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Without delta time: 10 pixels per frame → faster on high frame rates, slower on low ones."}),`
`,e.jsx(n.li,{children:"With delta time: 100 pixels per second → consistent speed on all machines."}),`
`]}),`
`,e.jsx(n.h2,{children:"Strategic Goals"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"The current x-position is imported from the raccoon using an ImportFromGameObject node."}),`
`,e.jsx(n.li,{children:"A KeyPress node outputs 1 when the A or D key is pressed."}),`
`,e.jsx(n.li,{children:"The key press value is multiplied by a speed constant and by delta time (from the Time node)."}),`
`,e.jsx(n.li,{children:"The result is subtracted from or added to the raccoon's current x-position."}),`
`,e.jsx(n.li,{children:"The new position is sent back to the raccoon via an ExportToGameObject node."}),`
`]}),`
`,e.jsx(n.h2,{children:"Suggested Reading"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:e.jsx(n.a,{href:"/docs/animation-systems",children:"Animations Systems"})}),`
`,e.jsx(n.li,{children:e.jsx(n.a,{href:"/docs/time-and-game-loop/time-axes",children:"Time Axes"})}),`
`,e.jsx(n.li,{children:e.jsx(n.a,{href:"/docs/time-and-game-loop/frames",children:"Frames"})}),`
`,e.jsx(n.li,{children:e.jsx(n.a,{href:"/docs/time-and-game-loop/game-loop",children:"Game Loop"})}),`
`]})]})}function r(s={}){const{wrapper:n}=s.components||{};return n?e.jsx(n,{...s,children:e.jsx(t,{...s})}):t(s)}export{r as default,o as frontmatter};
