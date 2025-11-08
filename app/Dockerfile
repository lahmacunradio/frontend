FROM node:20.19.5

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

# Copy package files for dependency installation
COPY package.json pnpm-lock.yaml* .npmrc* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy application source code (node_modules excluded via .dockerignore)
COPY . .

# Build the application
RUN pnpm build

# Clean up pnpm store to reduce image size
RUN pnpm store prune

EXPOSE 3333

CMD [ "pnpm", "start" ]
