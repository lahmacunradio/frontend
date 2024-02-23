FROM node:14.18-buster-slim

RUN apt-get update
RUN apt-get install -y curl \
    && apt-get install -y gnupg \
    && apt-get install -y build-essential
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt install -y yarn install --ignore-engines

ENV APP_ROOT=/src

WORKDIR ${APP_ROOT}
COPY . ${APP_ROOT}

RUN yarn install

RUN yarn build
RUN yarn cache clean

EXPOSE 3333

CMD [ "yarn", "start" ]
