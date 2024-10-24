'use client'
// pages/request.tsx
import React, { useState } from 'react';
import { Container, TextField, Grid, MenuItem, Select, InputLabel, FormControl, Button, Typography, Box } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { format } from 'date-fns';

const RequestForm: React.FC = () => {
    // Данные
    const currentDate = format(new Date(), 'dd.MM.yyyy');
    const [requestNumber] = useState<number>(Math.floor(Math.random() * 10000) + 1);
    const [department, setDepartment] = useState<string>('Отдел 1');
    const [section, setSection] = useState<string>('Участок 1');
    const [fullName, setFullName] = useState<string>('Иван Иванов');
    const [purpose, setPurpose] = useState<string>('');
    const [subPurpose, setSubPurpose] = useState<string | null>(null);
    const [description, setDescription] = useState<string>('');
    const [quantity, setQuantity] = useState<number>(1);
    const [urgency, setUrgency] = useState<string>('Низкая');
    const [comment, setComment] = useState<string>('');

    // Обработчики
    const handlePurposeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const selectedPurpose = event.target.value as string;
        setPurpose(selectedPurpose);
        setSubPurpose(null);
    };

    const handleSave = () => {
        // Логика сохранения данных (например, отправка на сервер)
        console.log('Сохранение данных');
    };

    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
            <Typography variant="h4" gutterBottom>
                Регистрация заявки в снабжение
            </Typography>

            {/* Первый блок */}
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <p style={{ paddingRight: 10 }}>  № Заявки:  </p>
                        <p style={{ fontWeight: 'bold' }}>{requestNumber}</p>
                    </div>

                </Grid>
                <Grid item xs={6}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        {currentDate}
                    </div>
                </Grid>
            </Grid>

            {/* Второй блок */}
            <Box mt={3}>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <FormControl fullWidth>
                            <InputLabel>Отдел</InputLabel>
                            <Select value={department} onChange={(e) => setDepartment(e.target.value as string)}>
                                <MenuItem value="Отдел 1">Отдел 1</MenuItem>
                                <MenuItem value="Отдел 2">Отдел 2</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <FormControl fullWidth>
                            <InputLabel>Участок</InputLabel>
                            <Select value={section} onChange={(e) => setSection(e.target.value as string)}>
                                <MenuItem value="Участок 1">Участок 1</MenuItem>
                                <MenuItem value="Участок 2">Участок 2</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            label="ФИО"
                            value={fullName}
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
                        <FormControl fullWidth>
                            <InputLabel>Зачем?</InputLabel>
                            <Select value={purpose} onChange={handlePurposeChange}>
                                <MenuItem value="Потребность под выпуск">Потребность под выпуск</MenuItem>
                                <MenuItem value="Потребность под основной поток">Потребность под основной поток</MenuItem>
                                <MenuItem value="Расходные материалы">Расходные материалы</MenuItem>
                                <MenuItem value="Оборудование">Оборудование</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    {purpose === 'Потребность под выпуск' && (
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel>Подкатегория</InputLabel>
                                <Select value={subPurpose} onChange={(e) => setSubPurpose(e.target.value as string)}>
                                    <MenuItem value="Заказ уже в производстве">Заказ уже в производстве</MenuItem>
                                    <MenuItem value="Только получил запуск">Только получил запуск</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    )}

                    {purpose === 'Потребность под основной поток' && (
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel>Подкатегория</InputLabel>
                                <Select value={subPurpose} onChange={(e) => setSubPurpose(e.target.value as string)}>
                                    <MenuItem value="Поток в производстве">Поток в производстве</MenuItem>
                                    <MenuItem value="Поток планируется">Поток планируется</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    )}

                    {purpose === 'Расходные материалы' && (
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel>Подкатегория</InputLabel>
                                <Select value={subPurpose} onChange={(e) => setSubPurpose(e.target.value as string)}>
                                    <MenuItem value="Для оборудования">Для оборудования</MenuItem>
                                    <MenuItem value="Для модулей">Для модулей</MenuItem>
                                    <MenuItem value="Для рабочего места">Для рабочего места</MenuItem>
                                    <MenuItem value="Для потока производства">Для потока производства</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    )}
                </Grid>
            </Box>

            {/* Четвертый блок */}
            <Box mt={3}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            label="Что нужно заказать?"
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
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <FormControl fullWidth>
                            <InputLabel>Срочность</InputLabel>
                            <Select value={urgency} onChange={(e) => setUrgency(e.target.value as string)}>
                                <MenuItem value="Низкая">Низкая</MenuItem>
                                <MenuItem value="Средняя">Средняя</MenuItem>
                                <MenuItem value="Высокая">Высокая</MenuItem>
                            </Select>
                        </FormControl>
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
                    <Grid item xs={6}>
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
                    </Grid>

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
            <Box mt={3} display="flex" justifyContent="center" alignItems="center">
                <Button variant="contained" endIcon={<SendIcon />}>
                    Отправить на согласование
                </Button>
            </Box>


        </Container>
    );
};

export default RequestForm;
