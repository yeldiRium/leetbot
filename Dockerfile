FROM node:12-alpine
WORKDIR /usr/app

COPY package.json /usr/app/
COPY yarn.lock /usr/app
RUN yarn install

COPY . /usr/app
RUN yarn run build

CMD ["yarn", "run", "bot"]
