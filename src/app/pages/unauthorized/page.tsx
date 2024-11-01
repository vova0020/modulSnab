// pages/unauthorized.tsx
'use client'

import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { redirect } from 'next/navigation';

const UnauthorizedPage: React.FC = () => {
  // Логика редиректа, если это необходимо
  const handleGoBack = () => {
    redirect('/'); // Перенаправление на главную страницу
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Доступ запрещен
      </Typography>
      <Typography variant="body1" gutterBottom>
        У вас нет прав для доступа к этой странице. Пожалуйста, обратитесь к администратору.
      </Typography>
      <Button variant="contained" color="primary" onClick={handleGoBack}>
        Вернуться на главную
      </Button>
    </Container>
  );
};

export default UnauthorizedPage;
