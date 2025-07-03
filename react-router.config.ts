/*
 * Authors: Leo Kling
 *
 * Purpose:
 * This code exports a React Router configuration object that disables server-side rendering (SSR).
 */

import type { Config } from "@react-router/dev/config";

export default {
  ssr: false,
} satisfies Config;
