import{t as e}from"./chunk-AYJ5UCUI-DfzbB4N7.js";const r={title:"For Loop"},i=`<h1>For Loop</h1>
<p>The <em>For Loop</em> consists of two connected nodes — <em>For Start</em> and <em>For End</em> — which together define a custom loop structure within the graph.</p>
<p><strong>Note</strong>: All loop iterations are computed every frame. This means the entire loop is evaluated in full during each frame update, rather than being spread out over time.</p>
<h2>Overview</h2>
<ul>
<li><strong>For Start</strong>: Defines the loop inputs, number of iterations, and initial values.</li>
<li><strong>For End</strong>: Handles value updates at the end of each iteration and allows the loop to exit early via a break input.</li>
</ul>
<p>The loop maintains a state between iterations, passing values from the <em>For End</em> back to the <em>For Start</em> node. On the final iteration, the final values from the <em>For End</em> node are made available for use outside the loop.</p>
<p>Loops are color-coded with a dedicated edge style for easy visual identification.</p>
<h2>How It Works</h2>
<ol>
<li>Initial Setup:
<ul>
<li>In the <em>For Start</em> node, use the input field to define loop variables (handles).</li>
<li>Each handle becomes an input and output on both the <em>For Start</em> and <em>For End</em> nodes.</li>
</ul>
</li>
<li>First Iteration:
<ul>
<li>The values connected to the inputs of <em>For Start</em> node are forwarded to its outputs and can be used within the loop body.</li>
</ul>
</li>
<li>Subsequent Iterations:
<ul>
<li>At the end of each iteration, the <em>For End</em> node inputs are passed back to the <em>For Start</em> node outputs for the next iteration.</li>
</ul>
</li>
<li>Final Output:
<ul>
<li>On the last iteration, the <em>For End</em> node passes its input values to its outputs, making them available outside the loop.</li>
</ul>
</li>
</ol>
<h2>Properties</h2>
<h3>For Start</h3>
<ul>
<li><strong>Iterations</strong>: Defines how many times the loop will run.</li>
<li><strong>Handles</strong>: Add input/output variables shared across loop iterations.</li>
</ul>
<h3>For End</h3>
<ul>
<li><strong>Break</strong>: A boolean input. When true, the loop exits early.</li>
<li><strong>Handles</strong>: Inputs and outputs for each defined handle, used to update values between iterations and expose final results.</li>
</ul>
<h2>Using nodes in loops</h2>
<p>To add nodes inside the loop body right-click on either the <em>For Start</em> or <em>For End</em> node and use the context menu to insert new nodes. These will be included in the loop’s execution. This will not work in the example below.</p>
<DocsNodeEditor type="ForLoop" />
`,l={},s=function(t){return Object.keys(t).forEach(function(n){l[n]=t[n]}),e.createElement("div",null,e.createElement("h1",null,"For Loop"),e.createElement("p",null,"The ",e.createElement("em",null,"For Loop")," consists of two connected nodes — ",e.createElement("em",null,"For Start")," and ",e.createElement("em",null,"For End")," — which together define a custom loop structure within the graph."),e.createElement("p",null,e.createElement("strong",null,"Note"),": All loop iterations are computed every frame. This means the entire loop is evaluated in full during each frame update, rather than being spread out over time."),e.createElement("h2",null,"Overview"),e.createElement("ul",null,e.createElement("li",null,e.createElement("strong",null,"For Start"),": Defines the loop inputs, number of iterations, and initial values."),e.createElement("li",null,e.createElement("strong",null,"For End"),": Handles value updates at the end of each iteration and allows the loop to exit early via a break input.")),e.createElement("p",null,"The loop maintains a state between iterations, passing values from the ",e.createElement("em",null,"For End")," back to the ",e.createElement("em",null,"For Start")," node. On the final iteration, the final values from the ",e.createElement("em",null,"For End")," node are made available for use outside the loop."),e.createElement("p",null,"Loops are color-coded with a dedicated edge style for easy visual identification."),e.createElement("h2",null,"How It Works"),e.createElement("ol",null,e.createElement("li",null,"Initial Setup:",e.createElement("ul",null,e.createElement("li",null,"In the ",e.createElement("em",null,"For Start")," node, use the input field to define loop variables (handles)."),e.createElement("li",null,"Each handle becomes an input and output on both the ",e.createElement("em",null,"For Start")," and ",e.createElement("em",null,"For End")," nodes."))),e.createElement("li",null,"First Iteration:",e.createElement("ul",null,e.createElement("li",null,"The values connected to the inputs of ",e.createElement("em",null,"For Start")," node are forwarded to its outputs and can be used within the loop body."))),e.createElement("li",null,"Subsequent Iterations:",e.createElement("ul",null,e.createElement("li",null,"At the end of each iteration, the ",e.createElement("em",null,"For End")," node inputs are passed back to the ",e.createElement("em",null,"For Start")," node outputs for the next iteration."))),e.createElement("li",null,"Final Output:",e.createElement("ul",null,e.createElement("li",null,"On the last iteration, the ",e.createElement("em",null,"For End")," node passes its input values to its outputs, making them available outside the loop.")))),e.createElement("h2",null,"Properties"),e.createElement("h3",null,"For Start"),e.createElement("ul",null,e.createElement("li",null,e.createElement("strong",null,"Iterations"),": Defines how many times the loop will run."),e.createElement("li",null,e.createElement("strong",null,"Handles"),": Add input/output variables shared across loop iterations.")),e.createElement("h3",null,"For End"),e.createElement("ul",null,e.createElement("li",null,e.createElement("strong",null,"Break"),": A boolean input. When true, the loop exits early."),e.createElement("li",null,e.createElement("strong",null,"Handles"),": Inputs and outputs for each defined handle, used to update values between iterations and expose final results.")),e.createElement("h2",null,"Using nodes in loops"),e.createElement("p",null,"To add nodes inside the loop body right-click on either the ",e.createElement("em",null,"For Start")," or ",e.createElement("em",null,"For End")," node and use the context menu to insert new nodes. These will be included in the loop’s execution. This will not work in the example below."),e.createElement(l.DocsNodeEditor,{type:"ForLoop"}))};export{s as ReactComponent,r as attributes,i as html};
