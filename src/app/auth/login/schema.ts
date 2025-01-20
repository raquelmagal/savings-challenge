import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'O e-mail é obrigatório')
    .email('Digite um e-mail válido'),
  password: z
    .string()
    .min(1, 'A senha é obrigatória')
});

export type LoginSchema = z.infer<typeof loginSchema>;