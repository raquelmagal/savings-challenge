import { z } from 'zod';

export const changePasswordSchema = z.object({
  password: z
    .string()
    .min(1, 'A senha atual é obrigatória'),
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

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;