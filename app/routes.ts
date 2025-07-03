/*
 * Authors:
 *
 * Purpose:
 */
import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/Home.tsx"),
  route("/levels/:id?", "routes/Game.tsx"),
  route("/docs", "routes/docs/Overview.tsx", [
    route(":category/:topic", "routes/docs/DocsContent.tsx", {
      id: "category",
    }),
    route(":topic", "routes/docs/DocsContent.tsx", { id: "single-topic" }),
  ]),
  route("/imprint", "routes/Imprint.tsx"),
  route("/privacy-policy", "routes/PrivacyPolicy.tsx"),
  route("/cookie-policy", "routes/CookiePolicy.tsx"),
  route("/attributions", "routes/Attributions.tsx"),
  route("*", "routes/NotFound.tsx"),
] satisfies RouteConfig;
