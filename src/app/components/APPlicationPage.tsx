/* eslint-disable */
// @ts-nocheck
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  Modal,
  Snackbar,
  Alert
} from '@mui/material';
import axios from 'axios';
import MenuItem from '@mui/material/MenuItem';
import { jwtDecode } from 'jwt-decode';
import Messager from './Messager';


interface ApplicationPageProps {
  requestId: number;
}

type Request = {
  id: number;
  date: Date;
  orderReason: string;
  subOrderReason: string;
  comment: string;
  approvedForPurchase: boolean;
  approvedForPayment: boolean;
  promptness: string;
  invoiceNumber: string;
  additionalComment: string;
  status: { id: number; name: string };
  otdel: { id: number; name: string };
  sector: { id: number; name: string };
  creator: { firstName: string; lastName: string };
  items: { id: number; item: string; quantity: number; amount: number; unitMeasurement: string }[];
};

const ApplicationPage: React.FC<ApplicationPageProps> = ({ requestId }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [inWork, setInWork] = useState(false);
  const [requestData, setRequestData] = useState<Request | null>(null);
  const [open, setOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [question, setQuestion] = useState('');

  const [formData, setFormData] = useState([]);
  const [formData2, setFormData2] = useState([]);


  const [data, setData] = useState([]); // Хранит заявки
  const [token, setToken] = useState<string | null>(null); // Токен пользователя
  const [userId, setUserId] = useState<number | null>(null); // Идентификатор пользователя

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      try {
        const decoded: any = jwtDecode(storedToken);
        setUserId(decoded.id);
      } catch (error) {
        console.error("Ошибка при декодировании токена:", error);
      }
    }
  }, []);

  useEffect(() => {
    console.log(userId);

  }, [userId]);

  useEffect(() => {
    if (requestData?.items) {
      setFormData(
        requestData.items.map((item) => ({
          itemsId: item.id,
          provider: '',
          itemName1C: '',
          itemNameProvider: '',
          invoiceNumber: '',
          amount: '',
          deliveryDate: '',
          oplata: '',
          comment: '',
        }))
      );
    }
  }, [requestData?.items]);
  useEffect(() => {
    if (requestData?.items) {
      setFormData2(
        requestData.items.map((item) => ({
          itemsId: item.id,
          provider: item.provider,
          itemName1C: item.itemName1C,
          itemNameProvider: item.itemNameProvider,
          invoiceNumber: item.invoiceNumber,
          amount: item.amount,
          deliveryDate: item.deliveryDeadline,
          oplata: item.oplata,
          comment: item.comment,
          blocked: item.blocked
        }))
      );
    }
    // console.log(formData2);

  }, [requestData?.items]);
  useEffect(() => {
    if (requestData?.items && Array.isArray(requestData.items)) {
      for (const element of requestData.items) {
        // Ваш код обработки элемента
        // console.log(element);
      }
    } else {
      console.warn('requestData.items отсутствует или не является массивом');
    }
  }, [requestData]);


  const fetchRequests = async () => {
    try {
      const response = await axios.get('/api/getSnabData', {
        params: { requestId },
      });
      const data: Request = response.data;


      if (Array.isArray(data.items)) {
        const sortedItems = data.items.sort((a, b) => a.id - b.id);
        setRequestData({ ...data, items: sortedItems }); // Обновляем состояние с отсортированными items
      } else {
        console.log('Поле items не является массивом:', data.items);
        setRequestData(data); // Сохраняем данные без изменений, если items не массив
      }
    } catch (error) {
      console.error('Ошибка при загрузке заявок:', error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [requestId]);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    setFormData((prevData) =>
      prevData.map((data, i) =>
        i === index
          ? {
            ...data,
            [name]: name === 'deliveryDate'
              ? new Date(value).toISOString().slice(0, 10) // Приводим к "yyyy-MM-dd"
              : value
          }
          : data
      )
    );
  };
  const handleChange2 = (index, e) => {
    const { name, value } = e.target;
    setFormData2((prevData) =>
      prevData.map((data, i) =>
        i === index
          ? {
            ...data,
            [name]: name === 'deliveryDate'
              ? new Date(value).toISOString().slice(0, 10) // Приводим к "yyyy-MM-dd"
              : value
          }
          : data
      )
    );
  };

  const handleSubmit = async () => {
    const updatedData = formData.map((item) => ({
      ...item,
      amount: parseFloat(item.amount),

    }));
    try {
      console.log(updatedData);

      const response = await axios.put('/api/putSnab', { requestId, updatedData });
      if (response.status === 200) {
        alert('Данные успешно отправлены на сервер!');
        // fetchRequests()
      }
      fetchRequests()
    } catch (error) {
      console.error('Ошибка отправки данных:', error);
      alert('Ошибка отправки данных');
    }
  };
  const handleSubmit2 = async () => {
    const updatedData = formData2.map((item) => ({
      ...item,
      amount: parseFloat(item.amount),

    }));
    try {
      // console.log(updatedData);

      const response = await axios.put('/api/putSnab2', { requestId, updatedData });
      if (response.status === 200) {
        alert('Данные успешно отправлены на сервер!');
        // fetchRequests()
      }
      fetchRequests()
    } catch (error) {
      console.error('Ошибка отправки данных:', error);
      alert('Ошибка отправки данных');
    }
  };

  const workButton = 'В РАБОТУ';
  const correctionButton = 'ОТПРАВИТЬ НА УТОЧНЕНИЕ';
  const ButtonMoneyOK = 'ОПЛАЧЕН';
  const buttonDostavka = 'ДОСТАВКА';
  const buttonComplete = 'ЗАВЕРШИТЬ';

  const statusNew = 'Согласован к закупке';
  const statusWork = 'В работе';
  const statusMoney = 'Согласован к оплате';
  const statusMoneyOk = 'Оплачен';
  const statusDostavka = 'Доставка';
  const statusComplete = 'Завершена';

  useEffect(() => {
    // console.log(requestData?.items[0].id || '...гружу');
  }, [requestData])

  const images: string[] = [];

  const handleImageClick = (index: number) => {
    setSelectedImage(index);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSnackbarClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbar(false);
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  // Обработчик выпадающего списка с статусами
  const handlePurposeChange = async (index, e: React.ChangeEvent<{ value: unknown }>, itemsId) => {
    // const selectedPurpose = e.target.value as number;
    // console.log(itemsId);
    const id: number = requestData?.id || 0;
    const statusPut: number = e.target.value as number;;
    const itemId = itemsId
    try {

      await axios.put('/api/putStatusSnab', { id, statusPut, itemId });
      console.log('Данные успешно обновлены');
      fetchRequests()
    } catch (error) {
      console.error('Ошибка при обновлении данных:', error);
    }

    // setPurpose(selectedPurpose);
    // setSubPurpose(null);
  };

  useEffect(() => {
    // Проверка, что requestData.items существует и является массивом
    if (Array.isArray(requestData?.items)) {
      const allDelivered = requestData.items.every(item => item.status.name === 'Доставлено');
      const id: number = requestData?.id || 0
      if (allDelivered) {
        // Определение асинхронной функции для выполнения запроса
        const updateStatus = async () => {
          try {
            console.log("Запрос пошел");

            const statusPut: number = 9;  // Новый статус
            const response = await axios.put('/api/getSnabData', { id, statusPut });
            console.log('Данные успешно обновлены автоматом:', response.data);  // Ответ от сервера
            fetchRequests();  // Функция для получения новых данных
          } catch (error) {
            console.error('Ошибка при обновлении данных:', error);
          }
        };

        updateStatus();  // Вызов асинхронной функции
      }
    }
  }, [requestData]);


  const handleInWorkClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const buttonText = (event.currentTarget as HTMLButtonElement).innerText;
    setInWork(true);
    // console.log(buttonText);


    const id: number = requestData?.id || 0;

    if (buttonText === workButton) {
      try {
        const statusPut: number = 4;
        await axios.put('/api/getSnabData', { id, statusPut });
        console.log('Данные успешно обновлены');
        fetchRequests()
      } catch (error) {
        console.error('Ошибка при обновлении данных:', error);
      }
    } else if (buttonText === correctionButton) {
      handleOpen();
    } else if (buttonText === ButtonMoneyOK) {
      try {
        const statusPut: number = 7;
        await axios.put('/api/getSnabData', { id, statusPut });
        console.log('Данные успешно обновлены');
        fetchRequests()
      } catch (error) {
        console.error('Ошибка при обновлении данных:', error);
      }
    } else if (buttonText === buttonDostavka) {
      try {
        const statusPut: number = 8;
        await axios.put('/api/getSnabData', { id, statusPut });
        console.log('Данные успешно обновлены');
        fetchRequests()
      } catch (error) {
        console.error('Ошибка при обновлении данных:', error);
      }
    } else if (buttonText === 'ЗАВЕРШИТЬ') {
      try {
        const statusPut: number = 9;
        await axios.put('/api/getSnabData', { id, statusPut });
        console.log('Данные успешно обновлены');
        fetchRequests()
      } catch (error) {
        console.error('Ошибка при обновлении данных:', error);
      }
    }
  };
  // Функция проверки заполненности обязательных полей
  const isFormValid = () => {
    return formData.every(
      (data) =>
        data.amount &&
        // data.invoiceNumber &&
        data.provider &&
        // data.itemName1C &&
        data.deliveryDate
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        padding: { xs: '10px', md: '30px' },
        gap: '20px',
        // maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
      }}
    >
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        sx={{
          backgroundColor: '#f5f5f5',
          padding: { xs: '10px', md: '20px' },
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Заявка № {requestData?.id || '....Загрузка'}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Дата: {new Date(requestData?.date || '....Загрузка').toLocaleDateString('ru-RU')}
        </Typography>
      </Grid>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: '20px',
          backgroundColor: '#fafafa',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          width: '80%',
          justifyContent: 'center', // Центрирование по вертикали
          alignItems: 'center', // Центрирование по горизонтали
          margin: '0 auto',
        }}
      >


        <Box
          sx={{
            flex: '2',
            padding: { xs: '10px', md: '20px' },
            backgroundColor: '#f9f9f9',
            borderRadius: '12px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            border: '1px solid #ddd',

          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '20px',
              textAlign: 'center',
              borderBottom: '2px solid #1976d2',
              paddingBottom: '10px',
            }}
          >
            Основная информация
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
              padding: '10px',
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.05)',
              border: '1px solid #e0e0e0',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #eee',
                paddingBottom: '8px',
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#555' }}>
                Кто:
              </Typography>
              <Typography variant="body1" sx={{ color: '#333' }}>
                {`${requestData?.creator.firstName || '....Загрузка'} ${requestData?.creator.lastName || '....Загрузка'}. ${requestData?.otdel.name || '....Загрузка'}, ${requestData?.sector.name || '....Загрузка'}`}
              </Typography>
            </Box>



            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #eee',
                paddingBottom: '8px',
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#555' }}>
                Зачем:
              </Typography>
              <Typography variant="body1" sx={{ color: '#333' }}>
                <>
                  {requestData?.orderReason || '....Загрузка'}
                  <br />
                  {requestData?.subOrderReason || '....Загрузка'}
                </>
              </Typography>
            </Box>
            {(requestData?.workSupply !== true) && (
              requestData?.items?.map((item: any, index: number) => (
                <Grid
                  container
                  spacing={1}
                  mt={2}
                  key={index}
                  sx={{
                    borderBottom: '1px solid #eee',
                    // borderRadius: '30px',
                    // display: 'flex',
                    // alignItems: 'center', // Вертикальное выравнивание (по центру)
                    // justifyContent: 'space-between', // Горизонтальное выравнивание (по центру, если нужно)
                    padding: '8px'
                  }}
                >
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#555' }}>
                        Позиция {index + 1}
                      </Typography>

                      <Typography variant="body1" sx={{ color: '#333', marginLeft: '5px' }}>
                        {`${item.item || '....Загрузка'}. Количество: ${item.quantity || '....Загрузка'} - ${item.unitMeasurement || '....Загрузка'}`}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              ))
            )}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #eee',
                paddingBottom: '8px',
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#555' }}>
                Комментарий:
              </Typography>
              <Typography variant="body1" sx={{ color: '#333' }}>
                {`${requestData?.comment}`}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Messager requestId={requestData?.id} />
      </Box>

      {requestData?.closed === true ? null : (
        <>
          {(!inWork && requestData?.workSupply !== true) && (
            <Box sx={{ display: 'flex', gap: '20px', justifyContent: { xs: 'center', md: 'flex-start' } }}>
              <Button variant="contained" color="primary" onClick={handleInWorkClick} sx={{ minWidth: '150px' }}>
                {workButton}
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleInWorkClick} sx={{ minWidth: '150px' }}>
                {correctionButton}
              </Button>
            </Box>
          )}

          {(requestData?.workSupply === true && (requestData?.sendSupplyApproval === true || requestData?.approvedForPayment === true)) ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                padding: '20px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                backgroundColor: '#fff',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                width: '100%',
                margin: '0 auto',
              }}
            >
              <Typography variant="h6"
                sx={{
                  fontWeight: 'bold',
                  color: '#333',
                  marginBottom: '20px',
                  textAlign: 'center',
                  borderBottom: '2px solid #1976d2',
                  paddingBottom: '10px',
                }}
              >
                Детали заявки
              </Typography>

              <Box>
                {requestData?.items && formData.length > 0 && requestData.items.map((item, index) => (
                  item.blocked == true && item.status.id != 14 ?
                    <Grid container spacing={1} mt={2} sx={{
                      border: '1px solid #d8d8d8',

                      borderRadius: 30,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '8px'
                    }} key={index}>
                      <Grid item xs={3}>

                        <Box sx={{ display: 'flex', gap: 2, }}>
                          <TextField variant="standard" label="Заказ" size="small"
                            value={`${item.item || '....Загрузка'}`} />
                          <TextField variant="standard" label="Количество" size="small"
                            value={`${item.quantity || '....Загрузка'} - ${item.unitMeasurement || '....Загрузка'}`} />
                        </Box>
                      </Grid>
                      <Grid item xs={2}>
                        <TextField label={`Сумма ${item.amount}`} name="amount" fullWidth value={formData2[index].amount} onChange={(e) => handleChange2(index, e)} sx={{
                          '& .MuiOutlinedInput-root': { borderRadius: '25px' },
                        }} />
                      </Grid>
                      <Grid item xs={2}>
                        <TextField label={`Номер счета / КП ${item.invoiceNumber || ''}`} name="invoiceNumber" fullWidth value={formData2[index].invoiceNumber} onChange={(e) => handleChange2(index, e)} sx={{
                          '& .MuiOutlinedInput-root': { borderRadius: '25px' },
                        }} />
                      </Grid>
                      <Grid item xs={2}>
                        <TextField label={`Поставщик ${item.invoiceNumber || ''}`} name="provider" fullWidth value={formData2[index].provider} onChange={(e) => handleChange2(index, e)} sx={{
                          '& .MuiOutlinedInput-root': { borderRadius: '25px' },
                        }} />
                      </Grid>
                      <Grid item xs={1}>
                        <TextField select fullWidth name="oplata" label={`Вариант оплаты ${item.oplata || ''}`} value={formData2[index].oplata} onChange={(e) => handleChange2(index, e)}>
                          {/* <MenuItem value={10000} disabled>{item.status.name}</MenuItem> */}
                          <MenuItem value={'Оплата'}>Оплата</MenuItem>
                          <MenuItem value={'Постоплата'}>Постоплата</MenuItem>
                          <MenuItem value={'Предоплата'}>Предоплата</MenuItem>

                        </TextField>
                      </Grid>

                      <Grid item xs={2}>
                        <TextField label="Срок поставки" name="deliveryDate" type="date" InputLabelProps={{ shrink: true }} fullWidth value={formData2[index].deliveryDate} onChange={(e) => handleChange2(index, e)} sx={{
                          '& .MuiOutlinedInput-root': { borderRadius: '25px' },
                        }} />
                      </Grid>
                    </Grid>

                    :
                    <Grid container spacing={1} mt={2} sx={{
                      border: '1px solid #d8d8d8',
                      borderRadius: 30,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '8px'
                    }} key={index}>
                      <Grid item xs={8}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          {/* <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#555' }}>Что заказано:</Typography> */}
                          {/* <Typography variant="body1" sx={{ color: '#333', marginLeft: '5px' }}>
                          {`${item.item || '....Загрузка'}. Количество: ${item.quantity || '....Загрузка'} - ${item.unitMeasurement || '....Загрузка'}`}
                        </Typography> */}
                          <TextField variant="standard" label="Заказ" size="small" fullWidth
                            value={`${item.item || '....Загрузка'}`} />
                          <TextField variant="standard" label="Количество" size="small"
                            value={`${item.quantity || '....Загрузка'} - ${item.unitMeasurement || '....Загрузка'}`} />
                        </Box>
                      </Grid>
                      <Grid item xs={3}>
                        <TextField select required fullWidth id="status" label="Статус" value={10000} onChange={(e) => handlePurposeChange(index, e, item.id)}>
                          <MenuItem value={10000} disabled>{item.status.name}</MenuItem>
                          <MenuItem value={19}>Поиск поставщика</MenuItem>
                          <MenuItem value={16}>Ожидает</MenuItem>
                          <MenuItem value={15}>Заказано</MenuItem>
                          <MenuItem value={7}>Оплачен</MenuItem>

                          {/* <MenuItem value={7}>Оплачен</MenuItem> */}
                          <MenuItem value={8}>Доставка</MenuItem>

                          <MenuItem value={17}>Доставлено, оплачено</MenuItem>
                          <MenuItem value={18}>Доставлено, не оплачено</MenuItem>

                          <MenuItem value={13}>Доставлено</MenuItem>
                        </TextField>
                      </Grid>
                    </Grid>
                ))}
              </Box>
            </Box>
          ) : (
            requestData?.workSupply === true ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  padding: '20px',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  width: '100%',
                  margin: '0 auto',
                }}
              >
                <Typography variant="h6"
                  sx={{
                    fontWeight: 'bold',
                    color: '#333',
                    marginBottom: '20px',
                    textAlign: 'center',
                    borderBottom: '2px solid #1976d2',
                    paddingBottom: '10px',
                  }}
                >
                  Детали заявки
                </Typography>

                <Box>
                  {requestData?.items && formData.length > 0 && requestData.items.map((item, index) => (
                    <Grid container spacing={1} mt={2} sx={{
                      border: '1px solid #d8d8d8',
                      borderRadius: 30,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '8px'
                    }} key={index}>
                      <Grid item xs={4}>
                        {/* <Box sx={{ display: 'flex' }}> */}
                        {/* <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#555' }}>Что заказано:</Typography> */}
                        {/* <Typography variant="body1" sx={{ color: '#333', marginLeft: '5px' }}> */}
                        {/* {`${item.item || '....Загрузка'}. Количество: ${item.quantity || '....Загрузка'} - ${item.unitMeasurement || '....Загрузка'}`} */}
                        {/* </Typography> */}
                        {/* </Box> */}
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <TextField variant="standard" label="Заказ" size="small" fullWidth
                            value={`${item.item || '....Загрузка'}`} />
                          <TextField variant="standard" label="Количество" size="small"
                            value={`${item.quantity || '....Загрузка'} - ${item.unitMeasurement || '....Загрузка'}`} />
                        </Box>
                      </Grid>
                      <Grid item xs={1}>
                        <TextField label="Цена" name="amount" fullWidth value={formData[index].amount} onChange={(e) => handleChange(index, e)} sx={{
                          '& .MuiOutlinedInput-root': { borderRadius: '25px' },
                        }} />
                      </Grid>
                      <Grid item xs={1}>
                        <TextField label="Номер счета / КП" name="invoiceNumber" fullWidth value={formData[index].invoiceNumber} onChange={(e) => handleChange(index, e)} sx={{
                          '& .MuiOutlinedInput-root': { borderRadius: '25px' },
                        }} />
                      </Grid>
                      <Grid item xs={1}>
                        <TextField label="Поставщик" name="provider" fullWidth value={formData[index].provider} onChange={(e) => handleChange(index, e)} sx={{
                          '& .MuiOutlinedInput-root': { borderRadius: '25px' },
                        }} />
                      </Grid>
                      <Grid item xs={2}>
                        <TextField label="Наименование из 1С" name="itemName1C" fullWidth value={formData[index].itemName1C} onChange={(e) => handleChange(index, e)} sx={{
                          '& .MuiOutlinedInput-root': { borderRadius: '25px' },
                        }} />
                      </Grid>
                      <Grid item xs={1}>
                        <TextField select fullWidth name="oplata" label="Вариант оплаты" value={formData[index].oplata} onChange={(e) => handleChange(index, e)}>
                          {/* <MenuItem value={10000} disabled>{item.status.name}</MenuItem> */}
                          <MenuItem value={'Оплата'}>Оплата</MenuItem>
                          <MenuItem value={'Постоплата'}>Постоплата</MenuItem>
                          <MenuItem value={'Предоплата'}>Предоплата</MenuItem>

                        </TextField>
                      </Grid>
                      <Grid item xs={2}>
                        <TextField label="Срок поставки" name="deliveryDate" type="date" InputLabelProps={{ shrink: true }} fullWidth value={formData[index].deliveryDate} onChange={(e) => handleChange(index, e)} sx={{
                          '& .MuiOutlinedInput-root': { borderRadius: '25px' },
                        }} />
                      </Grid>

                    </Grid>
                  ))}
                </Box>
                <TextField label="Комментарий" name="comment" multiline rows={4} fullWidth value={formData.comment} onChange={handleChange} />
                <Button variant="contained" color="primary" sx={{ alignSelf: 'flex-end', minWidth: '200px' }} disabled={!isFormValid()} onClick={handleSubmit}>
                  Сохранить и отправить на согласование
                </Button>
              </Box>
            ) : null
          )}

          {requestData?.approvedForPayment === true && (
            requestData?.blocked == true ? <Box sx={{ display: 'flex', gap: '20px', justifyContent: { xs: 'center', md: 'flex-start' } }}>
              <Button variant="contained" color="primary" sx={{ alignSelf: 'flex-end', minWidth: '200px' }} onClick={handleSubmit2}>
                Сохранить и отправить на повторное согласование
              </Button>
            </Box> :
              <Box sx={{ display: 'flex', gap: '20px', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <Button variant="contained" onClick={handleInWorkClick} sx={{
                  minWidth: '150px',
                  backgroundColor: '#2cf501',
                  color: 'black',
                  '&:hover': {
                    backgroundColor: '#24d401'
                  }
                }}>
                  Завершить
                </Button>
              </Box>
          )}
        </>
      )}



      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            backgroundColor: 'white',
            boxShadow: 24,
            padding: 4,
            borderRadius: '8px',
          }}
        >
          <Typography variant="h6" id="simple-modal-title">
            Уточнение заявки
          </Typography>
          <Typography variant="body1" id="simple-modal-description" sx={{ mt: 2 }}>
            Введите вопрос:
          </Typography>
          <TextField
            label="Вопрос"
            value={question}
            onChange={handleQuestionChange}
            fullWidth
            sx={{ mt: 2 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={handleClose} sx={{ mr: 5 }}>Отмена</Button>
            <Button onClick={() => {
              handleClose();
              const id: number = requestData?.id || 0;
              const statusPut: number = 10;
              axios.put('/api/getSnabData', { id, statusPut, question, userId })
                .then(() => {
                  console.log('Данные успешно обновлены');
                  fetchRequests();
                  setOpenSnackbar(true);
                })
                .catch((error) => {
                  console.error('Ошибка при обновлении данных:', error);
                });
            }} variant="contained" color="primary">
              Подтвердить
            </Button>
          </Box>
        </Box>
      </Modal>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success">
          Заявка успешно отправлена на уточнение!
        </Alert>
      </Snackbar>

    </Box >
  );
};

export default ApplicationPage;