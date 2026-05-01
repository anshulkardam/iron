import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createAuthSchema = z.object({});

export class CreateAuthDto extends createZodDto(createAuthSchema) {}
