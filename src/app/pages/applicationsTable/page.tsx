'use client'
/* eslint-disable */
// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { ruRU } from '@mui/x-data-grid/locales/ruRU';
import { Box, Typography, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import axios from 'axios';
import { GridColDef, DataGrid, GridRenderCellParams } from '@mui/x-data-grid';
import Navbar from '@/app/components/navbar';

type OrderRow = {
  id: number;
  date: Date,
  orderReason: string,
  invoiceNumber: string,
  status: string,
  approvedForPurchase: boolean,
  approvedForPayment: boolean,
  creator: string,
  itemsId: number,
  itemsName: string,
  itemsQuantity: number,
  itemsAmount: number,
  orderApprovalStatus: string;
  purchaseApprovalStatus: string;
};

const TablePage = () => {
const soglasStatus = 'Согласовано'
const otlojStatus = 'Отложено'
const neSoglasStatus = 'Не согласовано'

  const [rows, setRows] = useState<OrderRow[]>([]);
  const fetchData = async () => {
    try {
      const response = await axios.get('/api/aplicationsTable');
      const sortedData = response.data.sort((a, b) => a.id - b.id); // Сортировка по возрастанию поля 'id'
      setRows(sortedData);
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(() => {
      fetchData(); // Обновляем данные
    }, 4000); // Обновляем каждые 5 секунд

    // Очищаем интервал при размонтировании компонента
    return () => clearInterval(intervalId);
   
  }, []);
  

  const handleApprovalChange = async (id: number, field: string, value: string) => {
    // Обновляем состояние локально
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );

    // Отправляем данные на сервер
    try {
      await axios.put('/api/aplicationsTable', { id, field, value });
      console.log('Данные успешно обновлены');
      fetchData()
    } catch (error) {
      console.error('Ошибка при обновлении данных:', error);
      // Здесь можно добавить уведомление для пользователя о том, что произошла ошибка
    }
  };

  // Обработчик для изменений в других ячейках (например, itemsQuantity, itemsAmount и invoiceNumber)
  const handleCellEditCommit = async (params) => {
    console.log(params); // Проверка вызова функции


    const updateData = params

    try {
      // Отправляем PUT-запрос для обновления значения в базе данных
      const response = await axios.put('/api/tableUpdate', { updateData });
      console.log('Ответ от сервера:', response.data); // Проверка ответа от сервера


      console.log(`Поле ${params.id} успешно обновлено`);
      fetchData()
    } catch (error) {
      console.error('Ошибка при обновлении поля:', error);
    }
  };




  const columns: GridColDef[] = [
    { field: 'id', headerName: '№', width: 10 },
    { field: 'creator', headerName: 'Кто', width: 140 },
    { field: 'itemsName', headerName: 'Что', editable: true, width: 150 },
    { field: 'itemsQuantity', headerName: 'Кол', type: 'number', editable: true, width: 150 },
    { field: 'orderReason', headerName: 'Зачем', width: 250 },
    {
      field: 'soglZakaz',
      headerName: 'Согласовать к заказу',
      width: 200,
      renderCell: (params: GridRenderCellParams) => (
        <div
          style={{
            backgroundColor:
              params.row.approvedForPurchase ? '#81ff00' :
                params.row.status === otlojStatus ? '#ffa700' :
                  params.row.status === neSoglasStatus ? '#4e4e4e' :
                    'inherit',
            // Зеленый цвет для согласованного статуса
            // margin: '8px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {params.row.approvedForPurchase ? (
            soglasStatus
          ) : (params.row.status == otlojStatus ? (
            <Select
              value={params.value || ''}
              onChange={(event: SelectChangeEvent) =>
                handleApprovalChange(params.id as number, 'soglZakaz', event.target.value)
              }
              displayEmpty
              sx={{ width: '100%', fontSize: 14 }}
            >
              <MenuItem value="" disabled>
                {otlojStatus}
              </MenuItem>
              <MenuItem value="Да">Да</MenuItem>
              <MenuItem value="Нет">Нет</MenuItem>
              <MenuItem value="Отложить">Отложить</MenuItem>
            </Select>
          ) : (params.row.status == neSoglasStatus ? (
            <Select
              value={params.value || ''}
              onChange={(event: SelectChangeEvent) =>
                handleApprovalChange(params.id as number, 'soglOplata', event.target.value)
              }
              displayEmpty
              sx={{ width: '100%', fontSize: 14 }}
            >
              <MenuItem value="" disabled>
                {neSoglasStatus}
              </MenuItem>
              <MenuItem value="Да">Да</MenuItem>
              <MenuItem value="Нет">Нет</MenuItem>
              <MenuItem value="Отложить">Отложить</MenuItem>
            </Select>
          ) : (
            <Select
              value={params.value || ''}
              onChange={(event: SelectChangeEvent) =>
                handleApprovalChange(params.id as number, 'soglZakaz', event.target.value)
              }
              displayEmpty
              sx={{ width: '100%', fontSize: 14 }}
            >
              <MenuItem value="" disabled>
                Выбрать значение
              </MenuItem>
              <MenuItem value="Да">Да</MenuItem>
              <MenuItem value="Нет">Нет</MenuItem>
              <MenuItem value="Отложить">Отложить</MenuItem>
            </Select>
          ))

          )}
        </div>
      ),
    },


    { field: 'invoiceNumber', headerName: 'Счет №', editable: true, width: 150 },
    { field: 'itemsAmount', headerName: 'Сумма', editable: true, width: 150 },
    {
      field: 'soglOplata',
      headerName: 'Согласовать покупку',
      width: 200,
      renderCell: (params: GridRenderCellParams) => (
        <div
          style={{
            backgroundColor:
              params.row.approvedForPayment ? '#81ff00' :
                params.row.status === otlojStatus ? '#ffa700' :
                  params.row.status === neSoglasStatus ? '#4e4e4e' :
                    'inherit', // Зеленый цвет для согласованного статуса
            // margin: '8px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {params.row.approvedForPayment ? (
            soglasStatus
          ) : (params.row.status == otlojStatus ? (
            <Select
              value={params.value || ''}
              onChange={(event: SelectChangeEvent) =>
                handleApprovalChange(params.id as number, 'soglOplata', event.target.value)
              }
              displayEmpty
              sx={{ width: '100%', fontSize: 14 }}
            >
              <MenuItem value="" disabled>
                {otlojStatus}
              </MenuItem>
              <MenuItem value="Да">Да</MenuItem>
              <MenuItem value="Нет">Нет</MenuItem>
              <MenuItem value="Отложить">Отложить</MenuItem>
            </Select>
          ) : (params.row.status == neSoglasStatus ? (
            <Select
              value={params.value || ''}
              onChange={(event: SelectChangeEvent) =>
                handleApprovalChange(params.id as number, 'soglOplata', event.target.value)
              }
              displayEmpty
              sx={{ width: '100%', fontSize: 14 }}
            >
              <MenuItem value="" disabled>
                {neSoglasStatus}
              </MenuItem>
              <MenuItem value="Да">Да</MenuItem>
              <MenuItem value="Нет">Нет</MenuItem>
              <MenuItem value="Отложить">Отложить</MenuItem>
            </Select>
          ) : (
            <Select
              value={params.value || ''}
              onChange={(event: SelectChangeEvent) =>
                handleApprovalChange(params.id as number, 'soglOplata', event.target.value)
              }
              displayEmpty
              sx={{ width: '100%', fontSize: 14 }}
            >
              <MenuItem value="" disabled>
                Выбрать значение
              </MenuItem>
              <MenuItem value="Да">Да</MenuItem>
              <MenuItem value="Нет">Нет</MenuItem>
              <MenuItem value="Отложить">Отложить</MenuItem>
            </Select>
          ))

          )}
        </div>
      ),
    },
  ];

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: 2,
        backgroundColor: '#f5f5f7',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Navbar />
      <Typography variant="h5" component="h2" sx={{ marginBottom: 2 }}>
        Таблица заявок
      </Typography>
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
          // @ts-ignore
          experimentalFeatures={{ newEditingApi: true }}
          processRowUpdate={handleCellEditCommit}
          getRowId={(row) => row.id} 
          onProcessRowUpdateError={(error) => {
            console.error("Ошибка при обновлении строки:", error);
            // Здесь можно добавить уведомление для пользователя об ошибке
          }}
          sx={{
            '& .MuiDataGrid-root': {
              borderRadius: '8px',
              border: 'none',
              boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.15)',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f0f0f0',
              color: '#333',
              fontWeight: 'bold',
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #e0e0e0',
              padding: '8px 16px', // Уменьшенные отступы для оптимального отображения
              fontSize: '14px', // Размер текста для улучшенного восприятия
            },
            '& .MuiDataGrid-row': {
              // maxHeight: '60px', // Высота строки для улучшенного отображения
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: '#e9f7ff',
            },
            '& .MuiDataGrid-footerContainer': {
              backgroundColor: '#f0f0f0',
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default TablePage;
