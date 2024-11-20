import { NextRequest, NextResponse } from "next/server";
import prismaInteraction from '@/api/prisma';

const prisma = new prismaInteraction();

// PUT-запрос для обновления данных
export async function PUT(req: NextRequest) {
    try {
        const { item, status} = await req.json(); // Извлекаем id, field и value из тела запроса
       
        // console.log(statusPut);
        
        // Обновляем запись в базе данных с помощью Prisma
        const updatedStatus = await prisma.blokAplicationTable(item, status);

        return NextResponse.json(updatedStatus, { status: 200 });
    } catch (error) {
        console.error('Ошибка при обновлении Заявки:', error);
        return NextResponse.json({ message: 'Ошибка при обновлении Заявки' }, { status: 500 });
    }
}