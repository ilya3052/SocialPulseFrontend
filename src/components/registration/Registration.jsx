import {useEffect, useState} from "react";
import {sendForDebug} from "../../utils/utils.js";
import styles from "./registration.module.css";
import * as VKID from "@vkid/sdk";

const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        password2: ''
    });

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

        oneTap.on(VKID.OneTapInternalEvents.LOGIN_SUCCESS,() => {});

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

    const sendRegistrationRequest = async (data) => {
        const response = await fetch(
            'api/v2/accounts/register/', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {'Content-Type': 'application/json'}
            }
        );
        if (response.status === 201) {
            const data = await response.json();
            alert(data.user.id);
            localStorage.setItem('user_id', data.user.id);
            localStorage.setItem('username', data.user.username);
            localStorage.setItem('access_token', data.tokens.access);
            localStorage.setItem('refresh_token', data.tokens.refresh);
        }
        else if (response.status === 400) {
            const err = await response.text();
            await sendForDebug(err);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
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
                    />
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