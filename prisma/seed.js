/* eslint-disable */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    const adminLogin = 'Admin';
    const existingAdmin = await prisma.user.findUnique({
        where: { login: adminLogin },
    });

    if (!existingAdmin) {
        const adminPassword = await bcrypt.hash('Admin311', 10);

        await prisma.user.create({
            data: {
                login: adminLogin,
                firstName: 'Admin',
                password: adminPassword,
                role: 'Руководство',
       
            },
        });
        console.log('Администратор создан.');
    } else {
        console.log('Учетная запись администратора уже существует.');
    }
// Словарь статусов
  // 'Новая'
  'Согласование к закупке'
  'Согласован к закупке'
  'В работе'
  'Согласование к оплате'
  'Согласован к оплате'
  'Оплачен'
  'Доставка'
  'Завершен'
  'На уточнении'
  'Не согласовано'
  'Отложено' 
    // Добавление статусов
    const statuses = ['Новая','Согласование к закупке',  'Согласован к закупке',  'В работе',  'Согласование к оплате',  'Согласован к оплате',
  'Оплачен',  'Доставка',  'Завершен',  'На уточнении',  'Не согласовано',  'Отложено' ,];
    
    for (const statusName of statuses) {
        // const existingStatus = await prisma.status.findUnique({
        //     where: { name: statusName },
        // });

        // if (!existingStatus) {
            await prisma.status.create({
                data: { name: statusName },
            });
            console.log(`Статус '${statusName}' создан.`);
        // } else {
        //     console.log(`Статус '${statusName}' уже существует.`);
        // }
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
