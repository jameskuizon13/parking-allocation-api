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
# This includes running the db and the seed file
$ yarn db:dev:restart

# development
$ yarn run start

# watch mode
$ yarn run start:dev

# UI for the db
$ yarn prisma studio
```

To be able to view the API details in Swagger go to http://localhost:3000/api

### Creating a user

1. Create a user via `POST /auth/signup`
2. Copy the accessToken in the api response
3. Click the padlock icon and then paste the accessToken

### Login a user

1. Login a user via `POST /auth/signin` with the user credentials you have created in the signup process
2. Copy the accessToken in the api response
3. Click the padlock icon and then paste the accessToken

### Parking a car

1. If you are already authenticated, skip this step. Authenticate user first by following the steps defined in [Creating a user](https://github.com/jameskuizon13/parking-allocation-api#creating-a-user) or [Login a user](https://github.com/jameskuizon13/parking-allocation-api#login-a-user).
2. Create a vehicle via `POST /vehicles`. Remember that the `plateNumber` is unique and the allowed values for `type` is `S`, `M` and `L`.
3. Copy the id of the generated vehicle
4. Fetch all the parking entrances and choose one and copy its id
5. Paste the copied values in the body of `POST /parking-records` and run it.

### Unpark a car

1. If you are already authenticated, skip this step. Authenticate user first by following the steps defined in [Creating a user](https://github.com/jameskuizon13/parking-allocation-api#creating-a-user) or [Login a user](https://github.com/jameskuizon13/parking-allocation-api#login-a-user).
2. Fetch the details of your vehicle via `GET /vehicles`.
3. Copy the id of your vehicle's active parking record
4. Supply the copied id to `PATCH /parking-records/{:id}` if you want to let the current time be the time out time, or to `PATCH /parking-records/{:id}/manual`, if you want to set the time out time based on the time in plus your hours and minutes input (though this should only be used for testing purposes).
