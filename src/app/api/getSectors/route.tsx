// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { NextRequest, NextResponse } from "next/server";
import prismaInteraction from '@/api/prisma';

const prisma = new prismaInteraction();


export async function GET() {

    try {
        // const data = await req.json(); // Парсинг тела запроса
        const sectors = await prisma.getSectors();
        // console.log(sectors);

        return NextResponse.json(sectors, { status: 201 });
    } catch (error) {
        console.error('Ошибка при получении Отделов:', error);
        return NextResponse.json({ message: 'Ошибка при получении Отделов' }, { status: 500 });
    }
}
export async function POST(req: NextRequest) {

    try {
        const data = await req.json(); // Парсинг тела запроса
        const newOrder = await prisma.createSectors(data);
        // console.log(data);

        return NextResponse.json(newOrder, { status: 201 });
    } catch (error) {
        console.error('Ошибка при создании участка:', error);
        return NextResponse.json({ message: 'Ошибка при создании участка' }, { status: 500 });
    }
}