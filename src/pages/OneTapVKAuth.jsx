import * as VKID from '@vkid/sdk';
import { sendForDebug } from '../utils/utils.js';

/**
 * Обмен code и deviceId на VK токены
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_VERSION = import.meta.env.VITE_API_VERSION;

export const exchangeCode = async (code, deviceId) => {
    const tokens = await VKID.Auth.exchangeCode(code, deviceId);
    localStorage.setItem('vk_access_token', tokens.access_token);
    localStorage.setItem('vk_refresh_token', tokens.refresh_token);
    localStorage.setItem('vk_id_token', tokens.id_token);
    return tokens;
};

/**
 * Отправка обменённых токенов на бэкенд
 */
export const sendExchangedCodes = async (tokens) => {
    const res = await fetch(`${BASE_URL}/${API_VERSION}/accounts/vk/callback/`, {
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

    const access_token = backendData.request.access_token;
    const refresh_token = backendData.request.refresh_token;
    const vk_id = backendData.request.vk_id;

    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    localStorage.setItem('vk_id', vk_id);
};

/**
 * Инициализация VKID OneTap и настройка обработчика успешной авторизации
 */
export const initializeVKID = (onSuccess) => {
    VKID.Config.init({
        app: 54438538,
        redirectUrl: 'https://socialpulse.sandbox.com',
        source: VKID.ConfigSource.LOWCODE,
        responseMode: 'callback',
        scope: 'email phone',
    });

    const oneTap = new VKID.OneTap();
    const container = document.getElementById('vkAuth');

    if (container) {
        oneTap.render({
            container: container,
            showAlternativeLogin: true,
            styles: {
                width: 240,
                height: 40
            }
        });
    }

    oneTap.on(VKID.OneTapInternalEvents.LOGIN_SUCCESS, onSuccess);

    return () => {
        oneTap.close();
    };
};

/**
 * Обработчик успешной авторизации через VK (используется как callback для initializeVKID)
 */
export const createVKAuthSuccessHandler = (navigate) => {
    return async (payload) => {
        const code = payload.code;
        const deviceId = payload.device_id;

        if (!code || !deviceId) {
            console.warn('Нет code или device_id');
            return;
        }
        try {
            const tokens = await exchangeCode(code, deviceId);
            await sendExchangedCodes(tokens);
        } catch (error) {
            await sendForDebug(error);
            return;
        }
        navigate('/profile');
    };
};

