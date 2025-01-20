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
        { message: 'Usuário não encontrado' },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);

    return NextResponse.json({
      selected_numbers: user.selected_numbers,
      qtdNumbers: user.qtdNumbers
    });

  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao buscar números' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();

    const { number, userId } = body;

    if (!userId || !number) {
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

    const newNumber = {
      number: number,
      selected_at: new Date()
    };

    user.selected_numbers.push(newNumber);

    const updatedUser = await user.save();

    return NextResponse.json(updatedUser);

  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao salvar número', details: error },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await dbConnect();

    const { number, userId } = await request.json();

    if (!userId || !number) {
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

    user.selected_numbers = user.selected_numbers.filter(
      (n: any) => n.number !== number
    );

    const updatedUser = await user.save();

    return NextResponse.json(updatedUser);

  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao remover número' },
      { status: 500 }
    );
  }
}