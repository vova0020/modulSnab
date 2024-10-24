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

// Типы данных заявок
type Request = {
  id: number;
  date: string;
};

type RequestBoxProps = {
  title: string;
  requests: Request[];
  highlightedId: number | null;
  expanded: boolean;
  onAccordionToggle: () => void;
  refProp: React.RefObject<HTMLDivElement>;
  onRequestClick: (id: number) => void; // Добавлено для обработки клика
};

// Функция для генерации заявок с уникальными номерами
const generateRequests = (startId: number, count: number): Request[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: startId + index,
    date: `2024-10-${(index % 30) + 1}`,
  }));
};

// Пример данных заявок с уникальными номерами
const requestsData = {
  newRequests: generateRequests(1, 25),
  inProgress: generateRequests(26, 15),
  onApproval: generateRequests(41, 10),
  approved: generateRequests(51, 12),
  payment: generateRequests(63, 8),
  delivery: generateRequests(71, 5),
  clarification: generateRequests(76, 7),
  completed: generateRequests(83, 20),
};

// Компонент с деталями заявки
const RequestDetailsPage: React.FC<{ requestId: number }> = ({ requestId }) => {
  return <ApplicationPage />;
};

const RequestBox: React.FC<RequestBoxProps> = ({
  title,
  requests,
  highlightedId,
  expanded,
  onAccordionToggle,
  refProp,
  onRequestClick,
}) => (
  <Accordion
    sx={{ mb: 2, borderRadius: 2, boxShadow: 3 }}
    expanded={expanded}
    onChange={onAccordionToggle}
    ref={refProp} // Добавление ref для прокрутки
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
              onClick={() => onRequestClick(req.id)} // Обработка клика
            >
              <CardContent>
                <Typography variant="body1">№ {req.id}</Typography>
                <Typography variant="body2">Дата: {req.date}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </AccordionDetails>
  </Accordion>
);

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

  // Refs для аккордеонов
  const accordionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Прокрутка к аккордеону после поиска
  useEffect(() => {
    if (openAccordionIndex !== null && accordionRefs.current[openAccordionIndex]) {
      accordionRefs.current[openAccordionIndex]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [openAccordionIndex]);

  const handleSearch = () => {
    const allRequests = [
      ...requestsData.newRequests,
      ...requestsData.inProgress,
      ...requestsData.onApproval,
      ...requestsData.approved,
      ...requestsData.payment,
      ...requestsData.delivery,
      ...requestsData.clarification,
      ...requestsData.completed,
    ];

    const foundRequest = allRequests.find((req) => req.id === Number(searchValue));
    if (foundRequest) {
      setHighlightedRequestId(foundRequest.id);

      // Определение в каком блоке находится заявка и открытие соответствующего аккордеона
      if (requestsData.newRequests.some((req) => req.id === foundRequest.id)) {
        setOpenAccordionIndex(0);
      } else if (requestsData.inProgress.some((req) => req.id === foundRequest.id)) {
        setOpenAccordionIndex(1);
      } else if (requestsData.onApproval.some((req) => req.id === foundRequest.id)) {
        setOpenAccordionIndex(2);
      } else if (requestsData.approved.some((req) => req.id === foundRequest.id)) {
        setOpenAccordionIndex(3);
      } else if (requestsData.payment.some((req) => req.id === foundRequest.id)) {
        setOpenAccordionIndex(4);
      } else if (requestsData.delivery.some((req) => req.id === foundRequest.id)) {
        setOpenAccordionIndex(5);
      } else if (requestsData.clarification.some((req) => req.id === foundRequest.id)) {
        setOpenAccordionIndex(6);
      } else if (requestsData.completed.some((req) => req.id === foundRequest.id)) {
        setOpenAccordionIndex(7);
      }
    } else {
      setHighlightedRequestId(null);
      setOpenAccordionIndex(null); // Закрываем все аккордеоны, если заявка не найдена
    }
  };

  const handleRequestClick = (requestId: number) => {
    setSelectedRequestId(requestId); // Сохраняем ID выбранной заявки
    setDrawerOpen(true); // Открываем Drawer
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false); // Закрываем Drawer
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
        <Button variant="contained" color="primary" onClick={handleSearch} sx={{ mb: 4 }}>
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
              refProp={(el) => (accordionRefs.current[0] = el)} // Присвоение ref
              onRequestClick={handleRequestClick} // Передача обработчика клика
            />
            <RequestBox
              title="В работе"
              requests={requestsData.inProgress}
              highlightedId={highlightedRequestId}
              expanded={openAccordionIndex === 1}
              onAccordionToggle={() => setOpenAccordionIndex(openAccordionIndex === 1 ? null : 1)}
              refProp={(el) => (accordionRefs.current[1] = el)} // Присвоение ref
              onRequestClick={handleRequestClick} // Передача обработчика клика
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <RequestBox
              title="На согласовании"
              requests={requestsData.onApproval}
              highlightedId={highlightedRequestId}
              expanded={openAccordionIndex === 2}
              onAccordionToggle={() => setOpenAccordionIndex(openAccordionIndex === 2 ? null : 2)}
              refProp={(el) => (accordionRefs.current[2] = el)} // Присвоение ref
              onRequestClick={handleRequestClick} // Передача обработчика клика
            />
            <RequestBox
              title="Согласовано"
              requests={requestsData.approved}
              highlightedId={highlightedRequestId}
              expanded={openAccordionIndex === 3}
              onAccordionToggle={() => setOpenAccordionIndex(openAccordionIndex === 3 ? null : 3)}
              refProp={(el) => (accordionRefs.current[3] = el)} // Присвоение ref
              onRequestClick={handleRequestClick} // Передача обработчика клика
            />
          </Grid>
        </Grid>

        {/* Добавление Drawer для отображения деталей заявки */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={handleCloseDrawer}
          variant="temporary"
          ModalProps={{ keepMounted: true }} // Ускоряет показ на мобильных устройствах
          sx={{ '& .MuiDrawer-paper': { width: '100%', height: '100%' } }} // Задает ширину и высоту
        >
          <Container sx={{ p: 2 }}>
            <Button onClick={handleCloseDrawer} variant="outlined" sx={{ mb: 2 }}>
              Закрыть
            </Button>
            {selectedRequestId && <RequestDetailsPage requestId={selectedRequestId} />}
          </Container>
        </Drawer>
      </Container>
    </ThemeProvider>
  );
};

export default RequestsPage;



// import { useState } from 'react';
// import {
//   Grid,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   Typography,
//   Card,
//   CardContent,
// } from '@mui/material';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// type Request = {
//   id: number;
//   date: string;
// };

// type RequestBoxProps = {
//   title: string;
//   requests: Request[];
// };

// const requestsData = {
//   newRequests: [{ id: 1, date: '2024-10-01' }, { id: 2, date: '2024-10-02' }],
//   inProgress: [{ id: 3, date: '2024-10-03' }],
//   onApproval: [{ id: 4, date: '2024-10-04' }],
//   approved: [{ id: 5, date: '2024-10-05' }],
//   payment: [{ id: 6, date: '2024-10-06' }],
//   delivery: [{ id: 7, date: '2024-10-07' }],
//   clarification: [{ id: 8, date: '2024-10-08' }],
//   completed: [{ id: 9, date: '2024-10-09' }],
// };

// const RequestBox: React.FC<RequestBoxProps> = ({ title, requests }) => (
//   <Accordion>
//     <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//       <Typography>{title} ({requests.length})</Typography>
//     </AccordionSummary>
//     <AccordionDetails>
//       <Grid container spacing={2}>
//         {requests.map((req) => (
//           <Grid item xs={12} key={req.id}>
//             <Card>
//               <CardContent>
//                 <Typography variant="body2">№ {req.id}</Typography>
//                 <Typography variant="body2">Дата: {req.date}</Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//     </AccordionDetails>
//   </Accordion>
// );

// const RequestsPage: React.FC = () => {
//   return (
//     <Grid container spacing={2}>
//       <Grid item xs={12} md={6}>
//         <RequestBox title="Новые" requests={requestsData.newRequests} />
//         <RequestBox title="В работе" requests={requestsData.inProgress} />
//       </Grid>
//       <Grid item xs={12} md={6}>
//         <RequestBox title="На согласовании" requests={requestsData.onApproval} />
//         <RequestBox title="Согласовано" requests={requestsData.approved} />
//       </Grid>
//       <Grid item xs={12} md={6}>
//         <RequestBox title="Оплата" requests={requestsData.payment} />
//         <RequestBox title="Доставка" requests={requestsData.delivery} />
//       </Grid>
//       <Grid item xs={12} md={6}>
//         <RequestBox title="На уточнении" requests={requestsData.clarification} />
//         <RequestBox title="Завершено" requests={requestsData.completed} />
//       </Grid>
//     </Grid>
//   );
// };

// export default RequestsPage;
