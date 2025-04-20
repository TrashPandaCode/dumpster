import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/Home.tsx"),
  route("/game", "routes/Game.tsx"),
] satisfies RouteConfig;
