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

const getStatusColor = (status: string) => {
    switch (status) {
        case 'В работе':
            return 'primary';
        case 'Завершена':
            return 'success';
        case 'В ожидании':
            return 'warning';
        case 'На уточнении':
            return 'error';
        default:
            return 'default';
    }
};

const ApplicationCard: React.FC<ApplicationCardProps> = ({ number, date, status, item, quantity, unitMeasurement }) => {
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
        setQuestion(fetchedQuestion.question);
        setOpenQuestionDialog(true);
    };

    const handleSaveEdit = async (updatedData: any) => {
        await saveEditDataToDatabase(number, updatedData);
        setOpenDialog(false);
        setOpenSnackbar(true);
    };

    const handleSaveAnswer = async () => {
        await saveAnswerToDatabase(number, answer);
        setOpenQuestionDialog(false);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <StyledCard
            variant="outlined"
            highlight={isHighlight}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <CardContent>
                <Box display="flex" flexDirection="column" mb={2}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Заявка № {number}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Дата: {new Date(date).toLocaleDateString('ru-RU')}
                        </Typography>

                    </Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Заказ -  {`${item}.  Количество - ${quantity} ${unitMeasurement}`}
                    </Typography>
                </Box>
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

                {isHovered && isHighlight && (
                    <>
                        <IconButton
                            sx={{ position: 'absolute', top: 8, right: 48 }}
                            color="primary"
                            aria-label="message"
                            onClick={handleQuestionClick}
                        >
                            <MessageIcon />
                        </IconButton>
                        <IconButton
                            sx={{ position: 'absolute', top: 8, right: 8 }}
                            color="primary"
                            aria-label="edit"
                            onClick={handleEditClick}
                        >
                            <EditIcon />
                        </IconButton>
                    </>
                )}
            </CardContent>
            <EditApplicationDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                selectedApplication={editData}
                onSave={handleSaveEdit}
            />
            <Dialog open={openQuestionDialog} onClose={() => setOpenQuestionDialog(false)}>
                <DialogTitle>Вопрос для уточнения</DialogTitle>
                <DialogContent>
                    <DialogContentText>{`Уточнить: ${question || 'Загрузка вопроса...'}`}</DialogContentText>
                    {/* <TextField
                        autoFocus
                        margin="dense"
                        label="Ваш ответ"
                        fullWidth
                        variant="outlined"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                    /> */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenQuestionDialog(false)} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={handleSaveAnswer} color="primary">
                        Отправить
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
    const response = await axios.get('/api/getRequestAplicationCard', {
        params: { requestId },
    });
    return response.data;
}

async function fetchQuestionFromDatabase(requestId: string): Promise<string | null> {
    const response = await axios.get('/api/getClarification', {
        params: { requestId },
    });
    console.log(response.data);

    return response.data;
}

async function saveEditDataToDatabase(applicationNumber: string, updatedData: any): Promise<void> {
    const response = await axios.put('/api/getRequestAplicationCard', { applicationNumber, updatedData });
}

async function saveAnswerToDatabase(applicationNumber: string, answer: string): Promise<void> {
    console.log(`Сохранение ответа для заявки №${applicationNumber}: ${answer}`);
}
