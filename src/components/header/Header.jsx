import {Link, useNavigate} from "react-router-dom";
import styles from "./header.module.css";
import {useEffect, useRef, useState} from "react";
import {sendForDebug} from "../../utils/utils.js";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_VERSION = import.meta.env.VITE_API_VERSION;

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleMenu = () => {
        setIsOpen(prev => !prev);
    };

    const navigate = useNavigate();

    const logout = async () => {
        const res = await fetch(`${BASE_URL}/${API_VERSION}/accounts/token/blacklist/`, {
            method: "POST" ,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh: localStorage.getItem("refresh_token") }),
        });
        if (res.ok) {
            localStorage.clear();
        }
        else if (res.status === 400) {
            const err = await res.text();
            await sendForDebug(err);
        }
        navigate("/login", { replace: true });
    }

    // Закрытие при клике вне области
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    return (
        <header className={styles.header}>
            <div className={styles.headerContent}>
                <Link to="/" className={styles.logo}>
                    SocialPulse
                </Link>

                <nav className={styles.navCenter}>
                    <Link to="/groups" className={styles.navLink}>
                        Все группы
                    </Link>
                    <Link to="/compare" className={styles.navLink}>
                        Сравнение
                    </Link>
                    <Link to="/reports" className={styles.navLink}>
                        Отчеты
                    </Link>
                </nav>

                <div className={styles.headerActions}>
                    <div
                        className={styles.profileDropdown}
                        ref={dropdownRef}
                    >
                        <button
                            className={styles.profileToggle}
                            onClick={toggleMenu}
                        >
                            👤
                        </button>

                        {isOpen && (
                            <div className={styles.dropdownMenu}>
                                <Link
                                    to="/profile"
                                    className={styles.dropdownItem}
                                    onClick={() => setIsOpen(false)}
                                >
                                    Профиль
                                </Link>

                                <button
                                    className={`${styles.dropdownItem} ${styles.logoutBtn}`}
                                    onClick={logout}
                                >
                                    Выйти
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;