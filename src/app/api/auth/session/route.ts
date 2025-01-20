import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { User } from '@/models/User';
import dbConnect from '@/lib/db';

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET || 'secret') as { userId: string };
    
    await dbConnect();

    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return NextResponse.json(
        { message: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });

  } catch (error) {
    return NextResponse.json(
      { message: 'Não autorizado' },
      { status: 401 }
    );
  }
} 