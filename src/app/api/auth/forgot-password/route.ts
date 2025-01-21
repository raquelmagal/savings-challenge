import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, newPassword } = await request.json();

    if (!email || !newPassword) {
      return NextResponse.json(
        { message: 'Preencha todos os campos, por favor.' },
        { status: 400 }
      );
    }
    
    await dbConnect();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.updateOne(
      { email },
      { password: hashedPassword }
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