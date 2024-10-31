import React from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';

interface ApplicationCardProps {
  number: string;
  date: string;
  status: string;
}

// Компонент для отображения отдельной заявки
const ApplicationCard: React.FC<ApplicationCardProps> = ({ number, date, status }) => {
  return (
    <Card variant="outlined" sx={{ minWidth: 150, padding: 2 }}>
      <CardContent>
        <Typography variant="subtitle1" color="text.secondary">
          Заявка № {number}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Дата: {date}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ color: status === 'В работе' ? 'green' : 'red' }}>
          Статус: {status}
        </Typography>
      </CardContent>
    </Card>
  );
};

const applications = [
  { number: '001', date: '2024-10-01', status: 'В работе' },
  { number: '002', date: '2024-10-15', status: 'Завершена' },
  { number: '003', date: '2024-10-25', status: 'В ожидании' },
  // Добавьте больше заявок по мере необходимости
];

const PersonalCabinetPage: React.FC = () => {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Мои заявки
      </Typography>
      <Grid container spacing={2}>
        {applications.map((app) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={app.number}>
            <ApplicationCard number={app.number} date={app.date} status={app.status} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PersonalCabinetPage;
