'use client'
/* eslint-disable */
// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Container, TextField, Grid, MenuItem, Select, InputLabel, FormControl, Button, Typography, Box, IconButton, Alert, Snackbar } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { format } from 'date-fns';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import Navbar from '@/app/components/navbar';
import { jwtDecode } from 'jwt-decode';
interface DecodedToken {
    role: string; // Предполагаем, что в токене есть поле 'role'
    firstName: string; // Предполагаем, что в токене есть поле 'sector'
    lastName: string; // Предполагаем, что в токене есть поле 'sector'
    id: number; // Предполагаем, что в токене есть поле 'sector'
}
const RequestForm: React.FC = () => {
    // Данные которые из базы
    const currentDate = format(new Date(), 'dd.MM.yyyy');
    const [requestNumber, setRequestNumber] = useState<number>(0);
    const [otdels, setOtdels] = useState<{ id: number; name: string }[]>([]);
    const [sectors, setSectors] = useState<{ id: number; name: string }[]>([]);
    // Данные для заполнения
    const [department, setDepartment] = useState<number>();
    const [section, setSection] = useState<number>();
    const [fullName, setFullName] = useState<number>(0);
    const [purpose, setPurpose] = useState<string>('');
    const [subPurpose, setSubPurpose] = useState<string | null>(null);
    const [description, setDescription] = useState<string>('');
    const [unitMeasurement, setUnitMeasurement] = useState<string>('');
    const [quantity, setQuantity] = useState<number>(1);
    const [urgency, setUrgency] = useState<string>('Низкая');
    const [comment, setComment] = useState<string>('');
    const [orders, setOrders] = useState<{ description: string; quantity: number }[]>([{ description: '', quantity: 0 }]);

    const [imageFile, setImageFile] = useState<File | null>(null);

    // Обработчик для загрузки изображения
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file);
        }
    };



    // Обработчики
    const handlePurposeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const selectedPurpose = event.target.value as string;
        setPurpose(selectedPurpose);
        setSubPurpose(null);
    };
    const handleAddOrder = () => {
        setOrders([...orders, { description: '', quantity: 0 }]);
    };

    const [openSnackbar, setOpenSnackbar] = useState(false); // Состояние для Snackbar



    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };
    const handleSubmit = async () => {
        const requestData = {
            requestNumber, date: currentDate, department, section, fullName, purpose, subPurpose, description, unitMeasurement, quantity, urgency, comment, orders: subPurpose === 'Для офиса' ? orders : [], // Добавляем список заказов для офиса
        };
        console.log("Данные для отправки:", requestData);
        await axios.post('/api/createRequest', requestData)
        setOpenSnackbar(true);
        // Отложенная перезагрузка через 3 секунды
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    };
    const [token, setToken] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null); // Состояние для хранения роли пользователя
    const [firstName, seFirstName] = useState<string | null>(null); // Состояние для хранения роли пользователя
    const [lastName, setLastName] = useState<string | null>(null); // Состояние для хранения роли пользователя
    const [userId, setUserId] = useState<string | null>(null); // Состояние для хранения роли пользователя
    // Состояние для хранения сектора пользователя

    useEffect(() => {
        const storedToken = localStorage.getItem('token'); // Получаем токен
        if (storedToken) {
            setToken(storedToken); // Сохраняем токен в стейте
            try {
                const decoded: DecodedToken = jwtDecode(storedToken); // Декодируем JWT
                setRole(decoded.role); // Сохраняем роль в состоянии
                seFirstName(decoded.firstName); // Сохраняем роль в состоянии
                setLastName(decoded.lastName); // Сохраняем роль в состоянии
                // @ts-ignore
                setUserId(decoded.id); // Сохраняем роль в состоянии
                setFullName(decoded.id)
            } catch (error) {
                console.error("Ошибка при декодировании токена:", error);
            }
        }
    }, []);

    useEffect(() => {
        // Устанавливаем интервал для периодических запросов
        const interval = setInterval(() => {
            axios.get('/api/createRequest')
                .then(response => {
                    const requestData = response.data;
                    console.log(requestData);
                    if (requestData == null) {
                        setRequestNumber(1);
                    } else {
                        // Можно добавить логику обработки данных, если данные не пустые
                        setRequestNumber(requestData); // Пример
                    }
                })
                .catch(error => {
                    console.error('Ошибка при загрузке данных:', error);
                });
        }, 3000); // Интервал 5 секунд (5000 миллисекунд)

        // Очищаем интервал при размонтировании компонента
        return () => clearInterval(interval);
    }, []);
    // Запрос для получения списка отделов и участков
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [requestIdResponse, otdelsResponse, sectorsResponse] = await Promise.all([
                    axios.get('/api/createRequest'),
                    axios.get('/api/getOtdels'),
                    axios.get('/api/getSectors')
                ]);

                const requestId = requestIdResponse.data;
                const otdelsData = otdelsResponse.data;
                const sectorsData = sectorsResponse.data;
                setOtdels(otdelsData)
                setSectors(sectorsData)
                // console.log(otdelsData);
                // console.log(sectorsData);
                if (requestId == null) {
                    setRequestNumber(1);
                } else {
                    // Можно добавить логику обработки данных, если данные не пустые
                    setRequestNumber(requestId); // Пример
                }

            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
            }
        };

        fetchData();
    }, []);

    // Функция для удаления строки по индексу
    const handleRemoveOrder = (index: number) => {
        // Проверяем, если в массиве осталась только одна строка, удаление не производится
        if (orders.length > 1) {
            setOrders(orders.filter((_, i) => i !== index));
        }
    };

    const handleOrderChange = (index: number, field: 'description' | 'quantity', value: string | number) => {
        const updatedOrders = orders.map((order, i) =>
            i === index ? { ...order, [field]: value } : order
        );
        setOrders(updatedOrders);
    };

    return (
        <div style={{ borderColor: 'black' }}>
            <Navbar />
            <Container maxWidth="md" sx={{
                mt: 5,
                border: '1px solid #888888',   // Немного темнее для контраста
                backgroundColor: '#fcfcfc',
                padding: 2,
                borderRadius: 4,               // Закругленные углы
                // boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.2), -5px -5px 10px rgba(255, 255, 255, 0.5)',  // Эффект выпуклости
                boxShadow: '-10px -10px 30px #FFFFFF, 10px 10px 30px rgba(174, 174, 192, 0.5)',
            }}>

                <Typography variant="h4" gutterBottom>
                    Регистрация заявки в снабжение
                </Typography>

                {/* Первый блок */}
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                            <p style={{ paddingRight: 10 }}>  № Заявки:  </p>
                            <p style={{ fontWeight: 'bold' }}>{requestNumber + 1}</p>
                        </div>

                    </Grid>
                    <Grid item xs={6}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            {currentDate}
                        </div>
                    </Grid>
                </Grid>

                {/* Второй блок */}
                <Box mt={3} >
                    <Grid container spacing={2} >
                        <Grid item xs={4} >
                            <TextField select
                                required
                                fullWidth
                                id="department"
                                label="Отдел"
                                // @ts-ignore
                                onChange={(e) => setDepartment(e.target.value as number)}
                            >
                                {otdels.map((otdel: { id: number; name: string }) => (
                                    <MenuItem key={otdel.id} value={otdel.id}>
                                        {otdel.name}
                                    </MenuItem>
                                ))}

                            </TextField>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField select
                                required
                                fullWidth
                                id="sectors"
                                label="Участок"
                                // @ts-ignore
                                onChange={(e) => setSection(e.target.value as number)}
                            >
                                {sectors.map((sector: { id: number; name: string }) => (
                                    <MenuItem key={sector.id} value={sector.id}>
                                        {sector.name}
                                    </MenuItem>
                                ))}
                            </TextField>

                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="ФИО"
                                value={`${firstName} , ${lastName}`}
                                // @ts-ignore
                                onChange={(e) => setFullName(e.target.value)}
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                </Box>
                {/* Третий блок */}
                <Box mt={3}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField select
                                required
                                fullWidth
                                id="purpose"
                                label="Зачем?"
                                onChange={handlePurposeChange}
                            >
                                <MenuItem value="Потребность под выпуск">Потребность под выпуск</MenuItem>
                                <MenuItem value="Потребность под основной поток">Потребность под основной поток</MenuItem>
                                <MenuItem value="Расходные материалы">Расходные материалы</MenuItem>
                                <MenuItem value="Оборудование">Оборудование</MenuItem>
                            </TextField>
                        </Grid>
                        {purpose === 'Потребность под выпуск' && (
                            <Grid item xs={6}>
                                <TextField select
                                    required
                                    fullWidth
                                    id="subPurpose"
                                    label="Подкатегория"
                                    onChange={(e) => setSubPurpose(e.target.value as string)}
                                >
                                    <MenuItem value="Заказ уже в производстве">Заказ уже в производстве</MenuItem>
                                    <MenuItem value="Только получил запуск">Только получил запуск</MenuItem>
                                </TextField>
                            </Grid>
                        )}
                        {purpose === 'Потребность под основной поток' && (
                            <Grid item xs={6}>
                                <TextField select
                                    required
                                    fullWidth
                                    id="subPurpose"
                                    label="Подкатегория"
                                    onChange={(e) => setSubPurpose(e.target.value as string)}
                                >
                                    <MenuItem value="Поток в производстве">Поток в производстве</MenuItem>
                                    <MenuItem value="Поток планируется">Поток планируется</MenuItem>
                                </TextField>
                            </Grid>
                        )}
                        {purpose === 'Расходные материалы' && (
                            <Grid item xs={6}>
                                <TextField select
                                    required
                                    fullWidth
                                    id="subPurpose"
                                    label="Подкатегория"
                                    onChange={(e) => setSubPurpose(e.target.value as string)}
                                >
                                    <MenuItem value="Для оборудования">Для оборудования</MenuItem>
                                    <MenuItem value="Для модулей">Для модулей</MenuItem>
                                    <MenuItem value="Для рабочего места">Для рабочего места</MenuItem>
                                    {/* <MenuItem value="Для офиса">Для офиса</MenuItem> */}
                                    <MenuItem value="Для потока производства">Для потока производства</MenuItem>
                                </TextField>
                            </Grid>
                        )}
                    </Grid>
                </Box>
                {/* Четвертый блок */}
                {/* Поля для "что заказать" и "количество" */}
                {subPurpose === 'Для офиса' ? (
                    <Box mt={3}>
                        <Grid container spacing={0}>
                            <Typography variant="h6">Детали заказа для офиса</Typography>
                            {orders.map((order, index) => (
                                <Box mt={2} key={index}>
                                    <Grid container spacing={1} key={index}>
                                        <Grid item xs={7}>
                                            <TextField
                                                required
                                                label="Что нужно заказать?"
                                                value={order.description}
                                                onChange={(e) => handleOrderChange(index, 'description', e.target.value)}
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <TextField
                                                label="Количество"
                                                type="number"
                                                required
                                                // value={order.quantity}
                                                onChange={(e) => handleOrderChange(index, 'quantity', Number(e.target.value))}
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <TextField select
                                                required
                                                fullWidth
                                                id="unitMeasurement"
                                                label="Единица измерения"
                                                onChange={(e) => setUnitMeasurement(e.target.value as string)}
                                            >
                                                <MenuItem value="шт">шт</MenuItem>
                                                <MenuItem value="кг">кг</MenuItem>
                                                <MenuItem value="Пачка">Пачка</MenuItem>
                                            </TextField>
                                        </Grid>
                                        <Box display="flex" justifyContent="center" mt={2}>
                                            <IconButton onClick={handleAddOrder}><AddIcon /></IconButton>
                                            <IconButton onClick={() => handleRemoveOrder(index)} color="error">
                                                <RemoveIcon />
                                            </IconButton>
                                        </Box>

                                    </Grid>
                                </Box>

                            ))}
                            <Box mt={3} mb={5} >
                                <Grid container spacing={3}>
                                    <Grid item xs={3}>
                                        <TextField select
                                            required
                                            fullWidth
                                            id="urgency"
                                            label="Срочность"
                                            onChange={(e) => setUrgency(e.target.value as string)}
                                        >
                                            <MenuItem value="Низкая">Низкая</MenuItem>
                                            <MenuItem value="Средняя">Средняя</MenuItem>
                                            <MenuItem value="Высокая">Высокая</MenuItem>
                                        </TextField>
                                    </Grid>
                                    {/* Поле для загрузки картинки */}
                                    <Grid item xs={6}>
                                        <TextField
                                            label="Ссылка на изображение"
                                            placeholder="Вставьте ссылку"
                                            onChange={(e) => setDescription(e.target.value)}
                                            fullWidth
                                        />
                                    </Grid>
                                    {/* Поле для вставки картинки */}
                                    <Grid item xs={3}>
                                        <Button
                                            variant="outlined"
                                            component="label"
                                        >
                                            Загрузить изображение
                                            <input
                                                type="file"
                                                hidden
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                            />
                                        </Button>
                                    </Grid>
                                </Grid>

                            </Box>
                            {/* Комментарий */}
                            <Grid item xs={12}>
                                <TextField
                                    label="Комментарий"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    fullWidth
                                    multiline
                                    rows={3}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                ) : (<Box mt={3}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                label="Что нужно заказать?"
                                required
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                fullWidth
                                multiline
                                rows={3}
                                helperText="Можно вставить ссылку или описание."
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                label="Количество"
                                required
                                type="number"
                                // value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField select
                                required
                                fullWidth
                                id="unitMeasurement"
                                label="Единица измерения"
                                onChange={(e) => setUnitMeasurement(e.target.value as string)}
                            >
                                <MenuItem value="шт">шт</MenuItem>
                                <MenuItem value="кг">кг</MenuItem>
                                <MenuItem value="Пачка">Пачка</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField select
                                required
                                fullWidth
                                id="urgency"
                                label="Срочность"
                                onChange={(e) => setUrgency(e.target.value as string)}
                            >
                                <MenuItem value="Низкая">Низкая</MenuItem>
                                <MenuItem value="Средняя">Средняя</MenuItem>
                                <MenuItem value="Высокая">Высокая</MenuItem>
                            </TextField>
                        </Grid>

                        {/* Поле для загрузки картинки */}
                        {/* <Grid item xs={6}>
                            <TextField
                                label="Ссылка на изображение"
                                placeholder="Вставьте ссылку"
                                onChange={(e) => setDescription(e.target.value)}
                                fullWidth
                            />
                        </Grid> */}

                        {/* Поле для вставки картинки */}
                        {/* <Grid item xs={6}>
                            <Button
                                variant="outlined"
                                component="label"
                            >
                                Загрузить изображение
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                console.log('Загружено изображение:', reader.result);
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                            </Button>
                        </Grid> */}

                        {/* Комментарий */}
                        <Grid item xs={12}>
                            <TextField
                                label="Комментарий"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                fullWidth
                                multiline
                                rows={3}
                            />
                        </Grid>
                    </Grid>
                </Box>)}
                <Box mt={3} display="flex" justifyContent="center" alignItems="center">
                    <Button variant="contained" endIcon={<SendIcon />} onClick={handleSubmit}>
                        Отправить на согласование
                    </Button>
                </Box>
                {/* Уведомление Snackbar */}
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                        {/*  @ts-ignore */}
                    <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                        Данные успешно отправлены!
                    </Alert>
                </Snackbar>
            </Container>
        </div>

    );
};

export default RequestForm;
