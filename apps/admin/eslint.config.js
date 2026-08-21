import { config } from "@lobango/eslint-config/react-internal";

export default [
  ...config,
  {
    ignores: ["android/**", "out/**"],
  },
];
