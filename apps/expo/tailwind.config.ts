import type { Config } from "tailwindcss";

import baseConfig from "@acme/tailwind-config";

export default {
  content: ["./src/app.{ts,tsx}", "./src/app/**/*.{ts,tsx}"],
  presets: [baseConfig],
} satisfies Config;
