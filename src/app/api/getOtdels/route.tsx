// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { NextRequest, NextResponse } from "next/server";
import prismaInteraction from '@/api/prisma';

const prisma = new prismaInteraction();


export async function GET() {
 
    try {
        // const data = await req.json(); // Парсинг тела запроса
        const otdels = await prisma.getOtdels();
        // console.log(otdels);
        
        return NextResponse.json(otdels, { status: 201 });
    } catch (error) {
        console.error('Ошибка при получении Отделов:', error);
        return NextResponse.json({ message: 'Ошибка при получении Отделов' }, { status: 500 });
    }
}