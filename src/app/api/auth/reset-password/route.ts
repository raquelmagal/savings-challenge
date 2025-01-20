import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password, newPassword } = await request.json();

    if (!email || !password || !newPassword) {
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

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Senha atual incorreta' },
        { status: 400 }
      );
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    
    if (isSamePassword) {
      return NextResponse.json(
        { message: 'A nova senha deve ser diferente da senha atual' },
        { status: 400 }
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