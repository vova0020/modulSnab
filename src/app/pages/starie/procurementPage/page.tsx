'use client';
/* eslint-disable */
// @ts-nocheck
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
  AppBar,
  IconButton,
  Toolbar,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { yellow } from '@mui/material/colors';
import ApplicationPage from '@/app/components/APPlicationPage';
import axios from 'axios';
import Navbar from '@/app/components/navbar';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Иконка стрелки назад

// Типы данных заявок
type Request = {
  expectationPayment: any;
  items: any;
  id: number;
  date: string;
  status:{
    name:string;
    id:number;
  };
  expectationPurchase;
};

// Компонент с деталями заявки
const RequestDetailsPage: React.FC<{ requestId: number }> = ({ requestId }) => {
  return <ApplicationPage requestId={requestId} />;
};
// Объект для сопоставления статусов с цветами



// Компонент для отображения заявок в аккордеонах
const RequestBox: React.FC<{
  title: string;
  requests: Request[];
  highlightedId: number | null;
  expanded: boolean;
  onAccordionToggle: () => void;
  refProp: React.RefObject<HTMLDivElement>;
  onRequestClick: (id: number) => void;
}> = ({
  title,
  requests,
  highlightedId,
  expanded,
  onAccordionToggle,
  refProp,
  onRequestClick,
}) => {
    const statusColors = {
      'Согласование к закупке': { background: '#f0f0f0', text: 'Ожидает согласования' },
      'Согласован к закупке': { background: '#0008ff', text: 'Согласован к закупке' },
      'Согласование к оплате': { background: '#ccd71a', text: 'Согласование к оплате' },
      'Согласован к оплате': { background: '#ccd71a', text: 'Согласован к оплате' },
      'В работе': { background: '#ccd71a', text: 'В работе' },
      'Заказано': { background: '#ccd71a', text: 'Заказано' },
      'Поиск поставщика': { background: '#ccd71a', text: 'Поиск поставщика' },
      'Ожидает': { background: '#ccd71a', text: 'Ожидает' },
      'Оплачен': { background: '#ccd71a', text: 'Оплачен' },
      'Доставка': { background: '#ccd71a', text: 'Доставляется' },
      'Доставлено': { background: '#00ff10', text: 'Доставлено' },
      'Доставлено, не оплачено': { background: '#00ff10', text: 'Доставлено, не оплачено' },
      'Доставлено, оплачено': { background: '#00ff10', text: 'Доставлено, оплачено' },
      'Не согласовано': { background: '#db130b', text: 'Не согласовано' },
      'Завершен': { background: '#00ff10', text: 'Завершена' },
      'Повторное согласование': { background: '#db130b', text: 'Повторное согласование' },
      'Отложено': { background: '#ff5600', text: 'Отложено' },
      'Завершена': { background: '#2dff00', text: 'Завершена' },
      'На уточнении': { background: '#dc9d4d', text: 'На уточнении' },
      'Новая': { background: '#b5af33', text: 'Пользователь исправил заявку' },
      'default': { background: '#f0f0f0', text: 'Не указан' }
    };

    // Функция для получения цвета и текста на основе статуса
    const getStatusInfo = (status: string) => {
      return statusColors[status] || statusColors['default'];
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
                    bgcolor: req?.status?.name === "Завершена"
                      ? '#a5d6a7' // Зелёный для "Завершено"
                      : req?.status?.name === "На уточнении"
                        ? '#ffa726' // Оранжевый для "На уточнении"
                        :req?.status?.name === "Не согласовано"
                        ? '#dc4f4f' // Красный для "Не согласовано"
                         :highlightedId === req.id
                          ? yellow[100]
                          : req.expectationPurchase
                            ? '#dbc20a'
                            : '#f5f5f5',
                  }}
                  onClick={() => onRequestClick(req.id)}
                >
                  <CardContent>
                    {req.expectationPayment ?
                      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom='5px'>
                        <Typography variant="body1">{req?.status?.name}</Typography>
                        <Typography variant="body1">Заявка № {req.id}</Typography>
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
                        <Typography variant="body2">
                          Дата: {new Date(req.date).toLocaleDateString('ru-RU')}
                        </Typography>
                      </Box>
                    }

                    <Grid>
                      {req.items.map((item, index) => {
                        const status = getStatusInfo(item.status.name);
                        return (
                          <Typography
                            variant="subtitle2"
                            gutterBottom
                            sx={{
                              border: '1px solid #cacaca',
                              borderRadius: 50,
                              padding: '3px 12px',
                              display: 'flex',  // Используем flexbox
                              flexWrap: 'wrap', // Разрешаем перенос на следующую строку
                              alignItems: 'center', // Центрируем элементы по вертикали

                            }}
                          >
                          {/* Позиция: {index +1} {item.item}. Количество - {item.quantity} {item.unitMeasurement} */}
                          <Typography
                              variant="subtitle1"
                              sx={{
                                // backgroundColor: status.background, // Цвет фона
                                color: 'black', // Цвет текста
                                // border: '1px solid #888', // Рамка вокруг текста
                                borderRadius: 50, // Скругленные углы
                                padding: '3px 2px', // Отступы внутри текста
                                // marginLeft: '2px', // Отступ слева для разделения
                                display: 'inline', // Чтобы текст "Статус" был в одной строке
                              }}
                            >
                               {`${index +1})`}
                            </Typography>
                          <Typography
                              variant="subtitle2"
                              sx={{
                                // backgroundColor: status.background, // Цвет фона
                                color: 'black', // Цвет текста
                                // border: '1px solid #888', // Рамка вокруг текста
                                borderRadius: 50, // Скругленные углы
                                padding: '3px 3px', // Отступы внутри текста
                                marginLeft: '3px', // Отступ слева для разделения
                                display: 'inline', // Чтобы текст "Статус" был в одной строке
                              }}
                            >
                             {item.item}
                            </Typography>
                          <Typography
                              variant="subtitle2"
                              sx={{
                                // backgroundColor: status.background, // Цвет фона
                                color: 'black', // Цвет текста
                                // border: '1px solid #888', // Рамка вокруг текста
                                borderRadius: 50, // Скругленные углы
                                padding: '3px 8px', // Отступы внутри текста
                                // marginLeft: '8px', // Отступ слева для разделения
                                display: 'inline', // Чтобы текст "Статус" был в одной строке
                              }}
                            >
                              -  {item.quantity} {item.unitMeasurement}
                            </Typography>

                            <Typography
                              variant="subtitle2"
                              sx={{
                                backgroundColor: status.background, // Цвет фона
                                color: 'black', // Цвет текста
                                border: '1px solid #888', // Рамка вокруг текста
                                borderRadius: 50, // Скругленные углы
                                padding: '3px 8px', // Отступы внутри текста
                                marginLeft: '10px', // Отступ слева для разделения
                                display: 'inline', // Чтобы текст "Статус" был в одной строке
                              }}
                            >
                                 {status.text}
                            </Typography>

                          </Typography>

                        )
                      })}
                    </Grid>
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


    completed: Request[];
  }>({
    newRequests: [],
    inProgress: [],


    completed: [],
  });

  // Refs для аккордеонов
  const accordionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Получение данных о заявках с сервера
  const fetchRequests = async () => {
    try {
      const response = await axios.get('/api/getSnab'); // Укажите реальный URL
      const data: Request[] = response.data;
      // console.log(data);

      const newRequests = data
        // @ts-ignore
        .filter(req => req.approvedForPurchase === true && req.workSupply === false && req.closed === false)
        .sort((a, b) => a.id - b.id);
      const inProgress = data
        // @ts-ignore
        .filter(req => (req.workSupply === true) && req.closed === false)
        .sort((a, b) => a.id - b.id);

      const completed = data
        // @ts-ignore
        .filter(req => req.closed === true)
        .sort((a, b) => a.id - b.id);

      setRequestsData({
        newRequests,
        inProgress,


        completed,
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

  const handleRequestClick = (requestId: number) => {
    setSelectedRequestId(requestId);
    setDrawerOpen(true);
  };

  const accordionIndexMap: { [key: string]: number } = {
    newRequests: 0,
    inProgress: 1,
    onApproval: 2,
    approved: 3,
    clarification: 4,
    completed: 5,
    oplachen: 6,
    delivery: 7,

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
  const toggleDrawer = () => {
    setDrawerOpen((prev) => !prev); // Переключаем состояние открытости Drawer
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
                title="Новые"
                requests={requestsData.newRequests}
                highlightedId={highlightedRequestId}
                expanded={openAccordionIndex === 0}
                onAccordionToggle={() => setOpenAccordionIndex(openAccordionIndex === 0 ? null : 0)}
                // @ts-ignore
                refProp={(el) => (accordionRefs.current[0] = el)}
                onRequestClick={handleRequestClick}
              />
              <RequestBox
                title="Завершено"
                requests={requestsData.completed}
                highlightedId={highlightedRequestId}
                expanded={openAccordionIndex === 5}
                onAccordionToggle={() => setOpenAccordionIndex(openAccordionIndex === 5 ? null : 5)}
                // @ts-ignore
                refProp={(el) => (accordionRefs.current[5] = el)}
                onRequestClick={handleRequestClick}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <RequestBox
                title="В работе"
                requests={requestsData.inProgress}
                highlightedId={highlightedRequestId}
                expanded={openAccordionIndex === 1}
                onAccordionToggle={() => setOpenAccordionIndex(openAccordionIndex === 1 ? null : 1)}
                // @ts-ignore
                refProp={(el) => (accordionRefs.current[1] = el)}
                onRequestClick={handleRequestClick}
              />
            </Grid>


          </Grid>

          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            sx={{
              flexShrink: 0, // Предотвращает сужение Drawer
              '& .MuiDrawer-paper': {
                width: '98%', // Ширина для десктопных и больших экранов
                boxSizing: 'border-box', // Для правильного отображения ширины
              },
              '@media (max-width:600px)': { // Для мобильных устройств
                '& .MuiDrawer-paper': {
                  width: '100%', // Ширина на мобильных устройствах
                },
              },
            }}
            variant="temporary" // Временный Drawer
          >
            <AppBar position="static">
              <Toolbar>
                <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
                  {drawerOpen ? (
                    <ArrowBackIcon /> // Если Drawer открыт, показываем стрелку назад
                  ) : (
                    <MenuIcon /> // Если Drawer закрыт, показываем меню
                  )}
                </IconButton>
              </Toolbar>
            </AppBar>

            {selectedRequestId && <RequestDetailsPage requestId={selectedRequestId} />}
          </Drawer>
        </Container>
      </ThemeProvider>
    </div>
  );
};

export default RequestsPage;
