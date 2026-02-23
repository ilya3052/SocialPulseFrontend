import styles from './profile.module.css';
import {useEffect, useState} from "react";
import {API_VERSION, BASE_URL} from "../../utils/utils.js";



const PersonalTab = () => {

    const [personalData, setPersonalData] = useState({
        first_name: "Иван",
        last_name: "Иванов",
        username: "иван",
        email: "mail@mail.ru",
    });

    // Копия данных для редактирования (чтобы можно было отменить изменения)
    const [editData, setEditData] = useState(personalData);

    // Режим редактирования
    const [isEditing, setIsEditing] = useState(false);

    // Синхронизируем editData при изменении исходных данных (на случай перезагрузки)
    useEffect(() => {
        setEditData(personalData);
    }, [personalData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Здесь будет запрос на сервер
        try {
            const res = await fetch(`${BASE_URL}/${API_VERSION}/accounts/users/me/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('access_token')}`,
                },
                body: JSON.stringify(editData),
            });

            if (res.status === 200) {
                setPersonalData(editData);
                setIsEditing(false);
            }
            else if (res.status === 401) {
                
            }

            // Успешно → обновляем отображаемые данные

        } catch (err) {
            console.error("Ошибка сохранения:", err);
            alert("Не удалось сохранить изменения");
            // можно откатить editData к personalData
        }
    };

    const handleCancel = () => {
        setEditData(personalData); // откатываем изменения
        setIsEditing(false);
    };

    return (
        <div className={styles.tabContent}>
            <div className={styles.profileBlock}>
                <div className={styles.blockHeader}>
                    <h3>Личные данные</h3>
                    {!isEditing ? (
                        <button
                            type="button"
                            className={styles.editBtn}
                            onClick={() => setIsEditing(true)}
                        >
                            Редактировать
                        </button>
                    ) : (
                        <div className={styles.editActions}>
                            <button
                                type="button"
                                className={styles.cancelBtn}
                                onClick={handleCancel}
                            >
                                Отмена
                            </button>
                            <button
                                type="submit"
                                form="personalForm"
                                className={styles.saveBtn}
                            >
                                Сохранить
                            </button>
                        </div>
                    )}
                </div>

                <form
                    id="personalForm"
                    onSubmit={handleSubmit}
                    className={styles.personalInfo}
                >
                    <div className={styles.formRow}>
                        <label>Имя</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="first_name"
                                value={editData.first_name}
                                onChange={handleChange}
                                autoFocus
                            />
                        ) : (
                            <span className={styles.viewValue}>{personalData.first_name || "—"}</span>
                        )}
                    </div>

                    <div className={styles.formRow}>
                        <label>Фамилия</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="last_name"
                                value={editData.last_name}
                                onChange={handleChange}
                            />
                        ) : (
                            <span className={styles.viewValue}>{personalData.last_name || "—"}</span>
                        )}
                    </div>

                    <div className={styles.formRow}>
                        <label>Юзернейм</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="username"
                                value={editData.username}
                                onChange={handleChange}
                            />
                        ) : (
                            <span className={styles.viewValue}>{personalData.username || "—"}</span>
                        )}
                    </div>

                    <div className={styles.formRow}>
                        <label>Email</label>
                        {isEditing ? (
                            <input
                                type="email"
                                name="email"
                                value={editData.email}
                                onChange={handleChange}
                            />
                        ) : (
                            <span className={styles.viewValue}>{personalData.email || "—"}</span>
                        )}
                    </div>
                </form>

                <div className={styles.platformStatus}>
                    <div>
                        <strong>TG:</strong>
                        <span>Иван Иванов (@ivan_tg)</span>
                        <button className={styles.unlinkBtn}>Отвязать</button>
                    </div>
                    <div>
                        <strong>VK:</strong>
                        <span>Не привязано</span>
                        <a href="#" className={styles.linkPlatform}>Привязать</a>
                    </div>
                </div>
            </div>

            {/* Блок смены пароля остаётся без изменений */}
            <div className={styles.profileBlock}>
                <h3>Смена пароля</h3>
                <div className={styles.formRow}>
                    <label>Старый пароль</label>
                    <input type="password" />
                </div>
                <div className={styles.formRow}>
                    <label>Новый пароль</label>
                    <input type="password" />
                </div>
                <div className={styles.formRow}>
                    <label>Подтверждение нового пароля</label>
                    <input type="password" />
                </div>
                <button className={styles.passwordSaveBtn}>Сменить пароль</button>
            </div>
        </div>
    );
};

export default PersonalTab;