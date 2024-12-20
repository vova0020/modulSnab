'use client';
/* eslint-disable */
// @ts-nocheck
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useState, useRef, useEffect } from 'react';
import {
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Card,
  CardContent,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Container,
  TextField,
  Button,
  Drawer,
  Box,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { yellow } from '@mui/material/colors';
import ApplicationPage from '@/app/components/APPlicationPage';
import axios from 'axios';
import Navbar from '@/app/components/navbar';

// Типы данных заявок
type Request = {
  id: number;
  date: string;
  status: string;
  items,
  expectationPurchase,
  expectationPayment
  creator:{
    firstName:string;
    lastName:string;
  };
};

// Компонент с деталями заявки
// const RequestDetailsPage: React.FC<{ requestId: number }> = ({ requestId }) => {
//   return <ApplicationPage requestId={requestId} />;
// };

// Компонент для отображения заявок в аккордеонах
const RequestBox: React.FC<{
  title: string;
  requests: Request[];
  highlightedId: number | null;
  expanded: boolean;
  onAccordionToggle: () => void;
  refProp: React.RefObject<HTMLDivElement>;
  onRequestClick: (id: number, status: string, etap: string, items: any) => void;
}> = ({
  title,
  requests,
  highlightedId,
  expanded,
  onAccordionToggle,
  refProp,
  onRequestClick,
}) => {


    const [selectedItem, setSelectedItem] = useState(null);

    const [openQuestionDialog, setOpenQuestionDialog] = useState(false);
    const [newQuantity, setNewQuantity] = useState<number>();

    const handleQuestionClick = (item) => {
      setSelectedItem(item); // Устанавливаем текущий item
      setOpenQuestionDialog(true); // Открываем диалог
    };
    const deleteClick = async (item) => {
      const itemId = item.id
      const requestId = item.requestId
      await axios.delete('/api/putRequestAplicationTable', { data: { itemId, requestId } });
    };

    async function handleSaveAnswer(item) {
      // await saveAnswerToDatabase(number, answer, question, app.creatorId);
      // console.log(item);
      // console.log(newQuantity);
      setNewQuantity(0)
      setOpenQuestionDialog(false);
      await axios.put('/api/putRequestAplicationTable', { item, newQuantity });
    };




    return (
      <Accordion
        sx={{ mb: 2, borderRadius: 2, boxShadow: 3 }}
        expanded={expanded}
        onChange={onAccordionToggle}
        ref={refProp}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ bgcolor: 'primary.main', color: 'white', borderRadius: 1 }}
        >
          <Typography variant="h6">
            {title} ({requests.length})
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {requests.map((req) => (

              <Grid item xs={12} key={req.id}>
                <Card
                  sx={{
                    boxShadow: 3,
                    borderRadius: 2,
                    bgcolor: highlightedId === req.id ? yellow[100] : req.expectationPurchase ? '#dbc20a' : '#f5f5f5',
                  }}
                // onClick={() => onRequestClick(req.id)}
                >
                  <CardContent>
                    {req.expectationPurchase ?
                      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom='5px'>
                        <Typography variant="body1">Заявка № {req.id}</Typography>
                        <Typography variant="body2">Заказчик - {req?.creator?.firstName} {req?.creator?.lastName}</Typography>
                        <Typography variant="body2">
                          Дата: {new Date(req.date).toLocaleDateString('ru-RU')}
                        </Typography>
                        <Typography variant="body2">
                          Статус: Отложено
                        </Typography>
                      </Box>
                      :
                      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom='5px'>
                        <Typography variant="body1">Заявка № {req.id}</Typography>
                        <Typography variant="body2">Заказчик - {req?.creator?.firstName} {req?.creator?.lastName}</Typography>
                        <Typography variant="body2">
                          Дата: {new Date(req.date).toLocaleDateString('ru-RU')}
                        </Typography>
                      </Box>
                    }

                    <Grid>
                      {[...req.items] // Копируем массив
                        .sort((a, b) => a.id + b.id) // Сортируем по ID (или другому ключу)
                        .map((item) => {
                          
                            return (
                              <Box key={item.id} sx={{
                                display: 'flex', gap: 1, marginBottom: '5px', border: '2px solid #d8d8d8',
                                borderRadius: 5, padding: "8px 20px"
                              }}>

                                <Typography
                                  variant="subtitle2"
                                  gutterBottom
                                  sx={{
                                    // border: '1px solid #cacaca',
                                    // borderRadius: 50,
                                    padding: '3px 12px',
                                    display: 'flex',  // Используем flexbox
                                    flexWrap: 'wrap', // Разрешаем перенос на следующую строку
                                    alignItems: 'center', // Центрируем элементы по вертикали

                                  }}
                                >
                                  Заказ - {item.item}. Количество - {item.quantity} {item.unitMeasurement}

                                </Typography>
                                <IconButton aria-label="cart">
                                  <EditIcon onClick={() => handleQuestionClick(item)} />
                                </IconButton>
                                <IconButton aria-label="cart">
                                  <DeleteForeverIcon onClick={() => deleteClick(item)} />
                                </IconButton>

                                <Dialog open={openQuestionDialog} onClose={() => setOpenQuestionDialog(false)}>
                                  <DialogTitle>Изменение количества</DialogTitle>
                                  <DialogContent>
                                    <DialogContentText sx={{ fontWeight: 'bold', color: 'black', fontSize: '1.1rem' }}>
                                      {`Старое значение: ${selectedItem?.quantity || 'Загрузка значения...'}`}
                                    </DialogContentText>
                                    <TextField
                                      autoFocus
                                      margin="dense"
                                      label="Новое значение"
                                      fullWidth
                                      // variant="outlined"
                                      type='number'
                                      value={newQuantity || ''}
                                      onChange={(e) => setNewQuantity(Number(e.target.value))}
                                    />
                                  </DialogContent>
                                  <DialogActions>
                                    <Button onClick={() => setOpenQuestionDialog(false)} color="primary">
                                      Отмена
                                    </Button>
                                    <Button onClick={() => handleSaveAnswer(selectedItem)} color="primary">
                                      Отправить
                                    </Button>
                                  </DialogActions>
                                </Dialog>


                              </Box>

                            )
                          })
                        }
                    </Grid>
                    {req.expectationPurchase ?
                      <Box display="flex" justifyContent="space-between" alignItems="center" marginTop="10px">

                        <Button onClick={() => onRequestClick(req.id, 'Да', 'Закупка', req.items)} sx={{ backgroundColor: 'green', color: 'white' }}>Согласовать</Button>
                        <Button onClick={() => onRequestClick(req.id, 'Нет', 'Закупка', req.items)} sx={{ backgroundColor: 'red', color: 'white' }}>Не согласовать</Button>
                        {/* <Button onClick={() => onRequestClick(req.id, 'Отложить', 'Закупка', req.items)} sx={{ backgroundColor: 'orange', color: 'white' }}>Отложить</Button> */}
                      </Box>
                      : <Box display="flex" justifyContent="space-between" alignItems="center" marginTop="10px">

                        <Button onClick={() => onRequestClick(req.id, 'Да', 'Закупка', req.items)} sx={{ backgroundColor: 'green', color: 'white' }}>Согласовать</Button>
                        <Button onClick={() => onRequestClick(req.id, 'Нет', 'Закупка', req.items)} sx={{ backgroundColor: 'red', color: 'white' }}>Не согласовать</Button>
                        <Button onClick={() => onRequestClick(req.id, 'Отложить', 'Закупка', req.items)} sx={{ backgroundColor: 'orange', color: 'white' }}>Отложить</Button>
                      </Box>}


                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>
    );
  };
// Акордеон для второго блока
const RequestBox2: React.FC<{
  title: string;
  requests: Request[];
  highlightedId: number | null;
  expanded: boolean;
  onAccordionToggle: () => void;
  refProp: React.RefObject<HTMLDivElement>;
  onRequestClick: (id: number, status: string, etap: string, items: any) => void;
  fetchRequests()
}> = ({
  title,
  requests,
  highlightedId,
  expanded,
  onAccordionToggle,
  refProp,
  onRequestClick,
  fetchRequests
}) => {

    async function stopList(item, status) {
      await axios.put('/api/blokStatusTable', { item, status });
      fetchRequests()
    };
    console.log(requests);
    

    return (
      <Accordion
        sx={{ mb: 2, borderRadius: 2, boxShadow: 3 }}
        expanded={expanded}
        onChange={onAccordionToggle}
        ref={refProp}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ bgcolor: 'primary.main', color: 'white', borderRadius: 1 }}
        >
          <Typography variant="h6">
            {title} ({requests.length})
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {requests.map((req) => (

              <Grid item xs={12} key={req.id}>
                <Card
                  sx={{
                    boxShadow: 3,
                    borderRadius: 2,
                    bgcolor: highlightedId === req.id ? yellow[100] : req.expectationPayment ? '#dbc20a' : '#f5f5f5',
                  }}
                // onClick={() => onRequestClick(req.id)}
                >
                  <CardContent>
                    {req.expectationPayment ?
                      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom='5px'>
                        <Typography variant="body1">Заявка № {req.id}</Typography>
                        <Typography variant="body2">Заказчик - {req.creator?.firstName} {req.creator?.lastName}</Typography>
                        <Typography variant="body2">
                          Дата: {new Date(req.date).toLocaleDateString('ru-RU')}
                        </Typography>
                        <Typography variant="body2">
                          Статус: Отложено
                        </Typography>
                      </Box>
                      :
                      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom='5px'>
                        <Typography variant="body1">Заявка № {req.id}</Typography>
                        <Typography variant="body2">Заказчик - {req.creator?.firstName} {req.creator?.lastName}</Typography>
                        <Typography variant="body2">
                          Дата: {new Date(req.date).toLocaleDateString('ru-RU')}
                        </Typography>
                      </Box>
                    }

                    <Grid>
                      {[...req.items] // Копируем массив
                        .sort((a, b) => a.id + b.id) // Сортируем по ID (или другому ключу)
                        .map((item, index) => (
                        <Box sx={{
                          display: 'flex', gap: 1, marginBottom: '5px', border: '2px solid #d8d8d8',
                          borderRadius: 5, padding: "8px 20px", backgroundColor: item.blocked ? '#ff0000' : '',
                        }}>

                          <Typography
                            variant="subtitle2"
                            gutterBottom
                            sx={{
                              // border: '1px solid #cacaca',
                              // borderRadius: 50,
                              padding: '3px 12px',
                              display: 'flex',  // Используем flexbox
                              flexWrap: 'wrap', // Разрешаем перенос на следующую строку
                              alignItems: 'center', // Центрируем элементы по вертикали

                            }}
                          >
                            Заказ - {item.item}. Количество - {item.quantity} {item.unitMeasurement}. Сумма - {item.amount}.
                            Дата доставки:  {new Date(item.deliveryDeadline).toLocaleDateString('ru-RU')}.
                            Поставщик:  {item.provider}.
                            Вариант оплаты:  {item.oplata}

                          </Typography>
                          {item.blocked ?
                            <IconButton aria-label="cart"
                              sx={{
                                backgroundColor: '#d4edda', // Цвет фона в зависимости от условия
                                borderRadius: '8px', // Можно задать закругление
                                color: '#155724', // Цвет иконки

                                '&:hover': {
                                  backgroundColor: '#c3e6cb', // Цвет фона при наведении
                                },

                              }}>
                              <CheckBoxIcon onClick={() => stopList(item, 'да')} />
                            </IconButton>
                            :
                            <IconButton aria-label="cart">
                              <RemoveCircleIcon onClick={() => stopList(item, 'нет')} />
                            </IconButton>}


                        </Box>
                      )

                      )}
                    </Grid>
                    {req.expectationPayment ?
                      <Box display="flex" justifyContent="space-between" alignItems="center" marginTop="10px">

                        <Button onClick={() => onRequestClick(req.id, 'Да', 'Покупка', req.items)} sx={{ backgroundColor: 'green', color: 'white' }}>Согласовать</Button>
                        <Button onClick={() => onRequestClick(req.id, 'Нет', 'Покупка', req.items)} sx={{ backgroundColor: 'red', color: 'white' }}>Не согласовать</Button>
                        {/* <Button onClick={() => onRequestClick(req.id, 'Отложить', 'Закупка', req.items)} sx={{ backgroundColor: 'orange', color: 'white' }}>Отложить</Button> */}
                      </Box>
                      : <Box display="flex" justifyContent="space-between" alignItems="center" marginTop="10px">

                        <Button onClick={() => onRequestClick(req.id, 'Да', 'Покупка', req.items)} sx={{ backgroundColor: 'green', color: 'white' }}>Согласовать</Button>
                        <Button onClick={() => onRequestClick(req.id, 'Нет', 'Покупка', req.items)} sx={{ backgroundColor: 'red', color: 'white' }}>Не согласовать</Button>
                        <Button onClick={() => onRequestClick(req.id, 'Отложить', 'Покупка', req.items)} sx={{ backgroundColor: 'orange', color: 'white' }}>Отложить</Button>
                      </Box>}


                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>
    );
  };

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h6: {
      fontWeight: 600,
    },
  },
});

const RequestsPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [highlightedRequestId, setHighlightedRequestId] = useState<number | null>(null);
  const [openAccordionIndex, setOpenAccordionIndex] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
  const [requestsData, setRequestsData] = useState<{
    newRequests: Request[];
    inProgress: Request[];


    // completed: Request[];
  }>({
    newRequests: [],
    inProgress: [],


    // completed: [],
  });

  // Refs для аккордеонов
  const accordionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Получение данных о заявках с сервера
  const fetchRequests = async () => {
    try {
      const response = await axios.get('/api/aplicationsTable'); // Укажите реальный URL
      const data: Request[] = response.data;
      // console.log(data);

      const newRequests = data

        // @ts-ignore
        .filter(req => req.approvedForPurchase === false && req.cancellationPurchase === false)
        .sort((a, b) => a.id - b.id);
      const inProgress = data
        // @ts-ignore
        .filter(req => req.approvedForPayment === false && req.approvedForPurchase === true && req.sendSupplyApproval === true && req.cancellationPayment === false)
        .sort((a, b) => a.id - b.id);

      // const completed = data
      // // @ts-ignore
      //   .filter(req => req.status.name === 'Завершена')
      //   .sort((a, b) => a.id - b.id);

      setRequestsData({
        newRequests,
        inProgress,


        // completed,
      });
    } catch (error) {
      console.error('Ошибка при загрузке заявок:', error);
    }
  };

  useEffect(() => {
    fetchRequests();
    const intervalId = setInterval(() => {
      fetchRequests();
    }, 4000);
    return () => clearInterval(intervalId);
  }, []);

  async function handleRequestClick(requestId: number, status: string, etap: string, items: any) {
    // console.log(requestId);

    const response = await axios.put('/api/aplicationsTable', { requestId, status, etap, items })
    fetchRequests()
    // setDrawerOpen(true);
  };

  const accordionIndexMap: { [key: string]: number } = {
    newRequests: 0,
    inProgress: 1,

  };
  const handleSearch = () => {
    const requestId = parseInt(searchValue, 10);
    if (!isNaN(requestId)) {
      setHighlightedRequestId(requestId);
      setOpenAccordionIndex(null); // Сбрасываем раскрытие аккордеонов

      const requestCategory = Object.keys(requestsData).find(category =>
        requestsData[category as keyof typeof requestsData].some(req => req.id === requestId)
      );

      if (requestCategory) {
        const categoryIndex = accordionIndexMap[requestCategory];
        setOpenAccordionIndex(categoryIndex); // Открываем нужный аккордеон

        // Прокрутка к аккордеону
        accordionRefs.current[categoryIndex]?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }
    setSearchValue('')
  };

  return (
    <div>
      <Navbar />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container sx={{
          mt: 5,
          border: '1px solid #888888',   // Немного темнее для контраста
          backgroundColor: '#fcfcfc',
          padding: 2,
          borderRadius: 4,               // Закругленные углы
          // boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.2), -5px -5px 10px rgba(255, 255, 255, 0.5)',  // Эффект выпуклости
          boxShadow: '-10px -10px 30px #FFFFFF, 10px 10px 30px rgba(174, 174, 192, 0.5)',
        }}>
          <Box display="flex" alignItems="center" justifyContent="center" sx={{ mb: 4 }}>
            <TextField
              label="Поиск по номеру заявки"
              variant="outlined"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              sx={{ mb: 0 }} // Убираем отступ снизу для TextField
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              sx={{ ml: 2 }} // Отступ слева для кнопки
            >
              Найти
            </Button>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <RequestBox
                title="Согласование к закупке"
                requests={requestsData.newRequests}
                highlightedId={highlightedRequestId}
                expanded={openAccordionIndex === 0}
                onAccordionToggle={() => setOpenAccordionIndex(openAccordionIndex === 0 ? null : 0)}
                // @ts-ignore
                refProp={(el) => (accordionRefs.current[0] = el)}
                onRequestClick={handleRequestClick}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <RequestBox2
                title="Согласование к покупке"
                requests={requestsData.inProgress}
                highlightedId={highlightedRequestId}
                expanded={openAccordionIndex === 1}
                fetchRequests={fetchRequests}
                onAccordionToggle={() => setOpenAccordionIndex(openAccordionIndex === 1 ? null : 1)}
                // @ts-ignore
                refProp={(el) => (accordionRefs.current[1] = el)}
                onRequestClick={handleRequestClick}
              />
            </Grid>

          </Grid>


        </Container>
      </ThemeProvider>
    </div>
  );
};

export default RequestsPage;
