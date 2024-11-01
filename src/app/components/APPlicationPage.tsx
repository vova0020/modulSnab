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

  const [formData, setFormData] = useState({
    itemsId: 0,
    provider: '',
    itemName1C: '',
    itemNameProvider: '',
    invoiceNumber: '',
    amount: '',
    deliveryDate: '',
    comment: '',
  });

  const fetchRequests = async () => {
    try {
      const response = await axios.get('/api/getSnabData', {
        params: { requestId },
      });
      const data: Request = response.data;
      setRequestData(data);
    } catch (error) {
      console.error('Ошибка при загрузке заявок:', error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [requestId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const updatedData = {
      ...formData,
      amount: parseFloat(formData.amount),
      itemsId: requestData?.items[0].id,
    };
    try {
      const response = await axios.put('/api/putSnab',{requestId, updatedData});
      if (response.status === 200) {
        alert('Данные успешно отправлены на сервер!');
        fetchRequests()
      }
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
    console.log(requestData?.items[0].id || '...гружу');
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

  const handleInWorkClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const buttonText = (event.currentTarget as HTMLButtonElement).innerText;
    setInWork(true); 

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
    } else if (buttonText === buttonComplete) {
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

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        padding: { xs: '10px', md: '30px' },
        gap: '20px',
        maxWidth: '1200px',
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
        }}
      >
        <Box sx={{ flex: '1', maxWidth: '500px' }}>
          {images.length > 0 ? (
            <Image
              src={images[selectedImage]}
              alt={`Image ${selectedImage}`}
              width={400}
              height={300}
              style={{ borderRadius: '8px', marginBottom: '10px' }}
            />
          ) : (
            <Box
              sx={{
                width: '100%',
                height: '300px',
                backgroundColor: '#e0e0e0',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '8px',
                marginBottom: '10px',
              }}
            >
              <Typography variant="h6" color="textSecondary">
                Нет изображения
              </Typography>
            </Box>
          )}
          <Grid container spacing={1}>
            {images.length > 0 ? (
              images.map((img, index) => (
                <Grid item key={index}>
                  <Image
                    src={img}
                    alt={`Thumbnail ${index}`}
                    width={100}
                    height={70}
                    style={{ cursor: 'pointer', borderRadius: '4px' }}
                    onClick={() => handleImageClick(index)}
                  />
                </Grid>
              ))
            ) : (
              <Typography>Изображения отсутствуют</Typography>
            )}
          </Grid>
        </Box>

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
            Детали заявки
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
                Что заказано:
              </Typography>
              <Typography variant="body1" sx={{ color: '#333' }}>
                {`${requestData?.items[0].item || '....Загрузка'} - ${requestData?.items[0].quantity || '....Загрузка'} ${requestData?.items[0].unitMeasurement || '....Загрузка'}`}
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

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#555' }}>
                Срочность:
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 'bold',
                  color: 'red',
                  backgroundColor: '#ffe6e6',
                  padding: '4px 8px',
                  borderRadius: '4px',
                }}
              >
                {`${requestData?.promptness}`}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {(!inWork && requestData?.status.name === statusNew) && (
        <Box sx={{ display: 'flex', gap: '20px', justifyContent: { xs: 'center', md: 'flex-start' } }}>
          <Button variant="contained" color="primary" onClick={handleInWorkClick} sx={{ minWidth: '150px' }}>
            {workButton}
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleInWorkClick} sx={{ minWidth: '150px' }}>
            {correctionButton}
          </Button>
        </Box>
      )}

      {((inWork && requestData?.status.name == statusWork)||(!inWork && requestData?.status.name == statusWork)) &&  (
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
            maxWidth: '800px',
            margin: '0 auto',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
            Форма для обработки заявки
          </Typography>

          <TextField label="Поставщик" name="provider" fullWidth value={formData.provider} onChange={handleChange} />
          <TextField label="Наименование из 1С" name="itemName1C" fullWidth value={formData.itemName1C} onChange={handleChange} />
          <TextField label="Наименование у поставщика" name="itemNameProvider" fullWidth value={formData.itemNameProvider} onChange={handleChange} />
          <TextField label="Номер счета / КП" name="invoiceNumber" fullWidth value={formData.invoiceNumber} onChange={handleChange} />
          <TextField label="Сумма" name="amount" fullWidth value={formData.amount} onChange={handleChange} />
          <TextField
            label="Срок поставки"
            name="deliveryDate"
            type="date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={formData.deliveryDate}
            onChange={handleChange}
          />
          <TextField label="Комментарий" name="comment" multiline rows={4} fullWidth value={formData.comment} onChange={handleChange} />

          <Button variant="contained" color="primary" sx={{ alignSelf: 'flex-end', minWidth: '200px' }} onClick={handleSubmit}>
            Сохранить и отправить на согласование
          </Button>
        </Box>
      )}

      {(requestData?.status.name === statusMoney)?(
        <Box sx={{ display: 'flex', gap: '20px', justifyContent: { xs: 'center', md: 'flex-start' } }}>
        <Button variant="contained" color="primary" onClick={handleInWorkClick} sx={{ minWidth: '150px' }}>
          Оплачен
        </Button>
      </Box>
      ):((requestData?.status.name === statusMoneyOk)?(
        <Box sx={{ display: 'flex', gap: '20px', justifyContent: { xs: 'center', md: 'flex-start' } }}>
        <Button variant="contained" color="primary" onClick={handleInWorkClick} sx={{ minWidth: '150px' }}>
          Доставка
        </Button>
      </Box>
      ):((requestData?.status.name === statusDostavka)&&(
        <Box sx={{ display: 'flex', gap: '20px', justifyContent: { xs: 'center', md: 'flex-start' } }}>
        <Button variant="contained" color="primary" onClick={handleInWorkClick} sx={{ minWidth: '150px' }}>
        Завершить
        </Button>
      </Box>
      )))}

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
            <Button onClick={handleClose} sx={{mr:5}}>Отмена</Button>
            <Button onClick={() => {
              handleClose();
              const id: number = requestData?.id || 0;
              const statusPut: number = 10;
              axios.put('/api/getSnabData', { id, statusPut, question })
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

    </Box>
  );
};

export default ApplicationPage;