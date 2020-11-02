FROM node:lts-alpine as build-stage
WORKDIR /app
COPY . .
# WORKDIR /app/research_platform
# RUN npm install
# RUN npm run build

WORKDIR /app

FROM nginx
RUN echo "soft nofile 1024000" >> /etc/security/limits.conf
RUN echo "hard nofile 1024000" >> /etc/security/limits.conf

# COPY --from=build-stage /app/research_platform/dist /var/www/html/research_platform

RUN rm /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx/nginx.conf
