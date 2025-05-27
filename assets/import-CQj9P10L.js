import{t as e}from"./chunk-AYJ5UCUI-DfzbB4N7.js";const s={title:"Import From Gameobject"},c=`<h1>Import from Gameobject</h1>
<p>The <em>Import from GameObject</em> node provides read access to gameobject specific properties of one or more gameobjects in the scene.</p>
<p>There are read and write specific properties, meaning that not all properties of one gameobject are shared between the <em>Import From</em> and <em>Export To Gameobject</em> nodes.</p>
<h2>Functionality</h2>
<ul>
<li>A dropdown menu lists all selectable gameobjects.</li>
<li>You can select a single gameobject or multiple gameobjects.</li>
<li>When selecting a single gameobject, all of its available outputs (properties) will be displayed.</li>
<li>When selecting multiple gameobjects, only the common (shared) outputs across all selected gameobjects are shown.</li>
<li>When multiple gameobjects are selected, an index input appears. Use this input to specify which gameobject’s values to access by index.</li>
</ul>
<h2>Properties</h2>
<ul>
<li>
<p><strong>Index</strong> (visible only when multiple gameobjects are selected): An integer input used to select which gameobject to read from in the list.</p>
<ul>
<li>when an index not corresponding to a gameobject is used the node will output nothing</li>
</ul>
</li>
<li>
<p><strong>Outputs</strong>: The available properties of the selected gameobject(s), such as position, rotation, etc. These update dynamically based on the selection.</p>
</li>
</ul>
<DocsNodeEditor type="DocsImportFromGameobject" />
`,n={},i=function(t){return Object.keys(t).forEach(function(l){n[l]=t[l]}),e.createElement("div",null,e.createElement("h1",null,"Import from Gameobject"),e.createElement("p",null,"The ",e.createElement("em",null,"Import from GameObject")," node provides read access to gameobject specific properties of one or more gameobjects in the scene."),e.createElement("p",null,"There are read and write specific properties, meaning that not all properties of one gameobject are shared between the ",e.createElement("em",null,"Import From")," and ",e.createElement("em",null,"Export To Gameobject")," nodes."),e.createElement("h2",null,"Functionality"),e.createElement("ul",null,e.createElement("li",null,"A dropdown menu lists all selectable gameobjects."),e.createElement("li",null,"You can select a single gameobject or multiple gameobjects."),e.createElement("li",null,"When selecting a single gameobject, all of its available outputs (properties) will be displayed."),e.createElement("li",null,"When selecting multiple gameobjects, only the common (shared) outputs across all selected gameobjects are shown."),e.createElement("li",null,"When multiple gameobjects are selected, an index input appears. Use this input to specify which gameobject’s values to access by index.")),e.createElement("h2",null,"Properties"),e.createElement("ul",null,e.createElement("li",null,e.createElement("p",null,e.createElement("strong",null,"Index")," (visible only when multiple gameobjects are selected): An integer input used to select which gameobject to read from in the list."),e.createElement("ul",null,e.createElement("li",null,"when an index not corresponding to a gameobject is used the node will output nothing"))),e.createElement("li",null,e.createElement("p",null,e.createElement("strong",null,"Outputs"),": The available properties of the selected gameobject(s), such as position, rotation, etc. These update dynamically based on the selection."))),e.createElement(n.DocsNodeEditor,{type:"DocsImportFromGameobject"}))};export{i as ReactComponent,s as attributes,c as html};
