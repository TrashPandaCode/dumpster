import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/Home.tsx"),
  route("/game/:id?", "routes/Game.tsx"), //TODO: make this /level/:id? (keeping "game" for now to avoid breaking changes)
  route("/docs", "routes/docs/Overview.tsx", [
    route(":category/:topic", "routes/docs/DocsContent.tsx"),
  ]),
  route("*", "routes/NotFound.tsx"),
] satisfies RouteConfig;
