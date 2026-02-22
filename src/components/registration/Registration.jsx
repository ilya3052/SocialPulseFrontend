import {useEffect, useState} from "react";
import {sendForDebug} from "../../utils/utils.js";
import styles from "./registration.module.css";
import * as VKID from "@vkid/sdk";
import {useNavigate} from "react-router-dom";

const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        password2: ''
    });

    const navigate = useNavigate();

    const passwordError =
        formData.password2 && formData.password !== formData.password2
            ? "Пароли не совпадают"
            : "";

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
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const sendRegistrationRequest = async (data) => {
        try {
            const response = await fetch("api/v2/accounts/register/", {
                method: "POST",
                body: JSON.stringify(data),
                headers: { "Content-Type": "application/json" },
            });

            if (response.status === 201) {
                const result = await response.json();
                localStorage.setItem("user_id", result.user.id);
                localStorage.setItem("username", result.user.username);
                localStorage.setItem("access_token", result.tokens.access);
                localStorage.setItem("refresh_token", result.tokens.refresh);
                navigate("/profile");
            } else if (response.status === 400) {
                const err = await response.text();
                await sendForDebug(err);
            } else {
                alert("Ошибка сервера");
            }
        } catch (err) {
            console.error(err);
            alert("Не удалось подключиться к серверу");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (passwordError) {
            return;
        }
        await sendRegistrationRequest(formData);
    };

    return (
        <div className={styles.registrationContainer}>
            <form onSubmit={(e) => handleSubmit(e)} className={styles.registrationForm}>
                <h2>Регистрация</h2>

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
                        className={styles.formControl}
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
                        className={styles.formControl}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="confirmPassword">Подтверждение пароля</label>
                    <input
                        type="password"
                        id="password2"
                        name="password2"
                        value={formData.password2}
                        onChange={handleChange}
                        placeholder="Подтвердите пароль"
                        required
                        className={`${styles.formControl} ${
                            passwordError ? styles.inputError : ""
                        }`}
                    />
                    {passwordError && (
                        <div className={styles.errorMessage}>{passwordError}</div>
                    )}
                </div>

                <button type="submit" className={styles.registerBtn}>
                    Зарегистрироваться
                </button>
                <p className={styles.mutedText}>Или зарегистрируйтесь через</p>
                <div className={styles.socialAuth}>
                    <div id="vkAuth" className={styles.authContainer}></div>
                    <div id="tgAuth" className={styles.authContainer}></div>
                </div>

                <p className={styles.loginLink}>
                    Уже зарегистрированы? <a href="/login">Войти</a>
                </p>
            </form>
        </div>
    );
}

export default RegistrationForm;