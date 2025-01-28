import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';
import crypto from 'crypto';
import { sendResetPasswordEmail } from '@/utils/mail/sendMail';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { email } = await request.json();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: 'Email não encontrado' },
        { status: 404 }
      );
    }

    const resetToken = crypto.randomBytes(32).toString('hex');

    await User.updateOne(
      { email },
      { 
        resetToken,
        resetTokenExpiry: new Date(Date.now() + 3600000) // 1 hora
      }
    );

    await sendResetPasswordEmail(user, resetToken);

    return NextResponse.json({ 
      success: true,
      message: 'Email de recuperação enviado com sucesso!'
    });
  } catch (error) {
    console.error('Erro:', error);
    return NextResponse.json(
      { error: 'Falha ao processar recuperação de senha' },
      { status: 500 }
    );
  }
}