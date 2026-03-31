import { z } from 'zod';

export const bodySchema = z.object({
  name: z.string('Name is required'),
  age: z.number('Age is required'),
  address: z.object(
    {
      city: z.string('City is required'),
      street: z.string('Street is required'),
    },
    'Address is required',
  ),
});

export const querySchema = z.object({
  search: z.string('Search is required'),
  page: z.coerce.number('Page is required'),
});

export const paramsSchema = z.object({
  id: z.string('ID is required'),
});
