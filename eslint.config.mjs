import nx from "@nx/eslint-plugin";

export default [
    ...nx.configs["flat/base"],
    ...nx.configs["flat/typescript"],
    ...nx.configs["flat/javascript"],
    {
        ignores: [
            "**/dist",
            "**/out-tsc"
        ]
    },
    {
        files: [
            "**/*.ts",
            "**/*.tsx",
            "**/*.js",
            "**/*.jsx"
        ],
        rules: {
            "@nx/enforce-module-boundaries": [
                "error",
                {
                    enforceBuildableLibDependency: true,
                    allow: [
                        "^.*/eslint(\.base)?\.config\.[cm]?[jt]s$",
                        "^@generated/spring-api-client($|/)",
                        "^@generated/spring-api-client/.*",
                        "^@angular(/|$)",
                        "^rxjs($|/)",
                        "^@playwright/test($|/)",
                        "^primeng($|/)",
                        "^primeicons($|/)",
                        "^primeflex($|/)",
                        "@generated/spring-api-client",
                        "@generated/spring-api-client/*"
                    ],
                    depConstraints: [
                        {
                            sourceTag: "*",
                            onlyDependOnLibsWithTags: [
                                "*"
                            ],
                            allowedExternalImports: [
                                "^@generated/spring-api-client($|/)",
                                "^@generated/spring-api-client/.*"
                            ]
                        }
                    ]
                }
            ]
        }
    },
    {
        files: [
            "**/*.ts",
            "**/*.tsx",
            "**/*.cts",
            "**/*.mts",
            "**/*.js",
            "**/*.jsx",
            "**/*.cjs",
            "**/*.mjs"
        ],
        // Override or add rules here
        rules: {}
    },
    {
        files: [
            "apps/architecture-dashboard/src/app/core/api/spring-api.facade.ts"
        ],
        rules: {
            "@nx/enforce-module-boundaries": "off"
        }
    }
];
