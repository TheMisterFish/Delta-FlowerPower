FROM node:12-alpine as builder
WORKDIR /app
COPY . .
WORKDIR /app/research_platform
RUN npm install
RUN npm run build

FROM nginx
COPY --from=builder /app/research_platform/dist /var/www/html/research_platform
RUN rm /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx/nginx.conf
COPY mime.types /etc/nginx/mime.types