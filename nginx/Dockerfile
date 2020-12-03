FROM nginx
WORKDIR /app

# COPY ../research_platform_frontend .
# WORKDIR /app/research_platform_frontend
# RUN npm install
# RUN npm run build

RUN echo "soft nofile 1024000" >> /etc/security/limits.conf
RUN echo "hard nofile 1024000" >> /etc/security/limits.conf

# COPY --from=build-stage /app/research_platform/dist /var/www/html/research_platform

RUN rm /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx/nginx.conf
