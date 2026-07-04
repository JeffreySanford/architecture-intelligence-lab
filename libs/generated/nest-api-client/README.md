# Nest API Generated Client

This library contains Angular models and services generated from the NestJS OpenAPI document.

## Usage

- Run `pnpm nx run nest-api-client:generate` to export the Nest OpenAPI document locally and regenerate the client.
- Run `pnpm nx run nest-api-client:drift-check` to regenerate and verify facade boundaries.
- Import generated services and models from the package:
  - `@generated/nest-api-client`
- Do not hand-edit generated output in `libs/generated/nest-api-client/src/generated`.
- If the API contract changes, update the Nest OpenAPI controllers/models and regenerate.

## Generation

The target exports the Nest OpenAPI document with:

- `node tools/export-nest-openapi.cjs libs/generated/nest-api-client/openapi.json`

Then it runs `openapi-generator-cli` against:

- `libs/generated/nest-api-client/openapi.json`

The generated files will be written to:

- `libs/generated/nest-api-client/src/generated`

The generation target does not require a separately running Nest server.
