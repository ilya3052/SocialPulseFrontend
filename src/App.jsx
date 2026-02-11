import React, {useEffect, useRef, useState} from 'react';
import EmailActivate from './pages/EmailActivate.jsx';
import * as VKID from '@vkid/sdk';

function App() {
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);

    // Предполагаемый URL для привязки — при необходимости замените на нужный
    const BIND_URL = '';

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
        script.setAttribute('data-auth-url', 'https://socialpulse.sandbox.com/api/v1/accounts/tg/callback/');
        script.setAttribute('data-request-access', 'write');

        const container = document.getElementById('telegram-login-container');
        if (container) {
            container.appendChild(script);
        }

        // Очистка при размонтировании
        return () => {
            if (container && script.parentNode === container) {
                container.removeChild(script);
            }
        };
    }, []);

    useEffect(() => {
        VKID.Config.init({
            app: 54438538,
            redirectUrl: 'https://socialpulse.sandbox.com',
            source: VKID.ConfigSource.LOWCODE,
            responseMode: 'callback',
            scope: 'email phone',
        });
        const oneTap = new VKID.OneTap();

        const container = document.getElementById('bindVKSdk');
        if (container) {
            oneTap.render({
                container: container,
                showAlternativeLogin: true,
                skin: 'secondary',
                styles: {
                    width: 40,
                    height: 32
                }
            })
        }

        oneTap.on(VKID.OneTapInternalEvents.LOGIN_SUCCESS, onVKIDSuccess);
        return () => {
            oneTap.close();
        };
    }, []);

    useEffect(() => {
        VKID.Config.init({
            app: 54438538,
            redirectUrl: 'https://socialpulse.sandbox.com',
            source: VKID.ConfigSource.LOWCODE,
            responseMode: 'callback',
            scope: 'email phone',
        });
        const oneTap = new VKID.OneTap();

        const container = document.getElementById('VkIdSdkOneTap');

        if (container) {
            oneTap.render({
                container: container,
                showAlternativeLogin: true,
                styles: {
                    width: 310,
                    height: 38
                }
            })
        }

        oneTap.on(VKID.OneTapInternalEvents.LOGIN_SUCCESS, onVKIDSuccess);

        // Опционально: обработка других событий
        // oneTap.on(VKID.OneTapInternalEvents.LOGIN_FAILED, ...);

        return () => {
            oneTap.close();
        };
    }, []);

    const onVKIDSuccess = async (payload) => {
        console.log('LOGIN_SUCCESS payload:', payload);

        const code = payload.code;
        const deviceId = payload.device_id;

        if (!code || !deviceId) {
            console.warn('Нет code или device_id');
            return;
        }

        try {
            const tokens = await VKID.Auth.exchangeCode(code, deviceId);

            localStorage.setItem('vk_access_token', tokens.access_token);
            localStorage.setItem('vk_refresh_token', tokens.refresh_token);
            localStorage.setItem('vk_id_token', tokens.id_token);

            const res = await fetch('/api/v1/accounts/vk/callback/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    access_token: tokens.access_token,
                    refresh_token: tokens.refresh_token ?? null,
                    id_token: tokens.id_token ?? null,
                    expires_in: tokens.expires_in,
                }),
            });

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(`Бэкенд: ${res.status} — ${errText}`);
            }

            const backendData = await res.json();
            console.log('Бэкенд ответил:', backendData);

            const access_token = backendData.request.access_token;
            const refresh_token = backendData.request.refresh_token;
            const vk_id = backendData.request.vk_id;
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
            localStorage.setItem('vk_id', vk_id);

            window.location.replace('https://socialpulse.sandbox.com/profile');

            // alert(access_token + ' ' + refresh_token);

        } catch (err) {
            console.error('Ошибка финализации VK:', err);
            alert('Ошибка авторизации: ' + (err.message || err));
        }
    }


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
            <div id="VkIdSdkOneTap" style={{ minHeight: '44px' }}></div>
            <div id="bindVKSdk" style={{ minHeight: '45px'}}></div>
        </div>
    );
}

export default App;