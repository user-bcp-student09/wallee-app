# Nombres completos de imagen: Podman no resuelve nombres cortos sin preguntar.
FROM docker.io/library/node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Pruebas: podman build --target test frontend
FROM deps AS test
COPY . .
RUN npm run test:coverage

FROM deps AS build
COPY . .
RUN npm run build

# nginx sin privilegios: escucha en 8080 y funciona con Podman rootless.
FROM docker.io/nginxinc/nginx-unprivileged:1.27-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
