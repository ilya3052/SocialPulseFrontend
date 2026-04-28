import {Link, useNavigate} from "react-router-dom";
import styles from "./headerAdmin.module.css";
import {logout} from "../../utils/utils.js";

const HeaderAdmin = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout(navigate);
        } catch (error) {
            console.error("Ошибка при выходе из аккаунта:", error);
            alert("Не удалось выйти из аккаунта. Попробуйте позже.");
        }
    };

    return (
        <header className={styles.header}>
            <div className={styles.headerContent}>
                <Link to="/" className={styles.logo}>
                    SocialPulse
                </Link>

                <nav className={styles.navCenter}>
                    <Link to="/admin_panel" className={styles.navLink}>
                        Сводная информация
                    </Link>
                    <Link to="admin_panel/service_accounts" className={styles.navLink}>
                        Сервисные аккаунты
                    </Link>
                </nav>

                <div className={styles.headerActions}>
                    <button
                        className={styles.logoutBtn}
                        onClick={handleLogout}
                        title="Выйти"
                    >
                        🚪
                    </button>
                </div>
            </div>
        </header>
    );
};

export default HeaderAdmin;

