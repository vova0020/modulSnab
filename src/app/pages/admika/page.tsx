
'use client'
/* eslint-disable */
// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Box, Button, Container, Grid, Paper, TextField, Typography, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Tooltip } from '@mui/material';
import axios from 'axios';
import withAuth from '@/app/components/withAuth';
import Navbar from '@/app/components/navbar';
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';
import LockResetIcon from '@mui/icons-material/LockReset';
import ExcelJS from 'exceljs';

const AdminPage: React.FC = () => {
    const [departmentName, setDepartmentName] = useState('');
    const [sectorName, setSectorName] = useState('');
    const [measureUnitName, setMeasureUnitName] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [openDialog, setOpenDialog] = useState(false);
    const [otdels, setOtdels] = useState([]);
    const [sectors, setSectors] = useState([]);
    const [measureUnits, setMeasureUnits] = useState([]);

    const [workData, setWorkData] = useState([ ]);
    const [complData, setComplData] = useState([ ]);
    
    // Новые состояния для управления пользователями
    const [users, setUsers] = useState([]);
    const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleDepartmentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('/api/createApplicationsPage/getOtdels', { name: departmentName });
            setSnackbarMessage(`Отдел "${departmentName}" успешно добавлен!`);
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            setDepartmentName('');
            fetchOtdels(); // Обновление списка отделов
        } catch (error) {
            console.error('Ошибка при создании отдела:', error);
            setSnackbarMessage(`Ошибка при создании отдела: ${error.message}`);
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    const handleSectorSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('/api/createApplicationsPage/getSectors', { name: sectorName });
            setSnackbarMessage(`Участок "${sectorName}" успешно добавлен!`);
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            setSectorName('');
            fetchSectors(); // Обновление списка участков
        } catch (error) {
            console.error('Ошибка при создании участка:', error);
            setSnackbarMessage(`Ошибка при создании участка: ${error.message}`);
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    const handleMeasureUnitSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('/api/createApplicationsPage/measureUnit', { name: measureUnitName });
            setSnackbarMessage(`Единица измерения "${measureUnitName}" успешно добавлена!`);
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            setMeasureUnitName('');
            fetchMeasureUnits(); // Обновление списка единиц измерения
        } catch (error) {
            console.error('Ошибка при создании единицы измерения:', error);
            setSnackbarMessage(`Ошибка при создании единицы измерения: ${error.message}`);
            setSnackbarSeverity('error');
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

    // Функция для получения списка пользователей
    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/updateUser', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Ошибка при получении списка пользователей:', error);
            setSnackbarMessage('Ошибка при получении списка пользователей');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    // Открытие диалога смены пароля
    const handleOpenPasswordDialog = (user) => {
        setSelectedUser(user);
        setNewPassword('');
        setConfirmPassword('');
        setOpenPasswordDialog(true);
    };

    // Закрытие диалога смены пароля
    const handleClosePasswordDialog = () => {
        setOpenPasswordDialog(false);
        setSelectedUser(null);
    };

    // Сохранение нового пароля
    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            setSnackbarMessage('Пароли не совпадают');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }

        if (newPassword.length < 6) {
            setSnackbarMessage('Пароль должен содержать не менее 6 символов');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/updateUser', 
                { 
                    userId: selectedUser.id, 
                    newPassword 
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
            setSnackbarMessage(`Пароль для пользователя ${selectedUser.firstName} ${selectedUser.lastName} успешно изменен`);
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            handleClosePasswordDialog();
        } catch (error) {
            console.error('Ошибка при изменении пароля:', error);
            setSnackbarMessage('Ошибка при изменении пароля');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    // запрос к базе с получением заявок которые в работе
    const getWorkRequest = async () => {
        try {
            const response = await axios.get('/api/getWorkRequestAdmin');
            setWorkData(response.data);
        } catch (error) {
            console.error('Ошибка при получении заявок в работе:', error);
        }
    };
    
    // запрос к базе с получением заявок которые выполнены
    const getComplRequest = async () => {
        try {
            const response = await axios.get('/api/getComplRequestAdmin');
            setComplData(response.data);
        } catch (error) {
            console.error('Ошибка при получении выполненных заявок:', error);
        }
    };

    useEffect(() => {
        getWorkRequest();
        getComplRequest();
        fetchUsers(); // Загрузка списка пользователей при монтировании компонента
    }, []);

    const handleGenerateExcelCompl = async () => {
        try {
            // Получение данных с сервера
            const response = await axios.get('/api/getComplRequestAdmin');
            const dataFromServer = response.data;
        
            // Создание книги Excel
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Заявки');
        
            // Заголовки таблицы
            worksheet.addRow(['ФИО', 'Номер заявки', 'Дата создания', 'Позиция', 'Количество', 'Сумма', 'Контрагент']);
        
            // Стили заголовков
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: '16FF00' }, // Зеленый фон
                };
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
            });
        
            // Установка ширины столбцов
            worksheet.columns = [
                { key: 'fio', width: 20 },
                { key: 'requestNumber', width: 15 },
                { key: 'creationDate', width: 20 },
                { key: 'position', width: 25 },
                { key: 'quantity', width: 15 },
                { key: 'amount', width: 15 },
                { key: 'provider', width: 20 },
            ];
        
            let currentRow = 2; // Стартовая строка для данных
        
            dataFromServer.forEach((request) => {
                const startRow = currentRow;
        
                // Добавляем строки для позиций
                request.items.forEach((position) => {
                    const row = worksheet.addRow([
                        null, // ФИО будет объединено
                        null, // Номер заявки будет объединено
                        null, // Дата создания будет объединено
                        position.item, // Позиция
                        position.quantity, // Количество
                        position.amount, // Сумма
                        position.provider, // Контрагент
                    ]);
        
                    // Стилизация всех ячеек строки
                    row.eachCell((cell) => {
                        cell.alignment = { vertical: 'middle', horizontal: 'center' };
                    });
        
                    currentRow++;
                });
        
                const endRow = currentRow - 1;
        
                // Объединение ячеек для столбцов 'ФИО', 'Номер заявки', 'Дата создания'
                ['A', 'B', 'C'].forEach((column) => {
                    worksheet.mergeCells(`${column}${startRow}:${column}${endRow}`);
                });
        
                // Установка значений в объединенные ячейки
                worksheet.getCell(`A${startRow}`).value = `${request.creator.firstName} ${request.creator.lastName}`;
                worksheet.getCell(`B${startRow}`).value = request.id;
                worksheet.getCell(`C${startRow}`).value = new Date(request.date).toLocaleDateString('ru-RU');
        
                // Стилизация объединенных ячеек
                ['A', 'B', 'C'].forEach((column) => {
                    worksheet.getCell(`${column}${startRow}`).alignment = { vertical: 'middle', horizontal: 'center' };
                });
            });
        
            // Генерация и сохранение файла
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'Завершенные.xlsx';
            link.click();
        } catch (error) {
            console.error('Ошибка при генерации Excel:', error);
        }
    };
      
    const handleGenerateExcelWork = async () => {
        try {
            // Получение данных с сервера
            const response = await axios.get('/api/getWorkRequestAdmin');
            const dataFromServer = response.data;
        
            // Создание книги Excel
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Заявки');
        
            // Заголовки таблицы
            worksheet.addRow(['ФИО', 'Номер заявки', 'Дата создания', 'Позиция', 'Количество',]);
        
            // Стили заголовков
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: '16FF00' }, // Зеленый фон
                };
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
            });
        
            // Установка ширины столбцов
            worksheet.columns = [
                { key: 'fio', width: 20 },
                { key: 'requestNumber', width: 15 },
                { key: 'creationDate', width: 20 },
                { key: 'position', width: 25 },
                { key: 'quantity', width: 15 },
            ];
        
            let currentRow = 2; // Стартовая строка для данных
        
            dataFromServer.forEach((request) => {
                const startRow = currentRow;
        
                // Добавляем строки для позиций
                request.items.forEach((position) => {
                    const row = worksheet.addRow([
                        null, // ФИО будет объединено
                        null, // Номер заявки будет объединено
                        null, // Дата создания будет объединено
                        position.item, // Позиция
                        position.quantity, // Количество
                    ]);
        
                    // Стилизация всех ячеек строки
                    row.eachCell((cell) => {
                        cell.alignment = { vertical: 'middle', horizontal: 'center' };
                    });
        
                    currentRow++;
                });
        
                const endRow = currentRow - 1;
        
                // Объединение ячеек для столбцов 'ФИО', 'Номер заявки', 'Дата создания'
                ['A', 'B', 'C'].forEach((column) => {
                    worksheet.mergeCells(`${column}${startRow}:${column}${endRow}`);
                });
        
                // Установка значений в объединенные ячейки
                worksheet.getCell(`A${startRow}`).value = `${request.creator.firstName} ${request.creator.lastName}`;
                worksheet.getCell(`B${startRow}`).value = request.id;
                worksheet.getCell(`C${startRow}`).value = new Date(request.date).toLocaleDateString('ru-RU');
        
                // Стилизация объединенных ячеек
                ['A', 'B', 'C'].forEach((column) => {
                    worksheet.getCell(`${column}${startRow}`).alignment = { vertical: 'middle', horizontal: 'center' };
                });
            });
        
            // Генерация и сохранение файла
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'Заявки в работе.xlsx';
            link.click();
        } catch (error) {
            console.error('Ошибка при генерации Excel:', error);
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
                    <Typography variant="h4" align="center" gutterBottom sx={{ borderBottom: '1px solid black' }}>
                        Админ-панель
                    </Typography>

                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h5" align="center" gutterBottom sx={{ borderBottom: '1px solid black' }}>
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
                            <Typography variant="h5" align="center" gutterBottom sx={{ borderBottom: '1px solid black' }}>
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
                            <Typography variant="h5" align="center" gutterBottom sx={{ borderBottom: '1px solid black' }}>
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
                    {/*  @ts-ignore */}
                        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                            {snackbarMessage}
                        </Alert>
                    </Snackbar>
                </Paper>

                {/* Часть с выгрузкой из базы */}
                <Paper elevation={3} sx={{ p: 4, borderRadius: '12px', marginTop: "10px" }}>
                    <Typography variant="h4" align="center" gutterBottom sx={{ borderBottom: '1px solid black' }}>
                        Выгрузка из базы данных
                    </Typography>
                    <div style={{display:'flex', justifyContent:'space-between'}}>
                    <Button variant="contained" endIcon={<SimCardDownloadIcon />} onClick={handleGenerateExcelWork}>
                        Получить заявки в работе
                    </Button>
                    <Button variant="contained" color="success" endIcon={<SimCardDownloadIcon />} onClick={handleGenerateExcelCompl}>
                        Получить завершенные заявки
                    </Button>
                    </div>
                </Paper>

                {/* Новый раздел для управления пользователями */}
                <Paper elevation={3} sx={{ p: 4, borderRadius: '12px', marginTop: "10px" }}>
                    <Typography variant="h4" align="center" gutterBottom sx={{ borderBottom: '1px solid black' }}>
                        Управление пользователями
                    </Typography>
                    
                    <Box sx={{ mt: 3, mb: 2 }}>
                        <Button variant="contained" color="primary" onClick={fetchUsers}>
                            Обновить список пользователей
                        </Button>
                    </Box>
                    
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Имя</TableCell>
                                    <TableCell>Фамилия</TableCell>
                                    <TableCell>Логин</TableCell>
                                    <TableCell>Роль</TableCell>
                                    <TableCell align="center">Действия</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.id}</TableCell>
                                        <TableCell>{user.firstName}</TableCell>
                                        <TableCell>{user.lastName}</TableCell>
                                        <TableCell>{user.login}</TableCell>
                                        <TableCell>{user.role}</TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Сменить пароль">
                                                <IconButton color="primary" onClick={() => handleOpenPasswordDialog(user)}>
                                                    <LockResetIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    
                    {/* Диалог для смены пароля */}
                    <Dialog open={openPasswordDialog} onClose={handleClosePasswordDialog}>
                        <DialogTitle>
                            Смена пароля для пользователя {selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : ''}
                        </DialogTitle>
                        <DialogContent>
                            <Box sx={{ pt: 2 }}>
                                <TextField
                                    label="Новый пароль"
                                    type="password"
                                    fullWidth
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    margin="normal"
                                    required
                                />
                                <TextField
                                    label="Подтверждение пароля"
                                    type="password"
                                    fullWidth
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    margin="normal"
                                    required
                                    error={newPassword !== confirmPassword && confirmPassword !== ''}
                                    helperText={newPassword !== confirmPassword && confirmPassword !== '' ? 'Пароли не совпадают' : ''}
                                />
                            </Box>
                        </DialogContent>
                        <DialogActions sx={{ mt: 2 }}>
                            <Button onClick={handleClosePasswordDialog} color="secondary">
                                Отмена
                            </Button>
                            <Button 
                                onClick={handlePasswordChange} 
                                color="primary"
                                variant="contained"
                                disabled={!newPassword || !confirmPassword || newPassword !== confirmPassword || newPassword.length < 6}
                            >
                                Сохранить
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Paper>

                {/* Часть с добавлением категорий */}
                <Paper elevation={3} sx={{ p: 4, borderRadius: '12px', marginTop: "10px" }}>
                    <Typography variant="h4" align="center" gutterBottom sx={{ borderBottom: '1px solid black' }}>
                        Управление категориями и подкатегориями (создание заявки)
                    </Typography>
                    <Box sx={{ textAlign: 'center', mt: 4 }}>
                        <img
                            src="https://zgpc.ru/upload/medialibrary/801/801ae347c18e432657e395c91c6e5013.jpg"
                            alt="Описание изображения"
                            style={{ maxWidth: '100%', height: '300px', borderRadius: '8px' }}
                        />
                    </Box>
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
