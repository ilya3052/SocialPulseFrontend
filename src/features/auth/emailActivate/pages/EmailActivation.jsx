import {useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import styles from "./EmailActivation.module.css";

const ACTIVATE_URL = `${import.meta.env.VITE_API_BASE_URL}/${import.meta.env.VITE_API_VERSION}/accounts/email/activate/`;

export default function EmailActivation() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [status, setStatus] = useState("idle");
    const [message, setMessage] = useState("");

    const token = searchParams.get("token");
    const email = localStorage.getItem("pending_email")

    useEffect(() => {
        if (token) {
            activateEmail(token);
        } else {
            setStatus("error");
            setMessage("Ссылка для активации недействительна (токен отсутствует)");
        }
    }, [token]);

    async function activateEmail(t) {
        if (!t.trim()) return;

        setStatus("loading");
        setMessage("");

        try {
            const res = await fetch(ACTIVATE_URL, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({token: t}),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.detail || `Ошибка ${res.status}`);
            }

            const data = await res.json().catch(() => ({}));
            setMessage(data.message || "Почта успешно подтверждена!");
            setStatus("success");

            // Можно очистить временное хранилище
            localStorage.removeItem("pending_email");
        } catch (err) {
            setMessage(err.message || "Не удалось подтвердить почту");
            setStatus("error");
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Подтверждение email</h1>

                {email && (
                    <div className={styles.infoBox}>
                        Письмо с подтверждением отправлено на{" "}
                        <strong>{email}</strong>
                    </div>
                )}

                {status === "loading" && (
                    <div className={styles.loading}>Проверяем ссылку...</div>
                )}

                {status === "success" && (
                    <div className={styles.success}>
                        <div className={styles.icon}>✓</div>
                        <p>{message}</p>
                        <p className={styles.hint}>Теперь вы можете полноценно пользоваться аккаунтом</p>
                    </div>
                )}

                {status === "error" && (
                    <div className={styles.error}>
                        <div className={styles.icon}>!</div>
                        <p>{message}</p>
                    </div>
                )}

                <div className={styles.actions}>
                    {status !== "success" && token && (
                        <button
                            className={styles.btnPrimary}
                            onClick={() => activateEmail(token)}
                            disabled={status === "loading"}
                        >
                            {status === "loading" ? "Проверяем..." : "Повторить"}
                        </button>
                    )}

                    <button
                        className={styles.btnSecondary}
                        onClick={() => navigate("/")}
                    >
                        На главную
                    </button>
                </div>

                {status === "error" && (
                    <p className={styles.support}>
                        Если проблема не решается — напишите в поддержку
                    </p>
                )}
            </div>
        </div>
    );
}