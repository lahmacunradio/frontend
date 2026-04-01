FROM node:14.21.3-buster-slim

RUN sed -i s/deb.debian.org/archive.debian.org/g /etc/apt/sources.list
RUN sed -i s/security.debian.org/archive.debian.org/g /etc/apt/sources.list

RUN apt-get update
RUN apt-get install -y curl \
    && apt-get install -y gnupg \
    && apt-get install -y build-essential
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt install -y yarn

ENV APP_ROOT=/src

WORKDIR ${APP_ROOT}
COPY . ${APP_ROOT}

RUN yarn install --ignore-engines

RUN yarn build
RUN yarn cache clean

EXPOSE 3333

CMD [ "yarn", "start" ]
