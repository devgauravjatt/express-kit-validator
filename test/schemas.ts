import { z } from 'zod'

export const bodySchema = z.object({
	name: z.string(),
	age: z.number(),
})

export const querySchema = z.object({
	search: z.string(),
	page: z.coerce.number(),
})

export const paramsSchema = z.object({
	id: z.string(),
})
