import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'UserId é obrigatório' },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);

    return NextResponse.json(user.qtdNumbers);

  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar quantidade' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();

    const { qtdNumbers, userId } = body;

    if (!userId || !qtdNumbers) {
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

    user.qtdNumbers = qtdNumbers;

    const updatedUser = await user.save();

    return NextResponse.json(updatedUser);

  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao salvar quantidade', details: error },
      { status: 500 }
    );
  }
}