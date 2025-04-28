import { NextRequest, NextResponse } from "next/server";
import prismaInteraction from '@/api/prisma';
import jwt from "jsonwebtoken";

const prisma = new prismaInteraction();

export async function GET(req: NextRequest) {
  try {
    // Проверка токена для авторизации
    const token = req.headers.get('Authorization')?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json({ message: "Требуется авторизация" }, { status: 401 });
    }
    
    // Верификация токена
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    
    // Проверка роли
    if (decoded.role !== 'Руководство') {
      return NextResponse.json({ message: "Недостаточно прав" }, { status: 403 });
    }
    
    // Получение списка пользователей
    const users = await prisma.getAllUsers();
    
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Ошибка при получении списка пользователей:", error);
    return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
  }
}
export async function POST(req: NextRequest) {
    try {
      // Проверка токена для авторизации
      const token = req.headers.get('Authorization')?.split(' ')[1];
      
      if (!token) {
        return NextResponse.json({ message: "Требуется авторизация" }, { status: 401 });
      }
      
      // Верификация токена
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      
      // Проверка роли
      if (decoded.role !== 'Руководство') {
        return NextResponse.json({ message: "Недостаточно прав" }, { status: 403 });
      }
      
      // Получение данных из запроса
      const { userId, newPassword } = await req.json();
      
      if (!userId || !newPassword) {
        return NextResponse.json({ message: "Не указан ID пользователя или новый пароль" }, { status: 400 });
      }
      
      // Обновление пароля
      const result = await prisma.updateUserPassword(userId, newPassword);
      
      return NextResponse.json(result, { status: 200 });
    } catch (error) {
      console.error("Ошибка при обновлении пароля:", error);
      return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
    }
  }