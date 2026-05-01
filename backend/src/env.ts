import 'dotenv/config';
import z from 'zod';

const envSchema = z.object({
  DB_URL: z.string(),
  DB_SSL: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
  PORT: z.coerce.number(),
});

export type Env = z.infer<typeof envSchema>;

export const env = envSchema.parse(process.env);
