# Exchanger

## Before first run

1. Ensure you have installed:

```
node: ">=18.16.1",
yarn": ">=1.22.10"
```

2. Copy the `.env.local.example` file to `.env.local` and fill in the required variables with the appropriate values.

3. Install dependencies by running `yarn`

## Getting Started

To start the development server, run:

```
yarn dev
```

To run the tests:

```
yarn test
```

## Description

- The application is based on Next.js, allowing us to fetch data with a private key on the server side, thus not exposing it to the client
- We use the zod library for data validation to ensure the correct shapes of the response, rather than relying on type casting
- Fetch functions return discriminated union types, which helps in proper error handling on the UI
- Tests have been added for the most crucial parts of the app, such as fetch functions and the calculator component
- User input is debounced to prevent unnecessary additional requests to the API
- I've moved finally some logic from Calculator component to hook and wrote tests for that hook
