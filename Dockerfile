FROM node:6-alpine

RUN mkdir -p /var/www/app

WORKDIR /var/www/app

ADD package.json /var/www/app/package.json

RUN npm install

RUN npm install -g nodemon

ADD ./ /var/www/app
