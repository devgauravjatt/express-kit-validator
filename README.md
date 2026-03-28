# @express-kit/validator

A lightning-fast, express validator using [Zod](https://zod.dev/) for body, query, and params validation. It provides full TypeScript support with automatic type inference for your request handlers.

## Features

- ✅ **Automatic Type Inference**: `appRoute` automatically infers types for `req.body`, `req.query`, and `req.params`.
- ✅ **Zod-Powered**: Leverage the full power of Zod for schema validation.
- ✅ **Structured Error Responses**: Returns clear, detailed error messages for validation failures.
- ✅ **Lightweight**: Zero dependencies other than Zod and Express types.
- ✅ **Flexible**: Use as a route wrapper (`appRoute`) or as standard middleware (`validateRequest`).

## Installation

```bash
npm install @express-kit/validator zod
```

## Quick Start

### 1. Using `appRoute` (Recommended)

`appRoute` is a higher-order function that wraps your request handler. It validates the request and provides **full type inference** for `req.body`, `req.query`, and `req.params`.

```typescript
import express from 'express';
import { z } from 'zod';
import { appRoute } from '@express-kit/validator';

const app = express();
app.use(express.json());

const userSchema = {
  body: z.object({
    name: z.string().min(2),
    age: z.number().int().positive(),
  }),
  query: z.object({
    role: z.enum(['admin', 'user']).optional(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
};

app.post(
  '/users/:id',
  appRoute(userSchema)((req, res) => {
    // req.body, req.query, and req.params are fully typed!
    const { name, age } = req.body;
    const { id } = req.params;
    const { role } = req.query;

    res.json({ message: `User ${name} (ID: ${id}) created with role: ${role}` });
  }),
);

app.listen(3000);
```

### 2. Using `validateRequest` (Middleware)

If you prefer using standard Express middleware, you can use `validateRequest`.

```typescript
import { validateRequest } from '@express-kit/validator';

const schema = {
  body: z.object({
    email: z.string().email(),
  }),
};

app.post('/login', validateRequest(schema), (req, res) => {
  // Manual type casting might be needed here for full TS support
  res.json({ message: 'Valid request!' });
});
```

## Validation Error Format

When validation fails, `@express-kit/validator` returns a `400 Bad Request` with a structured JSON response:

```json
{
  "message": "Validation failed",
  "errors": {
    "body": {
      "email": ["Invalid email format"],
      "age": ["Required"]
    },
    "query": {
      "page": ["Expected number, received string"]
    }
  }
}
```

## API

### `appRoute(schemas)`

Wraps an Express request handler.

- `schemas`: An object containing Zod schemas for `body`, `query`, and `params`.
- Returns a function that accepts your request handler and returns a standard Express `RequestHandler`.

### `validateRequest(schemas)`

A standard Express middleware.

- `schemas`: An object containing Zod schemas for `body`, `query`, and `params`.
- Returns a standard Express `RequestHandler`.

## License

MIT
