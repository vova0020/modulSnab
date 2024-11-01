/* eslint-disable */
// @ts-nocheck
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

    const handleItemChange = (index: number, field: string, value: string) => {
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
                <Box sx={{ flex: '2', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)', border: '1px solid #ddd' }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333', marginBottom: '20px', textAlign: 'center', borderBottom: '2px solid #1976d2', paddingBottom: '10px' }}>
                        Детали заявки
                    </Typography>

                    <TextField
                        label="Что заказано"
                        value={editedData?.items[0]?.item || ''}
                        onChange={(e) => handleItemChange(0, 'item', e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Сколько заказано"
                        value={editedData?.items[0]?.quantity || ''}
                        onChange={(e) => handleItemChange(0, 'quantity', e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Единица измерения"
                        value={editedData?.items[0]?.unitMeasurement || ''}
                        onChange={(e) => handleItemChange(0, 'unitMeasurement', e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Зачем"
                        value={editedData?.orderReason || ''}
                        onChange={(e) => handleChange('orderReason', e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Подкатегория"
                        value={editedData?.subOrderReason || ''}
                        onChange={(e) => handleChange('subOrderReason', e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Комментарий"
                        value={editedData?.comment || ''}
                        onChange={(e) => handleChange('comment', e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Срочность"
                        value={editedData?.promptness || ''}
                        onChange={(e) => handleChange('promptness', e.target.value)}
                        fullWidth
                        margin="normal"
                    />
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
