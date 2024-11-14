'use client'
import React, { useEffect, useState } from 'react';
import {
    TextField,
    Button,
    MenuItem,
    Typography,
    Box,
    IconButton,
    Alert,
    AlertTitle,
    Container,
    Grid,
    Snackbar,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import Navbar from '@/app/components/navbar';
import { format } from 'date-fns';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useForm } from 'react-hook-form';
import SendIcon from '@mui/icons-material/Send';

interface Position {
    description: string;
    quantity: number;
    unitMeasurement: string;
    urgency: string;
}
interface DecodedToken {
    role: string; // Предполагаем, что в токене есть поле 'role'
    firstName: string; // Предполагаем, что в токене есть поле 'sector'
    lastName: string; // Предполагаем, что в токене есть поле 'sector'
    id: number; // Предполагаем, что в токене есть поле 'sector'
}

type RegisterFormInputs = {
    department: number;
    sectors: number;
    purpose: string;
    subPurpose: string;
    number: number;
    unitMeasurement: string;
};


export default function Applications() {
    // Данные которые из базы
    const currentDate = format(new Date(), 'dd.MM.yyyy');
    const [requestNumber, setRequestNumber] = useState<number>(0);
    const [otdels, setOtdels] = useState<{ id: number; name: string }[]>([]);
    const [sectors, setSectors] = useState<{ id: number; name: string }[]>([]);
    const [measureUnit, setmeasureUnit] = useState<{ id: number; name: string }[]>([]);
    // Данные для заполнения
    const [department, setDepartment] = useState<number>();
    const [section, setSection] = useState<number>();
    const [fullName, setFullName] = useState<number>(0);
    const [purpose, setPurpose] = useState<string>('');
    const [subPurpose, setSubPurpose] = useState<string | null>(null);

    const [comment, setComment] = useState<string>('');
    const [orders, setOrders] = useState<{ description: string; quantity: number, unitMeasurement: string, urgency: string }[]>([]);



    const { register, formState: { errors } } = useForm<RegisterFormInputs>();


    // Обработчики
    const handlePurposeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const selectedPurpose = event.target.value as string;
        setPurpose(selectedPurpose);
        setSubPurpose(null);
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
            requestNumber, date: currentDate, department, section, fullName, purpose, subPurpose, comment, orders, // Добавляем список заказов для офиса
        };
        console.log("Данные для отправки:", requestData);
        await axios.post('/api/createApplicationsPage/createRequest', requestData)
        setOpenSnackbar(true);
        // Отложенная перезагрузка через 3 секунды
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [token, setToken] = useState<string | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [role, setRole] = useState<string | null>(null); // Состояние для хранения роли пользователя
    const [firstName, seFirstName] = useState<string | null>(null); // Состояние для хранения роли пользователя
    const [lastName, setLastName] = useState<string | null>(null); // Состояние для хранения роли пользователя
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [userId, setUserId] = useState<string | null>(null); // Состояние для хранения роли пользователя

    // Состояние для хранения сектора пользователя

    useEffect(() => {
        const storedToken = localStorage.getItem('token'); // Получаем токен
        if (storedToken) {
            setToken(storedToken); // Сохраняем токен в стейте
            try {
                const decoded: DecodedToken = jwtDecode(storedToken); // Декодируем JWT
                setRole(decoded.role); // Сохраняем роль в состоянии
                seFirstName(decoded.firstName); // Сохраняем имя в состоянии
                setLastName(decoded.lastName); // Сохраняем фамилию в состоянии
                // @ts-ignore
                setUserId(decoded.id); // Сохраняем id в состоянии
                setFullName(decoded.id)
            } catch (error) {
                console.error("Ошибка при декодировании токена:", error);
            }
        }
    }, []);

    useEffect(() => {
        // Устанавливаем интервал для периодических запросов
        const interval = setInterval(() => {
            axios.get('/api/createApplicationsPage/createRequest')
                .then(response => {
                    const requestData = response.data;
                    // console.log(requestData);
                    if (requestData == null) {
                        setRequestNumber(0);
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
                const [requestIdResponse, otdelsResponse, sectorsResponse, measureUnitResponse] = await Promise.all([
                    axios.get('/api/createApplicationsPage/createRequest'),
                    axios.get('/api/createApplicationsPage/getOtdels'),
                    axios.get('/api/createApplicationsPage/getSectors'),
                    axios.get('/api/createApplicationsPage/measureUnit')
                ]);

                const requestId = requestIdResponse.data;
                const otdelsData = otdelsResponse.data;
                const sectorsData = sectorsResponse.data;
                const measureUnitData = measureUnitResponse.data;
                setOtdels(otdelsData)
                setSectors(sectorsData)
                setmeasureUnit(measureUnitData)
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

    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

    useEffect(() => {
        // Проверка, заполнены ли все обязательные поля
        const areAllFieldsFilled =
            department &&
            section &&
            fullName &&
            purpose &&
            subPurpose &&
            orders.length > 0 &&  // Проверка, что массив orders не пустой
            orders.every(order =>
                order.description && // Проверка, что description не пустое
                order.quantity > 0 && // Проверка, что количество больше 0
                order.unitMeasurement && // Проверка, что единица измерения не пустая
                order.urgency // Проверка, что срочность не пустая
            );
        setIsSubmitDisabled(!areAllFieldsFilled);
    }, [department, section, fullName, purpose, subPurpose, orders]);




    // Блок добавления полей для заказа
    const addPosition = () => {
        setOrders([...orders, { description: '', quantity: 0, unitMeasurement: '', urgency: '' }]);
    };

    const removePosition = (index: number) => {
        setOrders(orders.filter((_, i) => i !== index));
    };

    const handlePositionChange = (index: number, field: keyof Position, value: string | number) => {
        const newPositions = [...orders];
        if (field === "quantity") {
            newPositions[index][field] = Number(value);
        } else {
            newPositions[index][field] = String(value);
        }
        setOrders(newPositions);
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
                                value={department}
                                {...register("department", { required: "Укажите отдел" })}
                                error={!!errors.department}
                                helperText={errors.department?.message}
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
                                value={section}
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
                                value={purpose}
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
                                    value={subPurpose}
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
                                    value={subPurpose}
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
                                    value={subPurpose}
                                    onChange={(e) => setSubPurpose(e.target.value as string)}
                                >
                                    <MenuItem value="Для оборудования">Для оборудования</MenuItem>
                                    <MenuItem value="Для задания">Для задания</MenuItem>
                                    <MenuItem value="Для рабочего места">Для рабочего места</MenuItem>
                                    <MenuItem value="Для офиса">Для офиса</MenuItem>
                                    <MenuItem value="Для потока производства">Для потока производства</MenuItem>
                                </TextField>
                            </Grid>
                        )}
                    </Grid>
                </Box>
                {/* Четвертый блок */}
                {/* Поля для "что заказать" и "количество" */}

                <Box mt={3}>
                    <Grid item xs={12} style={{ marginBottom: '16px' }}>
                        <Typography variant="h6">Позиции заказа</Typography>
                    </Grid>

                    {orders.map((position, index) => (
                        <Grid item xs={12} key={index} style={{ marginBottom: '16px' }}>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        required
                                        label="Что заказать"
                                        value={position.description}
                                        onChange={(e) => handlePositionChange(index, 'description', e.target.value)}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                    <TextField
                                        required
                                        label="Количество"
                                        type="number"
                                        value={position.quantity === 0 ? '' : position.quantity} // Отображаем пустую строку вместо 0
                                        onChange={(e) => {
                                            const inputValue = e.target.value.replace(/^0+/, ''); // Убираем лидирующие нули
                                            handlePositionChange(index, 'quantity', inputValue ? parseInt(inputValue) : 0);
                                        }}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <TextField select
                                        required
                                        fullWidth
                                        id="unitMeasurement"
                                        label="Единица измерения"

                                        onChange={(e) => handlePositionChange(index, 'unitMeasurement', e.target.value as string)}
                                    >
                                        {measureUnit.map((sector: { id: number; name: string }) => (
                                            <MenuItem key={sector.id} value={sector.name}>
                                                {sector.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} sm={2}>

                                    <TextField select
                                        required
                                        fullWidth
                                        id="urgency"
                                        label="Срочность"

                                        onChange={(e) => handlePositionChange(index, 'urgency', e.target.value as string)}
                                    >
                                        <MenuItem value="Низкая">Низкая</MenuItem>
                                        <MenuItem value="Средняя">Средняя</MenuItem>
                                        <MenuItem value="Высокая">Высокая</MenuItem>
                                    </TextField>

                                </Grid>
                                <Grid item xs={12} sm="auto">
                                    <IconButton color="secondary" onClick={() => removePosition(index)}>
                                        <RemoveCircleIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Grid>
                    ))}

                    <Grid item xs={12}>
                        <Button onClick={addPosition} color="primary" startIcon={<AddCircleIcon />}>
                            Добавить позицию
                        </Button>
                    </Grid>
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
                </Box>

                <Box mt={3} display="flex" justifyContent="center" alignItems="center">
                    <Button
                        variant="contained"
                        endIcon={<SendIcon />}
                        onClick={handleSubmit}
                        disabled={isSubmitDisabled} // Кнопка отключена, если не заполнены обязательные поля
                    >
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
                    <Alert onClose={handleCloseSnackbar} variant="filled" severity="success" sx={{ width: '100%' }}>
                        <AlertTitle>Успешно</AlertTitle>
                        Заявка зарегистрирована, статус заявки можно посмотреть в личном кабинете!
                    </Alert>
                </Snackbar>
            </Container>
        </div>

    );
};