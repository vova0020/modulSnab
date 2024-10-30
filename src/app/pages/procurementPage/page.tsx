'use client';
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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { yellow } from '@mui/material/colors';
import ApplicationPage from '@/app/components/APPlicationPage';
import axios from 'axios';

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
    console.log(`Rendering RequestBox: ${title}`, requests); // Отладка данных в каждом RequestBox

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
    approved: Request[];
    delivery: Request[];
    clarification: Request[];
    completed: Request[];
  }>({
    newRequests: [],
    inProgress: [],
    onApproval: [],
    approved: [],
    delivery: [],
    clarification: [],
    completed: [],
  });

  // Refs для аккордеонов
  const accordionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Получение данных о заявках с сервера
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('/api/getSnab'); // Укажите реальный URL
        const data: Request[] = response.data; // Используем response.data вместо response.json()
        console.log('Fetched data:', data); // Отладка данных с сервера
  
        // Сортировка и распределение заявок по статусам
        const newRequests = data
          .filter(req => req.status.name === 'Согласован к закупке')
          .sort((a, b) => a.id - b.id);
        const inProgress = data
          .filter(req => req.status.name === 'В работе')
          .sort((a, b) => a.id - b.id);
        const onApproval = data
          .filter(req => req.status.name === 'Согласование к оплате')
          .sort((a, b) => a.id - b.id);
        const approved = data
          .filter(req => req.status.name === 'Согласован к оплате')
          .sort((a, b) => a.id - b.id);
        const delivery = data
          .filter(req => req.status.name === 'Доставка')
          .sort((a, b) => a.id - b.id);
        const clarification = data
          .filter(req => req.status.name === 'На уточнении')
          .sort((a, b) => a.id - b.id);
        const completed = data
          .filter(req => req.status.name === 'Завершена')
          .sort((a, b) => a.id - b.id);
  
        setRequestsData({
          newRequests,
          inProgress,
          onApproval,
          approved,
          delivery,
          clarification,
          completed,
        });
      } catch (error) {
        console.error('Ошибка при загрузке заявок:', error);
      }
    };
  
    fetchRequests();
  }, []);
  
  

  const handleRequestClick = (requestId: number) => {
    setSelectedRequestId(requestId);
    setDrawerOpen(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container sx={{ mt: 4 }}>
        <TextField
          label="Поиск по номеру заявки"
          variant="outlined"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" sx={{ mb: 4 }}>
          Найти
        </Button>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <RequestBox
              title="Новые"
              requests={requestsData.newRequests}
              highlightedId={highlightedRequestId}
              expanded={openAccordionIndex === 0}
              onAccordionToggle={() => setOpenAccordionIndex(openAccordionIndex === 0 ? null : 0)}
              refProp={(el) => (accordionRefs.current[0] = el)}
              onRequestClick={handleRequestClick}
            />
            <RequestBox
              title="В работе"
              requests={requestsData.inProgress}
              highlightedId={highlightedRequestId}
              expanded={openAccordionIndex === 1}
              onAccordionToggle={() => setOpenAccordionIndex(openAccordionIndex === 1 ? null : 1)}
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
              refProp={(el) => (accordionRefs.current[2] = el)}
              onRequestClick={handleRequestClick}
            />
            <RequestBox
              title="Согласовано"
              requests={requestsData.approved}
              highlightedId={highlightedRequestId}
              expanded={openAccordionIndex === 3}
              onAccordionToggle={() => setOpenAccordionIndex(openAccordionIndex === 3 ? null : 3)}
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
              refProp={(el) => (accordionRefs.current[4] = el)}
              onRequestClick={handleRequestClick}
            />
            <RequestBox
              title="Завершено"
              requests={requestsData.completed}
              highlightedId={highlightedRequestId}
              expanded={openAccordionIndex === 5}
              onAccordionToggle={() => setOpenAccordionIndex(openAccordionIndex === 5 ? null : 5)}
              refProp={(el) => (accordionRefs.current[5] = el)}
              onRequestClick={handleRequestClick}
            />
          </Grid>
        </Grid>

        <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          {selectedRequestId && <RequestDetailsPage requestId={selectedRequestId} />}
        </Drawer>
      </Container>
    </ThemeProvider>
  );
};

export default RequestsPage;
