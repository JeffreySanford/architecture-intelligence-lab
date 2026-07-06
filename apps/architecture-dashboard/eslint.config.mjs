import nx from "@nx/eslint-plugin";
import baseConfig from "../../eslint.config.mjs";

export default [
    ...nx.configs["flat/angular"],
    ...nx.configs["flat/angular-template"],
    ...baseConfig,
    {
        files: [
            "**/*.ts"
        ],
        rules: {
            "@angular-eslint/directive-selector": [
                "error",
                {
                    type: "attribute",
                    prefix: "app",
                    style: "camelCase"
                }
            ],
            "@angular-eslint/component-selector": [
                "error",
                {
                    type: "element",
                    prefix: "app",
                    style: "kebab-case"
                }
            ]
        }
    },
    {
        files: [
            "apps/architecture-dashboard/src/app/features/capital-markets/capital-markets.page.ts"
        ],
        rules: {
            "@angular-eslint/use-lifecycle-interface": "off"
        }
    },
    {
        files: [
            "apps/architecture-dashboard/src/app/features/capital-markets/capital-markets.page.ts"
        ],
        rules: {
            "@angular-eslint/use-lifecycle-interface": "off"
        }
    },
    {
        files: [
            "**/*.html"
        ],
        // Override or add rules here
        rules: {}
    },
    {
        files: [
            "**/spring-api.facade.ts"
        ],
        rules: {
            "@nx/enforce-module-boundaries": "off"
        }
    },
    {
        files: [
            "src/app/core/realtime-socket/realtime-socket.service.ts"
        ],
        rules: {
            "@nx/enforce-module-boundaries": "off"
        }
    },
    {
        files: [
            ".storybook/**/*.ts",
            "src/app/**/*.stories.ts"
        ],
        rules: {
            "@nx/enforce-module-boundaries": "off"
        }
    }
];
