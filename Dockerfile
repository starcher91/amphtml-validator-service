FROM node:6-alpine

RUN mkdir -p /var/www/app

WORKDIR /var/www/app

ADD package.json /var/www/app/package.json

RUN npm install

ADD ./ /var/www/app
