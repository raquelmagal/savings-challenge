import { z } from 'zod';

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(1, 'A senha atual é obrigatória'),
  confirmPassword: z
    .string()
    .min(1, 'A nova senha é obrigatória')
    .min(6, 'A senha deve ter no mínimo 6 caracteres')
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      'A senha deve conter pelo menos 1 caractere especial'
    )
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não correspondem',
  path: ['confirmPassword'],
});

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;