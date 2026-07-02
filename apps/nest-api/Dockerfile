FROM node:24-alpine

WORKDIR /workspace

RUN corepack enable

COPY package.json pnpm-lock.yaml nx.json tsconfig.base.json ./
COPY .prettierrc .prettierignore eslint.config.mjs jest.config.ts jest.preset.js ./
COPY apps ./apps

RUN pnpm config set trust-policy ignore && pnpm config set minimumReleaseAge 0 && pnpm config set --location=project allowBuilds true && pnpm install --frozen-lockfile --trust-policy-ignore-after 0

EXPOSE 3000

CMD ["pnpm", "nx", "serve", "nest-api", "--configuration=development"]
