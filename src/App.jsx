import React, { useEffect, useState } from 'react';
import EmailActivate from './pages/EmailActivate.jsx';

function App() {
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);

    // Предполагаемый URL для привязки — при необходимости замените на нужный
    const BIND_URL = 'http://127.0.0.1/api/v1/accounts/tg/token/short/';

    // Если текущий путь - страница активации email, показываем отдельный компонент
    if (typeof window !== 'undefined' && window.location.pathname === '/email/activate') {
        return <EmailActivate />;
    }

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://telegram.org/js/telegram-widget.js?22';
        script.async = true;
        script.setAttribute('data-telegram-login', 'socialpulsesandboxbot');
        script.setAttribute('data-size', 'large');
        script.setAttribute('data-auth-url', 'http://127.0.0.1/api/v1/accounts/tg/callback/');
        script.setAttribute('data-request-access', 'write');

        document.getElementById('telegram-login-container').appendChild(script);
    }, []);

    const handleBind = async (e) => {
        e && e.preventDefault();
        if (!inputValue) {
            alert('Пожалуйста, введите значение в поле.');
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(BIND_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${inputValue}`
                },
                body: JSON.stringify({ jwt_token: inputValue })
            });

            if (!res.ok) {
                const txt = await res.text();
                throw new Error(`Сервер вернул ошибку ${res.status}: ${txt}`);
            }

            // Попытаемся прочитать JSON, иначе текст
            let token = null;
            const contentType = res.headers.get('content-type') || '';
            if (contentType.includes('application/json')) {
                const data = await res.json();
                // поддерживаем разные формы ответа
                token = data.short_token;
            } else {
                token = await res.text();
            }

            if (!token) {
                throw new Error('Получен пустой токен от сервера');
            }

            const url = `https://t.me/socialpulsesandboxbot?start=${encodeURIComponent(token)}`;
            // Открываем ссылку в новой вкладке
            window.open(url, '_blank');
        } catch (err) {
            console.error(err);
            alert('Ошибка при привязке: ' + err.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div style={{ padding: 20 }}>
            <div id="telegram-login-container"></div>

            <div style={{ marginTop: 12 }}>
                <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Вставьте текст (param)"
                    style={{ width: '100%', padding: 8, boxSizing: 'border-box' }}
                />
                <div style={{ marginTop: 8 }}>
                    <a href="#" onClick={handleBind}>{loading ? 'Отправка...' : 'Привязать телеграм'}</a>
                </div>
            </div>
        </div>
    );
}

export default App;
