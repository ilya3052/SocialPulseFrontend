import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

import styles from "./login.module.css";
import * as VKID from "@vkid/sdk";
import {sendForDebug} from "../../utils/utils.js";
import { initializeVKID, createVKAuthSuccessHandler } from "../../pages/OneTapVKAuth.jsx";
import { initializeTelegramWidget, createTGAuthHandler } from "../../pages/TGAuth.jsx";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_VERSION = import.meta.env.VITE_API_VERSION;

const LoginForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const navigate = useNavigate();

    useEffect(() => {
        const cleanup = initializeTelegramWidget(createTGAuthHandler(navigate));
        return cleanup;
    }, [navigate]);

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
        const result = await fetch(`${BASE_URL}/${API_VERSION}/accounts/token/`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
        });
        if (result.status === 200) {
            const data = await result.json();
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

    useEffect(() => {
        const cleanup = initializeVKID(createVKAuthSuccessHandler(navigate));
        return cleanup;
    }, [navigate]);

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