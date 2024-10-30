import { NextRequest, NextResponse } from "next/server";
import prismaInteraction from '@/api/prisma';

const prisma = new prismaInteraction();


export async function PUT(req: NextRequest) {
    try {
        const updateData = await req.json(); // Извлекаем id, field и value из тела запроса


        
        // Обновляем запись в базе данных с помощью Prisma
        const updatedOrder = await prisma.updateTable( updateData);

        return NextResponse.json(updatedOrder, { status: 200 });
    } catch (error) {
        console.error('Ошибка при обновлении Данных:', error);
        return NextResponse.json({ message: 'Ошибка при обновлении Данных' }, { status: 500 });
    }
}