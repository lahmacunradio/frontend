FROM node:14-bullseye-slim

# Ensure apt is non-interactive and up-to-date, then install required packages
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        gnupg \
        build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Yarn (official repo)
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor -o /usr/share/keyrings/yarnkey.gpg \
    && echo "deb [signed-by=/usr/share/keyrings/yarnkey.gpg] https://dl.yarnpkg.com/debian/ stable main" > /etc/apt/sources.list.d/yarn.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends yarn \
    && rm -rf /var/lib/apt/lists/*

ENV APP_ROOT=/src

WORKDIR ${APP_ROOT}
COPY . ${APP_ROOT}

RUN yarn install --ignore-engines

RUN yarn build
RUN yarn cache clean

EXPOSE 3333

CMD [ "yarn", "start" ]
