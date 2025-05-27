import{t as e}from"./chunk-AYJ5UCUI-DfzbB4N7.js";const r={title:"Export To Gameobject"},i=`<h1>Export To Gameobject</h1>
<p>The <em>Export To Gameobject</em> node provides write access to gameobject specific properties of one or more gameobjects in the scene. Additionally it allows the user to add and remove properties to gameobjects.</p>
<p>There are read and write specific properties, meaning that not all properties of one gameobject are shared between the <em>Import From</em> and <em>Export To Gameobject</em> nodes.</p>
<h2>Functionality</h2>
<ul>
<li>A dropdown menu lists all selectable gameobjects.</li>
<li>You can select a single gameobject or multiple gameobjects.</li>
<li>When selecting a single gameobject, all of its available inputs (properties) will be displayed.</li>
<li>When selecting multiple gameobjects, only the common (shared) inputs across all selected gameobjects are shown.</li>
<li>When multiple gameobjects are selected, an index input appears. Use this input to specify which gameobject’s values to access by index.</li>
</ul>
<p>Properties can be added by using the <em>Handle</em> input field. Only the manually added properties can be deleted. All added properties have read and write access and are therefore shared between the <em>Import From</em> and <em>Export To Gameobject</em> nodes. Each property must have a unique name.</p>
<h2>Properties</h2>
<ul>
<li>
<p><strong>Index</strong> (visible only when multiple gameobjects are selected): An integer input used to select which gameobject to read from in the list.</p>
<ul>
<li>an index not corresponding to a gameobject will be ignored</li>
</ul>
</li>
<li>
<p><strong>Outputs</strong>: The available properties of the selected gameobject(s), such as position, rotation, etc. They can be written to by the user.</p>
</li>
</ul>
<DocsNodeEditor type="DocsExportToGameobject" />
`,l={},s=function(t){return Object.keys(t).forEach(function(n){l[n]=t[n]}),e.createElement("div",null,e.createElement("h1",null,"Export To Gameobject"),e.createElement("p",null,"The ",e.createElement("em",null,"Export To Gameobject")," node provides write access to gameobject specific properties of one or more gameobjects in the scene. Additionally it allows the user to add and remove properties to gameobjects."),e.createElement("p",null,"There are read and write specific properties, meaning that not all properties of one gameobject are shared between the ",e.createElement("em",null,"Import From")," and ",e.createElement("em",null,"Export To Gameobject")," nodes."),e.createElement("h2",null,"Functionality"),e.createElement("ul",null,e.createElement("li",null,"A dropdown menu lists all selectable gameobjects."),e.createElement("li",null,"You can select a single gameobject or multiple gameobjects."),e.createElement("li",null,"When selecting a single gameobject, all of its available inputs (properties) will be displayed."),e.createElement("li",null,"When selecting multiple gameobjects, only the common (shared) inputs across all selected gameobjects are shown."),e.createElement("li",null,"When multiple gameobjects are selected, an index input appears. Use this input to specify which gameobject’s values to access by index.")),e.createElement("p",null,"Properties can be added by using the ",e.createElement("em",null,"Handle")," input field. Only the manually added properties can be deleted. All added properties have read and write access and are therefore shared between the ",e.createElement("em",null,"Import From")," and ",e.createElement("em",null,"Export To Gameobject")," nodes. Each property must have a unique name."),e.createElement("h2",null,"Properties"),e.createElement("ul",null,e.createElement("li",null,e.createElement("p",null,e.createElement("strong",null,"Index")," (visible only when multiple gameobjects are selected): An integer input used to select which gameobject to read from in the list."),e.createElement("ul",null,e.createElement("li",null,"an index not corresponding to a gameobject will be ignored"))),e.createElement("li",null,e.createElement("p",null,e.createElement("strong",null,"Outputs"),": The available properties of the selected gameobject(s), such as position, rotation, etc. They can be written to by the user."))),e.createElement(l.DocsNodeEditor,{type:"DocsExportToGameobject"}))};export{s as ReactComponent,r as attributes,i as html};
