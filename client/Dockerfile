FROM node:20.11.1

WORKDIR /app
COPY ./package.json ./
COPY ./yarn.lock ./
RUN yarn install

COPY . .

CMD [ "yarn", "dev" ]