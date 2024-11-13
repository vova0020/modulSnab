// aplicationsTable.ts

import { NextRequest, NextResponse } from "next/server";
import prismaInteraction from '@/api/prisma';

export const dynamic = 'force-dynamic'; // Указывает Next.js использовать динамическую обработку

const prisma = new prismaInteraction();

// GET-запрос для получения данных
export async function GET() {
    try {
        const newOrder = await prisma.getRequest();

        

        return NextResponse.json(newOrder, { status: 200 });
    } catch (error) {
        console.error('Ошибка при создании Заявки:', error);
        return NextResponse.json({ message: 'Ошибка при создании Заявки' }, { status: 500 });
    }
}

// PUT-запрос для обновления данных
export async function PUT(req: NextRequest) {
    try {
        const { requestId, status, etap, items } = await req.json();
        console.log(requestId);
        
        const id = requestId
        const updatedOrder = await prisma.updateRequest(id, status, etap, items);

        return NextResponse.json(updatedOrder, { status: 200 });
    } catch (error) {
        console.error('Ошибка при обновлении Заявки:', error);
        return NextResponse.json({ message: 'Ошибка при обновлении Заявки' }, { status: 500 });
    }
}
