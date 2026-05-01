import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createUserSchema = z.object({});

export class CreateUserDto extends createZodDto(createUserSchema) {}
