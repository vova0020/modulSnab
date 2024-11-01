// aplicationsTable.ts

import { NextRequest, NextResponse } from "next/server";
import prismaInteraction from '@/api/prisma';

export const dynamic = 'force-dynamic'; // Указывает Next.js использовать динамическую обработку

const prisma = new prismaInteraction();

// GET-запрос для получения данных
export async function GET() {
    try {
        const newOrder = await prisma.getRequest();

        const transformedData = newOrder.map(request => ({
            id: request.id,
            date: request.date,
            orderReason: `${request.orderReason}. ${request.subOrderReason}`,
            invoiceNumber: request.invoiceNumber,
            status: request.status.name,
            approvedForPurchase: request.approvedForPurchase,
            approvedForPayment: request.approvedForPayment,
            creator: `${request.creator.firstName} ${request.creator.lastName}`,
            itemsId: request.items.map(item => item.id),
            itemsName: request.items.map(item => item.item),
            itemsQuantity: request.items.map(item => item.quantity),
            itemsAmount: request.items.map(item => item.amount),
        }));

        return NextResponse.json(transformedData, {
            status: 200,
            headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' },
        });
    } catch (error) {
        console.error('Ошибка при создании Заявки:', error);
        return NextResponse.json({ message: 'Ошибка при создании Заявки' }, { status: 500 });
    }
}

// PUT-запрос для обновления данных
export async function PUT(req: NextRequest) {
    try {
        const { id, field, value } = await req.json();

        const updatedOrder = await prisma.updateRequest(id, { [field]: value });

        return NextResponse.json(updatedOrder, {
            status: 200,
            headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' },
        });
    } catch (error) {
        console.error('Ошибка при обновлении Заявки:', error);
        return NextResponse.json({ message: 'Ошибка при обновлении Заявки' }, { status: 500 });
    }
}
