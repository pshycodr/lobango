import { config } from "@lobango/eslint-config/base";
import tseslint from "typescript-eslint";

export default tseslint.config(...config, {
  ignores: [
    "dist/**",
    "node_modules/**",
    ".wrangler/**",
    ".migrations/**",
    "worker-configuration.d.ts",
  ],
});
