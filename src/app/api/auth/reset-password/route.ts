import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { password, confirmPassword, token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { message: 'Token inválido ou expirado' },
        { status: 400 }
      );
    }

    if (!password || !confirmPassword) {
      return NextResponse.json(
        { message: 'Preencha todos os campos, por favor.' },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() } // Verify if the token is not expired
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Token inválido ou expirado' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(confirmPassword, 10);

    await User.updateOne(
      { _id: user._id },
      {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    );

    return NextResponse.json(
      { message: 'Senha atualizada com sucesso' },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao atualizar senha' },
      { status: 500 }
    );
  }
}