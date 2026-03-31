import { RequestHandler } from 'express';
import { z, ZodError } from 'zod';
import mapZodErrors from './zodMap';

type SchemaConfig = {
  body?: z.ZodTypeAny;
  query?: z.ZodTypeAny;
  params?: z.ZodTypeAny;
};

// 🔥 format errors
const formatZodErrors = (error: ZodError) => {
  const formatted = mapZodErrors(error.issues);

  return formatted;
};

export const validateRequest = (schemas: SchemaConfig): RequestHandler => {
  return async (req, res, next) => {
    try {
      const errors: Record<string, unknown> = {};

      if (schemas.body) {
        try {
          await schemas.body.parseAsync(req.body);
        } catch (e) {
          if (e instanceof ZodError) errors.body = formatZodErrors(e);
        }
      }

      if (schemas.query) {
        try {
          await schemas.query.parseAsync(req.query);
        } catch (e) {
          if (e instanceof ZodError) errors.query = formatZodErrors(e);
        }
      }

      if (schemas.params) {
        try {
          await schemas.params.parseAsync(req.params);
        } catch (e) {
          if (e instanceof ZodError) errors.params = formatZodErrors(e);
        }
      }

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({
          error: 'Validation failed',
          errors,
        });
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};
