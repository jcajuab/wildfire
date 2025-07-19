# `@wildfire/zod-schemas`

## Usage

This package contains Zod schemas shared across both the `@wildfire/api` and `@wildfire/web` components of WILDFIRE. These schemas promote consistency throughout the application. On the `@wildfire/api` side, they are used to validate incoming HTTP request data, while on the `@wildfire/web` side, they assist with tasks such as form validation.

Schemas that are specific to either the `@wildfire/api` or the `@wildfire/web` should reside exclusively within their respective codebases.
