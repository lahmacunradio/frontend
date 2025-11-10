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

# Accept build-time environment variables
# These are needed during `pnpm build` so Nuxt can bake them into the client bundle
ARG ARCSI_TOKEN
ARG SENTRY_DSN
ARG DONATE_STRIPE_FORM_URL
ARG MEMBERSHIP_STRIPE_FORM_URL
ARG SUBSCRIPTION_CANCEL_URL

# Set as environment variables so the build process can read them
ENV ARCSI_TOKEN=$ARCSI_TOKEN
ENV SENTRY_DSN=$SENTRY_DSN
ENV DONATE_STRIPE_FORM_URL=$DONATE_STRIPE_FORM_URL
ENV MEMBERSHIP_STRIPE_FORM_URL=$MEMBERSHIP_STRIPE_FORM_URL
ENV SUBSCRIPTION_CANCEL_URL=$SUBSCRIPTION_CANCEL_URL

# Build the application with env vars available
RUN pnpm build

# Clean up pnpm store to reduce image size
RUN pnpm store prune

EXPOSE 3333

CMD [ "pnpm", "start" ]
