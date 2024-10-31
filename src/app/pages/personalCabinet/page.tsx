'use client'
import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Box, Chip } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Navbar from '@/app/components/navbar';

interface ApplicationCardProps {
    number: string;
    date: string;
    status: string;
}

interface DecodedToken {
    role: string; // Предполагаем, что в токене есть поле 'role'
    firstName: string; // Предполагаем, что в токене есть поле 'sector'
    lastName: string; // Предполагаем, что в токене есть поле 'sector'
    id: number; // Предполагаем, что в токене есть поле 'sector'

}

// Стиль для карточек
const StyledCard = styled(Card)(({ theme }) => ({
    minWidth: 150,
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
        transform: 'scale(1.02)',
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
    },
    [theme.breakpoints.down('sm')]: {
        minWidth: '100%', // Для мобильных - растянуть карточки на всю ширину
        marginBottom: theme.spacing(2),
    },
}));

// Определение цвета статуса
const getStatusColor = (status: string) => {
    switch (status) {
        case 'В работе':
            return 'primary';
        case 'Завершена':
            return 'success';
        case 'В ожидании':
            return 'warning';
        default:
            return 'default';
    }
};




// Компонент для отображения заявки
const ApplicationCard: React.FC<ApplicationCardProps> = ({ number, date, status }) => {





    return (
        <StyledCard variant="outlined">
            <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Заявка № {number}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Дата: {new Date(date).toLocaleDateString('ru-RU')}
                </Typography>
                <Box mt={1}>
                    <Chip
                        label={status}
                        color={getStatusColor(status)}
                        sx={{
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            padding: '4px 8px',
                            borderRadius: '4px',
                        }}
                    />
                </Box>
            </CardContent>
        </StyledCard>
    );
};



// Основная страница
const PersonalCabinetPage: React.FC = () => {

    const [data, setData] = useState([]);
    const [token, setToken] = useState<string | null>(null);
    
    const [userId, setUserId] = useState<number | null>(null); // Состояние для хранения роли пользователя
    // Состояние для хранения сектора пользователя

    useEffect(()=>{
        console.log(data);
        
    },[data])
    
    useEffect(() => {
        const storedToken = localStorage.getItem('token'); // Получаем токен
        if (storedToken) {
            setToken(storedToken); // Сохраняем токен в стейте
            try {
                const decoded: DecodedToken = jwtDecode(storedToken); // Декодируем JWT
                setUserId(decoded.id); // Сохраняем роль в состоянии
                //   setFullName(decoded.id)
            } catch (error) {
                console.error("Ошибка при декодировании токена:", error);
            }
        }
    }, []);

    const fetchRequests = async (userId: number) => {
        try {
            if (userId != null) {
                const response = await axios.get('/api/getDataUser', {
                    params: { userId }, // передаем userId через params
                });
                const data: Request[] = response.data; // Предполагаем, что data - это массив объектов
                
                // Сортировка данных по возрастанию по полю `id`
                const sortedData = data.sort((a, b) => a.id - b.id);
    
                console.log(sortedData);
                setData(sortedData);
            }
        } catch (error) {
            console.error('Ошибка при загрузке заявок:', error);
        }
    };
    
    useEffect(() => {


        fetchRequests(userId);
    }, [userId]);


    return (
        <div>
               <Navbar />
               <Box sx={{ padding: { xs: 2, sm: 3 }, textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography variant="h4" gutterBottom>
                Мои заявки
            </Typography>
            <Grid container spacing={2} justifyContent="center">
                {data.map((app) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={app.number}>
                        <ApplicationCard number={app.id} date={app.date} status={app.status.name} />
                    </Grid>
                ))}
            </Grid>
        </Box>
        </div>
        
    );
};

export default PersonalCabinetPage;
