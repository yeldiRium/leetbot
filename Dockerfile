FROM node:latest
WORKDIR /usr/app

CMD ["yarn", "run", "bot"]

COPY package.json /usr/app/
COPY yarn.lock /usr/app
RUN yarn install

COPY . /usr/app
