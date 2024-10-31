/* eslint-disable */


import { PrismaClient } from '@prisma/client';
// import { NextApiRequest, NextApiResponse } from 'next';
const prisma = new PrismaClient();


export default class prismaInteraction {


  // Словарь статусов
  // 'Новая'
  // 'Согласование к закупке'
  // 'Согласован к закупке'
  // 'В работе'
  // 'Согласование к оплате'
  // 'Согласован к оплате'
  // 'Оплачен'
  // 'Доставка'
  // 'Завершен'
  // 'На уточнении'
  // 'Не согласовано'
  // 'Отложено' 


  async getLastRequestId() {
    // Для создания заявки получаем последний id и обновляем номер заявки
    try {
      const lastRequest = await prisma.request.findFirst({
        orderBy: {
          id: 'desc',
        },
        select: {
          id: true,
        },
      });

      if (lastRequest) {
        console.log('Последний ID записи:', lastRequest.id);
        return lastRequest.id;
      } else {
        console.log('Записей нет');
        return null;
      }
    } catch (error) {
      console.error('Ошибка при получении последнего ID записи:', error);
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  }

  async getOtdels() {
    // Для создания заявки получаем последний id и обновляем номер заявки
    try {
      const lastOtdel = await prisma.otdel.findMany();
      return lastOtdel;
    } catch (error) {
      console.error('Ошибка при получении списка отделов:', error);
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  }
  async getSectors() {
    // Для создания заявки получаем последний id и обновляем номер заявки
    try {
      const lastSector = await prisma.sector.findMany();
      return lastSector;
    } catch (error) {
      console.error('Ошибка при получении списка участков:', error);
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  }



  // Создание заявки
  async createRequest(data: {
    purpose: string;
    subPurpose: string;
    comment: string;
    urgency: string;
    department: number;
    section: number;
    fullName: string;
    description: string;
    quantity: number;
    unitMeasurement: string;
    items: {
      item: string;
      quantity: number;
      supplierName1C: string;
      supplierName: string;
      unitMeasurement: string;
      amount: number;
      deliveryDeadline?: Date;
    }[];
    orders?: Array<{ // Уточненное определение типа orders как массива объектов
      description: string;
      unitMeasurement: string;
      quantity: number;
    }>;
  }) {
    console.log(data);
    try {
      if (data.orders && data.orders.length > 0) {
        const requestData = await prisma.request.create({
          data: {
            orderReason: data.purpose,
            subOrderReason: data.subPurpose,
            comment: data.comment,
            promptness: data.urgency,
            otdel: { connect: { id: data.department } },
            sector: { connect: { id: data.section } },
            status: { connect: { id: 2 } },
            creator: { connect: { id: data.fullName as unknown as number } },
            items: {
              create: data.orders.map(item => ({
                item: item.description,
                quantity: item.quantity,
                unitMeasurement: item.unitMeasurement,
              })),
            },
          },
        });
        return requestData;
      } else {
        const requestData = await prisma.request.create({
          data: {
            orderReason: data.purpose,
            subOrderReason: data.subPurpose,
            comment: data.comment,
            promptness: data.urgency,
            otdel: { connect: { id: data.department } },
            sector: { connect: { id: data.section } },
            status: { connect: { id: 2 } },
            creator: { connect: { id: data.fullName as unknown as number } },
            items: {
              create: {
                item: data.description,
                quantity: data.quantity,
                unitMeasurement: data.unitMeasurement,
              },
            },
          },
        });
        return requestData;
      }
    } catch (error) {
      console.error("Error creating request with relations:", error);
    } finally {
      await prisma.$disconnect();
    }
  }



  async getRequest() {
    try {
      const requestData = await prisma.request.findMany({
        where: {
          OR: [
            { approvedForPurchase: false }, // Условие для approvedForPurchase равного false (Согласование к закупке)
            { approvedForPayment: false },  // Условие для approvedForPayment равного false (Согласование к оплате)
            { statusId: { in: [2, 5, 12] } }
          ],
        },
        select: {
          id: true,
          date: true,
          orderReason: true,
          subOrderReason: true,
          invoiceNumber: true,
          approvedForPurchase: true,
          approvedForPayment: true,
          creator: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          items: {
            select: {
              id: true,
              item: true,
              quantity: true,
              amount: true,
            },
          },
          status: {
            select: {
              // id: true,
              name: true,
            },
          },
        },
      });
      // console.log(JSON.stringify(requestData, null, 2));

      return requestData;
    } catch (error) {
      console.error('Ошибка при получении списка заявок:', error);
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  }

  async getRequestSnab() {
    try {
      const requestData = await prisma.request.findMany({
        where: {

          approvedForPurchase: true, // Условие для approvedForPurchase равного false (Согласование к закупке)

        },
        select: {
          id: true,
          date: true,
          status: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      // console.log(JSON.stringify(requestData, null, 2));

      return requestData;
    } catch (error) {
      console.error('Ошибка при получении списка заявок:', error);
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  }

  async getRequestSnabData(requestId: number) {
    try {
      console.log(requestId);

      const requestData = await prisma.request.findFirst({
        where: { id: requestId },
        include: {
          status: {
            select: {
              id: true,
              name: true,
            },
          },
          items: {
            select: {
              id: true,
              item: true,
              quantity: true,
              amount: true,
              unitMeasurement: true,
            },
          },
          creator: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          otdel: true,
          sector: true,

        },
      });

      return requestData;
    } catch (error) {
      console.error('Ошибка при получении списка заявок:', error);
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  }



  async getCabinet(requestId: number) {
    try {

        const requestData = await prisma.request.findMany({
          where: { creatorId: requestId },
          include: {
            status: {
              select: {
                id: true,
                name: true,
              },
            },
            // items: {
            //   select: {
            //     id: true,
            //     item: true,
            //     quantity: true,
            //     amount: true,
            //     unitMeasurement: true,
            //   },
            // },
            // creator: {
            //   select: {
            //     firstName: true,
            //     lastName: true,
            //   },
            // },
            // otdel: true,
            // sector: true,
  
          },
        })

      return requestData;
    } catch (error) {
      console.error("Ошибка при получении заявок пользователя:", error);
      throw error;
    } finally {
      await prisma.$disconnect();
    }

  }



  async putRequestSnabData(id: number, statusPut: number) {
    try {
      // console.log(requestId);

      const requestUpdate = await prisma.request.update({
        where: { id: Number(id) },
        data: {
          status: {
            connect: { id: statusPut } // Связываем новый статус с заявкой
          },
        },
      });


      return requestUpdate;
    } catch (error) {
      console.error('Ошибка при получении списка заявок:', error);
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  }
  async putRequestSnab(requestId: number, updatedData: number) {
    try {
      console.log(updatedData);

      const requestUpdate = await prisma.request.update({
        where: { id: Number(requestId) },
        data: {
          invoiceNumber: updatedData.invoiceNumber,
          additionalComment: updatedData.comment,
          status: {
            connect: { id: 5 } // Связываем статус (согласование к оплате) с заявкой
          },
        },
      });
      const requestUpdate2 = await prisma.requestItem.update({
        where: { id: Number(updatedData.itemsId) },
        data: {
          provider: updatedData.provider,
          supplierName1C: updatedData.itemName1C,
          supplierName: updatedData.itemNameProvider,
          amount: updatedData.amount,
          deliveryDeadline: new Date(updatedData.deliveryDate).toISOString()

        },
      });


      return requestUpdate;
    } catch (error) {
      console.error('Ошибка при получении списка заявок:', error);
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  }





  async updateRequest(id: number, data: any) {
    try {


      if (data.soglZakaz == 'Да') {
        const requestUpdate = await prisma.request.update({
          where: { id: Number(id) },
          data: {
            approvedForPurchase: true,
            status: {
              connect: { id: 3 } // Связываем новый статус с заявкой
            },
          },
        });
        return requestUpdate
      } else if (data.soglZakaz == 'Нет') {
        const requestUpdate = await prisma.request.update({
          where: { id: Number(id) },
          data: {
            // approvedForPurchase: true,
            status: {
              connect: { id: 11 } // Связываем новый статус с заявкой
            },
          },
        });
        return requestUpdate
      } else if (data.soglZakaz == 'Отложить') {
        const requestUpdate = await prisma.request.update({
          where: { id: Number(id) },
          data: {
            // approvedForPurchase: true,
            status: {
              connect: { id: 12 } // Связываем новый статус с заявкой
            },
          },
        });
        return requestUpdate
      }

      if (data.soglOplata == 'Да') {
        const requestUpdate = await prisma.request.update({
          where: { id: Number(id) },
          data: {
            approvedForPayment: true,
            status: {
              connect: { id: 6 } // Связываем новый статус с заявкой
            },
          },
        });
        return requestUpdate
      } else if (data.soglOplata == 'Нет') {
        const requestUpdate = await prisma.request.update({
          where: { id: Number(id) },
          data: {
            // approvedForPurchase: true,
            status: {
              connect: { id: 11 } // Связываем новый статус с заявкой
            },
          },
        });
      } else if (data.soglOplata == 'Отложить') {
        const requestUpdate = await prisma.request.update({
          where: { id: Number(id) },
          data: {
            // approvedForPurchase: true,
            status: {
              connect: { id: 12 } // Связываем новый статус с заявкой
            },
          },
        });
      }

      // Обновление itemsQuantity, invoiceNumber и itemsAmount при наличии в запросе
      if (data.itemsQuantity !== undefined) {
        const requestUpdate = await prisma.requestItem.update({
          where: { id: Number(data.itemsId) },
          data: {
            quantity: data.itemsQuantity[0],

          },
        });
        return requestUpdate;
      }
      if (data.invoiceNumber !== undefined) {
        const requestUpdate = await prisma.requestItem.update({
          where: { id: Number(data.itemsId) },
          data: {
            quantity: data.invoiceNumber[0],

          },
        });
        return requestUpdate;
      }
      if (data.itemsAmount !== undefined) {
        const requestUpdate = await prisma.requestItem.update({
          where: { id: Number(data.itemsId) },
          data: {
            quantity: data.itemsAmount[0],

          },
        });
        return requestUpdate;
      }

    } catch (error) {
      console.error("Ошибка при обновлении запроса:", error);
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  }



  async updateTable(data: any) {
    try {
      console.log(data);
      const requestUpdateRequest = await prisma.request.update({
        where: { id: Number(data.updateData.id) },
        data: {
          invoiceNumber: data.updateData.invoiceNumber

        },
      });


      // Обновление itemsQuantity, invoiceNumber и itemsAmount при наличии в запросе

      const requestUpdate = await prisma.requestItem.update({
        where: { id: Number(data.updateData.itemsId[0]) },
        data: {
          item: data.updateData.itemsName[0],
          quantity: data.updateData.itemsQuantity[0],
          amount: data.updateData.itemsAmount[0],

        },
      });
      return requestUpdate;



    } catch (error) {
      console.error("Ошибка при обновлении запроса:", error);
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  }


  async findUserByLogin(login: string) {
    return await prisma.user.findUnique({
      where: { login },
    });

  }

  async createUser(data: { firstName: string, lastName: string, login: string; password: string; role: string; }) {

    // Проверка, существует ли пользователь с таким логином
    const existingUser = await prisma.user.findUnique({
      where: { login: data.login }, // Проверяем по полю login
    });

    if (existingUser) {
      throw new Error('USER_EXISTS'); // Меняем текст ошибки на ключевое значение
    }

    // Сохранение нового пользователя
    const newUser = await prisma.user.create({
      data: {
        firstName: data.firstName, // Используем логин из переданных данных
        lastName: data.lastName, // Используем логин из переданных данных
        login: data.login, // Используем логин из переданных данных
        password: data.password, // Используем хэшированный пароль
        role: data.role, // Используем роль
      },
    });

    return newUser; // Возвращаем созданного пользователя
  }





















}    
