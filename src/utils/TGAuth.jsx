import {sendForDebug} from './utils.js';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_VERSION = import.meta.env.VITE_API_VERSION;

/**
 * Обработчик успешной авторизации через Telegram
 */
export const handleTelegramAuth = async (user, navigate) => {
    // user содержит:
    // id, first_name, last_name, username, photo_url, auth_date, hash
    const params = new URLSearchParams(user).toString();
    const res = await fetch(`${BASE_URL}/${API_VERSION}/accounts/tg/callback/?${params}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (res.ok) {
        const data = await res.json();
        console.log(data);
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        navigate('/profile');
    } else {
        const errText = await res.text();
        await sendForDebug(errText);
    }
};

/**
 * Создаёт callback функцию для обработчика Telegram авторизации
 */
export const createTGAuthHandler = (navigate) => {
    return async (user) => {
        await handleTelegramAuth(user, navigate);
    };
};

/**
 * Инициализирует Telegram виджет и настраивает обработчик успешной авторизации
 */
export const initializeTelegramWidget = (onAuthCallback) => {
    // Устанавливаем глобальный обработчик для Telegram виджета
    window.onTelegramAuth = onAuthCallback;

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.setAttribute('data-telegram-login', 'socialpulsesandboxbot');
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.setAttribute('data-request-access', 'write');

    const container = document.getElementById('tgAuth');
    if (container) {
        container.appendChild(script);
    }

    return () => {
        if (container && script.parentNode === container) {
            container.removeChild(script);
        }
    };
};
