import styles from "./footer.module.css";

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                © {year} Сбор статистики групп. Все права защищены.
            </div>
        </footer>
    );
};

export default Footer;