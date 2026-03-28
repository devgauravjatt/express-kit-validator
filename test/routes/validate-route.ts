import express from 'express'
import { bodySchema, paramsSchema, querySchema } from '../schemas'
import z from 'zod'
import { validateRequest } from '@express-kit/validator'

const validateRequestRouter = express.Router()

// 1️⃣ BODY ONLY
validateRequestRouter.post('/body', validateRequest({ body: bodySchema }), (req, res) => {
	const body = req.body as z.infer<typeof bodySchema>
	return res.json({
		type: 'body',
		data: body,
	})
})

// 2️⃣ QUERY ONLY
validateRequestRouter.get(
	'/query',
	validateRequest({ query: querySchema }),
	(req, res) => {
		const query = req.query as unknown as z.infer<typeof querySchema>
		return res.json({
			type: 'query',
			data: query,
		})
	},
)

// 3️⃣ PARAMS ONLY
validateRequestRouter.get(
	'/params/:id',
	validateRequest({ params: paramsSchema }),
	(req, res) => {
		const params = req.params as z.infer<typeof paramsSchema>
		return res.json({
			type: 'params',
			data: params,
		})
	},
)

// 4️⃣ MIXED
validateRequestRouter.post(
	'/mix/:id',
	validateRequest({
		body: bodySchema,
		query: querySchema,
		params: paramsSchema,
	}),
	(req, res) => {
		const body = req.body as z.infer<typeof bodySchema>
		const query = req.query as unknown as z.infer<typeof querySchema>
		const params = req.params as z.infer<typeof paramsSchema>
		return res.json({
			type: 'mixed',
			body: body,
			query: query,
			params: params,
		})
	},
)

export default validateRequestRouter
