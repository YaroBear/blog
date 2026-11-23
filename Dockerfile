FROM node:lts-alpine AS assets
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run copy

FROM ghcr.io/getzola/zola:v0.23.6-alpine AS site
WORKDIR /src
COPY --from=assets /app /src
RUN zola build --output-dir public

FROM nginx:alpine
COPY --from=site /src/public /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
