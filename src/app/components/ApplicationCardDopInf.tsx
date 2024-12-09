/* eslint-disable */
// @ts-nocheck
import React, { useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    TextField,
    Snackbar,
    Alert,
} from '@mui/material';
import { styled } from '@mui/system';
import EditIcon from '@mui/icons-material/Edit';
import MessageIcon from '@mui/icons-material/Message';
import EditApplicationDialog from './EditApplicationDialog';
import axios from 'axios';

interface ApplicationCardProps {
    number: string;
    date: string;
    status: string;
    onEdit: () => void;
}

const StyledCard = styled(Card)(({ theme, highlight }: { highlight?: boolean }) => ({
    minWidth: 150,
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    backgroundColor: highlight ? theme.palette.warning.light : theme.palette.background.paper,
    '&:hover': {
        transform: 'scale(1.02)',
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
    },
    position: 'relative',
}));

let statusLabel = ''
const getStatusColor = (app: string) => {
    // console.log(app?.status?.name);
    if(app.closed === true){
        statusLabel = 'Завершено';
        return 'success';
    }
    if (app?.status?.name === 'На уточнении') {
        statusLabel = 'Нужно уточнение';
        return 'warning';

    }
    if (app.workSupply === true) { // В работе у снабжения
        statusLabel = 'В работе у снабжения';
        return 'success';
    } else if (app.approvedForPurchase === false && app.cancellationPurchase === true) { // Согласование к закупке
        statusLabel = 'Не согласован';
        return 'error';
    } else if (app.approvedForPurchase === false && app.expectationPurchase === true) { // Согласование к покупке
        statusLabel = 'Отложено';
        return 'warning';
    } else if (app.approvedForPurchase === true) { // Согласование к покупке
        statusLabel = 'Согласовано';
        return 'success';
    } else if (app.approvedForPurchase === false) { // Согласование к закупке
        statusLabel = 'Ожидает согласования';
        return 'default';
    }
    

    // switch (status) {
    //     case 'В работе':
    //         return 'primary';
    //     case 'Завершена':
    //         return 'success';
    //     case 'В ожидании':
    //         return 'warning';
    //     case 'На уточнении':
    //         return 'error';
    //     default:
    //         return 'default';
    // }
};

const ApplicationCard: React.FC<ApplicationCardProps> = ({ number, date, app, items }) => {
    const isHighlight = status === 'На уточнении';
    const [isHovered, setIsHovered] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [openQuestionDialog, setOpenQuestionDialog] = useState(false);
    const [question, setQuestion] = useState<string | null>(null);
    const [answer, setAnswer] = useState<string>('');
    const [editData, setEditData] = useState<any>(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleEditClick = async () => {
        const fetchedEditData = await fetchEditDataFromDatabase(number);
        setEditData(fetchedEditData);
        setOpenDialog(true);
    };

    const handleQuestionClick = async () => {
        const fetchedQuestion = await fetchQuestionFromDatabase(number);
        console.log(fetchedQuestion);

        setQuestion(fetchedQuestion);
        setOpenQuestionDialog(true);
    };

    const handleSaveEdit = async (updatedData: any) => {
        // console.log(updatedData);

        await saveEditDataToDatabase(number, updatedData);
        setOpenDialog(false);
        setOpenSnackbar(true);
    };

    const handleSaveAnswer = async () => {
        await saveAnswerToDatabase(number, answer, question, app.creatorId);
        setOpenQuestionDialog(false);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };
    // Объект для сопоставления статусов с цветами
    const statusColors = {
        'Согласование к закупке': { background: '#f0f0f0', text: 'Ожидает согласования' },
        'Согласован к закупке': { background: '#0008ff', text: 'Согласовано' },
        'Согласование к оплате': { background: '#ccd71a', text: 'Ожидает согласование к оплате' },
        'Согласован к оплате': { background: '#ccd71a', text: 'Согласован к оплате' },
        'В работе': { background: '#ccd71a', text: 'В работе у снабжения' },
        'Оплачен': { background: '#ccd71a', text: 'Оплачен' },
        'Доставка': { background: '#ccd71a', text: 'Доставляется' },
        'Доставлено': { background: '#00ff10', text: 'Доставлено' },
        'Завершен': { background: '#00ff10', text: 'Завершена' },
        'Не согласовано': { background: '#db130b', text: 'Не согласовано' },
        'Повторное согласование': { background: '#db130b', text: 'На повторном согласование' },
        'Отложено': { background: '#ff5600', text: 'Отложено' },
        'На уточнении': { background: '#ff5600', text: 'Нужно уточнить' },
        'Новая': { background: '#f0f0f0', text: 'Отправлена в снабжение' },
        'default': { background: '#f0f0f0', text: 'В работе у снабжения' }
    };

    // Функция для получения цвета и текста на основе статуса
    const getStatusInfo = (status: string) => {
        return statusColors[status] || statusColors['default'];
    };

    return (
        <StyledCard
            variant="outlined"
            highlight={isHighlight}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            sx={{
                width: 'fit-content',  // Ширина подстраивается под контент
                maxWidth: '100%',      // Ограничение по ширине
                minWidth: '200px',     // Минимальная ширина для гибкости
            }}
        >
            <CardContent>
                <Box display="flex" flexDirection="column" mb={2}>
                    {app.approvedForPurchase === false &&
                        <Box display="flex" justifyContent='flex-end' >
                            <IconButton

                                color="#c56f00"
                                aria-label="edit"
                                onClick={handleEditClick}
                            >
                                <EditIcon />
                            </IconButton>
                        </Box>
                    }
                    {app?.status?.name === 'На уточнении' && (
                        <>
                            <Box display="flex" justifyContent='flex-end' >
                                <IconButton
                                    // sx={{ position: 'absolute', top: 8, right: 48 }}
                                    color="primary"
                                    aria-label="message"
                                    onClick={handleQuestionClick}
                                >
                                    <MessageIcon />
                                </IconButton>

                            </Box>

                        </>
                    )}

                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle1" gutterBottom>
                            Заявка № {number}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Дата создания заявки: {new Date(date).toLocaleDateString('ru-RU')}
                        </Typography>

                    </Box>
                    {items.map((item, index) => {
                        const status = getStatusInfo(item.status.name);
                        return (
                            <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{
                                    border: '1px solid #cacaca',
                                    borderRadius: 50,
                                    padding: '3px 12px',
                                    display: 'flex',  // Используем flexbox
                                    flexWrap: 'wrap', // Разрешаем перенос на следующую строку
                                    alignItems: 'center', // Центрируем элементы по вертикали

                                }}
                            >
                                Заказ - {item.item}. Количество - {item.quantity} {item.unitMeasurement}
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        // backgroundColor: status.background, // Цвет фона
                                        color: 'black', // Цвет текста
                                        border: '1px solid #888', // Рамка вокруг текста
                                        borderRadius: 50, // Скругленные углы
                                        padding: '3px 8px', // Отступы внутри текста
                                        marginLeft: '8px', // Отступ слева для разделения
                                        display: 'inline', // Чтобы текст "Статус" был в одной строке
                                    }}
                                >
                                 Сумма: {item.amount || '...нет данных'}

                                </Typography>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        // backgroundColor: status.background, // Цвет фона
                                        color: 'black', // Цвет текста
                                        border: '1px solid #888', // Рамка вокруг текста
                                        borderRadius: 50, // Скругленные углы
                                        padding: '3px 8px', // Отступы внутри текста
                                        marginLeft: '8px', // Отступ слева для разделения
                                        display: 'inline', // Чтобы текст "Статус" был в одной строке
                                    }}
                                >
                                 Дата доставки: {item.deliveryDeadline ? new Date(item.deliveryDeadline).toLocaleDateString('ru-RU') : '...нет данных'}


                                </Typography>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        backgroundColor: status.background, // Цвет фона
                                        color: 'black', // Цвет текста
                                        border: '1px solid #888', // Рамка вокруг текста
                                        borderRadius: 50, // Скругленные углы
                                        padding: '3px 8px', // Отступы внутри текста
                                        marginLeft: '8px', // Отступ слева для разделения
                                        display: 'inline', // Чтобы текст "Статус" был в одной строке
                                    }}
                                >
                                    Статус: {status.text}
                                </Typography>
                            </Typography>
                        )
                    })}

                </Box>
                <Box mt={1}>
                    <Chip
                        label={statusLabel}
                        color={getStatusColor(app)}
                        sx={{
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            padding: '4px 8px',
                            borderRadius: '4px',
                        }}
                    />
                </Box>

                {/* Редактирование */}
            </CardContent>
            <EditApplicationDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                selectedApplication={editData}
                onSave={handleSaveEdit}
            />
            {/* Уточнение */}
            <Dialog open={openQuestionDialog} onClose={() => setOpenQuestionDialog(false)}>
                <DialogTitle>Вопрос для уточнения</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ fontWeight: 'bold', color: 'black', fontSize: '1.1rem' }}>
                        {`Уточнить: ${question?.question || 'Загрузка вопроса...'}`}
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Ваш ответ"
                        fullWidth
                        variant="outlined"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenQuestionDialog(false)} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={handleSaveAnswer} color="primary">
                        Отправить
                    </Button>
                    <Button onClick={handleEditClick} color="primary">
                        Редактировать
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} variant="filled" severity="success" sx={{ width: '100%' }}>
                    Данные успешно сохранены!
                </Alert>
            </Snackbar>
        </StyledCard>
    );
};

export default ApplicationCard;

// Функции для взаимодействия с базой данных
async function fetchEditDataFromDatabase(requestId: number): Promise<any> {
    const response = await axios.get('/api/personalCabinetPage/getRequestAplicationCard', {
        params: { requestId },
    });
    return response.data;
}

async function fetchQuestionFromDatabase(requestId: string): Promise<string | null> {
    const response = await axios.get('/api/getClarification', {
        params: { requestId },
    });
    // console.log(response.data);

    return response.data;
}

async function saveEditDataToDatabase(applicationNumber: string, updatedData: any): Promise<void> {
    const response = await axios.put('/api/personalCabinetPage/getRequestAplicationCard', { applicationNumber, updatedData });
}

async function saveAnswerToDatabase(applicationNumber: string, answer: string, question: any, userId): Promise<void> {
    console.log(`Сохранение ответа для заявки №${applicationNumber}: ${answer}`);
    const response = await axios.put('/api/personalCabinetPage/putAnswerAplicationCard', { applicationNumber, answer, question, userId });
}
