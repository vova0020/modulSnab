import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Typography,
} from '@mui/material';

interface EditApplicationDialogProps {
    open: boolean;
    onClose: () => void;
    selectedApplication: any | null;
    onSave: (updatedData: any) => Promise<void>;
}

const EditApplicationDialog: React.FC<EditApplicationDialogProps> = ({ open, onClose, selectedApplication, onSave }) => {
    const [editedData, setEditedData] = useState(selectedApplication);

    useEffect(() => {
        if (selectedApplication) {
            setEditedData(selectedApplication);
        }
    }, [selectedApplication]);

    const handleChange = (field: string, value: string) => {
        setEditedData((prevData: any) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const handleItemChange = (index: number, field: string, value: number | string) => {
        const updatedItems = [...editedData.items];
        updatedItems[index] = { ...updatedItems[index], [field]: value };
        setEditedData((prevData: any) => ({
          ...prevData,
          items: updatedItems,
        }));
      };
      

    const handleSave = async () => {
        await onSave(editedData);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Редактирование заявки № {editedData?.number}</DialogTitle>
            <DialogContent>
                <Box sx={{ flex: '2', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)', border: '1px solid #ddd' }}>
                    {/* Основные данные заявки */}
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', marginBottom: '16px', borderBottom: '2px solid #1976d2', paddingBottom: '10px' }}>
                        Основные данные заявки
                    </Typography>
                    <TextField
                        label="Зачем"
                        value={editedData?.orderReason || ''}
                        onChange={(e) => handleChange('orderReason', e.target.value)}
                        fullWidth
                        margin="normal"
                        InputProps={{ readOnly: true }}
                    />
                    <TextField
                        label="Подкатегория"
                        value={editedData?.subOrderReason || ''}
                        onChange={(e) => handleChange('subOrderReason', e.target.value)}
                        fullWidth
                        margin="normal"
                        InputProps={{ readOnly: true }}
                    />
                    <TextField
                        label="Комментарий"
                        value={editedData?.comment || ''}
                        onChange={(e) => handleChange('comment', e.target.value)}
                        fullWidth
                        margin="normal"
                    />

                    {/* Разделитель для позиций */}
                    <Box sx={{ marginTop: '30px', borderTop: '2px solid #1976d2', paddingTop: '16px' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', marginBottom: '16px' }}>
                            Позиции заявки
                        </Typography>

                        {/* Рендерим поля для каждого item в items */}
                        {editedData?.items?.map((item: any, index: number) => (
                            <Box key={index} sx={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f4f8', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
                                    Позиция {index + 1}
                                </Typography>
                                <TextField
                                    label="Что заказано"
                                    value={item?.item || ''}
                                    onChange={(e) => handleItemChange(index, 'item', e.target.value)}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="Сколько заказано"
                                    value={item?.quantity || ''}
                                    onChange={(e) => {
                                        // Проверяем, чтобы введенное значение было числом
                                        const newValue = e.target.value;
                                        // Преобразуем строку в число, если это возможно
                                        if (/^\d*$/.test(newValue)) {
                                            // Если значение пустое, передаем 0, иначе передаем число
                                            handleItemChange(index, 'quantity', newValue === '' ? 0 : parseFloat(newValue));
                                        }
                                    }}
                                    fullWidth
                                    margin="normal"
                                    type="number" // Используем type="number" для лучшей поддержки на мобильных устройствах
                                    inputProps={{ min: 0 }} // Ограничиваем минимальное значение
                                />

                                <TextField
                                    label="Единица измерения"
                                    value={item?.unitMeasurement || ''}
                                    onChange={(e) => handleItemChange(index, 'unitMeasurement', e.target.value)}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="Срочность"
                                    value={item?.promptness || ''}
                                    onChange={(e) => handleItemChange(index, 'promptness', e.target.value)}
                                    fullWidth
                                    margin="normal"
                                />
                            </Box>
                        ))}
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Отмена</Button>
                <Button onClick={handleSave}>Сохранить</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditApplicationDialog;
