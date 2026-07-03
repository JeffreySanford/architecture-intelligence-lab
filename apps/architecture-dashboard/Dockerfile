FROM node:24-alpine

WORKDIR /workspace

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml nx.json tsconfig.base.json ./
COPY .prettierrc .prettierignore eslint.config.mjs jest.config.ts jest.preset.js ./
COPY apps ./apps
COPY libs/generated ./libs/generated

RUN pnpm install --frozen-lockfile

EXPOSE 4200

CMD ["pnpm", "nx", "serve", "architecture-dashboard", "--host", "0.0.0.0", "--port", "4200"]
