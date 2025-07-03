/*
 * Authors: Leo Kling
 *
 * Purpose:
 * This Vite configuration sets up a React project with TailwindCSS, MDX support,
 * React Router integration and dev tools, and TypeScript path aliasing, while adjusting the base path for GitHub Pages deployment.
 */

import mdx from "@mdx-js/rollup";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { reactRouterDevTools } from "react-router-devtools";
import rehypeKatex from "rehype-katex";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }: { mode: string }) => ({
  base: mode === "gh-pages" ? "/dumpster/" : "/",
  plugins: [
    tailwindcss(),
    mdx({
      remarkPlugins: [
        remarkMath,
        remarkFrontmatter,
        remarkMdxFrontmatter,
        remarkGfm,
      ],
      rehypePlugins: [rehypeKatex],
    }),
    reactRouterDevTools(),
    reactRouter(),
    tsconfigPaths(),
  ],
}));
