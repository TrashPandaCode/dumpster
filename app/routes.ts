import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/Home.tsx"),
  route("/test", "routes/Game.tsx"),
] satisfies RouteConfig;
