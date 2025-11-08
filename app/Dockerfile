FROM node:14-bullseye-slim

# Ensure apt is non-interactive and up-to-date, then install required packages
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        gnupg \
        build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

ENV APP_ROOT=/src

WORKDIR ${APP_ROOT}
COPY package.json pnpm-lock.yaml* ./

RUN pnpm install --frozen-lockfile

COPY . ${APP_ROOT}

RUN pnpm build
RUN pnpm store prune

EXPOSE 3333

CMD [ "pnpm", "start" ]
