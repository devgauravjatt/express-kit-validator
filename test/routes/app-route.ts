import express from 'express';
import { bodySchema, paramsSchema, querySchema } from '../schemas';
import { appRoute } from '@express-kit/validator';

const appRouteRouter = express.Router();

// 1️⃣ BODY ONLY
appRouteRouter.post(
  '/body',
  appRoute({ body: bodySchema })((req, res) => {
    return res.json({
      type: 'body',
      data: req.body,
    });
  }),
);

// 2️⃣ QUERY ONLY
appRouteRouter.get(
  '/query',
  appRoute({ query: querySchema })((req, res) => {
    return res.json({
      type: 'query',
      data: req.query,
    });
  }),
);

// 3️⃣ PARAMS ONLY
appRouteRouter.get(
  '/params/:id',
  appRoute({ params: paramsSchema })((req, res) => {
    res.json({
      type: 'params',
      data: req.params,
    });
  }),
);

// 4️⃣ MIXED
appRouteRouter.post(
  '/mix/:id',
  appRoute({
    body: bodySchema,
    query: querySchema,
    params: paramsSchema,
  })((req, res) => {
    res.json({
      type: 'mixed',
      body: req.body,
      query: req.query,
      params: req.params,
    });
  }),
);

export default appRouteRouter;
