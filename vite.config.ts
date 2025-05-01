import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { reactRouterDevTools } from "react-router-devtools";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { plugin as mdPlugin, Mode } from "vite-plugin-markdown";

export default defineConfig(({ mode }: { mode: string }) => ({
  base: mode === "gh-pages" ? "/dumpster/" : "/",
  plugins: [
    tailwindcss(),
    reactRouterDevTools(),
    reactRouter(),
    tsconfigPaths(),
    mdPlugin({
      mode: [Mode.REACT, Mode.HTML],
      markdownIt: {
        html: true,
        linkify: true,
        typographer: true
      }
    }),
  ],
}));
