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
};

// Компонент с деталями заявки
const RequestDetailsPage: React.FC<{ requestId: number }> = ({ requestId }) => {
  return <ApplicationPage requestId={requestId} />;
};

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
                    bgcolor: highlightedId === req.id ? yellow[100] : '#f5f5f5',
                  }}
                  onClick={() => onRequestClick(req.id)}
                >
                  <CardContent>
                    <Typography variant="body1">Заявка № {req.id}</Typography>
                    <Typography variant="body2">
                      Дата: {new Date(req.date).toLocaleDateString('ru-RU')}
                    </Typography>
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
    onApproval: Request[];
    clarification: Request[];
    approved: Request[];
    oplachen: Request[];
    delivery: Request[];

    completed: Request[];
  }>({
    newRequests: [],
    inProgress: [],
    onApproval: [],
    clarification: [],
    approved: [],
    oplachen: [],
    delivery: [],

    completed: [],
  });

  // Refs для аккордеонов
  const accordionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Получение данных о заявках с сервера
  const fetchRequests = async () => {
    try {
      const response = await axios.get('/api/getSnab'); // Укажите реальный URL
      const data: Request[] = response.data;
      const newRequests = data
      // @ts-ignore
        .filter(req => req.status.name === 'Согласован к закупке')
        .sort((a, b) => a.id - b.id);
      const inProgress = data
      // @ts-ignore
        .filter(req => req.status.name === 'В работе')
        .sort((a, b) => a.id - b.id);
      const onApproval = data
      // @ts-ignore
        .filter(req => req.status.name === 'Согласование к оплате')
        .sort((a, b) => a.id - b.id);
      const approved = data
      // @ts-ignore
        .filter(req => req.status.name === 'Согласован к оплате')
        .sort((a, b) => a.id - b.id);
      const oplachen = data
      // @ts-ignore
        .filter(req => req.status.name === 'Оплачен')
        .sort((a, b) => a.id - b.id);
      const delivery = data
      // @ts-ignore
        .filter(req => req.status.name === 'Доставка')
        .sort((a, b) => a.id - b.id);
      const clarification = data
      // @ts-ignore
        .filter(req => req.status.name === 'На уточнении')
        .sort((a, b) => a.id - b.id);
      const completed = data
      // @ts-ignore
        .filter(req => req.status.name === 'Завершена')
        .sort((a, b) => a.id - b.id);

      setRequestsData({
        newRequests,
        inProgress,
        onApproval,
        approved,
        clarification,
        oplachen,
        delivery,

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
            <Grid item xs={12} md={6}>
              <RequestBox
                title="На согласовании"
                requests={requestsData.onApproval}
                highlightedId={highlightedRequestId}
                expanded={openAccordionIndex === 2}
                onAccordionToggle={() => setOpenAccordionIndex(openAccordionIndex === 2 ? null : 2)}
                // @ts-ignore
                refProp={(el) => (accordionRefs.current[2] = el)}
                onRequestClick={handleRequestClick}
              />
              <RequestBox
                title="Согласовано"
                requests={requestsData.approved}
                highlightedId={highlightedRequestId}
                expanded={openAccordionIndex === 3}
                onAccordionToggle={() => setOpenAccordionIndex(openAccordionIndex === 3 ? null : 3)}
                // @ts-ignore
                refProp={(el) => (accordionRefs.current[3] = el)}
                onRequestClick={handleRequestClick}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <RequestBox
                title="На уточнении"
                requests={requestsData.clarification}
                highlightedId={highlightedRequestId}
                expanded={openAccordionIndex === 4}
                onAccordionToggle={() => setOpenAccordionIndex(openAccordionIndex === 4 ? null : 4)}
                // @ts-ignore
                refProp={(el) => (accordionRefs.current[4] = el)}
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
                title="Оплачен"
                requests={requestsData.oplachen}
                highlightedId={highlightedRequestId}
                expanded={openAccordionIndex === 6}
                onAccordionToggle={() => setOpenAccordionIndex(openAccordionIndex === 6 ? null : 6)}
                // @ts-ignore
                refProp={(el) => (accordionRefs.current[6] = el)}
                onRequestClick={handleRequestClick}
              />
              <RequestBox
                title="Доставка"
                requests={requestsData.delivery}
                highlightedId={highlightedRequestId}
                expanded={openAccordionIndex === 7}
                onAccordionToggle={() => setOpenAccordionIndex(openAccordionIndex === 7 ? null : 7)}
                // @ts-ignore
                refProp={(el) => (accordionRefs.current[7] = el)}
                onRequestClick={handleRequestClick}
              />
            </Grid>
          </Grid>

          <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
            {selectedRequestId && <RequestDetailsPage requestId={selectedRequestId} />}
          </Drawer>
        </Container>
      </ThemeProvider>
    </div>
  );
};

export default RequestsPage;
