// oxlint-disable typescript/no-empty-object-type
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { z, ZodError } from 'zod';

type SchemaConfig = {
  body?: z.ZodTypeAny;
  query?: z.ZodTypeAny;
  params?: z.ZodTypeAny;
};

// 🔥 infer request types
type TypedRequest<T extends SchemaConfig> = Request<
  T['params'] extends z.ZodTypeAny ? z.infer<T['params']> : {},
  any,
  T['body'] extends z.ZodTypeAny ? z.infer<T['body']> : {},
  T['query'] extends z.ZodTypeAny ? z.infer<T['query']> : {}
>;

// 🔥 format errors
const formatZodErrors = (error: ZodError) => {
  const formatted: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const key = issue.path.join('.') || 'root';
    if (!formatted[key]) formatted[key] = [];
    formatted[key].push(issue.message);
  }

  return formatted;
};

export const appRoute =
  <T extends SchemaConfig>(schemas: T) =>
  (handler: (req: TypedRequest<T>, res: Response, next: NextFunction) => unknown): RequestHandler =>
  async (req, res, next) => {
    try {
      const errors: Record<string, unknown> = {};

      // ✅ BODY
      if (schemas.body) {
        try {
          req.body = await schemas.body.parseAsync(req.body);
        } catch (e) {
          if (e instanceof ZodError) errors.body = formatZodErrors(e);
        }
      }

      // ✅ QUERY
      if (schemas.query) {
        try {
          const parsed = await schemas.query.parseAsync(req.query);
          Object.assign(req.query, parsed); // safe merge
        } catch (e) {
          if (e instanceof ZodError) errors.query = formatZodErrors(e);
        }
      }

      // ✅ PARAMS
      if (schemas.params) {
        try {
          //@ts-expect-error: params is not typed
          req.params = await schemas.params.parseAsync(req.params);
        } catch (e) {
          if (e instanceof ZodError) errors.params = formatZodErrors(e);
        }
      }

      // 🔥 return structured errors
      if (Object.keys(errors).length > 0) {
        return res.status(400).json({
          message: 'Validation failed',
          errors,
        });
      }

      return handler(req as TypedRequest<T>, res, next);
    } catch (err) {
      next(err);
    }
  };
