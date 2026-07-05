FROM node:24-alpine AS build

WORKDIR /workspace

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml nx.json tsconfig.base.json ./
COPY .prettierrc .prettierignore eslint.config.mjs jest.config.ts jest.preset.js ./
COPY apps ./apps
COPY libs/generated ./libs/generated

RUN pnpm install --frozen-lockfile
RUN pnpm nx build architecture-dashboard --configuration=production

FROM nginx:stable-alpine AS runtime

COPY --from=build /workspace/dist/apps/architecture-dashboard/browser /usr/share/nginx/html
COPY apps/architecture-dashboard/nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
