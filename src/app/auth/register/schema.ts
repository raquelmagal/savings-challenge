import { z } from 'zod';

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'O nome é obrigatório'),
  email: z
    .string()
    .min(1, 'O e-mail é obrigatório')
    .email('Digite um e-mail válido'),
  password: z
    .string()
    .min(1, 'A senha é obrigatória')
    .min(6, 'A senha deve ter no mínimo 6 caracteres')
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      'A senha deve conter pelo menos 1 caractere especial'
    )
});

export type RegisterSchema = z.infer<typeof registerSchema>;