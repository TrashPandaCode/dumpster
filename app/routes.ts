import { index, prefix, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/Home.tsx"),
  route("/game", "routes/Game.tsx"),
  route("/docs", "routes/docs/Overview.tsx", [
    route(":category/:topic", "routes/docs/DocsContent.tsx"),
  ]),
] satisfies RouteConfig;
