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
                        "^vitest($|/)",
                        "^primeng($|/)",
                        "^@primeuix($|/)",
                        "^@primeuix/.*$",
                        "^primeicons($|/)",
                        "^primeflex($|/)",
                        "^chart.js($|/)",
                        "^d3($|/)",
                        "^@nestjs($|/)",
                        "^@nestjs/.*$",
                        "^@nx/webpack($|/)",
                        "^@nx/webpack/.*$",
                        "^reflect-metadata$",
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
                                "@generated/spring-api-client",
                                "@generated/spring-api-client/*",
                                "@playwright/test",
                                "@playwright/test/*",
                                "vitest",
                                "vitest/*",
                                "d3",
                                "d3/*",
                                "chart.js",
                                "chart.js/*",
                                "@primeuix",
                                "@primeuix/*",
                                "@nestjs",
                                "@nestjs/*",
                                "@nx/webpack",
                                "@nx/webpack/*",
                                "reflect-metadata"
                            ]
                        },
                        {
                            sourceTag: "scope:nest-api",
                            onlyDependOnLibsWithTags: [
                                "*"
                            ],
                            allowedExternalImports: [
                                "@nestjs",
                                "@nestjs/*",
                                "@nx/webpack",
                                "@nx/webpack/*",
                                "reflect-metadata"
                            ]
                        }
                    ]
                }
            ]
        }
    },
    {
        files: [
            "apps/architecture-dashboard/src/app/**/*.ts"
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
                        "^vitest($|/)",
                        "^primeng($|/)",
                        "^@primeuix($|/)",
                        "^@primeuix/.*$",
                        "^primeicons($|/)",
                        "^primeflex($|/)",
                        "^d3($|/)",
                        "^chart.js($|/)",
                        "^@nestjs($|/)",
                        "^@nestjs/.*$",
                        "^@nx/webpack($|/)",
                        "^@nx/webpack/.*$",
                        "^reflect-metadata$",
                        "^socket.io-client($|/)"
                    ],
                    depConstraints: [
                        {
                            sourceTag: "*",
                            onlyDependOnLibsWithTags: [
                                "*"
                            ],
                            allowedExternalImports: [
                                "@generated/spring-api-client",
                                "@generated/spring-api-client/*",
                                "@playwright/test",
                                "@playwright/test/*",
                                "vitest",
                                "vitest/*",
                                "d3",
                                "d3/*",
                                "chart.js",
                                "chart.js/*",
                                "@primeuix",
                                "@primeuix/*",
                                "@nestjs",
                                "@nestjs/*",
                                "@nx/webpack",
                                "@nx/webpack/*",
                                "reflect-metadata",
                                "socket.io-client",
                                "socket.io-client/*"
                            ]
                        },
                        {
                            sourceTag: "scope:nest-api",
                            onlyDependOnLibsWithTags: [
                                "*"
                            ],
                            allowedExternalImports: [
                                "@nestjs",
                                "@nestjs/*",
                                "@nx/webpack",
                                "@nx/webpack/*",
                                "reflect-metadata"
                            ]
                        }
                    ]
                }
            ]
        }
    },
    {
        files: [
            "apps/nest-api/**/*.ts"
        ],
        rules: {
            "@nx/enforce-module-boundaries": "off"
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
