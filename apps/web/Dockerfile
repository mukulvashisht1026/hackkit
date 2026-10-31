FROM node:20-alpine AS build
WORKDIR /w
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/
COPY packages/ui/package.json packages/ui/
RUN npm ci
COPY packages/ui packages/ui
COPY apps/web apps/web
RUN npm run build -w apps/web
FROM nginx:alpine
COPY --from=build /w/apps/web/dist /usr/share/nginx/html
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
