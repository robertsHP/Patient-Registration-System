FROM node:20.11.1

WORKDIR /app

COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn install
RUN yarn add serve

COPY . .

CMD [ "yarn", "start" ]