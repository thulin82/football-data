# [Football Data](https://github.com/thulin82/football-data)

[![CI](https://github.com/thulin82/football-data/actions/workflows/ci.yml/badge.svg)](https://github.com/thulin82/football-data/actions/workflows/ci.yml)

Server-rendered Express + Handlebars app on top of the
[football-data.org](https://www.football-data.org/) API, written in TypeScript.

## Setup

### Get project

```
$ git clone git@github.com:thulin82/football-data.git
```

### Get dependencies

```
$ npm install
```

### Environment variables

In `config/config.env` add

```
API_KEY =
```

Optional:

```
PORT = (default 4567)
NODE_ENV = FOOTBALL_API_BASE_URL(default `https://api.football-data.org/v2`)
```

### Run app

```
$ npm run dev     # watch mode via tsx
$ npm run build   # compile to dist/
$ npm start       # run the compiled app
```

## Project structure

Layer-based, with tests co-located next to the code they cover.

```
src/
  server.ts                       bootstrap: load env, start listening
  app.ts                          createApp() - wiring only, no side effects
  config/env.ts                   zod-validated environment
  models/football.ts              API response types
  services/footballDataClient.ts  HTTP client (auth, error mapping)
  services/footballService.ts     business logic
  controllers/                    request/response handling
  routes/index.ts                 route table
  middleware/                     asyncHandler, error handler
  utils/errorResponse.ts          HTTP-aware error
views/                            Handlebars templates
```

## Quality checks

```
$ npm run lint
$ npm run typecheck
$ npm test          # npm run test:watch during development
$ npm run test:ci   # with coverage + junit report
$ npm run format
```

Unit tests mock the layer below (controllers mock the service, the service mocks the
HTTP client), and `src/app.test.ts` drives the real routes and views through supertest.
The same checks run in CI on every push and pull request.

© Markus Thulin 2019-
