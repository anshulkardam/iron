import { createZodDto } from 'nestjs-zod';
import { createAuthSchema } from './create-auth.dto';

export const updateAuthSchema = createAuthSchema.partial();

export class UpdateAuthDto extends createZodDto(updateAuthSchema) {}
