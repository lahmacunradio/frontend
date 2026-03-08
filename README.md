# Lahmacun Radio Frontend

> Frontend for Lahmacun Radio 2021, using arcsi, stream and wp APIs. 
> 
> Made in Vue/Nuxt.js (v2), with Tailwindcss framework
> 
> 水果湯

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## Dev env
#### Node
Node version `=14.18.2`

Node Version Manager (.nvmrc) has 14.18.2 as recommended, run `nvm install` and `nvm use` in `app` folder
#### Yarn
At least `>=1.22.10`

## Build Setup

``` bash
$ cd ./app

# install dependencies
$ yarn install

# serve with hot reload at localhost:3333
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

## Docker Setup
``` bash
# Make sure you are in project root where file exists
$ ls docker-compose.yml

# Build the image after development changes
$ docker-compose build

# Load the app
$ docker-compose up -d

# Stop the app
$ docker-compose down
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

## Component packages
Uses [Primevue v.2](https://www.primefaces.org/primevue-v2/#/) for components
