FROM node:16-alpine

WORKDIR /usr/src/app

RUN apk add curl

COPY . .

RUN npm i

CMD [ "npm", "start" ]