const fs = require("fs");
const path = require("path");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
let source = fs.readFileSync(path.join(root, "src/main.jsx"), "utf8");
source = source.replace(/^import "\.\/.*\.css";\r?\n/gm, "");

let js = ts.transpileModule(source, {
  compilerOptions: {
    jsx: ts.JsxEmit.React,
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2020,
  },
}).outputText;

js = js
  .replace('from "react"', 'from "https://esm.sh/react@18.3.1"')
  .replace('from "react-dom/client"', 'from "https://esm.sh/react-dom@18.3.1/client"');

const css = [
  "src/styles.css",
  "src/department-plan.css",
  "src/cycle-planner.css",
  "src/store-lookup.css",
  "src/performance-view.css",
  "src/calendar-view.css",
  "src/store-feature-plan.css",
  "src/monthly-performance.css",
  "src/action-plan.css",
  "src/operational-upgrades.css",
  "src/calendar-edit.css",
  "src/advanced-insights.css",
  "src/planning-workflow.css",
].map((file) => fs.readFileSync(path.join(root, file), "utf8")).join("\n");

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="theme-color" content="#081522">
  <meta name="description" content="SWAS Planning — AI-assisted retail endcap planning demonstration.">
  <title>SWAS Planning Demo</title>
  <link rel="stylesheet" href="/app.css?v=13">
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/app.js?v=13"></script>
</body>
</html>`;

const worker = `const assets = {
  "/": { body: ${JSON.stringify(html)}, type: "text/html; charset=utf-8" },
  "/index.html": { body: ${JSON.stringify(html)}, type: "text/html; charset=utf-8" },
  "/app.js": { body: ${JSON.stringify(js)}, type: "text/javascript; charset=utf-8" },
  "/app.css": { body: ${JSON.stringify(css)}, type: "text/css; charset=utf-8" },
};

export default {
  async fetch(request) {
    const pathname = new URL(request.url).pathname;
    const asset = assets[pathname] || assets["/"];
    return new Response(asset.body, {
      headers: {
        "content-type": asset.type,
        "cache-control": "no-store, no-cache, must-revalidate",
        "x-content-type-options": "nosniff",
      },
    });
  },
};
`;

const serverDir = path.join(root, "dist/server");
fs.mkdirSync(serverDir, { recursive: true });
fs.writeFileSync(path.join(serverDir, "index.js"), worker);
console.log("Built dist/server/index.js");
