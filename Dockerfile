FROM 192.168.1.138:5000/smebberson/alpine-nginx

EXPOSE 881

COPY dist/ /usr/html/

COPY docker/default.conf /etc/nginx/conf.d/
