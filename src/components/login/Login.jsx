import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

import styles from "./login.module.css";
import * as VKID from "@vkid/sdk";
import {sendForDebug} from "../../utils/utils.js";

const LoginForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const navigate = useNavigate();

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://telegram.org/js/telegram-widget.js?22';
        script.async = true;
        script.setAttribute('data-telegram-login', 'socialpulsesandboxbot');
        script.setAttribute('data-size', 'large');
        // script.setAttribute('data-userpic',"false");
        script.setAttribute('data-auth-url', 'https://socialpulse.sandbox.com/api/v2/accounts/tg/callback/');
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
    }, []);

    const exchangeCode = async (code, deviceId) => {
        const tokens = await VKID.Auth.exchangeCode(code, deviceId);
        localStorage.setItem('vk_access_token', tokens.access_token);
        localStorage.setItem('vk_refresh_token', tokens.refresh_token);
        localStorage.setItem('vk_id_token', tokens.id_token);
        return tokens;
    }

    const sendExchangedCodes = async (tokens) => {
        const res = await fetch('/api/v2/accounts/vk/callback/', {
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
    }

    const onVKIDSuccess = async (payload) => {
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
    }

    useEffect(() => {
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
            })
        }

        oneTap.on(VKID.OneTapInternalEvents.LOGIN_SUCCESS, onVKIDSuccess);

        return () => {
            oneTap.close();
        };
    }, []);



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await sendLoginRequest(formData);
    }

    const sendLoginRequest = async (data) => {
        const result = await fetch('https://socialpulse.sandbox.com/api/v2/accounts/token/', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
        });
        if (result.status === 200) {
            const data = await result.json();
            alert(data);
            localStorage.setItem('refresh_token', data.refresh);
            localStorage.setItem('access_token', data.access);
            navigate('/profile', { replace: true });
        }
        else if (result.status === 400) {
            const err = await result.text();
            await sendForDebug(err);
        }
        else if (result.status === 401) {
            const err = await result.text();
            await sendForDebug(err);
        }
    }
    return (
        <div className={styles.loginContainer}>
            <form onSubmit={(e) => handleSubmit(e)} className={styles.loginForm}>
                <h2>Вход</h2>

                <div className={styles.formGroup}>
                    <label htmlFor="username">Имя пользователя</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Введите username"
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="password">Пароль</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Введите пароль"
                        required
                    />
                </div>


                <button type="submit" className={styles.loginBtn}>
                    Войти
                </button>
                <p className={styles.mutedText}>Или войдите через</p>
                <div className={styles.socialAuth}>
                    <div id="vkAuth" className={styles.authContainer}></div>
                    <div id="tgAuth" className={styles.authContainer}></div>
                </div>

                <p className={styles.registerLink}>
                    Еще не зарегистрированы? <a href="/registration">Присоединиться</a>
                </p>
            </form>
        </div>
    );

};

export default LoginForm;