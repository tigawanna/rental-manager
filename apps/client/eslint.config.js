import { nextJsConfig } from "@repo/eslint-config/next-js";

/** @type {import("eslint").Linter.Config[]} */
export default [
    ...nextJsConfig,
    {
        // rules: {
            // Add your app-level rule overrides here
            // "@typescript-eslint/no-empty-interface": "off",
            // "react/no-unescaped-entities": "warn",
            // "no-empty-interface": "off",
            // "no-unescaped-entities": "warn",
        // },
    },
];
