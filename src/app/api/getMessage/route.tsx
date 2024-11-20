import { NextRequest, NextResponse } from "next/server";
import prismaInteraction from '@/api/prisma';

const prisma = new prismaInteraction();

// GET-запрос для получения данных
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const requestId = searchParams.get("requestId");
        // console.log(requestId);
        

        if (!requestId) {
            return NextResponse.json({ message: 'requestId не указан' }, { status: 400 });
        }

        const newOrder = await prisma.getMessage(Number(requestId));

        return NextResponse.json(newOrder, { status: 200 });
    } catch (error) {
        console.error('Ошибка при запросе данных о заявке:', error);
        return NextResponse.json({ message: 'Ошибка при запросе данных о заявке' }, { status: 500 });
    }
}