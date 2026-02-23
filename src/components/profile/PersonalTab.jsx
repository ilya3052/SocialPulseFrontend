import styles from './profile.module.css';

const PersonalTab = () => {
    return (
        <div className={styles.tabContent}>
            <div className={styles.profileBlock}>
                <h3>Личные данные</h3>

                <div className={styles.formRow}>
                    <label>Имя</label>
                    <input type="text"/>
                </div>

                <div className={styles.formRow}>
                    <label>Фамилия</label>
                    <input type="text"/>
                </div>

                <div className={styles.formRow}>
                    <label>Юзернейм</label>
                    <input type="text"/>
                </div>

                <div className={styles.formRow}>
                    <label>Email</label>
                    <input type="email"/>
                </div>

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
            </div>

            <button className={styles.saveBtn}>Сохранить изменения</button>
        </div>
    );
};

export default PersonalTab;