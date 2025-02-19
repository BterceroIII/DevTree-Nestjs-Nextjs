import { z } from 'zod';

export const configValidationSchema = z.object({
  POSTGRES_HOST: z
    .string({
      required_error: 'POSTGRES_HOST is required',
      invalid_type_error: 'POSTGRES_HOST must be a string',
    })
    .min(1, { message: 'POSTGRES_HOST is required' }),
  POSTGRES_PORT: z
    .string({
      required_error: 'POSTGRES_PORT is required',
      invalid_type_error: 'POSTGRES_PORT must be a string',
    })
    .regex(/^\d+$/, { message: 'POSTGRES_PORT must be a number' })
    .transform((value) => parseInt(value, 10))
    .refine((value) => value > 0 && value < 65536, {
      message: 'POSTGRES_PORT must be a valid port number',
    }),
  POSTGRES_USER: z
    .string({
      required_error: 'POSTGRES_USER is required',
      invalid_type_error: 'POSTGRES_USER must be a string',
    })
    .min(1, { message: 'POSTGRES_USER is required' }),
  POSTGRES_PASSWORD: z
    .string({
      required_error: 'POSTGRES_PASSWORD is required',
      invalid_type_error: 'POSTGRES_PASSWORD must be a string',
    })
    .min(1, { message: 'POSTGRES_PASSWORD is required' }),
  POSTGRES_DB: z
    .string({
      required_error: 'POSTGRES_DB is required',
      invalid_type_error: 'POSTGRES_DB must be a string',
    })
    .min(1, { message: 'POSTGRES_DB is required' }),
  NODE_ENV: z
    .string({
      required_error: 'NODE_ENV is required',
      invalid_type_error: 'NODE_ENV must be a string',
    })
    .min(1, { message: 'NODE_ENV is required' }),
});
