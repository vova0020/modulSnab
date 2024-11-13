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
    const [measureUnitName, setMeasureUnitName] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [otdels, setOtdels] = useState([]);
    const [sectors, setSectors] = useState([]);
    const [measureUnits, setMeasureUnits] = useState([]);

    const handleDepartmentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('/api/createApplicationsPage/getOtdels', { name: departmentName });
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
            await axios.post('/api/createApplicationsPage/getSectors', { name: sectorName });
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

    const handleMeasureUnitSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('/api/createApplicationsPage/measureUnit', { name: measureUnitName });
            setSnackbarMessage(`Единица измерения "${measureUnitName}" успешно добавлена!`);
            setOpenSnackbar(true);
            setMeasureUnitName('');
            fetchMeasureUnits(); // Обновление списка единиц измерения
        } catch (error) {
            console.error('Ошибка при создании единицы измерения:', error);
            setSnackbarMessage(`Ошибка при создании единицы измерения: ${error.message}`);
            setOpenSnackbar(true);
        }
    };

    const fetchOtdels = async () => {
        try {
            const response = await axios.get('/api/createApplicationsPage/getOtdels');
            setOtdels(response.data);
        } catch (error) {
            console.error('Ошибка при получении отделов:', error);
        }
    };

    const fetchSectors = async () => {
        try {
            const response = await axios.get('/api/createApplicationsPage/getSectors');
            setSectors(response.data);
        } catch (error) {
            console.error('Ошибка при получении участков:', error);
        }
    };

    const fetchMeasureUnits = async () => {
        try {
            const response = await axios.get('/api/createApplicationsPage/measureUnit');
            setMeasureUnits(response.data);
        } catch (error) {
            console.error('Ошибка при получении единиц измерения:', error);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleOpenDialog = () => {
        fetchOtdels();
        fetchSectors();
        fetchMeasureUnits();
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
                    <Grid item xs={12} md={4}>
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

                    <Grid item xs={12} md={4}>
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

                    <Grid item xs={12} md={4}>
                        <Typography variant="h5" align="center" gutterBottom>
                            Создать единицу измерения
                        </Typography>
                        <Box component="form" onSubmit={handleMeasureUnitSubmit} noValidate sx={{ mt: 2 }}>
                            <TextField
                                label="Единица измерения"
                                variant="outlined"
                                fullWidth
                                value={measureUnitName}
                                onChange={(e) => setMeasureUnitName(e.target.value)}
                                required
                            />
                            <Button type="submit" variant="contained" color="success" fullWidth sx={{ mt: 2 }}>
                                Создать единицу измерения
                            </Button>
                        </Box>
                    </Grid>
                </Grid>

                <Button variant="outlined" onClick={handleOpenDialog} sx={{ mt: 4 }}>
                    Показать отделы, участки и единицы измерения
                </Button>

                <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Paper>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Список отделов, участков и единиц измерения</DialogTitle>
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
                    <Typography variant="h6">Единицы измерения:</Typography>
                    <List>
                        {measureUnits.map((unit) => (
                            <ListItem key={unit.id}>
                                <ListItemText primary={unit.name} />
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

export default withAuth(AdminPage, ['Руководство']);
