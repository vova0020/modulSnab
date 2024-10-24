'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Box, Typography, Button, Grid, TextField } from '@mui/material';

const ApplicationPage = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [inWork, setInWork] = useState(false);

  const images: string[] = []; // Пример пустого массива, если изображений нет

  const handleImageClick = (index: number) => {
    setSelectedImage(index);
  };

  const handleInWorkClick = () => {
    setInWork(true); // Скрываем кнопки и показываем форму
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
      {/* Верхняя часть с номером заявки и датой */}
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
          Заявка №12345
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Дата: 23.10.2024
        </Typography>
      </Grid>

      {/* Горизонтальное расположение блока с изображениями и блока с описанием */}
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
        {/* Блок с изображениями */}
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

        {/* Блок с описанием заявки */}
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
                Иван Иванов, Технолог, Участок №5
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
                10 единиц металлопроката
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
                Для сборки каркасов
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
                Требуется срочная поставка
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
                Высокая
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Кнопки */}
      {!inWork && (
        <Box sx={{ display: 'flex', gap: '20px', justifyContent: { xs: 'center', md: 'flex-start' } }}>
          <Button variant="contained" color="primary" onClick={handleInWorkClick} sx={{ minWidth: '150px' }}>
            В работу
          </Button>
          <Button variant="outlined" color="secondary" sx={{ minWidth: '150px' }}>
            Отправить на уточнение
          </Button>
        </Box>
      )}

      {/* Форма после нажатия на "В работу" */}
      {inWork && (
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

          <TextField label="Поставщик" fullWidth />
          <TextField label="Номер счета / КП" fullWidth />
          <TextField label="Сумма" fullWidth />
          <TextField label="Срок поставки" type="date" InputLabelProps={{ shrink: true }} fullWidth />
          <TextField label="Комментарий" multiline rows={4} fullWidth />

          <Button variant="contained" color="primary" sx={{ alignSelf: 'flex-end', minWidth: '200px' }}>
            Сохранить и отправить на согласование
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ApplicationPage;
