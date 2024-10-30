import { NextRequest, NextResponse } from "next/server";
import prismaInteraction from '@/api/prisma';

const prisma = new prismaInteraction();


export async function GET() {
 
    try {
        // const data = await req.json(); // Парсинг тела запроса
        const newOrder = await prisma.getLastRequestId();
        console.log(newOrder);
        
        return NextResponse.json(newOrder, { status: 201 });
    } catch (error) {
        console.error('Ошибка при создании Заявки:', error);
        return NextResponse.json({ message: 'Ошибка при создании Заявки' }, { status: 500 });
    }
}
export async function POST(req: NextRequest) {
 
    try {
        const data = await req.json(); // Парсинг тела запроса
        const newOrder = await prisma.createRequest(data);
        // console.log(data);
        
        return NextResponse.json(newOrder, { status: 201 });
    } catch (error) {
        console.error('Ошибка при создании Заявки:', error);
        return NextResponse.json({ message: 'Ошибка при создании Заявки' }, { status: 500 });
    }
}
