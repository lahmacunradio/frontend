# frontend

> Frontend for Lahmacun Radio 2021

## Dev env
#### Node
At least `>=12.13.0`
Recommended `>=14.17.0`
Latest supported = 15.14.0 (fibers incompatibility)
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

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
