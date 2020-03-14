FROM nginx

COPY ./dist/ /usr/share/nginx/html/admin
COPY ./vhost.nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
