FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
ARG VITE_API_BASE_URL=http://localhost:3000
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

FROM nginx:stable-alpine AS runner

COPY default.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint.d/10-env-config.sh /docker-entrypoint.d/10-env-config.sh
RUN chmod +x /docker-entrypoint.d/10-env-config.sh
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- --timeout=2 http://localhost:80/login.html | grep -q '<html' || exit 1
