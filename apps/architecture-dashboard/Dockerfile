FROM node:24-alpine AS build

WORKDIR /workspace

RUN corepack enable && corepack prepare pnpm@11.10.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml nx.json tsconfig.base.json ./
COPY .prettierrc .prettierignore eslint.config.mjs jest.config.ts jest.preset.js ./
COPY apps ./apps
COPY libs/generated ./libs/generated

RUN pnpm install --frozen-lockfile
RUN pnpm nx build architecture-dashboard --configuration=production

FROM nginx:stable-alpine AS runtime

RUN apk add --no-cache gettext

COPY --from=build /workspace/dist/apps/architecture-dashboard/browser /usr/share/nginx/html
COPY apps/architecture-dashboard/nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["sh", "-c", "if [ \"$ARCHITECTURE_DASHBOARD_ACCESS_LOG\" = \"off\" ]; then export ACCESS_LOG_DIRECTIVE='access_log off;'; else export ACCESS_LOG_DIRECTIVE='access_log /dev/stdout main;'; fi && envsubst '${ACCESS_LOG_DIRECTIVE}' < /etc/nginx/conf.d/default.conf > /tmp/default.conf && mv /tmp/default.conf /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
