FROM node:20.11.1

WORKDIR /app
COPY ./package.json ./
COPY ./yarn.lock ./
RUN yarn install

WORKDIR /app/admin
COPY ./admin/package.json ./
COPY ./admin/yarn.lock ./
RUN yarn install

COPY . .

CMD [ "yarn", "dev" ]