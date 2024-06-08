FROM nginx:latest
COPY nginx.conf /etc/nginx/nginx.conf
RUN chmod +x /etc/nginx/convert-nginx.sh
