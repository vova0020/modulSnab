'use client'
/* eslint-disable */
// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Box, Button, Container, Grid, Paper, TextField, Typography, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';
import withAuth from '@/app/components/withAuth';
import Navbar from '@/app/components/navbar';

const AdminPage: React.FC = () => {
    const [departmentName, setDepartmentName] = useState('');
    const [sectorName, setSectorName] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [otdels, setOtdels] = useState([]);
    const [sectors, setSectors] = useState([]);

    const handleDepartmentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('/api/getOtdels', { name: departmentName });
            console.log('Создан отдел:', departmentName);
            setSnackbarMessage(`Отдел "${departmentName}" успешно добавлен!`);
            setOpenSnackbar(true);
            setDepartmentName('');
            fetchOtdels(); // Обновление списка отделов
        } catch (error) {
            console.error('Ошибка при создании отдела:', error);
            setSnackbarMessage(`Ошибка при создании отдела: ${error.message}`);
            setOpenSnackbar(true);
        }
    };

    const handleSectorSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('/api/getSectors', { name: sectorName });
            console.log('Создан участок:', sectorName);
            setSnackbarMessage(`Участок "${sectorName}" успешно добавлен!`);
            setOpenSnackbar(true);
            setSectorName('');
            fetchSectors(); // Обновление списка участков
        } catch (error) {
            console.error('Ошибка при создании участка:', error);
            setSnackbarMessage(`Ошибка при создании участка: ${error.message}`);
            setOpenSnackbar(true);
        }
    };

    const fetchOtdels = async () => {
        try {
            const response = await axios.get('/api/getOtdels'); // Получение списка отделов
            setOtdels(response.data);
        } catch (error) {
            console.error('Ошибка при получении отделов:', error);
        }
    };

    const fetchSectors = async () => {
        try {
            const response = await axios.get('/api/getSectors'); // Получение списка участков
            setSectors(response.data);
        } catch (error) {
            console.error('Ошибка при получении участков:', error);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleOpenDialog = () => {
        fetchOtdels(); // Обновление списка перед открытием
        fetchSectors(); // Обновление списка перед открытием
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    return (
        <div><Navbar />
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: '12px' }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Админ-панель
                </Typography>

                <Grid container spacing={4}>
                    {/* Левая колонка - Форма для создания отдела */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h5" align="center" gutterBottom>
                            Создать отдел
                        </Typography>
                        <Box component="form" onSubmit={handleDepartmentSubmit} noValidate sx={{ mt: 2 }}>
                            <TextField
                                label="Название отдела"
                                variant="outlined"
                                fullWidth
                                value={departmentName}
                                onChange={(e) => setDepartmentName(e.target.value)}
                                required
                            />
                            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                                Создать отдел
                            </Button>
                        </Box>
                    </Grid>

                    {/* Правая колонка - Форма для создания участка */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h5" align="center" gutterBottom>
                            Создать участок
                        </Typography>
                        <Box component="form" onSubmit={handleSectorSubmit} noValidate sx={{ mt: 2 }}>
                            <TextField
                                label="Название участка"
                                variant="outlined"
                                fullWidth
                                value={sectorName}
                                onChange={(e) => setSectorName(e.target.value)}
                                required
                            />
                            <Button type="submit" variant="contained" color="secondary" fullWidth sx={{ mt: 2 }}>
                                Создать участок
                            </Button>
                        </Box>
                    </Grid>
                </Grid>

                {/* Кнопка для открытия диалогового окна */}
                <Button variant="outlined" onClick={handleOpenDialog} sx={{ mt: 4 }}>
                    Показать отделы и участки
                </Button>

                {/* Snackbar для уведомлений */}
                <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Paper>

            {/* Диалоговое окно для отображения отделов и участков */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Список отделов и участков</DialogTitle>
                <DialogContent>
                    <Typography variant="h6">Отделы:</Typography>
                    <List>
                        {otdels.map((otdel) => (
                            <ListItem key={otdel.id}>
                                <ListItemText primary={otdel.name} />
                            </ListItem>
                        ))}
                    </List>
                    <Typography variant="h6">Участки:</Typography>
                    <List>
                        {sectors.map((sector) => (
                            <ListItem key={sector.id}>
                                <ListItemText primary={sector.name} />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Закрыть
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
        
        </div>
        
    );
};

export default  withAuth(AdminPage, ['Руководство']);
