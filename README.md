# Parking Allocation API

A parking allocation system API

## Description

A parking allocation system API for a mall

## Dependencies

- [Yarn](https://yarnpkg.com/getting-started) v1.22.11
- [Yarn version Manager](https://yvm.js.org/docs/overview) v4.1.4
- [Nest CLI](https://yvm.js.org/docs/overview) v8.2.6
- [Docker](https://docs.docker.com/get-docker/) v20.10.17
- [Docker Compose](https://docs.docker.com/compose/install/) v1.29.1

## Installation

- Before installing make sure that the following ports are free:
  - port 5434 (the port the db will used)
  - port 3000 (the port the api will run thru)

```bash
$ yarn install
```

## Running the app

```bash
# Needs to run this to start the db every time you turn on your computer
# as I didn't add volume yet
$ yarn db:dev:restart

# development
$ yarn run start

# watch mode
$ yarn run start:dev

# UI for the db
$ yarn prisma studio
```

To be able to view the API details in Swagger go to http://localhost:3000/api
