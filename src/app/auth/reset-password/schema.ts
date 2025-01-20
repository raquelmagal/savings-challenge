import { z } from 'zod';

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'O e-mail é obrigatório')
    .email('Digite um e-mail válido'),
  password: z
    .string()
    .min(1, 'A senha é obrigatória'),
  newPassword: z
    .string()
    .min(1, 'A nova senha é obrigatória')
    .min(6, 'A senha deve ter no mínimo 6 caracteres')
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      'A senha deve conter pelo menos 1 caractere especial'
    )
}).refine((data) => data.password !== data.newPassword, {
  message: 'A nova senha deve ser diferente da senha atual',
  path: ['newPassword'],
});

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
