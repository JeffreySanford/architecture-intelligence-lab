FROM node:24-alpine

WORKDIR /workspace

RUN corepack enable
RUN apk add --no-cache curl

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml nx.json tsconfig.base.json ./
COPY .prettierrc .prettierignore eslint.config.mjs jest.config.ts jest.preset.js ./
COPY apps ./apps

RUN pnpm install --frozen-lockfile

EXPOSE 3000

CMD ["pnpm", "nx", "serve", "nest-api", "--configuration=development"]
