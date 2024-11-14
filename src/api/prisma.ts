/* eslint-disable */

// @ts-nocheck
import { PrismaClient } from '@prisma/client';

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
  async createOtdels(data: {
    name: string
  }) {
    // Для создания заявки получаем последний id и обновляем номер заявки
    console.log(data);

    try {
      const lastOtdel = await prisma.otdel.create({
        data: {
          name: data.name
        }
      });
      return lastOtdel;
    } catch (error) {
      console.error('Ошибка при создании отделоа:', error);
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
  async createSectors(data: {
    name: string
  }) {
    // Для создания заявки получаем последний id и обновляем номер заявки
    try {
      const lastSector = await prisma.sector.create({
        data: {
          name: data.name
        }
      });
      return lastSector;
    } catch (error) {
      console.error('Ошибка при создании участка:', error);
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  }
  async getMeasureUnit() {
    // Для создания заявки получаем последний id и обновляем номер заявки
    try {
      const lastSector = await prisma.measureUnit.findMany();
      return lastSector;
    } catch (error) {
      console.error('Ошибка при получении списка участков:', error);
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  }
  async createMeasureUnit(data: {
    name: string
  }) {
    // Для создания заявки получаем последний id и обновляем номер заявки
    try {
      const lastSector = await prisma.measureUnit.create({
        data: {
          name: data.name
        }
      });
      return lastSector;
    } catch (error) {
      console.error('Ошибка при создании участка:', error);
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
    // urgency: string;
    department: number;
    section: number;
    fullName: string;
    // description: string;
    // quantity: number;
    // unitMeasurement: string;
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
      urgency: string;
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
            // promptness: data.urgency,
            otdel: { connect: { id: data.department } },
            sector: { connect: { id: data.section } },

            creator: { connect: { id: data.fullName as unknown as number } },
            items: {
              create: data.orders.map(item => ({
                item: item.description,
                quantity: item.quantity,
                unitMeasurement: item.unitMeasurement,
                promptness: item.urgency,
                status: { connect: { id: 2 } },
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
            // promptness: data.urgency,
            otdel: { connect: { id: data.department } },
            sector: { connect: { id: data.section } },

            creator: { connect: { id: data.fullName as unknown as number } },
            items: {
              create: {
                item: data.description,
                quantity: data.quantity,
                unitMeasurement: data.unitMeasurement,
                promptness: data.urgency,
                status: { connect: { id: 2 } },
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


  // Получение заявок для согласования
  async getRequest() {

    try {
      const requestData = await prisma.request.findMany({
        where: {
          OR: [
            { approvedForPurchase: false }, // Условие для approvedForPurchase равного false (Согласование к закупке)
            { approvedForPayment: false },  // Условие для approvedForPayment равного false (Согласование к оплате)
            // { statusId: { in: [2, 5, 12] } }
          ],
        },

        include: {
          items: {
            include: {
              status: {
                select: {
                  id: true,
                  name: true,
                }
              }
            }
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
  //  получение заявок для снабжения
  async getRequestSnab() {
    try {
      const requestData = await prisma.request.findMany({
        where: {

          approvedForPurchase: true, // Условие для approvedForPurchase равного false (Согласование к закупке)

        },
        include: {
          items: {
            include: {
              status: {
                select: {
                  id: true,
                  name: true,
                }
              }
            }
          },
          status: {
            select: {
              id: true,
              name: true,
            }
          }
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
  // Запрос на получение заявки для окна работы у снабжения
  async getRequestSnabData(requestId: number) {
    try {
      console.log(requestId);

      const requestData = await prisma.request.findFirst({
        where: { id: requestId },
        include: {
          items: {
            include: { // Можно добавить include для получения связанных данных
              status: {
                select: {
                  id: true,
                  name: true,
                },
              },
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


  //  получение данных заявки в личном кабинете
  async getRequestAplicationCard(requestId: number) {
    try {
      console.log(requestId);

      const requestData = await prisma.request.findFirst({
        where: { id: requestId },
        include: {
          status: true,
          items: {
            include: {
              status: {
                select: {
                  id: true,
                  name: true,
                }
              }
            }
          },

        },
      });
      console.log(requestData);


      return requestData;
    } catch (error) {
      console.error('Ошибка при получении списка заявок:', error);
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  }
  // Внесение изменений в запись в личном кабинете
  async putRequestAplicationCard(applicationNumber: number, updatedData: any) {
    try {
      // Обновление статуса заявки
      const requestUpdate = await prisma.request.update({
        where: { id: Number(applicationNumber) },
        data: {
          comment: updatedData.comment,
          // promptness: updatedData.promptness,
        },
      });
      const updatedItems = updatedData.items.map((item) =>
        prisma.requestItem.update({
          where: { id: Number(item.id) },
          data: {
            item: item.item,
            quantity: item.quantity,
            unitMeasurement: item.unitMeasurement,
            promptness: item.promptness,
          },
        })
      );

      await Promise.all(updatedItems);
      return {
        requestUpdate,
      };
    } catch (error) {
      console.error('Ошибка при получении списка заявок:', error);
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  }
  // Внесение изменений в запись в личном кабинете
  async putAnswerAplicationCard(applicationNumber: number, answer: any, question: any, userId: number) {
    try {
      // Обновление коментария
        const сlarification = await prisma.clarificationResponse.create({

          data: {
            responseText: answer,
            clarification: {
              connect: { id: question.id },
            },
            user: {
              connect: { id: userId },
            },
          },
        });

      // Обновление статуса заявки
      const requestUpdate = await prisma.request.update({
        where: { id: Number(applicationNumber) },
        data: {
          status: {
            connect: { id: 1 }, // статус новая
          },
        },
      });
      // Получаем все RequestItem, связанные с запросом
      const requestItems = await prisma.requestItem.findMany({
        where: { requestId: Number(applicationNumber) },
      });

      // Обновляем поле status для каждого RequestItem в отдельном запросе
      await Promise.all(
        requestItems.map((item) =>
          prisma.requestItem.update({
            where: { id: item.id },
            data: {
              status: {
                connect: { id: 1 },
              },
            },
          })
        )
      );

    
      return {
        requestUpdate,
      };
    } catch (error) {
      console.error('Ошибка при получении списка заявок:', error);
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  }


  async getClarification(requestId: number) {
    try {
      // console.log(requestId);

      const requestData = await prisma.clarification.findFirst({
        where: { requestId: requestId },
        orderBy: {
          id: 'desc',  // Поле для сортировки в порядке убывания
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

  // Получение заявок в личном кабинете
  async getCabinet(requestId: number) {
    try {

      const requestData = await prisma.request.findMany({
        where: { creatorId: requestId },
        include: {
          items: {
            include: {
              status: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          status: {
            select: {
              id: true,
              name: true,
            },
          },

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


  // Внесение изменений от снабжения
  async putRequestSnabData(id: number, statusPut: number, question: string) {
    let requestItems; // Инициализация переменной вне блоков
    let clarification; // Инициализация переменной для clarification

    try {
      if (statusPut === 4) {
        // Обновление статуса заявки
        await prisma.request.update({
          where: { id: Number(id) },
          data: {
            workSupply: true
          },
        });

        // Получаем все RequestItem, связанные с запросом
        requestItems = await prisma.requestItem.findMany({
          where: { requestId: Number(id) },
        });

        // Обновляем поле status для каждого RequestItem в отдельном запросе
        await Promise.all(
          requestItems.map((item) =>
            prisma.requestItem.update({
              where: { id: item.id },
              data: {
                status: {
                  connect: { id: statusPut },
                },
              },
            })
          )
        );
      } else if (statusPut === 9) {
        // Обновление статуса заявки
        await prisma.request.update({
          where: { id: Number(id) },
          data: {
            workSupply: false,
            closed: true,
            status: {
              connect: { id: statusPut }
            },
          },
        });

        // Получаем все RequestItem, связанные с запросом
        requestItems = await prisma.requestItem.findMany({
          where: { requestId: Number(id) },
        });

        // Обновляем поле status для каждого RequestItem
        await Promise.all(
          requestItems.map((item) =>
            prisma.requestItem.update({
              where: { id: item.id },
              data: {
                status: {
                  connect: { id: statusPut },
                },
              },
            })
          )
        );
      } else {
        // Получаем все RequestItem, связанные с запросом
        requestItems = await prisma.requestItem.findMany({
          where: { requestId: Number(id) },
        });

        // Обновляем поле status для каждого RequestItem
        await Promise.all(
          requestItems.map((item) =>
            prisma.requestItem.update({
              where: { id: item.id },
              data: {
                status: {
                  connect: { id: statusPut },
                },
              },
            })
          )
        );
      }

      if (question !== undefined && question.trim() !== "") {
        // Создание записи о уточнении
        clarification = await prisma.clarification.create({
          data: {
            requestId: id,
            question: question
          }
        });

        // Обновляем статус заявки
        await prisma.request.update({
          where: { id: Number(id) },
          data: {
            status: {
              connect: { id: statusPut }
            },
          },
        });

        // Получаем все RequestItem, связанные с запросом
        requestItems = await prisma.requestItem.findMany({
          where: { requestId: Number(id) },
        });

        // Обновляем поле status для каждого RequestItem
        await Promise.all(
          requestItems.map((item) =>
            prisma.requestItem.update({
              where: { id: item.id },
              data: {
                status: {
                  connect: { id: statusPut },
                },
              },
            })
          )
        );
      }

      return {
        requestItems,
        clarification
      };

    } catch (error) {
      console.error('Ошибка при получении списка заявок:', error);
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  }

  // Внесение изменений в статус от снабжения
  async putStatusSnabData(id: number, statusPut: number, itemId: number) {
    try {
      console.log(itemId);

      // Обновление статуса заявки
      const requestUpdate = await prisma.requestItem.update({
        where: { id: Number(itemId) },
        data: {
          // workSupply: true
          status: {
            connect: { id: statusPut }
          },
        },
      });

      return requestUpdate


    } catch (error) {
      console.error('Ошибка при получении списка заявок:', error);
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  }

  //  Отправка на согласование от снабжения
  async putRequestSnab(requestId: number, updatedData: number) {
    try {
      console.log(updatedData);

      const requestUpdate = await prisma.request.update({
        where: { id: Number(requestId) },
        data: {
          sendSupplyApproval: true,
          invoiceNumber: updatedData.invoiceNumber,
          additionalComment: updatedData.comment,
          // status: {
          //   connect: { id: 5 } // Связываем статус (согласование к оплате) с заявкой
          // },
        },
      });
      const requestItemsUpdate = await Promise.all(
        updatedData.map((item) =>
          prisma.requestItem.update({
            where: { id: Number(item.itemsId) },
            data: {
              provider: item.provider,
              supplierName1C: item.itemName1C,
              supplierName: item.itemNameProvider,
              amount: item.amount,
              deliveryDeadline: new Date(item.deliveryDate).toISOString(),
              status: {
                connect: { id: 5 }, // Связываем статус (согласование к оплате) с заявкой
              },
            },
          })
        )
      );


      return requestUpdate;
    } catch (error) {
      console.error('Ошибка при получении списка заявок:', error);
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  }




  //  Согласование заявки
  async updateRequest(id: number, status: string, etap: string, items: any) {
    console.log(id);

    try {

      if (etap == 'Закупка') {
        if (status == 'Да') {
          const requestUpdate = await prisma.request.update({
            where: { id: Number(id) },
            data: {
              approvedForPurchase: true,
              expectationPurchase: false,
              // status: {
              //   connect: { id: 3 } // Связываем новый статус с заявкой
              // },
            },
          });
          const updatedItems = items.map((item) =>
            prisma.requestItem.update({
              where: { id: Number(item.id) },
              data: {
                status: {
                  connect: { id: 3 } // Связываем новый статус с заявкой
                },
              },
            })
          );

          await Promise.all(updatedItems);
          return requestUpdate
        } else if (status == 'Нет') {
          const requestUpdate = await prisma.request.update({
            where: { id: Number(id) },
            data: {
              cancellationPurchase: true,
              // status: {
              //   connect: { id: 11 } // Связываем новый статус с заявкой
              // },
            },
          });
          const updatedItems = items.map((item) =>
            prisma.requestItem.update({
              where: { id: Number(item.id) },
              data: {
                status: {
                  connect: { id: 11 } // Связываем новый статус с заявкой
                },
              },
            })
          );

          await Promise.all(updatedItems);
          return requestUpdate
        } else if (status == 'Отложить') {
          const requestUpdate = await prisma.request.update({
            where: { id: Number(id) },
            data: {
              expectationPurchase: true,
              // status: {
              //   connect: { id: 12 } // Связываем новый статус с заявкой
              // },
            },
          });
          const updatedItems = items.map((item) =>
            prisma.requestItem.update({
              where: { id: Number(item.id) },
              data: {
                status: {
                  connect: { id: 12 } // Связываем новый статус с заявкой
                },
              },
            })
          );

          await Promise.all(updatedItems);
          return requestUpdate
        }
      } else if (etap == 'Покупка') {
        if (status == 'Да') {
          const requestUpdate = await prisma.request.update({
            where: { id: Number(id) },
            data: {
              approvedForPayment: true,
              expectationPayment: false,
              // status: {
              //   connect: { id: 6 } // Связываем новый статус с заявкой
              // },
            },
          });
          const updatedItems = items.map((item) =>
            prisma.requestItem.update({
              where: { id: Number(item.id) },
              data: {
                status: {
                  connect: { id: 6 } // Связываем новый статус с заявкой
                },
              },
            })
          );

          await Promise.all(updatedItems);
          return requestUpdate
        } else if (status == 'Нет') {
          const requestUpdate = await prisma.request.update({
            where: { id: Number(id) },
            data: {
              cancellationPayment: true,
              // status: {
              //   connect: { id: 11 } // Связываем новый статус с заявкой
              // },
            },
          });
          const updatedItems = items.map((item) =>
            prisma.requestItem.update({
              where: { id: Number(item.id) },
              data: {
                status: {
                  connect: { id: 11 } // Связываем новый статус с заявкой
                },
              },
            })
          );

          await Promise.all(updatedItems);
          return requestUpdate
        } else if (status == 'Отложить') {
          const requestUpdate = await prisma.request.update({
            where: { id: Number(id) },
            data: {
              expectationPayment: true,
              // status: {
              //   connect: { id: 12 } // Связываем новый статус с заявкой
              // },
            },
          });
          const updatedItems = items.map((item) =>
            prisma.requestItem.update({
              where: { id: Number(item.id) },
              data: {
                status: {
                  connect: { id: 12 } // Связываем новый статус с заявкой
                },
              },
            })
          );

          await Promise.all(updatedItems);
          return requestUpdate
        }
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
