// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config({
  extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
  ignores: ["**/build/**"],
  rules: {
    "@typescript-eslint/consistent-type-imports": [
      "error",
      {
        prefer: "type-imports",
        fixStyle: "separate-type-imports",
      },
    ],
  },
});
