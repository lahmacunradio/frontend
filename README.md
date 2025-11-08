# Lahmacun Radio Frontend

> Frontend for Lahmacun Radio 2021, using arcsi, stream and wp APIs. 
> 
> Made in Vue/Nuxt.js (v2), with Tailwindcss framework
> 
> 水果湯

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## Dev env
#### Node
Node version `>=14.18.2` (currently using 20.19.5)

Node Version Manager (.nvmrc) has the recommended version, run `nvm install` and `nvm use` in `app` folder
#### pnpm
pnpm `>=9.0.0`

Install pnpm using corepack (comes with Node.js):
```bash
corepack enable
corepack prepare pnpm@9.0.0 --activate
```

## Build Setup

``` bash
$ cd ./app

# install dependencies
$ pnpm install

# serve with hot reload at localhost:3333
$ pnpm dev

# build for production and launch server
$ pnpm build
$ pnpm start

# generate static project
$ pnpm generate
```

## Docker Setup
``` bash
# Make sure you are in project root where file exists
$ ls docker-compose.yml

# Build the image after development changes
$ docker compose build

# Load the app
$ docker compose up -d

# Stop the app
$ docker compose down
```

## Local Dev environment + IDE Setup

### Add allow CORS plugin to your browser
Chrome/Firefox: Allow CORS

### IDE helpers
- Vetur or Volar (vue formatters)
- ESlint

### Browser helpers
- Vue devtools

### Add SCSS watcher to your IDE
#### Storm:

Preferences -> File Watchers -> Add SCSS Watcher

Program: ``` /usr/local/bin/node-sass ```

Arguments: ```` --output-style compressed $FileName$ $FileNameWithoutExtension$.css ````

#### VSCode:
eg. Scss-to-css extension (should work automatically)
