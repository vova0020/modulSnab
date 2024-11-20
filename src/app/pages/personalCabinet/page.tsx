// PersonalCabinetPage.tsx
'use client'
/* eslint-disable */
import React, { useEffect, useState } from 'react';
import {
    Typography,
    Grid,
    Box,
    ThemeProvider,
    createTheme,
} from '@mui/material';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Navbar from '@/app/components/navbar'; // Импорт навигационной панели
import ApplicationCard from '../../components/ApplicationCard'; // Импорт карточки заявки
import ApplicationCardDopInf from '../../components/ApplicationCardDopInf'; // Импорт карточки заявки

const PersonalCabinetPage: React.FC = () => {
    const [data, setData] = useState([]); // Хранит заявки
    const [token, setToken] = useState<string | null>(null); // Токен пользователя
    const [userId, setUserId] = useState<number | null>(null); // Идентификатор пользователя

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            try {
                const decoded: any = jwtDecode(storedToken);
                setUserId(decoded.id);
            } catch (error) {
                console.error("Ошибка при декодировании токена:", error);
            }
        }
    }, []);

    const fetchRequests = async (userId: number) => {
        try {
            if (userId != null) {
                const response = await axios.get('/api/personalCabinetPage/getDataUser', {
                    params: { userId },
                });
                const sortedData = response.data.sort((a: any, b: any) => a.id - b.id);
                setData(sortedData);
                // console.log(sortedData);

            }
        } catch (error) {
            console.error('Ошибка при загрузке заявок:', error);
        }
    };

    useEffect(() => {
        fetchRequests(userId);
        const intervalId = setInterval(() => {
            fetchRequests(userId); // Обновляем данные
        }, 4000); // Обновляем каждые 5 секунд

        // Очищаем интервал при размонтировании компонента
        return () => clearInterval(intervalId);

    }, [userId]);


    const theme = createTheme({
        palette: {
            primary: {
                main: '#1976d2',
            },
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <div>
                <Navbar />
                <Box sx={{ padding: { xs: 2, sm: 3 }, textAlign: { xs: 'center', sm: 'left' } }}>
                    <Typography variant="h4" gutterBottom>
                        Мои заявки
                    </Typography>
                    <Grid container spacing={2} justifyContent="center">
                        {data.map((app) => (
                            app.subOrderReason == 'Уникальное оборудование' ?
                                <Grid item xs={12} sm={12} md={5} lg={5} key={app.number}>
                                    {/* @ts-ignore */}
                                    <ApplicationCardDopInf
                                        number={app.id}
                                        date={app.date}
                                        /* @ts-ignore */
                                        app={app}
                                        // status={app.status.name}
                                        /* @ts-ignore */
                                        items={app.items}
                                    // quantity={app.items[0].quantity}
                                    // unitMeasurement={app.items[0].unitMeasurement}

                                    />
                                </Grid>
                                :
                                <Grid item xs={12} sm={12} md={5} lg={5} key={app.number}>
                                    {/* @ts-ignore */}
                                    <ApplicationCard
                                        number={app.id}
                                        date={app.date}
                                        /* @ts-ignore */
                                        app={app}
                                        // status={app.status.name}
                                        /* @ts-ignore */
                                        items={app.items}
                                    // quantity={app.items[0].quantity}
                                    // unitMeasurement={app.items[0].unitMeasurement}

                                    />
                                </Grid>
                            
                        ))}
                    </Grid>
                </Box>
            </div>
        </ThemeProvider>
    );
};

export default PersonalCabinetPage;
