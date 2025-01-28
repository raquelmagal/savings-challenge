import { transporter } from './config';

type User = {
  email: string;
  name: string;
}

export async function sendResetPasswordEmail(user: User, resetToken: string) {
  try {
    await transporter.sendMail({
      from: '"Savings Challenge" <from@example.com>',
      to: user.email,
      subject: "Recuperação de Senha",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h1>Savings Challenge</h1>
          <h2>Recuperação de Senha</h2>
          <p>Olá <b>${user.name}</b>, você solicitou a recuperação de senha.</p>
          <p>Clique no link abaixo para criar uma nova senha:</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password/${resetToken}">
            Resetar minha senha
          </a>
          <p>Se você não solicitou esta recuperação, ignore este email.</p>
        </div>
      `
    });
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    throw new Error('Falha ao enviar email de recuperação');
  }
} 