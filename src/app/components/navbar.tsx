'use client';
import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode'; // Импортируем библиотеку для декодирования токена

interface DecodedToken {
  role: string; // Предполагаем, что в токене есть поле 'role'
  sector: string; // Предполагаем, что в токене есть поле 'sector'
}

const Navbar: React.FC = () => {

  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null); // Состояние для хранения роли пользователя
// Состояние для хранения сектора пользователя
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('token'); // Получаем токен
    if (storedToken) {
      setToken(storedToken); // Сохраняем токен в стейте
      try {
        const decoded: DecodedToken = jwtDecode(storedToken); // Декодируем JWT
        setRole(decoded.role); // Сохраняем роль в состоянии
       
      } catch (error) {
        console.error("Ошибка при декодировании токена:", error);
      }
    }
  }, []); // Выполняется только при первом рендере

 

  const handleLogout = () => {
    localStorage.removeItem('token'); // Удаляем токен при выходе
    router.push('/pages/auth'); // Перенаправление на страницу авторизации
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#333' }}>
      <Toolbar sx={{ color: 'white' }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          MyApp
        </Typography>

        <Link href="/" passHref>
          <Button color="inherit">Home</Button>
        </Link>
        <Link href="/pages/applicationsTable" passHref>
          <Button color="inherit">Согласование</Button>
        </Link>
        <Link href="/pages/procurementPage" passHref>
          <Button color="inherit">Снабжение</Button>
        </Link>
        <Link href="/pages/createRequest" passHref>
          <Button color="inherit">Создание заявки</Button>
        </Link>
        <Link href="/pages/createUsers" passHref>
          <Button color="inherit">Создание пользователя</Button>
        </Link>
        {/* <Link href="/pages/createRequest" passHref>
          <Button color="inherit">Создание заявки</Button>
        </Link> */}

       

        {/* Элементы для других ролей */}
        {role && (
          <>
            <Button color="inherit" onClick={handleLogout}>Выйти</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
