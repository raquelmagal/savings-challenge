import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Preencha todos os campos, por favor.' },
        { status: 400 }
      );
    }
    
    await dbConnect();

    const userExists = await User.findOne({ email });

    if (userExists) {
      return NextResponse.json(
        { message: 'Usuário já existe' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    return NextResponse.json(
      { user, message: 'Usuário criado com sucesso' },
      { status: 201 },
    );

  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao criar usuário' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await dbConnect();

    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { message: 'Usuário não encontrado' },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { message: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    await User.deleteOne({ _id: userId });

    return NextResponse.json({ message: 'Usuário deletado com sucesso' });

  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao deletar usuário' },
      { status: 500 }
    );
  }
}