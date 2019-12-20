FROM nginx:stable

WORKDIR /root/map-server-ui

COPY ./dist ./dist
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

ENTRYPOINT [ "nginx", "-g 'daemon off;'"]