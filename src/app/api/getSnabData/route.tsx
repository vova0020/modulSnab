import { NextRequest, NextResponse } from "next/server";
import prismaInteraction from '@/api/prisma';

const prisma = new prismaInteraction();

// GET-запрос для получения данных
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const requestId = searchParams.get("requestId");

        if (!requestId) {
            return NextResponse.json({ message: 'requestId не указан' }, { status: 400 });
        }

        const newOrder = await prisma.getRequestSnabData(Number(requestId));

        return NextResponse.json(newOrder, { status: 200 });
    } catch (error) {
        console.error('Ошибка при запросе данных о заявке:', error);
        return NextResponse.json({ message: 'Ошибка при запросе данных о заявке' }, { status: 500 });
    }
}

// PUT-запрос для обновления данных
export async function PUT(req: NextRequest) {
    try {
        const { id, statusPut } = await req.json(); // Извлекаем id, field и value из тела запроса
        // console.log(id);
        // console.log(statusPut);
        
        // Обновляем запись в базе данных с помощью Prisma
        const updatedStatus = await prisma.putRequestSnabData(id, statusPut);

        return NextResponse.json(updatedStatus, { status: 200 });
    } catch (error) {
        console.error('Ошибка при обновлении Заявки:', error);
        return NextResponse.json({ message: 'Ошибка при обновлении Заявки' }, { status: 500 });
    }
}
