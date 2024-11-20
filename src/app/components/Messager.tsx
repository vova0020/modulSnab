'use client'
import axios from 'axios';
import React, { useEffect, useState } from 'react'



export default function Messager({ requestId }) {
    const [data, setData] = useState([]); // Хранит заявки

    const fetchRequests = async (requestId: number) => {
        try {
            if (requestId != null) {
                const response = await axios.get('/api/getMessage', {
                    params: { requestId },
                });
                const sortedData = response.data.sort((a: any, b: any) => a.id - b.id);
                setData(sortedData);
                // console.log(sortedData);

            }
        } catch (error) {
            console.error('Ошибка при загрузке заявок:', error);
        }
    };

    useEffect(() => {
        fetchRequests(requestId);
        const intervalId = setInterval(() => {
            fetchRequests(requestId); // Обновляем данные
        }, 6000); // Обновляем каждые 5 секунд

        // Очищаем интервал при размонтировании компонента
        return () => clearInterval(intervalId);

    }, [requestId]);

    // useEffect(() => {
    //     console.log(data);


    // }, [data]);




    return (
        <div style={{ padding: '1rem', maxWidth: '400px', margin: 'auto', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
            <h2>Переписка</h2>
            {data.length === 0 ? (
                <p>Нет сообщений</p>
            ) : (
                <div
                    style={{
                        maxHeight: '500px', // Задаем максимальную высоту блока для отображения прокрутки
                        overflowY: 'auto', // Добавляем прокрутку по вертикали
                        paddingRight: '8px', // Убираем часть скроллбара для аккуратности
                    }}
                >
                    {data.slice(-3).map((message) => ( // Берем только три последних сообщения
                        <div
                            key={message.id}
                            style={{
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                padding: '1rem',
                                marginBottom: '1rem',
                                backgroundColor: '#eaf4ff' , // Разные цвета для вопросов и ответов
                                wordWrap: 'break-word', // Разрешает перенос длинных слов на новую строку
                                overflowWrap: 'break-word', // Поддержка для старых браузеров
                            }}
                        >
                            <div>
                                <div style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                    Отправитель: {message.user.firstName} {message.user.lastName}
                                </div>
                                <div style={{ marginBottom: '0.5rem' }}>
                                    <strong>{'Вопрос'}:</strong>{' '}
                                    {message.question }
                                </div>
                                <div style={{ fontSize: '0.85rem', color: '#666' }}>
                                    Дата: {new Date(message.createdAt).toLocaleString()}
                                </div>
                            </div>
                            {message.responses.length > 0 && (
                                <div
                                    style={{
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        padding: '1rem',
                                        marginBottom: '1rem',
                                        backgroundColor: '#fff9e6', // Разные цвета для вопросов и ответов
                                        wordWrap: 'break-word', // Разрешает перенос длинных слов на новую строку
                                        overflowWrap: 'break-word', // Поддержка для старых браузеров
                                    }}
                                >
                                    <div style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                        Отправитель: {message.responses[0].user.firstName} {message.responses[0].user.lastName}
                                    </div>
                                    <div style={{ marginBottom: '0.5rem' }}>
                                        <strong>{'Ответ'}:</strong> {message.responses[0].responseText}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#666' }}>
                                        Дата: {new Date(message.responses[0].createdAt).toLocaleString()}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
    
}