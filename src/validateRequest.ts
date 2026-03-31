import { RequestHandler } from 'express';
import { z, ZodError } from 'zod';

type SchemaConfig = {
  body?: z.ZodTypeAny;
  query?: z.ZodTypeAny;
  params?: z.ZodTypeAny;
};

const formatZodErrors = (error: ZodError) => {
  const formatted: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const key = issue.path.join('.') || 'root';
    if (!formatted[key]) formatted[key] = [];
    formatted[key].push(issue.message);
  }

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
          message: 'Validation failed',
          errors,
        });
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};
