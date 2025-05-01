const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const docsDir = path.join(__dirname, "../content/docs");

function getNavTree(dir = docsDir, baseRoute = "/docs") {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  const nav = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const routePath = path.join(baseRoute, entry.name.replace(/\.md$/, ""));

    if (entry.isDirectory()) {
      const children = getNavTree(fullPath, path.join(baseRoute, entry.name));
      nav.push({
        title: formatTitle(entry.name),
        items: children
      });
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      const file = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(file);

      nav.push({
        title: data.title || formatTitle(entry.name.replace(".md", "")),
        path: routePath.replace(/\\/g, "/")
      });
    }
  }

  return nav;
}

function formatTitle(name) {
  return name
    .replace(/-/g, " ")
    .replace(/\b\w/g, l => l.toUpperCase());
}

const nav = getNavTree();
fs.writeFileSync("app/lib/core/navigation.json", JSON.stringify(nav, null, 2));
console.log("Navigation generated.");
