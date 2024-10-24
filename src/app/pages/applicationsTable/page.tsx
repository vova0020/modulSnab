'use client'
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, Button, Typography
} from '@mui/material';
import { styled } from '@mui/system';

type TableRowData = {
  id: number;
  kto: string;
  chto: string;
  kol: number;
  zachem: string;
  soglasovatKZakazu: string;
  schetNomer: string;
  summa: number;
  soglasovatPokupku: string;
};

const initialData: TableRowData[] = [
  { id: 1, kto: 'Иванов', chto: 'Товар 1', kol: 10, zachem: 'Для проекта', soglasovatKZakazu: 'Да', schetNomer: '123', summa: 1000, soglasovatPokupku: 'Да' },
  { id: 2, kto: 'Петров', chto: 'Товар 2', kol: 5, zachem: 'Для теста', soglasovatKZakazu: 'Нет', schetNomer: '456', summa: 500, soglasovatPokupku: 'Отложить' },
  { id: 3, kto: 'Сидоров', chto: 'Товар 3', kol: 20, zachem: 'Для работы', soglasovatKZakazu: 'Отложить', schetNomer: '789', summa: 2000, soglasovatPokupku: 'Нет' },
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: '#F7F7F7',
  color: '#333',
  padding: '16px',
  textAlign: 'center',
}));

const StyledTableRow = styled(TableRow)(({ theme, status }: { theme?: any, status: string }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#FAFAFA',
  },
  '&:hover': {
    backgroundColor: '#f0f0f0',
  },
  backgroundColor: () => {
    if (status === 'Да') return '#C8E6C9';  // Зеленый для "Да"
    if (status === 'Нет') return '#FFCDD2';  // Красный для "Нет"
    if (status === 'Отложить') return '#FFF9C4';  // Желтый для "Отложить"
    return 'inherit';
  },
}));

const StyledSelect = styled(Select)({
  width: '150px',
  padding: '8px',
  backgroundColor: '#fff',
  borderRadius: '4px',
  '& .MuiSelect-select': {
    padding: '10px',
  },
});

const SubmitButton = styled(Button)({
  backgroundColor: '#4CAF50',
  color: '#fff',
  marginTop: '20px',
  '&:hover': {
    backgroundColor: '#45A049',
  },
});

const FilterSelect = styled(Select)({
  marginRight: '10px',
  width: '200px',
});

const TablePage = () => {
  const { control, handleSubmit } = useForm();
  const [filterKZakazu, setFilterKZakazu] = useState<string>('');
  const [filterPokupku, setFilterPokupku] = useState<string>('');
  const [filteredData, setFilteredData] = useState<TableRowData[]>(initialData);

  const handleFilterChange = () => {
    const filtered = initialData.filter((row) =>
      (filterKZakazu === '' || row.soglasovatKZakazu === filterKZakazu) &&
      (filterPokupku === '' || row.soglasovatPokupku === filterPokupku)
    );
    setFilteredData(filtered);
  };

  const onSubmit = (formData: any) => {
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '20px' }}>
      <Typography variant="h5" gutterBottom style={{ fontWeight: 'bold', marginBottom: '20px' }}>
        Регистрация запроса
      </Typography>

      <div style={{ marginBottom: '20px' }}>
        <FilterSelect
          value={filterKZakazu}
          onChange={(e) => {
            setFilterKZakazu(e.target.value as string);
            handleFilterChange();
          }}
          displayEmpty
        >
          <MenuItem value="">Все статусы к заказу</MenuItem>
          <MenuItem value="Да">Да</MenuItem>
          <MenuItem value="Нет">Нет</MenuItem>
          <MenuItem value="Отложить">Отложить</MenuItem>
        </FilterSelect>

        <FilterSelect
          value={filterPokupku}
          onChange={(e) => {
            setFilterPokupku(e.target.value as string);
            handleFilterChange();
          }}
          displayEmpty
        >
          <MenuItem value="">Все статусы покупки</MenuItem>
          <MenuItem value="Да">Да</MenuItem>
          <MenuItem value="Нет">Нет</MenuItem>
          <MenuItem value="Отложить">Отложить</MenuItem>
        </FilterSelect>
      </div>

      <TableContainer component={Paper} style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>№</StyledTableCell>
              <StyledTableCell>Кто</StyledTableCell>
              <StyledTableCell>Что</StyledTableCell>
              <StyledTableCell>Кол</StyledTableCell>
              <StyledTableCell>Зачем</StyledTableCell>
              <StyledTableCell>Согласовать к заказу</StyledTableCell>
              <StyledTableCell>Счет №</StyledTableCell>
              <StyledTableCell>Сумма</StyledTableCell>
              <StyledTableCell>Согласовать покупку</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row) => (
              <StyledTableRow
                key={row.id}
                status={row.soglasovatKZakazu} // Используем значение для подсветки строки
              >
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.kto}</TableCell>
                <TableCell>{row.chto}</TableCell>
                <TableCell>{row.kol}</TableCell>
                <TableCell>{row.zachem}</TableCell>
                <TableCell>
                  <Controller
                    name={`soglasovatKZakazu_${row.id}`}
                    control={control}
                    defaultValue={row.soglasovatKZakazu}
                    render={({ field }) => (
                      <StyledSelect {...field} variant="outlined">
                        <MenuItem value="Да">Да</MenuItem>
                        <MenuItem value="Отложить">Отложить</MenuItem>
                        <MenuItem value="Нет">Нет</MenuItem>
                      </StyledSelect>
                    )}
                  />
                </TableCell>
                <TableCell>{row.schetNomer}</TableCell>
                <TableCell>{row.summa}</TableCell>
                <TableCell>
                  <Controller
                    name={`soglasovatPokupku_${row.id}`}
                    control={control}
                    defaultValue={row.soglasovatPokupku}
                    render={({ field }) => (
                      <StyledSelect {...field} variant="outlined">
                        <MenuItem value="Да">Да</MenuItem>
                        <MenuItem value="Нет">Нет</MenuItem>
                        <MenuItem value="Отложить">Отложить</MenuItem>
                      </StyledSelect>
                    )}
                  />
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <SubmitButton type="submit">Отправить</SubmitButton>
    </form>
  );
};

export default TablePage;
